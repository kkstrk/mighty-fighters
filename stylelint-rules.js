import stylelint from "stylelint";

const { createPlugin, utils } = stylelint;

const rootSelector = /^\.root(?![\w-])[^\s>+~]*$/u;
const nestedRootSelector = /^&(?![\w-])[^\s>+~]*$/u;

/**
 * `.root` with only pseudo-classes, attributes or classes after it, or `&` with that suffix under such a rule.
 * @param {string} selector
 * @param {boolean} parentTargetsRoot
 */
const targetsRoot = (selector, parentTargetsRoot) =>
	selector
		.split(/,(?![^(]*\))/u)
		.map((part) => part.trim())
		.some((part) => rootSelector.test(part) || (parentTargetsRoot && nestedRootSelector.test(part)));

const noVarFallbackName = "local/no-var-fallback";
const noVarFallbackMessages = utils.ruleMessages(noVarFallbackName, {
	fallback: "Remove the var() fallback; define the token on :root",
});
const noVarFallback = createPlugin(noVarFallbackName, (primary) => (root, result) => {
	if (primary !== true) {
		return;
	}
	root.walkDecls((decl) => {
		if (/var\(\s*--[\w-]+\s*,/u.test(decl.value)) {
			utils.report({ ruleName: noVarFallbackName, result, node: decl, message: noVarFallbackMessages.fallback });
		}
	});
});

const noRootMarginName = "local/no-root-margin";
const noRootMarginMessages = utils.ruleMessages(noRootMarginName, {
	margin: "Do not set margin on .root; the parent controls spacing",
});
const noRootMargin = createPlugin(noRootMarginName, (primary) => (root, result) => {
	if (primary !== true) {
		return;
	}
	// walkRules visits a parent before its children.
	const rootRules = new WeakSet();
	root.walkRules((rule) => {
		let { parent } = rule;
		// `.root { @media (…) { &:hover {} } }` still targets the root.
		while (parent?.type === "atrule") {
			({ parent } = parent);
		}
		if (!targetsRoot(rule.selector, parent !== undefined && rootRules.has(parent))) {
			return;
		}
		rootRules.add(rule);
	});
	root.walkDecls(/^margin(-|$)/u, (decl) => {
		let { parent } = decl;
		while (parent?.type === "atrule") {
			({ parent } = parent);
		}
		// `0` resets a user-agent margin and `auto` centers; neither is spacing between components.
		if (parent !== undefined && rootRules.has(parent) && !["0", "auto"].includes(decl.value.trim())) {
			utils.report({ ruleName: noRootMarginName, result, node: decl, message: noRootMarginMessages.margin });
		}
	});
});

const namedContainerName = "local/named-container";
const namedContainerMessages = utils.ruleMessages(namedContainerName, {
	query: "Name the container in every @container condition",
	name: "Set container-name next to container-type",
});
const namedContainer = createPlugin(namedContainerName, (primary) => (root, result) => {
	if (primary !== true) {
		return;
	}
	root.walkAtRules("container", (rule) => {
		if (!/^[a-zA-Z][\w-]*\s*\(/u.test(rule.params)) {
			utils.report({ ruleName: namedContainerName, result, node: rule, message: namedContainerMessages.query });
		}
	});
	root.walkDecls("container-type", (decl) => {
		const named = decl.parent?.some((node) => node.type === "decl" && /^container(-name)?$/u.test(node.prop));
		if (!named) {
			utils.report({ ruleName: namedContainerName, result, node: decl, message: namedContainerMessages.name });
		}
	});
});

const plugins = [noVarFallback, noRootMargin, namedContainer];

export default plugins;
