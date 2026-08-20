import {
  getSuggestionErrorCode,
  SuggestionError,
  type HomeAssistant,
  type SuggestionsResponse,
} from "./types";

export async function fetchSuggestions(
  hass: HomeAssistant,
  entityId: string,
  query: string,
  limit = 8,
): Promise<SuggestionsResponse> {
  try {
    const response = await hass.callWS<SuggestionsResponse>({
      type: "ica_shopping_list/suggestions",
      contract_version: 1,
      entity_id: entityId,
      query,
      limit,
    });
    if (
      response.contract_version !== 1 ||
      response.add_strategy !== "ica_add_suggestion" ||
      response.entity_id !== entityId ||
      !Array.isArray(response.suggestions)
    ) {
      throw new SuggestionError("unsupported_contract");
    }
    return response;
  } catch (error) {
    if (error instanceof SuggestionError) throw error;
    throw new SuggestionError(getSuggestionErrorCode(error));
  }
}

export async function addSuggestion(
  hass: HomeAssistant,
  entityId: string,
  selectionKey: string,
  text: string,
): Promise<void> {
  try {
    await hass.callWS({
      type: "ica_shopping_list/add_suggestion",
      contract_version: 1,
      entity_id: entityId,
      selection_key: selectionKey,
      text,
    });
  } catch (error) {
    throw new SuggestionError(getSuggestionErrorCode(error));
  }
}
