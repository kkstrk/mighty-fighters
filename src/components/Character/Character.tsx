import classNames from "../../utils/classNames";
import classes from "./Character.module.css";

function Character({
	align,
	name,
	onUndo,
}: {
	align: "left" | "right";
	name?: string;
	onUndo?: () => void;
}) {
	return (
		<div className={classNames(classes.character, classes[align])}>
			<div className={classes.banner}>
				{!!name && <div className={classes.bannerText}>{name}</div>}
			</div>
			{!!name && (
				<>
					<div className={classes.selection}>
						<img
							className={classes.animation}
							src={`/mighty-fighters/animations/${name}.gif`}
							alt={`${name} animation`}
						/>
						<button
							className={classNames(
								classes.undoButton,
								!onUndo && classes.hiddenUndoButton,
							)}
							onClick={onUndo}
							type="button"
						>
							undo
						</button>
					</div>
					<img
						className={classes.platform}
						src={"/mighty-fighters/platform.png"}
						alt="Character platform"
					/>
				</>
			)}
			{!!name && (
				<img
					// set key to force animation to re-run on character change
					key={name}
					className={classes.portrait}
					src={`/mighty-fighters/portraits/${name}.png`}
					alt={`${name} portrait`}
				/>
			)}
		</div>
	);
}

export default Character;
