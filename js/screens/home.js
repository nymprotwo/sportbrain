// ═══ SCREEN: HOME (ГАРАЖ) ═══

Screens.home = function() {
    if (State.achView) return Screens.achievementsAll();

    const workouts = getWorkouts();
    const goals    = State.goals || [];
    const ap       = getActiveProgram();
    const apProg   = ap ? PROGRAMS.find(p => p.id === ap.programId) : null;
    const apStr    = ap ? PROGRAM_STRUCTURE[ap.programId] : null;
    const apWeek   = apStr ? apStr[ap.weekIdx] : null;
    const apDay    = apWeek ? apWeek.days[ap.dayIdx] : null;

    // Achievements
    const allAchs  = evaluateAchievements(workouts);
    const homeAchs = selectHomeAchs(allAchs);

    let html = '';

    // ════════════════════════════════════════
    // BLOCK 0 — ПРОФИЛЬ
    // ════════════════════════════════════════
    {
        const AVATARS = ['💪','🔥','👑','⚡','🏆'];
        const au      = State.auth;
        const prof    = au.profile;
        const ava     = AVATARS[prof ? (prof.avatar_idx || 0) : 0];
        const nick    = prof ? prof.nickname : (au.status === 'guest' ? 'Гость' : '');
        const isCloud = au.status === 'authed';
        const totalW  = workouts.length;
        const unlockedAchs = homeAchs.filter(a => a.unlocked);

        html += '<div style="background:var(--sf);border:1px solid var(--br);border-radius:16px;padding:14px 16px;margin-bottom:24px;display:flex;align-items:center;gap:14px">';

        // Avatar
        html += '<div style="width:52px;height:52px;border-radius:50%;background:var(--ac15);border:2px solid var(--ac30);display:flex;align-items:center;justify-content:center;font-size:26px;flex-shrink:0">' + ava + '</div>';

        // Info
        html += '<div style="flex:1;min-width:0">';
        if (nick) {
            html += '<div style="font-size:18px;font-weight:800;color:var(--tx2);letter-spacing:.3px;margin-bottom:3px">' + nick + '</div>';
        }
        const wLabel = totalW === 1 ? 'тренировка' : totalW < 5 ? 'тренировки' : 'тренировок';
        html += '<div style="font-size:10px;color:var(--sb)">' + totalW + ' ' + wLabel + (isCloud ? ' · ☁️' : '') + '</div>';

        // Achievement badges inline
        if (unlockedAchs.length > 0) {
            html += '<div style="display:flex;gap:5px;margin-top:8px;flex-wrap:wrap">';
            unlockedAchs.forEach(a => {
                html += '<div title="' + a.title + '" style="width:28px;height:28px;border-radius:8px;background:var(--ac12);border:1px solid var(--ac25);display:flex;align-items:center;justify-content:center;font-size:14px">' + a.icon + '</div>';
            });
            html += '</div>';
        }

        html += '</div>';
        html += '</div>';
    }

    // ════════════════════════════════════════
    // BLOCK 1 — ЦЕЛИ
    // ════════════════════════════════════════
    html += '<div style="margin-bottom:24px">';
    html += '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">';
    html += '<span class="lbl">ЦЕЛИ</span>';
    if (goals.length > 0) {
        html += '<button onclick="State.goalForm={name:\'\',current:0,target:0,weeklyGain:2.5,unit:\'кг\'};State.modal={type:\'goalAdd\',data:null};App.renderModal()" style="background:transparent;border:none;color:var(--ac);font-size:11px;font-weight:700;letter-spacing:.5px;cursor:pointer;font-family:inherit;padding:4px 0">+ ДОБАВИТЬ</button>';
    }
    html += '</div>';

    if (goals.length === 0) {
        // Compact empty state
        html += '<div style="background:var(--sf);border:1px solid var(--br);border-radius:14px;padding:14px 16px;display:flex;align-items:center;justify-content:space-between;gap:12px">';
        html += '<div>';
        html += '<div style="font-size:12px;font-weight:600;color:var(--tx2);margin-bottom:2px">Нет целей</div>';
        html += '<div style="font-size:10px;color:var(--sb)">Добавь цель — получишь план</div>';
        html += '</div>';
        html += '<button onclick="State.goalForm={name:\'\',current:0,target:0,weeklyGain:2.5,unit:\'кг\'};State.modal={type:\'goalAdd\',data:null};App.renderModal()" style="background:var(--gradient-primary);border:none;border-radius:9px;padding:8px 16px;color:var(--btn-main-color);font-size:11px;font-weight:700;letter-spacing:.3px;cursor:pointer;font-family:inherit;flex-shrink:0">Добавить</button>';
        html += '</div>';
    } else {
        goals.forEach((g, gi) => {
            const pct       = Math.min(100, Math.round(g.current / g.target * 100));
            const remaining = g.target - g.current;
            const wGain     = g.weeklyGain || 2.5;
            const weeksLeft = wGain > 0 && remaining > 0 ? Math.ceil(remaining / wGain) : null;
            const done      = g.current >= g.target;
            const unit      = g.unit || 'кг';

            html += '<div onclick="State.goalForm={name:\'' + g.name.replace(/\'/g, "\\'") + '\',current:' + g.current + ',target:' + g.target + ',weeklyGain:' + wGain + ',unit:\'' + unit + '\'};State.modal={type:\'goalAdd\',data:{goalIdx:' + gi + '}};App.renderModal()" style="background:var(--sf);border:1px solid ' + (done ? 'rgba(100,200,100,.4)' : 'var(--br)') + ';border-radius:14px;padding:14px 16px;margin-bottom:8px;cursor:pointer">';
            html += '<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px">';
            html += '<div style="flex:1;min-width:0;padding-right:12px">';
            html += '<div style="font-size:13px;font-weight:700;color:var(--tx2);margin-bottom:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + g.name + '</div>';
            html += '<div style="font-size:11px;color:var(--sb)">' + g.current + ' → ' + g.target + ' ' + unit + '</div>';
            html += '</div>';
            html += '<div style="text-align:right;flex-shrink:0">';
            if (done) {
                html += '<div style="font-size:11px;font-weight:700;color:var(--color-success)">✓ Выполнено</div>';
            } else {
                html += '<div style="font-size:20px;font-weight:700;color:var(--ac);line-height:1">' + pct + '%</div>';
                if (weeksLeft) html += '<div style="font-size:9px;color:var(--sb);margin-top:2px">~' + weeksLeft + ' нед</div>';
            }
            html += '</div></div>';
            html += '<div style="height:4px;background:var(--s2);border-radius:2px;overflow:hidden;margin-bottom:6px">';
            html += '<div style="height:100%;width:' + pct + '%;background:' + (done ? '#5ac870' : 'var(--gradient-primary)') + ';border-radius:2px"></div>';
            html += '</div>';
            if (!done && wGain > 0) {
                html += '<div style="font-size:9px;color:var(--sb)">+' + wGain + ' ' + unit + '/нед</div>';
            }
            html += '</div>';
        });
    }
    html += '</div>';

    // ════════════════════════════════════════
    // BLOCK 2 — РЕКОМЕНДАЦИИ
    // ════════════════════════════════════════
    {
        const lastW = workouts[0] || null;
        const recs  = [];

        if (lastW) {
            lastW.exercises.forEach(ex => {
                if (recs.length >= 3) return;
                const ws = ex.sets.filter(s => s.type === 'work');
                if (!ws.length) return;
                const last = ws[ws.length - 1];
                const w = last.weight || 0, r = last.reps || 0;
                if (!w || !r) return;

                let icon, text;
                if (r >= 9)      { icon = '📈'; text = ex.name + ': ' + w + '×' + r + ' → попробуй ' + (w + 2.5) + '×' + Math.max(6, r - 2); }
                else if (r >= 7) { icon = '↗';  text = ex.name + ': ' + w + '×' + r + ' → добавь повтор до ' + (r + 1); }
                else if (r <= 4) { icon = '📊'; text = ex.name + ': держи вес, добавляй повторы'; }
                else             { icon = '✓';  text = ex.name + ': стабильно — продолжай прогрессировать'; }
                recs.push({ icon, text });
            });
        }

        html += '<div style="margin-bottom:24px">';
        html += '<span class="lbl" style="margin-bottom:10px;display:block">РЕКОМЕНДАЦИИ</span>';
        if (!lastW || recs.length === 0) {
            html += '<div style="background:var(--sf);border:1px solid var(--br);border-radius:14px;padding:14px 16px;display:flex;align-items:center;gap:10px">';
            html += '<span style="font-size:16px;opacity:.5">💡</span>';
            html += '<div style="font-size:11px;color:var(--sb)">Завершите тренировку — получите рекомендации</div>';
            html += '</div>';
        } else {
            html += '<div style="background:var(--sf);border:1px solid var(--br);border-radius:14px;overflow:hidden">';
            recs.forEach((rec, ri) => {
                const bTop = ri > 0 ? 'border-top:1px solid var(--br);' : '';
                html += '<div style="' + bTop + 'padding:11px 14px;display:flex;align-items:flex-start;gap:10px">';
                html += '<span style="font-size:15px;flex-shrink:0;margin-top:1px">' + rec.icon + '</span>';
                html += '<div style="font-size:12px;color:var(--tx);line-height:1.5">' + rec.text + '</div>';
                html += '</div>';
            });
            html += '</div>';
        }
        html += '</div>';
    }

    // ════════════════════════════════════════
    // BLOCK 3 — ДОСТИЖЕНИЯ (row of 5 icons)
    // ════════════════════════════════════════
    html += '<div style="margin-bottom:24px">';
    html += '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">';
    html += '<span class="lbl">ДОСТИЖЕНИЯ</span>';
    html += '<button onclick="State.achView=true;App.render()" style="background:transparent;border:none;color:var(--ac);font-size:11px;font-weight:700;letter-spacing:.5px;cursor:pointer;font-family:inherit;padding:4px 0">Все ›</button>';
    html += '</div>';

    html += '<div style="background:var(--sf);border:1px solid var(--br);border-radius:14px;padding:14px 16px">';
    html += '<div style="display:flex;gap:8px">';
    homeAchs.forEach(a => {
        const escaped = a.id.replace(/'/g, "\\'");
        html += '<button onclick="State.modal={type:\'achDetail\',data:{achId:\'' + escaped + '\'}};App.renderModal()" style="flex:1;background:transparent;border:none;cursor:pointer;font-family:inherit;display:flex;flex-direction:column;align-items:center;gap:5px;padding:0">';
        html += '<div style="width:100%;aspect-ratio:1;border-radius:12px;background:' + (a.unlocked ? 'var(--ac15)' : 'var(--s2)') + ';border:1.5px solid ' + (a.isNew ? 'var(--ac)' : a.unlocked ? 'var(--ac30)' : 'var(--br)') + ';display:flex;align-items:center;justify-content:center;font-size:22px;position:relative">';
        html += a.unlocked ? a.icon : '<span style="font-size:16px;opacity:.35">🔒</span>';
        if (a.isNew) html += '<div style="position:absolute;top:-3px;right:-3px;width:8px;height:8px;border-radius:50%;background:var(--ac);border:1.5px solid var(--bg)"></div>';
        html += '</div>';
        html += '<span style="font-size:8px;color:' + (a.unlocked ? 'var(--tx2)' : 'var(--mt)') + ';text-align:center;line-height:1.25;width:100%;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">' + a.title + '</span>';
        html += '</button>';
    });
    html += '</div>';
    html += '</div>';
    html += '</div>';

    // ════════════════════════════════════════
    // BLOCK 4 — ОБУЧЕНИЕ + ТРЕНЕР (placeholders)
    // ════════════════════════════════════════
    html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:24px">';

    // Learning
    html += '<div style="background:var(--sf);border:1px solid var(--br);border-radius:14px;padding:14px;opacity:.55;display:flex;flex-direction:column;gap:8px">';
    html +=   '<div style="width:36px;height:36px;border-radius:10px;background:var(--ac10);border:1px solid var(--ac20);display:flex;align-items:center;justify-content:center">';
    html +=     '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--ac)" stroke-width="2" stroke-linecap="round"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>';
    html +=   '</div>';
    html +=   '<div><div style="font-size:12px;font-weight:700;color:var(--tx2)">Упражнения и техника</div>';
    html +=   '<div style="font-size:9px;color:var(--sb);margin-top:2px">Скоро</div></div>';
    html += '</div>';

    // Coach
    html += '<div style="background:var(--sf);border:1px solid var(--br);border-radius:14px;padding:14px;opacity:.55;display:flex;flex-direction:column;gap:8px">';
    html +=   '<div style="width:36px;height:36px;border-radius:10px;background:var(--ac10);border:1px solid var(--ac20);display:flex;align-items:center;justify-content:center">';
    html +=     '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--ac)" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>';
    html +=   '</div>';
    html +=   '<div><div style="font-size:12px;font-weight:700;color:var(--tx2)">Тренер</div>';
    html +=   '<div style="font-size:9px;color:var(--sb);margin-top:2px">Скоро</div></div>';
    html += '</div>';

    html += '</div>';

    // ════════════════════════════════════════
    // BLOCK 5 — АКТИВНАЯ ПРОГРАММА (if exists)
    // ════════════════════════════════════════
    if (apProg && apDay) {
        html += '<div style="margin-bottom:24px">';
        html += '<span class="lbl" style="margin-bottom:10px;display:block">АКТИВНАЯ ПРОГРАММА</span>';
        html += '<div style="background:var(--sf);border:1px solid var(--br);border-radius:14px;padding:14px 16px;display:flex;align-items:center;justify-content:space-between">';
        html +=   '<div><div style="font-size:13px;font-weight:700;color:var(--tx2);margin-bottom:2px">' + apProg.name + '</div>';
        html +=   '<div style="font-size:10px;color:var(--sb)">Нед ' + (ap.weekIdx + 1) + ' · День ' + (ap.dayIdx + 1) + '</div></div>';
        html +=   '<span style="font-size:20px;color:var(--sb)">›</span>';
        html += '</div></div>';
    }

    return html;
};

// ─── ACHIEVEMENTS ALL SCREEN ─────────────────────────────────
Screens.achievementsAll = function() {
    const workouts = getWorkouts();
    const all      = evaluateAchievements(workouts);
    if (!State.achCat) State.achCat = 'all';
    const cat = State.achCat;

    const unlocked = all.filter(a => a.unlocked).length;
    const total    = all.length;

    let html = '';

    // Header
    html += '<div style="display:flex;align-items:center;gap:12px;margin-bottom:4px">';
    html += '<button class="btn btn-ghost" onclick="State.achView=false;App.render()">‹</button>';
    html += '<div><span class="lbl">ГАРАЖ</span><div class="ttl" style="font-size:26px">Достижения</div></div>';
    html += '</div>';

    // Progress summary
    html += '<div style="display:flex;align-items:center;gap:10px;margin-bottom:16px">';
    html += '<div style="flex:1;height:5px;background:var(--s2);border-radius:3px;overflow:hidden">';
    html += '<div style="height:100%;width:' + Math.round(unlocked / total * 100) + '%;background:var(--gradient-primary);border-radius:3px"></div>';
    html += '</div>';
    html += '<span style="font-size:10px;color:var(--sb);flex-shrink:0">' + unlocked + ' / ' + total + '</span>';
    html += '</div>';

    // Category tabs (scrollable)
    const CATS = [{ id:'all', label:'ВСЕ' }, ...Object.entries(ACH_CATS).map(([id, label]) => ({ id, label }))];
    html += '<div style="display:flex;gap:5px;overflow-x:auto;padding-bottom:2px;margin-bottom:16px;scrollbar-width:none;-webkit-overflow-scrolling:touch">';
    CATS.forEach(c => {
        const on = cat === c.id;
        html += '<button onclick="State.achCat=\'' + c.id + '\';App.render()" style="flex-shrink:0;padding:5px 10px;border-radius:7px;border:1px solid ' + (on ? 'var(--ac)' : 'var(--br)') + ';background:' + (on ? 'var(--ad)' : 'transparent') + ';color:' + (on ? 'var(--ac)' : 'var(--sb)') + ';font-size:9px;font-weight:' + (on ? '700' : '400') + ';letter-spacing:.5px;cursor:pointer;font-family:inherit">' + c.label + '</button>';
    });
    html += '</div>';

    // ONE block — 3-column grid
    const visible = cat === 'all' ? all : all.filter(a => a.cat === cat);
    const sorted  = visible.slice().sort((a, b) => {
        if (a.isNew !== b.isNew)       return a.isNew ? -1 : 1;
        if (a.unlocked !== b.unlocked) return a.unlocked ? -1 : 1;
        return b.pct - a.pct;
    });

    html += '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--br);border:1px solid var(--br);border-radius:14px;overflow:hidden">';
    sorted.forEach(a => {
        const escaped = a.id.replace(/'/g, "\\'");
        const barPct  = Math.round(a.pct * 100);
        const lbl     = achProgressLabel(a);

        html += '<button onclick="State.modal={type:\'achDetail\',data:{achId:\'' + escaped + '\'}};App.renderModal()" style="background:var(--sf);border:none;cursor:pointer;font-family:inherit;padding:14px 8px;display:flex;flex-direction:column;align-items:center;gap:6px;opacity:' + (a.unlocked ? '1' : '.45') + ';position:relative">';

        // New dot
        if (a.isNew) html += '<div style="position:absolute;top:6px;right:6px;width:7px;height:7px;border-radius:50%;background:var(--ac)"></div>';

        // Icon
        html += '<div style="width:48px;height:48px;border-radius:12px;background:' + (a.unlocked ? 'var(--ac15)' : 'var(--s2)') + ';border:1px solid ' + (a.unlocked ? 'var(--ac30)' : 'transparent') + ';display:flex;align-items:center;justify-content:center;font-size:24px">';
        html += a.unlocked ? a.icon : '🔒';
        html += '</div>';

        // Title
        html += '<span style="font-size:9px;font-weight:600;color:' + (a.unlocked ? 'var(--tx2)' : 'var(--sb)') + ';text-align:center;line-height:1.3;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;width:100%">' + a.title + '</span>';

        // Progress bar (only if in progress, not binary)
        if (!a.unlocked && a.target > 1 && a.pct > 0) {
            html += '<div style="width:100%;height:2px;background:var(--s2);border-radius:1px;overflow:hidden">';
            html += '<div style="height:100%;width:' + barPct + '%;background:var(--ac);border-radius:1px"></div>';
            html += '</div>';
        }

        html += '</button>';
    });
    html += '</div>';

    return html;
};
