import { defineConfig, devices } from "@playwright/test";

const port = 4173;
const ci = process.env.CI !== undefined;

export default defineConfig({
	testDir: "e2e",
	forbidOnly: ci,
	retries: ci ? 1 : 0,
	reporter: ci ? [["github"], ["html", { open: "never" }]] : "list",
	use: {
		baseURL: `http://localhost:${port}`,
		trace: "on-first-retry",
	},
	projects: [{ name: "desktop", use: { ...devices["Desktop Chrome"] } }],
	// Runs against the production build.
	webServer: {
		command: `pnpm build && pnpm preview --port ${port} --strictPort`,
		port,
		reuseExistingServer: !ci,
	},
});
