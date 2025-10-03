import { useCallback } from "react";
import useSfx from "../useSfx";
import ConfirmAudio from "./assets/confirm.wav";
import DisabledAudio from "./assets/disabled.wav";
import HoverAudio from "./assets/hover.wav";

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
