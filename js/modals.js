// ═══ MODALS ═══
const Modals = {
  swap() {
    const {muscle, exId} = State.modal.data;
    const alts = (EXERCISES[muscle] || []).filter(e => e.id !== exId);
    let html = '<div class="modal-wrap"><div class="modal-hdr">';
    html += '<div><span class="lbl">ЗАМЕНА · ' + muscle + '</span><div style="font-size:16px;font-weight:700">Выбери альтернативу</div></div>';
    html += '<button class="modal-close" onclick="App.closeModal()">✕</button></div>';
    html += '<div class="modal-body">';
    alts.forEach(ex => {
      const p = prevOf(ex.id);
      html += '<button onclick="Diary.swapExercise(\'' + ex.id + '\',\'' + muscle + '\')" style="width:100%;padding:14px;border-radius:12px;border:1px solid var(--br);background:var(--sf);text-align:left;cursor:pointer;font-family:inherit;margin-bottom:8px">';
      html += '<div style="font-size:14px;font-weight:600;color:var(--tx);margin-bottom:4px">' + ex.name + '</div>';
      html += '<div style="font-size:10px;color:var(--sb)">Прошлый: ' + p.w + 'кг×' + p.r + ' · ' + p.s + ' подх</div></button>';
    });
    html += '</div></div>';
    return html;
  },

  note() {
    const ex = State.diary.workout[State.diary.activeIdx] || {};
    const existing = ex.note || '';
    let html = '<div class="modal-wrap">';
    html += '<div class="modal-hdr"><div style="font-size:16px;font-weight:700">📝 Заметка к упражнению</div><button class="modal-close" onclick="App.closeModal()">✕</button></div>';
    html += '<div class="modal-body" style="display:flex;flex-direction:column;gap:12px">';
    html += '<div style="font-size:11px;color:var(--sb)">' + ex.name + '</div>';
    html += '<textarea id="note-input" style="height:140px" placeholder="Держать лопатки, следить за локтями...">' + existing.replace(/</g,'&lt;').replace(/>/g,'&gt;') + '</textarea>';
    html += '<div style="display:flex;gap:10px">';
    if (existing) {
      html += '<button class="btn btn-surface" style="flex:1;padding:12px;color:#e06060" onclick="Diary.saveNote(\'\')">Удалить</button>';
    } else {
      html += '<button class="btn btn-surface" style="flex:1;padding:12px" onclick="App.closeModal()">Отмена</button>';
    }
    html += '<button class="btn btn-accent" style="flex:2;padding:12px;border-radius:12px" onclick="Diary.saveNote(document.getElementById(\'note-input\').value.trim())">Сохранить</button>';
    html += '</div></div></div>';
    return html;
  },


  program() {
    // Сразу открываем полный экран программы (без модального оверлея)
    const p = State.modal.data;
    App.closeModal();
    State.programNav = { active: true, programId: p.id, weekIdx: null, dayIdx: null };
    App.render();
    return '';
  },

  confirmClear() {
    return '<div class="modal-wrap">' +
      '<div class="modal-hdr">' +
      '<div><div style="font-size:16px;font-weight:700;color:var(--tx2)">Очистить данные</div>' +
      '<div style="font-size:11px;color:var(--sb);margin-top:3px">Аккаунт останется без изменений</div></div>' +
      '<button class="modal-close" onclick="App.closeModal()">✕</button>' +
      '</div>' +
      '<div class="modal-body">' +
      '<div style="background:rgba(180,40,40,.07);border:1px solid rgba(180,40,40,.2);border-radius:12px;padding:14px 16px;margin-bottom:20px">' +
      '<div style="font-size:13px;color:#d06060;line-height:1.7">Все тренировки и прогресс будут удалены. Аккаунт и данные синхронизации останутся.</div>' +
      '</div>' +
      '<div style="display:flex;gap:10px">' +
      '<button onclick="App.closeModal()" style="flex:1;padding:13px;border-radius:12px;border:1px solid var(--br);background:var(--sf);color:var(--tx2);font-size:13px;font-weight:600;cursor:pointer;font-family:inherit">Отмена</button>' +
      '<button onclick="clearAllData()" style="flex:1;padding:13px;border-radius:12px;border:none;background:rgba(180,40,40,.75);color:white;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit">Очистить</button>' +
      '</div>' +
      '</div></div>';
  },

  confirmDelete() {
    return '<div class="modal-wrap">' +
      '<div class="modal-hdr">' +
      '<div><div style="font-size:16px;font-weight:700;color:#e05050">Удалить аккаунт</div>' +
      '<div style="font-size:11px;color:var(--sb);margin-top:3px">Необратимое действие</div></div>' +
      '<button class="modal-close" onclick="App.closeModal()">✕</button>' +
      '</div>' +
      '<div class="modal-body">' +
      '<div style="background:rgba(180,40,40,.07);border:1px solid rgba(180,40,40,.2);border-radius:12px;padding:14px 16px;margin-bottom:20px">' +
      '<div style="font-size:13px;color:#d06060;line-height:1.7">Это действие нельзя отменить. Все данные, тренировки и аккаунт будут удалены безвозвратно.</div>' +
      '</div>' +
      '<div style="display:flex;gap:10px">' +
      '<button onclick="App.closeModal()" style="flex:1;padding:13px;border-radius:12px;border:1px solid var(--br);background:var(--sf);color:var(--tx2);font-size:13px;font-weight:600;cursor:pointer;font-family:inherit">Отмена</button>' +
      '<button onclick="deleteAccountAndData()" style="flex:1;padding:13px;border-radius:12px;border:1px solid rgba(180,40,40,.45);background:rgba(180,40,40,.15);color:#e05050;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit">Удалить</button>' +
      '</div>' +
      '</div></div>';
  },

  dark() {
    if (!State.darkUnlocked) {
      return '<div class="modal-wrap" style="justify-content:center;align-items:center"><div style="padding:40px 28px;text-align:center;max-width:360px"><div style="font-size:56px;margin-bottom:20px">🖤</div><div style="font-size:22px;font-weight:700;margin-bottom:8px">Тёмная сторона</div><div style="font-size:12px;color:#B0B2B8;line-height:1.8;margin-bottom:28px">Образовательный раздел о фармакологии и спортивной медицине.<br><br>Информация предоставляется исключительно в образовательных целях. Вы принимаете решения самостоятельно.</div><button onclick="State.darkUnlocked=true;App.renderModal()" style="background:linear-gradient(135deg,#4c1d95,#6d28d9);border:none;border-radius:12px;padding:14px 32px;color:var(--tx2);font-size:13px;font-weight:700;cursor:pointer;font-family:inherit;width:100%;margin-bottom:12px">Я понимаю · Войти</button><button onclick="App.closeModal()" style="background:none;border:none;color:#333;font-size:12px;cursor:pointer;font-family:inherit">Отмена</button></div></div>';
    }
    const items = [
      {i:'◈', t:'ГЗТ / ТРТ',            d:'Протоколы, мониторинг, дозировки', c:'#a855f7'},
      {i:'◎', t:'Курсовое планирование', d:'Длительность, ПКТ, восстановление', c:'#9333ea'},
      {i:'◇', t:'Пептиды',               d:'Стеки, тайминг, совместимость',     c:'#7c3aed'},
      {i:'⬡', t:'Анализы крови',         d:'Что сдавать, нормы для атлетов',   c:'#6d28d9'},
      {i:'▣', t:'Антиэстрогены / САРМ',  d:'Дозировки, протоколы',             c:'#5b21b6'},
    ];
    let html = '<div class="modal-wrap"><div class="modal-hdr"><div><div style="font-size:9px;color:var(--pu);letter-spacing:3px;margin-bottom:4px">ELITE · ЗАКРЫТЫЙ</div><div style="font-size:20px;font-weight:700">🖤 Тёмная сторона</div></div><button class="modal-close" onclick="App.closeModal()">✕</button></div>';
    html += '<div class="modal-body"><div style="background:#0d0814;border:1px solid #2d1a4a;border-radius:10px;padding:10px 14px;margin-bottom:16px;font-size:11px;color:#6d28d9;line-height:1.5">⚠️ Образовательный формат. Проконсультируйтесь с врачом.</div>';
    items.forEach(it => {
      html += '<div style="background:#0a0810;border:1px solid #1a1025;border-radius:12px;padding:14px 16px;margin-bottom:8px;display:flex;align-items:center;gap:14px">';
      html += '<div style="width:40px;height:40px;border-radius:10px;background:' + it.c + '22;border:1px solid ' + it.c + '44;display:flex;align-items:center;justify-content:center;font-size:18px;color:' + it.c + ';flex-shrink:0">' + it.i + '</div>';
      html += '<div style="flex:1"><div style="font-size:14px;font-weight:600;color:var(--tx);margin-bottom:2px">' + it.t + '</div><div style="font-size:11px;color:#A0A2A8">' + it.d + '</div></div>';
      html += '<span style="color:#787A82;font-size:18px">›</span></div>';
    });
    html += '</div></div>';
    return html;
  },

  achDetail() {
    const achId = State.modal.data && State.modal.data.achId;
    const all   = evaluateAchievements(getWorkouts());
    const a     = all.find(x => x.id === achId);
    if (!a) return '';
    const lbl    = achProgressLabel(a);
    const barPct = Math.round(a.pct * 100);
    const catLbl = ACH_CATS[a.cat] || '';

    let html = '<div class="modal-wrap">';
    html += '<div class="modal-hdr">';
    html += '<div style="font-size:9px;color:var(--ac);letter-spacing:2px">' + catLbl + '</div>';
    html += '<button class="modal-close" onclick="App.closeModal()">✕</button>';
    html += '</div>';
    html += '<div class="modal-body" style="display:flex;flex-direction:column;align-items:center;gap:14px;text-align:center;padding:24px 20px">';

    // Icon
    html += '<div style="width:72px;height:72px;border-radius:18px;background:' + (a.unlocked ? 'var(--ac15)' : 'var(--s2)') + ';border:1px solid ' + (a.unlocked ? 'var(--ac30)' : 'var(--br)') + ';display:flex;align-items:center;justify-content:center;font-size:36px">';
    html += a.unlocked ? a.icon : '🔒';
    html += '</div>';

    // Title + desc
    html += '<div>';
    html += '<div style="font-size:20px;font-weight:700;color:var(--tx2);margin-bottom:6px">' + a.title + '</div>';
    html += '<div style="font-size:12px;color:var(--sb);line-height:1.6">' + a.desc + '</div>';
    html += '</div>';

    // Progress (if accumulative)
    if (a.target > 1) {
        html += '<div style="width:100%;background:var(--s2);border-radius:10px;padding:12px 14px;box-sizing:border-box">';
        html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:7px">';
        html += '<span style="font-size:10px;color:var(--sb)">Прогресс</span>';
        html += '<span style="font-size:10px;color:var(--ac);font-weight:700">' + (lbl || barPct + '%') + '</span>';
        html += '</div>';
        html += '<div style="height:5px;background:var(--sf);border-radius:3px;overflow:hidden">';
        html += '<div style="height:100%;width:' + barPct + '%;background:var(--gradient-primary);border-radius:3px"></div>';
        html += '</div>';
        html += '</div>';
    }

    // Status
    if (a.unlocked) {
        html += '<div style="font-size:13px;font-weight:700;color:var(--color-success)">✓ Достижение получено!</div>';
    } else {
        html += '<div style="font-size:11px;color:var(--sb)">Ещё не получено</div>';
    }

    html += '</div></div>';
    return html;
  },

  goalAdd() {
    const isEdit  = !!(State.modal.data && State.modal.data.goalIdx != null);
    const gi      = isEdit ? State.modal.data.goalIdx : -1;
    const f       = State.goalForm;
    const title   = isEdit ? 'Редактировать цель' : 'Новая цель';
    const GAINS   = [0.5, 1, 2.5, 5, 10];

    let html = '<div class="modal-wrap">';
    html += '<div class="modal-hdr">';
    html += '<div><span class="lbl">ЦЕЛИ</span><div style="font-size:16px;font-weight:700;color:var(--tx2)">' + title + '</div></div>';
    html += '<button class="modal-close" onclick="App.closeModal()">✕</button>';
    html += '</div>';
    html += '<div class="modal-body" style="display:flex;flex-direction:column;gap:16px">';

    // Name
    html += '<div>';
    html += '<div style="font-size:9px;color:var(--sb);letter-spacing:2px;margin-bottom:6px">НАЗВАНИЕ ЦЕЛИ</div>';
    html += '<input type="text" placeholder="Жим лёжа 100 кг" value="' + (f.name || '') + '" oninput="State.goalForm.name=this.value" style="width:100%;box-sizing:border-box;background:var(--s2);border:1px solid var(--br);border-radius:10px;color:var(--tx2);font-size:14px;padding:11px 12px;font-family:inherit;outline:none">';
    html += '</div>';

    // Current + Target row
    html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">';
    html += '<div>';
    html += '<div style="font-size:9px;color:var(--sb);letter-spacing:2px;margin-bottom:6px">СЕЙЧАС</div>';
    html += '<input type="number" placeholder="70" value="' + (f.current || '') + '" oninput="State.goalForm.current=parseFloat(this.value)||0" style="width:100%;box-sizing:border-box;background:var(--s2);border:1px solid var(--br);border-radius:10px;color:var(--tx2);font-size:14px;padding:11px 12px;font-family:inherit;outline:none">';
    html += '</div>';
    html += '<div>';
    html += '<div style="font-size:9px;color:var(--sb);letter-spacing:2px;margin-bottom:6px">ЦЕЛЬ</div>';
    html += '<input type="number" placeholder="100" value="' + (f.target || '') + '" oninput="State.goalForm.target=parseFloat(this.value)||0" style="width:100%;box-sizing:border-box;background:var(--s2);border:1px solid var(--br);border-radius:10px;color:var(--tx2);font-size:14px;padding:11px 12px;font-family:inherit;outline:none">';
    html += '</div>';
    html += '</div>';

    // Weekly gain chips
    html += '<div>';
    html += '<div style="font-size:9px;color:var(--sb);letter-spacing:2px;margin-bottom:8px">ПРОГРЕСС В НЕДЕЛЮ</div>';
    html += '<div style="display:flex;gap:6px;flex-wrap:wrap">';
    GAINS.forEach(g => {
      const on = (f.weeklyGain || 2.5) === g;
      html += '<button onclick="State.goalForm.weeklyGain=' + g + ';App.renderModal()" style="padding:6px 12px;border-radius:8px;border:1px solid ' + (on ? 'var(--ac)' : 'var(--br)') + ';background:' + (on ? 'var(--ad)' : 'transparent') + ';color:' + (on ? 'var(--ac)' : 'var(--sb)') + ';font-size:11px;font-weight:' + (on ? '700' : '400') + ';cursor:pointer;font-family:inherit">+' + g + ' кг</button>';
    });
    html += '</div>';
    // Preview weeks
    if (f.current > 0 && f.target > 0 && f.target > f.current && f.weeklyGain > 0) {
      const weeks = Math.ceil((f.target - f.current) / f.weeklyGain);
      html += '<div style="font-size:10px;color:var(--ac);margin-top:8px">~' + weeks + ' нед до цели</div>';
    }
    html += '</div>';

    // Buttons
    html += '<div style="display:flex;gap:8px;margin-top:4px">';
    if (isEdit) {
      html += '<button onclick="GoalActions.delete(' + gi + ')" style="padding:13px 16px;border-radius:12px;border:1px solid rgba(180,40,40,.3);background:rgba(180,40,40,.08);color:#e06060;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit">Удалить</button>';
    }
    html += '<button onclick="App.closeModal()" style="flex:1;padding:13px;border-radius:12px;border:1px solid var(--br);background:var(--sf);color:var(--tx2);font-size:13px;font-weight:600;cursor:pointer;font-family:inherit">Отмена</button>';
    html += '<button onclick="GoalActions.save(' + gi + ')" style="flex:2;padding:13px;border-radius:12px;border:none;background:var(--gradient-primary);color:var(--btn-main-color);font-size:13px;font-weight:700;cursor:pointer;font-family:inherit">' + (isEdit ? 'Сохранить' : 'Добавить') + '</button>';
    html += '</div>';

    html += '</div></div>';
    return html;
  },
};

// ─────────────── GOAL ACTIONS ─────────────────────────────
const GoalActions = {
  save(gi) {
    const f = State.goalForm;
    if (!f.name || !f.name.trim()) return;
    if (!f.target || f.target <= 0) return;
    const goal = {
      id: gi >= 0 && State.goals[gi] ? State.goals[gi].id : Date.now(),
      name: f.name.trim(),
      current: f.current || 0,
      target: f.target,
      weeklyGain: f.weeklyGain || 2.5,
      unit: f.unit || 'кг',
      createdAt: gi >= 0 && State.goals[gi] ? State.goals[gi].createdAt : new Date().toISOString(),
    };
    if (gi >= 0) {
      State.goals[gi] = goal;
    } else {
      State.goals.push(goal);
    }
    saveGoals();
    App.closeModal();
    App.render();
  },
  delete(gi) {
    State.goals.splice(gi, 1);
    saveGoals();
    App.closeModal();
    App.render();
  },
};

// ─────────────── DATA ACTIONS ─────────────────────────────
function clearAllData() {
  // Clear localStorage data keys
  ['sb_history', 'sb_current', 'sportbrain_db', 'sb_1rm', 'sb_active_prog'].forEach(k => {
    try { localStorage.removeItem(k); } catch(e) {}
  });
  // Reset in-memory DB
  DB.workouts = [];
  DB.currentWorkout = null;
  // Reset in-memory HISTORY
  for (const k in HISTORY) delete HISTORY[k];
  // Reset diary state
  State.diary.workout    = [];
  State.diary.activeIdx  = -1;
  State.diary.stage      = 'browse';
  State.diary.muscles    = [];
  State.diary.selections = {};
  State.diary.plan       = [];
  State.diary.input      = null;
  State.diary._regressData = null;
  App.closeModal();
  App.render();
}

async function deleteAccountAndData() {
  // First clear all local data
  clearAllData();
  // Then sign out (cloud account stays — full deletion requires server-side support)
  await AuthActions.signOut();
}

// ─────────────── AUTH ACTIONS ─────────────────────────────
const AuthActions = {
  async submit() {
    const a = State.auth;
    const email = (a.email || '').trim();
    const pass  = a.password || '';
    if (!email || !pass) { a.error = 'Введи email и пароль'; App.render(); return; }
    if (pass.length < 6) { a.error = 'Пароль минимум 6 символов'; App.render(); return; }
    if (typeof CloudAuth === 'undefined') { a.error = 'Нет соединения с сервером'; a.loading = false; App.render(); return; }
    a.loading = true; a.error = ''; App.render();

    try {
      const { data, error } = a.mode === 'login'
        ? await CloudAuth.signIn(email, pass)
        : await CloudAuth.signUp(email, pass);

      if (error) {
        const msg = error.message || '';
        a.error = msg.includes('Invalid login credentials') ? 'Неверный email или пароль'
          : msg.includes('already registered') ? 'Email уже зарегистрирован'
          : msg.includes('Failed to fetch') || msg.includes('fetch') ? 'Нет соединения с сервером'
          : msg || 'Ошибка';
        a.loading = false; App.render(); return;
      }

      if (a.mode === 'register' && data?.user && !data?.session) {
        // Email confirmation required
        a.error = ''; a.loading = false;
        a.mode = 'login'; a.password = '';
        const sc = document.getElementById('screen');
        sc.innerHTML = '<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;padding:24px;text-align:center;background:var(--bg)"><div style="font-size:48px;margin-bottom:16px">📧</div><div style="font-size:20px;font-weight:700;color:var(--tx2);margin-bottom:8px">Проверь почту</div><div style="font-size:13px;color:var(--sb);line-height:1.6">Мы отправили письмо на<br><b style="color:var(--tx2)">' + email + '</b><br><br>Перейди по ссылке, затем войди.</div><button onclick="App.render()" style="margin-top:24px;padding:12px 24px;border-radius:12px;border:1px solid var(--br);background:var(--sf);color:var(--tx2);font-size:13px;cursor:pointer;font-family:inherit">← Войти</button></div>';
        return;
      }
      // Успешный вход — onStateChange обновит стейт
      a.loading = false;
    } catch (e) {
      a.error = 'Ошибка соединения'; a.loading = false; App.render();
    }
  },

  async signOut() {
    if (typeof CloudAuth !== 'undefined') await CloudAuth.signOut().catch(() => {});
    State.auth.user    = null;
    State.auth.profile = null;
    State.auth.status  = 'unauthed';
    State.auth.email   = '';
    State.auth.password = '';
    State.auth.profileSetup = false;
    State.auth.showScreen   = true;
    localStorage.removeItem('sb_guest');
    if (typeof cloudSetUser === 'function') cloudSetUser(null);
    App.render();
  },

  async signInGoogle() {
    State.auth.loading = true; State.auth.error = ''; App.render();
    try {
      const { error } = await CloudAuth.signInWithGoogle();
      if (error) { State.auth.error = error.message || 'Ошибка входа'; State.auth.loading = false; App.render(); }
      // Success → page redirects to OAuth provider, will return via onStateChange
    } catch(e) { State.auth.error = 'Ошибка входа через Google'; State.auth.loading = false; App.render(); }
  },

  async signInApple() {
    State.auth.loading = true; State.auth.error = ''; App.render();
    try {
      const { error } = await CloudAuth.signInWithApple();
      if (error) { State.auth.error = error.message || 'Ошибка входа'; State.auth.loading = false; App.render(); }
    } catch(e) { State.auth.error = 'Ошибка входа через Apple'; State.auth.loading = false; App.render(); }
  },

  continueAsGuest() {
    try { localStorage.setItem('sb_guest', '1'); } catch(e) {}
    State.auth.showScreen = false;
    State.auth.status = 'guest';
    App.render();
  },

  async saveProfile() {
    const nick = (State.auth.nickInput != null ? State.auth.nickInput : (State.auth.suggestedNick || '')).trim();
    if (!nick) { State.auth.error = 'Введи ник'; App.render(); return; }
    State.auth.loading = true; State.auth.error = ''; App.render();
    const { error } = await cloudSaveProfile(nick, State.auth.avatarIdx ?? 0);
    if (error) { State.auth.error = 'Ошибка сохранения'; State.auth.loading = false; App.render(); return; }
    State.auth.profile = { nickname: nick, avatar_idx: State.auth.avatarIdx ?? 0 };
    await _loadCloudData();
    State.auth.profileSetup = false;
    State.auth.showScreen   = false;
    State.auth.status       = 'authed';
    State.auth.loading      = false;
    App.render();
  },
};

// ─────────────── CLOUD INIT HELPER ────────────────────────
function _randomNick() {
  const w = ['iron','power','steel','fire','gym','beast','alpha','titan','sport','mega'];
  return w[Math.floor(Math.random() * w.length)] + '_' + (10 + Math.floor(Math.random() * 90));
}

async function _loadCloudData() {
  try {
    const [settings, ach, goals] = await Promise.all([
      cloudLoadSettings(),
      cloudLoadAchievements(),
      cloudLoadGoals(),
    ]);

    if (settings) {
      // Background theme
      if (settings.bg_theme) {
        State.settings.bgTheme = settings.bg_theme;
        try { localStorage.setItem('sb_bg', settings.bg_theme); } catch(e) {}
        if (settings.bg_theme !== 'dark') document.documentElement.dataset.bg = settings.bg_theme;
        else delete document.documentElement.dataset.bg;
      }
      // Accent theme name
      if (settings.theme_name && settings.theme_name !== 'gold') {
        document.documentElement.dataset.theme = settings.theme_name;
        try { localStorage.setItem('sb_theme', settings.theme_name); } catch(e) {}
      }
      // Custom accent hex
      if (settings.accent_hex && typeof applyAccentOnly === 'function') {
        applyAccentOnly(settings.accent_hex.replace('#', ''));
        try { localStorage.setItem('sb_accent', settings.accent_hex); } catch(e) {}
      }
      // Unit
      if (settings.unit) {
        State.settings.unit = settings.unit;
        try { localStorage.setItem('sb_unit', settings.unit); } catch(e) {}
      }
      // Simple mode
      if (settings.simple_mode != null) {
        State.settings.simpleMode = settings.simple_mode;
        try { localStorage.setItem('sb_simple', settings.simple_mode ? '1' : '0'); } catch(e) {}
      }
    }

    if (ach) {
      try { localStorage.setItem('sb_ach', JSON.stringify(ach)); } catch(e) {}
    }

    if (goals && Array.isArray(goals)) {
      State.goals = goals;
      try { localStorage.setItem('sb_goals', JSON.stringify(goals)); } catch(e) {}
    }
  } catch(e) { console.warn('[_loadCloudData]', e); }
}

async function _afterSignIn(user) {
  cloudSetUser(user.id);
  try {
    // Load workout history + 1RM
    const [cloudHist, cloudOrm] = await Promise.all([
      cloudLoadHistory(),
      cloudLoad1RM(),
    ]);
    Object.assign(HISTORY, cloudHist);
    const localOrm = get1RM();
    try { localStorage.setItem('sb_1rm', JSON.stringify({ ...localOrm, ...cloudOrm })); } catch(e) {}

    // Check profile
    const profile = await cloudLoadProfile();
    if (!profile) {
      // First-time user → show profile setup
      State.auth.profileSetup  = true;
      State.auth.suggestedNick = _randomNick();
      State.auth.nickInput     = null;
      State.auth.avatarIdx     = 0;
      // showScreen stays true — authScreen() will render profileSetup
      return;
    }

    State.auth.profile = profile;
    await _loadCloudData();

  } catch(e) { console.warn('[_afterSignIn]', e); }
}
