import { useRef } from "react";
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
	const previewTimeoutRef = useRef<number | null>(null);
	const disabled = !!playerOne && !!playerTwo;

	useKeyboardNavigation(parentRef);

	const handleRandomOptionClick = () => {
		const availableCharacters = characters.filter(
			(character) => character !== playerOne && character !== playerTwo,
		);
		const randomIndex = Math.floor(Math.random() * availableCharacters.length);
		onChange(availableCharacters[randomIndex]);
	};

	const handleMouseEnter = (character: CharacterName) => {
		previewTimeoutRef.current = setTimeout(() => {
			onPreview(character);
		}, 250);
	};

	const handleMouseLeave = () => {
		if (previewTimeoutRef.current) {
			clearTimeout(previewTimeoutRef.current);
		}
		onPreview();
	};

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
						onMouseEnter={() => handleMouseEnter(character)}
						onMouseLeave={() => handleMouseLeave()}
						type="button"
						aria-label={`Select ${character}`}
					>
						<img
							src={
								selected
									? `/mighty-fighters/avatars/${character}-outline.png`
									: `/mighty-fighters/avatars/${character}.png`
							}
							alt={character}
						/>
					</button>
				);
			})}
			<LockedCharacterOption />
			<RandomCharacterOption
				disabled={disabled}
				onClick={handleRandomOptionClick}
			/>
		</div>
	);
}

export default CharacterOptions;
