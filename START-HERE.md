# START HERE

You are taking over an existing, **live, working** Discord bot. Read these
three files in order before writing any code:

| # | File | Why |
|---|---|---|
| 1 | **`AGENT-HANDOFF.md`** | Rules, architecture, verified API details, what breaks production |
| 2 | **`FILE-MAP.md`** | Every source file and what it does (auto-generated) |
| 3 | **`VARIABLES.md`** | Owner-facing setup guide, in Arabic |

---

## 60-second orientation

```
CC Immune — Mobile Legends Discord bot
Node 22 · plain ES modules · no build step · no framework

37 commands · 25 services · 17 models · 604 tests · ESLint clean
Live at https://ccimmune.wisp.uno on Wispbyte free tier (384 MB heap)
```

```bash
npm install --include=dev   # plain `npm install` skips devDeps by design
npx vitest run              # 604 tests — must stay green
npx eslint .                # must stay clean

npm run map                 # regenerate FILE-MAP.md after adding files
npm run package             # deployment zip → the host (runtime only)
npm run package:source      # handover zip → a developer or agent (incl. tests)
```

Both packaging scripts self-verify and **fail** if a secret leaked in or a
required file is missing. Never build an archive by hand with `zip`.

---

## The five rules that matter most

1. **Never ship a `.env`.** Use `npm run package`; it refuses if one is present.
   A leaked `.env` once overwrote the owner's real credentials in production.
2. **Never let devDependencies install on the host.** `.npmrc` pins `omit=dev`.
   Without it `node_modules` hits 124 MB and the container dies with `ENOSPC`.
3. **Wrap Mongo operators in `mongoose.trusted()`.** Bare `$lte`/`$in`/`$ne`
   are silently stripped — queries return nothing with no error.
4. **Commands touch only `ctx`**, never `interaction` or `message`. That is
   what makes every command work as both slash and prefix.
5. **Run the code before you claim it works.** Paste real output.

---

## Adding a command

Create `src/commands/<category>/<name>.js`:

```js
import { SlashCommandBuilder } from 'discord.js';
import { CATEGORIES } from '../../config/constants.js';
import { COLORS, EMOJIS } from '../../config/theme.js';

export default {
  data: new SlashCommandBuilder()
    .setName('example')
    .setDescription('What it does'),

  meta: {
    category: CATEGORIES.UTILITY,
    module: 'slash-commands',
    cooldown: 3000,
    guildOnly: true,
    arabicAliases: ['مثال'],
  },

  /** @param {import('../../core/CommandContext.js').CommandContext} ctx */
  async execute(ctx) {
    // Business logic belongs in a service, not here.
    const data = await ctx.client.services.someService.doWork();

    return ctx.reply({
      embeds: [{
        color: COLORS.PRIMARY,
        title: `${EMOJIS.SHIELD} Example`,
        description: String(data),
      }],
    });
  },
};
```

The Registry auto-discovers it. Nothing else to register.

---

## Where things live

```
src/config/      colours, emojis, env, module manifest — no magic values elsewhere
src/core/        dual-mode context, registry, middleware, classified errors
src/commands/    thin — they call services
src/services/    ALL business logic
src/models/      Mongoose schemas
src/api/         HTTP server, landing page, web dashboard
src/ui/          embed builders
data/            offline hero/item JSON, Arabic terminology
```

---

## Current gaps (good first tasks)

| Task | Notes |
|---|---|
| Dashboard: music / tickets / giveaways / economy tabs | Config tabs already exist as a pattern to copy |
| Confirm the SVG welcome card renders inline in Discord | If not, convert to PNG with a library far lighter than canvas (61 MB is too big) |
| Give the AI web search | Needs a search tool plus result filtering |
| Arabic hero descriptions | Moonton serves English only — this was tested exhaustively; would need translation, and hero/skill/item **names must never be translated** |

---

## Talking to the owner

He writes **Egyptian Arabic** and is **not a programmer**. Reply in Egyptian
Arabic with English technical terms. Give numbered steps and name the exact
button to click. Say plainly when something is optional.

Admit mistakes directly — he has said he values that over excuses.
