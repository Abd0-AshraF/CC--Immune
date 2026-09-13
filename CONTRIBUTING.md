# Contributing

## Setup
```bash
npm install
cp .env.example .env
npm run doctor    # verify your environment
npm test
```

## Non-negotiable conventions

These are enforced by tests and review — please do not work around them.

1. **ESM only.** Always include the `.js` extension in imports.
2. **No `process.env` outside `src/config/env.js`.**
3. **No `throw new Error()`.** Use a typed error from `core/errors/ImmuneError.js`
   and add a codex entry — a test fails if a code has no documented fix.
4. **Commands never touch `interaction` or `message`.** Use `ctx` only, or the
   command will break in prefix mode.
5. **No hardcoded colours or emojis.** Import from `config/theme.js`.
6. **Every command declares `meta.module`** so it can be disabled at runtime.
7. **Locale parity.** Any key added to `en/` must be added to `ar/`.
8. **Business logic belongs in services**, not commands.
9. **Wrap query operators in `mongoose.trusted()`.** We run with
   `sanitizeFilter: true` to block NoSQL injection, which makes a bare
   `{ $lte: x }` throw a CastError:
   ```js
   Model.find({ expiresAt: mongoose.trusted({ $lte: new Date() }) })
   ```

## Adding a command
Create `src/commands/<category>/<name>.js` exporting `{ data, meta, execute }`.
It is auto-loaded — no registration needed. It automatically works as both a
slash and a prefix command.

## Adding a module
Add an entry to `src/config/modules.js`. It immediately becomes controllable
via `/module` with dependency cascade and per-guild toggles.

## Adding an error code
Add it to `src/core/errors/codex.js` with `cause`, `checks` and `fix`, then run
`node scripts/generate-docs.js`.

## Before opening a PR
```bash
npm run lint && npm test
```
