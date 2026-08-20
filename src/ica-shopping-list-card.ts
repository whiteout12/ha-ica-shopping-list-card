import { LitElement, html, nothing, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { AutocompleteController, normalizeQuery } from "./autocomplete-controller";
import { validateConfig } from "./config";
import { entityName } from "./entity-discovery";
import { localize } from "./localize";
import { cardStyles } from "./styles";
import { addItem, listItems, removeItem, subscribeItems, updateItem } from "./todo-api";
import {
  TODO_FEATURE_CREATE,
  TODO_FEATURE_DELETE,
  TODO_FEATURE_UPDATE,
  type CardConfig,
  type HomeAssistant,
  type TodoItem,
} from "./types";

@customElement("ica-shopping-list-card")
export class IcaShoppingListCard extends LitElement {
  static styles = cardStyles;

  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() private config?: CardConfig;
  @state() private selectedEntity = "";
  @state() private items: TodoItem[] = [];
  @state() private input = "";
  @state() private listError = false;
  @state() private crudError = false;
  @state() private editing?: TodoItem;
  @state() private deleting?: TodoItem;

  private controller = new AutocompleteController(() => this.requestUpdate());
  private unsubscribe?: () => void;
  private loadedEntity?: string;
  private subscribedEntity?: string;
  private lifecycleGeneration = 0;
  private stateRefetchFallback = false;

  public static getConfigElement(): HTMLElement {
    return document.createElement("ica-shopping-list-card-editor");
  }

  public static getStubConfig(
    hass?: HomeAssistant,
    entities?: string[],
    entitiesFallback?: string[],
  ): CardConfig {
    const discovered = Object.keys(hass?.states ?? {}).filter((entity) =>
      entity.startsWith("todo."),
    );
    const entity = [...(entities ?? []), ...(entitiesFallback ?? []), ...discovered].find(
      (candidate) => candidate.startsWith("todo."),
    );
    return { type: "custom:ica-shopping-list-card", entities: entity ? [entity] : [] };
  }

  public setConfig(config: CardConfig): void {
    this.config = validateConfig(config);
    const entity = this.config.entities.includes(this.selectedEntity)
      ? this.selectedEntity
      : (this.config.default_entity ?? this.config.entities[0]);
    this.resetTransientState();
    this.selectedEntity = entity;
    void this.ensureLoaded(true);
  }

  public getCardSize(): number {
    return 5;
  }

  public connectedCallback(): void {
    super.connectedCallback();
    void this.ensureLoaded();
  }

  public disconnectedCallback(): void {
    this.disposeEntity();
    this.controller.disconnect();
    super.disconnectedCallback();
  }

  protected updated(changed: Map<string, unknown>): void {
    if (!changed.has("hass") || !this.hass || !this.config) return;
    if (!this.loadedEntity) {
      void this.ensureLoaded();
    } else if (
      this.stateRefetchFallback &&
      this.selectedEntityChanged(changed.get("hass") as HomeAssistant | undefined)
    ) {
      void this.refresh();
    }
  }

  private t(key: Parameters<typeof localize>[1]): string {
    return localize(this.hass?.language, key);
  }

  private desiredEntity(): string | undefined {
    if (!this.config) return undefined;
    return this.config.entities.includes(this.selectedEntity)
      ? this.selectedEntity
      : (this.config.default_entity ?? this.config.entities[0]);
  }

  private selectedEntityChanged(previous?: HomeAssistant): boolean {
    const current = this.hass?.states[this.selectedEntity];
    const before = previous?.states[this.selectedEntity];
    return (
      current?.state !== before?.state ||
      current?.last_changed !== before?.last_changed ||
      current?.last_updated !== before?.last_updated
    );
  }

  private async ensureLoaded(force = false): Promise<void> {
    const entity = this.desiredEntity();
    if (!this.isConnected || !this.hass || !entity) return;
    if (!force && this.loadedEntity === entity && this.subscribedEntity === entity) return;
    await this.activateEntity(entity);
  }

  private async activateEntity(entityId: string): Promise<void> {
    if (!this.isConnected || !this.hass || !entityId) return;
    const generation = ++this.lifecycleGeneration;
    this.unsubscribe?.();
    this.unsubscribe = undefined;
    this.loadedEntity = entityId;
    this.subscribedEntity = undefined;
    this.stateRefetchFallback = false;
    this.selectedEntity = entityId;
    this.items = [];
    this.listError = false;
    this.resetTransientState();

    await this.refresh(entityId, generation);
    if (!this.isCurrent(entityId, generation) || !this.hass) return;

    try {
      const unsubscribe = await subscribeItems(this.hass, entityId, (items) => {
        if (!this.isCurrent(entityId, generation)) return;
        this.items = items;
        this.listError = false;
      });
      if (!this.isCurrent(entityId, generation)) {
        unsubscribe?.();
        return;
      }
      if (unsubscribe) {
        this.unsubscribe = unsubscribe;
        this.subscribedEntity = entityId;
      } else {
        this.stateRefetchFallback = true;
      }
    } catch {
      if (this.isCurrent(entityId, generation)) this.stateRefetchFallback = true;
    }
  }

  private disposeEntity(): void {
    this.lifecycleGeneration += 1;
    this.unsubscribe?.();
    this.unsubscribe = undefined;
    this.loadedEntity = undefined;
    this.subscribedEntity = undefined;
    this.stateRefetchFallback = false;
  }

  private isCurrent(entityId: string, generation: number): boolean {
    return (
      this.isConnected &&
      this.lifecycleGeneration === generation &&
      this.loadedEntity === entityId &&
      this.selectedEntity === entityId
    );
  }

  private async switchEntity(entityId: string): Promise<void> {
    if (!this.config?.entities.includes(entityId) || entityId === this.selectedEntity) return;
    await this.activateEntity(entityId);
  }

  private async refresh(
    entityId = this.selectedEntity,
    generation = this.lifecycleGeneration,
  ): Promise<void> {
    if (!this.hass || !entityId) return;
    try {
      const items = await listItems(this.hass, entityId);
      if (!this.isCurrent(entityId, generation)) return;
      this.items = items;
      this.listError = false;
    } catch {
      if (this.isCurrent(entityId, generation)) this.listError = true;
    }
  }

  private resetTransientState(): void {
    this.input = "";
    this.editing = undefined;
    this.deleting = undefined;
    this.crudError = false;
    this.controller.disconnect();
  }

  private onInput(event: Event): void {
    this.input = normalizeQuery((event.target as HTMLInputElement).value);
    this.crudError = false;
    if (this.hass && this.selectedEntity)
      this.controller.input(this.hass, this.selectedEntity, this.input);
  }

  private onKeydown(event: KeyboardEvent): void {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      this.controller.move(1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      this.controller.move(-1);
    } else if (event.key === "Escape") {
      this.controller.dismiss();
    } else if (
      event.key === "Enter" &&
      this.controller.activeIndex >= 0 &&
      this.controller.suggestions.length
    ) {
      event.preventDefault();
      this.choose(this.controller.activeIndex);
    }
  }

  private choose(index: number): void {
    const selected = this.controller.select(index);
    if (selected) this.input = normalizeQuery(selected.text);
  }

  private deselect(): void {
    this.controller.deselect();
  }

  private async add(): Promise<void> {
    const text = normalizeQuery(this.input);
    if (
      !this.hass ||
      !this.selectedEntity ||
      !text ||
      this.controller.pendingAdd ||
      !this.supports(TODO_FEATURE_CREATE)
    )
      return;
    this.crudError = false;
    if (this.controller.selected) {
      const success = await this.controller.submitSelected(this.hass, this.selectedEntity, text);
      if (!success) return;
    } else {
      try {
        await addItem(this.hass, this.selectedEntity, text);
      } catch {
        this.crudError = true;
        return;
      }
    }
    this.input = "";
    this.controller.dismiss();
    await this.refresh();
    this.updateComplete.then(() =>
      this.renderRoot.querySelector<HTMLInputElement>("#quick-input")?.focus(),
    );
  }

  private async toggle(item: TodoItem): Promise<void> {
    if (!this.hass) return;
    this.crudError = false;
    try {
      await updateItem(this.hass, this.selectedEntity, item.uid, {
        status: item.status === "completed" ? "needs_action" : "completed",
      });
      await this.refresh();
    } catch {
      this.crudError = true;
    }
  }

  private askDelete(item: TodoItem): void {
    this.deleting = item;
  }

  private async deleteItem(): Promise<void> {
    const item = this.deleting;
    if (!this.hass || !item) return;
    this.crudError = false;
    try {
      await removeItem(this.hass, this.selectedEntity, item.uid);
      this.deleting = undefined;
      await this.refresh();
    } catch {
      this.crudError = true;
    }
  }

  private async saveEdit(event: Event): Promise<void> {
    event.preventDefault();
    const rename = normalizeQuery(
      String(new FormData(event.target as HTMLFormElement).get("rename") ?? ""),
    );
    if (!this.hass || !this.editing || !rename) return;
    this.crudError = false;
    try {
      await updateItem(this.hass, this.selectedEntity, this.editing.uid, { rename });
      this.editing = undefined;
      await this.refresh();
    } catch {
      this.crudError = true;
    }
  }

  private supports(feature: number): boolean {
    const features = this.hass?.states[this.selectedEntity]?.attributes.supported_features;
    return typeof features !== "number" || (features & feature) === feature;
  }

  private message(): TemplateResult | typeof nothing {
    const state = this.controller.state;
    if (state === "fallback") return html`<div class="message">${this.t("fallback")}</div>`;
    if (state === "expired")
      return html`<div class="message error" role="alert">${this.t("expired")}</div>`;
    if (state === "auth_required")
      return html`<div class="message error" role="alert">${this.t("auth")}</div>`;
    if (state === "unauthorized")
      return html`<div class="message error" role="alert">${this.t("unauthorized")}</div>`;
    if (state === "uncertain")
      return html`<div class="message error" role="alert">${this.t("uncertain")}</div>`;
    return nothing;
  }

  private suggestions(): TemplateResult | typeof nothing {
    if (this.controller.state === "loading")
      return html`<div class="popup" role="status">${this.t("searching")}</div>`;
    if (this.controller.state === "empty")
      return html`<div class="popup" role="status">${this.t("noSuggestions")}</div>`;
    if (this.controller.state !== "results") return nothing;
    return html`<div class="popup">
      <div id="ica-suggestions" role="listbox" aria-label=${this.t("suggestions")}>
        ${this.controller.suggestions.map(
          (suggestion, index) =>
            html`<button
              id="ica-option-${index}"
              class="option ${this.controller.activeIndex === index ? "active" : ""}"
              role="option"
              tabindex="-1"
              aria-selected=${this.controller.activeIndex === index}
              @mousedown=${(event: Event) => event.preventDefault()}
              @click=${() => this.choose(index)}
            >
              <span class="option-primary">${suggestion.primary}</span
              >${suggestion.secondary ? html`<span class="option-secondary">${suggestion.secondary}</span>` : nothing}
            </button>`,
        )}
      </div>
    </div>`;
  }

  private itemRow(item: TodoItem): TemplateResult {
    if (this.editing?.uid === item.uid)
      return html`<div class="row">
        <form class="edit-form" @submit=${this.saveEdit}>
          <label class="sr-only" for="edit-${item.uid}">${this.t("edit")}</label>
          <input id="edit-${item.uid}" name="rename" .value=${item.summary} />
          <button type="submit">${this.t("save")}</button>
          <button
            type="button"
            @click=${() => {
              this.editing = undefined;
            }}
          >
            ${this.t("cancel")}
          </button>
        </form>
      </div>`;
    const complete = item.status === "completed";
    const canUpdate = this.supports(TODO_FEATURE_UPDATE);
    const canDelete = this.supports(TODO_FEATURE_DELETE);
    return html`<div class="row ${complete ? "completed" : ""}">
      ${canUpdate ? html`<button class="check" aria-label=${`${complete ? this.t("uncheck") : this.t("check")} ${item.summary}`} @click=${() => this.toggle(item)}>${complete ? "☑" : "☐"}</button>` : nothing}
      <span class="summary">${item.summary}</span>
      ${
        canUpdate
          ? html`<button
              class="icon"
              aria-label="${this.t("edit")} ${item.summary}"
              @click=${() => {
                this.editing = item;
              }}
            >
              ✎
            </button>`
          : nothing
      }
      ${canDelete ? html`<button class="icon" aria-label="${this.t("delete")} ${item.summary}" @click=${() => this.askDelete(item)}>×</button>` : nothing}
    </div>`;
  }

  protected render(): TemplateResult {
    if (!this.config)
      return html`<ha-card
        ><div class="status">Configure this card with todo entities.</div></ha-card
      >`;
    const active = this.items.filter((item) => item.status !== "completed");
    const completed = this.items.filter((item) => item.status === "completed");
    const unavailable = !this.hass?.states[this.selectedEntity];
    const canCreate = this.supports(TODO_FEATURE_CREATE);
    const state = this.controller.state;
    const currentName = this.hass
      ? entityName(this.hass, this.selectedEntity)
      : this.selectedEntity;
    const canDeselect =
      Boolean(this.controller.selected) ||
      ["expired", "uncertain", "auth_required", "unauthorized"].includes(state);
    return html`<ha-card>
      <div class="accent"></div>
      <header>
        <div class="brand" aria-hidden="true">▣</div>
        <div class="head-copy">
          <h2>${this.config.title ?? this.t("toBuy")}</h2>
          <div class="eyebrow">${currentName}</div>
        </div>
        <button class="icon" aria-label=${this.t("retry")} @click=${() => this.refresh()}>↻</button>
      </header>
      ${
        this.config.entities.length > 1
          ? html`<div class="picker-wrap">
              <label class="sr-only" for="entity-picker">Shopping list</label
              ><select
                id="entity-picker"
                .value=${this.selectedEntity}
                @change=${(event: Event) => this.switchEntity((event.target as HTMLSelectElement).value)}
              >
                ${this.config.entities.map((entity) => html`<option value=${entity}>${this.hass ? entityName(this.hass, entity) : entity}</option>`)}
              </select>
            </div>`
          : nothing
      }
      <div class="typeahead">
        <form
          @submit=${(event: Event) => {
            event.preventDefault();
            void this.add();
          }}
        >
          <label class="sr-only" for="quick-input">${this.t("addItem")}</label
          ><input
            id="quick-input"
            .value=${this.input}
            placeholder=${this.t("addItem")}
            role="combobox"
            aria-autocomplete="list"
            aria-controls=${state === "results" ? "ica-suggestions" : nothing}
            aria-expanded=${state === "results"}
            aria-activedescendant=${this.controller.activeIndex >= 0 ? `ica-option-${this.controller.activeIndex}` : nothing}
            ?readonly=${this.controller.pendingAdd}
            aria-busy=${this.controller.pendingAdd}
            @input=${this.onInput}
            @keydown=${this.onKeydown}
          /><button
            class="add"
            type="submit"
            ?disabled=${!canCreate || !this.input.trim() || this.controller.pendingAdd || state === "expired" || state === "auth_required" || state === "unauthorized" || state === "uncertain"}
          >
            ${this.controller.pendingAdd ? "…" : this.t("add")}
          </button>
        </form>
        ${this.suggestions()}${this.message()}${canDeselect ? html`<button class="deselect" type="button" @click=${this.deselect}>${this.t("deselect")}</button>` : nothing}${
          this.deleting
            ? html`<div class="message error" role="alert">
                ${this.t("confirmDelete")}
                <button type="button" @click=${() => void this.deleteItem()}>
                  ${this.t("confirm")}</button
                ><button
                  type="button"
                  @click=${() => {
                    this.deleting = undefined;
                  }}
                >
                  ${this.t("cancel")}
                </button>
              </div>`
            : nothing
        }${this.crudError ? html`<div class="message error" role="alert">${this.t("crudError")}</div>` : nothing}
      </div>
      ${
        unavailable
          ? html`<div class="status">${this.t("unavailable")}</div>`
          : this.listError
            ? html`<div class="status">
                ${this.t("unavailable")}
                <button @click=${() => this.refresh()}>${this.t("retry")}</button>
              </div>`
            : html`<section class="section">
                  <div class="section-heading">
                    <span>${this.t("toBuy")}</span><span>${active.length}</span>
                  </div>
                  ${active.length ? active.map((item) => this.itemRow(item)) : html`<div class="empty">${this.t("empty")}</div>`}
                </section>
                ${
                  completed.length
                    ? html`<section class="section">
                        <div class="section-heading">
                          <span>${this.t("completed")}</span><span>${completed.length}</span>
                        </div>
                        ${completed.map((item) => this.itemRow(item))}
                      </section>`
                    : nothing
                }`
      }
    </ha-card>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ica-shopping-list-card": IcaShoppingListCard;
  }
}
