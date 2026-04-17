// ═══ SCREEN: WORKOUT BROWSE ═══

Screens.workout = function() {
    if (State.orm.active)                      return this.ormScreen();
    if (State.diary.stage === 'select')        return this.workoutSelect();
    if (State.diary.stage === 'plan')          return this.workoutPlan();
    if (State.diary.stage === 'build')         return this.workoutBuild();
    if (State.diary.stage === 'active')        return this.workoutActive();
    if (State.diary.stage === 'regress_check') return this.workoutRegressCheck();
    if (State.diary.stage === 'history')       return State.diary.historyDetailId ? this.workoutDetail() : this.workoutHistory();
    return this.workoutBrowse();
};

Screens.workoutBrowse = function() {
    const workouts   = getWorkouts();
    const last       = workouts[0] || null;
    // "Продолжить" только если активная тренировка уже в памяти (пользователь ушёл на другую вкладку)
    const hasOngoing = !!(State.diary.workout && State.diary.workout.length > 0);

    // 7-дневная активность
    const today   = new Date();
    const dayAbbr = ['вс','пн','вт','ср','чт','пт','сб'];
    const wDays   = [];
    const wDaySet = new Set(workouts.map(w => w.date ? w.date.slice(0,10) : ''));
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      wDays.push({ iso: d.toISOString().slice(0,10), label: dayAbbr[d.getDay()], isToday: i === 0 });
    }
    const wk7count = wDays.filter(d => wDaySet.has(d.iso)).length;

    // 1ПМ данные
    const orm1   = get1RM();
    const ormEx  = [{id:'bench',name:'Жим'},{id:'squat',name:'Присед'},{id:'deadlift',name:'Тяга'}];
    const ormHas = ormEx.filter(e => orm1[e.id]);

    // Активная программа
    const ap          = getActiveProgram();
    const apProg      = ap ? PROGRAMS.find(p => p.id === ap.programId) : null;
    const apStructure = ap ? PROGRAM_STRUCTURE[ap.programId] : null;
    const apWeek      = apStructure ? apStructure[ap.weekIdx] : null;
    const apDay       = apWeek ? apWeek.days[ap.dayIdx] : null;
    const hasProgram  = !!(apProg && apDay);

    // Стиль карточки
    const card = (w, h, extra) =>
      'background:var(--sf);border:1px solid var(--br);border-radius:16px;padding:14px;cursor:pointer;font-family:inherit;text-align:left;display:flex;flex-direction:column;gap:8px;' +
      (w ? 'width:100%;' : '') + (h ? 'min-height:' + h + 'px;' : '') + (extra || '');

    let html = '';

    // ── Заголовок (по центру) ─────────────────────
    html += '<div style="text-align:center;margin-top:12px;margin-bottom:28px">';
    html += '<div class="ttl" style="font-size:36px">Дневник</div>';
    html += '</div>';

    // ── Ряд 1: Программы (3fr) + 1ПМ (2fr) ───────
    html += '<div style="display:grid;grid-template-columns:3fr 2fr;gap:10px;margin-bottom:10px">';

    // [Программы] — главная карточка ряда
    const progLabel = hasProgram ? apProg.name : 'Нет активной';
    const progSub   = hasProgram ? (apWeek.label + ' · ' + apDay.label) : 'Выбрать программу';
    html += '<button onclick="State.tab=\'programs\';State.programNav={active:' + (hasProgram ? 'true' : 'false') + ',programId:' + (ap ? ap.programId : 'null') + ',weekIdx:' + (ap ? ap.weekIdx : 'null') + ',dayIdx:null};App.render()" style="' + card(true, 100) + '">';
    html += '<div style="display:flex;align-items:center;gap:10px">';
    html += '<div style="width:30px;height:30px;border-radius:8px;background:var(--ac10);border:1px solid var(--ac20);display:flex;align-items:center;justify-content:center;flex-shrink:0">';
    html += '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--ac)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="13" y2="17"/></svg>';
    html += '</div>';
    html += '<div style="font-size:9px;color:var(--sb);letter-spacing:2px">ПРОГРАММЫ</div>';
    html += '</div>';
    html += '<div style="font-size:14px;font-weight:700;color:var(--tx2);line-height:1.2">' + progLabel + '</div>';
    html += '<div style="font-size:10px;color:var(--sb)">' + progSub + '</div>';
    html += '</button>';

    // [1ПМ] — дополнительная карточка
    html += '<button onclick="State.orm={active:true,step:0,method:null,exercise:null,weight:0,reps:1,result:null};App.render()" style="' + card(true, 100, 'background:var(--orm-bg);border-color:var(--orm-border);') + '">';
    html += '<div style="width:28px;height:28px;border-radius:8px;background:var(--orm-icon-bg);border:1px solid var(--orm-icon-bd);display:flex;align-items:center;justify-content:center">';
    html += '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--orm-color)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg>';
    html += '</div>';
    html += '<div style="font-size:13px;font-weight:700;color:var(--orm-color)">1ПМ</div>';
    if (ormHas.length) {
      ormHas.forEach(e => {
        html += '<div style="font-size:10px;color:var(--ac)">' + e.name + ' <b>' + orm1[e.id].value + '</b> кг</div>';
      });
    } else {
      html += '<div style="font-size:10px;color:var(--sb)">Не замерено</div>';
    }
    html += '</button>';

    html += '</div>'; // row 1

    // ── Ряд 2: История (3fr) + Неделя (2fr) ───────
    html += '<div style="display:grid;grid-template-columns:3fr 2fr;gap:10px;margin-bottom:' + (hasProgram ? '14px' : '20px') + '">';

    // [История]
    const fmtShort = iso => {
      if (!iso) return '';
      const d = new Date(iso);
      const months = ['янв','фев','мар','апр','май','июн','июл','авг','сен','окт','ноя','дек'];
      return d.getDate() + ' ' + months[d.getMonth()];
    };
    html += '<button onclick="State.diary.stage=\'history\';App.render()" style="' + card(true, 100) + '">';
    html += '<div style="display:flex;align-items:center;gap:10px">';
    html += '<div style="width:30px;height:30px;border-radius:8px;background:var(--ac10);border:1px solid var(--ac20);display:flex;align-items:center;justify-content:center;flex-shrink:0">';
    html += '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--ac)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>';
    html += '</div>';
    html += '<div style="font-size:9px;color:var(--sb);letter-spacing:2px">ИСТОРИЯ</div>';
    html += '</div>';
    if (last) {
      const lastExCount = last.exercises ? last.exercises.length : '?';
      const lastTon = last.exercises ? last.exercises.reduce((s,ex) => s + ex.sets.filter(st=>st.type==='work').reduce((s2,st)=>s2+(st.weight*st.reps),0),0) : 0;
      html += '<div style="font-size:14px;font-weight:700;color:var(--tx2)">' + fmtShort(last.date) + '</div>';
      html += '<div style="font-size:10px;color:var(--sb)">' + lastExCount + ' упр · ' + (lastTon/1000).toFixed(1) + ' т</div>';
    } else {
      html += '<div style="font-size:13px;font-weight:700;color:var(--tx2)">История</div>';
      html += '<div style="font-size:10px;color:var(--sb)">Ещё нет тренировок</div>';
    }
    html += '</button>';

    // [Неделя]
    html += '<div style="background:var(--sf);border:1px solid var(--br);border-radius:16px;padding:14px;display:flex;flex-direction:column;gap:8px;min-height:100px">';
    html += '<div style="font-size:9px;color:var(--sb);letter-spacing:2px">НЕДЕЛЯ</div>';
    html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-top:auto">';
    wDays.forEach(d => {
      const active  = wDaySet.has(d.iso);
      const isToday = d.isToday;
      const sz = isToday ? 14 : 11;
      html += '<div style="display:flex;flex-direction:column;align-items:center;gap:3px">';
      html += '<div style="width:' + sz + 'px;height:' + sz + 'px;border-radius:50%;background:' +
        (active ? 'var(--ac)' : (isToday ? 'var(--ac20)' : 'var(--s2)')) +
        ';border:1px solid ' + (isToday ? 'var(--ac)' : 'var(--br)') + '"></div>';
      html += '<div style="font-size:7px;color:' + (isToday ? 'var(--ac)' : 'var(--sb)') + ';font-weight:' + (isToday ? '700' : '400') + '">' + d.label.slice(0,1) + '</div>';
      html += '</div>';
    });
    html += '</div>';
    html += '<div style="font-size:10px;color:var(--sb)">' + wk7count + '/7</div>';
    html += '</div>';

    html += '</div>'; // row 2

    // ── Ряд 3: Анатомия + Обучение (2fr 3fr) ─────
    html += '<div style="display:grid;grid-template-columns:2fr 3fr;gap:10px;margin-bottom:10px">';

    // [Анатомия]
    html += '<div style="background:var(--sf);border:1px solid var(--br);border-radius:16px;padding:14px;display:flex;flex-direction:column;gap:8px;min-height:90px;opacity:.5">';
    html += '<div style="width:28px;height:28px;border-radius:8px;background:var(--ac10);border:1px solid var(--ac20);display:flex;align-items:center;justify-content:center">';
    html += '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--ac)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/><path d="M9 12c0 2-1 4-1 4h8s-1-2-1-4"/></svg>';
    html += '</div>';
    html += '<div style="font-size:9px;color:var(--sb);letter-spacing:2px">СКОРО</div>';
    html += '<div style="font-size:13px;font-weight:700;color:var(--tx2)">Анатомия</div>';
    html += '</div>';

    // [Обучение]
    html += '<div style="background:var(--sf);border:1px solid var(--br);border-radius:16px;padding:14px;display:flex;flex-direction:column;gap:8px;min-height:90px;opacity:.5">';
    html += '<div style="width:28px;height:28px;border-radius:8px;background:var(--ac10);border:1px solid var(--ac20);display:flex;align-items:center;justify-content:center">';
    html += '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--ac)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>';
    html += '</div>';
    html += '<div style="font-size:9px;color:var(--sb);letter-spacing:2px">СКОРО</div>';
    html += '<div style="font-size:13px;font-weight:700;color:var(--tx2)">Обучение</div>';
    html += '</div>';

    html += '</div>'; // row 3

    // ── Ряд 4: Активная программа (если есть) ─────
    if (hasProgram) {
      html += '<div style="background:linear-gradient(135deg,var(--ac08),var(--ac04));border:1px solid var(--ac30);border-radius:16px;padding:14px;margin-bottom:20px">';
      html += '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">';
      html += '<div>';
      html += '<div style="font-size:9px;color:var(--ac70);letter-spacing:2px;margin-bottom:2px">СЕГОДНЯ</div>';
      html += '<div style="font-size:14px;font-weight:700;color:var(--tx2)">' + apDay.label + '</div>';
      html += '<div style="font-size:10px;color:var(--sb)">' + apProg.name + ' · ' + apWeek.label + '</div>';
      html += '</div>';
      html += '<button onclick="State.tab=\'programs\';State.programNav={active:true,programId:' + ap.programId + ',weekIdx:' + ap.weekIdx + ',dayIdx:null};App.render()" style="background:none;border:none;color:var(--ac);font-size:11px;cursor:pointer;font-family:inherit">план ›</button>';
      html += '</div>';
      html += '<div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:10px">';
      apDay.exercises.forEach(ex => {
        html += '<span style="font-size:9px;color:var(--sb);background:var(--s2);border:1px solid var(--br);border-radius:6px;padding:2px 7px">' + ex.name + '</span>';
      });
      html += '</div>';
      html += '<button onclick="Diary.startProgramWorkout(' + ap.weekIdx + ',' + ap.dayIdx + ',' + ap.programId + ')" style="width:100%;background:var(--gradient-primary);border:none;border-radius:10px;padding:11px;cursor:pointer;font-family:\'Bebas Neue\',sans-serif;font-size:16px;letter-spacing:2px;color:var(--btn-main-color);display:flex;align-items:center;justify-content:center;gap:8px">';
      html += '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>';
      html += 'НАЧАТЬ ДЕНЬ ' + (ap.dayIdx + 1) + '</button>';
      html += '</div>';
    }

    // ── Фиксированная кнопка над навом ────────────
    const btnLabel = hasOngoing ? 'Продолжить тренировку' : 'Начать тренировку';
    const btnAction = hasOngoing
      ? 'State.diary.stage=\'active\';App.render()'
      : 'State.diary.stage=\'select\';State.selector={muscle:null,categoryId:null,typeId:null,equip:null,accent:null,grip:null};App.render()';
    html += '<div style="position:fixed;bottom:148px;left:50%;transform:translateX(-50%);width:calc(100% - 32px);max-width:398px;z-index:99">';
    html += '<button onclick="' + btnAction + '" style="width:100%;height:52px;border-radius:14px;border:1.5px solid var(--ac);background:var(--ac10);color:var(--ac);font-family:inherit;font-size:15px;font-weight:700;letter-spacing:.5px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:10px;backdrop-filter:blur(8px)">';
    html += '<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>';
    html += btnLabel + '</button>';
    html += '</div>';

    return html;
};

Screens.workoutHistory = function() {
    // Берём данные из DB (полный формат) + legacy fallback
    const dbWorkouts = getWorkouts(); // из storage.js

    const fmtDate = iso => {
      const d = new Date(iso);
      const months = ['янв','фев','мар','апр','май','июн','июл','авг','сен','окт','ноя','дек'];
      const days = ['вс','пн','вт','ср','чт','пт','сб'];
      return days[d.getDay()] + ', ' + d.getDate() + ' ' + months[d.getMonth()] + ' ' + d.getFullYear();
    };

    const calcTonnage = exercises =>
      exercises.reduce((sum, ex) =>
        sum + ex.sets.filter(s => s.type === 'work').reduce((s2, s) => s2 + (s.weight * s.reps), 0), 0);

    let html = '';
    html += '<div style="display:flex;align-items:center;gap:12px;margin-bottom:20px">';
    html += '<button class="btn btn-ghost" onclick="State.diary.stage=\'browse\';State.diary.historyDetailId=null;App.render()">‹</button>';
    html += '<div><span class="lbl">ДНЕВНИК</span><div class="ttl" style="font-size:26px">История тренировок</div></div>';
    html += '</div>';

    if (!dbWorkouts.length) {
      html += '<div style="background:var(--sf);border:1px solid var(--br);border-radius:14px;padding:48px 20px;text-align:center">';
      html += '<div style="font-size:40px;margin-bottom:14px">🏋️</div>';
      html += '<div style="font-size:14px;font-weight:600;color:var(--tx2);margin-bottom:8px">Ещё нет тренировок</div>';
      html += '<div style="font-size:12px;color:var(--sb);line-height:1.8">Заверши первую тренировку —<br>она появится здесь.</div>';
      html += '</div>';
    } else {
      dbWorkouts.forEach((w, idx) => {
        const ton = calcTonnage(w.exercises);
        const tonStr = ton >= 1000 ? (ton/1000).toFixed(1) + ' т' : ton + ' кг';
        const exCount = w.exercises.length;
        const workSetsTotal = w.exercises.reduce((s, ex) => s + ex.sets.filter(s2 => s2.type === 'work').length, 0);

        html += '<button onclick="State.diary.historyDetailId=\'' + w.id + '\';App.render()" style="width:100%;text-align:left;background:var(--sf);border:1px solid ' + (idx === 0 ? 'var(--ac30)' : 'var(--br)') + ';border-radius:14px;padding:14px 16px;margin-bottom:8px;cursor:pointer;font-family:inherit">';

        // Верхняя строка: дата + тоннаж
        html += '<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px">';
        html += '<div>';
        html += '<div style="font-size:13px;font-weight:700;color:var(--tx2);margin-bottom:2px">' + fmtDate(w.date) + '</div>';
        html += '<div style="font-size:10px;color:var(--sb)">' + exCount + ' упр · ' + workSetsTotal + ' подходов</div>';
        // Тип тренировки
        if (w.type === 'program' && w.programId) {
          const wp = PROGRAMS.find(pr => pr.id === w.programId);
          const wpName = wp ? wp.name : 'Программа';
          html += '<div style="margin-top:4px"><span style="font-size:8px;color:var(--ac);background:var(--ac10);border:1px solid var(--ac25);border-radius:4px;padding:1px 7px;letter-spacing:.5px">' + wpName + '</span></div>';
        }
        html += '</div>';
        html += '<div style="text-align:right">';
        html += '<div style="font-size:17px;font-weight:700;color:var(--ac)">' + tonStr + '</div>';
        if (idx === 0) html += '<div style="font-size:9px;color:var(--ac60);letter-spacing:1px">последняя</div>';
        html += '</div>';
        html += '</div>';

        // Упражнения-чипы
        if (w.exercises.length) {
          html += '<div style="display:flex;flex-wrap:wrap;gap:4px">';
          w.exercises.forEach(ex => {
            const ws = ex.sets.filter(s => s.type === 'work').length;
            html += '<span style="font-size:9px;color:var(--sb);background:var(--s2);border:1px solid var(--br);border-radius:6px;padding:2px 7px">' + ex.name + (ws ? ' ×' + ws : '') + '</span>';
          });
          html += '</div>';
        }

        html += '<div style="text-align:right;margin-top:6px"><span style="font-size:10px;color:var(--ac)">подробнее ›</span></div>';
        html += '</button>';
      });
    }

    return html;
};

Screens.workoutDetail = function() {
    const id = State.diary.historyDetailId;
    const w  = getWorkouts().find(w => String(w.id) === String(id));

    const fmtDate = iso => {
      const d = new Date(iso);
      const months = ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];
      const days = ['воскресенье','понедельник','вторник','среда','четверг','пятница','суббота'];
      return days[d.getDay()] + ', ' + d.getDate() + ' ' + months[d.getMonth()] + ' ' + d.getFullYear();
    };

    const SET_LABELS = { warmup:'РЗМ', leadup:'ПДВ', work:'РАБ' };
    const SET_COLORS = { warmup:'#6ac882', leadup:'#6aaae0', work:'var(--ac)' };

    let html = '';
    html += '<div style="display:flex;align-items:center;gap:12px;margin-bottom:20px">';
    html += '<button class="btn btn-ghost" onclick="State.diary.historyDetailId=null;App.render()">‹</button>';
    html += '<div><span class="lbl">ИСТОРИЯ</span><div class="ttl" style="font-size:22px">' + (w ? fmtDate(w.date) : 'Тренировка') + '</div></div>';
    html += '</div>';

    if (!w) {
      html += '<div style="text-align:center;padding:40px 20px;color:var(--sb)">Данные не найдены</div>';
      return html;
    }

    // Суммарный тоннаж
    const totalTon = w.exercises.reduce((sum, ex) =>
      sum + ex.sets.filter(s => s.type === 'work').reduce((s2, s) => s2 + s.weight * s.reps, 0), 0);
    const tonStr = totalTon >= 1000 ? (totalTon/1000).toFixed(1) + ' т' : totalTon + ' кг';
    const totalSets = w.exercises.reduce((s, ex) => s + ex.sets.filter(s2 => s2.type === 'work').length, 0);

    // Шапка-саммари
    html += '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:16px">';
    [
      { label: 'УПРАЖНЕНИЙ', val: w.exercises.length },
      { label: 'ПОДХОДОВ',   val: totalSets },
      { label: 'ТОННАЖ',     val: tonStr },
    ].forEach(it => {
      html += '<div style="background:var(--sf);border:1px solid var(--br);border-radius:12px;padding:12px;text-align:center">';
      html += '<div style="font-size:9px;color:var(--sb);letter-spacing:1px;margin-bottom:4px">' + it.label + '</div>';
      html += '<div style="font-size:16px;font-weight:700;color:var(--ac)">' + it.val + '</div>';
      html += '</div>';
    });
    html += '</div>';

    // Упражнения
    w.exercises.forEach(ex => {
      const workSets = ex.sets.filter(s => s.type === 'work');
      const exTon = workSets.reduce((s, set) => s + set.weight * set.reps, 0);
      const eq = EQUIPMENT_LIST.find(e => e.id === ex.equip);
      const ac = ACCENT_LIST.find(a => a.id === ex.accent);

      html += '<div style="background:var(--sf);border:1px solid var(--br);border-radius:14px;overflow:hidden;margin-bottom:10px">';

      // Заголовок упражнения
      html += '<div style="padding:12px 14px;border-bottom:1px solid #1e1e24;display:flex;justify-content:space-between;align-items:center">';
      html += '<div>';
      html += '<div style="font-size:13px;font-weight:700;color:var(--tx2)">' + ex.name + '</div>';
      if (eq || ac) {
        html += '<div style="display:flex;gap:4px;margin-top:4px">';
        if (eq) html += '<span style="font-size:9px;color:var(--sb);background:var(--s2);border:1px solid var(--br);border-radius:5px;padding:1px 6px">' + eq.name + '</span>';
        if (ac) html += '<span style="font-size:9px;color:var(--sb);background:var(--s2);border:1px solid var(--br);border-radius:5px;padding:1px 6px">' + ac.name + '</span>';
        html += '</div>';
      }
      html += '</div>';
      if (exTon > 0) {
        html += '<div style="font-size:13px;font-weight:700;color:var(--ac)">' + (exTon >= 1000 ? (exTon/1000).toFixed(1) + ' т' : exTon + ' кг') + '</div>';
      }
      html += '</div>';

      // Подходы
      if (ex.sets.length) {
        ex.sets.forEach((s, si) => {
          const col = SET_COLORS[s.type] || SET_COLORS.work;
          const lbl = SET_LABELS[s.type] || 'РАБ';
          const bTop = si > 0 ? 'border-top:1px solid #1a1a1e;' : '';
          html += '<div style="' + bTop + 'padding:7px 14px;display:flex;align-items:center;gap:10px">';
          html += '<span style="font-size:8px;font-weight:700;color:' + col + ';width:22px;flex-shrink:0">' + lbl + '</span>';
          const sWDisp = s.weightMode === 'bw' ? 'СВ' : (s.weightMode === 'assist' ? '−' + s.weight + 'кг' : s.weight);
          html += '<span style="font-size:14px;font-weight:600;color:var(--tx2)">' + sWDisp + '×' + s.reps + '</span>';
          if (s.rpe) html += '<span style="font-size:10px;color:#9b87f0;margin-left:4px">RPE ' + s.rpe + '</span>';
          if (s.type === 'work') {
            const setTon = s.weight * s.reps;
            if (setTon > 0) html += '<span style="font-size:9px;color:#505060;margin-left:auto">' + setTon + ' кг</span>';
          }
          html += '</div>';
        });
      } else {
        html += '<div style="padding:12px 14px;font-size:11px;color:var(--sb)">Подходов нет</div>';
      }

      html += '</div>';
    });

    return html;
};

