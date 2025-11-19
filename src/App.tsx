import { useRef, useState } from "react";

import AboutDialog, { type AboutDialogRef } from "@/components/AboutDialog/AboutDialog";
import PlayScreen from "@/components/PlayScreen/PlayScreen";
import StartScreen from "@/components/StartScreen/StartScreen";
import { SoundProvider } from "@/contexts/SoundContext";
import "./App.css";

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
