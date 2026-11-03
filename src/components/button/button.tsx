import classes from "./button.module.css";

type ButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type"> & {
	variant?: "default" | "primary" | "danger" | undefined;
	size?: "sm" | "md" | "lg" | undefined;
	shape?: "square" | "text" | undefined;
};

const Button = ({ variant = "default", size = "md", shape = "square", ...props }: ButtonProps) => (
	<button
		{...props}
		className={classes.button}
		data-shape={shape}
		data-size={size}
		data-variant={variant}
		type="button"
	/>
);

export { Button };
