import { expect, test } from "./fixtures";
import { fighterButton } from "./helpers";

test.describe("start screen", () => {
	test("shows the menu", async ({ page }) => {
		await page.goto("/");

		await expect(page.getByRole("button", { name: "start", exact: true })).toBeVisible();
		await expect(page.getByRole("button", { name: "sound", exact: true })).toBeVisible();
		await expect(page.getByRole("button", { name: "about", exact: true })).toBeVisible();
		await expect(page.getByText("unofficial fan content")).toBeVisible();
	});

	test("clicking start opens character select", async ({ page }) => {
		await page.goto("/");

		await page.getByRole("button", { name: "start", exact: true }).click();

		const names = [
			"jester",
			"molly",
			"fjord",
			"yasha",
			"beau",
			"nott",
			"caleb",
			"caduceus",
			"essek",
			"avantika",
			"jourrael",
		];
		await Promise.all(names.map((name) => expect(fighterButton(page, name)).toBeVisible()));
		await expect(page.getByRole("button", { name: "Locked character" })).toBeVisible();
		await expect(page.getByRole("button", { name: "Pick a random character" })).toBeVisible();
		await expect(page.getByRole("button", { name: "start", exact: true })).toBeHidden();
	});

	test("Enter on the initial screen starts the game", async ({ page }) => {
		await page.goto("/");
		await expect(page.getByRole("button", { name: "start", exact: true })).toBeVisible();

		await page.keyboard.press("Enter");

		await expect(fighterButton(page, "jester")).toBeVisible();
	});

	test("arrow keys select and toggle sound, then start", async ({ page }) => {
		await page.goto("/");
		const soundButton = page.getByRole("button", { name: "sound", exact: true });
		await expect(soundButton).toBeVisible();

		await page.keyboard.press("ArrowDown");
		await expect(page.getByRole("button", { name: "sound: on", exact: true })).toBeVisible();
		await page.keyboard.press("Enter");

		await expect(page.getByRole("button", { name: "sound: off", exact: true })).toBeVisible();
		await expect(page.getByRole("button", { name: "start", exact: true })).toBeVisible();

		await page.keyboard.press("ArrowUp");
		await expect(soundButton).toBeVisible();
		await page.keyboard.press("Enter");

		await expect(fighterButton(page, "jester")).toBeVisible();
		await expect(page.getByTitle("Unmute", { exact: true })).toBeVisible();
	});

	test("muted choice persists across reload", async ({ page }) => {
		await page.goto("/");

		await page.getByRole("button", { name: "sound", exact: true }).click();
		await expect(page.getByRole("button", { name: "sound: off", exact: true })).toBeVisible();

		await page.reload();
		await page.getByRole("button", { name: "start", exact: true }).click();

		await expect(page.getByTitle("Unmute", { exact: true })).toBeVisible();

		await page.getByTitle("Unmute", { exact: true }).click();

		await expect(page.getByTitle("Mute", { exact: true })).toBeVisible();
	});
});
