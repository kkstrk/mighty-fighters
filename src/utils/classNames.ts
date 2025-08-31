const classNames = (...classes: unknown[]) => {
	return classes
		.filter((value) => {
			if (typeof value === "string") {
				return value;
			}
			return false;
		})
		.join(" ");
};

export default classNames;
