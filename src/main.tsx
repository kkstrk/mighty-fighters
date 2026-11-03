import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "@fontsource/pixelify-sans/400.css";

import { App } from "./app";
import { preloadCharacterAssets } from "./utils/preload-character-assets";

const root = document.querySelector("#root");
if (root === null) {
	throw new Error("Root element not found");
}

createRoot(root).render(
	<StrictMode>
		<App />
	</StrictMode>,
);

preloadCharacterAssets();
