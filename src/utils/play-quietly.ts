// A sound cut off by pause() or blocked by autoplay rejects; neither matters to the user.
const playQuietly = async (audio: HTMLAudioElement) => {
	try {
		await audio.play();
	} catch {
		// Playback is best effort.
	}
};

export { playQuietly };
