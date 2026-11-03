import { useEffect, useId, useRef } from "react";

import { Button } from "@/components/button/button";
import { PixelIcon } from "@/components/pixel-icon/pixel-icon";
import classes from "./about-dialog.module.css";

const AboutDialog = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
	const titleId = useId();
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
		<dialog aria-labelledby={titleId} className={classes.dialog} onClose={onClose} ref={dialogRef}>
			<header className={classes.header}>
				<h2 className={classes.title} id={titleId}>
					CREDITS
				</h2>
				<Button aria-label="Close" onClick={onClose} size="sm" title="Close" variant="danger">
					<PixelIcon name="close" />
				</Button>
			</header>
			<div className={classes.body}>
				<dl className={classes.credits}>
					<dt className={classes.term}>ART DIRECTION, SPRITE DESIGN, & ANIMATION</dt>
					<dd className={classes.definition}>
						<a
							className={classes.link}
							href="https://robyncvhart.carrd.co/"
							rel="noopener noreferrer"
							target="_blank"
						>
							Robyn C V Howl
						</a>
					</dd>
					<dt className={classes.term}>PROGRAMMING</dt>
					<dd className={classes.definition}>
						<a
							className={classes.link}
							href="https://linktr.ee/kkstrk"
							rel="noopener noreferrer"
							target="_blank"
						>
							Kasia Kosturek
						</a>
					</dd>
					<dt className={classes.term}>MUSIC AND SFX</dt>
					<dd className={classes.definition}>
						<a
							className={classes.link}
							href="https://www.cakeatjobs.com/"
							rel="noopener noreferrer"
							target="_blank"
						>
							Kate Jacobs
						</a>
					</dd>
					<dt className={classes.term}>CHARACTER ARTISTS</dt>
					<dd className={classes.definition}>
						<a
							className={classes.link}
							href="https://bsky.app/profile/parkerhowl.bsky.social"
							rel="noopener noreferrer"
							target="_blank"
						>
							Parker Howl
						</a>
						<br />
						<a
							className={classes.link}
							href="https://madartsyworks.carrd.co"
							rel="noopener noreferrer"
							target="_blank"
						>
							Mads @/madartsyworks
						</a>
						<br />
						<a
							className={classes.link}
							href="https://mariaclaire-art.carrd.co"
							rel="noopener noreferrer"
							target="_blank"
						>
							Maria Clara @/mariaclaire_art
						</a>
					</dd>
				</dl>
				<hr className={classes.separator} />
				<p>
					This website is hosted as an open-source project on{" "}
					<a
						className={classes.link}
						href="https://github.com/kkstrk/mighty-fighters"
						rel="noopener noreferrer"
						target="_blank"
					>
						GitHub
					</a>
					.
				</p>
			</div>
		</dialog>
	);
};

export { AboutDialog };
