import { useCallback, useRef } from "react";

import { useSound } from "@/contexts/SoundContext";

const useSfx = (src: string) => {
	const { isMuted } = useSound();

	const audioRef = useRef(new Audio(src));

	const play = useCallback(() => {
		if (!isMuted) {
			audioRef.current.currentTime = 0;
			audioRef.current.play();
		}
	}, [isMuted]);

	const pause = useCallback(() => {
		audioRef.current.pause();
	}, []);

	return { play, pause };
};

export default useSfx;
