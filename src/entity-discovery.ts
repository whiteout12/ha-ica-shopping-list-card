import type { HomeAssistant } from "./types";

export interface TodoEntityChoice {
  entity_id: string;
  name: string;
}

export function discoverTodoEntities(hass: HomeAssistant): TodoEntityChoice[] {
  return Object.values(hass.states)
    .filter((state) => state.entity_id.startsWith("todo."))
    .map((state) => ({
      entity_id: state.entity_id,
      name: String(state.attributes.friendly_name ?? state.entity_id),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function entityName(hass: HomeAssistant, entityId: string): string {
  return String(hass.states[entityId]?.attributes.friendly_name ?? entityId);
}
