import { characters } from "@/characters";

const urls = [
	"platform.png",
	...characters.flatMap((name) => [
		`animations/${name}.gif`,
		`portraits/${name}.png`,
		`avatars/${name}.png`,
		`avatars/${name}-outline.png`,
	]),
];

// Held so the browser keeps the requests alive until the images are cached.
const images: HTMLImageElement[] = [];

const load = () => {
	for (const url of urls) {
		const image = new Image();
		image.src = url;
		images.push(image);
	}
};

// Idle time keeps the downloads from competing with the start screen's own assets; Safari has no requestIdleCallback.
const preloadCharacterAssets = () => {
	if ("requestIdleCallback" in globalThis) {
		globalThis.requestIdleCallback(load);
	} else {
		setTimeout(load, 1000);
	}
};

export { preloadCharacterAssets };
