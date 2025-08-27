import { useState } from "react";
import type { CharacterName } from "./characters";
import AboutButton from "./components/AboutButton/AboutButton";
import Character from "./components/Character/Character";
import CharacterOptions from "./components/CharacterOptions/CharacterOptions";
import SoundButton from "./components/SoundButton/SoundButton";
import "./App.css";

function App() {
	const [playerOne, setPlayerOne] = useState<CharacterName>();
	const [playerTwo, setPlayerTwo] = useState<CharacterName>();
	const [previewCharacter, setPreviewCharacter] = useState<CharacterName>();

	const handleCharacterChange = (character: CharacterName) => {
		if (!playerOne) {
			setPlayerOne(character);
		} else if (!playerTwo) {
			setPlayerTwo(character);
		}
		setPreviewCharacter(undefined);
	};

	return (
		<>
			<main>
				<Character
					align="left"
					name={playerOne || previewCharacter}
					onUndo={playerOne ? () => setPlayerOne(undefined) : undefined}
				/>
				<CharacterOptions
					onChange={handleCharacterChange}
					onPreview={setPreviewCharacter}
					playerOne={playerOne}
					playerTwo={playerTwo}
				/>
				<Character
					align="right"
					name={playerTwo || (playerOne ? previewCharacter : undefined)}
					onUndo={playerTwo ? () => setPlayerTwo(undefined) : undefined}
				/>
			</main>
			<footer>
				<SoundButton />
				<AboutButton />
			</footer>
		</>
	);
}

export default App;
