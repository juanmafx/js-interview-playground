# Architecture

The project follows one rule: exercise logic is pure and lives in `shared/`, while browser and Node.js code stay thin adapters around it.

## Module Structure

```text
.
├── frontend/
│   ├── index.html
│   ├── scripts/
│   │   ├── main.js            Browser composition root
│   │   └── playground.js      DOM binding with injected dependencies
│   └── styles/
│       └── main.css
├── backend/
│   ├── cli/
│   │   ├── main.js            CLI entry point
│   │   └── run-practice.js    Two Sum practice flow
│   └── server/
│       ├── config.js          Environment validation
│       ├── main.js            Server entry point
│       ├── security-headers.js
│       └── static-server.js   Allowlisted static file server
├── shared/
│   ├── algorithms/
│   ├── objects/
│   ├── reports/
│   └── index.js               Public module surface
├── db/schema.sql              Optional persistence
├── scripts/generate-test-report.js
└── tests/
    ├── unit/
    └── integration/
```

## Dependency Direction

```text
frontend/scripts/main.js ──> frontend/scripts/playground.js
          │
          └────────────────> shared/
backend/cli ───────────────> shared/
backend/server ────────────> serves frontend/ and shared/ as files
```

`shared/` imports nothing from `frontend/` or `backend/` and has no DOM or Node.js dependency, so the same modules run in both environments.

## Request Flow

1. The browser requests `/`, and the server returns `frontend/index.html` with security headers.
2. The page loads `/scripts/main.js` as an ES module, which imports report logic from `/shared/`.
3. A click builds the report and writes it to the console and to the output element through `textContent`.

The server first rejects requests with an untrusted `Host` header. It then maps `/shared/` to `shared/` and every other path to `frontend/`. Resolved files must stay inside their mount and pass the hidden-file and file-type rules, so the rest of the repository is not reachable.

## Design Decisions

- **No dependencies.** The project needs only the platform, so it has no supply chain to maintain.
- **Dependency injection at the DOM boundary.** `bindPlayground` receives its elements, logger, and report builder, which makes it testable without a browser.
- **Node.js static server instead of `python3 -m http.server`.** It removes the second runtime and limits what is exposed.
- **Optional SQLite schema.** It models practice runs and exercise results. Nothing in the application depends on it.

## Recommended Evolution

If the project grows, add exercises as new modules under `shared/algorithms/`, keep entry points thin, and introduce a persistence adapter under `backend/` only when a feature actually stores run results.
