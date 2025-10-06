import { useCallback, useEffect, useRef, useState } from "react";

import type { CharacterName } from "@/characters";
import Button from "@/components/Button/Button";
import SoundButton from "@/components/SoundButton/SoundButton";
import useOptionSfx from "@/utils/useOptionSfx/useOptionSfx";
import useSmallScreen from "@/utils/useSmallScreen";
import Character from "./Character/Character";
import CharacterOptions from "./CharacterOptions/CharacterOptions";
import classes from "./PlayScreen.module.css";

type Player = 1 | 2;

const initialPlayerCharacters = { 1: undefined, 2: undefined };

const PlayScreen = ({ onAboutClick }: { onAboutClick: () => void }) => {
	const [isSinglePlayer, setIsSinglePlayer] = useState(false);
	const [playerCharacters, setPlayerCharacters] =
		useState<Record<Player, CharacterName | undefined>>(initialPlayerCharacters);
	const [previewCharacter, setPreviewCharacter] = useState<CharacterName>();
	const selectionHistoryRef = useRef<Player[]>([]);
	const { playDisabledAudio } = useOptionSfx();

	const handleSizeChange = useCallback((isSmallScreen: boolean) => {
		setIsSinglePlayer(isSmallScreen);
		setPlayerCharacters(initialPlayerCharacters);
		setPreviewCharacter(undefined);
		selectionHistoryRef.current = [];
	}, []);
	useSmallScreen(handleSizeChange);

	const handleCharacterChange = useCallback(
		(character: CharacterName) => {
			setPlayerCharacters((prev) => {
				const player = isSinglePlayer ? 1 : prev[1] ? 2 : 1;
				selectionHistoryRef.current.push(player);
				return {
					...prev,
					[player]: character,
				};
			});
			setPreviewCharacter(undefined);
		},
		[isSinglePlayer],
	);

	const handleCharacterUndo = useCallback(
		(player: Player) => {
			playDisabledAudio();
			setPlayerCharacters((prev) => ({
				...prev,
				[player]: undefined,
			}));
			selectionHistoryRef.current = selectionHistoryRef.current.filter((p) => p !== player);
		},
		[playDisabledAudio],
	);

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

	const disabled = isSinglePlayer ? false : !!(playerOne && playerTwo);

	return (
		<>
			<main className={classes.main}>
				<Character
					align="left"
					name={playerOne || previewCharacter}
					onUndo={playerOne && !isSinglePlayer ? () => handleCharacterUndo(1) : undefined}
				/>
				<CharacterOptions
					currentPlayer={disabled ? undefined : isSinglePlayer ? 1 : playerOne ? 2 : 1}
					disabled={disabled}
					onChange={handleCharacterChange}
					onPreview={setPreviewCharacter}
					playerOne={playerOne}
					playerTwo={playerTwo}
				/>
				{!isSinglePlayer && (
					<Character
						align="right"
						name={playerTwo || (playerOne ? previewCharacter : undefined)}
						onUndo={
							playerTwo && !isSinglePlayer ? () => handleCharacterUndo(2) : undefined
						}
					/>
				)}
			</main>
			<footer className={classes.footer}>
				<SoundButton />
				<Button
					onClick={onAboutClick}
					title="About"
				>
					i
				</Button>
			</footer>
		</>
	);
};

export default PlayScreen;
