import { useSound } from "../../contexts/SoundContext/SoundContext";
import Button from "../Button/Button";
import SoundOffIcon from "./assets/sound-off.png";
import SoundOnIcon from "./assets/sound-on.png";

const SoundButton = () => {
	const { isMuted, toggleMusic } = useSound();

	return (
		<Button
			onClick={toggleMusic}
			title={isMuted ? "Unmute" : "Mute"}
		>
			<img
				src={isMuted ? SoundOffIcon : SoundOnIcon}
				alt={isMuted ? "Sound off icon" : "Sound on icon"}
			/>
		</Button>
	);
};

export default SoundButton;
