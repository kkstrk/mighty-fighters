import { useCallback, useEffect, useRef, useState } from "react";
import characters, { type CharacterName } from "@/characters";
import classNames from "@/utils/classNames";
import useOptionSfx from "@/utils/useOptionSfx/useOptionSfx";
import useSfx from "@/utils/useSfx";
import RandomizeAudio from "./assets/randomize.wav";
import classes from "./CharacterOptions.module.css";
import useKeyboardNavigation from "./useKeyboardNavigation";

function LockedCharacterOption(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
	const [animating, setAnimating] = useState(false);
	const animationTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

	const handleClick = useCallback(
		(event: React.MouseEvent<HTMLButtonElement>) => {
			props.onClick?.(event);
			if (animationTimeoutRef.current) {
				clearTimeout(animationTimeoutRef.current);
			}
			setAnimating(true);
			animationTimeoutRef.current = setTimeout(() => {
				setAnimating(false);
			}, 350);
		},
		[props.onClick],
	);

	useEffect(() => {
		return () => {
			if (animationTimeoutRef.current) {
				clearTimeout(animationTimeoutRef.current);
			}
		};
	}, []);

	return (
		<button
			{...props}
			className={classNames(classes.lockedOption, animating && classes.lockedOptionAnimating)}
			aria-label="Locked character"
			onClick={handleClick}
			type="button"
		/>
	);
}

function RandomCharacterOption(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
	return (
		<button
			{...props}
			className={classes.randomOption}
			aria-label="Pick a random character"
			type="button"
		/>
	);
}

function CharacterOptions({
	currentPlayer,
	disabled: disabledProp,
	onChange,
	onPreview,
	playerOne,
	playerTwo,
}: {
	currentPlayer?: 1 | 2;
	disabled: boolean;
	onChange: (character: CharacterName) => void;
	onPreview: (character?: CharacterName) => void;
	playerOne?: CharacterName;
	playerTwo?: CharacterName;
}) {
	const parentRef = useRef<HTMLDivElement>(null);
	const previewTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
	const hoveredCharacterRef = useRef<CharacterName | undefined>(undefined);

	const { play: playRandomizeAudio } = useSfx(RandomizeAudio);
	const [randomAnimatingQueue, setRandomAnimatingQueue] = useState<CharacterName[]>([]);

	const { playHoverAudio, playDisabledAudio, playConfirmAudio } = useOptionSfx();

	const disabled = disabledProp || randomAnimatingQueue.length > 0;

	const confirmCharacter = useCallback(
		(character: CharacterName) => {
			onChange(character);
			playConfirmAudio();
		},
		[onChange, playConfirmAudio],
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
			if (character) {
				previewTimeoutRef.current = setTimeout(() => {
					onPreview(character);
				}, 250);
			} else {
				if (previewTimeoutRef.current) {
					clearTimeout(previewTimeoutRef.current);
				}
				onPreview();
			}
		},
		[onPreview],
	);

	const handleBlur = useCallback(() => {
		// preview the hovered element when focus is moved outside options
		if (hoveredCharacterRef.current && !parentRef.current?.contains(document.activeElement)) {
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
		const availableCharacters = [...characters].sort(() => Math.random() - 0.5);
		setRandomAnimatingQueue(availableCharacters);
		playRandomizeAudio();
	}, [playRandomizeAudio]);

	useEffect(() => {
		if (randomAnimatingQueue.length === 0) {
			return;
		}

		if (randomAnimatingQueue.length === 1) {
			onChange(randomAnimatingQueue[0]);
			setRandomAnimatingQueue([]);
			return;
		}

		const timeout = setTimeout(() => {
			setRandomAnimatingQueue((queue) => queue.slice(1));
		}, 150);
		return () => clearTimeout(timeout);
	}, [onChange, randomAnimatingQueue]);

	return (
		<div
			ref={parentRef}
			className={classes.options}
			data-turn={currentPlayer === 1 ? "p1" : currentPlayer === 2 ? "p2" : undefined}
		>
			{characters.map((character) => {
				const highlighted = randomAnimatingQueue[0] === character;
				const selectedByP1 = character === playerOne;
				const selectedByP2 = character === playerTwo;
				return (
					<button
						key={character}
						className={classNames(
							classes.characterOption,
							selectedByP1 && classes.p1,
							selectedByP2 && classes.p2,
						)}
						data-highlighted={highlighted}
						data-selected={selectedByP1 || selectedByP2}
						disabled={disabled}
						onClick={() => confirmCharacter(character)}
						onBlur={handleBlur}
						onFocus={() => handleFocus(character)}
						onMouseEnter={() => handleMouseMove(character)}
						onMouseLeave={() => handleMouseMove()}
						type="button"
						aria-label={`Select ${character}`}
					>
						<img
							src={`/mighty-fighters/avatars/${character}.png`}
							alt={character}
						/>
						<img
							src={`/mighty-fighters/avatars/${character}-outline.png`}
							alt={character}
						/>
					</button>
				);
			})}
			<LockedCharacterOption
				disabled={disabled}
				onClick={playDisabledAudio}
				onMouseEnter={playHoverAudio}
				onFocus={playHoverAudio}
			/>
			<RandomCharacterOption
				disabled={disabled}
				onClick={handleRandomOptionClick}
				onMouseEnter={playHoverAudio}
				onFocus={playHoverAudio}
			/>
		</div>
	);
}

export default CharacterOptions;
