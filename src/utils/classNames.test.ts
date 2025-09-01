import { describe, expect, test } from "vitest";
import classNames from "./classNames";

describe("classNames", () => {
	test("returns empty string when no arguments provided", () => {
		expect(classNames()).toBe("");
	});

	test("joins multiple class names with a space", () => {
		expect(classNames("btn", "primary", "large")).toBe("btn primary large");
	});

	test("filters out non-string values", () => {
		expect(classNames("btn", null, undefined, false, 0, {}, [], () => {})).toBe("btn");
	});

	test("filters out empty strings", () => {
		expect(classNames("", "btn", "", "active")).toBe("btn active");
	});

	test("preserves original order of class names", () => {
		expect(classNames("first", "second", "third")).toBe("first second third");
	});

	test("does not split class names that already contain spaces", () => {
		expect(classNames("foo bar", "baz")).toBe("foo bar baz");
	});
});
