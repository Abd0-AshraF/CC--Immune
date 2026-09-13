# Changelog

All notable changes to this project are documented here.
Format based on [Keep a Changelog](https://keepachangelog.com/).

## [1.0.0] — 2026-07-26

### Core
- Dual-mode commands: one file runs as both slash and prefix (`CommandContext`)
- `ArgumentParser` producing slash-identical args from prefix text
- Shared middleware chain — cooldowns cannot be bypassed by switching mode
- Typed error hierarchy with a 48-entry Error Codex
- Auto-loading registry for commands, events and components
- DI container with dependency ordering and reverse-order disposal

### Modules
- 40-module manifest with four-level control and dependency cascade
- `/module` (owner) and `/config module` (admin) with persistence across restarts
- Emergency `/module panic` and `/module recover`

### Mobile Legends
- Hero database with three-tier fallback (live → MongoDB → offline JSON)
- Meta tier list, counter finder, random hero

### Tickets
- `/setup auto` now creates a 『 SUPPORT 』 category and an #open-a-ticket
  channel, and records ticketCategory. It previously created four categories
  but never one for tickets, so every ticket opened as a loose channel at the
  bottom of the server
- The category is hidden from @everyone; each ticket grants access to its owner
  and staff only

### Welcome card
- Welcome messages now include a rendered banner (server name, avatar, username
  and member number) instead of a plain embed
- Drawn as SVG rather than with a canvas library: @napi-rs/canvas is ~61MB of
  native binaries against a 384MB heap, while the SVG is 2.5KB of text
- Usernames are escaped and truncated; a failed avatar fetch falls back to a
  monogram; any render failure still sends the greeting without the card
- Arabic and English copy, and `welcomeCard=false` opts out

### Audio control panel (new)
- `/music panel` opens a live control surface: play/pause, skip, stop, loop,
  shuffle, volume and a Quran switch, re-rendered after every action
- Buttons that cannot apply are disabled rather than silently failing, and skip
  is disabled during Quran radio because the stream is endless
- Control requires being in the same voice channel
- Added the underlying service methods the panel needs: setPaused, skip,
  setVolume and setLoop

### Prefix parsing
- `key:value` is now accepted alongside `key=value`, because Discord's own UI
  renders options as `channel:` and users type that form. URLs and times are
  unaffected: the split only happens when the key is a declared option
- Free-text options are greedy even when they are not last, fixing
  `!play never gonna give you up`, which fed the trailing words into the
  `source` choice list and failed validation

### Setup
- `/setup panels` is actually registered now: the previous release added the
  handler but not the subcommand declaration, so it never appeared

### Music
- Fixed playback stopping after the first track: no listener was ever bound to
  the player's 'end' event, so the queue never advanced. Track end, exception,
  stuck and closed are now handled, and 'replaced' is ignored so a manual skip
  does not double-advance
- Listeners bind once per player, so rejoining cannot stack duplicates

### Tickets
- "Something went wrong" replaced with a real diagnosis: the bot now checks for
  Manage Channels up front, and falls back to creating the ticket outside the
  configured category when that category is missing, deleted or full
- Added codex entries MOD-010 and MOD-011, both previously thrown without one

### Setup
- New `/setup panels [channel]` publishes the info panels without re-running
  the full auto-setup, and reports exactly why if it cannot

### Module gating (regression from the previous release)
- `mlbb-api` listed MLBB_API_BASE in requiredEnv, but that variable configures
  the optional community wrapper which is now off by default. Emptying it
  disabled the module, and the dependency cascade took mlbb-heroes, the tier
  list and the info panels with it — every hero command replied
  "Module is disabled"
- The module no longer gates on it: Moonton direct is primary and always
  configured, with a bundled offline dataset behind it. The service degrades
  itself only when every source genuinely fails
- Added a test rejecting any non-optional module gated on an unset variable

### Data sources
- The community wrapper is now opt-in and OFF by default: mlbb.rone.dev has no
  DNS record at all (verified against public resolvers) and the documented
  mirror 404s on every path, including its root
- It reports "skipped" rather than "unreachable", because a disabled optional
  fallback is not a fault. Everything it used to provide now comes from Moonton
  direct, with items served from the bundled icon-backfilled catalogue
- Fixed ping(): it probed `/hero-list/` on the retired wrapper host, so the
  module could never auto-restore even while the primary source was healthy

### Arabic terminology
- Replaced literal translations with the loanwords Arabic players actually use:
  تانك not دبابة, ماج not ساحر, الميد not المسار الأوسط
- Expanded the glossary to 160 terms covering roles, lanes, skill tags, item
  categories and UI labels, applied across every embed
- Verified Moonton's public API does not serve Arabic hero/skill text under any
  header combination, and that the Arabic site returns byte-identical English
  content — so a curated glossary is the honest approach, not a workaround
- Hero, skill and item NAMES are never translated; a test enforces this

### Build item icons
- A Discord embed allows a single image, so a six-item build could never show
  six icons. Each item now has its own button that opens it with its real icon,
  stats, price and passive
- Missing icons are resolved on demand before the build renders

### Interactive hero UI (root cause)
- Hero buttons failed with "Something went wrong fetching that" because
  LocaleService.resolve() is async and takes {userId, discordLocale}, but the
  handler passed the interaction and never awaited it. `locale` was therefore a
  pending Promise, every `locale === 'ar'` check was false, and the embed
  builders received an object where a string was required
- A test now rejects any component that calls resolve() without awaiting

### Items
- syncLive() replaced the item catalogue wholesale, discarding every icon the
  moment the live API responded. It now merges, keeping icons
- New runtime icon resolver: items introduced by a patch are looked up on demand
  and cached, including negative results

### Interactive hero UI
- Fixed every hero button being dead: they resolved `services.mlbb` while the
  container registers `mlbbApi`, so each one replied "service is unavailable".
  A test now asserts every component references a registered service
- New per-skill buttons: each skill opens with its own icon, full description,
  tags and cooldown/mana cost, including the passive
- New Lore tab and `/hero lore`: hero story, splash art, home region, other
  heroes from that region and the official lore link
- Added data/regions.json — 10 Land of Dawn regions covering 92 heroes

### Items
- Backfilled real item icons into data/items.json from the Fandom wiki
  (CC-BY-SA) via scripts/fetch-item-icons.js, so icons survive an API outage
- Fixed a crash in /item info: offline stats are a string, live stats an array
- Fixed builds returning nothing offline: items use `category` there and `type`
  live, and only one was read

### AI coach
- The coach now receives the real item catalogue for the hero in question, with
  stats and passives. It previously had no item data at all, which is why build
  questions got generic answers
- Stricter contract: no invented item or skill names, a full six-item order for
  build questions, and no one-sentence replies
- Raised the answer budget from 900 to 1400 tokens

### Audio — Quran radio root cause
- Several public Lavalink nodes serve YouTube but have the HTTP source manager
  disabled and answer a direct stream URL with 502. Music therefore worked
  while Quran radio joined the channel, played nothing and left
- Discovery now probes HTTP-stream support and ranks capable nodes first
- Direct stream URLs are routed only to stream-capable nodes, with an automatic
  retry on a different node before failing
- Node list reordered: jirayu is the only verified stream-capable public node

### Branding
- SUPPORT_SERVER_URL now defaults to the community invite, so the site, /about
  and /help all show a working link with no configuration. An explicit value
  still overrides it

### Website
- Fixed the language toggle doing nothing: both languages were rendered into
  the DOM but no CSS rule ever hid the inactive one, so English never showed
- The bot's real Discord avatar is now used for the header mark, the favicon
  and the link-preview image, with the previous SVG as a fallback

### Info panels
- Every stats panel now carries hero splash art plus a portrait thumbnail, and
  each panel has its own accent colour
- Interactive buttons: Refresh (30s per-user cooldown), rotate between the
  three stats views in place, and jump straight to hero details or matchups
- Splash art URLs are cached so a refresh does not refetch them

### Info panels (new)
- Five self-updating panels: meta tier list, top win rates, most-banned heroes,
  hero of the day, and server stats
- Panels EDIT one message in place every six hours rather than re-posting, so
  the channel stays clean and pins survive
- Message ids persist per guild; a deleted panel is recreated exactly once
  (detected via Discord error 10008) and permission errors never duplicate
- `/setup auto` creates the channel and publishes the panels immediately
- Tier boundaries use closed ranges: a per-tier cap combined with `>=` pushed
  overflow heroes into the tier below and mislabelled them

### Audio
- `play()` threw a silent `null` when no player existed, so Quran radio joined
  the voice channel and sat mute with no error — the reported symptom
- Quran radio now walks its remaining mirrors when the first stream fails to
  resolve, and leaves the channel with a clear message if all fail
- Panel refresh checks the Mongoose connection state first: querying while
  disconnected buffered the operation until timeout and stalled the job

### Audio (from a real deployment log)
- `music` and `lavalink` no longer require LAVALINK_HOST: the variable gated the
  modules off before auto-discovery could supply a node, so music was disabled
  while three nodes were connecting successfully
- Fixed the node health count using Shoukaku state `2` (DISCONNECTING) instead
  of `1` (CONNECTED) — /doctor reported 0/3 up while all three were live
- Connect to at most two nodes and never twice to the same host: opening five
  sockets made the public nodes return HTTP 429 in a reconnect loop
- A single node dropping no longer marks the whole service unavailable
- Repeated close events log once per node instead of flooding

### HTTP server
- Never bind to SERVER_IP: on Wispbyte it is the node's external address and is
  not present inside the container (EADDRNOTAVAIL), which stopped the website
  from starting. Falls back to 0.0.0.0 automatically

### Music
- Fixed playback stopping after the first track: no listener was ever bound to
  the player's 'end' event, so the queue never advanced. Track end, exception,
  stuck and closed are now handled, and 'replaced' is ignored so a manual skip
  does not double-advance
- Listeners bind once per player, so rejoining cannot stack duplicates

### Tickets
- "Something went wrong" replaced with a real diagnosis: the bot now checks for
  Manage Channels up front, and falls back to creating the ticket outside the
  configured category when that category is missing, deleted or full
- Added codex entries MOD-010 and MOD-011, both previously thrown without one

### Setup
- New `/setup panels [channel]` publishes the info panels without re-running
  the full auto-setup, and reports exactly why if it cannot

### Module gating (regression from the previous release)
- `mlbb-api` listed MLBB_API_BASE in requiredEnv, but that variable configures
  the optional community wrapper which is now off by default. Emptying it
  disabled the module, and the dependency cascade took mlbb-heroes, the tier
  list and the info panels with it — every hero command replied
  "Module is disabled"
- The module no longer gates on it: Moonton direct is primary and always
  configured, with a bundled offline dataset behind it. The service degrades
  itself only when every source genuinely fails
- Added a test rejecting any non-optional module gated on an unset variable

### Data sources
- Added a direct client for Moonton's own content API (api.gms.moontontech.com),
  discovered by reading the official website's JS bundle. No key, no rate limit,
  and it is the same upstream the community wrapper forwards to
- It is now the primary source, giving a four-tier fallback chain:
  Moonton -> community wrapper -> MongoDB -> offline JSON
- Picks up heroes the offline snapshot never had (Marcel 132, Hirara 133)
- Evaluated mlbb.io, mlbb.gg and the Fandom wiki: the first two expose no public
  API, and Fandom returns wiki templates rather than structured data

### AI grounding
- The coach now receives real skill names with their tags, plus Moonton's own
  explanation of why a hero loses a matchup, instead of bare win rates
- Added an explicit rule forbidding invented skill names

### Diagnostics
- `npm run doctor` probes the Moonton API instead of a retired `/hero-list/`
  path that could never succeed
- `/doctor health` names the source actually serving data

### Error messages
- Fixed unsubstituted `{command}` / `{given}` / `{options}` placeholders: the
  interpolator only handles `{{var}}` and the new strings used single braces.
  Audited every locale string; a test now enforces the convention
- Validation errors render in the embed description instead of the title, which
  does not wrap and stripped the guidance onto one unreadable line
- `!hero meta` now points at the standalone `!meta` command (alias-aware)
- `/item info` states plainly when it is serving offline data without images

### Diagnostics
- Music health no longer reports "LAVALINK_HOST not configured" when a node was
  found by auto-discovery; it now reflects the actually-connected nodes
- Dropped the documented MLBB high-volume mirror: it 404s on every path
  including its own root, so failover reported the dead host's error instead of
  falling back to cached data

### Networking
- HttpClient now follows HTTP redirects (bounded at 3 hops). undici does not do
  this by default, so any endpoint that 302s — including the Aladhan prayer API
  on every single request — returned an empty body and looked like an outage

### AI
- OpenRouter free models are discovered from the live catalogue at boot. Every
  hard-coded free slug had already been retired upstream, so /coach failed with
  a perfectly valid API key
- Discovery skips safety, embedding and code-only models, and prefers the
  largest context window

### Command reliability (round 3)
- Stale guild-scoped commands are now discovered and removed automatically:
  the previous fix only ran when PRUNE_GUILD_ID was set by hand, so in practice
  it never fired and old commands kept shadowing the current set
- Typing a subcommand as if it were a command (`/radio`) now replies with the
  real path (`/quran radio`) instead of "no longer exists"
- `npm run undeploy` enumerates the bot's guilds instead of requiring an id

### Command reliability (round 2, from production logs)
- Invoking a subcommand-only command bare (e.g. `/coach`) ran a default branch
  with empty options and failed with "Input rejected: empty". A single router
  guard now lists the valid subcommands instead — this affected 17 commands
- Migrated the remaining raw `ephemeral: true` interaction replies to the v14
  `MessageFlags.Ephemeral` API, clearing the deprecation warning at boot

### Embeds
- Hero embeds carry splash art, portrait, role-coloured accents and skill icons
- New Build tab links a hero to concrete items in purchase order
- "Ask the coach" button hands over a ready-to-run command for that hero
- Link button to the official Moonton hero page, plus wiki and video links

### Command reliability (reported from production)
- Unknown slash commands now reply instead of returning silently, which
  Discord surfaced as "The application did not respond"
- Unknown subcommands report VAL-003 listing the valid ones, instead of
  VAL-001 from the first option's validator — `!coach menu` previously said
  "That input is not valid", which described the wrong problem entirely
- Deploys prune the unused command scope, so commands registered in an earlier
  deploy stop appearing in the picker forever
- `npm run undeploy` now clears both global and guild scopes and prints what
  it removed

### Mobile Legends data (rebuilt)
- Migrated to the current community API; the previous host was retired and
  every live call had been failing silently
- Hero embeds now carry real Moonton artwork: splash art, portraits, skill
  icons and role/lane icons
- Skills with descriptions, tags and costs; lore; ability stat bars
- Live win/pick/ban rates and head-to-head counter advantages
- Real item catalogue (~150 items) with icons, stat lines and passives
- Interactive Overview / Skills / Matchups tabs on hero embeds
- Arabic served natively by the upstream API (`lang=ar`), per user locale
- Nightly sync refreshes heroes and items automatically

### Audio
- Fixed auto-discovery rejecting every working Lavalink node: the probe
  required `/version` to start with "4", but healthy nodes return SNAPSHOT
  build hashes or 404 that route entirely. Probing `/v4/loadtracks` proves
  both the v4 contract and that playback actually resolves
- Node list re-verified; dead nodes removed, working mirrors added

### Website
- Server-rendered bilingual landing page at `/`, themed to match the embeds
- Live counters fed by `/stats`, refreshed only while the tab is visible
- Invite URL derived from `CLIENT_ID` when unset; missing links render as
  disabled buttons rather than dead anchors
- Port auto-detected from `SERVER_PORT` on Pterodactyl-based hosts
- Inlined CSS/JS: one request, no CDN, no external font, no build step

### AI
- Swappable providers (OpenRouter default / Groq / OpenAI) with auto-failover
- OpenRouter model-fallback chain: rate-limited or retired free models are
  skipped in-flight without a restart (auth errors stay fatal)
- Coach grounded in real hero data
- Seven-tier memory layer, opt-in with export and erasure
- Injection defence in English and Arabic

### Audio
- Lavalink v4 via Shoukaku, degrades cleanly when absent
- Quran Radio from Cairo with automatic mirror failover

### Website
- Fixed the language toggle doing nothing: both languages were rendered into
  the DOM but no CSS rule ever hid the inactive one, so English never showed
- The bot's real Discord avatar is now used for the header mark, the favicon
  and the link-preview image, with the previous SVG as a fallback

### Info panels
- Every stats panel now carries hero splash art plus a portrait thumbnail, and
  each panel has its own accent colour
- Interactive buttons: Refresh (30s per-user cooldown), rotate between the
  three stats views in place, and jump straight to hero details or matchups
- Splash art URLs are cached so a refresh does not refetch them

### Info panels (new)
- Five self-updating panels: meta tier list, top win rates, most-banned heroes,
  hero of the day, and server stats
- Panels EDIT one message in place every six hours rather than re-posting, so
  the channel stays clean and pins survive
- Message ids persist per guild; a deleted panel is recreated exactly once
  (detected via Discord error 10008) and permission errors never duplicate
- `/setup auto` creates the channel and publishes the panels immediately
- Tier boundaries use closed ranges: a per-tier cap combined with `>=` pushed
  overflow heroes into the tier below and mislabelled them

### Audio
- `play()` threw a silent `null` when no player existed, so Quran radio joined
  the voice channel and sat mute with no error — the reported symptom
- Quran radio now walks its remaining mirrors when the first stream fails to
  resolve, and leaves the channel with a clear message if all fail
- Panel refresh checks the Mongoose connection state first: querying while
  disconnected buffered the operation until timeout and stalled the job

### Audio (from a real deployment log)
- `music` and `lavalink` no longer require LAVALINK_HOST: the variable gated the
  modules off before auto-discovery could supply a node, so music was disabled
  while three nodes were connecting successfully
- Fixed the node health count using Shoukaku state `2` (DISCONNECTING) instead
  of `1` (CONNECTED) — /doctor reported 0/3 up while all three were live
- Connect to at most two nodes and never twice to the same host: opening five
  sockets made the public nodes return HTTP 429 in a reconnect loop
- A single node dropping no longer marks the whole service unavailable
- Repeated close events log once per node instead of flooding

### HTTP server
- Never bind to SERVER_IP: on Wispbyte it is the node's external address and is
  not present inside the container (EADDRNOTAVAIL), which stopped the website
  from starting. Falls back to 0.0.0.0 automatically

### Music
- Fixed playback stopping after the first track: no listener was ever bound to
  the player's 'end' event, so the queue never advanced. Track end, exception,
  stuck and closed are now handled, and 'replaced' is ignored so a manual skip
  does not double-advance
- Listeners bind once per player, so rejoining cannot stack duplicates

### Tickets
- "Something went wrong" replaced with a real diagnosis: the bot now checks for
  Manage Channels up front, and falls back to creating the ticket outside the
  configured category when that category is missing, deleted or full
- Added codex entries MOD-010 and MOD-011, both previously thrown without one

### Setup
- New `/setup panels [channel]` publishes the info panels without re-running
  the full auto-setup, and reports exactly why if it cannot

### Module gating (regression from the previous release)
- `mlbb-api` listed MLBB_API_BASE in requiredEnv, but that variable configures
  the optional community wrapper which is now off by default. Emptying it
  disabled the module, and the dependency cascade took mlbb-heroes, the tier
  list and the info panels with it — every hero command replied
  "Module is disabled"
- The module no longer gates on it: Moonton direct is primary and always
  configured, with a bundled offline dataset behind it. The service degrades
  itself only when every source genuinely fails
- Added a test rejecting any non-optional module gated on an unset variable

### Data sources
- Added a direct client for Moonton's own content API (api.gms.moontontech.com),
  discovered by reading the official website's JS bundle. No key, no rate limit,
  and it is the same upstream the community wrapper forwards to
- It is now the primary source, giving a four-tier fallback chain:
  Moonton -> community wrapper -> MongoDB -> offline JSON
- Picks up heroes the offline snapshot never had (Marcel 132, Hirara 133)
- Evaluated mlbb.io, mlbb.gg and the Fandom wiki: the first two expose no public
  API, and Fandom returns wiki templates rather than structured data

### AI grounding
- The coach now receives real skill names with their tags, plus Moonton's own
  explanation of why a hero loses a matchup, instead of bare win rates
- Added an explicit rule forbidding invented skill names

### Diagnostics
- `npm run doctor` probes the Moonton API instead of a retired `/hero-list/`
  path that could never succeed
- `/doctor health` names the source actually serving data

### Error messages
- Fixed unsubstituted `{command}` / `{given}` / `{options}` placeholders: the
  interpolator only handles `{{var}}` and the new strings used single braces.
  Audited every locale string; a test now enforces the convention
- Validation errors render in the embed description instead of the title, which
  does not wrap and stripped the guidance onto one unreadable line
- `!hero meta` now points at the standalone `!meta` command (alias-aware)
- `/item info` states plainly when it is serving offline data without images

### Diagnostics
- `npm run doctor` — 16-point preflight without logging in
- `/doctor command` gate tracing, `/doctor guild` audit, incident deduplication

### Deployment footprint
- Removed 10 unused dependencies found by a source-wide import audit
  (fastify, i18next×2, node-cron, ioredis, @discordjs/rest, discord-api-types,
  pino-pretty, @discordjs/voice, libsodium-wrappers) — each replaced by a
  hand-rolled equivalent or provided transitively.
- `@napi-rs/canvas` (61MB) dropped from optionalDependencies until used.
- **Production `node_modules`: 168MB → 47MB.** Total disk ~49MB of Wispbyte's 1GB.
- Measured runtime: 38MB heap / 114MB RSS against the 715MB limit.

### Infrastructure
- EN/AR localisation, 153 keys, parity enforced by test
- Docker, Railway, PM2 and Wispbyte deployment paths
- `/health`, `/metrics`, `/stats` endpoints
- 249 tests, including real-MongoDB integration tests
