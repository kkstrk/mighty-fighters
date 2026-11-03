import { expect, test } from "./fixtures";
import { anyPortrait, fighterButton, moveMouseAway, portrait, startGame } from "./helpers";

test.describe("choosing fighters", () => {
	test.beforeEach(async ({ page }) => {
		await startGame(page);
	});

	test("picking two fighters by click locks the grid", async ({ page }) => {
		await fighterButton(page, "jester").click();
		await fighterButton(page, "molly").click();

		await expect(portrait(page, "jester")).toBeVisible();
		await expect(portrait(page, "molly")).toBeVisible();
		await expect(fighterButton(page, "fjord")).toBeDisabled();
		await expect(fighterButton(page, "jester")).toBeDisabled();
	});

	test("hovering previews a fighter and leaving removes the preview", async ({ page }) => {
		await fighterButton(page, "beau").hover();

		await expect(portrait(page, "beau")).toBeVisible();

		await moveMouseAway(page);

		await expect(portrait(page, "beau")).toBeHidden();
	});

	test("undo button removes the last fighter", async ({ page }) => {
		await fighterButton(page, "jester").click();
		await fighterButton(page, "molly").click();

		await page.getByRole("button", { name: "Undo" }).last().click();

		await expect(portrait(page, "molly")).toBeHidden();
		await expect(portrait(page, "jester")).toBeVisible();
		await expect(fighterButton(page, "fjord")).toBeEnabled();

		await fighterButton(page, "fjord").click();

		await expect(portrait(page, "fjord")).toBeVisible();
	});

	test("backspace undoes selections in reverse order", async ({ page }) => {
		await fighterButton(page, "jester").click();
		await fighterButton(page, "molly").click();
		await moveMouseAway(page);

		await page.keyboard.press("Backspace");

		await expect(portrait(page, "molly")).toBeHidden();
		await expect(portrait(page, "jester")).toBeVisible();

		await page.keyboard.press("Backspace");

		await expect(portrait(page, "jester")).toBeHidden();
	});

	test("random pick selects one fighter, then a second", async ({ page }) => {
		const randomButton = page.getByRole("button", { name: "Pick a random character" });

		await randomButton.click();

		await expect(anyPortrait(page)).toHaveCount(1, { timeout: 5000 });

		await randomButton.click();

		await expect(anyPortrait(page)).toHaveCount(2, { timeout: 5000 });
		await expect(fighterButton(page, "fjord")).toBeDisabled();
	});

	test("keyboard selects fighters from the grid", async ({ page }) => {
		await fighterButton(page, "jester").focus();
		await page.keyboard.press("ArrowRight");

		await expect(fighterButton(page, "molly")).toBeFocused();

		await page.keyboard.press("Enter");

		await expect(portrait(page, "molly")).toBeVisible();

		await page.keyboard.press("ArrowDown");
		await page.keyboard.press("Enter");

		await expect(anyPortrait(page)).toHaveCount(2);
		await expect(fighterButton(page, "fjord")).toBeDisabled();
	});

	test("mute button toggles sound during play", async ({ page }) => {
		await page.getByTitle("Mute", { exact: true }).click();

		await expect(page.getByTitle("Unmute", { exact: true })).toBeVisible();

		await page.getByTitle("Unmute", { exact: true }).click();

		await expect(page.getByTitle("Mute", { exact: true })).toBeVisible();
	});
});
