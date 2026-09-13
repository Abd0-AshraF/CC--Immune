/**
 * Landing Page Styles — Generated from shared CC Immune theme palette.
 * Pure inline CSS, zero external dependencies.
 */

export const LANDING_STYLES = `
:root {
  --bg-dark: #07090E;
  --bg-card: #0F172A;
  --bg-card-hover: #1E293B;
  --cyan-accent: #00E5FF;
  --cyan-glow: rgba(0, 229, 255, 0.25);
  --purple-accent: #A855F7;
  --purple-glow: rgba(168, 85, 247, 0.25);
  --text-primary: #F8FAFC;
  --text-secondary: #94A3B8;
  --border-subtle: rgba(255, 255, 255, 0.08);
  --border-cyan: rgba(0, 229, 255, 0.3);
  --radius-md: 12px;
  --radius-lg: 18px;
  --font-sans: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background-color: var(--bg-dark);
  color: var(--text-primary);
  font-family: var(--font-sans);
  line-height: 1.6;
  overflow-x: hidden;
  min-height: 100vh;
}

/* Background Hex Pattern & Glow */
.bg-grid {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-image: 
    radial-gradient(circle at 15% 15%, rgba(0, 229, 255, 0.08) 0%, transparent 40%),
    radial-gradient(circle at 85% 75%, rgba(168, 85, 247, 0.08) 0%, transparent 40%),
    linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
  background-size: 100% 100%, 100% 100%, 40px 40px, 40px 40px;
  pointer-events: none;
  z-index: 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  position: relative;
  z-index: 1;
}

/* Header Navbar */
header {
  border-bottom: 1px solid var(--border-subtle);
  backdrop-filter: blur(12px);
  background: rgba(7, 9, 14, 0.85);
  position: sticky;
  top: 0;
  z-index: 100;
  padding: 16px 0;
}

.nav-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: #fff;
  font-weight: 800;
  font-size: 1.25rem;
  letter-spacing: -0.5px;
}

.brand-icon {
  width: 38px;
  height: 38px;
  background: linear-gradient(135deg, var(--cyan-accent), var(--purple-accent));
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  box-shadow: 0 0 15px var(--cyan-glow);
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 24px;
}

.nav-links a {
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 500;
  transition: color 0.2s;
}

.nav-links a:hover {
  color: var(--cyan-accent);
}

.lang-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-subtle);
  color: var(--text-primary);
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
}

.lang-btn:hover {
  border-color: var(--cyan-accent);
  color: var(--cyan-accent);
  box-shadow: 0 0 10px var(--cyan-glow);
}

/* Hero Section */
.hero {
  padding: 80px 0 60px;
  text-align: center;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 16px;
  background: rgba(0, 229, 255, 0.08);
  border: 1px solid var(--border-cyan);
  border-radius: 30px;
  color: var(--cyan-accent);
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 24px;
}

.status-dot {
  width: 8px;
  height: 8px;
  background-color: #10B981;
  border-radius: 50%;
  box-shadow: 0 0 8px #10B981;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.2); }
  100% { opacity: 1; transform: scale(1); }
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 900;
  line-height: 1.15;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #FFFFFF 30%, var(--cyan-accent) 70%, var(--purple-accent) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -1px;
}

.hero-subtitle {
  font-size: 1.2rem;
  color: var(--text-secondary);
  max-width: 680px;
  margin: 0 auto 36px;
}

.cta-group {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
}

.btn-primary {
  background: linear-gradient(135deg, var(--cyan-accent), #00B4D8);
  color: #07090E;
  padding: 14px 32px;
  border-radius: 30px;
  font-weight: 700;
  text-decoration: none;
  font-size: 1rem;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 0 20px var(--cyan-glow);
  transition: all 0.25s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 30px rgba(0, 229, 255, 0.4);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-subtle);
  color: #FFF;
  padding: 14px 32px;
  border-radius: 30px;
  font-weight: 600;
  text-decoration: none;
  font-size: 1rem;
  transition: all 0.25s ease;
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
}

/* Stats Counter Bar */
.stats-bar {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 20px;
  margin: 50px 0;
}

.stat-card {
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: 24px 20px;
  text-align: center;
  transition: border-color 0.2s;
}

.stat-card:hover {
  border-color: var(--border-cyan);
}

.stat-number {
  font-size: 2.2rem;
  font-weight: 800;
  color: var(--cyan-accent);
  line-height: 1;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 0.85rem;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Features Grid */
.section-title {
  text-align: center;
  font-size: 2.2rem;
  font-weight: 800;
  margin-bottom: 12px;
}

.section-desc {
  text-align: center;
  color: var(--text-secondary);
  margin-bottom: 48px;
  font-size: 1.05rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
  margin-bottom: 80px;
}

.feature-card {
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  padding: 28px;
  transition: all 0.3s ease;
}

.feature-card:hover {
  background: var(--bg-card-hover);
  border-color: var(--border-cyan);
  transform: translateY(-4px);
}

.feature-icon {
  font-size: 2.2rem;
  margin-bottom: 16px;
  display: block;
}

.feature-title {
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 10px;
  color: #FFF;
}

.feature-body {
  color: var(--text-secondary);
  font-size: 0.95rem;
  margin-bottom: 16px;
}

.command-tag {
  display: inline-block;
  background: rgba(0, 229, 255, 0.08);
  color: var(--cyan-accent);
  padding: 4px 10px;
  border-radius: 6px;
  font-family: monospace;
  font-size: 0.85rem;
}

/* Interactive Sandbox Sections */
.sandbox-card {
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  padding: 32px;
  margin-bottom: 60px;
}

.input-box {
  width: 100%;
  padding: 14px 18px;
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid var(--border-subtle);
  border-radius: 10px;
  color: #FFF;
  font-size: 1rem;
  outline: none;
  margin-bottom: 16px;
  transition: border-color 0.2s;
}

.input-box:focus {
  border-color: var(--cyan-accent);
}

.response-box {
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid var(--border-subtle);
  border-radius: 10px;
  padding: 20px;
  font-size: 0.95rem;
  white-space: pre-wrap;
  color: #E2E8F0;
  min-height: 100px;
}

/* Footer */
footer {
  border-top: 1px solid var(--border-subtle);
  padding: 40px 0;
  text-align: center;
  color: var(--text-secondary);
  font-size: 0.88rem;
}

.disclaimer {
  max-width: 800px;
  margin: 16px auto 0;
  font-size: 0.8rem;
  color: #64748B;
}

/* RTL Support for Arabic */
[dir="rtl"] body {
  text-align: right;
}

[dir="rtl"] .nav-links {
  flex-direction: row-reverse;
}

[dir="rtl"] .brand {
  flex-direction: row-reverse;
}

@media (max-width: 768px) {
  .hero-title { font-size: 2.4rem; }
  .nav-links { display: none; }
}
`;
