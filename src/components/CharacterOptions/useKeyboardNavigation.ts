import { useEffect, useRef, useState } from "react";
import useSmallScreen from "../../utils/useSmallScreen";

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

const useKeyboardNavigation = ({
	ref,
	initialIndex = 0,
	onFocus,
}: {
	ref: React.RefObject<HTMLDivElement | null>;
	initialIndex: number;
	onFocus: (index: number) => void;
}) => {
	const buttonsRef = useRef<HTMLButtonElement[]>([]);
	const focusedIndexRef = useRef<number>(0);
	const stickyColRef = useRef<number>(0);

	// TODO: temporary hack to disable keyboard navigation on small screens
	const [disabled, setDisabled] = useState(false);
	useSmallScreen(setDisabled);

	useEffect(() => {
		buttonsRef.current = Array.from(
			ref.current?.querySelectorAll<HTMLButtonElement>("button") ?? [],
		);
	}, [ref]);

	useEffect(() => {
		const node = ref.current;
		if (!node) {
			return;
		}
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
		if (disabled) {
			return;
		}
		const handleKeyDown = (event: KeyboardEvent) => {
			const buttons = buttonsRef.current;
			if (!buttons.length) {
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

			if (!ref.current?.contains(document.activeElement)) {
				const button =
					buttons.at(initialIndex) || buttons.find((button) => !button.disabled);
				if (button) {
					button.focus();
					focusedIndexRef.current = buttons.indexOf(button);
					onFocus(focusedIndexRef.current);
					stickyColRef.current = getButtonPosition(focusedIndexRef.current).colIndex;
				}
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
				buttons[nextButtonIndex].focus();
				focusedIndexRef.current = nextButtonIndex;
				onFocus(nextButtonIndex);
			}
		};
		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [ref, initialIndex, disabled, onFocus]);
};

export default useKeyboardNavigation;
