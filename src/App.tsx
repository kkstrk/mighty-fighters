import { useCallback, useEffect, useRef, useState } from "react";
import type { CharacterName } from "./characters";
import AboutButton from "./components/AboutButton/AboutButton";
import Character from "./components/Character/Character";
import CharacterOptions from "./components/CharacterOptions/CharacterOptions";
import SoundButton from "./components/SoundButton/SoundButton";
import "./App.css";

type Player = 1 | 2;

function App() {
	const [playerOne, setPlayerOne] = useState<CharacterName>();
	const [playerTwo, setPlayerTwo] = useState<CharacterName>();
	const [previewCharacter, setPreviewCharacter] = useState<CharacterName>();
	const selectionHistoryRef = useRef<Player[]>([]);

	const handleCharacterChange = useCallback(
		(character: CharacterName) => {
			if (!playerOne) {
				setPlayerOne(character);
				selectionHistoryRef.current.push(1);
			} else if (!playerTwo) {
				setPlayerTwo(character);
				selectionHistoryRef.current.push(2);
			}
			setPreviewCharacter(undefined);
		},
		[playerOne, playerTwo],
	);

	const handleCharacterUndo = useCallback((player: Player) => {
		if (player === 1) {
			setPlayerOne(undefined);
		} else if (player === 2) {
			setPlayerTwo(undefined);
		}
		selectionHistoryRef.current = selectionHistoryRef.current.filter((p) => p !== player);
	}, []);

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Backspace") {
				event.preventDefault();
				const lastPlayer = selectionHistoryRef.current.at(-1);
				if (lastPlayer) {
					handleCharacterUndo(lastPlayer);
				}
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [handleCharacterUndo]);

	return (
		<>
			<main>
				<Character
					align="left"
					name={playerOne || previewCharacter}
					onUndo={playerOne ? () => handleCharacterUndo(1) : undefined}
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
					onUndo={playerTwo ? () => handleCharacterUndo(2) : undefined}
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
