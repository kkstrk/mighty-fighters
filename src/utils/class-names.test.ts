import { describe, expect, test } from "vite-plus/test";

import classNames from "./class-names";

describe("classNames", () => {
	it("returns empty string when no arguments provided", () => {
		expect(classNames()).toBe("");
	});

	it("joins multiple class names with a space", () => {
		expect(classNames("btn", "primary", "large")).toBe("btn primary large");
	});

	it("filters out non-string values", () => {
		expect(classNames("btn", null, undefined, false, 0, {}, [], () => {})).toBe("btn");
	});

	it("filters out empty strings", () => {
		expect(classNames("", "btn", "", "active")).toBe("btn active");
	});

	it("preserves original order of class names", () => {
		expect(classNames("first", "second", "third")).toBe("first second third");
	});

	it("does not split class names that already contain spaces", () => {
		expect(classNames("foo bar", "baz")).toBe("foo bar baz");
	});
});
