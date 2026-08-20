import {
  TODO_FEATURE_CREATE,
  TODO_FEATURE_DELETE,
  TODO_FEATURE_UPDATE,
  type HomeAssistant,
  type TodoItem,
} from "../src/types";

type FixtureMode = "success" | "pending" | "expired_selection" | "auth_required" | "failed";
declare global {
  interface Window {
    fixtureMode?: FixtureMode;
  }
}

const lists: Record<string, TodoItem[]> = {
  "todo.ica_weekly_shop": [
    { uid: "milk", summary: "Oat milk", status: "needs_action" },
    { uid: "coffee", summary: "Coffee", status: "needs_action" },
  ],
  "todo.shopping_list": [{ uid: "tea", summary: "Tea", status: "needs_action" }],
};
const hass: HomeAssistant = {
  language: "en",
  states: {
    "todo.ica_weekly_shop": {
      entity_id: "todo.ica_weekly_shop",
      state: "2",
      attributes: {
        friendly_name: "Weekly shop",
        supported_features: TODO_FEATURE_CREATE | TODO_FEATURE_UPDATE | TODO_FEATURE_DELETE,
      },
    },
    "todo.shopping_list": {
      entity_id: "todo.shopping_list",
      state: "1",
      attributes: {
        friendly_name: "Household",
        supported_features: TODO_FEATURE_CREATE | TODO_FEATURE_UPDATE | TODO_FEATURE_DELETE,
      },
    },
  },
  async callWS<T>(message: Record<string, unknown>): Promise<T> {
    if (message.type === "todo/item/list")
      return { items: lists[String(message.entity_id)] ?? [] } as T;
    if (message.type === "ica_shopping_list/suggestions")
      return {
        contract_version: 1,
        entity_id: message.entity_id,
        query: message.query,
        add_strategy: "ica_add_suggestion",
        suggestions: [
          {
            selection_key: "opaque-one",
            text: "Långkornigt ris",
            primary: "Långkornigt ris",
            secondary: "Ris",
          },
          {
            selection_key: "opaque-two",
            text: "Långkornigt ris",
            primary: "Långkornigt ris",
            secondary: "Basvaror",
          },
        ],
      } as T;
    if (message.type === "ica_shopping_list/add_suggestion") {
      if (window.fixtureMode === "pending") return new Promise<T>(() => undefined);
      if (window.fixtureMode === "expired_selection") throw { code: "invalid_selection" };
      if (window.fixtureMode === "auth_required") throw { code: "auth_required" };
      if (window.fixtureMode === "failed") throw { code: "failed" };
      lists[String(message.entity_id)].push({
        uid: crypto.randomUUID(),
        summary: String(message.text),
        status: "needs_action",
      });
    }
    return {} as T;
  },
  async callService(_domain, service, data) {
    const list = lists[String(data?.entity_id)] ?? [];
    if (service === "add_item")
      list.push({ uid: crypto.randomUUID(), summary: String(data?.item), status: "needs_action" });
    if (service === "update_item") {
      const item = list.find((candidate) => candidate.uid === data?.item);
      if (item && typeof data?.rename === "string") item.summary = data.rename;
      if (item && (data?.status === "completed" || data?.status === "needs_action"))
        item.status = data.status;
    }
    if (service === "remove_item") {
      const index = list.findIndex((candidate) => candidate.uid === data?.item);
      if (index >= 0) list.splice(index, 1);
    }
  },
};
const card = document.querySelector("ica-shopping-list-card")!;
card.setConfig({
  type: "custom:ica-shopping-list-card",
  title: "Shopping list",
  entities: ["todo.ica_weekly_shop", "todo.shopping_list"],
  default_entity: "todo.ica_weekly_shop",
});
card.hass = hass;
