# CC IMMUNE — PROJECT MEMORY

> ⚠️ This is the historical build log. For the current state and the rules a
> new contributor must follow, read **`AGENT-HANDOFF.md`** first, then
> **`FILE-MAP.md`**.

## Build status

| Phase | Scope | Status |
|---|---|---|
| 0 | Scaffold, package.json, .env.example, lint config | ✅ |
| 1 | Config layer (env, theme, constants, modules, intents, features) | ✅ |
| 2 | Core (logger, errors+codex, BaseX, Context, Parser, Middleware, Registry, DI, client, boot) | ✅ |
| 3 | Database (connection, 8 models, repositories) | ✅ |
| 4 | FeatureRegistry + handlers + events + `/module` + `/config` | ✅ |
| 5 | UI layer (EmbedFactory, rows, Paginator) | ✅ |
| 6 | Core services (HttpClient, LocaleService) + EN/AR locales | ✅ |
| 7 | Community: leveling, moderation, tickets, giveaways, economy, welcome, automod, suggestions, reaction roles | ✅ |
| 8 | MLBB: API service w/ 3-tier fallback, `/hero`, `/meta` | ✅ |
| 9 | AI: provider factory, guard, memory, coach, `/coach`, `/memory` | ✅ |
| 10 | Audio: MusicService (Lavalink), QuranRadioService, `/play`, `/quran` | ✅ |
| 11 | Diagnostics: `/doctor`, `npm run doctor`, TROUBLESHOOTING.md | ✅ |
| 11.5 | Docker, Railway, PM2, API server, CI, README + docs | ✅ |
| 12 | Website (`web/`) | ⬜ optional |

## Verified working (real runs, not assumptions)

- Boot sequence completes: 37 commands / 12 components / 10 events / 25 services.
- MongoDB connects, 7 models index-synced (real in-memory Mongo).
- **All 4 Quran mirrors live** (real network probe).
- Offline MLBB fallback serves 131 heroes with zero network access.
- Degradation cascade live: no AI key → `ai-provider` degraded → blocks
  `ai-coach` + `ai-translation`; no Lavalink → blocks `music` + `quran`.
- `npm run doctor` → 16 checks, actionable fixes, exit 1 on fatal.
- API server: `/health` 200, `/stats` 200, `/metrics` Prometheus, `/diagnostics` 401.
- 604 tests pass on a fresh clone; ESLint clean.

## Locales
161 keys × 2 languages, **100% parity** (enforced by test + doctor check).

## ⚠️ CONCURRENCY: unique indexes are MANDATORY, not optional

A fresh-clone test on a small-disk volume (where MongoDB refused to build
indexes) exposed two real bugs that the indexes had been masking:

1. **Duplicate documents** — `findOneAndUpdate({upsert:true})` is NOT atomic
   across concurrent callers. 3 parallel `Settings.get()` produced 3 documents.
2. **Lost XP** — `addXp` combined upsert + `$inc`; 20 parallel grants of 10 XP
   produced 180 instead of 200 because inserts raced.

Fixes applied:
- `safeUpsert()` in `models/_base.js` — retries on E11000 so the losing caller
  reads the winner's document instead of throwing. Used by every `ensure()`.
- `MemberRepository.addXp()` now calls `Member.ensure()` FIRST, then `$inc`
  **without** upsert, so no increment can be lost.

**Operational requirement:** run `npm run seed` (or let dev-mode `syncIndexes`
run) before production traffic. Without the unique indexes, duplicates are
unpreventable at the database level — no application code can fix that.

## 🔴 PRODUCTION BUG FOUND & FIXED: sanitizeFilter breaks operators

Reported from a live Wispbyte deploy:
```
[WARN] Job "punishment-expiry" failed
reason=Cast to date failed for value "{ '$lte': 2026-07-26T20:40:53Z }"
```

**Cause:** `mongoose.set('sanitizeFilter', true)` (our NoSQL-injection guard in
`database/connection.js`) treats `{ $lte: value }` as a LITERAL value instead of
an operator, so Mongoose tries to cast the whole object to a Date.

**Fix:** every operator query must be wrapped in `mongoose.trusted()`.
8 call sites patched across JobScheduler, GiveawayService, TicketService,
MemberRepository, MemoryService and tournament.js.

```js
// ❌ throws CastError under sanitizeFilter
ModCase.find({ expiresAt: { $lte: new Date() } })
// ✅ correct
ModCase.find({ expiresAt: mongoose.trusted({ $lte: new Date() }) })
```

`$and` does NOT work as a workaround — verified. Only `trusted()` does.
5 regression tests added in `tests/systems.test.js` that run WITH
sanitizeFilter enabled, including one asserting injection is still blocked.

**Rule for new code:** any `$lte/$gte/$gt/$lt/$in/$ne/$nin` inside a query
filter needs `mongoose.trusted()`.

## Critical gotchas (do not re-learn)

1. `node_modules` is NOT persisted between sessions → `npm install` first.
2. **Empty directories vanish from snapshots** → `.gitkeep` in every empty dir.
3. **Discord has NO Arabic locale.** `setDescriptionLocalizations({ar})` throws
   and the command fails to load. Always use `localize()` from
   `src/utils/localization.js`.
4. **MongoDB partial indexes reject `$ne`.** Use `{ $type: 'date' }`.
5. **Mongoose skips validators on `findOneAndUpdate`.** BaseRepository forces
   `runValidators: true`.
6. Mongoose wraps driver errors → match `MongooseServerSelectionError` too.
7. undici: use `body.dump()`, never `body.destroy()` (emits unhandled error).
8. `env` is frozen at import → changing `process.env` later has no effect.
9. mongodb-memory-server needs `dbPath: './.mongo-tmp'` (tmpfs is too small).
10. discord.js v14 event is `clientReady`, not `ready`.
11. `flags` is invalid on `editReply()` — strip it.
12. Registry skips `_`-prefixed files → use `_helper.js` for shared code.
13. MongoDB refuses to build indexes with <500MB free disk. Tests degrade
    gracefully via `buildIndexes()` + `indexesBuilt` guards.
14. Always validate on a FRESH CLONE (`rsync` minus node_modules/.env) — that
    is what surfaced the concurrency bugs above.

## Architecture invariants (never break)

- Commands touch ONLY `ctx` (CommandContext), never `interaction`/`message`.
- No `throw new Error()` — typed errors + codex entry (test-enforced).
- `process.env` read only in `config/env.js`.
- No hardcoded colours/emojis — `config/theme.js`.
- Cooldown key = `command:user` (NO mode) → mode-switch cannot bypass.
- custom_id = `namespace:action:targetId:extra` via `buildCustomId()`.
- Every command declares `meta.module`; folder → module auto-mapping in Registry.
- Business logic in services; commands stay thin.

## Delivered in the final pass

- **Models (17)**: + Ticket, Giveaway, Economy, ModCase, Suggestion,
  ReactionRole, Tournament, Scrim.
- **Services (17 registered)**: + TicketService, GiveawayService,
  EconomyService, WelcomeService, AutoModService, JobScheduler.
- **Commands (35)**: + /ticket /giveaway /economy /suggest /setup /reactionrole
  /music /draft /profile /rank /leaderboard /mod /about.
- **Components (5)**: ticket, giveaway, confirm, rr, suggestion buttons.
- **Events (8)**: + guildMemberAdd, guildMemberRemove.
- **Jobs (5)**: meta-sync, punishment-expiry, memory-compaction,
  quran-mirror-probe, health-snapshot (with OOM pre-emption).

## Gap audit (final pass)

An automated orphan check found **13 modules declared but unreachable** — they
existed in the manifest with no command, event or component to trigger them.
All are now wired:

- welcome / autorole / automod / logs → driven by events, tagged via
  `relatedModules` so tooling can verify reachability.
- polls → `/poll` + poll button (state lives in the embed, survives restarts)
- announcements → `/announce`
- shop → `/shop` (items stored inline on the Guild document)
- verification → `/verify panel` + verify button
- mlbb-tournaments → `/tournament` (register/checkin/start/report + bracket)
- mlbb-scrims → `/scrim` (post/list/accept/cancel)
- mlbb-news → `/news` (subscribe + official source links)
- ai-translation → `/translate`
- prayer → `/prayer` (Aladhan, Arabic-first)

**Verification now passing:** all 40 modules reachable · all 82 `ctx.t()` keys
exist in the locale files · 0 load failures.

## Deployment footprint (measured, not estimated)

| Metric | Value |
|---|---|
| Source | 1.5 MB |
| `node_modules` (`--omit=dev`) | 47 MB |
| Total disk | **49 MB / 1 GB** |
| Runtime heap | 38 MB |
| Runtime RSS | **114 MB / 715 MB** |

A dependency audit (`grep` for every declared package across src+scripts) found
10 packages declared but never imported, because those layers were hand-written:
own i18n instead of i18next, `node:http` instead of Fastify, `JobScheduler`
instead of node-cron, Lavalink instead of @discordjs/voice. Removing them cut
production install from 168MB to 47MB.

`@napi-rs/canvas` alone was 61MB — kept out until a canvas feature actually
needs it.

**Ship artefact:** `../cc-immune-wispbyte.zip` (391 KB, 207 files, flat
structure, no `.env`, no `node_modules`). Verified by extracting to a clean dir,
running `npm ci --omit=dev`, then `npm run doctor` and a full boot.

## Remaining optional extras

- Canvas rank cards (`@napi-rs/canvas` is already an optionalDependency).
- Vector search for AI memory (Atlas Vector Search path is stubbed).
- `/coach plan` 7-day scheduler, patch-notes RSS watcher, prayer-time announcer.
- Sharding boot file (`ShardManagerBoot.js`) — only needed past ~2,000 guilds.
- Website (Phase 12).

All of these plug into the existing framework: add a module entry, drop a
command file in the right folder, register a service. No architectural change
needed.
