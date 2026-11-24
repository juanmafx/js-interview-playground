PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS practice_runs (
  id INTEGER PRIMARY KEY,
  runtime TEXT NOT NULL CHECK (runtime IN ('browser', 'node')),
  runtime_version TEXT NOT NULL CHECK (length(runtime_version) BETWEEN 1 AND 64),
  started_at TEXT NOT NULL CHECK (started_at GLOB '[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]T*Z'),
  finished_at TEXT CHECK (finished_at IS NULL OR finished_at >= started_at)
) STRICT;

CREATE TABLE IF NOT EXISTS exercise_results (
  id INTEGER PRIMARY KEY,
  run_id INTEGER NOT NULL REFERENCES practice_runs (id) ON DELETE CASCADE,
  exercise_name TEXT NOT NULL CHECK (exercise_name IN ('two_sum', 'even_squares', 'with_role')),
  status TEXT NOT NULL CHECK (status IN ('passed', 'failed')),
  input_json TEXT NOT NULL CHECK (json_valid(input_json)),
  output_json TEXT CHECK (output_json IS NULL OR json_valid(output_json)),
  UNIQUE (run_id, exercise_name)
) STRICT;

CREATE INDEX IF NOT EXISTS idx_exercise_results_name_status
  ON exercise_results (exercise_name, status);
