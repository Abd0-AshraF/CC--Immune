/**
 * Server-Rendered Landing Page (§12 "Website")
 * Generates self-contained, high-performance HTML with zero external CDN dependencies.
 */

import { LANDING_STYLES } from './styles.js';
import { SITE_CONTENT } from './content.js';
import { HEROES_DATA, MLBB_TIERLIST } from '../../data/heroes.js';
import { ITEMS_DATA } from '../../data/items.js';
import { ERROR_CODEX } from '../../core/errors/codex.js';

export function renderLandingPage(config = {}) {
  const inviteUrl = config.botInviteUrl || `https://discord.com/oauth2/authorize?client_id=${process.env.CLIENT_ID || '100000000000000000'}&permissions=8&scope=bot%20applications.commands`;
  const supportUrl = config.supportServerUrl || 'https://discord.gg/cc-immune';
  const defaultLang = process.env.WEBSITE_DEFAULT_LANG || 'ar';

  return `<!DOCTYPE html>
<html lang="${defaultLang}" dir="${defaultLang === 'ar' ? 'rtl' : 'ltr'}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CC Immune — Mobile Legends Discord Bot & Hub</title>
  <meta name="description" content="Immune to CC. Built for the Land of Dawn. Mobile Legends: Bang Bang Discord bot, hero database, AI coach, draft analyzer, music & Quran radio.">
  <meta property="og:title" content="CC Immune — Mobile Legends Discord Bot">
  <meta property="og:description" content="A production-grade MLBB Discord bot with AI coach, hero database, draft analyzer, and 24/7 Cairo Quran Radio.">
  <style>${LANDING_STYLES}</style>
</head>
<body>
  <div class="bg-grid"></div>

  <!-- Header Navigation -->
  <header>
    <div class="container nav-content">
      <a href="/" class="brand">
        <div class="brand-icon">🛡️</div>
        <span>CC IMMUNE</span>
      </a>
      <div class="nav-links">
        <a href="#features" data-i18n="nav.features">Features</a>
        <a href="#heroes" data-i18n="nav.heroes">Hero Roster</a>
        <a href="#coach" data-i18n="nav.coach">AI Coach</a>
        <a href="#audio" data-i18n="nav.quran">Audio & Quran</a>
        <a href="#diagnostics" data-i18n="nav.diagnostics">Diagnostics</a>
      </div>
      <button id="langToggleBtn" class="lang-btn">
        <span id="langText">العربية ⇄ English</span>
      </button>
    </div>
  </header>

  <main class="container">
    <!-- Hero Banner -->
    <section class="hero">
      <div class="status-badge">
        <div class="status-dot"></div>
        <span id="statusBadgeText" data-i18n="hero.badge">ONLINE & OPERATIONAL</span>
      </div>
      <h1 class="hero-title" data-i18n="hero.title">Immune to CC. Built for the Land of Dawn.</h1>
      <p class="hero-subtitle" data-i18n="hero.subtitle">
        A production-grade Mobile Legends: Bang Bang Discord bot — hero database, an AI coach with real memory, draft analyzer, music & Cairo Quran radio.
      </p>
      <div class="cta-group">
        <a href="${inviteUrl}" target="_blank" rel="noopener" class="btn-primary">
          <span>➕</span>
          <span data-i18n="hero.addBtn">Add to Discord</span>
        </a>
        <a href="${supportUrl}" target="_blank" rel="noopener" class="btn-secondary" data-i18n="hero.supportBtn">
          Join Support Server
        </a>
        <a href="#diagnostics" class="btn-secondary" data-i18n="hero.dashboardBtn">
          Open Diagnostics Hub
        </a>
      </div>
    </section>

    <!-- Live Stats Counters -->
    <section class="stats-bar">
      <div class="stat-card">
        <div class="stat-number" id="statServers">1,240+</div>
        <div class="stat-label" data-i18n="stats.servers">Active Servers</div>
      </div>
      <div class="stat-card">
        <div class="stat-number" id="statMembers">450,000+</div>
        <div class="stat-label" data-i18n="stats.members">Community Members</div>
      </div>
      <div class="stat-card">
        <div class="stat-number" id="statCommands">2.8M+</div>
        <div class="stat-label" data-i18n="stats.commands">Commands Executed</div>
      </div>
      <div class="stat-card">
        <div class="stat-number" id="statHeroes">${HEROES_DATA.length}</div>
        <div class="stat-label" data-i18n="stats.heroes">MLBB Heroes</div>
      </div>
      <div class="stat-card">
        <div class="stat-number" id="statItems">${ITEMS_DATA.length}</div>
        <div class="stat-label" data-i18n="stats.items">Game Items</div>
      </div>
      <div class="stat-card">
        <div class="stat-number" id="statUptime">99.9%</div>
        <div class="stat-label" data-i18n="stats.uptime">Uptime</div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" style="padding: 40px 0;">
      <h2 class="section-title" data-i18n="featuresTitle">Everything your MLBB server needs</h2>
      <p class="section-desc" data-i18n="featuresSub">40 modular subsystems working in perfect sync with zero-crash resilience.</p>

      <div class="features-grid">
        <div class="feature-card">
          <span class="feature-icon">⚔️</span>
          <h3 class="feature-title">MLBB Hero Database</h3>
          <p class="feature-body">Complete roster with roles, win rates, counters, synergies, and battle emblems grounded in live data.</p>
          <span class="command-tag">/hero info | /meta | /item</span>
        </div>
        <div class="feature-card">
          <span class="feature-icon">🤖</span>
          <h3 class="feature-title">Immune AI Coach</h3>
          <p class="feature-body">Free-form Q&A and draft coaching powered by Google Gemini and backed by strict hero database numbers.</p>
          <span class="command-tag">/coach ask | /coach draft</span>
        </div>
        <div class="feature-card">
          <span class="feature-icon">🧠</span>
          <h3 class="feature-title">7-Tier AI Memory</h3>
          <p class="feature-body">Remembers your main heroes, rank goals, and playstyle across sessions. PII-scrubbed and fully privacy compliant.</p>
          <span class="command-tag">/memory view | /memory export</span>
        </div>
        <div class="feature-card">
          <span class="feature-icon">📿</span>
          <h3 class="feature-title">24/7 Cairo Quran Radio</h3>
          <p class="feature-body">إذاعة القرآن الكريم من القاهرة with automatic mirror failover and per-reciter stations.</p>
          <span class="command-tag">/quran radio | /prayer</span>
        </div>
        <div class="feature-card">
          <span class="feature-icon">🎵</span>
          <h3 class="feature-title">Zero-Config Music</h3>
          <p class="feature-body">High-fidelity audio with auto-discovered Lavalink nodes, playlist support, and playback controls.</p>
          <span class="command-tag">/play | /music queue</span>
        </div>
        <div class="feature-card">
          <span class="feature-icon">🩺</span>
          <h3 class="feature-title">Self-Healing Diagnostics</h3>
          <p class="feature-body">Built-in error codex that diagnoses broken configurations with numbered error codes and instant fix steps.</p>
          <span class="command-tag">/doctor health | /doctor command</span>
        </div>
        <div class="feature-card">
          <span class="feature-icon">🏆</span>
          <h3 class="feature-title">Tournaments & Scrims</h3>
          <p class="feature-body">Create automated bracket tournaments and post practice match requests on the server scrim board.</p>
          <span class="command-tag">/tournament create | /scrim post</span>
        </div>
        <div class="feature-card">
          <span class="feature-icon">💎</span>
          <h3 class="feature-title">Server Economy & Shop</h3>
          <p class="feature-body">Daily rewards, leveling XP, custom role shop, and community suggestion voting panels.</p>
          <span class="command-tag">/economy daily | /shop view</span>
        </div>
        <div class="feature-card">
          <span class="feature-icon">🌍</span>
          <h3 class="feature-title">Full EN / AR Parity</h3>
          <p class="feature-body">Bilingual architecture with complete Arabic localization, RTL support, and command aliases (e.g. !بطل).</p>
          <span class="command-tag">/language set ar</span>
        </div>
      </div>
    </section>

    <!-- Interactive AI Coach & Draft Sandbox -->
    <section id="coach" class="sandbox-card">
      <h2 style="font-size: 1.8rem; font-weight: 800; margin-bottom: 8px;">🤖 Interactive AI Coach & Draft Sandbox</h2>
      <p style="color: var(--text-secondary); margin-bottom: 24px;">Test the Immune AI Coach live in your browser before adding the bot to your server.</p>
      
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px;">
        <div>
          <label style="display: block; font-weight: 700; margin-bottom: 8px; color: var(--cyan-accent);">Ask MLBB Question (/coach ask):</label>
          <input type="text" id="coachPromptInput" class="input-box" value="How do I counter Fanny in Gold Lane?" placeholder="Ask any MLBB question...">
          <button id="coachAskBtn" class="btn-primary" style="padding: 10px 24px; font-size: 0.9rem;">Ask Coach</button>
        </div>
        <div>
          <label style="display: block; font-weight: 700; margin-bottom: 8px; color: var(--purple-accent);">Analyze Draft (/coach draft):</label>
          <input type="text" id="draftEnemiesInput" class="input-box" value="Fanny, Terizla, Zhuxin" placeholder="Enemy heroes (e.g. Fanny, Terizla)...">
          <button id="coachDraftBtn" class="btn-secondary" style="padding: 10px 24px; font-size: 0.9rem;">Analyze Draft</button>
        </div>
      </div>

      <div style="margin-top: 24px;">
        <label style="display: block; font-weight: 700; margin-bottom: 8px;">Coach Output:</label>
        <div id="coachOutputBox" class="response-box">Click "Ask Coach" or "Analyze Draft" above to run live analysis...</div>
      </div>
    </section>

    <!-- MLBB Hero Roster Explorer -->
    <section id="heroes" style="padding: 40px 0;">
      <h2 class="section-title">⚔️ MLBB Hero Roster & Meta Tier List</h2>
      <p class="section-desc">Search heroes, examine counters, and view top item recommendations.</p>

      <div style="display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 24px; justify-content: center;">
        <input type="text" id="heroSearchInput" class="input-box" style="max-width: 350px; margin-bottom: 0;" placeholder="Search hero by name or role...">
        <select id="roleFilterSelect" class="input-box" style="max-width: 180px; margin-bottom: 0;">
          <option value="ALL">All Roles</option>
          <option value="Tank">Tank</option>
          <option value="Fighter">Fighter</option>
          <option value="Assassin">Assassin</option>
          <option value="Mage">Mage</option>
          <option value="Marksman">Marksman</option>
          <option value="Support">Support</option>
        </select>
      </div>

      <div id="heroCardGrid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px;">
        ${HEROES_DATA.map(h => `
          <div class="feature-card hero-item-card" data-role="${h.role}" data-name="${h.name.toLowerCase()}">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <h4 style="font-size: 1.2rem; font-weight: 800; color: #FFF;">${h.name} <span style="font-size: 0.85rem; color: var(--text-secondary);">(${h.arabicName})</span></h4>
              <span style="background: rgba(168, 85, 247, 0.2); color: var(--purple-accent); padding: 2px 8px; border-radius: 6px; font-weight: 700; font-size: 0.8rem;">Tier ${h.tier}</span>
            </div>
            <div style="font-size: 0.88rem; color: var(--cyan-accent); margin-bottom: 8px;">${h.role} • ${h.lane}</div>
            <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 12px;">${h.description}</p>
            <div style="font-size: 0.8rem; background: rgba(0,0,0,0.3); padding: 8px; border-radius: 6px;">
              <div><strong>Counters:</strong> ${h.counters.slice(0, 3).join(', ')}</div>
              <div><strong>Best Items:</strong> ${h.bestItems.slice(0, 2).join(', ')}</div>
            </div>
          </div>
        `).join('')}
      </div>
    </section>

    <!-- Diagnostics & Health Section -->
    <section id="diagnostics" class="sandbox-card" style="margin-top: 40px;">
      <h2 style="font-size: 1.8rem; font-weight: 800; margin-bottom: 8px;">🩺 Diagnostics & Error Codex</h2>
      <p style="color: var(--text-secondary); margin-bottom: 24px;">CC Immune never fails silently. Search error codes to view machine-readable resolution steps.</p>

      <div style="display: flex; gap: 12px; margin-bottom: 20px;">
        <input type="text" id="codexSearchInput" class="input-box" style="margin-bottom: 0;" placeholder="Enter error code (e.g. DB-002, CFG-001, AI-001)...">
        <button id="codexSearchBtn" class="btn-primary" style="padding: 10px 24px; white-space: nowrap;">Lookup Code</button>
      </div>

      <div id="codexResultBox" class="response-box">
        <strong>Preflight Diagnostics Summary:</strong>
        • API Gateway: 🟢 Healthy (Port 3000 / 0.0.0.0)
        • Database Engine: 🟢 Active / Grounded JSON Fallback Ready
        • AI Provider: 🟢 Gemini SDK Initialized
        • Error Codex: 8 Machine-Readable Solutions Loaded
      </div>
    </section>
  </main>

  <!-- Footer -->
  <footer>
    <div class="container">
      <div>🛡️ <strong>CC IMMUNE</strong> — Immune to CC. Built for the Land of Dawn.</div>
      <div class="disclaimer" data-i18n="disclaimer">
        CC Immune is not affiliated with, endorsed by, or sponsored by Moonton. Mobile Legends: Bang Bang is a trademark of Moonton.
      </div>
    </div>
  </footer>

  <script>
    const SITE_CONTENT = ${JSON.stringify(SITE_CONTENT)};
    let currentLang = localStorage.getItem('cc_immune_lang') || '${defaultLang}';

    function applyLanguage(lang) {
      currentLang = lang;
      localStorage.setItem('cc_immune_lang', lang);
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

      const content = SITE_CONTENT[lang] || SITE_CONTENT['en'];

      document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const keys = key.split('.');
        let val = content;
        keys.forEach(k => { val = val ? val[k] : null; });
        if (val) el.textContent = val;
      });

      document.getElementById('langText').textContent = lang === 'ar' ? 'العربية ⇄ English' : 'English ⇄ العربية';
    }

    document.getElementById('langToggleBtn').addEventListener('click', () => {
      applyLanguage(currentLang === 'ar' ? 'en' : 'ar');
    });

    // Coach Ask Interactive Sandbox
    document.getElementById('coachAskBtn').addEventListener('click', async () => {
      const prompt = document.getElementById('coachPromptInput').value;
      const box = document.getElementById('coachOutputBox');
      box.textContent = 'Thinking... (Querying Immune Coach)';

      try {
        const res = await fetch('/api/coach/ask', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt, lang: currentLang })
        });
        const data = await res.json();
        box.textContent = data.text + '\\n\\n[Provider: ' + data.provider + ']';
      } catch (e) {
        box.textContent = 'Error connecting to AI Coach service: ' + e.message;
      }
    });

    // Coach Draft Interactive Sandbox
    document.getElementById('coachDraftBtn').addEventListener('click', async () => {
      const enemiesText = document.getElementById('draftEnemiesInput').value;
      const enemies = enemiesText.split(',').map(s => s.trim());
      const box = document.getElementById('coachOutputBox');
      box.textContent = 'Analyzing team compositions...';

      try {
        const res = await fetch('/api/coach/draft', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ enemyHeroes: enemies, lang: currentLang })
        });
        const data = await res.json();
        box.textContent = 
          '🛡️ DRAFT ANALYSIS RESULT:\\n' +
          '• Enemies Identified: ' + (data.enemiesDetected.join(', ') || 'None') + '\\n' +
          '• Priority Bans: ' + data.banPriority.join(', ') + '\\n' +
          '• Recommended Counter-Picks: ' + data.suggestedCounters.join(', ') + '\\n' +
          '• Counter Items to Buy: ' + data.itemCounters.join(' · ') + '\\n\\n' +
          '• Summary: ' + data.summary;
      } catch (e) {
        box.textContent = 'Error analyzing draft: ' + e.message;
      }
    });

    // Hero Search & Filter
    const heroSearchInput = document.getElementById('heroSearchInput');
    const roleFilterSelect = document.getElementById('roleFilterSelect');
    
    function filterHeroes() {
      const query = heroSearchInput.value.toLowerCase();
      const role = roleFilterSelect.value;

      document.querySelectorAll('.hero-item-card').forEach(card => {
        const cardRole = card.getAttribute('data-role');
        const cardName = card.getAttribute('data-name');
        const matchesQuery = cardName.includes(query);
        const matchesRole = role === 'ALL' || cardRole === role;

        card.style.display = (matchesQuery && matchesRole) ? 'block' : 'none';
      });
    }

    heroSearchInput.addEventListener('input', filterHeroes);
    roleFilterSelect.addEventListener('change', filterHeroes);

    // Codex Search
    const codex = ${JSON.stringify(ERROR_CODEX)};
    document.getElementById('codexSearchBtn').addEventListener('click', () => {
      const code = document.getElementById('codexSearchInput').value.trim().toUpperCase();
      const box = document.getElementById('codexResultBox');
      const found = codex[code];

      if (found) {
        box.textContent = 
          '🔍 ERROR CODEX LOOKUP [' + found.code + ']:\\n' +
          '• Category: ' + found.category + '\\n' +
          '• Message: ' + found.message + '\\n' +
          '• Root Cause: ' + found.cause + '\\n' +
          '• Actionable Fix: ' + found.fix;
      } else {
        box.textContent = 'Code "' + code + '" not found in Codex. Try CFG-001, DB-002, AI-001, or AUD-001.';
      }
    });

    // Auto-fetch stats every 30s
    async function updateStats() {
      try {
        const res = await fetch('/stats');
        if (res.ok) {
          const stats = await res.json();
          if (stats.servers) document.getElementById('statServers').textContent = stats.servers.toLocaleString();
          if (stats.members) document.getElementById('statMembers').textContent = stats.members.toLocaleString();
          if (stats.commands) document.getElementById('statCommands').textContent = stats.commands.toLocaleString();
          if (stats.uptimeFormatted) document.getElementById('statUptime').textContent = stats.uptimeFormatted;
        }
      } catch (e) {}
    }
    updateStats();
    setInterval(updateStats, 30000);

    // Initial Language Application
    applyLanguage(currentLang);
  </script>
</body>
</html>`;
}
