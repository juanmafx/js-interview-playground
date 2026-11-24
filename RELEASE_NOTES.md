# Release Notes: 2.0.0

Version 2.0.0 restructures the playground into separate frontend, backend, and shared modules, adds automated tests, and hardens the local web server. The exercises produce the same output as before for valid input.

## Upgrade Notes

- Use Node.js 22 or newer
- Keep using `npm run start:web` and `npm run start:node`
- Update any direct path references to `index.html`, `index.js`, or `node.js`
- Expect `twoSum` and `evenSquares` to throw `TypeError` for invalid input
- Use a loopback name or the configured `HOST` in the browser address, because other `Host` values receive 421

## Verification

- Test suite run on Node.js 22.22.3 and 24.22.0; see [reports/tests/latest.md](reports/tests/latest.md) for the committed run
- Browser flow exercised in headless Google Chrome with no console or CSP errors
- gitleaks scan of git history and the working tree reported no leaks

## Known Limitations

- The GitHub Actions workflow has not run on GitHub yet
- The test suite was only run on Linux
- No tag or GitHub release has been created for this version
