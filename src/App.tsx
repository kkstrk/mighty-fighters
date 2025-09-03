import { useCallback, useEffect, useRef, useState } from "react";
import type { CharacterName } from "./characters";
import AboutButton from "./components/AboutButton/AboutButton";
import Character from "./components/Character/Character";
import CharacterOptions from "./components/CharacterOptions/CharacterOptions";
import SoundButton from "./components/SoundButton/SoundButton";
import useSmallScreen from "./utils/useSmallScreen";
import "./App.css";

type Player = 1 | 2;

const initialPlayerCharacters = { 1: undefined, 2: undefined };

function App() {
	const [players, setPlayers] = useState<Player>(2);
	const [playerCharacters, setPlayerCharacters] =
		useState<Record<Player, CharacterName | undefined>>(initialPlayerCharacters);
	const [previewCharacter, setPreviewCharacter] = useState<CharacterName>();
	const selectionHistoryRef = useRef<Player[]>([]);

	const handleSizeChange = useCallback((isSmallScreen: boolean) => {
		setPlayers(isSmallScreen ? 1 : 2);
		setPlayerCharacters(initialPlayerCharacters);
		setPreviewCharacter(undefined);
		selectionHistoryRef.current = [];
	}, []);
	useSmallScreen(handleSizeChange);

	const handleCharacterChange = useCallback(
		(character: CharacterName) => {
			setPlayerCharacters((prev) => {
				const player = players === 1 ? 1 : prev[1] ? 2 : 1;
				selectionHistoryRef.current.push(player);
				return {
					...prev,
					[player]: character,
				};
			});
			setPreviewCharacter(undefined);
		},
		[players],
	);

	const handleCharacterUndo = useCallback((player: Player) => {
		setPlayerCharacters((prev) => ({
			...prev,
			[player]: undefined,
		}));
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

	const { 1: playerOne, 2: playerTwo } = playerCharacters;

	return (
		<>
			<main>
				<Character
					align="left"
					name={playerOne || previewCharacter}
					onUndo={playerOne ? () => handleCharacterUndo(1) : undefined}
				/>
				<CharacterOptions
					disabled={players === 1 ? !!playerOne : !!(playerOne && playerTwo)}
					onChange={handleCharacterChange}
					onPreview={setPreviewCharacter}
					playerOne={playerOne}
					playerTwo={playerTwo}
				/>
				{players === 2 && (
					<Character
						align="right"
						name={playerTwo || (playerOne ? previewCharacter : undefined)}
						onUndo={playerTwo ? () => handleCharacterUndo(2) : undefined}
					/>
				)}
			</main>
			<footer>
				<SoundButton />
				<AboutButton />
			</footer>
		</>
	);
}

export default App;
