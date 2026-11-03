import { useCallback, useEffect, useMemo, useState } from "react";

import { playQuietly } from "@/utils/play-quietly";
import { SoundContext } from "./use-sound";

const SOUND_STORAGE_KEY = "mightyfighters-muted";

const getSoundFromStorage = () => localStorage.getItem(SOUND_STORAGE_KEY) === "true";

const SoundProvider = ({ children }: { children: React.ReactNode }) => {
	const audio = useMemo(() => {
		const music = new Audio("https://pub-e1a4a16315c645b89296d37efc689f8f.r2.dev/music.wav");
		music.loop = true;
		return music;
	}, []);
	const [isMuted, setIsMuted] = useState(() => getSoundFromStorage());
	const [hasStartedMusic, setHasStartedMusic] = useState(false);

	const setMuted = useCallback((muted: boolean) => {
		localStorage.setItem(SOUND_STORAGE_KEY, String(muted));
		setIsMuted(muted);
	}, []);

	const startMusic = useCallback(() => {
		setHasStartedMusic(true);
	}, []);

	const toggleMute = useCallback(() => {
		setMuted(!isMuted);
	}, [isMuted, setMuted]);

	// The audio element follows the two flags, so the UI and the sound cannot disagree.
	useEffect(() => {
		if (hasStartedMusic && !isMuted) {
			void playQuietly(audio);
		} else {
			audio.pause();
		}
	}, [audio, hasStartedMusic, isMuted]);

	const contextValue = useMemo(
		() => ({
			isMuted,
			startMusic,
			toggleMute,
		}),
		[isMuted, startMusic, toggleMute],
	);

	return <SoundContext.Provider value={contextValue}>{children}</SoundContext.Provider>;
};

export { SoundProvider };
