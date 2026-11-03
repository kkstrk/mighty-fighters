const characters = [
	"jester",
	"molly",
	"fjord",
	"yasha",
	"beau",
	"nott",
	"caleb",
	"caduceus",
	"essek",
	"avantika",
	"jourrael",
] as const;

export { characters };

export type CharacterName = (typeof characters)[number];
