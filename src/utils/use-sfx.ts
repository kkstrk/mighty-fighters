import { useCallback, useRef } from "react";

import { useSound } from "@/contexts/use-sound";

const useSfx = (src: string) => {
	const { isMuted } = useSound();

	const audioRef = useRef(new Audio(src));

	const play = useCallback(() => {
		if (!isMuted) {
			audioRef.current.currentTime = 0;
			void audioRef.current.play();
		}
	}, [isMuted]);

	const pause = useCallback(() => {
		audioRef.current.pause();
	}, []);

	return { play, pause };
};

export { useSfx };
