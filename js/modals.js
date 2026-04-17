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
    return '<div class="modal-wrap"><div class="modal-hdr"><div style="font-size:16px;font-weight:700">💬 Заметка к упражнению</div><button class="modal-close" onclick="App.closeModal()">✕</button></div><div class="modal-body" style="display:flex;flex-direction:column;gap:12px"><textarea id="note-input" style="height:140px" placeholder="Держать лопатки, следить за локтями..."></textarea><div style="display:flex;gap:10px"><button class="btn btn-surface" style="flex:1;padding:12px" onclick="App.closeModal()">Отмена</button><button class="btn btn-accent" style="flex:2;padding:12px;border-radius:12px" onclick="Diary.saveNote(document.getElementById(\'note-input\').value)">Сохранить</button></div></div></div>';
  },


  program() {
    // Сразу открываем полный экран программы (без модального оверлея)
    const p = State.modal.data;
    App.closeModal();
    State.programNav = { active: true, programId: p.id, weekIdx: null, dayIdx: null };
    App.render();
    return '';
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
};

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
    State.auth.user = null;
    State.auth.status = 'unauthed';
    State.auth.email = '';
    State.auth.password = '';
    State.auth.showScreen = false;
    if (typeof cloudSetUser === 'function') cloudSetUser(null);
    App.render();
  },
};

// ─────────────── CLOUD INIT HELPER ────────────────────────
async function _afterSignIn(user) {
  cloudSetUser(user.id);
  try {
    const [cloudHist, cloudOrm] = await Promise.all([
      cloudLoadHistory(),
      cloudLoad1RM(),
    ]);
    // Merge cloud HISTORY (cloud wins for same keys)
    Object.assign(HISTORY, cloudHist);
    // Merge 1RM into localStorage (cloud wins)
    const localOrm = get1RM();
    localStorage.setItem('sb_1rm', JSON.stringify({ ...localOrm, ...cloudOrm }));
  } catch (e) { console.warn('_afterSignIn load error:', e); }
}
