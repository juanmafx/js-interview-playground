# Security Audit

Audit date: 2026-11-23. Scope: all tracked files and the repository history at the time of the audit. This was a project-level review with automated scanning, not an independent penetration test.

## Fixed

| Severity | Finding | Resolution |
| --- | --- | --- |
| Medium | `npm run start:web` used `python3 -m http.server`, which binds all interfaces and serves the whole working directory, including `.git` | Replaced with a Node.js server that binds to loopback and serves only allowlisted files |
| Low | No security headers | Added a strict CSP and related hardening headers |
| Low | Inline stylesheet prevented a strict `style-src` | Moved styles to an external file |
| Low | `.gitignore` was missing | Added ignores for dependencies, environment files, logs, and local databases |
| Low | `twoSum` and `evenSquares` accepted malformed input silently, including sparse arrays | Added input validation |
| Low | The server accepted any `Host` header, which allowed DNS rebinding to read served files | Requests must name a loopback host or the configured `HOST`; others receive 421 |
| Low | A symlink inside a mount could expose a hidden file | Resolved targets must pass the same hidden-file and file-type rules |
| Low | Symlink loops and overlong names returned 500 | These now return 404 |
| Low | The optional schema accepted malformed timestamps | Timestamps must be valid UTC values in a fixed format |

## Reviewed With No Finding

- Injection and XSS: no HTML sinks, and output uses `textContent`
- Unsafe evaluation: no `eval`, `Function`, or string timers
- CSRF: no state-changing endpoints, and non-GET/HEAD methods return 405
- Authentication, 2FA, and password hashing: not applicable, because the project has no login, contact form, credentials, or stored personal data
- Dependencies: none declared, and `npm audit` reported 0 vulnerabilities
- Tracked build artifacts and private keys: none
- Secrets: a gitleaks scan of the working tree and history is recorded in the release notes

## Open

No code finding is open from this review.

## Limitations

- CI has been defined but has not run on GitHub at the time of this audit.
- The server is not designed for internet exposure.
