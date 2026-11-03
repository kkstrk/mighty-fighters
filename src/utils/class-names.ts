const classNames = (...classes: unknown[]) =>
	classes.filter((value): value is string => typeof value === "string" && value.length > 0).join(" ");

export { classNames };
