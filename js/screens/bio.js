// ═══ SCREEN: BIO ═══

Screens.bio = function() {
    let html = '<span class="lbl">НАСТРОЙКИ</span>';
    html += '<div class="ttl" style="margin-bottom:16px">Дневник</div>';

    // ── Тема ──────────────────────────────────────
    const _curTheme = document.documentElement.dataset.theme || 'gold';
    const _themeBtn = (id, label) => {
      const active = _curTheme === id;
      return '<button onclick="setTheme(\'' + id + '\')" style="padding:5px 10px;border-radius:7px;border:1px solid ' + (active ? 'var(--ac)' : 'var(--br)') + ';background:' + (active ? 'var(--ac10)' : 'transparent') + ';color:' + (active ? 'var(--ac)' : 'var(--sb)') + ';font-size:10px;font-weight:700;cursor:pointer;font-family:inherit">' + label + '</button>';
    };
    html += '<div style="background:var(--sf);border:1px solid var(--br);border-radius:12px;padding:12px 14px;margin-bottom:8px;display:flex;align-items:center;gap:12px">';
    html += '<div style="flex:1"><div style="font-size:13px;font-weight:600;color:var(--tx2);margin-bottom:2px">Цветовая тема</div>';
    html += '<div style="font-size:10px;color:var(--sb)">Сравни и выбери</div></div>';
    html += '<div style="display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end">';
    html += _themeBtn('gold',    '🟡 Gold');
    html += _themeBtn('green',   '🟢 Green');
    html += _themeBtn('premium', '⬜ White');
    html += _themeBtn('orange',  '🔶 Classic');
    html += '</div></div>';

    // ── Свой акцент ───────────────────────────────
    const _savedAccent = localStorage.getItem('sb_accent') || '#C9A84C';
    html += '<div style="background:var(--sf);border:1px solid var(--br);border-radius:12px;padding:12px 14px;margin-bottom:8px;display:flex;align-items:center;gap:12px">';
    html += '<div style="flex:1"><div style="font-size:13px;font-weight:600;color:var(--tx2);margin-bottom:2px">Акцент</div>';
    html += '<div style="font-size:10px;color:var(--sb)">Свой цвет — замени один раз, работает везде</div></div>';
    html += '<div style="display:flex;align-items:center;gap:8px">';
    html += '<label style="position:relative;width:34px;height:34px;border-radius:8px;border:1.5px solid var(--br2);overflow:hidden;cursor:pointer;display:block;background:' + _savedAccent + '" title="Выбрать цвет">';
    html += '<input type="color" value="' + _savedAccent + '" oninput="applyAccent(this.value)" style="position:absolute;inset:0;width:100%;height:100%;opacity:0;cursor:pointer;border:none;padding:0">';
    html += '</label>';
    html += '<button onclick="_clearAccentOverride();setTheme(\'brutal\')" style="padding:5px 10px;border-radius:7px;border:1px solid var(--br);background:transparent;color:var(--sb);font-size:10px;font-weight:700;cursor:pointer;font-family:inherit">Сброс</button>';
    html += '</div></div>';

    // ── Settings toggles ──────────────────────────
    const settingsItems = [
      {key:'timer', label:'Таймер отдыха',  hint:'Показывать таймер на экране упражнения'},
      {key:'rpe',   label:'RPE / Усилие',   hint:'Оценка нагрузки в каждом подходе'},
      {key:'tempo', label:'Темп выполнения', hint:'Выбор темпа: негатив, пауза и т.д.'},
      {key:'hints', label:'Подсказки',       hint:'Советы по технике под каждым упражнением'},
    ];
    settingsItems.forEach(s => {
      const on = State.settings[s.key];
      html += '<div onclick="State.settings[\'' + s.key + '\']=!' + on + ';App.render()" style="background:var(--sf);border:1px solid var(--br);border-radius:12px;padding:12px 14px;margin-bottom:8px;display:flex;align-items:center;gap:12px;cursor:pointer">';
      html += '<div class="tgl" style="background:' + (on?'var(--ac20)':'#111') + ';border:1.5px solid ' + (on?'var(--ac)':'#222') + '">';
      html += '<div class="tknob" style="background:' + (on?'var(--ac)':'#333') + ';left:' + (on?'21px':'3px') + '"></div></div>';
      html += '<div style="flex:1"><div style="font-size:13px;font-weight:600;color:' + (on?'var(--tx2)':'#444') + ';margin-bottom:2px">' + s.label + '</div>';
      html += '<div style="font-size:10px;color:var(--sb)">' + s.hint + '</div></div></div>';
    });

    html += '<div style="height:1px;background:#111;margin:16px -20px 16px"></div>';
    html += '<span class="lbl">ТВОЙ СТЕК</span>';
    html += '<div class="ttl" style="margin-bottom:16px">Биохакинг</div>';

    html += '<div style="background:#171819;border:1px solid #2a2b2e;border-radius:12px;padding:14px;margin-bottom:16px;display:flex;gap:12px">';
    html += '<span style="font-size:18px">◈</span><div>';
    html += '<span class="lbl" style="color:#9EAA8C">ИИ-РЕКОМЕНДАЦИЯ</span>';
    html += '<div style="font-size:12px;color:#C0C2C8;line-height:1.6">На силовом цикле добавь бета-аланин 3.2г/день — буферизирует лактат при высоком RPE.</div>';
    html += '</div></div>';

    html += '<span class="lbl">ДОБАВКИ</span>';
    State.supps.forEach((s, i) => {
      html += '<div onclick="State.supps[' + i + '].on=!State.supps[' + i + '].on;App.render()" style="background:var(--sf);border:1px solid var(--br);border-radius:12px;padding:12px 14px;margin-bottom:8px;display:flex;align-items:center;gap:12px;cursor:pointer;opacity:' + (s.on?1:.45) + '">';
      html += '<div class="tgl' + (s.on?' on':'') + '" style="background:' + (s.on?s.col+'33':'#111') + ';border:1.5px solid ' + (s.on?s.col:'#222') + '">';
      html += '<div class="tknob" style="background:' + (s.on?s.col:'#333') + ';left:' + (s.on?'21px':'3px') + '"></div></div>';
      html += '<div style="flex:1"><div style="display:flex;align-items:center;gap:7px;margin-bottom:2px">';
      html += '<span style="font-size:14px;font-weight:700;color:' + (s.on?'#fff':'#444') + '">' + s.name + '</span>';
      html += '<span style="font-size:8px;color:' + s.col + ';border:1px solid ' + s.col + '44;padding:1px 5px;border-radius:4px;letter-spacing:1px">' + s.tag + '</span>';
      html += '</div><div style="font-size:11px;color:var(--sb)">' + s.dose + ' · ' + s.timing + '</div></div></div>';
    });

    html += '<div style="height:1px;background:#111;margin:16px -20px"></div>';
    html += '<button onclick="State.modal={type:\'dark\'};App.renderModal()" style="width:100%;background:linear-gradient(135deg,#0d0814,#150d20);border:1px solid #3d1a5a;border-radius:14px;padding:18px 20px;cursor:pointer;text-align:left;font-family:inherit;display:flex;align-items:center;gap:16px;margin-top:16px">';
    html += '<div style="width:48px;height:48px;border-radius:12px;background:#1a0a2a;border:1px solid #4c1d95;display:flex;align-items:center;justify-content:center;font-size:24px;flex-shrink:0">🖤</div>';
    html += '<div><div style="font-size:9px;color:var(--pu);letter-spacing:3px;margin-bottom:5px">ELITE · ЗАКРЫТЫЙ</div>';
    html += '<div style="font-size:16px;font-weight:700;color:#d8b4fe;margin-bottom:4px">Тёмная сторона</div>';
    html += '<div style="font-size:11px;color:#A0A2A8">ГЗТ · Курсы · Пептиды · Анализы</div></div>';
    html += '<span style="color:#787A82;font-size:20px;margin-left:auto">›</span></button>';

    // ── Cloud sync / Auth ──────────────────────────
    html += '<div style="height:1px;background:#111;margin:16px -20px 16px"></div>';
    const au = State.auth;
    if (au.status === 'authed' && au.user) {
      html += '<div style="background:var(--sf);border:1px solid var(--br);border-radius:12px;padding:12px 16px;display:flex;align-items:center;gap:12px;margin-bottom:8px">';
      html += '<div style="width:36px;height:36px;border-radius:50%;background:var(--ac15);border:1px solid var(--ac30);display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0">☁️</div>';
      html += '<div style="flex:1"><div style="font-size:11px;font-weight:700;color:var(--ac);margin-bottom:2px">ОБЛАКО ВКЛЮЧЕНО</div>';
      html += '<div style="font-size:10px;color:var(--sb)">' + (au.user.email || '') + '</div></div>';
      html += '<button onclick="AuthActions.signOut()" style="background:transparent;border:1px solid var(--br);border-radius:8px;color:var(--sb);font-size:10px;padding:6px 10px;cursor:pointer;font-family:inherit;white-space:nowrap">Выйти</button></div>';
    } else {
      html += '<div style="background:var(--sf);border:1px solid var(--br);border-radius:12px;padding:14px 16px;margin-bottom:8px">';
      html += '<div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">';
      html += '<span style="font-size:20px">☁️</span>';
      html += '<div><div style="font-size:12px;font-weight:700;color:var(--tx2)">Облачная синхронизация</div>';
      html += '<div style="font-size:10px;color:var(--sb)">Сохраняй историю и 1ПМ в облаке</div></div></div>';
      html += '<button onclick="State.auth.showScreen=true;State.auth.error=\'\';App.render()" style="width:100%;padding:11px;border-radius:10px;border:none;cursor:pointer;font-family:inherit;font-size:13px;font-weight:700;background:var(--gradient-primary);color:var(--btn-main-color)">Войти / Зарегистрироваться</button>';
      html += '</div>';
    }

    return html;
};

Screens.authLoading = function() {
    return '<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:80vh;gap:16px">' +
      '<div style="font-size:32px">💪</div>' +
      '<div style="font-size:11px;color:var(--sb);letter-spacing:3px">ЗАГРУЗКА...</div>' +
      '</div>';
};

Screens.authScreen = function() {
    const a = State.auth;
    const isLogin = a.mode === 'login';
    let html = '<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;padding:24px;box-sizing:border-box;background:var(--bg)">';
    html += '<div style="text-align:center;margin-bottom:32px">';
    html += '<div style="font-size:40px;margin-bottom:8px">💪</div>';
    html += '<div style="font-size:28px;font-weight:700;color:var(--tx2);letter-spacing:1px">SportBrain</div>';
    html += '<div style="font-size:11px;color:var(--sb);margin-top:4px;letter-spacing:2px">УМНЫЙ ТРЕНИРОВОЧНЫЙ ЖУРНАЛ</div>';
    html += '</div>';
    html += '<div style="width:100%;max-width:360px;background:var(--sf);border:1px solid var(--br);border-radius:18px;padding:24px">';
    html += '<div style="display:flex;gap:4px;background:#0a0b0c;border-radius:10px;padding:3px;margin-bottom:24px">';
    html += '<button onclick="State.auth.mode=\'login\';State.auth.error=\'\';App.render()" style="flex:1;padding:8px;border-radius:8px;border:none;cursor:pointer;font-family:inherit;font-size:12px;font-weight:700;letter-spacing:.5px;background:' + (isLogin ? 'var(--sf)' : 'transparent') + ';color:' + (isLogin ? 'var(--ac)' : 'var(--sb)') + '">ВОЙТИ</button>';
    html += '<button onclick="State.auth.mode=\'register\';State.auth.error=\'\';App.render()" style="flex:1;padding:8px;border-radius:8px;border:none;cursor:pointer;font-family:inherit;font-size:12px;font-weight:700;letter-spacing:.5px;background:' + (!isLogin ? 'var(--sf)' : 'transparent') + ';color:' + (!isLogin ? 'var(--ac)' : 'var(--sb)') + '">РЕГИСТРАЦИЯ</button>';
    html += '</div>';
    html += '<div style="margin-bottom:12px">';
    html += '<div style="font-size:9px;color:var(--sb);letter-spacing:2px;margin-bottom:6px">EMAIL</div>';
    html += '<input type="email" placeholder="your@email.com" value="' + (a.email || '') + '" oninput="State.auth.email=this.value" style="width:100%;box-sizing:border-box;background:#0a0b0c;border:1px solid var(--br);border-radius:10px;color:var(--tx2);font-size:14px;padding:12px;font-family:inherit;outline:none">';
    html += '</div>';
    html += '<div style="margin-bottom:' + (a.error ? '10px' : '20px') + '">';
    html += '<div style="font-size:9px;color:var(--sb);letter-spacing:2px;margin-bottom:6px">ПАРОЛЬ</div>';
    html += '<input type="password" placeholder="••••••••" value="' + (a.password || '') + '" oninput="State.auth.password=this.value" onkeydown="if(event.key===\'Enter\')AuthActions.submit()" style="width:100%;box-sizing:border-box;background:#0a0b0c;border:1px solid var(--br);border-radius:10px;color:var(--tx2);font-size:14px;padding:12px;font-family:inherit;outline:none">';
    html += '</div>';
    if (a.error) {
      html += '<div style="font-size:11px;color:#e06060;background:rgba(224,96,96,.08);border:1px solid rgba(224,96,96,.2);border-radius:8px;padding:8px 12px;margin-bottom:16px">' + a.error + '</div>';
    }
    html += '<button onclick="AuthActions.submit()" ' + (a.loading ? 'disabled' : '') + ' style="width:100%;padding:14px;border-radius:12px;border:none;cursor:' + (a.loading ? 'not-allowed' : 'pointer') + ';font-family:inherit;font-size:14px;font-weight:700;letter-spacing:.5px;background:' + (a.loading ? '#2a2a2a' : 'var(--gradient-primary)') + ';color:' + (a.loading ? 'var(--sb)' : '#1a1410') + '">' + (a.loading ? '...' : (isLogin ? 'Войти' : 'Создать аккаунт')) + '</button>';
    if (!isLogin) {
      html += '<div style="font-size:10px;color:var(--sb);text-align:center;margin-top:16px;line-height:1.5">Создавая аккаунт, ты получаешь<br>персональную историю тренировок в облаке</div>';
    }
    html += '</div>';
    return html;
};

