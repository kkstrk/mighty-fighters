import { expect, test as base } from "@playwright/test";

export { expect } from "@playwright/test";

// The music and sound effects are not under test; stub them so runs do not depend on the network or autoplay.
const emptyWav = Buffer.from("UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=", "base64");

const test = base.extend({
	page: async ({ page }, runTest) => {
		const errors: string[] = [];
		page.on("pageerror", (error) => errors.push(error.message));
		page.on("console", (message) => {
			if (message.type() === "error") {
				errors.push(message.text());
			}
		});
		await page.route(/\.(wav|mp3|ogg)(\?.*)?$/u, (route) =>
			route.fulfill({ body: emptyWav, contentType: "audio/wav" }),
		);

		await runTest(page);

		expect(errors, "the app should not log errors").toEqual([]);
	},
});

export { test };
