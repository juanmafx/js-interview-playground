# Release Notes: 2.0.0

Version 2.0.0 restructures the playground into separate frontend, backend, and shared modules, adds automated tests, and hardens the local web server. The exercises produce the same output as before for valid input.

## Upgrade Notes

- Use Node.js 22 or newer
- Keep using `npm run start:web` and `npm run start:node`
- Update any direct path references to `index.html`, `index.js`, or `node.js`
- Expect `twoSum` to throw `TypeError` for invalid input

## Verification

- Test suite run on Node.js 22.22.3 and 24.22.0; see [reports/tests/latest.md](reports/tests/latest.md) for the committed run
- Browser flow exercised once in headless Google Chrome with no console or CSP errors
- gitleaks scan of git history and the working tree reported no leaks

## Known Limitations

- The GitHub Actions workflow has not run on GitHub yet
- `npm test` relies on POSIX shell glob expansion and was only run on Linux
- This release is prepared but not tagged or published
