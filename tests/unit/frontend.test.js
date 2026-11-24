import assert from "node:assert/strict";
import { test } from "node:test";
import { bindPlayground } from "../../frontend/scripts/playground.js";
import { buildInterviewReport } from "../../shared/index.js";

const EXPECTED_REPORT = [
  "Interview Practice Results:",
  "Even squares: 4, 16, 36",
  "Original role: Frontend Engineer",
  "Updated role: JavaScript Candidate",
].join("\n");

function createHarness(buildReport) {
  const calls = [];
  const listeners = new Map();
  const button = { addEventListener: (type, listener) => listeners.set(type, listener) };
  const output = { textContent: "initial" };
  const logger = {
    clear: () => calls.push(["clear"]),
    log: (message) => calls.push(["log", message]),
  };
  bindPlayground({ button, output, logger, buildReport });
  return { calls, listeners, output };
}

test("buildInterviewReport preserves the original report text", () => {
  assert.equal(buildInterviewReport(), EXPECTED_REPORT);
});

test("bindPlayground does nothing until the button is clicked", () => {
  const { calls, listeners, output } = createHarness(buildInterviewReport);
  assert.equal(output.textContent, "initial");
  assert.deepEqual(calls, []);
  assert.ok(listeners.has("click"));
});

test("clicking writes the report to the console and the page", () => {
  const { calls, listeners, output } = createHarness(buildInterviewReport);
  listeners.get("click")();
  assert.equal(output.textContent, EXPECTED_REPORT);
  assert.deepEqual(calls, [["clear"], ["log", EXPECTED_REPORT]]);
});

test("report content is rendered as text rather than markup", () => {
  const markup = "<img src=x onerror=alert(1)>";
  const { listeners, output } = createHarness(() => markup);
  listeners.get("click")();
  assert.equal(output.textContent, markup);
  assert.equal(output.innerHTML, undefined);
});
