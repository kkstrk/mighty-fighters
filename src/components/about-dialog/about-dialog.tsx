import { useEffect, useRef } from "react";

import classes from "./about-dialog.module.css";

const AboutDialog = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
	const dialogRef = useRef<HTMLDialogElement>(null);

	// The element owns its open state natively (Esc, showModal); this keeps it in line with the prop.
	useEffect(() => {
		const dialog = dialogRef.current;
		if (dialog === null) {
			return;
		}
		if (open && !dialog.open) {
			dialog.showModal();
		} else if (!open && dialog.open) {
			dialog.close();
		}
	}, [open]);

	// Native listener: the backdrop is part of the dialog element, so only clicks
	// that target the dialog itself (not its content) are outside clicks.
	useEffect(() => {
		const dialog = dialogRef.current;
		if (dialog === null) {
			return;
		}
		const handleBackdropClick = (event: MouseEvent) => {
			if (event.target === dialog) {
				onClose();
			}
		};
		dialog.addEventListener("click", handleBackdropClick);
		return () => dialog.removeEventListener("click", handleBackdropClick);
	}, [onClose]);

	return (
		<dialog className={classes.dialog} onClose={onClose} ref={dialogRef}>
			<div className={classes.dialogContent}>
				<p>
					Art Direction, Sprite Design, & Animation:
					<br />
					<a href="https://robyncvhart.carrd.co/" rel="noopener noreferrer" target="_blank">
						Robyn C V Howl
					</a>
				</p>
				<p>
					Programming:
					<br />
					<a href="https://linktr.ee/kkstrk" rel="noopener noreferrer" target="_blank">
						Kasia Kosturek
					</a>
				</p>
				<p>
					Music and SFX:
					<br />
					<a href="https://www.cakeatjobs.com/" rel="noopener noreferrer" target="_blank">
						Kate Jacobs
					</a>
				</p>
				<p>
					Character Artists:
					<br />
					<a href="https://bsky.app/profile/parkerhowl.bsky.social" rel="noopener noreferrer" target="_blank">
						Parker Howl
					</a>
					<br />
					<a href="https://madartsyworks.carrd.co" rel="noopener noreferrer" target="_blank">
						Mads @/madartsyworks
					</a>
					<br />
					<a href="https://mariaclaire-art.carrd.co" rel="noopener noreferrer" target="_blank">
						Maria Clara @/mariaclaire_art
					</a>
				</p>
				<hr className={classes.separator} />
				<p>
					This website is hosted as an open-source project on{" "}
					<a href="https://github.com/kkstrk/mighty-fighters" rel="noopener noreferrer" target="_blank">
						GitHub
					</a>
					.
				</p>
				<button className={classes.closeButton} onClick={onClose} title="Close" type="button">
					X
				</button>
			</div>
		</dialog>
	);
};

export { AboutDialog };
