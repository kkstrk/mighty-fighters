import { useEffect, useRef } from "react";
import characters, { type CharacterName } from "../../characters";
import classes from "./CharacterOptions.module.css";

function LockedCharacterOption() {
	return (
		<button
			disabled
			type="button"
		>
			<img
				alt="Locked character"
				src="/hex/locked.png"
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
				src="/hex/random.png"
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

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			console.log(event);
		};
		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, []);

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
					>
						<img
							src={
								selected
									? `/avatars/${character}-outline.png`
									: `/avatars/${character}.png`
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
