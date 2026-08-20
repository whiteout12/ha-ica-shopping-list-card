import type { CardConfig } from "./types";

export function validateConfig(config: unknown): CardConfig {
  if (!config || typeof config !== "object") throw new Error("Card configuration is required");
  const value = config as Partial<CardConfig>;
  if (!Array.isArray(value.entities) || value.entities.length === 0) {
    throw new Error("entities must contain at least one todo entity");
  }
  const entities = value.entities.map((entity) => {
    if (typeof entity !== "string" || !entity.startsWith("todo.")) {
      throw new Error("entities must contain only todo entities");
    }
    return entity;
  });
  if (new Set(entities).size !== entities.length) throw new Error("entities must be unique");
  if (value.default_entity && !entities.includes(value.default_entity)) {
    throw new Error("default_entity must be one of entities");
  }
  if (value.title !== undefined && (typeof value.title !== "string" || !value.title.trim())) {
    throw new Error("title must be a non-empty string");
  }
  return {
    type: "custom:ica-shopping-list-card",
    entities,
    ...(value.default_entity ? { default_entity: value.default_entity } : {}),
    ...(value.title ? { title: value.title } : {}),
  };
}
