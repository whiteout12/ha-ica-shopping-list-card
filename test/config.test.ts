import { describe, expect, it } from "vitest";
import { validateConfig } from "../src/config";
import { discoverTodoEntities } from "../src/entity-discovery";

describe("card configuration", () => {
  it("accepts unique todo entities and a contained default", () => {
    expect(
      validateConfig({
        type: "custom:ica-shopping-list-card",
        entities: ["todo.a", "todo.b"],
        default_entity: "todo.b",
        title: "Shop",
      }),
    ).toMatchObject({ entities: ["todo.a", "todo.b"], default_entity: "todo.b" });
  });
  it("rejects generic malformed, duplicated, and foreign default configuration", () => {
    expect(() => validateConfig({ entities: ["light.kitchen"] })).toThrow("todo");
    expect(() => validateConfig({ entities: ["todo.a", "todo.a"] })).toThrow("unique");
    expect(() => validateConfig({ entities: ["todo.a"], default_entity: "todo.b" })).toThrow(
      "default_entity",
    );
  });
  it("discovers generic todo entities for fallback mode", () => {
    expect(
      discoverTodoEntities({
        states: {
          "todo.a": { entity_id: "todo.a", state: "0", attributes: { friendly_name: "Alpha" } },
          "light.a": { entity_id: "light.a", state: "on", attributes: {} },
        },
        callService: async () => undefined,
        callWS: async <T>() => ({}) as T,
      }),
    ).toEqual([{ entity_id: "todo.a", name: "Alpha" }]);
  });
});
