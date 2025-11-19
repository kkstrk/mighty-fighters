import { useCallback, useEffect, useRef, useState } from "react";

import { useSound } from "@/contexts/SoundContext";
import useOptionSfx from "@/utils/useOptionSfx/useOptionSfx";
import classes from "./StartScreen.module.css";

const START_OPTION = "start";
const SOUND_OPTION = "sound";
const ABOUT_OPTION = "about";

const options = [START_OPTION, SOUND_OPTION, ABOUT_OPTION] as const;

const StartScreen = ({
	onStartClick,
	onAboutClick,
}: {
	onStartClick: () => void;
	onAboutClick: () => void;
}) => {
	const [selectedOption, setSelectedOption] = useState<(typeof options)[number]>(START_OPTION);
	const selectedIndexRef = useRef(0);
	const { isMuted, startMusic, toggleMute } = useSound();
	const { playHoverAudio } = useOptionSfx();

	const handleStartClick = useCallback(() => {
		setSelectedOption(START_OPTION);
		onStartClick();
		startMusic();
	}, [onStartClick, startMusic]);

	const handleSoundClick = useCallback(() => {
		setSelectedOption(SOUND_OPTION);
		toggleMute();
	}, [toggleMute]);

	const handleAboutClick = useCallback(() => {
		setSelectedOption(ABOUT_OPTION);
		onAboutClick();
	}, [onAboutClick]);

	useEffect(() => {
		selectedIndexRef.current = options.indexOf(selectedOption);
	}, [selectedOption]);

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Tab" || event.key === "ArrowUp" || event.key === "ArrowDown") {
				event.preventDefault();

				const currentIndex = selectedIndexRef.current;
				let nextIndex: number;

				if (event.key === "ArrowUp") {
					nextIndex = (currentIndex - 1 + options.length) % options.length;
				} else {
					// event.key is "Tab" or "ArrowDown"
					nextIndex = (currentIndex + 1) % options.length;
				}

				setSelectedOption(options[nextIndex]);
				playHoverAudio();
			}

			if (event.key === "Enter" || event.key === " ") {
				event.preventDefault();
				const currentOption = options[selectedIndexRef.current];

				if (currentOption === START_OPTION) {
					handleStartClick();
				} else if (currentOption === SOUND_OPTION) {
					handleSoundClick();
				} else if (currentOption === ABOUT_OPTION) {
					handleAboutClick();
				}
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [handleStartClick, handleSoundClick, handleAboutClick, playHoverAudio]);

	return (
		<>
			<main className={classes.main}>
				<div className={classes.title}></div>
				<ul>
					<li data-selected={selectedOption === START_OPTION}>
						<button
							onClick={handleStartClick}
							onMouseEnter={playHoverAudio}
							type="button"
						>
							{START_OPTION}
						</button>
					</li>
					<li data-selected={selectedOption === SOUND_OPTION}>
						<button
							onClick={handleSoundClick}
							onMouseEnter={playHoverAudio}
							type="button"
						>
							{selectedOption === SOUND_OPTION
								? `${SOUND_OPTION}: ${isMuted ? "off" : "on"}`
								: SOUND_OPTION}
						</button>
					</li>
					<li data-selected={selectedOption === ABOUT_OPTION}>
						<button
							onClick={handleAboutClick}
							onMouseEnter={playHoverAudio}
							type="button"
						>
							{ABOUT_OPTION}
						</button>
					</li>
				</ul>
			</main>
			<footer>
				<p className={classes.footerNote}>
					This project is unofficial fan content and is not approved or endorsed in any
					way by Critical&nbsp;Role.
				</p>
			</footer>
		</>
	);
};

export default StartScreen;
