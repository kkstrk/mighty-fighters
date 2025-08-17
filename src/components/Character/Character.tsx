import classes from "./Character.module.css";

function Character({
	align,
	name,
	onUndo,
}: {
	align: "left" | "right";
	name?: string;
	onUndo: () => void;
}) {
	return (
		<div className={`${classes.character} ${classes[align]}`}>
			<div className={classes.banner}>
				{!!name && <div className={classes.bannerText}>{name}</div>}
			</div>
			{!!name && (
				<>
					<div className={classes.selection}>
						<img
							className={classes.animation}
							src={`/mighty-fighters/animations/${name}.gif`}
							alt={name}
						/>
						<button
							onClick={onUndo}
							type="button"
						>
							undo
						</button>
					</div>
					<div className={classes.platform} />
				</>
			)}
			{!!name && (
				<img
					// set key to force animation to re-run on character change
					key={name}
					className={classes.portrait}
					src={`/mighty-fighters/portraits/${name}.png`}
					alt={name}
				/>
			)}
		</div>
	);
}

export default Character;
