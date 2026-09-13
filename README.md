<div align="center">

# 🛡️ CC Immune

**Immune to CC. Built for the Land of Dawn.**
*محصّن ضد التحكم. مصنوع لأرض الفجر.*

A production-grade Mobile Legends: Bang Bang Discord bot — hero data, an AI coach
with real memory, music, Quran radio, and a diagnostics system that tells you
exactly what broke and how to fix it.

![Node](https://img.shields.io/badge/node-22_LTS-339933?logo=node.js&logoColor=white)
![discord.js](https://img.shields.io/badge/discord.js-v14-5865F2?logo=discord&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-8-47A248?logo=mongodb&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-00E5FF)

</div>

> **Contributing or handing this to an AI agent?**
> Read **[`START-HERE.md`](START-HERE.md)** → **[`AGENT-HANDOFF.md`](AGENT-HANDOFF.md)** → **[`FILE-MAP.md`](FILE-MAP.md)**.

---

## Why this bot is different

| Most bots | CC Immune |
|---|---|
| Crashes on a bad config | Refuses to start with a **numbered error code + fix steps** |
| "Something went wrong" | `DB-002` → *"whitelist 0.0.0.0/0 in Atlas Network Access"* |
| One broken feature kills the bot | Each module **degrades independently** and auto-restores |
| Slash **or** prefix commands | **Both**, from one command file — no duplicated logic |
| AI that invents stats | AI **grounded** in real hero data, labelled with its source |
| Chatbot with no memory | **7-tier memory**: remembers your rank, heroes and weaknesses |

---

## Features

### ⚔️ Mobile Legends
- **131 heroes** — complete roster with roles, lanes, difficulty and tier
- **45 items** with stats, passives and counter-tags (anti-heal, anti-tank…)
- Role-based build templates: emblem, battle spell, item order, situational picks
- Hero database with win/pick/ban rates, counters and synergies
- Meta tier list (S+ → D), filterable by role and sortable by rate
- Counter finder and random hero picker
- **Three-tier data resilience**: live API → MongoDB cache → offline JSON.
  Hero commands keep working even with zero network access.

### 🤖 AI Coach ("Immune Coach")
- `/coach ask` — free-form MLBB Q&A
- `/coach analyze` — structured performance review from a form
- `/coach draft` — counter-pick advice for a live draft
- **Grounded**: hero numbers come from the database, never from the model
- **Swappable providers**: OpenRouter (default) → Groq → OpenAI, with provider failover *and* an OpenRouter model-fallback chain for rate-limited free models

### 🧠 AI Memory
Remembers your rank, hero pool, weaknesses and goals across sessions.
Strictly opt-in, PII-scrubbed, isolated per user, and fully exportable/erasable.

### 🎵 Audio
- **Zero-config music**: auto-discovers a free public Lavalink node at boot and
  picks the fastest, with automatic failover. Works on hosts that cannot run
  Lavalink themselves.
- Music from any link (YouTube, SoundCloud, Spotify, direct streams)
- **📿 Quran Radio from Cairo** — 24/7 with automatic mirror failover and
  per-reciter stations. Blocks normal music while active, by design.

### 🧩 Module Control
Every system can be switched off independently, at four levels, without a restart:

```
/module list                 # dashboard of all 40 modules
/module disable music --for 2h
/module info music           # why is it off? what does it block?
/module panic                # emergency: disable all non-critical modules
/config module economy off   # per-server, for admins
```

Dependencies cascade automatically: disable `lavalink` and both `music` and
`quran` report *"Requires Lavalink Audio Node which is unavailable"* — never a
silent failure.

### 🩺 Diagnostics
```
npm run doctor          # full preflight WITHOUT logging in
/doctor health          # live subsystem dashboard
/doctor command <name>  # replays every gate to show exactly what blocked it
/doctor guild           # permission + broken-reference audit
/doctor error IMN-XXXX  # look up any error a user reported
```

### 🌐 Landing Website
A complete, game-themed marketing page served by the bot itself at `/` — no
second host, no build step, no CDN. Bilingual with an instant toggle, live
counters pulled from `/stats`, and CTA buttons for the invite and support
server. The invite URL is derived from `CLIENT_ID` when not set explicitly, so
the button is never dead.

```
API_SERVER_ENABLED=true
WEBSITE_ENABLED=true
```

On Pterodactyl-based hosts the port is read from `SERVER_PORT` automatically.
See [`WEBSITE.md`](./WEBSITE.md).

### 🌍 Bilingual
Full English + Arabic with proper RTL handling. 153 keys, 100% parity enforced
by a test.

> **Note:** Discord's API has no Arabic locale, so command *descriptions* in the
> picker stay English. Everything the bot actually says — embeds, buttons,
> errors — is fully translated, plus Arabic command aliases (`!بطل`, `!تشغيل`).

---

## Quick start

```bash
git clone <your-repo> cc-immune && cd cc-immune
npm install
cp .env.example .env      # fill in DISCORD_TOKEN, CLIENT_ID, MONGO_URI
npm run doctor            # verify everything BEFORE first boot
npm run deploy            # register slash commands
npm start
```

**Minimum required:** `DISCORD_TOKEN`, `CLIENT_ID`, `MONGO_URI`.
Everything else degrades gracefully — no Lavalink means music disables itself
and the rest of the bot runs normally.

---

## Deployment

### Wispbyte (free tier)
Constraints: ~715MB RAM, ~15% CPU, no Docker.

1. Create a **Node.js 22** server, upload the repo (or pull from GitHub).
2. Startup command: `node src/index.js`
3. Install: `npm ci --omit=dev`
4. In the **Startup** tab set at minimum:
   ```
   DISCORD_TOKEN, CLIENT_ID, MONGO_URI
   NODE_OPTIONS=--max-old-space-size=384
   CACHE_DRIVER=memory
   SHARDING_ENABLED=false
   ```
5. **MongoDB Atlas:** Network Access → add `0.0.0.0/0`, or you will hit `DB-002`.
6. **Lavalink cannot run on the same free instance.** Leave `LAVALINK_HOST`
   empty (music disables cleanly) or point it at an external node.

### Railway
`railway.json` is included. Add a MongoDB plugin and, optionally, a second
service for Lavalink.

### VPS / Docker
```bash
docker compose -f docker/docker-compose.yml up -d
```
Brings up bot + MongoDB + Redis + Lavalink. For bare metal use
`pm2 start pm2.config.cjs`.

---

## Architecture

```
src/
├── config/       env (zod) · theme · constants · modules manifest · intents
├── core/         Logger · errors + codex · CommandContext (slash+prefix)
│                 ArgumentParser · Middleware · Registry · ErrorBoundary
├── diagnostics/  FeatureRegistry (module state authority)
├── database/     connection + repositories (no raw model access in commands)
├── models/       Mongoose schemas
├── services/     business logic (MLBB, AI, memory, audio, locale, http)
├── handlers/     router · prefix · components · autocomplete · cooldowns
├── commands/     auto-loaded, grouped by category
├── events/       auto-loaded
├── ui/           EmbedFactory · rows · paginator
└── locales/      en/ · ar/
```

**Key invariants**
- Commands never touch `interaction` or `message` — only `CommandContext`.
- No `throw new Error()`: every failure is a typed error with a codex code.
- Nothing reads `process.env` except `config/env.js`.
- No hardcoded colours or emojis — always from `config/theme.js`.
- Cooldowns key on `command:user`, **not** the mode, so switching between
  `/hero` and `!hero` cannot bypass them.

---

## Commands

**Mobile Legends**
| Command | Aliases | Description |
|---|---|---|
| `/hero info\|counter\|random` | `h`, `بطل` | Hero database |
| `/meta` | `tierlist`, `ميتا` | Meta tier list |
| `/draft analyze\|bans` | `درافت` | Composition analysis & ban priority |
| `/profile view\|link\|rank\|mains` | `mlbb`, `ملف` | Player profile & rank tracking |
| `/tournament create\|register\|checkin\|start\|report` | `بطولة` | Tournaments with auto-bracket |
| `/scrim post\|list\|accept\|cancel` | `سكريم` | Scrim finder board |
| `/news latest\|subscribe` | `اخبار` | Patch notes & news |

**AI**
| Command | Aliases | Description |
|---|---|---|
| `/coach ask\|analyze\|draft` | `مدرب` | AI coaching, grounded in real data |
| `/memory view\|stats\|export\|clear\|privacy` | `ذاكرة` | Control what the AI remembers |
| `/translate` | `ترجم` | AI translation (EN/AR focused) |

**Audio**
| Command | Aliases | Description |
|---|---|---|
| `/play` | `p`, `تشغيل` | Play from any link or search |
| `/music nowplaying\|queue\|skip\|pause\|loop\|volume` | `m`, `موسيقى` | Playback controls |
| `/quran radio\|stop\|status\|reciter` | `q`, `قران` | Quran radio from Cairo |
| `/prayer` | `صلاة` | Prayer times (Aladhan) |

**Community**
| Command | Aliases | Description |
|---|---|---|
| `/ticket open\|close\|claim\|add\|transcript\|panel` | `تذكرة` | Support tickets |
| `/poll` | `تصويت` | Button polls with live results |
| `/announce` | `اعلان` | Formatted announcements |
| `/shop view\|buy\|inventory\|add` | `متجر` | Server shop with role rewards |
| `/verify panel` | `توثيق` | Member verification gate |
| `/giveaway start\|end\|reroll` | `gw`, `سحب` | Giveaways with requirements |
| `/economy balance\|daily\|work\|pay\|deposit\|rich` | `eco`, `رصيد` | Currency system |
| `/rank` · `/leaderboard` | `xp`, `lb`, `مستوى` | Levels and leaderboards |
| `/suggest` | `اقتراح` | Suggestions with voting |
| `/mod timeout\|kick\|ban\|purge` | `ادارة` | Moderation |

**Configuration**
| Command | Aliases | Description |
|---|---|---|
| `/setup status\|auto\|channel\|export` | `اعداد` | Server setup wizard |
| `/config modules\|module\|ignore` | `اعدادات` | Per-server module toggles |
| `/reactionrole create\|add` | `rr`, `رتب` | Self-assign role panels |
| `/prefix set\|add\|remove` | `بادئة` | Manage prefixes |
| `/language` | `lang`, `لغة` | Switch language |

**Utility & Owner**
| Command | Aliases | Description |
|---|---|---|
| `/help` · `/about` · `/ping` | `مساعدة`, `معلومات`, `بنج` | Info |
| `/module` *(owner)* | `mod`, `نظام` | Global module control |
| `/doctor health\|command\|guild\|error` *(admin)* | `diag`, `تشخيص` | Diagnostics |

---

## Testing

```bash
npm test          # 604 tests
npm run lint
```

Integration tests run against a **real in-memory MongoDB**, not mocks. That is
how these real bugs were caught before shipping:

- `$ne` is invalid in a MongoDB partial index (would break index creation)
- Mongoose skips validators on `findOneAndUpdate` (invalid data written silently)
- Concurrent upserts create duplicate documents without a unique index
- `upsert` + `$inc` in one call loses increments under load (XP loss)
- `sanitizeFilter: true` silently breaks `$lte`/`$gte` query operators

The landing page is covered too, including nine tests that execute its client
script in a real DOM (jsdom) to verify the language toggle, the particle layer
and the live-stat formatting.

> **Run `npm run seed` before production traffic.** It builds the unique indexes
> that make concurrent writes safe.

---

## Troubleshooting

Every error has a code. See [`TROUBLESHOOTING.md`](./TROUBLESHOOTING.md).

| Code | Meaning |
|---|---|
| `CFG-002` | Invalid bot token |
| `DB-002` | Cannot reach MongoDB (usually the Atlas IP whitelist) |
| `DSC-001` | Interaction expired — defer before slow work |
| `PRM-002` | Bot missing permissions — run `/doctor perms` |
| `AUD-001` | Lavalink unreachable — music auto-disables |
| `AI-001` | No AI provider key configured |
| `INT-002` | Memory pressure — lower `--max-old-space-size` |

---

## Disclaimer

CC Immune is **not affiliated with, endorsed by, or sponsored by Moonton**.
Mobile Legends: Bang Bang is a trademark of Moonton. Hero statistics come from
an unofficial community API and are labelled with their source and retrieval
date wherever they are displayed.

## License

MIT
