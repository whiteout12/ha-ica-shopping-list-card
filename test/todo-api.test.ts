import { describe, expect, it, vi } from "vitest";
import {
  addItem,
  listItems,
  normalizeTodoItems,
  removeItem,
  subscribeItems,
  updateItem,
} from "../src/todo-api";
import type { HomeAssistant } from "../src/types";

const hass = (): HomeAssistant => ({
  states: {},
  callWS: vi.fn(),
  callService: vi.fn().mockResolvedValue(undefined),
});
describe("standard todo API adapter", () => {
  it("normalizes list and subscription responses in one place", () => {
    expect(
      normalizeTodoItems({ items: [{ uid: "one", summary: "Milk", status: "needs_action" }] }),
    ).toEqual([{ uid: "one", summary: "Milk", status: "needs_action" }]);
    expect(normalizeTodoItems({ items: "unexpected" })).toEqual([]);
    expect(normalizeTodoItems(undefined)).toEqual([]);
  });

  it("uses standard service routing and UIDs", async () => {
    const client = hass();
    await addItem(client, "todo.list", "Milk");
    await updateItem(client, "todo.list", "uid-1", { rename: "Oat milk" });
    await updateItem(client, "todo.list", "uid-1", { status: "completed" });
    await removeItem(client, "todo.list", "uid-1");
    expect(client.callService).toHaveBeenNthCalledWith(1, "todo", "add_item", {
      entity_id: "todo.list",
      item: "Milk",
    });
    expect(client.callService).toHaveBeenNthCalledWith(2, "todo", "update_item", {
      entity_id: "todo.list",
      item: "uid-1",
      rename: "Oat milk",
    });
    expect(client.callService).toHaveBeenNthCalledWith(3, "todo", "update_item", {
      entity_id: "todo.list",
      item: "uid-1",
      status: "completed",
    });
    expect(client.callService).toHaveBeenNthCalledWith(4, "todo", "remove_item", {
      entity_id: "todo.list",
      item: "uid-1",
    });
  });

  it("uses list and subscribe commands with normalized callback data", async () => {
    const callback = vi.fn();
    const unsubscribe = vi.fn();
    const client: HomeAssistant = {
      ...hass(),
      callWS: vi
        .fn()
        .mockResolvedValue({ items: [{ uid: "one", summary: "Milk", status: "needs_action" }] }),
      connection: {
        subscribeMessage: vi.fn().mockImplementation(async (handler) => {
          handler({ items: "bad" });
          return unsubscribe;
        }),
      },
    };
    await expect(listItems(client, "todo.list")).resolves.toHaveLength(1);
    await subscribeItems(client, "todo.list", callback);
    expect(client.callWS).toHaveBeenCalledWith({ type: "todo/item/list", entity_id: "todo.list" });
    expect(callback).toHaveBeenCalledWith([]);
    expect(client.connection?.subscribeMessage).toHaveBeenCalledWith(expect.any(Function), {
      type: "todo/item/subscribe",
      entity_id: "todo.list",
    });
  });
});
