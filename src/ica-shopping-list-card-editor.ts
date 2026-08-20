import { LitElement, html, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { discoverTodoEntities } from "./entity-discovery";
import type { CardConfig, HomeAssistant } from "./types";

function sameEntities(left: string[], right: string[]): boolean {
  return left.length === right.length && left.every((entity, index) => entity === right[index]);
}

@customElement("ica-shopping-list-card-editor")
export class IcaShoppingListCardEditor extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() private config: CardConfig = {
    type: "custom:ica-shopping-list-card",
    entities: [],
  };

  public setConfig(config: CardConfig): void {
    this.config = { ...config, entities: [...config.entities] };
  }

  private emit(config: CardConfig): void {
    this.config = config;
    this.dispatchEvent(
      new CustomEvent("config-changed", { detail: { config }, bubbles: true, composed: true }),
    );
  }

  private onValueChanged(event: CustomEvent<{ value?: Partial<CardConfig> }>): void {
    const value = event.detail.value ?? {};
    const entities = Array.isArray(value.entities)
      ? value.entities.filter((entity): entity is string => typeof entity === "string")
      : this.config.entities;
    const entitiesChanged = !sameEntities(entities, this.config.entities);
    const defaultEntity = entities.includes(
      value.default_entity ?? this.config.default_entity ?? "",
    )
      ? (value.default_entity ?? this.config.default_entity)
      : entities[0];
    this.emit({
      ...this.config,
      ...value,
      type: "custom:ica-shopping-list-card",
      entities,
      ...(entitiesChanged || defaultEntity ? { default_entity: defaultEntity } : {}),
    });
  }

  protected render(): TemplateResult {
    const choices = this.hass ? discoverTodoEntities(this.hass) : [];
    const entities = this.config.entities;
    return html`<div class="card-config">
      <ha-form
        .hass=${this.hass}
        .data=${this.config}
        .schema=${[
          { name: "title", selector: { text: {} } },
          {
            name: "entities",
            required: true,
            selector: { entity: { domain: "todo", multiple: true } },
          },
          {
            name: "default_entity",
            selector: {
              select: {
                mode: "dropdown",
                options: choices
                  .filter((choice) => entities.includes(choice.entity_id))
                  .map((choice) => ({ value: choice.entity_id, label: choice.name })),
              },
            },
          },
        ]}
        @value-changed=${this.onValueChanged}
      ></ha-form>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ica-shopping-list-card-editor": IcaShoppingListCardEditor;
  }
}
