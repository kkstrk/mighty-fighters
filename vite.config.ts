import { fileURLToPath, URL } from "node:url";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vitest/config";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url)),
		},
	},
	test: {
		globals: true,
		environment: "jsdom",
		setupFiles: ["./tests/setup.ts"],
	},
});
