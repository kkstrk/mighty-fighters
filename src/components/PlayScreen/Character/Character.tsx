import Button from "@/components/Button/Button";
import classNames from "@/utils/classNames";
import UndoIcon from "./assets/undo.png";
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
							alt={`${name} animation`}
							className={classes.animation}
							src={`/mighty-fighters/animations/${name}.gif`}
						/>
						<div
							className={classNames(
								classes.undoButton,
								!onUndo && classes.hiddenUndoButton,
							)}
						>
							<Button onClick={onUndo}>
								<img
									alt="Undo"
									src={UndoIcon}
								/>
							</Button>
						</div>
					</div>
					<img
						alt="Character platform"
						className={classes.platform}
						src={"/mighty-fighters/platform.png"}
					/>
				</>
			)}
			{!!name && (
				<img
					// set key to force animation to re-run on character change
					alt={`${name} portrait`}
					className={classes.portrait}
					key={name}
					src={`/mighty-fighters/portraits/${name}.png`}
				/>
			)}
		</div>
	);
}

export default Character;
