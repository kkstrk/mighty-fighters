import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";

import MusicAudio from "./assets/music.wav";

const SoundContext = createContext<
	| {
			isMuted: boolean;
			startMusic: () => void;
			toggleMusic: () => void;
			toggleMute: () => void;
	  }
	| undefined
>(undefined);

const SOUND_STORAGE_KEY = "mightyfighters.muted";

const getSoundFromStorage = () => {
	return localStorage.getItem(SOUND_STORAGE_KEY) === "true";
};

const SoundProvider = ({ children }: { children: React.ReactNode }) => {
	const audioRef = useRef(new Audio(MusicAudio));
	const [isMuted, setIsMuted] = useState(() => getSoundFromStorage());

	useEffect(() => {
		if (audioRef.current) {
			audioRef.current.loop = true;
		}
	}, []);

	useEffect(() => {
		localStorage.setItem(SOUND_STORAGE_KEY, String(isMuted));
	}, [isMuted]);

	const startMusic = useCallback(() => {
		if (!isMuted) {
			audioRef.current.play();
		}
	}, [isMuted]);

	const toggleMusic = useCallback(() => {
		setIsMuted((prev) => {
			if (prev) {
				audioRef.current.play();
				return false;
			}
			audioRef.current.pause();
			return true;
		});
	}, []);

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

const useSound = () => {
	const context = useContext(SoundContext);
	if (context === undefined) {
		throw new Error("useSound must be used within a SoundProvider");
	}
	return context;
};

export { SoundProvider, useSound };
