const classNames = (...classes: unknown[]) => {
	return classes
		.filter((value) => {
			if (typeof value === "string") {
				return value;
			}
		})
		.join(" ");
};

export default classNames;
