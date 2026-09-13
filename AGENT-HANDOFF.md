# CC Immune — Agent Handoff

> **READ THIS FIRST.** This file is the complete briefing for an AI agent
> taking over development. It replaces guesswork with verified facts.
>
> Last verified: all claims below were tested by running the code, not assumed.

---

## 1. What this is

A production Discord bot for a **Mobile Legends: Bang Bang** community,
written in **plain ES modules on Node 22** with no build step and no framework.

| Fact | Value |
|---|---|
| Live bot | `CC Immune#0393` — 1 guild, ~26 members |
| Live site | https://ccimmune.wisp.uno |
| Host | Wispbyte free tier (Pterodactyl panel) |
| Hard RAM limit | **384 MB heap** (`NODE_OPTIONS=--max-old-space-size=384`) |
| Actual usage | heap ~43 MB · RSS ~135 MB |
| Disk | small — `node_modules` must stay ≈47 MB |
| Tests | **604 passing**, `npx vitest run` |
| Lint | **clean**, `npx eslint .` |
| Code size | ~35,000 lines across 181 files |

**The owner is not a professional programmer.** Explain changes in simple
terms. Never hand over code you have not executed.

---

## 2. Non-negotiable rules

These were learned by breaking production. Violating them causes real outages.

### 2.1 Never ship a `.env` file
A local `.env` once went into the deployment zip and overwrote the owner's real
credentials on the host, producing `401 Unauthorized` and
`ECONNREFUSED 127.0.0.1:27017`. **Always package with `npm run package`** — the
script refuses to build if `.env`, `node_modules` or `.git` are present.

### 2.2 Never let devDependencies install on the host
They inflate `node_modules` from 47 MB to 124 MB and the container dies with
`ENOSPC`. `.npmrc` pins `omit=dev`. Do not remove it.
`mongodb-memory-server` alone tries to download a full MongoDB binary.

### 2.3 `mongoose.trusted()` is mandatory
Any query using `$lte / $gte / $in / $ne` **must** wrap the operator object:

```js
Model.find({ expiresAt: mongoose.trusted({ $lte: new Date() }) });
```

Mongoose 8's `sanitizeFilter` silently strips bare operators. Queries return
nothing and no error is raised. This bug reached production once.

### 2.4 No `throw new Error()`
Use the classified error types in `src/core/errors/` and add a codex entry.
Every user-visible failure must explain *how to fix it*.

### 2.5 Error text goes in `description`, not `title`
Embed titles do not wrap; long titles get truncated mid-sentence.

### 2.6 Commands only touch `ctx`
Never reference `interaction` or `message` directly inside a command. That is
what makes every command work as both slash **and** prefix.

### 2.7 Core modules must not depend on optional env vars
Gating a core module behind `requiredEnv` disables it for everyone who did not
set that variable.

### 2.8 Verify your edit actually applied
Two separate bugs shipped because a search-and-replace anchor did not match and
the change was silently skipped. After editing, `grep` for the new text.

### 2.9 Hero, skill and item names are never translated
Locked by a test. Players use the English names.

---

## 3. Architecture

```
src/
├── index.js          Boot sequence + DI container registration
├── ImmuneClient.js   discord.js client wrapper; `client.services.x` proxy
│
├── config/           Single source of truth — no magic values elsewhere
│   ├── env.js        Zod-validated environment (the ONLY place reading process.env)
│   ├── theme.js      Every colour, emoji, rank. Nothing hardcoded elsewhere.
│   ├── constants.js  NAMESPACES, LIMITS, buildCustomId/parseCustomId
│   └── modules.js    The module manifest — every toggleable system
│
├── core/             Framework-level primitives
│   ├── CommandContext.js  Abstract dual-mode context
│   ├── SlashContext.js    …backed by an interaction
│   ├── PrefixContext.js   …backed by a message
│   ├── Registry.js        Auto-loads commands/events/components
│   ├── Middleware.js      Permission/cooldown/module gates
│   ├── ArgumentParser.js  Prefix parsing incl. `key:value`
│   └── errors/            Classified errors + codex of fix instructions
│
├── commands/<category>/   37 commands, auto-discovered by folder
├── components/            buttons/ selects/ modals/ — routed by custom_id
├── events/                10 gateway event handlers
├── services/              25 services — ALL business logic lives here
├── models/                17 Mongoose schemas
├── database/repositories/ Cached data access
├── api/
│   ├── server.js          HTTP server: /, /health, /stats, /dashboard
│   ├── site/              Public landing page
│   └── dashboard/         Web control panel (auth, service, router, page)
└── ui/                    Embeds, rows, paginator, welcome card
```

### Data flow
```
Discord → event → Handler → Middleware gates → Command(ctx) → Service → Repository → MongoDB
                                                    ↓
                                            UI builder → embed
```

**Commands are thin. Services hold logic. Repositories own the database.**

### Dependency injection
Services are registered in `src/index.js` and resolved lazily via
`client.services.<name>`. Never import a service directly into a command.

### Component routing
`custom_id` format is `namespace:action:targetId:extra`, built with
`buildCustomId()`. Segment 0 selects the handler file, so
`ticket:close:123` → `src/components/buttons/ticket.js`.

---

## 4. External data sources (verified)

### MLBB hero data — Moonton official, no key required
Discovered by reading the JS bundle of `m.mobilelegends.com`.

```
POST https://api.gms.moontontech.com/api/gms/source/2669606/{endpoint}

2756564  heroes (133) + details (filter by hero_id)
2756565 / 2756567 / 2756568 / 2756569 / 2756570
         win rates for 1 / 3 / 7 / 15 / 30 days
```

- No API key, no rate limit observed.
- Newest heroes: **Marcel (132)**, **Hirara (133)**.
- **Moonton serves English only.** `x-lang`, `X-Lang`, `Accept-Language` and
  `X-AppId` were all tested — every one returned English. The `/ar/hero` page
  has an identical md5 to the English one. Do not retry this.
- Working image fields: `head`, `head_big`, `smallmap`.
  `painting` / `squarehead` / `sorticon` are empty in the list response.

**Fallback chain:** Moonton → community wrapper (dead, disabled) → MongoDB
cache → offline JSON (`data/heroes.json`, 131 heroes).

### Item icons — Fandom wiki (CC-BY-SA)
```
https://mobile-legends.fandom.com/api.php?action=query&prop=imageinfo&iiprop=url&titles=File:X.png
```
`scripts/fetch-item-icons.js` baked 44/45 icons into `data/items.json`.
`resolveItemIcon()` resolves new items at runtime and caches negatives too.

⚠️ Item shape differs by source: offline uses `stats` as a **string** and
`category`; live uses `stats` as an **array** and `type`.

### Lavalink
```
jirayu (lavalink.jirayu.net:13592, youshallnotpass)  ← ONLY node supporting HTTP streams
serenetia-v4 / serenetia / ajiedev-*                 ← YouTube only, 502 on live streams
```
- Discovery probes `/v4/loadtracks`, **not** `/version` (working nodes return
  SNAPSHOT or 404 there).
- `LAVALINK_POOL_SIZE=2`. Connecting to 5 nodes caused a flood of `429`s.
- Shoukaku `State.CONNECTED === 1` (**not** 2 — 2 is DISCONNECTING).
- All four Quran mirrors work and play on jirayu.

### AI — OpenRouter
Free model IDs rotate constantly, so `discoverOpenRouterModels()` fetches the
list live at boot. `maxTokens: 1400` (900 truncated replies).

---

## 5. The web dashboard

Served from the **same port** as the bot's landing page — no extra hosting.

```
/                       landing page
/dashboard              control panel (login screen when signed out)
/dashboard/login?token= redeem a magic link
/dashboard/oauth        Discord OAuth (https origins only)
/dashboard/api/*        JSON API
/.well-known/discord    Discord domain verification
```

### Two login methods, one session model
1. **Magic link** — `/dashboard` in Discord DMs a single-use URL valid for
   10 minutes. Works on any host, including plain http. This is the default.
2. **Discord OAuth** — only activates when `DASHBOARD_PUBLIC_URL` is https,
   because Discord rejects non-https redirect URIs. The button is *hidden*
   otherwise rather than shown broken.

### Security model (each item has a test)
- Permission is re-checked against the **live gateway cache on every request**.
  A stale session cannot outlive a demotion.
- Magic links are single-use, 256-bit, and deleted on redemption.
- Sessions expire after 8 hours and die on restart.
- CSRF token required on every mutation.
- Writes go through a **strict allow-list**; the browser cannot write arbitrary
  Mongo paths. Any channel/role id is verified to exist in that guild.
- Critical modules cannot be disabled.

### Public origin auto-detection
The container cannot know its public address. `learnOrigin()` reads
`x-forwarded-proto` / `x-forwarded-host` from real visits and ignores loopback
hosts, so health checks cannot poison the URL used in magic links.

---

## 6. Environment variables

Only `src/config/env.js` reads `process.env`. Everything else imports `env`.

### Required
```
DISCORD_TOKEN     bot token
CLIENT_ID         application id (1530668877435109387)
MONGO_URI         MongoDB Atlas connection string
```

### Host-provided (do not set manually)
```
SERVER_PORT       Pterodactyl allocation → becomes API_PORT automatically
```
⚠️ **Never bind to `SERVER_IP`.** On Wispbyte it holds an external address that
does not exist inside the container (`EADDRNOTAVAIL 10.66.66.25:10201`).
Bind `0.0.0.0`.

### Optional, commonly set
```
OPENROUTER_API_KEY           enables /coach and AI translation
WEBSITE_URL                  public origin, e.g. https://ccimmune.wisp.uno
DASHBOARD_PUBLIC_URL         https origin — enables the OAuth button
CLIENT_SECRET                OAuth2 secret (only read when the above is https)
DISCORD_DOMAIN_VERIFICATION  dh=… token served at /.well-known/discord
SUPPORT_SERVER_URL           defaults to https://discord.gg/zpsu2GYDcK
LAVALINK_POOL_SIZE           keep at 2
MLBB_API_BASE                intentionally empty; the community wrapper is dead
```

Full reference with Arabic explanations: **`VARIABLES.md`**.

---

## 7. Workflow

```bash
npm install --include=dev   # dev install (the plain command omits dev)
npx vitest run              # 604 tests
npx eslint .                # must be clean
npm run package             # build + VERIFY the deployment zip
```

There are **two** archives, and they are not interchangeable:

| Command | Output | Contains | Use for |
|---|---|---|---|
| `npm run package` | `cc-immune-wispbyte.zip` (~598 KB) | runtime only — no tests, no docker | uploading to the host |
| `npm run package:source` | `cc-immune-source.zip` (~683 KB) | everything incl. 27 test files + all docs | handing to a developer or an AI agent |

Both self-verify and **fail the build** if a secret leaked in or a required
file is missing. Never build an archive by hand with `zip` — that is exactly
how a `.env` reached production.

`npm run map` regenerates `FILE-MAP.md` after you add or remove files.

### Adding a command
1. Create `src/commands/<category>/<name>.js`
2. Export `{ data, meta, execute(ctx) }`
3. That is all — the Registry auto-discovers it

### Adding a module toggle
Add one entry to `src/config/modules.js`. The FeatureRegistry, `/module`,
`/doctor`, the dashboard and the loaders all read from that manifest.

---

## 8. Current state

### Working
37 commands · 12 components · 10 events · 25 services · 41/42 modules enabled
(`redis` off — no `REDIS_URL`).

Recent additions:
- **Interactive setup wizard** — `/setup` scans the server, shows a plan, and
  creates nothing until you confirm. Reuses channels you already made instead
  of duplicating them (`💬・general-chat` matches the `general` slot).
- **Web dashboard** — 4 tabs: setup, channels, modules, general.
- **Domain verification** endpoint.

### Known gaps
| Item | Note |
|---|---|
| `OPENROUTER_API_KEY` unset | `/coach` and AI translation are degraded |
| `CLIENT_SECRET` unset | OAuth button hidden (magic links still work) |
| Welcome card is SVG | Not yet confirmed to render inline in Discord |
| Dashboard covers config only | Music/tickets/giveaways/economy tabs not built |
| AI cannot search the web | Requires a search tool + filtering |

### Design decisions — do not reverse without reason
- **No canvas.** `@napi-rs/canvas` is 61 MB against a 384 MB heap. The welcome
  card is a 2.5 KB SVG.
- **Arabic uses player slang, not literal translation** — تانك not دبابة,
  ماج not ساحر. 160+ terms in `data/ar-terms.json`.
- **Moonton disclaimer is mandatory in every hero embed.**

---

## 9. Where to look

| Task | File |
|---|---|
| Hero/item data | `src/services/mlbb/MLBBApiService.js` |
| Official API client | `src/services/mlbb/MoontonDirectClient.js` |
| Music | `src/services/audio/MusicService.js` |
| Lavalink discovery | `src/services/audio/NodeDiscovery.js` |
| Setup planning (pure logic) | `src/services/SetupPlanner.js` |
| Setup wizard UI | `src/ui/SetupWizardUI.js` |
| Dashboard auth | `src/api/dashboard/DashboardAuth.js` |
| Dashboard permissions | `src/api/dashboard/DashboardService.js` |
| Hero embeds | `src/ui/embeds/LiveHeroEmbed.js` |
| Error codex | `src/core/errors/codex.js` |
| Arabic terminology | `data/ar-terms.json` |
| Owner-facing docs (Arabic) | `VARIABLES.md` |

---

## 10. Communication

The owner writes in **Egyptian Arabic**. Reply in Egyptian Arabic, keeping
technical terms in English. He is not a programmer: give numbered steps, say
exactly which button to click, and state plainly when something is optional.

**Admit mistakes directly.** He has explicitly said he values this.

**Test before claiming.** Statements like "it works now" without an executed
command have caused repeated frustration. Run it, paste the output.
