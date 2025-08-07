import { useRef, useState } from "react";
import type { CharacterName } from "./characters";
import Character from "./components/Character/Character";
import CharacterOptions from "./components/CharacterOptions/CharacterOptions";
import "./App.css";

function App() {
	const playerTurn = useRef<1 | 2>(1);
	const [playerOne, setPlayerOne] = useState<CharacterName>();
	const [playerTwo, setPlayerTwo] = useState<CharacterName>();

	const handleCharacterChange = (character: CharacterName) => {
		if (playerTurn.current === 1) {
			setPlayerOne(character);
		} else {
			setPlayerTwo(character);
		}
		playerTurn.current = playerTurn.current === 1 ? 2 : 1;
	};

	return (
		<>
			<main>
				<Character
					align="left"
					name={playerOne}
				/>
				<CharacterOptions
					onChange={handleCharacterChange}
					playerOne={playerOne}
					playerTwo={playerTwo}
				/>
				<Character
					align="right"
					name={playerTwo}
				/>
			</main>
			<footer></footer>
		</>
	);
}

export default App;
