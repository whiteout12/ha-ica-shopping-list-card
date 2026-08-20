import "./ica-shopping-list-card";
import "./ica-shopping-list-card-editor";
import { VERSION } from "./version";

window.customCards = window.customCards ?? [];
if (!window.customCards.some((card) => card.type === "ica-shopping-list-card")) {
  window.customCards.push({
    type: "ica-shopping-list-card",
    name: "ICA Shopping List Card",
    description: "A shopping list card with optional ICA suggestions.",
  });
}

console.info(
  `%c ICA Shopping List Card %c v${VERSION} `,
  "color: white; background: #d71920; font-weight: bold;",
  "color: #d71920; background: white; font-weight: bold;",
);
