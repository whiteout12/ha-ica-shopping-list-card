import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

async function openCard(page: import("@playwright/test").Page) {
  await page.goto("");
  const card = page.locator("ica-shopping-list-card");
  await expect(card.getByText("Oat milk")).toBeVisible();
  return card;
}

async function selectSuggestion(
  card: import("@playwright/test").Locator,
  input: import("@playwright/test").Locator,
) {
  await input.fill("ris");
  const options = card.locator("#ica-suggestions [role=option]");
  await expect(options).toHaveCount(2);
  await options.first().click();
  await expect(input).toHaveValue("Långkornigt ris");
}

test("production bundle supports keyboard and pointer suggestions without collapsing duplicates", async ({
  page,
}) => {
  const card = await openCard(page);
  const input = card.getByRole("combobox", { name: "Add an item" });
  await expect(input).not.toHaveAttribute("aria-controls");
  await input.fill("ris");
  const options = card.locator("#ica-suggestions [role=option]");
  await expect(options).toHaveCount(2);
  await expect(options.nth(0)).toContainText("Ris");
  await expect(options.nth(1)).toContainText("Basvaror");
  await expect(input).not.toHaveAttribute("aria-activedescendant");
  await input.press("ArrowDown");
  await expect(input).toHaveAttribute("aria-activedescendant", "ica-option-0");
  await input.press("Enter");
  await expect(input).toHaveValue("Långkornigt ris");
  await card.getByRole("button", { name: "Use free text" }).click();
  await expect(card.getByRole("button", { name: "Use free text" })).toHaveCount(0);
  await selectSuggestion(card, input);
  await card.getByRole("button", { name: "Add" }).click();
  await expect(input).toHaveValue("");
});

test("uses standard list switching and CRUD through the production bundle", async ({ page }) => {
  const card = await openCard(page);
  const input = card.getByRole("combobox", { name: "Add an item" });
  await input.fill("Bananas");
  await card.getByRole("button", { name: "Add" }).click();
  await expect(card.getByText("Bananas")).toBeVisible();
  await card.getByRole("button", { name: "Check Bananas" }).click();
  await expect(card.getByText("Bananas")).toHaveClass(/summary/);
  await card.getByRole("button", { name: "Edit Oat milk" }).click();
  const rename = card.locator('input[name="rename"]');
  await rename.fill("Oat drink");
  await card.getByRole("button", { name: "Save" }).click();
  await expect(card.getByText("Oat drink")).toBeVisible();
  await card.getByRole("button", { name: "Delete Oat drink" }).click();
  await card.getByRole("button", { name: "Confirm" }).click();
  await expect(card.getByText("Oat drink")).toHaveCount(0);
  await card.getByLabel("Shopping list").selectOption("todo.shopping_list");
  await expect(card.getByText("Tea")).toBeVisible();
});

for (const [mode, message] of [
  ["pending", "Use free text"],
  ["expired_selection", "selected article expired"],
  ["auth_required", "Sign in to ICA again"],
  ["failed", "Could not confirm whether the item was added"],
] as const) {
  test(`preserves selected-add safeguards for ${mode}`, async ({ page }) => {
    const card = await openCard(page);
    const input = card.getByRole("combobox", { name: "Add an item" });
    await selectSuggestion(card, input);
    await page.evaluate((value) => {
      window.fixtureMode = value;
    }, mode);
    await card.getByRole("button", { name: "Add" }).click();
    if (mode === "pending") {
      await expect(input).toHaveAttribute("readonly", "");
      await expect(input).toHaveAttribute("aria-busy", "true");
      await expect(card.locator("button.add")).toBeDisabled();
    } else {
      await expect(card.getByText(message, { exact: false })).toBeVisible();
      await expect(input).toHaveValue("Långkornigt ris");
      await expect(card.getByRole("button", { name: "Use free text" })).toBeVisible();
    }
  });
}

test("meets baseline accessibility at desktop and mobile widths", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const card = await openCard(page);
  await card.getByRole("combobox", { name: "Add an item" }).fill("ris");
  await expect(card.locator("#ica-suggestions [role=option]")).toHaveCount(2);
  await expect(card).toBeVisible();
  const results = await new AxeBuilder({ page }).include("ica-shopping-list-card").analyze();
  expect(results.violations).toEqual([]);
});
