import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const CLI_PATH = fileURLToPath(new URL("../../backend/cli/main.js", import.meta.url));

test("CLI prints the original practice output", () => {
  const stdout = execFileSync(process.execPath, [CLI_PATH], { encoding: "utf8" });
  assert.equal(
    stdout,
    "Node Interview Practice:\nInput: [ 2, 7, 11, 15 ] Target: 9\nTwo Sum Indexes: [ 0, 1 ]\n",
  );
});
