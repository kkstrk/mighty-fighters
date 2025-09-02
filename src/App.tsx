import { useCallback, useEffect, useRef, useState } from "react";
import type { CharacterName } from "./characters";
import AboutButton from "./components/AboutButton/AboutButton";
import Character from "./components/Character/Character";
import CharacterOptions from "./components/CharacterOptions/CharacterOptions";
import SoundButton from "./components/SoundButton/SoundButton";
import "./App.css";

type Player = 1 | 2;

function App() {
	const [players, setPlayers] = useState<Player>(2);
	const [playerCharacters, setPlayerCharacters] = useState<
		Record<Player, CharacterName | undefined>
	>({ 1: undefined, 2: undefined });
	const [previewCharacter, setPreviewCharacter] = useState<CharacterName>();
	const selectionHistoryRef = useRef<Player[]>([]);

	useEffect(() => {
		const checkWindowSize = () => {
			const isPortrait = window.innerHeight >= window.innerWidth;
			const isSmallScreen = window.innerWidth <= 750;
			setPlayers(isPortrait && isSmallScreen ? 1 : 2);
		};
		checkWindowSize();
		window.addEventListener("resize", checkWindowSize);
		return () => {
			window.removeEventListener("resize", checkWindowSize);
		};
	}, []);

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

	return (
		<>
			<main>
				<Character
					align="left"
					name={playerCharacters[1] || previewCharacter}
					onUndo={playerCharacters[1] ? () => handleCharacterUndo(1) : undefined}
				/>
				<CharacterOptions
					onChange={handleCharacterChange}
					onPreview={setPreviewCharacter}
					playerOne={playerCharacters[1]}
					playerTwo={playerCharacters[2]}
				/>
				{players === 2 && (
					<Character
						align="right"
						name={
							playerCharacters[2] ||
							(playerCharacters[1] ? previewCharacter : undefined)
						}
						onUndo={playerCharacters[2] ? () => handleCharacterUndo(2) : undefined}
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
