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
		}, 350);
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
	disabled: disabledProp,
	onChange,
	onPreview,
	playerOne,
	playerTwo,
}: {
	disabled: boolean;
	onChange: (character: CharacterName) => void;
	onPreview: (character?: CharacterName) => void;
	playerOne?: CharacterName;
	playerTwo?: CharacterName;
}) {
	const parentRef = useRef<HTMLDivElement>(null);
	const previewTimeoutRef = useRef<number | undefined>(undefined);
	const hoveredCharacterRef = useRef<CharacterName | undefined>(undefined);

	const [randomAnimatingQueue, setRandomAnimatingQueue] = useState<CharacterName[]>([]);

	const disabled = disabledProp || randomAnimatingQueue.length > 0;

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
		const availableCharacters = [...characters].sort(() => Math.random() - 0.5);
		setRandomAnimatingQueue(availableCharacters);
	}, []);

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
		>
			{characters.map((character) => {
				const highlighted = randomAnimatingQueue[0] === character;
				const selected = character === playerOne || character === playerTwo;
				return (
					<button
						key={character}
						data-highlighted={highlighted}
						data-selected={selected}
						disabled={disabled}
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
