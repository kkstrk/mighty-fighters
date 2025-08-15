import { useEffect, useRef, useState } from "react";
import Button from "../Button/Button";
import MusicAudio from "./assets/music.wav";
import SoundOffIcon from "./assets/sound-off.png";
import SoundOnIcon from "./assets/sound-on.png";

const SoundButton = () => {
	const [isSoundOn, setIsSoundOn] = useState(false);
	const audioRef = useRef(new Audio(MusicAudio));

	useEffect(() => {
		audioRef.current.loop = true;
	}, []);

	useEffect(() => {
		if (audioRef.current) {
			if (isSoundOn) {
				audioRef.current.play();
			} else {
				audioRef.current.pause();
			}
		}
	}, [isSoundOn]);

	const handleButtonClick = () => {
		setIsSoundOn((prevIsSoundOn) => !prevIsSoundOn);
	};

	return (
		<Button
			onClick={handleButtonClick}
			title={isSoundOn ? "Mute" : "Unmute"}
		>
			<img
				src={isSoundOn ? SoundOnIcon : SoundOffIcon}
				alt={isSoundOn ? "Sound on icon" : "Sound off icon"}
			/>
		</Button>
	);
};

export default SoundButton;
