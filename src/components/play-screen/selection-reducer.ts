import type { CharacterName } from "@/characters";

type Player = 1 | 2;

interface SelectionState {
	single: boolean;
	slots: Record<Player, CharacterName | undefined>;
	// Players in the order they picked, so the latest pick is undone first.
	history: Player[];
	phase: { status: "choosing" } | { status: "randomizing"; queue: CharacterName[] };
}

type SelectionEvent =
	| { type: "pick"; character: CharacterName }
	| { type: "undo"; player: Player }
	| { type: "undoLast" }
	| { type: "randomStart"; queue: CharacterName[] }
	| { type: "randomTick" };

const initialSelection = (single: boolean): SelectionState => ({
	single,
	slots: { 1: undefined, 2: undefined },
	history: [],
	phase: { status: "choosing" },
});

// A single player always picks for player 1; two players fill the first free slot.
const nextPlayer = (state: SelectionState): Player => (state.single || state.slots[1] === undefined ? 1 : 2);

const isComplete = (state: SelectionState) =>
	!state.single && state.slots[1] !== undefined && state.slots[2] !== undefined;

const isLocked = (state: SelectionState) => state.phase.status === "randomizing" || isComplete(state);

const pick = (state: SelectionState, character: CharacterName): SelectionState => {
	const player = nextPlayer(state);
	return {
		...state,
		slots: { ...state.slots, [player]: character },
		history: [...state.history.filter((entry) => entry !== player), player],
		phase: { status: "choosing" },
	};
};

const undo = (state: SelectionState, player: Player): SelectionState => {
	if (state.phase.status === "randomizing" || state.slots[player] === undefined) {
		return state;
	}
	return {
		...state,
		slots: { ...state.slots, [player]: undefined },
		history: state.history.filter((entry) => entry !== player),
	};
};

const selectionReducer = (state: SelectionState, event: SelectionEvent): SelectionState => {
	switch (event.type) {
		case "pick": {
			return isLocked(state) ? state : pick(state, event.character);
		}
		case "undo": {
			return undo(state, event.player);
		}
		case "undoLast": {
			const last = state.history.at(-1);
			return last === undefined ? state : undo(state, last);
		}
		case "randomStart": {
			return isLocked(state) ? state : { ...state, phase: { status: "randomizing", queue: event.queue } };
		}
		case "randomTick": {
			if (state.phase.status !== "randomizing") {
				return state;
			}
			const { queue } = state.phase;
			if (queue.length > 1) {
				return { ...state, phase: { status: "randomizing", queue: queue.slice(1) } };
			}
			const [last] = queue;
			const choosing: SelectionState = { ...state, phase: { status: "choosing" } };
			return last === undefined ? choosing : pick(choosing, last);
		}
		default: {
			return assertNever(event);
		}
	}
};

const assertNever = (value: never): never => {
	throw new Error(`Unhandled event: ${JSON.stringify(value)}`);
};

export { initialSelection, isComplete, isLocked, nextPlayer, selectionReducer };
export type { Player, SelectionEvent, SelectionState };
