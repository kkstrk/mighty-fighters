import { useCallback, useEffect, useRef, useState } from "react";
import characters, { type CharacterName } from "../../characters";
import classNames from "../../utils/classNames";
import classes from "./CharacterOptions.module.css";
import useKeyboardNavigation from "./useKeyboardNavigation";

function LockedCharacterOption(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
	const [animating, setAnimating] = useState(false);
	const animationTimeoutRef = useRef<number | undefined>(undefined);

	const handleClick = useCallback(() => {
		if (animationTimeoutRef.current) {
			clearTimeout(animationTimeoutRef.current);
		}
		setAnimating(true);
		animationTimeoutRef.current = setTimeout(() => {
			setAnimating(false);
		}, 750);
	}, []);

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

	const disabled = !!playerOne && !!playerTwo;

	useKeyboardNavigation({ ref: parentRef, initialIndex: -1 });

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

	const handleRandomOptionClick = useCallback(() => {
		const availableCharacters = characters.filter(
			(character) => character !== playerOne && character !== playerTwo,
		);
		const randomIndex = Math.floor(Math.random() * availableCharacters.length);
		const character = availableCharacters[randomIndex];
		onChange(character);
	}, [onChange, playerOne, playerTwo]);

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
			<LockedCharacterOption disabled={disabled} />
			<RandomCharacterOption
				disabled={disabled}
				onClick={handleRandomOptionClick}
			/>
		</div>
	);
}

export default CharacterOptions;
