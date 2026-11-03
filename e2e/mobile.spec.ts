import { expect, test } from "./fixtures";
import { anyPortrait, fighterButton, portrait, startGame } from "./helpers";

test.use({ viewport: { width: 390, height: 844 } });

test.describe("mobile", () => {
	test("single player replaces the previous fighter", async ({ page }) => {
		await startGame(page);

		await fighterButton(page, "jester").click();

		await expect(anyPortrait(page)).toHaveCount(1);
		await expect(portrait(page, "jester")).toBeVisible();

		await fighterButton(page, "molly").click();

		await expect(anyPortrait(page)).toHaveCount(1);
		await expect(portrait(page, "molly")).toBeVisible();
		await expect(portrait(page, "jester")).toBeHidden();
		await expect(fighterButton(page, "fjord")).toBeEnabled();
	});
});
