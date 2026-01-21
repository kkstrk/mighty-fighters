import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import AboutDialog, { type AboutDialogRef } from "./about-dialog";

describe("AboutDialog", () => {
	let dialogRef: React.RefObject<AboutDialogRef | null>;

	beforeEach(() => {
		dialogRef = createRef<AboutDialogRef | null>();
		HTMLDialogElement.prototype.showModal = vi.fn(function (this: HTMLDialogElement) {
			this.open = true;
		});
		HTMLDialogElement.prototype.close = vi.fn(function (this: HTMLDialogElement) {
			this.open = false;
		});
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	test("renders dialog element", () => {
		render(<AboutDialog ref={dialogRef} />);
		const dialog = screen.getByRole("dialog", { hidden: true });
		expect(dialog).toBeInTheDocument();
	});

	test("dialog is initially closed", () => {
		render(<AboutDialog ref={dialogRef} />);
		const dialog = screen.getByRole("dialog", { hidden: true });
		expect(dialog).not.toHaveAttribute("open");
	});

	test("exposes open method through ref", () => {
		render(<AboutDialog ref={dialogRef} />);
		expect(dialogRef.current).toBeDefined();
		expect(dialogRef.current?.open).toBeDefined();
		expect(typeof dialogRef.current?.open).toBe("function");
	});

	test("opens dialog when open method is called", () => {
		render(<AboutDialog ref={dialogRef} />);
		const dialog = screen.getByRole("dialog", { hidden: true }) as HTMLDialogElement;

		dialogRef.current?.open();

		expect(dialog.showModal).toHaveBeenCalled();
	});

	test("closes dialog when close button is clicked", async () => {
		const user = userEvent.setup();
		render(<AboutDialog ref={dialogRef} />);
		const dialog = screen.getByRole("dialog", { hidden: true }) as HTMLDialogElement;
		const closeButton = within(dialog).getByRole("button", { name: "X", hidden: true });

		dialogRef.current?.open();
		await user.click(closeButton);

		expect(dialog.close).toHaveBeenCalled();
	});

	test("closes dialog when backdrop is clicked", async () => {
		const user = userEvent.setup();
		render(<AboutDialog ref={dialogRef} />);
		const dialog = screen.getByRole("dialog", { hidden: true }) as HTMLDialogElement;

		dialogRef.current?.open();
		await user.click(dialog);

		expect(dialog.close).toHaveBeenCalled();
	});

	test("does not close dialog when content area is clicked", async () => {
		const user = userEvent.setup();
		render(<AboutDialog ref={dialogRef} />);
		const dialog = screen.getByRole("dialog", { hidden: true }) as HTMLDialogElement;
		const content = within(dialog).getByText("Programming:");

		dialogRef.current?.open();
		await user.click(content);

		expect(dialog.close).not.toHaveBeenCalled();
	});

	test("close button has correct type attribute", () => {
		render(<AboutDialog ref={dialogRef} />);
		const dialog = screen.getByRole("dialog", { hidden: true });
		const closeButton = within(dialog).getByRole("button", { name: "X", hidden: true });
		expect(closeButton).toHaveAttribute("type", "button");
	});

	test("close button has correct title attribute", () => {
		render(<AboutDialog ref={dialogRef} />);
		const dialog = screen.getByRole("dialog", { hidden: true });
		const closeButton = within(dialog).getByRole("button", { name: "X", hidden: true });
		expect(closeButton).toHaveAttribute("title", "Close");
	});

	test("handles multiple open and close cycles", () => {
		render(<AboutDialog ref={dialogRef} />);
		const dialog = screen.getByRole("dialog", { hidden: true }) as HTMLDialogElement;

		dialogRef.current?.open();
		expect(dialog.showModal).toHaveBeenCalledTimes(1);

		dialogRef.current?.open();
		expect(dialog.showModal).toHaveBeenCalledTimes(2);

		dialogRef.current?.open();
		expect(dialog.showModal).toHaveBeenCalledTimes(3);
	});
});
