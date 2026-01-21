import { useImperativeHandle, useRef } from "react";

import classes from "./about-dialog.module.css";

interface AboutDialogRef {
	open: () => void;
}

const AboutDialog = ({ ref }: { ref: React.RefObject<AboutDialogRef | null> }) => {
	const dialogRef = useRef<HTMLDialogElement>(null);

	useImperativeHandle(ref, () => ({
		open: () => {
			dialogRef.current?.showModal();
		},
	}));

	const closeDialog = (event: React.MouseEvent<HTMLDialogElement | HTMLButtonElement>) => {
		event.stopPropagation();
		dialogRef.current?.close();
	};

	return (
		<>
			{/** biome-ignore lint/a11y/useKeyWithClickEvents: dialog should not close on key press */}
			<dialog
				className={classes.dialog}
				onClick={closeDialog}
				ref={dialogRef}
			>
				{/** biome-ignore lint/a11y/useKeyWithClickEvents: do not propagate click event to parent */}
				{/** biome-ignore lint/a11y/noStaticElementInteractions: workaround for dialog closing on outside click */}
				<div
					className={classes.dialogContent}
					onClick={(event) => event.stopPropagation()}
				>
					<p>
						Art Direction, Sprite Design, & Animation:
						<br />
						<a
							href="https://robyncvhart.carrd.co/"
							rel="noopener noreferrer"
							target="_blank"
						>
							Robyn C V Howl
						</a>
					</p>
					<p>
						Programming:
						<br />
						<a
							href="https://linktr.ee/kkstrk"
							rel="noopener noreferrer"
							target="_blank"
						>
							Kasia Kosturek
						</a>
					</p>
					<p>
						Music and SFX:
						<br />
						<a
							href="https://www.cakeatjobs.com/"
							rel="noopener noreferrer"
							target="_blank"
						>
							Kate Jacobs
						</a>
					</p>
					<p>
						Character Artists:
						<br />
						<a
							href="https://bsky.app/profile/parkerhowl.bsky.social"
							rel="noopener noreferrer"
							target="_blank"
						>
							Parker Howl
						</a>
						<br />
						<a
							href="https://madartsyworks.carrd.co"
							rel="noopener noreferrer"
							target="_blank"
						>
							Mads @/madartsyworks
						</a>
						<br />
						<a
							href="https://mariaclaire-art.carrd.co"
							rel="noopener noreferrer"
							target="_blank"
						>
							Maria Clara @/mariaclaire_art
						</a>
					</p>
					<hr className={classes.separator} />
					<p>
						This website is hosted as an open-source project on{" "}
						<a
							href="https://github.com/kkstrk/mighty-fighters"
							rel="noopener noreferrer"
							target="_blank"
						>
							GitHub
						</a>
						.
					</p>
					<button
						className={classes.closeButton}
						onClick={closeDialog}
						title="Close"
						type="button"
					>
						X
					</button>
				</div>
			</dialog>
		</>
	);
};

export default AboutDialog;
export type { AboutDialogRef };
