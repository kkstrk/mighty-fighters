import { useEffect, useRef } from "react";

import { useIsSmallScreen } from "@/utils/use-is-small-screen";

const BUTTON_ROWS = [
	[0, 1, 2],
	[3, 4],
	[5, 6, 7],
	[8, 9],
	[10, 11, 12],
];

const getButtonPosition = (index: number) => {
	const rowIndex = Math.floor((2 * index) / 5);
	const colIndex = [0, 1, 2, 0, 1][index % 5] ?? 0;
	return { rowIndex, colIndex };
};

const useKeyboardNavigation = ({
	enabled,
	ref,
	initialIndex,
	onFocus,
}: {
	enabled: boolean;
	ref: React.RefObject<HTMLDivElement | null>;
	initialIndex: number;
	onFocus: (index: number) => void;
}) => {
	const stickyColRef = useRef<number>(0);

	// Temporary hack to disable keyboard navigation on small screens
	const isSmallScreen = useIsSmallScreen();
	const disabled = isSmallScreen || !enabled;

	useEffect(() => {
		if (disabled) {
			return;
		}
		const handleKeyDown = (event: KeyboardEvent) => {
			const buttons = [...(ref.current?.querySelectorAll<HTMLButtonElement>("button") ?? [])];
			if (buttons.length === 0) {
				return;
			}

			const isArrowKey =
				event.key === "ArrowLeft" ||
				event.key === "ArrowRight" ||
				event.key === "ArrowUp" ||
				event.key === "ArrowDown";
			if (!isArrowKey) {
				return;
			}

			event.preventDefault();

			if (ref.current?.contains(document.activeElement) !== true) {
				const button = buttons.at(initialIndex) ?? buttons.find((candidate) => !candidate.disabled);
				if (button) {
					button.focus();
					const focusedIndex = buttons.indexOf(button);
					onFocus(focusedIndex);
					stickyColRef.current = getButtonPosition(focusedIndex).colIndex;
				}
				return;
			}

			const { activeElement } = document;
			const buttonIndex =
				activeElement instanceof HTMLButtonElement ? Math.max(0, buttons.indexOf(activeElement)) : 0;
			const { rowIndex, colIndex } = getButtonPosition(buttonIndex);

			let nextButtonIndex: number | undefined;

			const moveHorizontal = (delta: number) => {
				const row = BUTTON_ROWS[rowIndex] ?? [];
				for (let step = 1; step < row.length; step += 1) {
					const index =
						delta === 1
							? row[(colIndex + step) % row.length]
							: row[(colIndex - step + row.length) % row.length];
					if (index !== undefined && buttons[index]?.disabled !== true) {
						nextButtonIndex = index;
						stickyColRef.current = row.indexOf(index);
						break;
					}
				}
			};

			const moveVertical = (delta: number) => {
				const totalRows = BUTTON_ROWS.length;
				let rowsVisited = 0;
				let nextRowIndex = (rowIndex + delta + totalRows) % totalRows;

				while (rowsVisited < totalRows) {
					const row = BUTTON_ROWS[nextRowIndex] ?? [];
					const startColIndex = Math.min(stickyColRef.current, row.length - 1);

					for (let nextColIndex = startColIndex; nextColIndex < row.length; nextColIndex += 1) {
						const index = row[nextColIndex];
						if (index !== undefined && buttons[index]?.disabled !== true) {
							nextButtonIndex = index;
							return;
						}
					}

					rowsVisited += 1;
					nextRowIndex = (nextRowIndex + delta + totalRows) % totalRows;
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
				buttons[nextButtonIndex]?.focus();
				onFocus(nextButtonIndex);
			}
		};
		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [ref, initialIndex, disabled, onFocus]);
};

export { useKeyboardNavigation };
