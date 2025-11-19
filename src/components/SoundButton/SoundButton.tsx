import Button from "@/components/Button/Button";
import { useSound } from "@/contexts/SoundContext";
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
				alt={isMuted ? "Sound off icon" : "Sound on icon"}
				src={isMuted ? SoundOffIcon : SoundOnIcon}
			/>
		</Button>
	);
};

export default SoundButton;
