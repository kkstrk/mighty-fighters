import { useCallback, useMemo } from "react";

import { useSound } from "@/contexts/use-sound";
import { playQuietly } from "@/utils/play-quietly";

const restart = (audio: HTMLAudioElement) => {
	audio.currentTime = 0;
	void playQuietly(audio);
};

const useSfx = (src: string) => {
	const { isMuted } = useSound();

	// Memoized: `new Audio` must not run (and start a fetch) on every render.
	const audio = useMemo(() => new Audio(src), [src]);

	const play = useCallback(() => {
		if (!isMuted) {
			restart(audio);
		}
	}, [audio, isMuted]);

	const pause = useCallback(() => {
		audio.pause();
	}, [audio]);

	return useMemo(() => ({ play, pause }), [play, pause]);
};

export { useSfx };
