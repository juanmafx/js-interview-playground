import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const SCHEMA = readFileSync(new URL("../../db/schema.sql", import.meta.url), "utf8");
const SQLITE_AVAILABLE = spawnSync("sqlite3", ["--version"]).status === 0;
const skip = SQLITE_AVAILABLE ? false : "sqlite3 CLI is not installed";
const VALID_RUN =
  "INSERT INTO practice_runs (id, runtime, runtime_version, started_at) VALUES (1, 'node', 'v24', '2026-01-01T00:00:00Z');";

function runSql(statements) {
  const sql = `.bail on\n${SCHEMA}\n${statements}`;
  return spawnSync("sqlite3", [":memory:"], { input: sql, encoding: "utf8" });
}

test("schema applies twice and stores a valid run", { skip }, () => {
  const result = runSql(`${SCHEMA}
${VALID_RUN}
INSERT INTO exercise_results (run_id, exercise_name, status, input_json, output_json)
VALUES (1, 'two_sum', 'passed', '{"numbers":[2,7],"target":9}', '[0,1]');
SELECT count(*) FROM exercise_results;`);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stdout.trim(), "1");
});

test("schema cascades deletes from runs to results", { skip }, () => {
  const result = runSql(`${VALID_RUN}
INSERT INTO exercise_results (run_id, exercise_name, status, input_json)
VALUES (1, 'with_role', 'failed', '{}');
DELETE FROM practice_runs WHERE id = 1;
SELECT count(*) FROM exercise_results;`);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stdout.trim(), "0");
});

test("schema rejects invalid rows", { skip }, () => {
  const invalidStatements = [
    "INSERT INTO practice_runs (runtime, runtime_version, started_at) VALUES ('deno', 'v2', '2026-01-01T00:00:00Z');",
    "INSERT INTO practice_runs (runtime, runtime_version, started_at) VALUES ('node', 'v24', 'yesterday');",
    `${VALID_RUN} UPDATE practice_runs SET finished_at = '2025-01-01T00:00:00Z';`,
    "INSERT INTO exercise_results (run_id, exercise_name, status, input_json) VALUES (99, 'two_sum', 'passed', '{}');",
    `${VALID_RUN} INSERT INTO exercise_results (run_id, exercise_name, status, input_json) VALUES (1, 'two_sum', 'passed', 'not-json');`,
    `${VALID_RUN} INSERT INTO exercise_results (run_id, exercise_name, status, input_json) VALUES (1, 'two_sum', 'passed', '{}'), (1, 'two_sum', 'failed', '{}');`,
  ];
  for (const statement of invalidStatements) {
    const result = runSql(statement);
    assert.notEqual(result.status, 0, statement);
    assert.match(result.stderr, /constraint failed/i, statement);
  }
});
