# JavaScript Interview Playground

A small, dependency-free workspace for practicing common JavaScript interview exercises in the browser and in Node.js.

**Project history:** originally created in 2026 and modernized in 2026.

## Purpose

Interview practice works best when an exercise can be run immediately and its behavior can be checked. This project keeps a few classic exercises as pure, tested functions and exposes them through two thin entry points: a browser page and a command-line script.

## What It Does

| Exercise | Function | Behavior |
| --- | --- | --- |
| Two Sum | `twoSum(numbers, target)` | Returns the indexes of the first matching pair in O(n) time using a hash map, or `[]` when no pair exists |
| Even squares | `evenSquares(numbers)` | Keeps even values and squares them, preserving order |
| Immutable update | `withRole(person, role)` | Returns a shallow copy with a new role and leaves the original untouched |

- The **browser page** runs the even-squares and immutable-update examples when you click **Run Browser JS**, then writes the result to the page and the console.
- The **CLI** runs the Two Sum example and prints its input and result.

Two Sum is a widely known public interview problem. The implementation here is a standard hash-map solution.

## Architecture

```text
frontend/   Browser page, styles, and DOM binding
backend/    CLI and hardened local static server
shared/     Pure exercises and report building used by both sides
db/         Optional SQLite schema for run results
tests/      Unit and integration suites
scripts/    Test report generator
reports/    Committed output of a real test run
docs/       Architecture and security audit
```

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for module boundaries and data flow.

## Quick Start

Requires Node.js 22 or newer. There are no packages to install.

```bash
npm run start:web
```

Open <http://127.0.0.1:5500> and click **Run Browser JS**.

```bash
npm run start:node
```

## Usage Guide

Import the exercises from the package entry point inside this repository:

```js
import { evenSquares, twoSum, withRole } from "./shared/index.js";

twoSum([2, 7, 11, 15], 9);
evenSquares([1, 2, 3, 4]);
withRole({ name: "Sam", role: "Engineer" }, "Candidate");
```

To add an exercise, write a pure function under `shared/`, export it from `shared/index.js`, add tests under `tests/unit/`, and call it from a report or CLI entry point.

## Configuration

The web server reads two optional environment variables.

| Variable | Default | Description |
| --- | --- | --- |
| `HOST` | `127.0.0.1` | Bind address |
| `PORT` | `5500` | Bind port, from 0 to 65535 |

The server is a local development tool. It has no TLS or authentication, so keep it on a loopback address.

## Database (Optional)

The application **does not use a database** and never reads or writes one. [db/schema.sql](db/schema.sql) is an optional SQLite schema for anyone who wants to record practice runs:

```bash
sqlite3 practice.sqlite < db/schema.sql
```

SQLite enforces foreign keys per connection, so run `PRAGMA foreign_keys = ON;` in each session that writes to it.

## Testing

```bash
npm test
npm run test:report
```

`npm test` uses the built-in Node.js test runner. The database tests need the `sqlite3` CLI and are reported as skipped without it. `npm run test:report` runs the suite and writes [reports/tests/latest.md](reports/tests/latest.md) and `latest.json`.

## Security Notes

- No runtime or development dependencies
- Local server binds to loopback by default and serves only allowlisted file types from `frontend/` and `shared/`
- Path traversal, hidden files, and symlink escapes are blocked
- Strict Content Security Policy with no inline script or style
- Output is rendered with `textContent`

See [SECURITY.md](SECURITY.md) and [docs/SECURITY_AUDIT.md](docs/SECURITY_AUDIT.md).

## Versioning

Current version: 2.0.0. See [CHANGELOG.md](CHANGELOG.md) and [RELEASE_NOTES.md](RELEASE_NOTES.md).

## License

No license has been selected, so default copyright applies.
