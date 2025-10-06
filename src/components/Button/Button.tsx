import classes from "./Button.module.css";

const Button = (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
	<button
		{...props}
		className={classes.button}
		type="button"
	/>
);

export default Button;
