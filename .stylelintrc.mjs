import { globSync } from "node:fs";

// Tokens live in global CSS; a module may use only custom properties defined there.
const globalCss = globSync("**/*.css", {
	exclude: (path) => /(^|\/)(node_modules|dist|build|coverage)$/u.test(path) || path.endsWith(".module.css"),
});

/** @type {import("stylelint").Config} */
const config = {
	allowEmptyInput: true,
	reportDescriptionlessDisables: true,
	reportNeedlessDisables: true,
	extends: ["stylelint-config-standard", "stylelint-config-recess-order"],
	plugins: [
		"stylelint-plugin-logical-css",
		"stylelint-plugin-use-baseline",
		"stylelint-declaration-strict-value",
		"stylelint-value-no-unknown-custom-properties",
		"stylelint-high-performance-animation",
		"stylelint-plugin-defensive-css",
		"./stylelint-rules.js",
	],
	ignoreFiles: ["**/dist/**", "**/build/**", "**/coverage/**"],
	rules: {
		"selector-max-id": 0,
		"color-named": "never",
		"selector-pseudo-element-disallowed-list": ["/^-webkit-scrollbar/"],
		"selector-pseudo-class-disallowed-list": ["focus"],
		"declaration-property-value-disallowed-list": {
			transition: ["/\\ball\\b/"],
			"transition-property": ["all"],
		},
		// False positives with native nesting.
		"no-descending-specificity": null,
		// Blank lines between groups of custom properties are intentional.
		"custom-property-empty-line-before": null,
		// Motion is opt-in (`prefers-reduced-motion: no-preference`), so no reset needs to win.
		"declaration-no-important": true,
		"at-rule-property-required-list": { property: ["syntax", "inherits"] },
		// Naming of custom properties is a project convention, not a standard.
		"custom-property-pattern": null,
		"plugin/use-baseline": [
			true,
			{
				// Evergreen browsers only.
				available: "newly",
				// Each degrades safely where unsupported; overscroll-behavior is required by defensive-css,
				// line-clamp is the standard twin of -webkit-line-clamp.
				ignoreProperties: {
					"/^overscroll-behavior/": ["/^.+$/"],
					"user-select": ["/^.+$/"],
					"line-clamp": ["/^.+$/"],
				},
			},
		],
		"logical-css/require-logical-properties": true,
		"logical-css/require-logical-keywords": true,
		"logical-css/require-logical-units": true,
		"plugin/no-low-performance-animation-properties": [
			true,
			{ ignoreProperties: ["color", "background-color", "border-color", "box-shadow", "outline-color"] },
		],
		"defensive-css/no-accidental-hover": true,
		"defensive-css/no-unsafe-will-change": true,
		"defensive-css/require-background-repeat": true,
		"defensive-css/require-overscroll-behavior": true,
		"defensive-css/require-prefers-reduced-motion": true,
		"defensive-css/require-dynamic-viewport-height": [true, { severity: "error" }],
	},
	overrides: [
		{
			files: ["**/*.module.css"],
			extends: ["stylelint-config-css-modules"],
			rules: {
				"selector-class-pattern": ["^[a-z][a-zA-Z0-9]*$", { message: "Use camelCase class names" }],
				"selector-max-universal": 0,
				"selector-max-type": 0,
				"selector-max-compound-selectors": 2,
				"max-nesting-depth": 2,
				"selector-disallowed-list": ["/&[_-]/", "/^:global/"],
				"selector-nested-pattern": "&",
				"color-no-hex": true,
				"media-feature-name-disallowed-list": ["prefers-color-scheme"],
				"function-disallowed-list": ["light-dark", "/^(rgba?|hsla?|hwb|lab|lch|oklab|oklch)$/"],
				"declaration-property-unit-disallowed-list": { "line-height": ["px"] },
				"scale-unlimited/declaration-strict-value": [
					[
						"/color$/",
						"fill",
						"stroke",
						"font-size",
						"font-family",
						"font-weight",
						"border-radius",
						"box-shadow",
						"/^(margin|padding|gap|row-gap|column-gap)/",
						"transition-duration",
						"animation-duration",
					],
					{
						ignoreValues: ["0", "100%", "auto", "none", "inherit", "initial", "unset", "currentcolor", "transparent"],
					},
				],
				"csstools/value-no-unknown-custom-properties": [true, { importFrom: globalCss }],
				"local/no-var-fallback": true,
				"local/no-root-margin": true,
				"local/named-container": true,
			},
		},
	],
};

export default config;
