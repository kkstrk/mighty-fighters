import classes from "./Button.module.css";

const Button = (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
	return (
		<button
			className={classes.button}
			type="button"
			{...props}
		>
			{props.children}
		</button>
	);
};

export default Button;
