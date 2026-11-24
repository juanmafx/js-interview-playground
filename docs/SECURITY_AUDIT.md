# Security Audit

Audit date: 2026-11-23. Scope: all tracked files and the single commit in the repository history at the time of the audit. This was a project-level review with automated scanning, not an independent penetration test.

## Fixed

| Severity | Finding | Resolution |
| --- | --- | --- |
| Medium | `npm run start:web` used `python3 -m http.server`, which binds all interfaces and serves the whole working directory, including `.git` | Replaced with a Node.js server that binds to loopback and serves only allowlisted files |
| Low | No security headers | Added a strict CSP and related hardening headers |
| Low | Inline stylesheet prevented a strict `style-src` | Moved styles to an external file |
| Low | `.gitignore` was missing | Added ignores for dependencies, environment files, logs, and local databases |
| Low | Exercise functions accepted malformed input silently | Added input validation |

## Reviewed With No Finding

- Injection and XSS: no HTML sinks, and output uses `textContent`
- Unsafe evaluation: no `eval`, `Function`, or string timers
- CSRF: no state-changing endpoints, and non-GET/HEAD methods return 405
- Weak hashing and authentication: the project has neither hashing nor credentials
- Dependencies: none declared
- Tracked build artifacts and private keys: none
- Secrets: a gitleaks scan of the working tree and history is recorded in the release notes

## Open

| Severity | Item | Status |
| --- | --- | --- |
| Informational | The existing commit's author metadata contains a personal email address (masked: `***@hotmail.com`) | Remains in history because history is not rewritten. The owner can decide whether to address it |

## Limitations

- CI has been defined but has not run on GitHub at the time of this audit.
- The server is not designed for internet exposure.
