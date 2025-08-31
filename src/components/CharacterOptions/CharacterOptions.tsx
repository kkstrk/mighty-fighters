import { useCallback, useRef } from "react";
import characters, { type CharacterName } from "../../characters";
import HexLockedImage from "./assets/hex-locked.png";
import HexRandomImage from "./assets/hex-random.png";
import classes from "./CharacterOptions.module.css";
import useKeyboardNavigation from "./useKeyboardNavigation";

function LockedCharacterOption() {
	return (
		<button
			disabled
			type="button"
		>
			<img
				alt="Locked character"
				src={HexLockedImage}
				style={{ objectFit: "cover" }}
			/>
		</button>
	);
}

function RandomCharacterOption(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
	return (
		<button
			{...props}
			aria-label="Pick a random character"
			type="button"
		>
			<img
				alt="Pick a random character"
				src={HexRandomImage}
				style={{ objectFit: "cover" }}
			/>
		</button>
	);
}

function CharacterOptions({
	onChange,
	onPreview,
	playerOne,
	playerTwo,
}: {
	onChange: (character: CharacterName) => void;
	onPreview: (character?: CharacterName) => void;
	playerOne?: CharacterName;
	playerTwo?: CharacterName;
}) {
	const parentRef = useRef<HTMLDivElement>(null);
	const previewTimeoutRef = useRef<number | undefined>(undefined);
	const hoveredCharacterRef = useRef<CharacterName | undefined>(undefined);
	const randomCharacterRef = useRef<CharacterName | undefined>(undefined);

	const disabled = !!playerOne && !!playerTwo;

	useKeyboardNavigation({ ref: parentRef, initialIndex: -1 });

	const getRandomCharacter = useCallback(() => {
		if (randomCharacterRef.current) {
			return randomCharacterRef.current;
		}
		const availableCharacters = characters.filter(
			(character) => character !== playerOne && character !== playerTwo,
		);
		const randomIndex = Math.floor(Math.random() * availableCharacters.length);
		const character = availableCharacters[randomIndex];
		return character;
	}, [playerOne, playerTwo]);

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

	const handleMouseMove = useCallback(
		(character?: CharacterName) => {
			hoveredCharacterRef.current = character;
			if (parentRef.current?.contains(document.activeElement)) {
				return;
			}
			handleCharacterPreview(character);
		},
		[handleCharacterPreview],
	);

	const handleRandomOptionFocus = useCallback(() => {
		const character = getRandomCharacter();
		randomCharacterRef.current = character;
		handleCharacterPreview(character);
	}, [handleCharacterPreview, getRandomCharacter]);

	const handleRandomOptionBlur = useCallback(() => {
		randomCharacterRef.current = undefined;
		handleBlur();
	}, [handleBlur]);

	const handleRandomOptionMouseEnter = useCallback(() => {
		const character = getRandomCharacter();
		randomCharacterRef.current = character;
		handleMouseMove(character);
	}, [handleMouseMove, getRandomCharacter]);

	const handleRandomOptionMouseLeave = useCallback(() => {
		randomCharacterRef.current = undefined;
		handleMouseMove();
	}, [handleMouseMove]);

	const handleRandomOptionClick = useCallback(() => {
		const character = getRandomCharacter();
		randomCharacterRef.current = undefined;
		onChange(character);
	}, [getRandomCharacter, onChange]);

	return (
		<div
			ref={parentRef}
			className={classes.options}
		>
			{characters.map((character) => {
				const selected = character === playerOne || character === playerTwo;
				return (
					<button
						key={character}
						data-selected={selected}
						disabled={disabled || selected}
						onClick={() => onChange(character)}
						onFocus={() => handleCharacterPreview(character)}
						onBlur={handleBlur}
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
			<LockedCharacterOption />
			<RandomCharacterOption
				disabled={disabled}
				onClick={handleRandomOptionClick}
				onFocus={handleRandomOptionFocus}
				onBlur={handleRandomOptionBlur}
				onMouseEnter={handleRandomOptionMouseEnter}
				onMouseLeave={handleRandomOptionMouseLeave}
			/>
		</div>
	);
}

export default CharacterOptions;
