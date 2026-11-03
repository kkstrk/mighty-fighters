import { createContext, useContext } from "react";

const SoundContext = createContext<
	| {
			isMuted: boolean;
			startMusic: () => void;
			toggleMusic: () => void;
			toggleMute: () => void;
	  }
	| undefined
>(undefined);

const useSound = () => {
	const context = useContext(SoundContext);
	if (context === undefined) {
		throw new Error("useSound must be used within a SoundProvider");
	}
	return context;
};

export { SoundContext, useSound };
