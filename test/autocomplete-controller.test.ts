import { afterEach, describe, expect, it, vi } from "vitest";
import { AutocompleteController, normalizeQuery } from "../src/autocomplete-controller";
import type { HomeAssistant } from "../src/types";

const suggestion = {
  selection_key: "opaque",
  text: "Långkornigt ris",
  primary: "Långkornigt ris",
  secondary: "Ris",
};
const hass = (
  callWS = vi.fn().mockResolvedValue({
    contract_version: 1,
    entity_id: "todo.ica",
    query: "ris",
    add_strategy: "ica_add_suggestion",
    suggestions: [suggestion, { ...suggestion, selection_key: "opaque-2", secondary: "Basvaror" }],
  }),
): HomeAssistant => ({ states: {}, callWS, callService: vi.fn() });
afterEach(() => vi.useRealTimers());

async function selectFirst(
  controller: AutocompleteController,
  client: HomeAssistant,
): Promise<void> {
  controller.input(client, "todo.ica", "ris");
  await vi.advanceTimersByTimeAsync(300);
  controller.select(0);
}

describe("autocomplete controller", () => {
  it("uses a three-character threshold and preserves duplicate display options", async () => {
    vi.useFakeTimers();
    const client = hass();
    const controller = new AutocompleteController(vi.fn());
    controller.input(client, "todo.ica", "ri");
    await vi.advanceTimersByTimeAsync(500);
    expect(client.callWS).not.toHaveBeenCalled();
    controller.input(client, "todo.ica", "ris");
    await vi.advanceTimersByTimeAsync(300);
    expect(controller.suggestions).toHaveLength(2);
    expect(controller.suggestions[0].selection_key).not.toBe(
      controller.suggestions[1].selection_key,
    );
    expect(controller.activeIndex).toBe(-1);
  });

  it("normalizes local query whitespace and caps it before requests", () => {
    expect(normalizeQuery("  lång\n\t ris  ")).toBe("lång ris");
    expect(normalizeQuery("x".repeat(100))).toHaveLength(80);
  });

  it("silently disables unsupported suggestions for the active entity", async () => {
    vi.useFakeTimers();
    const ws = vi.fn().mockRejectedValue({ code: "unknown_command" });
    const controller = new AutocompleteController(vi.fn());
    const client = hass(ws);
    controller.input(client, "todo.ica", "ris");
    await vi.advanceTimersByTimeAsync(300);
    expect(controller.state).toBe("idle");
    controller.input(client, "todo.ica", "rice");
    await vi.advanceTimersByTimeAsync(300);
    expect(ws).toHaveBeenCalledTimes(1);
  });

  it("blocks unauthorized suggestion reads for the long reauthentication cooldown", async () => {
    vi.useFakeTimers();
    const now = vi.fn().mockReturnValue(0);
    const ws = vi.fn().mockRejectedValue({ code: "unauthorized" });
    const controller = new AutocompleteController(vi.fn(), now);
    controller.input(hass(ws), "todo.ica", "ris");
    await vi.advanceTimersByTimeAsync(300);
    expect(controller.state).toBe("idle");
    now.mockReturnValue(60_000);
    controller.input(hass(ws), "todo.ica", "rice");
    await vi.advanceTimersByTimeAsync(300);
    expect(ws).toHaveBeenCalledTimes(1);
  });
  it("ignores stale completions after a changed query", async () => {
    vi.useFakeTimers();
    let resolve!: (value: unknown) => void;
    const client = hass(
      vi.fn().mockReturnValue(
        new Promise((done) => {
          resolve = done;
        }),
      ),
    );
    const controller = new AutocompleteController(vi.fn());
    controller.input(client, "todo.ica", "rice");
    await vi.advanceTimersByTimeAsync(300);
    controller.input(client, "todo.ica", "pasta");
    resolve({
      contract_version: 1,
      entity_id: "todo.ica",
      query: "rice",
      add_strategy: "ica_add_suggestion",
      suggestions: [suggestion],
    });
    await Promise.resolve();
    expect(controller.suggestions).toEqual([]);
  });
  it("routes selected Add only to the custom command and suppresses pending duplicates", async () => {
    vi.useFakeTimers();
    let resolve!: () => void;
    const ws = vi
      .fn()
      .mockResolvedValueOnce({
        contract_version: 1,
        entity_id: "todo.ica",
        query: "ris",
        add_strategy: "ica_add_suggestion",
        suggestions: [suggestion],
      })
      .mockReturnValueOnce(
        new Promise<void>((done) => {
          resolve = done;
        }),
      );
    const controller = new AutocompleteController(vi.fn());
    await selectFirst(controller, hass(ws));
    const client = hass(ws);
    const first = controller.submitSelected(client, "todo.ica", suggestion.text);
    const second = controller.submitSelected(client, "todo.ica", suggestion.text);
    expect(await second).toBe(false);
    resolve();
    expect(await first).toBe(true);
    expect(ws).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "ica_shopping_list/add_suggestion",
        selection_key: "opaque",
      }),
    );
  });
  it("keeps selected text out of free-text fallback for authentication and uncertain failures", async () => {
    vi.useFakeTimers();
    const now = vi.fn().mockReturnValue(0);
    const controller = new AutocompleteController(vi.fn(), now);
    const client = hass(
      vi
        .fn()
        .mockResolvedValueOnce({
          contract_version: 1,
          entity_id: "todo.ica",
          query: "ris",
          add_strategy: "ica_add_suggestion",
          suggestions: [suggestion],
        })
        .mockRejectedValueOnce({ code: "auth_required" }),
    );
    await selectFirst(controller, client);
    await controller.submitSelected(client, "todo.ica", suggestion.text);
    expect(controller.state).toBe("auth_required");
    expect(controller.selected).toEqual(suggestion);
  });
  it("requires re-selection after its local five-minute expiry", async () => {
    vi.useFakeTimers();
    const now = vi.fn().mockReturnValue(0);
    const controller = new AutocompleteController(vi.fn(), now);
    await selectFirst(controller, hass());
    now.mockReturnValue(300_000);
    expect(controller.expireSelection()).toBe(true);
    expect(controller.state).toBe("expired");
  });

  it("fully resets and invalidates in-flight suggestions on disconnect", async () => {
    vi.useFakeTimers();
    let resolve!: (value: unknown) => void;
    const controller = new AutocompleteController(vi.fn());
    const client = hass(
      vi.fn().mockReturnValue(
        new Promise((done) => {
          resolve = done;
        }),
      ),
    );
    controller.input(client, "todo.ica", "rice");
    await vi.advanceTimersByTimeAsync(300);
    controller.disconnect();
    resolve({
      contract_version: 1,
      entity_id: "todo.ica",
      query: "rice",
      add_strategy: "ica_add_suggestion",
      suggestions: [suggestion],
    });
    await Promise.resolve();
    expect(controller).toMatchObject({
      state: "idle",
      suggestions: [],
      activeIndex: -1,
      selectionExpiresAt: 0,
      pendingAdd: false,
      message: undefined,
      selected: undefined,
    });
  });
});
