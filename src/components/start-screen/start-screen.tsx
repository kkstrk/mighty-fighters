import { useCallback, useEffect, useState } from "react";

import { useSound } from "@/contexts/use-sound";
import { useOptionSfx } from "@/utils/use-option-sfx/use-option-sfx";
import classes from "./start-screen.module.css";

const START_OPTION = "start";
const SOUND_OPTION = "sound";
const ABOUT_OPTION = "about";

const options = [START_OPTION, SOUND_OPTION, ABOUT_OPTION] as const;

const StartScreen = ({
	keyboardEnabled,
	onStartClick,
	onAboutClick,
}: {
	keyboardEnabled: boolean;
	onStartClick: () => void;
	onAboutClick: () => void;
}) => {
	const [selectedOption, setSelectedOption] = useState<(typeof options)[number]>(START_OPTION);
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
		if (!keyboardEnabled) {
			return;
		}
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Tab" || event.key === "ArrowUp" || event.key === "ArrowDown") {
				event.preventDefault();

				const currentIndex = options.indexOf(selectedOption);
				let nextIndex: number;

				if (event.key === "ArrowUp") {
					nextIndex = (currentIndex - 1 + options.length) % options.length;
				} else {
					// event.key is "Tab" or "ArrowDown"
					nextIndex = (currentIndex + 1) % options.length;
				}

				setSelectedOption(options[nextIndex] ?? START_OPTION);
				playHoverAudio();
			}

			if (event.key === "Enter" || event.key === " ") {
				event.preventDefault();
				if (selectedOption === START_OPTION) {
					handleStartClick();
				} else if (selectedOption === SOUND_OPTION) {
					handleSoundClick();
				} else if (selectedOption === ABOUT_OPTION) {
					handleAboutClick();
				}
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [keyboardEnabled, selectedOption, handleStartClick, handleSoundClick, handleAboutClick, playHoverAudio]);

	return (
		<>
			<main className={classes.main}>
				<div className={classes.title} />
				<ul className={classes.list}>
					<li className={classes.item} data-selected={selectedOption === START_OPTION}>
						<button
							className={classes.option}
							onClick={handleStartClick}
							onMouseEnter={playHoverAudio}
							type="button"
						>
							{START_OPTION}
						</button>
					</li>
					<li className={classes.item} data-selected={selectedOption === SOUND_OPTION}>
						<button
							className={classes.option}
							onClick={handleSoundClick}
							onMouseEnter={playHoverAudio}
							type="button"
						>
							{selectedOption === SOUND_OPTION
								? `${SOUND_OPTION}: ${isMuted ? "off" : "on"}`
								: SOUND_OPTION}
						</button>
					</li>
					<li className={classes.item} data-selected={selectedOption === ABOUT_OPTION}>
						<button
							className={classes.option}
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
					This project is unofficial fan content and is not approved or endorsed in any way by
					Critical&nbsp;Role.
				</p>
			</footer>
		</>
	);
};

export { StartScreen };
