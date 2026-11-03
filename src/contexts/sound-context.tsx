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

	useEffect(() => {
		localStorage.setItem(SOUND_STORAGE_KEY, String(isMuted));
	}, [isMuted]);

	const startMusic = useCallback(() => {
		if (!isMuted) {
			void playQuietly(audio);
		}
	}, [audio, isMuted]);

	const toggleMusic = useCallback(() => {
		setIsMuted((prev) => {
			if (prev) {
				void playQuietly(audio);
				return false;
			}
			audio.pause();
			return true;
		});
	}, [audio]);

	const toggleMute = useCallback(() => {
		setIsMuted((prev) => !prev);
	}, []);

	const contextValue = useMemo(
		() => ({
			isMuted,
			startMusic,
			toggleMusic,
			toggleMute,
		}),
		[isMuted, startMusic, toggleMusic, toggleMute],
	);

	return <SoundContext.Provider value={contextValue}>{children}</SoundContext.Provider>;
};

export { SoundProvider };
