import { describe, expect, it } from "vite-plus/test";

import type { SelectionEvent, SelectionState } from "./selection-reducer";
import { initialSelection, selectionReducer } from "./selection-reducer";

const run = (state: SelectionState, ...events: SelectionEvent[]) =>
	events.reduce((current, event) => selectionReducer(current, event), state);

describe("selectionReducer", () => {
	describe("two players", () => {
		it("fills player 1 and then player 2", () => {
			const state = run(
				initialSelection(false),
				{ type: "pick", character: "jester" },
				{ type: "pick", character: "molly" },
			);

			expect(state.slots).toStrictEqual({ 1: "jester", 2: "molly" });
			expect(state.history).toStrictEqual([1, 2]);
		});

		it("lets both players pick the same character", () => {
			const state = run(
				initialSelection(false),
				{ type: "pick", character: "jester" },
				{ type: "pick", character: "jester" },
			);

			expect(state.slots).toStrictEqual({ 1: "jester", 2: "jester" });
		});

		it("ignores a pick once both players have chosen", () => {
			const full = run(
				initialSelection(false),
				{ type: "pick", character: "jester" },
				{ type: "pick", character: "molly" },
			);

			expect(selectionReducer(full, { type: "pick", character: "fjord" })).toBe(full);
		});

		it("undoes the latest pick first", () => {
			const state = run(
				initialSelection(false),
				{ type: "pick", character: "jester" },
				{ type: "pick", character: "molly" },
				{ type: "undoLast" },
			);

			expect(state.slots).toStrictEqual({ 1: "jester", 2: undefined });
			expect(state.history).toStrictEqual([1]);
		});

		it("refills the freed slot after undoing player 1", () => {
			const state = run(
				initialSelection(false),
				{ type: "pick", character: "jester" },
				{ type: "pick", character: "molly" },
				{ type: "undo", player: 1 },
				{ type: "pick", character: "fjord" },
			);

			expect(state.slots).toStrictEqual({ 1: "fjord", 2: "molly" });
			expect(state.history).toStrictEqual([2, 1]);
		});

		it("ignores undo for an empty slot", () => {
			const state = initialSelection(false);

			expect(selectionReducer(state, { type: "undo", player: 2 })).toBe(state);
			expect(selectionReducer(state, { type: "undoLast" })).toBe(state);
		});
	});

	describe("single player", () => {
		it("replaces the previous pick", () => {
			const state = run(
				initialSelection(true),
				{ type: "pick", character: "jester" },
				{ type: "pick", character: "molly" },
			);

			expect(state.slots).toStrictEqual({ 1: "molly", 2: undefined });
			expect(state.history).toStrictEqual([1]);
		});
	});

	describe("random pick", () => {
		const queue = ["jester", "molly", "fjord"] as const;

		it("steps through the queue and picks the highlighted character", () => {
			const started = run(initialSelection(false), { type: "randomStart", queue: [...queue] });

			expect(started.phase).toStrictEqual({ status: "randomizing", queue: ["jester", "molly", "fjord"] });

			const done = run(started, { type: "randomTick" }, { type: "randomTick" }, { type: "randomTick" });

			expect(done.phase).toStrictEqual({ status: "choosing" });
			expect(done.slots[1]).toBe("fjord");
		});

		it("ignores picks, undo and a second start while animating", () => {
			const picked = run(initialSelection(false), { type: "pick", character: "beau" });
			const started = run(picked, { type: "randomStart", queue: [...queue] });

			expect(selectionReducer(started, { type: "pick", character: "nott" })).toBe(started);
			expect(selectionReducer(started, { type: "undoLast" })).toBe(started);
			expect(selectionReducer(started, { type: "undo", player: 1 })).toBe(started);
			expect(selectionReducer(started, { type: "randomStart", queue: [...queue] })).toBe(started);
		});

		it("gives the result to the next free player", () => {
			const done = run(
				initialSelection(false),
				{ type: "pick", character: "beau" },
				{ type: "randomStart", queue: ["jester"] },
				{ type: "randomTick" },
			);

			expect(done.slots).toStrictEqual({ 1: "beau", 2: "jester" });
		});

		it("cannot start when both players have chosen", () => {
			const full = run(
				initialSelection(false),
				{ type: "pick", character: "jester" },
				{ type: "pick", character: "molly" },
			);

			expect(selectionReducer(full, { type: "randomStart", queue: [...queue] })).toBe(full);
		});

		it("ignores ticks when not animating", () => {
			const state = initialSelection(false);

			expect(selectionReducer(state, { type: "randomTick" })).toBe(state);
		});
	});
});
