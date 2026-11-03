import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vite-plus/test";
import type { MockInstance } from "vite-plus/test";

import { AboutDialog } from "./about-dialog";
import type { AboutDialogRef } from "./about-dialog";

const getDialog = () => {
	const dialog = screen.getByRole("dialog", { hidden: true });
	if (!(dialog instanceof HTMLDialogElement)) {
		throw new TypeError("Expected a dialog element");
	}
	return dialog;
};

describe("AboutDialog", () => {
	let dialogRef: React.RefObject<AboutDialogRef | null>;

	let showModal: MockInstance<typeof HTMLDialogElement.prototype.showModal>;
	let close: MockInstance<typeof HTMLDialogElement.prototype.close>;

	beforeEach(() => {
		dialogRef = createRef<AboutDialogRef | null>();
		// jsdom does not implement the dialog methods, so they must exist before spying
		HTMLDialogElement.prototype.showModal = () => {};
		HTMLDialogElement.prototype.close = () => {};
		showModal = vi.spyOn(HTMLDialogElement.prototype, "showModal").mockImplementation(function (
			this: HTMLDialogElement,
		) {
			this.open = true;
		});
		close = vi.spyOn(HTMLDialogElement.prototype, "close").mockImplementation(function (this: HTMLDialogElement) {
			this.open = false;
		});
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("renders dialog element", () => {
		render(<AboutDialog ref={dialogRef} />);
		const dialog = screen.getByRole("dialog", { hidden: true });
		expect(dialog).toBeInTheDocument();
	});

	it("dialog is initially closed", () => {
		render(<AboutDialog ref={dialogRef} />);
		const dialog = screen.getByRole("dialog", { hidden: true });
		expect(dialog).not.toHaveAttribute("open");
	});

	it("exposes open method through ref", () => {
		render(<AboutDialog ref={dialogRef} />);
		expect(dialogRef.current).toBeDefined();
		expect(dialogRef.current?.open).toBeDefined();
		expect(typeof dialogRef.current?.open).toBe("function");
	});

	it("opens dialog when open method is called", () => {
		render(<AboutDialog ref={dialogRef} />);

		dialogRef.current?.open();

		expect(showModal).toHaveBeenCalled();
	});

	it("closes dialog when close button is clicked", async () => {
		const user = userEvent.setup();
		render(<AboutDialog ref={dialogRef} />);
		const dialog = getDialog();
		const closeButton = within(dialog).getByRole("button", { name: "X", hidden: true });

		dialogRef.current?.open();
		await user.click(closeButton);

		expect(close).toHaveBeenCalled();
	});

	it("closes dialog when backdrop is clicked", async () => {
		const user = userEvent.setup();
		render(<AboutDialog ref={dialogRef} />);
		const dialog = getDialog();

		dialogRef.current?.open();
		await user.click(dialog);

		expect(close).toHaveBeenCalled();
	});

	it("does not close dialog when content area is clicked", async () => {
		const user = userEvent.setup();
		render(<AboutDialog ref={dialogRef} />);
		const dialog = getDialog();
		const content = within(dialog).getByText("Programming:");

		dialogRef.current?.open();
		await user.click(content);

		expect(close).not.toHaveBeenCalled();
	});

	it("close button has correct type attribute", () => {
		render(<AboutDialog ref={dialogRef} />);
		const dialog = screen.getByRole("dialog", { hidden: true });
		const closeButton = within(dialog).getByRole("button", { name: "X", hidden: true });
		expect(closeButton).toHaveAttribute("type", "button");
	});

	it("close button has correct title attribute", () => {
		render(<AboutDialog ref={dialogRef} />);
		const dialog = screen.getByRole("dialog", { hidden: true });
		const closeButton = within(dialog).getByRole("button", { name: "X", hidden: true });
		expect(closeButton).toHaveAttribute("title", "Close");
	});

	it("handles multiple open and close cycles", () => {
		render(<AboutDialog ref={dialogRef} />);

		dialogRef.current?.open();
		expect(showModal).toHaveBeenCalledTimes(1);

		dialogRef.current?.open();
		expect(showModal).toHaveBeenCalledTimes(2);

		dialogRef.current?.open();
		expect(showModal).toHaveBeenCalledTimes(3);
	});
});
