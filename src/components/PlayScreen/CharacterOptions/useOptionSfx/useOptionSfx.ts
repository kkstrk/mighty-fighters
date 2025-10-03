import { useCallback, useRef } from "react";
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
	const hoverAudio = useSfx(HoverAudio);
	const confirmAudio = useSfx(ConfirmAudio);
	const disabledAudio = useSfx(DisabledAudio);

	const playHoverAudio = useCallback(() => {
		hoverAudio.play();
	}, [hoverAudio]);

	const playConfirmAudio = useCallback(() => {
		hoverAudio.pause();
		confirmAudio.play();
	}, [confirmAudio, hoverAudio]);

	const playDisabledAudio = useCallback(() => {
		hoverAudio.pause();
		disabledAudio.play();
	}, [disabledAudio, hoverAudio]);

	return { playHoverAudio, playConfirmAudio, playDisabledAudio };
};

export default useOptionSfx;
