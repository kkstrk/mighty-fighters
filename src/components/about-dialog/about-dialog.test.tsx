import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vite-plus/test";
import type { MockInstance } from "vite-plus/test";

import { AboutDialog } from "./about-dialog";

const getDialog = () => {
	const dialog = screen.getByRole("dialog", { hidden: true });
	if (!(dialog instanceof HTMLDialogElement)) {
		throw new TypeError("Expected a dialog element");
	}
	return dialog;
};

describe("AboutDialog", () => {
	let showModal: MockInstance<typeof HTMLDialogElement.prototype.showModal>;
	let close: MockInstance<typeof HTMLDialogElement.prototype.close>;

	beforeEach(() => {
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

	it("stays closed while open is false", () => {
		render(<AboutDialog onClose={vi.fn<() => void>()} open={false} />);

		expect(getDialog()).not.toHaveAttribute("open");
		expect(showModal).not.toHaveBeenCalled();
	});

	it("shows the dialog modally when open becomes true", () => {
		const { rerender } = render(<AboutDialog onClose={vi.fn<() => void>()} open={false} />);

		rerender(<AboutDialog onClose={vi.fn<() => void>()} open />);

		expect(showModal).toHaveBeenCalledTimes(1);
		expect(getDialog()).toHaveAttribute("open");
	});

	it("closes the dialog when open becomes false", () => {
		const { rerender } = render(<AboutDialog onClose={vi.fn<() => void>()} open />);

		rerender(<AboutDialog onClose={vi.fn<() => void>()} open={false} />);

		expect(close).toHaveBeenCalledTimes(1);
	});

	it("reports close when the close button is clicked", async () => {
		const user = userEvent.setup();
		const onClose = vi.fn<() => void>();
		render(<AboutDialog onClose={onClose} open />);

		await user.click(within(getDialog()).getByRole("button", { name: "Close", hidden: true }));

		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it("reports close when the backdrop is clicked", async () => {
		const user = userEvent.setup();
		const onClose = vi.fn<() => void>();
		render(<AboutDialog onClose={onClose} open />);

		await user.click(getDialog());

		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it("does not report close when the content is clicked", async () => {
		const user = userEvent.setup();
		const onClose = vi.fn<() => void>();
		render(<AboutDialog onClose={onClose} open />);

		await user.click(within(getDialog()).getByText("PROGRAMMING"));

		expect(onClose).not.toHaveBeenCalled();
	});

	it("reports close when the dialog closes natively", () => {
		const onClose = vi.fn<() => void>();
		render(<AboutDialog onClose={onClose} open />);

		getDialog().dispatchEvent(new Event("close"));

		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it("has a close button with type and title", () => {
		render(<AboutDialog onClose={vi.fn<() => void>()} open={false} />);

		const closeButton = within(getDialog()).getByRole("button", { name: "Close", hidden: true });

		expect(closeButton).toHaveAttribute("type", "button");
		expect(closeButton).toHaveAttribute("title", "Close");
	});
});
