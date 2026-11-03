import { Button } from "@/components/button/button";
import { PixelIcon } from "@/components/pixel-icon/pixel-icon";
import { useSound } from "@/contexts/use-sound";

const SoundButton = ({ size }: { size?: "sm" | "md" | "lg" | undefined }) => {
	const { isMuted, toggleMute } = useSound();
	const label = isMuted ? "Unmute" : "Mute";

	return (
		<Button aria-label={label} onClick={toggleMute} size={size} title={label}>
			<PixelIcon name={isMuted ? "sound-off" : "sound-on"} />
		</Button>
	);
};

export { SoundButton };
