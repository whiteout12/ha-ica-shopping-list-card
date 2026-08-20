import { addSuggestion, fetchSuggestions } from "./ica-suggestions-api";
import {
  getSuggestionErrorCode,
  type HomeAssistant,
  type Suggestion,
  type SuggestionErrorCode,
} from "./types";

export type AutocompleteState =
  | "idle"
  | "loading"
  | "results"
  | "empty"
  | "fallback"
  | "expired"
  | "auth_required"
  | "unauthorized"
  | "uncertain";

export class AutocompleteController {
  public state: AutocompleteState = "idle";
  public suggestions: Suggestion[] = [];
  public activeIndex = -1;
  public selected?: Suggestion;
  public selectionExpiresAt = 0;
  public pendingAdd = false;
  public message?: SuggestionErrorCode;
  private generation = 0;
  private timer?: ReturnType<typeof setTimeout>;
  private cooldownUntil = 0;
  private readonly disabledEntities = new Set<string>();
  private readonly blockedUntil = new Map<string, number>();

  constructor(
    private readonly onChange: () => void,
    private readonly now = () => Date.now(),
  ) {}

  input(hass: HomeAssistant, entityId: string, value: string): void {
    this.reset();
    const query = normalizeQuery(value);
    if (
      query.length < 3 ||
      this.disabledEntities.has(entityId) ||
      this.now() < this.cooldownUntil ||
      this.now() < (this.blockedUntil.get(entityId) ?? 0)
    ) {
      this.state = "idle";
      this.onChange();
      return;
    }
    const requestGeneration = this.generation;
    this.state = "loading";
    this.onChange();
    this.timer = setTimeout(async () => {
      try {
        const response = await fetchSuggestions(hass, entityId, query, 8);
        if (requestGeneration !== this.generation) return;
        this.suggestions = response.suggestions;
        this.state = response.suggestions.length ? "results" : "empty";
        this.activeIndex = -1;
      } catch (error) {
        if (requestGeneration !== this.generation) return;
        const code = getSuggestionErrorCode(error);
        if (code === "unsupported_entity" || code === "unsupported_contract") {
          this.disabledEntities.add(entityId);
          this.state = "idle";
          this.onChange();
          return;
        }
        if (code === "auth_required" || code === "unauthorized") {
          this.blockedUntil.set(entityId, this.now() + 5 * 60_000);
          this.state = "idle";
          this.onChange();
          return;
        }
        this.message = code;
        this.state = "fallback";
        if (code === "rate_limited" || code === "unavailable")
          this.cooldownUntil = this.now() + 5_000;
      }
      this.onChange();
    }, 300);
  }

  select(index: number): Suggestion | undefined {
    const selection = this.suggestions[index];
    if (!selection) return undefined;
    this.selected = selection;
    this.selectionExpiresAt = this.now() + 5 * 60_000;
    this.suggestions = [];
    this.activeIndex = -1;
    this.state = "idle";
    this.message = undefined;
    this.onChange();
    return selection;
  }

  move(delta: number): void {
    if (!this.suggestions.length) return;
    this.activeIndex =
      this.activeIndex === -1
        ? delta > 0
          ? 0
          : this.suggestions.length - 1
        : (this.activeIndex + delta + this.suggestions.length) % this.suggestions.length;
    this.onChange();
  }

  dismiss(): void {
    this.generation += 1;
    clearTimeout(this.timer);
    this.suggestions = [];
    this.activeIndex = -1;
    if (this.state === "results" || this.state === "loading" || this.state === "empty")
      this.state = "idle";
    this.onChange();
  }

  expireSelection(): boolean {
    if (this.selected && this.now() >= this.selectionExpiresAt) {
      this.state = "expired";
      this.message = "expired_selection";
      this.onChange();
      return true;
    }
    return false;
  }

  async submitSelected(hass: HomeAssistant, entityId: string, text: string): Promise<boolean> {
    if (!this.selected || this.expireSelection() || this.pendingAdd) return false;
    this.pendingAdd = true;
    this.message = undefined;
    this.onChange();
    try {
      await addSuggestion(hass, entityId, this.selected.selection_key, text);
      this.selected = undefined;
      this.selectionExpiresAt = 0;
      this.state = "idle";
      return true;
    } catch (error) {
      const code = getSuggestionErrorCode(error);
      this.message = code;
      this.state =
        code === "auth_required"
          ? "auth_required"
          : code === "unauthorized"
            ? "unauthorized"
            : code === "expired_selection" || code === "invalid_selection"
              ? "expired"
              : "uncertain";
      if (code === "auth_required" || code === "unauthorized") {
        this.blockedUntil.set(entityId, this.now() + 5 * 60_000);
      }
      return false;
    } finally {
      this.pendingAdd = false;
      this.onChange();
    }
  }

  disconnect(): void {
    this.reset();
    this.onChange();
  }

  deselect(): void {
    this.reset();
    this.onChange();
  }

  private reset(): void {
    this.generation += 1;
    clearTimeout(this.timer);
    this.selected = undefined;
    this.suggestions = [];
    this.activeIndex = -1;
    this.selectionExpiresAt = 0;
    this.message = undefined;
    this.state = "idle";
    this.pendingAdd = false;
  }
}

export function normalizeQuery(value: string): string {
  return value.replace(/\s+/gu, " ").trim().slice(0, 80);
}
