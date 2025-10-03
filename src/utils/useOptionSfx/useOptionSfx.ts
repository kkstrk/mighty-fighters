import { useCallback, useRef } from "react";
import { useSound } from "../../contexts/SoundContext/SoundContext";
import ConfirmAudio from "./assets/confirm.wav";
import DisabledAudio from "./assets/disabled.wav";
import HoverAudio from "./assets/hover.wav";

const useSfx = (src: string) => {
	const audioRef = useRef(new Audio(src));

	const play = useCallback(() => {
		audioRef.current.currentTime = 0;
		audioRef.current.play();
	}, []);

	const pause = useCallback(() => {
		audioRef.current.pause();
	}, []);

	return { play, pause };
};

const useOptionSfx = () => {
	const { isMuted } = useSound();

	const hoverAudio = useSfx(HoverAudio);
	const confirmAudio = useSfx(ConfirmAudio);
	const disabledAudio = useSfx(DisabledAudio);

	const playHoverAudio = useCallback(() => {
		if (!isMuted) {
			hoverAudio.play();
		}
	}, [hoverAudio, isMuted]);

	const playConfirmAudio = useCallback(() => {
		if (!isMuted) {
			hoverAudio.pause();
			confirmAudio.play();
		}
	}, [confirmAudio, hoverAudio, isMuted]);

	const playDisabledAudio = useCallback(() => {
		if (!isMuted) {
			hoverAudio.pause();
			disabledAudio.play();
		}
	}, [disabledAudio, hoverAudio, isMuted]);

	return { playHoverAudio, playConfirmAudio, playDisabledAudio };
};

export default useOptionSfx;
