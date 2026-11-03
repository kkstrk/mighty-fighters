import type { Locator, Page } from "@playwright/test";

import { expect } from "./fixtures";

const startGame = async (page: Page) => {
	await page.goto("/");
	await page.getByRole("button", { name: "start", exact: true }).click();
	await expect(fighterButton(page, "jester")).toBeVisible();
};

const fighterButton = (page: Page, name: string): Locator =>
	page.getByRole("button", { name: `Select ${name}`, exact: true });

const portrait = (page: Page, name: string): Locator =>
	page.getByRole("img", { name: `${name} portrait`, exact: true });

const anyPortrait = (page: Page): Locator => page.getByRole("img", { name: /portrait$/u });

// Moving the pointer off a fighter clears the hover preview, so keyboard and undo assertions are not affected by it.
const moveMouseAway = async (page: Page) => {
	await page.mouse.move(0, 0);
};

export { anyPortrait, fighterButton, moveMouseAway, portrait, startGame };
