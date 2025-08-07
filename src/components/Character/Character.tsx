import classes from "./Character.module.css";

function Character({ align, name }: { align: "left" | "right"; name?: string }) {
	return (
		<div className={`${classes.character} ${classes[align]}`}>
			<div className={classes.banner}>
				{!!name && <div className={classes.bannerText}>{name}</div>}
			</div>
			{!!name && (
				<div className={classes.selection}>
					<img
						className={classes.animation}
						src={`/animations/${name}.gif`}
						alt={name}
					/>
					<div className={classes.platform} />
				</div>
			)}
			{!!name && (
				<img
					// set key to force animation to re-run on character change
					key={name}
					className={classes.portrait}
					src={`/portraits/${name}.png`}
					alt={name}
				/>
			)}
		</div>
	);
}

export default Character;
