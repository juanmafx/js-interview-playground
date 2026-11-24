# Changelog

This project follows [Semantic Versioning](https://semver.org/).

## [2.0.0] - 2026-11-23

### Breaking

- Node.js 22 or newer is required
- Moved `index.html`, `index.js`, and `node.js` into `frontend/` and `backend/`
- Converted the project to ES modules
- `twoSum` now throws `TypeError` on invalid input
- `npm run start:web` now uses the Node.js server and no longer requires Python

### Added

- Shared exercise modules, automated tests, and a generated test report
- Hardened static server with a strict Content Security Policy
- Optional SQLite schema
- GitHub Actions CI with least-privilege permissions and pinned actions
- Architecture, security, and release documentation

### Security

- By default, the web server binds to loopback and no longer exposes the repository
- The web server rejects untrusted `Host` headers to block DNS rebinding
- Symlink targets must pass the same hidden-file and file-type rules as requested paths
- Input validation rejects sparse arrays, and the optional schema rejects malformed timestamps

## [1.0.0] - 2026-03-09

- Initial browser and Node.js interview playground
