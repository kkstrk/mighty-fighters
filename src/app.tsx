import { useRef, useState } from "react";

import AboutDialog, { type AboutDialogRef } from "@/components/about-dialog/about-dialog";
import PlayScreen from "@/components/play-screen/play-screen";
import StartScreen from "@/components/start-screen/start-screen";
import { SoundProvider } from "@/contexts/sound-context";
import "./app.css";

function App() {
	const [hasStarted, setHasStarted] = useState(false);
	const aboutDialogRef = useRef<AboutDialogRef>(null);
	const handleStartClick = () => {
		setHasStarted(true);
	};
	const handleAboutClick = () => {
		aboutDialogRef.current?.open();
	};
	return (
		<SoundProvider>
			{hasStarted ? (
				<PlayScreen onAboutClick={handleAboutClick} />
			) : (
				<StartScreen
					onAboutClick={handleAboutClick}
					onStartClick={handleStartClick}
				/>
			)}
			<AboutDialog ref={aboutDialogRef} />
		</SoundProvider>
	);
}

export default App;
