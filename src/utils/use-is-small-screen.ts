import { useSyncExternalStore } from "react";

const query = "(max-width: 750px) and (orientation: portrait)";

const subscribe = (onChange: () => void) => {
	const mediaQuery = globalThis.matchMedia(query);
	mediaQuery.addEventListener("change", onChange);
	return () => mediaQuery.removeEventListener("change", onChange);
};

const getSnapshot = () => globalThis.matchMedia(query).matches;

const useIsSmallScreen = () => useSyncExternalStore(subscribe, getSnapshot);

export { useIsSmallScreen };
