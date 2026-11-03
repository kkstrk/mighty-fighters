import { useCallback, useRef } from "react";

import { useSound } from "@/contexts/use-sound";
import { playQuietly } from "@/utils/play-quietly";

const useSfx = (src: string) => {
	const { isMuted } = useSound();

	const audioRef = useRef(new Audio(src));

	const play = useCallback(() => {
		if (!isMuted) {
			audioRef.current.currentTime = 0;
			void playQuietly(audioRef.current);
		}
	}, [isMuted]);

	const pause = useCallback(() => {
		audioRef.current.pause();
	}, []);

	return { play, pause };
};

export { useSfx };
