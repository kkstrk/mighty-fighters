import { useRef } from "react";
import Button from "../Button/Button";
import classes from "./AboutButton.module.css";

const InfoButton = () => {
	const dialogRef = useRef<HTMLDialogElement>(null);

	const handleButtonClick = () => {
		if (dialogRef.current?.open) {
			dialogRef.current.close();
		} else {
			dialogRef.current?.showModal();
		}
	};

	const closeDialog = () => {
		dialogRef.current?.close();
	};

	return (
		<>
			<Button
				title="About"
				onClick={handleButtonClick}
			>
				i
			</Button>
			{/** biome-ignore lint/a11y/useKeyWithClickEvents: dialog should not close on key press */}
			<dialog
				className={classes.dialog}
				ref={dialogRef}
				onClick={closeDialog}
			>
				{/** biome-ignore lint/a11y/useKeyWithClickEvents: do not propagate click event to parent */}
				{/** biome-ignore lint/a11y/noStaticElementInteractions: workaround for dialog closing on outside click */}
				<div
					className={classes.dialogContent}
					onClick={(event) => event.stopPropagation()}
				>
					<p>about...</p>
					<p>
						The game is hosted as an open-source project on{" "}
						<a href="https://github.com/kkstrk/mighty-fighters">GitHub</a>.
					</p>
					<button
						title="Close"
						type="button"
						onClick={closeDialog}
						className={classes.closeButton}
					>
						X
					</button>
				</div>
			</dialog>
		</>
	);
};

export default InfoButton;
