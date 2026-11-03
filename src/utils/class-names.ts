const classNames = (...classes: unknown[]) =>
	classes
		.filter((value) => {
			if (typeof value === "string") {
				return value;
			}
			return false;
		})
		.join(" ");

export { classNames };
