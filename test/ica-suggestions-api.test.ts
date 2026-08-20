import { describe, expect, it, vi } from "vitest";
import { addSuggestion, fetchSuggestions } from "../src/ica-suggestions-api";
import type { HomeAssistant } from "../src/types";

const response = {
  contract_version: 1,
  entity_id: "todo.ica",
  query: "ris",
  add_strategy: "ica_add_suggestion" as const,
  suggestions: [{ selection_key: "opaque", text: "ris", primary: "Ris" }],
};
const client = (callWS = vi.fn().mockResolvedValue(response)): HomeAssistant => ({
  states: {},
  callWS,
  callService: vi.fn(),
});

describe("ICA WebSocket contract adapter", () => {
  it("sends only the versioned opaque browser contract", async () => {
    const hass = client();
    await fetchSuggestions(hass, "todo.ica", "ris");
    await addSuggestion(hass, "todo.ica", "opaque", "ris");
    expect(hass.callWS).toHaveBeenNthCalledWith(1, {
      type: "ica_shopping_list/suggestions",
      contract_version: 1,
      entity_id: "todo.ica",
      query: "ris",
      limit: 8,
    });
    expect(hass.callWS).toHaveBeenNthCalledWith(2, {
      type: "ica_shopping_list/add_suggestion",
      contract_version: 1,
      entity_id: "todo.ica",
      selection_key: "opaque",
      text: "ris",
    });
  });

  it("rejects missing strategy and maps old unknown commands to a sticky unsupported contract", async () => {
    await expect(
      fetchSuggestions(
        client(vi.fn().mockResolvedValue({ ...response, add_strategy: undefined })),
        "todo.ica",
        "ris",
      ),
    ).rejects.toMatchObject({ code: "unsupported_contract" });
    await expect(
      fetchSuggestions(
        client(vi.fn().mockRejectedValue({ code: "unknown_command" })),
        "todo.ica",
        "ris",
      ),
    ).rejects.toMatchObject({ code: "unsupported_contract" });
  });
});
