import { useCallback, useEffect, useReducer, useState } from "react";

import type { CharacterName } from "@/characters";
import { Button } from "@/components/button/button";
import { SoundButton } from "@/components/sound-button/sound-button";
import { useIsSmallScreen } from "@/utils/use-is-small-screen";
import { useOptionSfx } from "@/utils/use-option-sfx/use-option-sfx";
import { Character } from "./character/character";
import { CharacterOptions } from "./character-options/character-options";
import classes from "./play-screen.module.css";
import { initialSelection, isComplete, isLocked, nextPlayer, selectionReducer } from "./selection-reducer";
import type { Player } from "./selection-reducer";

const RANDOM_STEP_MS = 150;

const PlayScreenContent = ({ isSinglePlayer, onAboutClick }: { isSinglePlayer: boolean; onAboutClick: () => void }) => {
	const [selection, dispatch] = useReducer(selectionReducer, isSinglePlayer, initialSelection);
	const [previewCharacter, setPreviewCharacter] = useState<CharacterName>();
	const { playDisabledAudio } = useOptionSfx();

	const handlePick = useCallback((character: CharacterName) => {
		dispatch({ type: "pick", character });
		setPreviewCharacter(undefined);
	}, []);

	const handleRandom = useCallback((queue: CharacterName[]) => {
		dispatch({ type: "randomStart", queue });
	}, []);

	const handleUndo = useCallback(
		(player: Player) => {
			playDisabledAudio();
			dispatch({ type: "undo", player });
		},
		[playDisabledAudio],
	);
	const handleUndoPlayerOne = useCallback(() => {
		handleUndo(1);
	}, [handleUndo]);
	const handleUndoPlayerTwo = useCallback(() => {
		handleUndo(2);
	}, [handleUndo]);

	const { phase } = selection;
	useEffect(() => {
		if (phase.status !== "randomizing") {
			return;
		}
		const timeout = setTimeout(() => {
			dispatch({ type: "randomTick" });
		}, RANDOM_STEP_MS);
		return () => clearTimeout(timeout);
	}, [phase]);

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Backspace") {
				event.preventDefault();
				dispatch({ type: "undoLast" });
			}
		};
		globalThis.addEventListener("keydown", handleKeyDown);
		return () => globalThis.removeEventListener("keydown", handleKeyDown);
	}, []);

	const { 1: playerOne, 2: playerTwo } = selection.slots;
	const disabled = isLocked(selection);
	// The turn marker stays during the random animation; the highlight is styled from it.
	const currentPlayer = isComplete(selection) ? undefined : nextPlayer(selection);
	const highlighted = phase.status === "randomizing" ? phase.queue[0] : undefined;

	return (
		<>
			<main className={classes.main}>
				<Character
					align="left"
					name={playerOne ?? previewCharacter}
					onUndo={playerOne && !isSinglePlayer ? handleUndoPlayerOne : undefined}
				/>
				<CharacterOptions
					currentPlayer={currentPlayer}
					disabled={disabled}
					highlighted={highlighted}
					onPick={handlePick}
					onPreview={setPreviewCharacter}
					onRandom={handleRandom}
					playerOne={playerOne}
					playerTwo={playerTwo}
				/>
				{!isSinglePlayer && (
					<Character
						align="right"
						name={playerTwo ?? (playerOne ? previewCharacter : undefined)}
						onUndo={playerTwo && !isSinglePlayer ? handleUndoPlayerTwo : undefined}
					/>
				)}
			</main>
			<footer className={classes.footer}>
				<SoundButton />
				<Button onClick={onAboutClick} title="About">
					i
				</Button>
			</footer>
		</>
	);
};

// Switching between one and two players starts a fresh selection.
const PlayScreen = ({ onAboutClick }: { onAboutClick: () => void }) => {
	const isSinglePlayer = useIsSmallScreen();
	return (
		<PlayScreenContent
			isSinglePlayer={isSinglePlayer}
			key={isSinglePlayer ? "single" : "multi"}
			onAboutClick={onAboutClick}
		/>
	);
};

export { PlayScreen };
