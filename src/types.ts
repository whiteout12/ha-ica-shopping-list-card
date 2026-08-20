export interface HomeAssistant {
  states: Record<string, HassEntity>;
  callService(domain: string, service: string, data?: Record<string, unknown>): Promise<unknown>;
  callWS<T>(message: Record<string, unknown>): Promise<T>;
  connection?: {
    subscribeMessage?<T>(
      callback: (message: T) => void,
      message: Record<string, unknown>,
    ): Promise<() => void>;
  };
  language?: string;
}

declare global {
  interface Window {
    customCards?: Array<{ type: string; name: string; description: string }>;
  }
}

export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: Record<string, unknown>;
  last_changed?: string;
  last_updated?: string;
}

export const TODO_FEATURE_CREATE = 1;
export const TODO_FEATURE_DELETE = 2;
export const TODO_FEATURE_UPDATE = 4;

export interface TodoItem {
  uid: string;
  summary: string;
  status: "needs_action" | "completed";
}

export interface TodoListResponse {
  items: TodoItem[];
}

export interface CardConfig {
  type: "custom:ica-shopping-list-card";
  entities: string[];
  default_entity?: string;
  title?: string;
}

export interface Suggestion {
  selection_key: string;
  text: string;
  primary: string;
  secondary?: string;
}

export interface SuggestionsResponse {
  contract_version: number;
  integration_version?: string;
  entity_id: string;
  query: string;
  add_strategy: "ica_add_suggestion";
  suggestions: Suggestion[];
}

export const SUGGESTION_ERROR_CODES = [
  "unsupported_contract",
  "unsupported_entity",
  "invalid_query",
  "invalid_selection",
  "expired_selection",
  "auth_required",
  "unauthorized",
  "rate_limited",
  "unavailable",
  "failed",
] as const;

export type SuggestionErrorCode = (typeof SUGGESTION_ERROR_CODES)[number];

export function isSuggestionErrorCode(value: unknown): value is SuggestionErrorCode {
  return typeof value === "string" && (SUGGESTION_ERROR_CODES as readonly string[]).includes(value);
}

export function getSuggestionErrorCode(error: unknown): SuggestionErrorCode {
  const code =
    typeof error === "object" && error && "code" in error
      ? (error as { code?: unknown }).code
      : undefined;
  if (code === "unknown_command") return "unsupported_contract";
  if (code === "unauthorized" || code === "permission_denied") return "unauthorized";
  return isSuggestionErrorCode(code) ? code : "failed";
}

export class SuggestionError extends Error {
  constructor(
    public readonly code: SuggestionErrorCode,
    message = code,
  ) {
    super(message);
  }
}
