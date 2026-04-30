// ═══ SCREEN: SETTINGS ═══

Screens.settings = function() {
    const page = State.settingsPage || null;
    if (page === 'appearance') return _settingsAppearance();
    if (page === 'workout')    return _settingsWorkout();
    if (page === 'account')    return _settingsAccount();
    if (page === 'help')       return _settingsHelp();
    return _settingsMain();
};

// ── Back button + section label ────────────────────────────
function _settingsBack(label) {
    return '<button onclick="State.settingsPage=null;App.render()" style="display:flex;align-items:center;gap:4px;background:none;border:none;color:var(--ac);font-size:14px;font-weight:600;cursor:pointer;font-family:inherit;padding:0;margin-bottom:20px">‹ Назад</button>' +
        '<div style="font-size:9px;letter-spacing:2.5px;color:var(--sb);margin-bottom:4px">' + label + '</div>';
}

// ══════════════════════════════════════════════════════════
// ГЛАВНОЕ МЕНЮ
// ══════════════════════════════════════════════════════════
function _settingsMain() {
    let html = '<span class="lbl">МЕНЮ</span>';
    html += '<div class="ttl" style="font-size:28px;margin-bottom:20px">Настройки</div>';

    const items = [
        { page:'appearance', icon:'🎨', title:'Внешний вид',  hint:'Акцент и цвет фона' },
        { page:'workout',    icon:'💪', title:'Тренировка',   hint:'Таймер, RPE, темп, режим' },
        { page:'account',    icon:'☁️', title:'Аккаунт',      hint:'Синхронизация и данные' },
        { page:'help',       icon:'ℹ️', title:'Помощь',       hint:'Версия и контакты' },
    ];

    html += '<div style="background:var(--sf);border:1px solid var(--br);border-radius:14px;padding:0 14px">';
    items.forEach((it, i) => {
        const last = i === items.length - 1;
        html += '<div onclick="State.settingsPage=\'' + it.page + '\';App.render()" style="display:flex;align-items:center;gap:14px;padding:14px 0;cursor:pointer' + (last ? '' : ';border-bottom:1px solid var(--br)') + '">';
        html += '<div style="width:36px;height:36px;border-radius:10px;background:var(--ac12);border:1px solid var(--ac30);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">' + it.icon + '</div>';
        html += '<div style="flex:1"><div style="font-size:14px;font-weight:600;color:var(--tx2)">' + it.title + '</div>';
        html += '<div style="font-size:10px;color:var(--sb);margin-top:2px">' + it.hint + '</div></div>';
        html += '<span style="color:var(--mt);font-size:20px">›</span>';
        html += '</div>';
    });
    html += '</div>';
    return html;
}

// ══════════════════════════════════════════════════════════
// ВНЕШНИЙ ВИД
// ══════════════════════════════════════════════════════════
function _settingsAppearance() {
    let html = _settingsBack('ОФОРМЛЕНИЕ');
    html += '<div class="ttl" style="font-size:24px;margin-bottom:20px">Внешний вид</div>';

    // ── Фон ──────────────────────────────────────────────
    const currentBg = State.settings.bgTheme || 'dark';
    const bgOpts = [
        { id:'dark',  label:'Тёмный',  bg:'#0b0b0d', dotA:'rgba(255,255,255,.18)', dotB:'rgba(255,255,255,.08)' },
        { id:'grey',  label:'Серый',   bg:'#2c2c2e', dotA:'rgba(255,255,255,.18)', dotB:'rgba(255,255,255,.08)' },
        { id:'light', label:'Светлый', bg:'#f2f2f7', dotA:'rgba(0,0,0,.15)',       dotB:'rgba(0,0,0,.07)' },
    ];

    html += '<div style="background:var(--sf);border:1px solid var(--br);border-radius:14px;padding:16px;margin-bottom:16px">';
    html += '<div style="font-size:9px;color:var(--sb);letter-spacing:2px;margin-bottom:14px">ФОН</div>';
    html += '<div style="display:flex;gap:10px">';

    bgOpts.forEach(opt => {
        const on = currentBg === opt.id;
        html += '<div onclick="applyBgTheme(\'' + opt.id + '\')" style="flex:1;cursor:pointer">';
        // Preview card
        html += '<div style="height:64px;border-radius:12px;background:' + opt.bg + ';' +
            'border:2.5px solid ' + (on ? 'var(--ac)' : 'rgba(128,128,128,.2)') + ';' +
            (on ? 'box-shadow:0 0 0 1px var(--ac);' : '') +
            'margin-bottom:7px;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden">';
        // Tiny UI mockup inside
        html += '<div style="display:flex;flex-direction:column;gap:5px;width:60%;opacity:.7">';
        html += '<div style="height:7px;border-radius:3px;background:' + opt.dotA + '"></div>';
        html += '<div style="height:5px;border-radius:3px;background:' + opt.dotB + ';width:70%"></div>';
        html += '<div style="height:5px;border-radius:3px;background:' + opt.dotB + ';width:50%"></div>';
        html += '</div>';
        // Checkmark badge
        if (on) {
            html += '<div style="position:absolute;top:5px;right:5px;width:17px;height:17px;border-radius:50%;background:var(--ac);display:flex;align-items:center;justify-content:center;font-size:9px;color:var(--btn-main-color);font-weight:700">✓</div>';
        }
        html += '</div>';
        html += '<div style="font-size:10px;text-align:center;color:' + (on ? 'var(--ac)' : 'var(--sb)') + ';font-weight:' + (on ? '700' : '400') + '">' + opt.label + '</div>';
        html += '</div>';
    });

    html += '</div></div>';

    // ── Акцент ───────────────────────────────────────────
    const _savedAccent = (localStorage.getItem('sb_accent') || '#C9A84C').replace('#', '');
    const _presets = [
        {hex:'C9A84C', name:'Gold'},
        {hex:'4ade80', name:'Green'},
        {hex:'a855f7', name:'Purple'},
        {hex:'22d3ee', name:'Cyan'},
        {hex:'3b82f6', name:'Blue'},
        {hex:'f97316', name:'Orange'},
    ];

    html += '<div style="background:var(--sf);border:1px solid var(--br);border-radius:14px;padding:16px;margin-bottom:20px">';
    html += '<div style="font-size:9px;color:var(--sb);letter-spacing:2px;margin-bottom:12px">АКЦЕНТ</div>';
    html += '<div style="display:flex;gap:8px;margin-bottom:16px">';
    _presets.forEach(p => {
        const isActive = _savedAccent.toLowerCase() === p.hex.toLowerCase();
        html += '<div onclick="applyAccent(\'' + p.hex + '\')" title="' + p.name + '" style="width:32px;height:32px;border-radius:50%;background:#' + p.hex + ';cursor:pointer;flex-shrink:0;' +
            'border:2.5px solid ' + (isActive ? 'white' : 'transparent') + ';' +
            'box-shadow:' + (isActive ? '0 0 0 2px #' + p.hex + ',0 0 10px #' + p.hex + '55' : '0 0 0 1px rgba(255,255,255,.08)') + ';' +
            'transition:box-shadow .15s,border-color .15s"></div>';
    });
    html += '</div>';

    // Hue slider
    const _r = parseInt(_savedAccent.slice(0,2),16)/255,
          _g = parseInt(_savedAccent.slice(2,4),16)/255,
          _b = parseInt(_savedAccent.slice(4,6),16)/255;
    const _max = Math.max(_r,_g,_b), _min = Math.min(_r,_g,_b);
    let _h = 0;
    if (_max !== _min) {
        const _d = _max - _min;
        if (_max === _r)      _h = 60*((_g-_b)/_d + (_g<_b?6:0));
        else if (_max === _g) _h = 60*((_b-_r)/_d + 2);
        else                  _h = 60*((_r-_g)/_d + 4);
    }
    const _pct = (Math.round(_h) / 360 * 100).toFixed(1);

    html += '<div style="font-size:9px;color:var(--sb);letter-spacing:1.5px;margin-bottom:8px">СВОЙ ЦВЕТ — ПОТЯНИ</div>';
    html += '<div id="hue-track" style="position:relative;height:28px;border-radius:14px;cursor:pointer;' +
        'background:linear-gradient(to right,hsl(0,80%,55%),hsl(30,80%,55%),hsl(60,80%,55%),hsl(90,80%,55%),hsl(120,80%,55%),hsl(150,80%,55%),hsl(180,80%,55%),hsl(210,80%,55%),hsl(240,80%,55%),hsl(270,80%,55%),hsl(300,80%,55%),hsl(330,80%,55%),hsl(360,80%,55%));' +
        'box-shadow:inset 0 0 0 1px rgba(255,255,255,.1);user-select:none;-webkit-user-select:none"' +
        ' ontouchstart="_hueDrag(event)" ontouchmove="_hueDrag(event)" ontouchend="_hueCommit(event)"' +
        ' onmousedown="_hueDrag(event)" onmousemove="event.buttons&&_hueDrag(event)" onmouseup="_hueCommit(event)">';
    html += '<div id="hue-thumb" style="position:absolute;top:50%;transform:translate(-50%,-50%);width:26px;height:26px;border-radius:50%;border:3px solid white;background:#' + _savedAccent + ';left:' + _pct + '%;box-shadow:0 1px 4px rgba(0,0,0,.5);pointer-events:none"></div>';
    html += '</div>';
    html += '</div>';

    return html;
}

// ══════════════════════════════════════════════════════════
// ТРЕНИРОВКА
// ══════════════════════════════════════════════════════════
function _settingsWorkout() {
    const tglRow = (key, label, hint, customFn, isLast) => {
        const on = State.settings[key];
        const fn = customFn || ('State.settings[\'' + key + '\']=!' + on + ';App.render()');
        return '<div onclick="' + fn + '" style="display:flex;align-items:center;gap:12px;padding:12px 0;' + (isLast ? '' : 'border-bottom:1px solid var(--br);') + 'cursor:pointer">' +
            '<div style="flex:1"><div style="font-size:13px;font-weight:500;color:' + (on ? 'var(--tx2)' : 'var(--mt)') + ';margin-bottom:1px">' + label + '</div>' +
            '<div style="font-size:10px;color:var(--sb)">' + hint + '</div></div>' +
            '<div style="width:38px;height:22px;border-radius:11px;background:' + (on ? 'var(--ac)' : 'var(--br2)') + ';position:relative;flex-shrink:0;transition:background .2s">' +
            '<div style="width:18px;height:18px;border-radius:50%;background:white;position:absolute;top:2px;left:' + (on ? '18px' : '2px') + ';transition:left .15s"></div>' +
            '</div></div>';
    };

    const isLb = State.settings.unit === 'lb';
    const simpleOn = State.settings.simpleMode;

    let html = _settingsBack('ПАРАМЕТРЫ');
    html += '<div class="ttl" style="font-size:24px;margin-bottom:20px">Тренировка</div>';

    html += '<div style="background:var(--sf);border:1px solid var(--br);border-radius:14px;padding:0 14px;margin-bottom:20px">';

    // Units row
    html += '<div style="display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid var(--br)">';
    html += '<div style="flex:1"><div style="font-size:13px;font-weight:500;color:var(--tx2);margin-bottom:1px">Единицы веса</div>';
    html += '<div style="font-size:10px;color:var(--sb)">Килограммы или фунты</div></div>';
    html += '<div style="display:flex;gap:4px">';
    html += '<button onclick="saveUnit(\'kg\');App.render()" style="padding:5px 12px;border-radius:8px;border:1px solid ' + (!isLb ? 'var(--ac)' : 'var(--br)') + ';background:' + (!isLb ? 'var(--ac12)' : 'transparent') + ';color:' + (!isLb ? 'var(--ac)' : 'var(--sb)') + ';font-size:11px;font-weight:700;cursor:pointer;font-family:inherit">кг</button>';
    html += '<button onclick="saveUnit(\'lb\');App.render()" style="padding:5px 12px;border-radius:8px;border:1px solid ' + (isLb ? 'var(--ac)' : 'var(--br)') + ';background:' + (isLb ? 'var(--ac12)' : 'transparent') + ';color:' + (isLb ? 'var(--ac)' : 'var(--sb)') + ';font-size:11px;font-weight:700;cursor:pointer;font-family:inherit">lb</button>';
    html += '</div></div>';

    html += tglRow('timer', 'Таймер отдыха',        'Показывать таймер между подходами', null, false);
    html += tglRow('rpe',   'RPE / Усилие',         'Оценка нагрузки в каждом подходе',  null, false);
    html += tglRow('tempo', 'Темп выполнения',      'Выбор темпа: негатив, пауза и т.д.', null, false);
    html += tglRow('hints', 'Подсказки по технике', 'Советы под каждым упражнением',     null, false);

    // Simple mode — last row, no border
    html += '<div onclick="toggleSimpleMode()" style="display:flex;align-items:center;gap:12px;padding:12px 0;cursor:pointer">' +
        '<div style="flex:1"><div style="font-size:13px;font-weight:500;color:' + (simpleOn ? 'var(--tx2)' : 'var(--mt)') + ';margin-bottom:1px">Только вес · повторы</div>' +
        '<div style="font-size:10px;color:var(--sb)">Убирает типы подходов и RPE</div></div>' +
        '<div style="width:38px;height:22px;border-radius:11px;background:' + (simpleOn ? 'var(--ac)' : 'var(--br2)') + ';position:relative;flex-shrink:0;transition:background .2s">' +
        '<div style="width:18px;height:18px;border-radius:50%;background:white;position:absolute;top:2px;left:' + (simpleOn ? '18px' : '2px') + ';transition:left .15s"></div>' +
        '</div></div>';

    html += '</div>';
    return html;
}

// ══════════════════════════════════════════════════════════
// АККАУНТ
// ══════════════════════════════════════════════════════════
function _settingsAccount() {
    const au = State.auth;
    let html = _settingsBack('СИНХРОНИЗАЦИЯ');
    html += '<div class="ttl" style="font-size:24px;margin-bottom:20px">Аккаунт</div>';

    html += '<div style="background:var(--sf);border:1px solid var(--br);border-radius:14px;padding:0 14px;margin-bottom:16px">';
    if (au.status === 'authed' && au.user) {
        const AVATARS = ['💪','🔥','👑','⚡','🏆'];
        const prof    = au.profile;
        const ava     = AVATARS[prof ? (prof.avatar_idx || 0) : 0];
        const nick    = prof ? prof.nickname : (au.user.email || '');
        html += '<div style="display:flex;align-items:center;gap:12px;padding:14px 0;border-bottom:1px solid var(--br)">';
        html += '<div style="width:44px;height:44px;border-radius:50%;background:var(--ac15);border:2px solid var(--ac30);display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0">' + ava + '</div>';
        html += '<div style="flex:1;min-width:0">';
        html += '<div style="font-size:15px;font-weight:700;color:var(--tx);margin-bottom:2px;letter-spacing:.3px">' + nick + '</div>';
        html += '<div style="font-size:10px;color:var(--ac);letter-spacing:1px">ОБЛАКО АКТИВНО ☁️</div>';
        if (au.user.email) html += '<div style="font-size:10px;color:var(--sb);margin-top:1px">' + au.user.email + '</div>';
        html += '</div></div>';
        html += '<div style="padding:12px 0;display:flex;align-items:center;justify-content:space-between">';
        html += '<div style="font-size:13px;font-weight:500;color:var(--mt)">Выйти из аккаунта</div>';
        html += '<button onclick="AuthActions.signOut()" style="background:transparent;border:1px solid var(--br);border-radius:8px;color:var(--sb);font-size:11px;padding:5px 12px;cursor:pointer;font-family:inherit">Выйти</button>';
        html += '</div>';
    } else if (au.status === 'guest') {
        html += '<div style="padding:14px 0">';
        html += '<div style="font-size:13px;font-weight:500;color:var(--tx2);margin-bottom:4px">Гостевой режим</div>';
        html += '<div style="font-size:10px;color:var(--sb);margin-bottom:12px">Данные хранятся только на этом устройстве</div>';
        html += '<button onclick="State.auth.showScreen=true;State.auth.status=\'unauthed\';localStorage.removeItem(\'sb_guest\');State.auth.error=\'\';App.render()" style="width:100%;padding:11px;border-radius:10px;border:none;cursor:pointer;font-family:inherit;font-size:13px;font-weight:700;background:var(--gradient-primary);color:var(--btn-main-color)">Войти / Зарегистрироваться</button>';
        html += '</div>';
    } else {
        html += '<div style="padding:14px 0">';
        html += '<div style="font-size:13px;font-weight:500;color:var(--tx2);margin-bottom:4px">Облачная синхронизация</div>';
        html += '<div style="font-size:10px;color:var(--sb);margin-bottom:12px">Сохраняй историю тренировок на всех устройствах</div>';
        html += '<button onclick="State.auth.showScreen=true;State.auth.error=\'\';App.render()" style="width:100%;padding:11px;border-radius:10px;border:none;cursor:pointer;font-family:inherit;font-size:13px;font-weight:700;background:var(--gradient-primary);color:var(--btn-main-color)">Войти / Зарегистрироваться</button>';
        html += '</div>';
    }
    html += '</div>';

    // Danger zone
    html += '<div style="background:rgba(180,40,40,.05);border:1px solid rgba(180,40,40,.18);border-radius:14px;padding:0 14px;margin-bottom:20px">';
    html += '<div style="font-size:9px;color:#b44040;letter-spacing:2px;padding:10px 0 6px">ОПАСНАЯ ЗОНА</div>';

    html += '<div style="display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-top:1px solid rgba(180,40,40,.12)">';
    html += '<div><div style="font-size:13px;font-weight:500;color:#d06060;margin-bottom:1px">Очистить данные</div>';
    html += '<div style="font-size:10px;color:#8a5555">Удаляет тренировки и прогресс, аккаунт остаётся</div></div>';
    html += '<button onclick="State.modal={type:\'confirmClear\'};App.renderModal()" style="background:transparent;border:1px solid rgba(180,40,40,.3);border-radius:8px;color:#d06060;font-size:11px;padding:5px 10px;cursor:pointer;font-family:inherit;white-space:nowrap;flex-shrink:0;margin-left:10px">Очистить</button>';
    html += '</div>';

    html += '<div style="display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-top:1px solid rgba(180,40,40,.12)">';
    html += '<div><div style="font-size:13px;font-weight:500;color:#e05050;margin-bottom:1px">Удалить аккаунт</div>';
    html += '<div style="font-size:10px;color:#8a5555">Удаляет всё без возможности восстановления</div></div>';
    html += '<button onclick="State.modal={type:\'confirmDelete\'};App.renderModal()" style="background:rgba(180,40,40,.15);border:1px solid rgba(180,40,40,.4);border-radius:8px;color:#e05050;font-size:11px;padding:5px 10px;cursor:pointer;font-family:inherit;white-space:nowrap;flex-shrink:0;margin-left:10px">Удалить</button>';
    html += '</div>';
    html += '</div>';

    return html;
}

// ══════════════════════════════════════════════════════════
// ПОМОЩЬ
// ══════════════════════════════════════════════════════════
function _settingsHelp() {
    let html = _settingsBack('ИНФОРМАЦИЯ');
    html += '<div class="ttl" style="font-size:24px;margin-bottom:20px">Помощь</div>';

    html += '<div style="background:var(--sf);border:1px solid var(--br);border-radius:14px;padding:0 14px;margin-bottom:20px">';

    html += '<div style="display:flex;align-items:center;justify-content:space-between;padding:12px 0;border-bottom:1px solid var(--br);cursor:pointer">';
    html += '<div style="font-size:13px;font-weight:500;color:var(--tx2)">Как пользоваться</div>';
    html += '<span style="color:var(--mt);font-size:18px">›</span>';
    html += '</div>';

    html += '<div style="display:flex;align-items:center;justify-content:space-between;padding:12px 0;border-bottom:1px solid var(--br);cursor:pointer">';
    html += '<div style="font-size:13px;font-weight:500;color:var(--tx2)">Связаться с нами</div>';
    html += '<span style="color:var(--mt);font-size:18px">›</span>';
    html += '</div>';

    html += '<div style="display:flex;align-items:center;justify-content:space-between;padding:12px 0">';
    html += '<div style="font-size:13px;font-weight:500;color:var(--mt)">Версия</div>';
    html += '<div style="font-size:12px;color:var(--mt);font-family:monospace">1.0.0</div>';
    html += '</div>';

    html += '</div>';
    return html;
}
