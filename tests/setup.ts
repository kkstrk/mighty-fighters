import { cleanup } from "@testing-library/react";
import { afterEach } from "vite-plus/test";

// oxlint-disable-next-line import/no-unassigned-import -- registers jest-dom matchers and their types
import "@testing-library/jest-dom/vitest";

afterEach(cleanup);
