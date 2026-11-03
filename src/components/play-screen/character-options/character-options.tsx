import { useCallback, useEffect, useRef, useState } from "react";

import { characters } from "@/characters";
import type { CharacterName } from "@/characters";
import { classNames } from "@/utils/class-names";
import { useOptionSfx } from "@/utils/use-option-sfx/use-option-sfx";
import { useSfx } from "@/utils/use-sfx";
import RandomizeAudio from "./assets/randomize.wav";
import classes from "./character-options.module.css";
import { useKeyboardNavigation } from "./use-keyboard-navigation";

function LockedCharacterOption(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
	const [animating, setAnimating] = useState(false);
	const animationTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

	const { onClick } = props;
	const handleClick = useCallback(
		(event: React.MouseEvent<HTMLButtonElement>) => {
			onClick?.(event);
			if (animationTimeoutRef.current) {
				clearTimeout(animationTimeoutRef.current);
			}
			setAnimating(true);
			animationTimeoutRef.current = setTimeout(() => {
				setAnimating(false);
			}, 350);
		},
		[onClick],
	);

	useEffect(
		() => () => {
			if (animationTimeoutRef.current) {
				clearTimeout(animationTimeoutRef.current);
			}
		},
		[],
	);

	return (
		<button
			{...props}
			aria-label="Locked character"
			className={classNames(classes.option, classes.lockedOption, animating && classes.lockedOptionAnimating)}
			onClick={handleClick}
			type="button"
		/>
	);
}

function RandomCharacterOption(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
	return (
		<button
			{...props}
			aria-label="Pick a random character"
			className={classNames(classes.option, classes.randomOption)}
			type="button"
		/>
	);
}

function CharacterOption({
	character,
	disabled,
	highlighted,
	onBlur,
	onConfirm,
	onFocusCharacter,
	onHover,
	selectedByP1,
	selectedByP2,
}: {
	character: CharacterName;
	disabled: boolean;
	highlighted: boolean;
	onBlur: () => void;
	onConfirm: (character: CharacterName) => void;
	onFocusCharacter: (character: CharacterName) => void;
	onHover: (character?: CharacterName) => void;
	selectedByP1: boolean;
	selectedByP2: boolean;
}) {
	const handleClick = useCallback(() => {
		onConfirm(character);
	}, [onConfirm, character]);
	const handleFocus = useCallback(() => {
		onFocusCharacter(character);
	}, [onFocusCharacter, character]);
	const handleMouseEnter = useCallback(() => {
		onHover(character);
	}, [onHover, character]);
	const handleMouseLeave = useCallback(() => {
		onHover();
	}, [onHover]);

	return (
		<button
			aria-label={`Select ${character}`}
			className={classNames(
				classes.option,
				classes.characterOption,
				selectedByP1 && classes.p1,
				selectedByP2 && classes.p2,
			)}
			data-highlighted={highlighted}
			data-selected={selectedByP1 || selectedByP2}
			disabled={disabled}
			onBlur={onBlur}
			onClick={handleClick}
			onFocus={handleFocus}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			type="button"
		>
			<img alt={character} className={classes.avatar} src={`avatars/${character}.png`} />
			<img alt={character} className={classes.avatar} src={`avatars/${character}-outline.png`} />
		</button>
	);
}

function CharacterOptions({
	currentPlayer,
	disabled,
	highlighted,
	onPick,
	onPreview,
	onRandom,
	playerOne,
	playerTwo,
}: {
	currentPlayer?: 1 | 2 | undefined;
	disabled: boolean;
	highlighted?: CharacterName | undefined;
	onPick: (character: CharacterName) => void;
	onPreview: (character?: CharacterName) => void;
	onRandom: (queue: CharacterName[]) => void;
	playerOne?: CharacterName | undefined;
	playerTwo?: CharacterName | undefined;
}) {
	const parentRef = useRef<HTMLDivElement>(null);
	const previewTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
	const hoveredCharacterRef = useRef<CharacterName | undefined>(undefined);

	const { play: playRandomizeAudio } = useSfx(RandomizeAudio);

	const { playHoverAudio, playDisabledAudio, playConfirmAudio } = useOptionSfx();

	const confirmCharacter = useCallback(
		(character: CharacterName) => {
			clearTimeout(previewTimeoutRef.current);
			onPick(character);
			playConfirmAudio();
		},
		[onPick, playConfirmAudio],
	);

	const onFocus = useCallback(
		(characterIndex: number) => {
			onPreview(characters[characterIndex]);
		},
		[onPreview],
	);
	useKeyboardNavigation({ ref: parentRef, initialIndex: -1, onFocus });

	const handleCharacterPreview = useCallback(
		(character?: CharacterName) => {
			clearTimeout(previewTimeoutRef.current);
			if (character) {
				previewTimeoutRef.current = setTimeout(() => {
					onPreview(character);
				}, 250);
			} else {
				onPreview();
			}
		},
		[onPreview],
	);

	useEffect(
		() => () => {
			clearTimeout(previewTimeoutRef.current);
		},
		[],
	);

	const handleBlur = useCallback(() => {
		// preview the hovered element when focus is moved outside options
		if (hoveredCharacterRef.current !== undefined && parentRef.current?.contains(document.activeElement) !== true) {
			handleCharacterPreview(hoveredCharacterRef.current);
		} else {
			handleCharacterPreview();
		}
	}, [handleCharacterPreview]);

	const handleFocus = useCallback(
		(character?: CharacterName) => {
			// if a character is hovered then hover audio has already been played. play only on keyboard focus.
			if (character !== hoveredCharacterRef.current) {
				playHoverAudio();
			}
		},
		[playHoverAudio],
	);

	const handleMouseMove = useCallback(
		(character?: CharacterName) => {
			hoveredCharacterRef.current = character;
			handleCharacterPreview(character);
			if (character) {
				playHoverAudio();
			}
		},
		[handleCharacterPreview, playHoverAudio],
	);

	const handleRandomOptionClick = useCallback(() => {
		onRandom(characters.toSorted(() => Math.random() - 0.5));
		playRandomizeAudio();
	}, [onRandom, playRandomizeAudio]);

	return (
		<div
			className={classes.options}
			data-turn={currentPlayer === undefined ? undefined : `p${currentPlayer}`}
			ref={parentRef}
		>
			{characters.map((character) => {
				const selectedByP1 = character === playerOne;
				const selectedByP2 = character === playerTwo;
				return (
					<CharacterOption
						character={character}
						disabled={disabled}
						highlighted={highlighted === character}
						key={character}
						onBlur={handleBlur}
						onConfirm={confirmCharacter}
						onFocusCharacter={handleFocus}
						onHover={handleMouseMove}
						selectedByP1={selectedByP1}
						selectedByP2={selectedByP2}
					/>
				);
			})}
			<LockedCharacterOption
				disabled={disabled}
				onClick={playDisabledAudio}
				onFocus={playHoverAudio}
				onMouseEnter={playHoverAudio}
			/>
			<RandomCharacterOption
				disabled={disabled}
				onClick={handleRandomOptionClick}
				onFocus={playHoverAudio}
				onMouseEnter={playHoverAudio}
			/>
		</div>
	);
}

export { CharacterOptions };
