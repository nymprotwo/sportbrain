// ═══ SCREEN: PROGRAMS ═══

Screens.programDetail = function() {
    const nav = State.programNav;
    const p   = PROGRAMS.find(pr => pr.id === nav.programId);
    if (!p) return '<div style="padding:40px 20px;text-align:center;color:var(--sb)">Программа не найдена</div>';

    const structure = PROGRAM_STRUCTURE[p.id];
    const ap        = getActiveProgram();
    const isActive  = ap && ap.programId === p.id;
    const levelColor = {новичок:'#6ac882', средний:'#6aaae0', продвинутый:'#c084fc'}[p.level] || '#7E8088';

    let html = '';

    // ── Заголовок ─────────────────────────────
    html += '<div style="display:flex;align-items:center;gap:12px;margin-bottom:20px">';
    html += '<button class="btn btn-ghost" onclick="State.programNav.active=false;State.programNav.weekIdx=null;State.programNav.dayIdx=null;App.render()">‹</button>';
    html += '<div style="flex:1;min-width:0">';
    html += '<span class="lbl">ПРОГРАММА</span>';
    html += '<div class="ttl" style="font-size:22px;line-height:1.1">' + p.name + '</div>';
    html += '</div>';
    html += '</div>';

    // ── Карточка-шапка ─────────────────────────
    html += '<div style="background:var(--sf);border:1px solid var(--ac25);border-radius:14px;padding:16px;margin-bottom:16px">';
    html += '<div style="font-size:11px;color:var(--sb);margin-bottom:10px">' + p.author + '</div>';
    html += '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:12px">';
    [['ДНИ/НЕД', p.days], ['НЕДЕЛЬ', p.weeks], ['УРОВЕНЬ', p.level]].forEach(([l, v]) => {
      html += '<div style="background:#111;border-radius:10px;padding:10px;text-align:center">';
      html += '<div style="font-size:8px;letter-spacing:1px;color:var(--sb);margin-bottom:4px">' + l + '</div>';
      html += '<div style="font-size:13px;font-weight:700;color:var(--tx2)">' + v + '</div>';
      html += '</div>';
    });
    html += '</div>';
    html += '<div style="display:flex;gap:6px;margin-bottom:10px">';
    html += '<span style="font-size:9px;font-weight:600;color:var(--ac);background:var(--ac10);border:1px solid var(--ac25);border-radius:5px;padding:2px 8px">' + p.goal.toUpperCase() + '</span>';
    html += '<span style="font-size:9px;font-weight:600;color:' + levelColor + ';background:' + levelColor + '18;border:1px solid ' + levelColor + '40;border-radius:5px;padding:2px 8px">' + p.level + '</span>';
    html += '</div>';
    html += '<div style="font-size:11px;color:var(--sb);line-height:1.6;margin-bottom:10px">' + p.focus + '</div>';
    html += '<div style="display:flex;gap:6px;flex-wrap:wrap">';
    p.results.forEach(r => {
      html += '<span style="font-size:10px;color:#9EAA8C;background:rgba(158,170,140,.08);border:1px solid rgba(158,170,140,.2);border-radius:6px;padding:2px 8px">✓ ' + r + '</span>';
    });
    html += '</div>';
    html += '</div>';

    // ── Кнопка старта / статус ─────────────────
    if (isActive) {
      const apWeek = structure ? structure[ap.weekIdx] : null;
      const apDay  = apWeek ? apWeek.days[ap.dayIdx] : null;
      html += '<div style="background:var(--ac08);border:1px solid var(--ac30);border-radius:14px;padding:14px 16px;margin-bottom:16px;display:flex;align-items:center;justify-content:space-between">';
      html += '<div>';
      html += '<div style="font-size:9px;color:var(--ac70);letter-spacing:2px;margin-bottom:4px">СЛЕДУЮЩАЯ ТРЕНИРОВКА</div>';
      html += '<div style="font-size:13px;font-weight:700;color:var(--tx2)">' + (apWeek ? apWeek.label : '') + '</div>';
      html += '<div style="font-size:11px;color:var(--sb)">' + (apDay ? apDay.label : '') + '</div>';
      html += '</div>';
      html += '<div style="display:flex;flex-direction:column;gap:6px;align-items:flex-end">';
      html += '<button onclick="App.nav(\'workout\');Diary.startProgramWorkout(' + ap.weekIdx + ',' + ap.dayIdx + ',' + ap.programId + ')" style="background:var(--gradient-primary);border:none;border-radius:9px;padding:9px 16px;cursor:pointer;font-family:\'Bebas Neue\',sans-serif;font-size:15px;letter-spacing:1.5px;color:var(--btn-main-color)">▶ ТРЕНИРОВАТЬСЯ</button>';
      html += '<button onclick="if(confirm(\'Сбросить прогресс программы?\'))clearActiveProgram();App.render()" style="background:none;border:none;color:rgba(192,57,43,.6);font-size:10px;cursor:pointer;font-family:inherit">сбросить</button>';
      html += '</div>';
      html += '</div>';
    } else {
      html += '<button onclick="setActiveProgram({programId:' + p.id + ',weekIdx:0,dayIdx:0});App.render()" style="width:100%;background:var(--gradient-primary);border:none;border-radius:14px;padding:16px;cursor:pointer;font-family:\'Bebas Neue\',sans-serif;font-size:20px;letter-spacing:2px;color:var(--btn-main-color);display:flex;align-items:center;justify-content:center;gap:10px;margin-bottom:16px;box-shadow:0 4px 20px var(--ac20)">';
      html += '<svg width="20" height="20" viewBox="0 0 24 24" fill="#1a1410"><polygon points="5 3 19 12 5 21 5 3"/></svg>';
      html += 'НАЧАТЬ ПРОГРАММУ</button>';
    }

    // ── Список недель ──────────────────────────
    if (!structure) {
      html += '<div style="text-align:center;padding:20px;color:var(--sb);font-size:12px">Структура недель в разработке</div>';
      return html;
    }

    html += '<span class="lbl">ПЛАН ПО НЕДЕЛЯМ</span>';
    structure.forEach((week, wi) => {
      const isCurrent = isActive && ap.weekIdx === wi;
      const isPast    = isActive && ap.weekIdx > wi;
      const brd = isCurrent ? 'var(--ac50)' : (isPast ? 'rgba(106,200,130,.3)' : 'var(--br)');
      const bg  = isCurrent ? 'var(--ac06)' : 'var(--sf)';
      const expanded = nav.weekIdx === wi;

      html += '<div style="background:' + bg + ';border:1px solid ' + brd + ';border-radius:12px;margin-bottom:6px;overflow:hidden">';
      html += '<button onclick="State.programNav.weekIdx=(State.programNav.weekIdx===' + wi + '?null:' + wi + ');App.render()" style="width:100%;background:none;border:none;padding:12px 14px;cursor:pointer;font-family:inherit;display:flex;align-items:center;justify-content:space-between;text-align:left">';
      html += '<div>';
      html += '<div style="font-size:12px;font-weight:700;color:' + (isCurrent ? 'var(--ac)' : isPast ? '#6ac882' : 'var(--tx2)') + '">' + week.label + '</div>';
      html += '<div style="font-size:10px;color:var(--sb);margin-top:2px">' + week.days.length + ' тренировки</div>';
      html += '</div>';
      html += '<div style="display:flex;align-items:center;gap:8px">';
      if (isCurrent) html += '<span style="font-size:8px;color:var(--ac);background:var(--ac10);border:1px solid var(--ac30);border-radius:4px;padding:2px 7px;letter-spacing:1px">СЕЙЧАС</span>';
      if (isPast)    html += '<span style="font-size:8px;color:#6ac882;background:rgba(106,200,130,.1);border:1px solid rgba(106,200,130,.3);border-radius:4px;padding:2px 7px;letter-spacing:1px">✓</span>';
      html += '<span style="color:var(--mt);font-size:16px">' + (expanded ? '∧' : '∨') + '</span>';
      html += '</div>';
      html += '</button>';

      if (expanded) {
        html += '<div style="padding:0 14px 12px">';
        week.days.forEach((day, di) => {
          const isDayActive = isCurrent && isActive && ap.dayIdx === di;
          const isDayPast   = isCurrent && isActive && ap.dayIdx > di;
          html += '<div style="background:' + (isDayActive ? 'var(--ac08)' : '#111') + ';border:1px solid ' + (isDayActive ? 'var(--ac30)' : isDayPast ? 'rgba(106,200,130,.2)' : 'var(--br)') + ';border-radius:10px;padding:10px 12px;margin-bottom:6px">';
          html += '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:7px">';
          html += '<div style="font-size:11px;font-weight:700;color:' + (isDayActive ? 'var(--ac)' : isDayPast ? '#6ac882' : 'var(--tx)') + '">' + day.label + '</div>';
          if (isDayPast) html += '<span style="font-size:9px;color:#6ac882">✓ выполнено</span>';
          if (isDayActive) html += '<button onclick="App.nav(\'workout\');Diary.startProgramWorkout(' + wi + ',' + di + ',' + p.id + ')" style="background:var(--gradient-primary);border:none;border-radius:7px;padding:5px 12px;cursor:pointer;font-family:inherit;font-size:10px;font-weight:700;color:var(--btn-main-color)">▶ Начать</button>';
          html += '</div>';
          // Упражнения дня
          day.exercises.forEach(ex => {
            const setsStr = ex.sets.map(s => {
              const pctPart = s.pct ? s.pct + '%' : 'ОВ';
              const repPart = s.reps + ' повт';
              const notePart = s.note ? ' · ' + s.note : '';
              return pctPart + ' × ' + repPart + notePart;
            }).join(', ');
            html += '<div style="display:flex;align-items:flex-start;gap:8px;margin-bottom:4px">';
            html += '<span style="font-size:10px;color:var(--ac);min-width:4px">·</span>';
            html += '<div style="flex:1">';
            html += '<span style="font-size:11px;color:var(--tx2);font-weight:600">' + ex.name + '</span>';
            html += '<div style="font-size:9px;color:var(--sb);margin-top:1px;line-height:1.5">' + setsStr + '</div>';
            html += '</div></div>';
          });
          html += '</div>';
        });
        html += '</div>';
      }

      html += '</div>';
    });

    return html;
};

Screens.programs = function() {
    const fd = State.filterDays, fg = State.filterGoal;
    const filtered = PROGRAMS.filter(p => (!fd || p.days === fd) && (!fg || p.goal.includes(fg)));

    let html = '<span class="lbl">БАЗА ЗНАНИЙ</span>';
    html += '<div class="ttl" style="margin-bottom:16px">Программы</div>';

    html += '<span class="lbl">ЦЕЛЬ</span>';
    html += '<div style="display:flex;gap:7px;margin-bottom:14px">';
    [null,'сила','масса'].forEach(g => {
      const on = fg === g;
      html += '<button class="btn" style="flex:1;padding:7px 0;border-radius:9px;border:1px solid ' + (on?'var(--ac)':'var(--br)') + ';background:' + (on?'var(--ad)':'var(--sf)') + ';color:' + (on?'var(--ac)':'var(--mt)') + '" onclick="State.filterGoal=' + (g===null?'null':"'"+g+"'") + ';App.render()">' + (g ?? 'Все') + '</button>';
    });
    html += '</div>';

    html += '<span class="lbl">ДНИ В НЕДЕЛЮ</span>';
    html += '<div style="display:flex;gap:7px;margin-bottom:18px">';
    [null,3,4,5,6].forEach(d => {
      const on = fd === d;
      html += '<button class="btn" style="flex:1;padding:7px 0;border-radius:9px;border:1px solid ' + (on?'var(--ac)':'var(--br)') + ';background:' + (on?'var(--ad)':'var(--sf)') + ';color:' + (on?'var(--ac)':'var(--mt)') + '" onclick="State.filterDays=' + (d===null?'null':d) + ';App.render()">' + (d ?? 'Все') + '</button>';
    });
    html += '</div>';

    filtered.forEach(p => {
      const levelColor = {новичок:'#6ac882', средний:'#6aaae0', продвинутый:'#c084fc'}[p.level] || '#7E8088';
      html += '<button onclick="State.modal={type:\'program\',data:window._prog' + p.id + '};App.renderModal()" style="width:100%;background:var(--sf);border:1px solid var(--ac30);border-radius:14px;padding:14px 16px;cursor:pointer;text-align:left;font-family:inherit;margin-bottom:8px;active:opacity:.8;transition:border-color .15s" onpointerdown="this.style.borderColor=\'var(--ac70)\'" onpointerup="this.style.borderColor=\'var(--ac30)\'" onpointerleave="this.style.borderColor=\'var(--ac30)\'">';

      // Верхняя часть: название + блок статов
      html += '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px;margin-bottom:6px">';

      // Левая: название + автор
      html += '<div style="flex:1;min-width:0">';
      html += '<div style="font-size:16px;font-weight:700;color:var(--ac);line-height:1.2;margin-bottom:3px">' + p.name + '</div>';
      html += '<div style="font-size:10px;font-weight:700;color:var(--tx2)">' + p.author + '</div>';
      html += '</div>';

      // Правая: дни + недели
      html += '<div style="text-align:right;flex-shrink:0">';
      html += '<div style="font-size:14px;font-weight:700;color:var(--tx2);line-height:1.1">' + p.days + ' <span style="font-size:9px;font-weight:400;color:var(--sb)">дн/нед</span></div>';
      html += '<div style="font-size:14px;font-weight:700;color:var(--tx2);line-height:1.1">' + p.weeks + ' <span style="font-size:9px;font-weight:400;color:var(--sb)">нед</span></div>';
      html += '</div>';

      html += '</div>';

      // Бейджи: цель + уровень
      html += '<div style="display:flex;gap:6px;margin-bottom:8px">';
      html += '<span style="font-size:9px;font-weight:600;color:var(--ac);background:var(--ac10);border:1px solid var(--ac25);border-radius:5px;padding:2px 8px;letter-spacing:.5px">' + p.goal.toUpperCase() + '</span>';
      html += '<span style="font-size:9px;font-weight:600;color:' + levelColor + ';background:' + levelColor + '18;border:1px solid ' + levelColor + '40;border-radius:5px;padding:2px 8px">' + p.level + '</span>';
      html += '</div>';

      // Фокус
      html += '<div style="font-size:11px;color:#7E8088;line-height:1.5;margin-bottom:8px">' + p.focus + '</div>';

      // Результаты
      html += '<div style="display:flex;gap:6px;flex-wrap:wrap">';
      p.results.forEach(r => {
        html += '<span style="font-size:10px;color:#9EAA8C;background:rgba(158,170,140,.08);border:1px solid rgba(158,170,140,.2);border-radius:6px;padding:2px 8px">✓ ' + r + '</span>';
      });
      html += '</div>';

      // Стрелка
      html += '<div style="text-align:right;margin-top:8px"><span style="font-size:13px;color:var(--ac50)">подробнее ›</span></div>';

      html += '</button>';
    });

    html += '<div style="background:#1a1614;border:1px solid rgba(184,92,56,.2);border-radius:12px;padding:14px 16px;margin-top:4px">';
    html += '<span class="lbl" style="color:var(--or)">⚡ ТЕСТ СИЛЫ</span>';
    html += '<div style="font-size:13px;font-weight:700;margin-bottom:4px">Раз в месяц — 1RM</div>';
    html += '<div style="font-size:11px;color:var(--sb);line-height:1.6">Встроен в каждый цикл. ИИ сравнивает и корректирует нагрузку.</div></div>';
    return html;
};

