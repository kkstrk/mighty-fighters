import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { App } from "./app";

// biome-ignore lint/style/noNonNullAssertion: root is guaranteed to exist
createRoot(document.querySelector("#root")!).render(
	<StrictMode>
		<App />
	</StrictMode>,
);
