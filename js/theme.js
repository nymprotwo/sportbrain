// ═══ THEME & INIT ═══
// ─────────────── THEME ───────────────
function setTheme(name) {
  // 'gold' = default (:root, no data-theme), 'green'/'premium'/'orange' = data-theme
  _clearAccentOverride();
  if (name === 'gold') {
    delete document.documentElement.dataset.theme;
  } else {
    document.documentElement.dataset.theme = name;
  }
  localStorage.setItem('sb_theme', name);
  _cloudSaveSettingsNow();
  App.render();
}

// ─────────────── ACCENT COLOR PICKER ───────────────
/**
 * Apply a custom accent color over the current theme.
 * Call from console: accent('#FF6B35')
 * Or use the color picker in Bio settings.
 */
// ── HSL → HEX helper ──────────────────────────────
function hslToHex(h, s, l) {
  s /= 100; l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = n => {
    const k = (n + h / 30) % 12;
    const c = l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    return Math.round(255 * c).toString(16).padStart(2, '0');
  };
  return f(0) + f(8) + f(4);
}

// ── Apply accent CSS vars only (no render, no save) — used during live drag ──
function applyAccentOnly(hex) {
  hex = hex.replace('#', '');
  if (hex.length !== 6) return;
  const r = parseInt(hex.slice(0,2), 16);
  const g = parseInt(hex.slice(2,4), 16);
  const b = parseInt(hex.slice(4,6), 16);
  const r2 = Math.round(r * .62), g2 = Math.round(g * .62), b2 = Math.round(b * .62);
  const lum = (0.299*r + 0.587*g + 0.114*b) / 255;
  const btnColor = lum > 0.42 ? '#060f06' : '#ffffff';
  const rgb = r + ',' + g + ',' + b;
  const st  = document.documentElement.style;
  st.setProperty('--accent-primary',   '#' + hex);
  st.setProperty('--accent-secondary', 'rgb(' + r2 + ',' + g2 + ',' + b2 + ')');
  st.setProperty('--gradient-primary', 'linear-gradient(180deg,#' + hex + ' 0%,rgb(' + r2 + ',' + g2 + ',' + b2 + ') 100%)');
  st.setProperty('--btn-main-color',   btnColor);
  st.setProperty('--ac-glow',          'rgba(' + rgb + ',.2)');
  st.setProperty('--ac',               '#' + hex);
  st.setProperty('--ad',               'rgba(' + rgb + ',.07)');
  st.setProperty('--ab',               'rgba(' + rgb + ',.18)');
  const ops = {ac04:.03,ac05:.04,ac06:.05,ac07:.05,ac08:.06,ac10:.07,ac12:.08,ac14:.09,
               ac15:.1,ac18:.12,ac20:.13,ac25:.16,ac28:.18,ac30:.2,ac40:.26,ac45:.3,
               ac50:.33,ac55:.37,ac60:.4,ac70:.47};
  for (const k in ops) st.setProperty('--' + k, 'rgba(' + rgb + ',' + ops[k] + ')');
  // also update hue thumb color live
  const thumb = document.getElementById('hue-thumb');
  if (thumb) thumb.style.background = '#' + hex;
}

function applyAccent(hex) {
  hex = hex.replace('#', '');
  if (hex.length !== 6) return;
  // Apply all CSS vars (shared with applyAccentOnly)
  applyAccentOnly(hex);
  // Additional: ORM tokens
  const r = parseInt(hex.slice(0,2),16), g = parseInt(hex.slice(2,4),16), b = parseInt(hex.slice(4,6),16);
  const rgb = r+','+g+','+b;
  const st = document.documentElement.style;
  st.setProperty('--orm-bg',      'rgba('+rgb+',.07)');
  st.setProperty('--orm-border',  'rgba('+rgb+',.4)');
  st.setProperty('--orm-glow',    'rgba('+rgb+',.12)');
  st.setProperty('--orm-icon-bg', 'rgba('+rgb+',.12)');
  st.setProperty('--orm-icon-bd', 'rgba('+rgb+',.3)');
  st.setProperty('--orm-color',   '#'+hex);
  st.setProperty('--orm-label',   'rgba('+rgb+',.7)');
  // Save & re-render
  localStorage.setItem('sb_accent', '#' + hex);
  delete document.documentElement.dataset.theme;
  localStorage.setItem('sb_theme', 'brutal');
  App.render();
}
window.accent = applyAccent; // console shortcut: accent('#FF6B35')

// ── Hue slider drag handlers (used by settings screen) ────────────────
window._hueDrag = function(e) {
  e.preventDefault();
  const t = document.getElementById('hue-track');
  if (!t) return;
  const rect = t.getBoundingClientRect();
  const cx = e.touches ? e.touches[0].clientX : e.clientX;
  const hue = Math.round(Math.max(0, Math.min(360, (cx - rect.left) / rect.width * 360)));
  const th = document.getElementById('hue-thumb');
  if (th) th.style.left = (hue / 360 * 100) + '%';
  applyAccentOnly(hslToHex(hue, 80, 55));
};
window._hueCommit = function(e) {
  const t = document.getElementById('hue-track');
  if (!t) return;
  const rect = t.getBoundingClientRect();
  const cx = e.changedTouches ? e.changedTouches[0].clientX
           : (e.touches && e.touches[0] ? e.touches[0].clientX : e.clientX);
  const hue = Math.round(Math.max(0, Math.min(360, (cx - rect.left) / rect.width * 360)));
  applyAccent(hslToHex(hue, 80, 55));
};

// ── Background theme (dark / grey / light) ────────────────
function applyBgTheme(theme) {
  State.settings.bgTheme = theme;
  try { localStorage.setItem('sb_bg', theme); } catch(e) {}
  if (theme === 'dark') {
    delete document.documentElement.dataset.bg;
  } else {
    document.documentElement.dataset.bg = theme;
  }
  _cloudSaveSettingsNow();
  App.render();
}

function _cloudSaveSettingsNow() {
  if (typeof State === 'undefined' || State.auth.status !== 'authed') return;
  if (typeof cloudSaveSettings !== 'function') return;
  cloudSaveSettings({
    bgTheme:    State.settings.bgTheme,
    themeName:  localStorage.getItem('sb_theme') || 'gold',
    accentHex:  localStorage.getItem('sb_accent') || null,
    unit:       State.settings.unit,
    simpleMode: State.settings.simpleMode,
  }).catch(() => {});
}

function _clearAccentOverride() {
  const props = ['--accent-primary','--accent-secondary','--gradient-primary','--btn-main-color',
    '--ac-glow','--ac','--ad','--ab','--orm-bg','--orm-border','--orm-glow','--orm-icon-bg',
    '--orm-icon-bd','--orm-color','--orm-label',
    '--ac04','--ac05','--ac06','--ac07','--ac08','--ac10','--ac12','--ac14','--ac15','--ac18',
    '--ac20','--ac25','--ac28','--ac30','--ac40','--ac45','--ac50','--ac55','--ac60','--ac70'];
  props.forEach(p => document.documentElement.style.removeProperty(p));
  localStorage.removeItem('sb_accent');
}

(function initTheme() {
  const saved = localStorage.getItem('sb_theme');
  if (saved && saved !== 'gold') {
    document.documentElement.dataset.theme = saved; // 'green', 'premium', 'orange'
  } else {
    delete document.documentElement.dataset.theme; // gold = :root default
  }
  // Restore background theme
  const savedBg = localStorage.getItem('sb_bg');
  if (savedBg && savedBg !== 'dark') {
    document.documentElement.dataset.bg = savedBg;
  } else {
    delete document.documentElement.dataset.bg;
  }
  // Restore custom accent if it was set (and theme is gold)
  const savedAccent = localStorage.getItem('sb_accent');
  if (savedAccent && (!saved || saved === 'gold')) {
    // Apply without re-saving or re-rendering (we're in init)
    const hex = savedAccent.replace('#', '');
    if (hex.length === 6) {
      const r = parseInt(hex.slice(0,2),16), g = parseInt(hex.slice(2,4),16), b = parseInt(hex.slice(4,6),16);
      const r2 = Math.round(r*.62), g2 = Math.round(g*.62), b2 = Math.round(b*.62);
      const lum = (0.299*r + 0.587*g + 0.114*b)/255;
      const rgb = r+','+g+','+b;
      const st = document.documentElement.style;
      st.setProperty('--accent-primary','#'+hex);
      st.setProperty('--accent-secondary','rgb('+r2+','+g2+','+b2+')');
      st.setProperty('--gradient-primary','linear-gradient(180deg,#'+hex+' 0%,rgb('+r2+','+g2+','+b2+') 100%)');
      st.setProperty('--btn-main-color', lum > 0.42 ? '#060f06' : '#ffffff');
      st.setProperty('--ac-glow','rgba('+rgb+',.2)'); st.setProperty('--ac','#'+hex);
      st.setProperty('--ad','rgba('+rgb+',.07)'); st.setProperty('--ab','rgba('+rgb+',.18)');
      const ops={ac04:.03,ac05:.04,ac06:.05,ac07:.05,ac08:.06,ac10:.07,ac12:.08,ac14:.09,
                 ac15:.1,ac18:.12,ac20:.13,ac25:.16,ac28:.18,ac30:.2,ac40:.26,ac45:.3,
                 ac50:.33,ac55:.37,ac60:.4,ac70:.47};
      for(const k in ops) st.setProperty('--'+k,'rgba('+rgb+','+ops[k]+')');
      st.setProperty('--orm-bg','rgba('+rgb+',.07)'); st.setProperty('--orm-border','rgba('+rgb+',.4)');
      st.setProperty('--orm-glow','rgba('+rgb+',.12)'); st.setProperty('--orm-icon-bg','rgba('+rgb+',.12)');
      st.setProperty('--orm-icon-bd','rgba('+rgb+',.3)'); st.setProperty('--orm-color','#'+hex);
      st.setProperty('--orm-label','rgba('+rgb+',.7)');
    }
  }
})();

// Store program data globally for modal access
PROGRAMS.forEach(p => { window['_prog' + p.id] = p; });

// ─────────────── START ───────────────
Storage.restore();

// Если пользователь ранее выбрал «без входа» — сразу в приложение
(function() {
  const isGuest = localStorage.getItem('sb_guest') === '1';
  if (isGuest) {
    State.auth.showScreen = false;
    State.auth.status     = 'guest';
  }
  // else: showScreen: true (по умолчанию) — покажем экран входа
})();

App.render(); // Показываем сразу (auth или приложение)

// Supabase — проверяем сессию в фоне
try {
  if (typeof CloudAuth !== 'undefined') {
    CloudAuth.getSession().then(async session => {
      if (session && session.user) {
        State.auth.user   = session.user;
        State.auth.status = 'authed';
        await _afterSignIn(session.user);
        // _afterSignIn может выставить profileSetup = true (новый юзер)
        if (!State.auth.profileSetup) State.auth.showScreen = false;
        App.render();
      }
      // else: если гость — уже показали приложение; если нет — показали auth
    }).catch(e => { console.warn('[getSession]', e); });

    CloudAuth.onStateChange(async (event, session) => {
      if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && session) {
        if (State.auth.status !== 'authed') {
          State.auth.user   = session.user;
          State.auth.status = 'authed';
          State.auth.loading = false;
          await _afterSignIn(session.user);
          if (!State.auth.profileSetup) State.auth.showScreen = false;
          App.render();
        }
      } else if (event === 'SIGNED_OUT') {
        State.auth.user   = null;
        State.auth.status = 'unauthed';
        State.auth.showScreen = true;
        if (typeof cloudSetUser === 'function') cloudSetUser(null);
        App.render();
      }
    });
  }
} catch(e) { console.warn('[Supabase init]', e); }
