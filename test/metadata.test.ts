import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("HACS metadata", () => {
  it("uses only supported dashboard-plugin metadata keys", () => {
    const hacs = JSON.parse(readFileSync(resolve(process.cwd(), "hacs.json"), "utf8")) as Record<
      string,
      unknown
    >;
    expect(hacs).toEqual({
      name: "ICA Shopping List Card",
      homeassistant: "2024.11.0",
      render_readme: true,
      filename: "ica-shopping-list-card.js",
    });
  });
});
