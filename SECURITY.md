# Security Policy

## Reporting a vulnerability

Do **not** open a public issue. Email the maintainers or use a private
GitHub security advisory.

## Built-in protections

| Threat | Mitigation |
|---|---|
| Token leakage | Three-layer redaction: known env values, sensitive object keys, and credential-shaped patterns. Applied to every log line, error report and `/doctor report`. |
| Prompt injection | `AIGuardService` blocks override attempts in English **and** Arabic. |
| Persistent injection | Retrieved memory is fenced in `<user_memory_data>` and explicitly marked as data, never instructions. |
| PII storage | Emails, phones, IPs, cards and credentials are scrubbed before anything is written to memory. |
| Cooldown bypass | Buckets key on `command:user`, never the invocation mode — switching between slash and prefix cannot dodge a cooldown. |
| Mass mentions | Prefix replies strip `@everyone`/`@here` and set `allowedMentions: { parse: [] }`. |
| NoSQL injection | Mongoose `sanitizeFilter` is enabled globally. |
| Invalid writes | `runValidators: true` is forced on all repository updates. |
| Resource exhaustion | Token-bucket rate limiting, bounded caches, capped queues, per-user memory limits. |
| Cross-tenant leakage | Memory reads are always scoped by `userId` + `guildId`. |

## Operator responsibilities

- Never commit `.env`. Rotate the token immediately if it leaks.
- Restrict MongoDB Atlas network access as tightly as your host allows.
- Keep `OWNER_IDS` minimal — owners bypass cooldowns and can disable modules.
- Set `API_SECRET` if the API server is publicly reachable.
