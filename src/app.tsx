import { useCallback, useState } from "react";

import { AboutDialog } from "@/components/about-dialog/about-dialog";
import { PlayScreen } from "@/components/play-screen/play-screen";
import { StartScreen } from "@/components/start-screen/start-screen";
import { SoundProvider } from "@/contexts/sound-context";
import "./app.css";

function App() {
	const [hasStarted, setHasStarted] = useState(false);
	const [isAboutOpen, setIsAboutOpen] = useState(false);
	const handleStartClick = useCallback(() => {
		setHasStarted(true);
	}, []);
	const handleAboutClick = useCallback(() => {
		setIsAboutOpen(true);
	}, []);
	const handleAboutClose = useCallback(() => {
		setIsAboutOpen(false);
	}, []);
	return (
		<SoundProvider>
			{hasStarted ? (
				<PlayScreen keyboardEnabled={!isAboutOpen} onAboutClick={handleAboutClick} />
			) : (
				<StartScreen
					keyboardEnabled={!isAboutOpen}
					onAboutClick={handleAboutClick}
					onStartClick={handleStartClick}
				/>
			)}
			<AboutDialog onClose={handleAboutClose} open={isAboutOpen} />
		</SoundProvider>
	);
}

export { App };
