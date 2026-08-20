import type { HomeAssistant, TodoItem, TodoListResponse } from "./types";

export function normalizeTodoItems(response: unknown): TodoItem[] {
  return typeof response === "object" &&
    response !== null &&
    Array.isArray((response as TodoListResponse).items)
    ? (response as TodoListResponse).items
    : [];
}

export async function listItems(hass: HomeAssistant, entityId: string): Promise<TodoItem[]> {
  const response = await hass.callWS<TodoListResponse>({
    type: "todo/item/list",
    entity_id: entityId,
  });
  return normalizeTodoItems(response);
}

export async function subscribeItems(
  hass: HomeAssistant,
  entityId: string,
  callback: (items: TodoItem[]) => void,
): Promise<(() => void) | undefined> {
  if (!hass.connection?.subscribeMessage) return undefined;
  return hass.connection.subscribeMessage<TodoListResponse>(
    (response) => callback(normalizeTodoItems(response)),
    { type: "todo/item/subscribe", entity_id: entityId },
  );
}

export function addItem(hass: HomeAssistant, entityId: string, item: string): Promise<unknown> {
  return hass.callService("todo", "add_item", { entity_id: entityId, item });
}

export function updateItem(
  hass: HomeAssistant,
  entityId: string,
  uid: string,
  changes: { rename?: string; status?: TodoItem["status"] },
): Promise<unknown> {
  return hass.callService("todo", "update_item", { entity_id: entityId, item: uid, ...changes });
}

export function removeItem(hass: HomeAssistant, entityId: string, uid: string): Promise<unknown> {
  return hass.callService("todo", "remove_item", { entity_id: entityId, item: uid });
}
