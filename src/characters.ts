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

export default characters;

export type CharacterName = (typeof characters)[number];
