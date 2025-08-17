import { useCallback, useEffect, useRef } from "react";

const BUTTON_ROWS = [
	[0, 1, 2],
	[3, 4],
	[5, 6, 7],
	[8, 9],
	[10, 11, 12],
];

const getButtonPosition = (index: number) => {
	const rowIndex = Math.floor((2 * index) / 5);
	const colIndex = [0, 1, 2, 0, 1][index % 5];
	return { rowIndex, colIndex };
};

const useKeyboardNavigation = (ref: React.RefObject<HTMLDivElement | null>) => {
	const buttonsRef = useRef<HTMLButtonElement[]>([]);
	const focusedIndexRef = useRef<number>(0);
	const stickyColRef = useRef<number>(0);

	const focusFirstButton = useCallback(() => {
		const buttons = buttonsRef.current;
		if (!buttons.length) return;

		const index = buttons.findIndex((button) => !button.disabled);
		if (index >= 0) {
			buttons[index].focus();
			focusedIndexRef.current = index;
			stickyColRef.current = getButtonPosition(index).colIndex;
		}
	}, []);

	useEffect(() => {
		buttonsRef.current = Array.from(
			ref.current?.querySelectorAll<HTMLButtonElement>("button") ?? [],
		);
		focusFirstButton();
	}, [focusFirstButton, ref]);

	useEffect(() => {
		const node = ref.current;
		if (!node) return;
		const handleFocusIn = (event: FocusEvent) => {
			const index = event.target
				? buttonsRef.current.indexOf(event.target as HTMLButtonElement)
				: -1;
			if (index >= 0) {
				focusedIndexRef.current = index;
			}
		};
		node.addEventListener("focusin", handleFocusIn);
		return () => node.removeEventListener("focusin", handleFocusIn);
	}, [ref]);

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			const buttons = buttonsRef.current;
			if (!buttons.length) return;

			const isArrowKey =
				event.key === "ArrowLeft" ||
				event.key === "ArrowRight" ||
				event.key === "ArrowUp" ||
				event.key === "ArrowDown";
			if (!isArrowKey) return;

			event.preventDefault();

			if (!ref.current?.contains(document.activeElement)) {
				focusFirstButton();
				return;
			}

			const buttonIndex = focusedIndexRef.current;
			const { rowIndex, colIndex } = getButtonPosition(buttonIndex);

			let nextButtonIndex: number | undefined;

			const moveHorizontal = (delta: number) => {
				const row = BUTTON_ROWS[rowIndex];
				for (let step = 1; step < row.length; step += 1) {
					const index =
						delta === 1
							? row[(colIndex + step) % row.length]
							: row[(colIndex - step + row.length) % row.length];
					if (!buttons[index]?.disabled) {
						nextButtonIndex = index;
						stickyColRef.current = row.findIndex((col) => col === index);
						break;
					}
				}
			};

			const moveVertical = (delta: number) => {
				let nextRowIndex = rowIndex + delta;

				while (nextRowIndex >= 0 && nextRowIndex < BUTTON_ROWS.length) {
					const row = BUTTON_ROWS[nextRowIndex];
					const startColIndex = Math.min(stickyColRef.current, row.length - 1);

					for (
						let nextColIndex = startColIndex;
						nextColIndex < row.length;
						nextColIndex += 1
					) {
						const index = row[nextColIndex];
						if (!buttons[index]?.disabled) {
							nextButtonIndex = index;
							return;
						}
					}

					nextRowIndex += delta;
				}
			};

			if (event.key === "ArrowLeft") {
				moveHorizontal(-1);
			} else if (event.key === "ArrowRight") {
				moveHorizontal(1);
			} else if (event.key === "ArrowUp") {
				moveVertical(-1);
			} else if (event.key === "ArrowDown") {
				moveVertical(1);
			}

			if (nextButtonIndex !== undefined) {
				buttons[nextButtonIndex].focus();
				focusedIndexRef.current = nextButtonIndex;
			}
		};
		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [focusFirstButton, ref]);
};

export default useKeyboardNavigation;
