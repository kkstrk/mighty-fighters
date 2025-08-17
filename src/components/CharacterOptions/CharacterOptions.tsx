import { useRef } from "react";
import characters, { type CharacterName } from "../../characters";
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
				src="/mighty-fighters/hex/locked.png"
				style={{ objectFit: "cover" }}
			/>
		</button>
	);
}

function RandomCharacterOption() {
	return (
		<button type="button">
			<img
				alt="Pick a random character"
				src="/mighty-fighters/hex/random.png"
				style={{ objectFit: "cover" }}
			/>
		</button>
	);
}

function CharacterOptions({
	onChange,
	playerOne,
	playerTwo,
}: {
	onChange: (character: CharacterName) => void;
	playerOne?: CharacterName;
	playerTwo?: CharacterName;
}) {
	const parentRef = useRef<HTMLDivElement>(null);

	useKeyboardNavigation(parentRef);

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
						onClick={() => onChange(character)}
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
			<RandomCharacterOption />
		</div>
	);
}

export default CharacterOptions;
