// ═══ SCREEN: BIO (Биохакинг) ═══

Screens.bio = function() {
    let html = '<span class="lbl">ТВОЙ СТЕК</span>';
    html += '<div class="ttl" style="margin-bottom:16px">Биохакинг</div>';

    html += '<div style="background:var(--s2);border:1px solid var(--br);border-radius:12px;padding:14px;margin-bottom:16px;display:flex;gap:12px">';
    html += '<span style="font-size:18px;color:var(--ac)">◈</span><div>';
    html += '<span class="lbl" style="color:var(--ac)">ИИ-РЕКОМЕНДАЦИЯ</span>';
    html += '<div style="font-size:12px;color:var(--tx);line-height:1.6">На силовом цикле добавь бета-аланин 3.2г/день — буферизирует лактат при высоком RPE.</div>';
    html += '</div></div>';

    html += '<span class="lbl">ДОБАВКИ</span>';
    State.supps.forEach((s, i) => {
      html += '<div onclick="State.supps[' + i + '].on=!State.supps[' + i + '].on;App.render()" style="background:var(--sf);border:1px solid var(--br);border-radius:12px;padding:12px 14px;margin-bottom:8px;display:flex;align-items:center;gap:12px;cursor:pointer;opacity:' + (s.on?1:.45) + '">';
      html += '<div class="tgl' + (s.on?' on':'') + '" style="background:' + (s.on?s.col+'33':'var(--s2)') + ';border:1.5px solid ' + (s.on?s.col:'var(--br2)') + '">';
      html += '<div class="tknob" style="background:' + (s.on?s.col:'var(--mt)') + ';left:' + (s.on?'21px':'3px') + '"></div></div>';
      html += '<div style="flex:1"><div style="display:flex;align-items:center;gap:7px;margin-bottom:2px">';
      html += '<span style="font-size:14px;font-weight:700;color:var(--tx2)">' + s.name + '</span>';
      html += '<span style="font-size:8px;color:' + s.col + ';border:1px solid ' + s.col + '44;padding:1px 5px;border-radius:4px;letter-spacing:1px">' + s.tag + '</span>';
      html += '</div><div style="font-size:11px;color:var(--sb)">' + s.dose + ' · ' + s.timing + '</div></div></div>';
    });

    html += '<div style="height:1px;background:var(--br);margin:16px -20px"></div>';
    html += '<button onclick="State.modal={type:\'dark\'};App.renderModal()" style="width:100%;background:linear-gradient(135deg,#0d0814,#150d20);border:1px solid #3d1a5a;border-radius:14px;padding:18px 20px;cursor:pointer;text-align:left;font-family:inherit;display:flex;align-items:center;gap:16px;margin-top:16px">';
    html += '<div style="width:48px;height:48px;border-radius:12px;background:#1a0a2a;border:1px solid #4c1d95;display:flex;align-items:center;justify-content:center;font-size:24px;flex-shrink:0">🖤</div>';
    html += '<div><div style="font-size:9px;color:var(--pu);letter-spacing:3px;margin-bottom:5px">ELITE · ЗАКРЫТЫЙ</div>';
    html += '<div style="font-size:16px;font-weight:700;color:#d8b4fe;margin-bottom:4px">Тёмная сторона</div>';
    html += '<div style="font-size:11px;color:#A0A2A8">ГЗТ · Курсы · Пептиды · Анализы</div></div>';
    html += '<span style="color:#787A82;font-size:20px;margin-left:auto">›</span></button>';

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

    // Profile setup after first login
    if (a.profileSetup) return Screens.profileSetup();

    const isLogin = a.mode === 'login';
    let html = '<div style="min-height:100vh;display:flex;flex-direction:column;padding:56px 24px 32px;box-sizing:border-box">';

    // Logo
    html += '<div style="display:flex;flex-direction:column;align-items:center;margin-bottom:36px">';
    html += '<div style="font-size:52px;margin-bottom:10px">💪</div>';
    html += '<div style="font-family:\'Bebas Neue\',sans-serif;font-size:34px;letter-spacing:2px;color:var(--tx)">NYM TRAINING</div>';
    html += '<div style="font-size:10px;color:var(--sb);letter-spacing:2.5px;margin-top:4px">ТВОЙ ТРЕНИРОВОЧНЫЙ ЖУРНАЛ</div>';
    html += '</div>';

    // ── OAuth buttons ──────────────────────────────────────
    html += '<div style="display:flex;flex-direction:column;gap:11px;margin-bottom:22px">';

    // Apple
    html += '<button onclick="AuthActions.signInApple()" style="display:flex;align-items:center;justify-content:center;gap:10px;width:100%;padding:15px;background:#fff;border:none;border-radius:14px;font-size:15px;font-weight:600;color:#000;cursor:pointer;font-family:inherit">';
    html += '<svg width="17" height="20" viewBox="0 0 814 1000" fill="#000"><path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 376.8 1 248.3 1 124.8 1 56.1 29.6 20 76.3 20c41.2 0 72.1 39 91.5 39S224 20 276.9 20c53.3 0 96.9 38.5 107.6 38.5 10.6 0 69.7-39 131.9-39 41.2 0 141.9 5.8 214.5 84.3zm-166.5-89.5c31.7-37.5 53.3-89.5 53.3-141.5 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 84.3-55.1 139.1 0 7.7 1.3 15.5 1.9 18 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.3-72.6z"/></svg>';
    html += 'Войти через Apple</button>';

    // Google
    html += '<button onclick="AuthActions.signInGoogle()" style="display:flex;align-items:center;justify-content:center;gap:10px;width:100%;padding:15px;background:var(--sf);border:1.5px solid var(--br);border-radius:14px;font-size:15px;font-weight:600;color:var(--tx);cursor:pointer;font-family:inherit">';
    html += '<svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>';
    html += 'Войти через Google</button>';
    html += '</div>';

    // ── Divider ──
    html += '<div style="display:flex;align-items:center;gap:12px;margin-bottom:20px">';
    html += '<div style="flex:1;height:1px;background:var(--br)"></div>';
    html += '<span style="font-size:10px;color:var(--sb);letter-spacing:2px">ИЛИ ЧЕРЕЗ EMAIL</span>';
    html += '<div style="flex:1;height:1px;background:var(--br)"></div>';
    html += '</div>';

    // ── Email form ──
    html += '<div style="display:flex;gap:4px;background:var(--s2);border-radius:10px;padding:3px;margin-bottom:14px">';
    html += '<button onclick="State.auth.mode=\'login\';State.auth.error=\'\';App.render()" style="flex:1;padding:8px;border-radius:8px;border:none;cursor:pointer;font-family:inherit;font-size:12px;font-weight:700;letter-spacing:.5px;background:' + (isLogin ? 'var(--sf)' : 'transparent') + ';color:' + (isLogin ? 'var(--ac)' : 'var(--sb)') + '">ВОЙТИ</button>';
    html += '<button onclick="State.auth.mode=\'register\';State.auth.error=\'\';App.render()" style="flex:1;padding:8px;border-radius:8px;border:none;cursor:pointer;font-family:inherit;font-size:12px;font-weight:700;letter-spacing:.5px;background:' + (!isLogin ? 'var(--sf)' : 'transparent') + ';color:' + (!isLogin ? 'var(--ac)' : 'var(--sb)') + '">РЕГИСТРАЦИЯ</button>';
    html += '</div>';

    html += '<div style="display:flex;flex-direction:column;gap:10px;margin-bottom:12px">';
    html += '<input type="email" placeholder="Email" value="' + (a.email || '') + '" oninput="State.auth.email=this.value" style="width:100%;box-sizing:border-box;background:var(--sf);border:1px solid var(--br);border-radius:12px;color:var(--tx);font-size:14px;padding:13px 14px;font-family:inherit;outline:none">';
    html += '<input type="password" placeholder="Пароль (минимум 6 символов)" value="' + (a.password || '') + '" oninput="State.auth.password=this.value" onkeydown="if(event.key===\'Enter\')AuthActions.submit()" style="width:100%;box-sizing:border-box;background:var(--sf);border:1px solid var(--br);border-radius:12px;color:var(--tx);font-size:14px;padding:13px 14px;font-family:inherit;outline:none">';
    html += '</div>';

    if (a.error) {
        html += '<div style="font-size:12px;color:#e06060;background:rgba(224,96,96,.08);border:1px solid rgba(224,96,96,.2);border-radius:8px;padding:8px 12px;margin-bottom:12px">' + a.error + '</div>';
    }

    html += '<button onclick="AuthActions.submit()" ' + (a.loading ? 'disabled' : '') + ' style="width:100%;padding:15px;border-radius:13px;border:none;cursor:' + (a.loading ? 'not-allowed' : 'pointer') + ';font-family:inherit;font-size:14px;font-weight:700;letter-spacing:.5px;background:' + (a.loading ? 'var(--s2)' : 'var(--gradient-primary)') + ';color:' + (a.loading ? 'var(--sb)' : '#1a1410') + ';margin-bottom:20px">' + (a.loading ? '...' : (isLogin ? 'Войти' : 'Создать аккаунт')) + '</button>';

    // ── Guest ──
    html += '<div style="height:1px;background:var(--br);margin-bottom:16px"></div>';
    html += '<button onclick="AuthActions.continueAsGuest()" style="width:100%;background:transparent;border:none;color:var(--sb);font-size:13px;cursor:pointer;font-family:inherit;padding:6px;text-align:center">Продолжить без входа</button>';

    html += '</div>';
    return html;
};

Screens.profileSetup = function() {
    const AVATARS = ['💪', '🔥', '👑', '⚡', '🏆'];
    const a = State.auth;
    const selIdx = a.avatarIdx ?? 0;
    const nick = a.nickInput != null ? a.nickInput : (a.suggestedNick || '');

    let html = '<div style="min-height:100vh;display:flex;flex-direction:column;padding:56px 24px 32px;box-sizing:border-box">';

    // Big avatar + header
    html += '<div style="display:flex;flex-direction:column;align-items:center;margin-bottom:36px">';
    html += '<div style="width:88px;height:88px;border-radius:50%;background:var(--ac15);border:2.5px solid var(--ac);display:flex;align-items:center;justify-content:center;font-size:44px;margin-bottom:14px">' + AVATARS[selIdx] + '</div>';
    html += '<span class="lbl" style="letter-spacing:3px;margin-bottom:4px">ПРОФИЛЬ</span>';
    html += '<div style="font-family:\'Bebas Neue\',sans-serif;font-size:36px;letter-spacing:1px">Создай профиль</div>';
    html += '</div>';

    // Avatar picker
    html += '<div style="margin-bottom:28px">';
    html += '<div style="font-size:10px;color:var(--sb);letter-spacing:2px;margin-bottom:14px;text-align:center">ВЫБЕРИ АВАТАР</div>';
    html += '<div style="display:flex;gap:14px;justify-content:center">';
    AVATARS.forEach(function(em, i) {
        const active = selIdx === i;
        html += '<button onclick="State.auth.avatarIdx=' + i + ';App.render()" style="width:56px;height:56px;border-radius:50%;border:2.5px solid ' + (active ? 'var(--ac)' : 'var(--br)') + ';background:' + (active ? 'var(--ac15)' : 'var(--sf)') + ';font-size:26px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:.15s">' + em + '</button>';
    });
    html += '</div></div>';

    // Nickname
    html += '<div style="margin-bottom:32px">';
    html += '<div style="font-size:10px;color:var(--sb);letter-spacing:2px;margin-bottom:10px;text-align:center">ТВОЙ НИК</div>';
    html += '<input id="nick-input" type="text" value="' + nick.replace(/"/g, '&quot;') + '" oninput="State.auth.nickInput=this.value" maxlength="24" placeholder="' + (a.suggestedNick || 'iron_42') + '" style="width:100%;box-sizing:border-box;padding:16px;background:var(--sf);border:1.5px solid var(--ac30);border-radius:14px;color:var(--tx);font-size:18px;font-family:\'JetBrains Mono\',monospace;text-align:center;letter-spacing:1px;outline:none">';
    html += '<div style="font-size:11px;color:var(--sb);margin-top:8px;text-align:center">можно изменить позже в настройках</div>';
    html += '</div>';

    if (a.error) html += '<div style="font-size:12px;color:#e06060;text-align:center;margin-bottom:16px">' + a.error + '</div>';

    html += '<button onclick="AuthActions.saveProfile()" ' + (a.loading ? 'disabled' : '') + ' style="width:100%;padding:18px;background:' + (a.loading ? 'var(--s2)' : 'var(--gradient-primary)') + ';border:none;border-radius:16px;font-size:16px;font-weight:700;color:' + (a.loading ? 'var(--sb)' : '#1a1410') + ';cursor:' + (a.loading ? 'not-allowed' : 'pointer') + ';font-family:inherit">';
    html += a.loading ? 'Сохраняем...' : 'Готово 🚀';
    html += '</button>';

    html += '</div>';
    return html;
};

