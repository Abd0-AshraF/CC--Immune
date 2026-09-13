# 🩺 Troubleshooting

> Auto-generated from `src/core/errors/codex.js` — do not edit by hand.
> Regenerate with `node scripts/generate-docs.js`.

Every error CC Immune produces has a code and a reference id, e.g.
`DB-002 • IMN-7F3K2Q`. Look the code up here, or run `/doctor error IMN-7F3K2Q`
inside Discord for the full context.

---

## Top problems

| Symptom | Likely code |
|---|---|
| Bot will not start, complains about variables | `CFG-001` |
| "Invalid token" on boot | `CFG-002` |
| Boot hangs then fails on the database | `DB-002` |
| Slash commands do not appear | run `npm run deploy` |
| "The application did not respond" | `DSC-001` |
| Prefix commands do nothing | Message Content intent — see `CFG-001` |
| Bot cannot post in a channel | `PRM-002` |
| Music commands say unavailable | `AUD-001` |
| Quran radio silent | `AUD-004` |
| AI coach unavailable | `AI-001` |
| Bot killed by the host | `INT-002` |

---

## All error codes

### AI (`AI-*`)

#### `AI-000` — AI error

**Severity:** medium · **Retryable:** yes

**Cause:** An AI operation failed.

**Check:**

- Run /doctor test ai

**Fix:**

1. The bot fails over to the secondary provider automatically

---

#### `AI-001` — No AI provider configured

**Severity:** medium · **Retryable:** no

**Cause:** AI features are enabled but the selected provider has no API key.

**Check:**

- Is a key set for the provider named in AI_PROVIDER?

**Fix:**

1. Get a free key from https://openrouter.ai/keys (free models end with ":free")
2. Set OPENROUTER_API_KEY (or the matching provider key) and restart
3. Or set MODULE_AI_COACH=false to disable AI features cleanly

---

#### `AI-002` — AI provider request failed

**Severity:** medium · **Retryable:** yes

**Cause:** The provider returned an error or timed out.

**Check:**

- Is the provider having an outage?
- Is the API key still valid?

**Fix:**

1. On OpenRouter the bot first walks OPENROUTER_FALLBACK_MODELS (429/404 only)
2. Then it fails over to AI_FALLBACK_PROVIDER
3. Run /doctor test ai to probe every configured provider

---

#### `AI-003` — Daily AI quota exceeded

**Severity:** low · **Retryable:** no

**Cause:** This user reached the AI_DAILY_TOKEN_QUOTA limit.

**Check:**

- Check usage with /memory stats

**Fix:**

1. Wait for the daily reset
2. Or raise AI_DAILY_TOKEN_QUOTA

---

#### `AI-004` — Prompt injection attempt blocked

**Severity:** low · **Retryable:** no

**Cause:** AIGuardService detected instructions trying to override the system prompt.

**Check:**

- Was the input pasted from an untrusted source?

**Fix:**

1. Rephrase the request without instruction-like text

---

#### `AI-005` — AI returned malformed structured output

**Severity:** low · **Retryable:** yes

**Cause:** The model was asked for JSON but produced something unparseable.

**Fix:**

1. The bot retries once, then falls back to a rule-based response

---

### External Services (`API-*`)

#### `API-000` — External service error

**Severity:** medium · **Retryable:** yes

**Cause:** A third-party service failed to respond correctly.

**Check:**

- Run /doctor test <service>

**Fix:**

1. The bot falls back to cached data where possible
2. Retry once the service recovers

---

#### `API-001` — MLBB API unreachable

**Severity:** medium · **Retryable:** yes

**Cause:** The community MLBB data API did not respond. It is a third-party service.

**Check:**

- Is https://mlbb-stats.ridwaanhall.com reachable from your host?
- Is the host blocking outbound HTTPS?

**Fix:**

1. The bot automatically serves cached data from MongoDB, then the offline JSON in /data
2. Run /doctor test mlbb-api to re-probe
3. No action needed if hero commands still respond with a "cached data" note

---

#### `API-002` — External API returned an unexpected shape

**Severity:** medium · **Retryable:** no

**Cause:** The upstream response failed schema validation — the provider likely changed its format.

**Check:**

- Has the upstream API published a breaking change?

**Fix:**

1. The bot falls back to cached data
2. Open an issue so the schema can be updated

---

#### `API-003` — Circuit breaker is open

**Severity:** low · **Retryable:** yes

**Cause:** Too many consecutive failures, so requests are paused to let the service recover.

**Check:**

- Run /doctor to see the breaker state and reset countdown

**Fix:**

1. Wait for the automatic half-open retry
2. Or force a probe with /doctor test <service>

---

### Audio (`AUD-*`)

#### `AUD-000` — Audio error

**Severity:** medium · **Retryable:** yes

**Cause:** An audio playback operation failed.

**Check:**

- Run /doctor test lavalink

**Fix:**

1. See AUD-001 for node connectivity issues

---

#### `AUD-001` — Lavalink node unreachable

**Severity:** medium · **Retryable:** yes

**Cause:** The bot could not connect to the Lavalink audio server. Music and Quran radio need it.

**Check:**

- Is LAVALINK_HOST set? (Leave empty to disable music cleanly.)
- Is the Lavalink server running and reachable from this host?
- Do LAVALINK_PASSWORD and LAVALINK_SECURE match the server config?
- On Wispbyte: Lavalink CANNOT run on the same free instance — it must be external.

**Fix:**

1. Start a Lavalink v4 server (docker/docker-compose.yml includes one) or use a public node
2. Set LAVALINK_HOST / LAVALINK_PORT / LAVALINK_PASSWORD / LAVALINK_SECURE
3. Restart the bot, then run /doctor test lavalink
4. Music auto-restores when the node comes back — no restart needed

---

#### `AUD-002` — Could not join the voice channel

**Severity:** low · **Retryable:** yes

**Cause:** The bot lacks Connect/Speak, the channel is full, or it is region-locked.

**Check:**

- Does the bot have Connect and Speak on that channel?
- Is the user limit reached?

**Fix:**

1. Grant Connect and Speak
2. Raise the user limit or use another channel

---

#### `AUD-003` — No results for that query

**Severity:** low · **Retryable:** no

**Cause:** The search returned nothing, or the link is private, region-blocked or deleted.

**Check:**

- Does the link open in a normal browser?

**Fix:**

1. Try a different search term or a direct link

---

#### `AUD-004` — All Quran stream mirrors are down

**Severity:** medium · **Retryable:** yes

**Cause:** None of the configured QURAN_STREAMS responded.

**Check:**

- Is the host blocking plain HTTP (some mirrors are http:// only)?

**Fix:**

1. Run /quran status to see each mirror probe result
2. Add more mirrors to QURAN_STREAMS (comma-separated)

---

### Configuration (`CFG-*`)

#### `CFG-000` — Configuration error

**Severity:** fatal · **Retryable:** no

**Cause:** Something in the bot configuration is invalid.

**Check:**

- Run `npm run doctor` for a full configuration report

**Fix:**

1. Compare your .env against .env.example
2. Restart after correcting

---

#### `CFG-001` — Invalid or missing environment variables

**Severity:** fatal · **Retryable:** no

**Cause:** One or more required variables are missing or malformed, so the bot cannot safely start.

**Check:**

- Does a .env file exist next to package.json? (On Wispbyte, use the panel Startup tab.)
- Are DISCORD_TOKEN, CLIENT_ID and MONGO_URI all set?
- Did you accidentally wrap values in quotes or leave a trailing space?

**Fix:**

1. Copy .env.example to .env
2. Fill in DISCORD_TOKEN, CLIENT_ID and MONGO_URI
3. Re-run `npm run doctor` to confirm the configuration is valid

---

#### `CFG-002` — Invalid bot token

**Severity:** fatal · **Retryable:** no

**Cause:** Discord rejected the token. It is malformed, was reset, or belongs to a deleted app.

**Check:**

- Was the token regenerated in the Developer Portal recently?
- Did you copy the BOT token (not the Client Secret or Public Key)?
- Is the whole token present? It has three parts separated by dots.

**Fix:**

1. Open https://discord.com/developers/applications -> your app -> Bot
2. Click "Reset Token" and copy the new value
3. Update DISCORD_TOKEN and restart the bot

---

#### `CFG-003` — Module manifest is invalid

**Severity:** fatal · **Retryable:** no

**Cause:** src/config/modules.js contains a duplicate key, an unknown dependency or a dependency cycle.

**Check:**

- Did you add a module recently?
- Does every dependsOn entry name a real module key?

**Fix:**

1. Run `npm run doctor` to see the exact manifest errors
2. Fix the reported keys in src/config/modules.js

---

### Database (`DB-*`)

#### `DB-000` — Database error

**Severity:** high · **Retryable:** yes

**Cause:** A database operation failed.

**Check:**

- Run /doctor test db

**Fix:**

1. Check MongoDB availability and the Atlas IP whitelist
2. See DB-002 for connection issues

---

#### `DB-001` — MongoDB URI is malformed

**Severity:** fatal · **Retryable:** no

**Cause:** The connection string does not parse as a valid MongoDB URI.

**Check:**

- Does MONGO_URI start with mongodb:// or mongodb+srv://?
- Are special characters in the password percent-encoded? (@ -> %40, # -> %23)

**Fix:**

1. Re-copy the string from Atlas -> Connect -> Drivers
2. URL-encode the password if it contains symbols
3. Replace <password> with the real password

---

#### `DB-002` — MongoDB connection refused

**Severity:** fatal · **Retryable:** yes

**Cause:** The bot could not reach the MongoDB server at the configured URI.

**Check:**

- Is MONGO_URI set and well-formed?
- Is your IP whitelisted in Atlas -> Network Access? (Use 0.0.0.0/0 for Wispbyte/Railway.)
- Is the cluster paused or still provisioning?
- Are the username and password correct and URL-encoded?

**Fix:**

1. Open MongoDB Atlas -> Network Access -> Add IP Address -> Allow access from anywhere (0.0.0.0/0)
2. Verify the database user exists under Database Access
3. Re-copy the connection string and update MONGO_URI
4. Restart the bot

---

#### `DB-003` — MongoDB operation timed out

**Severity:** high · **Retryable:** yes

**Cause:** A query exceeded its timeout. Usually a slow network, a missing index, or a paused cluster.

**Check:**

- Is the cluster in a distant region from your host?
- Did a collection grow large without an index?

**Fix:**

1. Run `/doctor test db` to measure latency
2. Move the cluster closer to your host region if latency is above ~300ms
3. Restart the bot to rebuild the connection pool

---

#### `DB-004` — Duplicate key error

**Severity:** medium · **Retryable:** no

**Cause:** A unique index rejected the write because the document already exists.

**Check:**

- Is a document being created twice by a race condition?

**Fix:**

1. Use the repository upsert helpers instead of create()
2. Report this with /doctor report

---

#### `DB-005` — Schema validation failed

**Severity:** medium · **Retryable:** no

**Cause:** A document did not satisfy its Mongoose schema.

**Check:**

- Was a field sent with the wrong type?
- Is a required field missing?

**Fix:**

1. Check the failing field in the error context
2. Report with /doctor report

---

### Discord API (`DSC-*`)

#### `DSC-000` — Discord API error

**Severity:** medium · **Retryable:** yes

**Cause:** Discord rejected a request or returned an unexpected response.

**Check:**

- Is Discord having an outage? https://discordstatus.com

**Fix:**

1. Retry shortly
2. Run /doctor perms if the action involved permissions

---

#### `DSC-001` — Unknown interaction (expired)

**Severity:** low · **Retryable:** no

**Cause:** Discord invalidates an interaction token after 3 seconds. The handler replied too late.

**Check:**

- Is the command doing slow work before deferring?
- Is the event loop blocked or the database slow?

**Fix:**

1. Call ctx.defer() at the start of any command that may take over 2 seconds
2. Run /doctor to check event loop lag and database latency

---

#### `DSC-002` — Interaction already acknowledged

**Severity:** low · **Retryable:** no

**Cause:** The code replied twice to the same interaction.

**Check:**

- Is both defer() and reply() being called?

**Fix:**

1. Use ctx.reply() once; it routes to editReply automatically after a defer

---

#### `DSC-003` — Bot is missing permissions

**Severity:** medium · **Retryable:** no

**Cause:** The bot lacks a permission required for this action in this channel.

**Check:**

- Does the bot role have the permission at server level?
- Is there a channel override denying it?
- Is the bot role above the roles it is trying to manage?

**Fix:**

1. Run /doctor perms to see exactly which permission is missing and where
2. Move the bot role higher in Server Settings -> Roles
3. Re-invite with the correct permission integer from /doctor perms

---

#### `DSC-004` — Missing access to the channel

**Severity:** medium · **Retryable:** no

**Cause:** The bot cannot see or access the target channel.

**Check:**

- Does the bot have View Channel on that channel?

**Fix:**

1. Grant View Channel to the bot role
2. Run /doctor guild to find broken channel references

---

#### `DSC-005` — Cannot send direct message

**Severity:** low · **Retryable:** no

**Cause:** The user's privacy settings block DMs from server members.

**Check:**

- Has the user disabled DMs?

**Fix:**

1. This is expected; the bot falls back to an in-channel reply

---

#### `DSC-006` — Invalid form body

**Severity:** high · **Retryable:** no

**Cause:** A payload broke a Discord limit — usually an embed field longer than 1024 characters or an empty select menu.

**Check:**

- Is user-supplied text being inserted without truncation?

**Fix:**

1. Use the EmbedFactory helpers, which truncate to the limits in constants.js
2. Report with /doctor report so the offending builder can be fixed

---

#### `DSC-020` — Gateway disconnected repeatedly

**Severity:** high · **Retryable:** yes

**Cause:** The WebSocket connection keeps dropping — network instability or an invalid session.

**Check:**

- Is the host network stable?
- Are you running the same token twice?

**Fix:**

1. Ensure only ONE instance of the bot is running with this token
2. Check the host status page
3. The bot auto-reconnects; if 3 attempts fail it exits so the host restarts it

---

### Internal (`INT-*`)

#### `INT-000` — Internal error

**Severity:** high · **Retryable:** no

**Cause:** An unexpected condition occurred.

**Fix:**

1. Quote the reference ID
2. Run /doctor report

---

#### `INT-001` — Unexpected internal error

**Severity:** high · **Retryable:** no

**Cause:** An unhandled condition occurred inside the bot.

**Fix:**

1. Quote the reference ID to support
2. Run /doctor error <reference> for details
3. Attach /doctor report when opening an issue

---

#### `INT-002` — Out of memory risk

**Severity:** high · **Retryable:** no

**Cause:** Heap usage crossed the safety threshold; caches were flushed to avoid an OOM kill.

**Check:**

- Is NODE_OPTIONS=--max-old-space-size set below the host limit? (384 on Wispbyte 715MB)
- Are you running many guilds on a small instance?

**Fix:**

1. Set NODE_OPTIONS=--max-old-space-size=384
2. Disable heavy modules: MODULE_MUSIC=false, MODULE_AI_MEMORY=false
3. Upgrade the host if the warning repeats

---

### Modules (`MOD-*`)

#### `MOD-001` — Module is disabled

**Severity:** low · **Retryable:** no

**Cause:** This feature was switched off, or a dependency it needs is unavailable.

**Check:**

- Run /module info <key> to see the exact state and reason

**Fix:**

1. If disabled per-guild: /config module <key> on
2. If disabled globally: ask the bot owner
3. If blocked by a dependency: fix the dependency; the module restores automatically

---

#### `MOD-002` — Cannot disable a critical module

**Severity:** low · **Retryable:** no

**Cause:** Critical modules (diagnostics, database, slash-commands) must stay enabled.

**Fix:**

1. Disable a specific command instead: /module command <name> off

---

#### `MOD-010` — You already have an open ticket

**Severity:** low · **Retryable:** no

**Cause:** One ticket per member keeps the support category manageable.

**Check:**

- Is your existing ticket still open?

**Fix:**

1. Continue in the ticket channel you already have
2. Close it first, then open a new one

---

#### `MOD-011` — Cannot create the ticket channel

**Severity:** medium · **Retryable:** no

**Cause:** The bot lacks Manage Channels, or the configured ticket category is missing, deleted, or full (Discord allows 50 channels per category).

**Check:**

- Does the bot role have Manage Channels?
- Does the category set by /setup still exist?
- Is the category already at 50 channels?

**Fix:**

1. Give the bot role the Manage Channels permission
2. Re-run /setup auto to recreate the ticket category
3. Or clear it: /setup channel feature:ticketCategory channel:#new-category

---

### Permissions (`PRM-*`)

#### `PRM-000` — Permission error

**Severity:** low · **Retryable:** no

**Cause:** A permission check failed.

**Check:**

- Run /doctor perms

**Fix:**

1. Grant the missing permission and retry

---

#### `PRM-001` — You do not have permission

**Severity:** low · **Retryable:** no

**Cause:** The invoking user lacks the permission or role this command requires.

**Check:**

- Does the user have the required Discord permission?

**Fix:**

1. Ask a server administrator for the required permission or role

---

#### `PRM-002` — The bot does not have permission

**Severity:** medium · **Retryable:** no

**Cause:** CC Immune is missing a permission needed to complete this action.

**Check:**

- Run /doctor perms

**Fix:**

1. Grant the listed permissions to the bot role
2. Check channel-level overrides

---

#### `PRM-003` — Role hierarchy prevents this action

**Severity:** medium · **Retryable:** no

**Cause:** The target's highest role is above (or equal to) the bot's highest role.

**Check:**

- Is the bot's role above the role it must assign or the member it must moderate?

**Fix:**

1. Server Settings -> Roles -> drag the CC Immune role above the target roles

---

#### `PRM-004` — Owner-only command

**Severity:** low · **Retryable:** no

**Cause:** This command is restricted to the bot owners listed in OWNER_IDS.

**Check:**

- Is your user ID present in OWNER_IDS?

**Fix:**

1. Add your Discord user ID to OWNER_IDS and restart

---

### Rate Limiting (`RL-*`)

#### `RL-001` — Command on cooldown

**Severity:** low · **Retryable:** yes

**Cause:** You used this command too soon after the last time.

**Fix:**

1. Wait for the cooldown shown in the message

---

#### `RL-002` — Rate limit exceeded

**Severity:** low · **Retryable:** yes

**Cause:** Too many commands in a short window (anti-abuse token bucket).

**Fix:**

1. Slow down and retry shortly

---

### Validation (`VAL-*`)

#### `VAL-000` — Validation error

**Severity:** low · **Retryable:** no

**Cause:** The supplied input was not valid.

**Check:**

- Check the usage shown in the error embed

**Fix:**

1. Correct the input and retry

---

#### `VAL-001` — Invalid argument

**Severity:** low · **Retryable:** no

**Cause:** An argument did not match the expected type or range.

**Check:**

- Check the usage shown in the error embed

**Fix:**

1. Re-run the command with the corrected argument

---

#### `VAL-002` — Required argument missing

**Severity:** low · **Retryable:** no

**Cause:** A required option was not supplied.

**Check:**

- In prefix mode the bot will prompt for it interactively

**Fix:**

1. Provide the missing argument, or answer the follow-up prompt

---

#### `VAL-003` — Unknown subcommand

**Severity:** low · **Retryable:** no

**Cause:** The subcommand typed does not exist on that command.

**Check:**

- Was the command renamed or removed in a newer version?
- Discord may still be showing a cached slash command

**Fix:**

1. Run /help to see the current subcommands
2. The error message lists every valid subcommand for that command

---

## Still stuck?

1. Run `npm run doctor` and copy the output.
2. Run `/doctor health` in Discord.
3. Open an issue with both, plus the error reference id.

*Generated 2026-07-27 from 51 codex entries.*
