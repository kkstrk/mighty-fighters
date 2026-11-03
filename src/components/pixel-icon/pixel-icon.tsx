import classes from "./pixel-icon.module.css";

type IconName = "sound-on" | "sound-off" | "info" | "undo" | "close";

const speaker = "M2 6h3v4H2zM5 5h2v6H5zM7 3h2v10H7z";

const paths: Record<IconName, string> = {
	"sound-on": `${speaker}M11 5h1v6h-1zM13 3h1v10h-1z`,
	"sound-off": `${speaker}M10 5h1v1h-1zM11 6h1v1h-1zM12 7h1v2h-1zM11 9h1v1h-1zM10 10h1v1h-1zM14 5h-1v1h1zM13 9h1v1h-1zM14 10h-1v1h1z`,
	info: "M7 2h3v3H7zM5 6h5v6h2v2H4v-2h2V8H5z",
	undo: "M5 2h6v2H5zM3 4h2v2H3zM11 4h2v2h-2zM3 6h2v4H3zM11 6h2v2h2v2h-6V8h2zM3 10h2v2H3zM5 12h6v2H5z",
	close: "M3 3h2v2H3zM5 5h2v2H5zM7 7h2v2H7zM9 9h2v2H9zM11 11h2v2h-2zM11 3h2v2h-2zM9 5h2v2H9zM5 9h2v2H5zM3 11h2v2H3z",
};

const PixelIcon = ({ name }: { name: IconName }) => (
	<svg
		aria-hidden="true"
		className={classes.icon}
		fill="currentColor"
		focusable="false"
		shapeRendering="crispEdges"
		viewBox="0 0 16 16"
	>
		<path d={paths[name]} />
	</svg>
);

export { PixelIcon };
