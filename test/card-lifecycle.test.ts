import { describe, expect, it, vi } from "vitest";
import "../src/index";
import {
  TODO_FEATURE_CREATE,
  TODO_FEATURE_DELETE,
  TODO_FEATURE_UPDATE,
  type HomeAssistant,
} from "../src/types";

const tick = () => new Promise((resolve) => setTimeout(resolve));

function hass(): HomeAssistant {
  return {
    states: {
      "todo.ica": { entity_id: "todo.ica", state: "0", attributes: { friendly_name: "ICA" } },
    },
    callWS: vi.fn().mockResolvedValue({ items: [] }),
    callService: vi.fn(),
    connection: { subscribeMessage: vi.fn().mockResolvedValue(vi.fn()) },
  };
}

describe("Lovelace lifecycle and editor", () => {
  it("loads and subscribes when Home Assistant arrives after configuration, then restores after reconnect", async () => {
    const card = document.createElement("ica-shopping-list-card") as HTMLElement & {
      hass: HomeAssistant;
      setConfig(config: unknown): void;
    };
    document.body.append(card);
    card.setConfig({ type: "custom:ica-shopping-list-card", entities: ["todo.ica"] });
    const client = hass();
    card.hass = client;
    await tick();
    await tick();
    expect(client.callWS).toHaveBeenCalledWith({ type: "todo/item/list", entity_id: "todo.ica" });
    expect(client.connection?.subscribeMessage).toHaveBeenCalledWith(expect.any(Function), {
      type: "todo/item/subscribe",
      entity_id: "todo.ica",
    });
    card.remove();
    document.body.append(card);
    await tick();
    await tick();
    expect(client.connection?.subscribeMessage).toHaveBeenCalledTimes(2);
    card.remove();
  });

  it("registers the visual editor and round-trips value.entities without reference comparisons", async () => {
    const Card = customElements.get("ica-shopping-list-card") as typeof HTMLElement & {
      getConfigElement(): HTMLElement;
      getStubConfig(
        hass?: HomeAssistant,
        entities?: string[],
        entitiesFallback?: string[],
      ): unknown;
    };
    expect(Card.getConfigElement().tagName.toLowerCase()).toBe("ica-shopping-list-card-editor");
    expect(Card.getStubConfig(hass())).toEqual({
      type: "custom:ica-shopping-list-card",
      entities: ["todo.ica"],
    });
    expect(Card.getStubConfig({ ...hass(), states: {} })).toEqual({
      type: "custom:ica-shopping-list-card",
      entities: [],
    });
    expect(
      window.customCards?.find((entry) => entry.type === "ica-shopping-list-card"),
    ).toBeTruthy();

    const editor = document.createElement("ica-shopping-list-card-editor") as HTMLElement & {
      setConfig(config: unknown): void;
    };
    editor.setConfig({
      type: "custom:ica-shopping-list-card",
      entities: ["todo.a"],
      default_entity: "todo.a",
    });
    document.body.append(editor);
    await tick();
    const changed = vi.fn();
    editor.addEventListener("config-changed", changed);
    editor.shadowRoot?.querySelector("ha-form")?.dispatchEvent(
      new CustomEvent("value-changed", {
        detail: { value: { entities: ["todo.a"], title: "Shop" } },
      }),
    );
    expect(changed).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: {
          config: expect.objectContaining({
            entities: ["todo.a"],
            default_entity: "todo.a",
            title: "Shop",
          }),
        },
      }),
    );
    editor.remove();
  });

  it("refetches fallback list state only when the selected entity state changes", async () => {
    const card = document.createElement("ica-shopping-list-card") as HTMLElement & {
      hass: HomeAssistant;
      setConfig(config: unknown): void;
    };
    const client = hass();
    client.connection = undefined;
    document.body.append(card);
    card.setConfig({ type: "custom:ica-shopping-list-card", entities: ["todo.ica"] });
    card.hass = client;
    await tick();
    await tick();
    card.hass = { ...client };
    await tick();
    await tick();
    expect(client.callWS).toHaveBeenCalledTimes(1);
    card.hass = {
      ...client,
      states: {
        "todo.ica": {
          ...client.states["todo.ica"],
          state: "1",
          last_updated: "2026-08-20T12:00:00+00:00",
        },
      },
    };
    await tick();
    await tick();
    expect(client.callWS).toHaveBeenCalledTimes(2);
    card.remove();
  });

  it("gates generic create, update, and delete features independently", async () => {
    async function render(features: number) {
      const card = document.createElement("ica-shopping-list-card") as HTMLElement & {
        hass: HomeAssistant;
        setConfig(config: unknown): void;
      };
      const client = hass();
      client.callWS = vi
        .fn()
        .mockResolvedValue({ items: [{ uid: "milk", summary: "Milk", status: "needs_action" }] });
      client.states["todo.ica"] = {
        ...client.states["todo.ica"],
        attributes: { friendly_name: "ICA", supported_features: features },
      };
      document.body.append(card);
      card.setConfig({ type: "custom:ica-shopping-list-card", entities: ["todo.ica"] });
      card.hass = client;
      await tick();
      await tick();
      return card;
    }
    const createOnly = await render(TODO_FEATURE_CREATE);
    const createInput = createOnly.shadowRoot?.querySelector<HTMLInputElement>("#quick-input");
    if (!createInput) throw new Error("quick input did not render");
    createInput.value = "Milk";
    createInput.dispatchEvent(new Event("input", { bubbles: true }));
    await tick();
    expect(createOnly.shadowRoot?.querySelector("button.add")?.hasAttribute("disabled")).toBe(
      false,
    );
    expect(
      createOnly.shadowRoot?.querySelector(".check, [aria-label^=Edit], [aria-label^=Delete]"),
    ).toBeNull();
    createOnly.remove();

    const updateOnly = await render(TODO_FEATURE_UPDATE);
    expect(updateOnly.shadowRoot?.querySelector("button.add")?.hasAttribute("disabled")).toBe(true);
    expect(updateOnly.shadowRoot?.querySelector(".check")).not.toBeNull();
    expect(updateOnly.shadowRoot?.querySelector('[aria-label^="Delete"]')).toBeNull();
    updateOnly.remove();

    const deleteOnly = await render(TODO_FEATURE_DELETE);
    expect(deleteOnly.shadowRoot?.querySelector("button.add")?.hasAttribute("disabled")).toBe(true);
    expect(deleteOnly.shadowRoot?.querySelector(".check")).toBeNull();
    expect(deleteOnly.shadowRoot?.querySelector('[aria-label^="Delete"]')).not.toBeNull();
    deleteOnly.remove();
  });
});
