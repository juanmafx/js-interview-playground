# Test Report

- Generated: 2026-11-24T02:51:54.254Z
- Node.js: v24.22.0
- Platform: linux-x64
- Total: 37
- Passed: 37
- Failed: 0
- Skipped: 0

| File | Test | Status |
| --- | --- | --- |
| tests/integration/cli.test.js | CLI prints the original practice output | passed |
| tests/integration/schema.test.js | schema applies twice and stores a valid run | passed |
| tests/integration/schema.test.js | schema cascades deletes from runs to results | passed |
| tests/integration/schema.test.js | schema rejects invalid rows | passed |
| tests/integration/static-server.test.js | accepts a configured Host and rejects it otherwise | passed |
| tests/integration/static-server.test.js | accepts loopback Host headers | passed |
| tests/integration/static-server.test.js | blocks path traversal and hidden files | passed |
| tests/integration/static-server.test.js | does not follow symlinks out of a mount | passed |
| tests/integration/static-server.test.js | does not serve disallowed file types or missing files | passed |
| tests/integration/static-server.test.js | does not serve hidden or disallowed files through symlinks | passed |
| tests/integration/static-server.test.js | HEAD returns headers without a body | passed |
| tests/integration/static-server.test.js | page has no inline script, style, or event handler | passed |
| tests/integration/static-server.test.js | rejects malformed paths | passed |
| tests/integration/static-server.test.js | rejects unsupported methods | passed |
| tests/integration/static-server.test.js | rejects untrusted Host headers | passed |
| tests/integration/static-server.test.js | serves every module the page needs | passed |
| tests/integration/static-server.test.js | serves the page with hardening headers | passed |
| tests/integration/static-server.test.js | treats symlink loops and overlong names as not found | passed |
| tests/unit/algorithms.test.js | evenSquares rejects invalid input | passed |
| tests/unit/algorithms.test.js | evenSquares squares only even values in order | passed |
| tests/unit/algorithms.test.js | twoSum does not mutate its input | passed |
| tests/unit/algorithms.test.js | twoSum handles duplicates without reusing one element | passed |
| tests/unit/algorithms.test.js | twoSum handles negative numbers and zero | passed |
| tests/unit/algorithms.test.js | twoSum rejects invalid input | passed |
| tests/unit/algorithms.test.js | twoSum returns an empty array when no pair exists | passed |
| tests/unit/algorithms.test.js | twoSum returns the earliest completed pair with the latest duplicate | passed |
| tests/unit/algorithms.test.js | twoSum returns the indexes of a matching pair | passed |
| tests/unit/algorithms.test.js | withRole returns a copy and leaves the original intact | passed |
| tests/unit/config.test.js | allowedHostnames does not trust wildcard bind addresses | passed |
| tests/unit/config.test.js | allowedHostnames keeps loopback names and adds a specific host | passed |
| tests/unit/config.test.js | loadConfig defaults to loopback on port 5500 | passed |
| tests/unit/config.test.js | loadConfig reads HOST and PORT | passed |
| tests/unit/config.test.js | loadConfig rejects invalid ports | passed |
| tests/unit/frontend.test.js | bindPlayground does nothing until the button is clicked | passed |
| tests/unit/frontend.test.js | buildInterviewReport preserves the original report text | passed |
| tests/unit/frontend.test.js | clicking writes the report to the console and the page | passed |
| tests/unit/frontend.test.js | report content is rendered as text rather than markup | passed |
