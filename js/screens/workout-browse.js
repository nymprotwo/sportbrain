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
    const hasOngoing = !!(State.diary.workout &&
      State.diary.workout.length > 0 &&
      State.diary.workout.some(w => w.sets && w.sets.length > 0));

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

    // Сегодняшний день
    const DAY_NAMES = ['Воскресенье','Понедельник','Вторник','Среда','Четверг','Пятница','Суббота'];
    const todayStr  = DAY_NAMES[new Date().getDay()];

    function daysAgo(dateStr) {
      const d = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
      if (d === 0) return 'сегодня';
      if (d === 1) return 'вчера';
      if (d < 5)   return d + ' дня назад';
      return d + ' дней назад';
    }
    function plural(n) {
      const m10 = n % 10, m100 = n % 100;
      if (m10 === 1 && m100 !== 11)                           return 'тренировка';
      if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return 'тренировки';
      return 'тренировок';
    }

    let html = '';

    // ════════════════════════════════════════
    // BLOCK 1 — ACTION
    // ════════════════════════════════════════
    html += '<span class="lbl" style="letter-spacing:3px">СЕГОДНЯ</span>';
    html += '<div style="font-family:\'Bebas Neue\',sans-serif;font-size:42px;letter-spacing:1px;line-height:1;color:var(--tx2);margin-bottom:28px">' + todayStr + '</div>';

    if (hasOngoing) {
      // Незавершённая тренировка — кнопка "Продолжить"
      html += '<button onclick="State.diary.stage=\'active\';App.render()" style="width:100%;border:1.5px solid var(--ac);border-radius:14px;padding:18px 20px;cursor:pointer;font-family:\'Bebas Neue\',sans-serif;font-size:20px;letter-spacing:2px;display:flex;align-items:center;justify-content:center;gap:10px;background:var(--ad);color:var(--ac);box-shadow:0 4px 24px var(--ac15)">';
      html += '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>';
      html += 'ПРОДОЛЖИТЬ ТРЕНИРОВКУ</button>';

    } else if (hasProgram) {
      // Активная программа — основная кнопка с подписью
      const dayMuscles = [...new Set(
        (apDay.exercises || [])
          .map(ex => { const m = PROG_EX_MAP[ex.name]; return m ? m.muscle : null; })
          .filter(Boolean)
      )].slice(0, 2).join(' · ');
      const totalWeeks = apStructure ? apStructure.length : '?';
      const btnCaption = apProg.name + '  ·  Нед ' + (ap.weekIdx + 1) + ' / ' + totalWeeks + (dayMuscles ? '  ·  ' + dayMuscles : '');

      html += '<div style="display:flex;flex-direction:column;gap:8px">';
      html += '<button onclick="Diary.startProgramWorkout(' + ap.weekIdx + ',' + ap.dayIdx + ',' + ap.programId + ')" style="width:100%;border:none;border-radius:14px;padding:18px 20px;cursor:pointer;font-family:\'Bebas Neue\',sans-serif;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;background:var(--gradient-primary);color:var(--btn-main-color);box-shadow:0 8px 32px var(--ac30),0 2px 8px rgba(0,0,0,.5)">';
      html += '<div style="display:flex;align-items:center;gap:10px;font-size:20px;letter-spacing:2px">';
      html += '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>';
      html += 'ПРОДОЛЖИТЬ ПРОГРАММУ</div>';
      html += '<div style="font-size:10px;letter-spacing:.5px;opacity:.65;font-family:\'JetBrains Mono\',monospace;font-weight:600">' + btnCaption + '</div>';
      html += '</button>';
      html += '<button onclick="State.diary.stage=\'select\';State.selector={muscle:null,categoryId:null,typeId:null,equip:null,accent:null,grip:null};App.render()" style="width:100%;background:transparent;border:1px solid var(--br);border-radius:11px;padding:9px 14px;cursor:pointer;font-family:inherit;font-size:12px;color:var(--sb);display:flex;align-items:center;justify-content:center;gap:6px">';
      html += '+ Своя тренировка';
      html += '</button>';
      html += '</div>';

    } else {
      // Нет программы — старт свободной тренировки
      html += '<button onclick="State.diary.stage=\'select\';State.selector={muscle:null,categoryId:null,typeId:null,equip:null,accent:null,grip:null};App.render()" style="width:100%;border:none;border-radius:14px;padding:18px 20px;cursor:pointer;font-family:\'Bebas Neue\',sans-serif;font-size:20px;letter-spacing:2px;display:flex;align-items:center;justify-content:center;gap:10px;background:var(--gradient-primary);color:var(--btn-main-color);box-shadow:0 8px 32px var(--ac30),0 2px 8px rgba(0,0,0,.5)">';
      html += '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>';
      html += 'НАЧАТЬ ТРЕНИРОВКУ</button>';
    }

    // ════════════════════════════════════════
    // PERIOD STATS CARD
    // ════════════════════════════════════════
    if (!State.browsePeriod) State.browsePeriod = 'week';
    const bp = State.browsePeriod;

    // ── Helpers ─────────────────────────────
    const now2     = new Date();
    const tonFmt2  = t => t >= 1000 ? (t/1000).toFixed(1) + ' т' : t + ' кг';
    const calcTon2 = w => w.exercises.reduce((s, ex) =>
      s + ex.sets.filter(st => st.type === 'work').reduce((s2, st) => s2 + st.weight * st.reps, 0), 0);
    const tonOf2   = wList => wList.reduce((s, w) => s + calcTon2(w), 0);
    const inRange2 = (w, a, b) => { const d = new Date(w.date); return d >= a && d <= b; };
    const sameDay2 = (a, b) =>
      a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

    // ── Date ranges ─────────────────────────
    const dow2     = now2.getDay();
    const monday2  = new Date(now2); monday2.setDate(now2.getDate() - (dow2 === 0 ? 6 : dow2 - 1)); monday2.setHours(0,0,0,0);
    const sunday2  = new Date(monday2); sunday2.setDate(monday2.getDate() + 6); sunday2.setHours(23,59,59,999);
    const todayIdx2 = dow2 === 0 ? 6 : dow2 - 1;
    const todayStart2 = new Date(now2); todayStart2.setHours(0,0,0,0);
    const todayEnd2   = new Date(now2); todayEnd2.setHours(23,59,59,999);

    // ── Compute period data ──────────────────
    let bpWs, bpTon, bpCnt, bpPrevTon, bpPrevLbl, bpTonLbl, bpStreak;
    if (bp === 'day') {
      bpWs      = workouts.filter(w => inRange2(w, todayStart2, todayEnd2));
      bpTon     = tonOf2(bpWs);
      bpCnt     = bpWs.length;
      const prevW = workouts.find(w => !inRange2(w, todayStart2, todayEnd2));
      bpPrevTon = prevW ? calcTon2(prevW) : 0;
      bpPrevLbl = 'ПРОШЛАЯ';
      bpTonLbl  = 'СЕГОДНЯ';
    } else if (bp === 'week') {
      bpWs      = workouts.filter(w => inRange2(w, monday2, sunday2));
      bpTon     = tonOf2(bpWs);
      bpCnt     = bpWs.length;
      const pm2 = new Date(monday2); pm2.setDate(monday2.getDate() - 7);
      const ps2 = new Date(sunday2); ps2.setDate(sunday2.getDate() - 7);
      bpPrevTon = tonOf2(workouts.filter(w => inRange2(w, pm2, ps2)));
      bpPrevLbl = 'ПР. НЕДЕЛЯ';
      bpTonLbl  = 'ТОННАЖ НЕДЕЛИ';
      // Streak
      bpStreak = 0;
      const dayMap2 = Array.from({length:7}, (_, i) => {
        const d = new Date(monday2); d.setDate(monday2.getDate() + i);
        return !!workouts.find(w => sameDay2(new Date(w.date), d));
      });
      for (let i = todayIdx2; i >= 0; i--) { if (dayMap2[i]) bpStreak++; else break; }
    } else if (bp === 'month') {
      const ms2 = new Date(now2.getFullYear(), now2.getMonth(), 1);
      const me2 = new Date(now2.getFullYear(), now2.getMonth() + 1, 0, 23,59,59,999);
      bpWs      = workouts.filter(w => inRange2(w, ms2, me2));
      bpTon     = tonOf2(bpWs);
      bpCnt     = bpWs.length;
      const pm2 = new Date(now2.getFullYear(), now2.getMonth() - 1, 1);
      const pe2 = new Date(now2.getFullYear(), now2.getMonth(), 0, 23,59,59,999);
      bpPrevTon = tonOf2(workouts.filter(w => inRange2(w, pm2, pe2)));
      bpPrevLbl = 'ПР. МЕС';
      bpTonLbl  = 'ТОННАЖ МЕСЯЦА';
    } else {
      const ys2 = new Date(now2.getFullYear(), 0, 1);
      const ye2 = new Date(now2.getFullYear(), 11, 31, 23,59,59,999);
      bpWs      = workouts.filter(w => inRange2(w, ys2, ye2));
      bpTon     = tonOf2(bpWs);
      bpCnt     = bpWs.length;
      const py2 = new Date(now2.getFullYear() - 1, 0, 1);
      const pe2 = new Date(now2.getFullYear() - 1, 11, 31, 23,59,59,999);
      bpPrevTon = tonOf2(workouts.filter(w => inRange2(w, py2, pe2)));
      bpPrevLbl = 'ПР. ГОД';
      bpTonLbl  = 'ТОННАЖ ГОДА';
    }
    const bpDiff  = bpPrevTon > 0 ? Math.abs(Math.round((bpTon - bpPrevTon) / bpPrevTon * 100)) : null;
    const bpSign  = bpTon >= bpPrevTon ? '+' : '−';
    const bpColor = bpTon >= bpPrevTon ? 'var(--color-success)' : '#e06a6a';
    const cntPlural = n => n + (n === 1 ? ' тренировка' : n < 5 ? ' тренировки' : ' тренировок');

    // ── Render card ──────────────────────────
    html += '<div style="background:var(--sf);border:1px solid var(--br);border-radius:14px;padding:14px;margin-top:20px">';

    // Period tabs
    html += '<div style="display:flex;gap:5px;margin-bottom:14px">';
    [{id:'day',lbl:'ДЕНЬ'},{id:'week',lbl:'НЕДЕЛЯ'},{id:'month',lbl:'МЕСЯЦ'},{id:'year',lbl:'ГОД'}].forEach(t => {
      const on = bp === t.id;
      html += '<button onclick="State.browsePeriod=\'' + t.id + '\';App.render()" style="flex:1;padding:5px 2px;border-radius:7px;border:1px solid ' +
        (on ? 'var(--ac)' : 'var(--br)') + ';background:' + (on ? 'var(--ad)' : 'transparent') +
        ';color:' + (on ? 'var(--ac)' : 'var(--sb)') + ';font-size:9px;font-weight:' + (on ? '700' : '400') +
        ';letter-spacing:.5px;cursor:pointer;font-family:inherit">' + t.lbl + '</button>';
    });
    html += '</div>';

    // Tonnage + prev comparison
    html += '<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:' + (bp === 'week' ? '12' : '0') + 'px">';
    html += '<div>';
    html += '<div style="font-size:9px;color:var(--sb);letter-spacing:2px;margin-bottom:3px">' + bpTonLbl + '</div>';
    html += '<div style="font-size:26px;font-weight:700;color:var(--ac);line-height:1.1">' + (bpTon > 0 ? tonFmt2(bpTon) : '—') + '</div>';
    html += '<div style="font-size:10px;color:var(--sb);margin-top:3px">';
    html += bpCnt > 0 ? cntPlural(bpCnt) : 'Нет тренировок';
    if (bpStreak > 1) html += ' &nbsp;🔥 <span style="color:#e8c84a">' + bpStreak + ' подряд</span>';
    html += '</div></div>';
    if (bpPrevTon > 0) {
      html += '<div style="text-align:right">';
      html += '<div style="font-size:9px;color:var(--sb);letter-spacing:.5px;margin-bottom:3px">' + bpPrevLbl + '</div>';
      html += '<div style="font-size:13px;color:var(--mt)">' + tonFmt2(bpPrevTon) + '</div>';
      if (bpDiff !== null) html += '<div style="font-size:11px;font-weight:700;color:' + bpColor + '">' + bpSign + bpDiff + '%</div>';
      html += '</div>';
    }
    html += '</div>';

    // Week day grid
    if (bp === 'week') {
      const DAY_LABELS2 = ['ПН','ВТ','СР','ЧТ','ПТ','СБ','ВС'];
      html += '<div style="display:flex;gap:5px">';
      DAY_LABELS2.forEach((lbl, i) => {
        const dayDate = new Date(monday2); dayDate.setDate(monday2.getDate() + i);
        const w = workouts.find(w => sameDay2(new Date(w.date), dayDate));
        const hasTrain = !!w;
        const isToday  = i === todayIdx2;
        const isFuture = i > todayIdx2;
        let bg2, bc2, ic2, icon2, cur2;
        if      (hasTrain && isToday)  { bg2='var(--ad)';              bc2='var(--ac)';             ic2='var(--ac)';          icon2='✓';  cur2='pointer'; }
        else if (hasTrain)             { bg2='rgba(100,200,100,.07)';  bc2='rgba(100,200,100,.3)';  ic2='var(--color-success)'; icon2='✓'; cur2='pointer'; }
        else if (isToday)              { bg2='var(--ac04)';            bc2='var(--ac40)';           ic2='var(--ac50)';        icon2='';   cur2='default'; }
        else if (isFuture)             { bg2='transparent';            bc2='var(--br)';             ic2='var(--mt)';          icon2='';   cur2='default'; }
        else                           { bg2='transparent';            bc2='var(--br)';             ic2='var(--mt)';          icon2='—';  cur2='default'; }
        const onc2 = hasTrain ? ' onclick="State.diary.historyDetailId=\'' + w.id + '\';State.diary.stage=\'history\';App.render()"' : '';
        html += '<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px">';
        html += '<div' + onc2 + ' style="width:100%;height:32px;border-radius:7px;border:1px solid ' + bc2 + ';background:' + bg2 + ';display:flex;align-items:center;justify-content:center;font-size:' + (icon2==='—'?'10':'13') + 'px;color:' + ic2 + ';font-weight:700;cursor:' + cur2 + '">' + icon2 + '</div>';
        html += '<span style="font-size:8px;color:' + (isToday ? 'var(--ac)' : hasTrain ? 'var(--sb)' : 'var(--mt)') + ';font-weight:' + (isToday ? '700' : '400') + '">' + lbl + '</span>';
        html += '</div>';
      });
      html += '</div>';
    }

    html += '</div>'; // end stats card

    // ════════════════════════════════════════
    // BLOCK 2 — PROGRAMS + HISTORY
    // ════════════════════════════════════════
    html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:24px">';

    // — Programs card —
    const progTitle = apProg ? apProg.name : 'Программы';
    const progSub   = hasProgram
      ? ('Нед ' + (ap.weekIdx + 1) + ' · День ' + (ap.dayIdx + 1))
      : 'Нет активной программы';
    const progOnClick = hasProgram
      ? 'State.prevTab=State.tab;State.tab=\'programs\';State.programNav={active:true,programId:' + ap.programId + ',weekIdx:' + ap.weekIdx + ',dayIdx:null};App.render()'
      : 'App.nav(\'programs\')';
    html += '<button onclick="' + progOnClick + '" style="background:var(--sf);border:1px solid var(--br);border-top:1px solid var(--br2);border-radius:14px;padding:14px;cursor:pointer;font-family:inherit;text-align:left;display:flex;flex-direction:column;gap:10px">';
    html +=   '<div style="display:flex;align-items:center;gap:10px">';
    html +=     '<div style="width:36px;height:36px;border-radius:10px;background:var(--ac12);border:1px solid var(--ac30);display:flex;align-items:center;justify-content:center;flex-shrink:0">';
    html +=       '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--ac)" stroke-width="2" stroke-linecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="13" y2="17"/></svg>';
    html +=     '</div>';
    html +=     '<div style="font-size:14px;font-weight:700;color:var(--tx2);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + progTitle + '</div>';
    html +=   '</div>';
    html +=   '<div style="font-size:10px;color:var(--sb);line-height:1.5">' + progSub + '</div>';
    html += '</button>';

    // — History card —
    const histTitle = 'История';
    const histSub   = last ? (workouts.length + ' ' + plural(workouts.length) + ' · ' + daysAgo(last.date)) : 'Ещё нет записей';
    html += '<button onclick="State.diary.stage=\'history\';App.render()" style="background:var(--sf);border:1px solid var(--br);border-top:1px solid var(--br2);border-radius:14px;padding:14px;cursor:pointer;font-family:inherit;text-align:left;display:flex;flex-direction:column;gap:10px">';
    html +=   '<div style="display:flex;align-items:center;gap:10px">';
    html +=     '<div style="width:36px;height:36px;border-radius:10px;background:var(--ac12);border:1px solid var(--ac30);display:flex;align-items:center;justify-content:center;flex-shrink:0">';
    html +=       '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--ac)" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>';
    html +=     '</div>';
    html +=     '<div style="font-size:14px;font-weight:700;color:var(--tx2)">' + histTitle + '</div>';
    html +=   '</div>';
    html +=   '<div style="font-size:10px;color:var(--sb);line-height:1.5">' + histSub + '</div>';
    html += '</button>';

    html += '</div>'; // end grid

    // ════════════════════════════════════════
    // BLOCK 3 — TOOLS
    // ════════════════════════════════════════
    html += '<div style="margin-top:36px">';
    html += '<span class="lbl" style="letter-spacing:3px">ИНСТРУМЕНТЫ</span>';
    html += '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px">';

    // — 1ПМ —
    html += '<button onclick="State.orm={active:true,step:0,method:null,exercise:null,weight:0,reps:1,result:null};App.render()" style="background:var(--orm-bg);border:1px solid var(--orm-border);border-radius:12px;padding:14px 8px;cursor:pointer;font-family:inherit;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px">';
    html +=   '<div style="width:32px;height:32px;border-radius:9px;background:var(--orm-icon-bg);border:1px solid var(--orm-icon-bd);display:flex;align-items:center;justify-content:center">';
    html +=     '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--orm-color)" stroke-width="2.5" stroke-linecap="round"><path d="M6 4v6M6 14v6M18 4v6M18 14v6M2 9h4M14 9h4M2 15h4M14 15h4"/></svg>';
    html +=   '</div>';
    html +=   '<div style="text-align:center">';
    html +=     '<div style="font-size:11px;font-weight:700;color:var(--orm-color)">1ПМ</div>';
    if (ormHas.length) {
      html += '<div style="font-size:8px;color:var(--ac);margin-top:2px;line-height:1.5">';
      ormHas.slice(0,2).forEach(e => { html += e.name + ' <b>' + orm1[e.id].value + '</b><br>'; });
      html += '</div>';
    } else {
      html +=   '<div style="font-size:8px;color:var(--sb);margin-top:2px">Не замерено</div>';
    }
    html +=   '</div>';
    html += '</button>';

    // — Анатомия (coming soon) —
    html += '<div style="background:var(--sf);border:1px solid var(--br);border-radius:12px;padding:14px 8px;opacity:0.35;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px">';
    html +=   '<div style="width:32px;height:32px;border-radius:9px;background:var(--ac10);border:1px solid var(--ac20);display:flex;align-items:center;justify-content:center">';
    html +=     '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--ac)" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>';
    html +=   '</div>';
    html +=   '<div style="text-align:center"><div style="font-size:11px;font-weight:700;color:var(--tx2)">Анатомия</div><div style="font-size:8px;color:var(--sb);margin-top:2px">Скоро</div></div>';
    html += '</div>';

    // — Обучение (coming soon) —
    html += '<div style="background:var(--sf);border:1px solid var(--br);border-radius:12px;padding:14px 8px;opacity:0.35;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px">';
    html +=   '<div style="width:32px;height:32px;border-radius:9px;background:var(--ac10);border:1px solid var(--ac20);display:flex;align-items:center;justify-content:center">';
    html +=     '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--ac)" stroke-width="2" stroke-linecap="round"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>';
    html +=   '</div>';
    html +=   '<div style="text-align:center"><div style="font-size:11px;font-weight:700;color:var(--tx2)">Обучение</div><div style="font-size:8px;color:var(--sb);margin-top:2px">Скоро</div></div>';
    html += '</div>';

    html += '</div></div>'; // end tools grid + tools block

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

    // ── Тоннаж / переключатель периода ──────────────────
    {
      if (!State.historyPeriod) State.historyPeriod = 'week';
      const period = State.historyPeriod;

      const now   = new Date();
      const tonFmt = t => t >= 1000 ? (t / 1000).toFixed(1) + ' т' : t + ' кг';
      const cntFmt = n => n + (n === 1 ? ' тренировка' : n < 5 ? ' тренировки' : ' тренировок');

      // ── Вспомогательные диапазоны ──
      // Текущая неделя (пн–вс)
      const dow    = now.getDay();
      const monday = new Date(now);
      monday.setDate(now.getDate() - (dow === 0 ? 6 : dow - 1));
      monday.setHours(0, 0, 0, 0);
      const sunday = new Date(monday); sunday.setDate(monday.getDate() + 6); sunday.setHours(23,59,59,999);
      const todayIdx = dow === 0 ? 6 : dow - 1;

      // Текущий месяц
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const monthEnd   = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      // Текущий год
      const yearStart  = new Date(now.getFullYear(), 0, 1);
      const yearEnd    = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);

      const inRange = (w, a, b) => { const d = new Date(w.date); return d >= a && d <= b; };
      const tonOf   = wList => wList.reduce((s, w) => s + calcTonnage(w.exercises), 0);
      const sameDay = (a, b) =>
        a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

      // ── Текущие суммы ──
      const weekWs  = dbWorkouts.filter(w => inRange(w, monday, sunday));
      const monthWs = dbWorkouts.filter(w => inRange(w, monthStart, monthEnd));
      const yearWs  = dbWorkouts.filter(w => inRange(w, yearStart, yearEnd));

      const curTon = period === 'week' ? tonOf(weekWs) : period === 'month' ? tonOf(monthWs) : tonOf(yearWs);
      const curCnt = period === 'week' ? weekWs.length  : period === 'month' ? monthWs.length  : yearWs.length;

      // ── Предыдущий период для сравнения ──
      let prevTon = 0;
      if (period === 'week') {
        const pm = new Date(monday); pm.setDate(monday.getDate() - 7);
        const ps = new Date(sunday); ps.setDate(sunday.getDate() - 7);
        prevTon = tonOf(dbWorkouts.filter(w => inRange(w, pm, ps)));
      } else if (period === 'month') {
        const pm = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const pe = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
        prevTon = tonOf(dbWorkouts.filter(w => inRange(w, pm, pe)));
      } else {
        const py = new Date(now.getFullYear() - 1, 0, 1);
        const pe = new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59, 999);
        prevTon = tonOf(dbWorkouts.filter(w => inRange(w, py, pe)));
      }
      const vsDiff  = prevTon > 0 ? Math.abs(Math.round((curTon - prevTon) / prevTon * 100)) : null;
      const vsSign  = curTon > prevTon ? '+' : curTon < prevTon ? '−' : '=';
      const vsColor = curTon >= prevTon ? '#5ac870' : '#e06a6a';
      const prevLbl = period === 'week' ? 'ПРОШЛАЯ' : period === 'month' ? 'ПРОШ. МЕС' : 'ПРОШ. ГОД';
      const tonLbl  = period === 'week' ? 'ТОННАЖ НЕДЕЛИ' : period === 'month' ? 'ТОННАЖ МЕСЯЦА' : 'ТОННАЖ ГОДА';

      // Стрик (только для недели)
      let streak = 0;
      if (period === 'week') {
        const dayMap7 = Array.from({length: 7}, (_, i) => {
          const d = new Date(monday); d.setDate(monday.getDate() + i);
          return !!dbWorkouts.find(w => sameDay(new Date(w.date), d));
        });
        for (let i = todayIdx; i >= 0; i--) { if (dayMap7[i]) streak++; else break; }
      }

      html += '<div style="background:var(--sf);border:1px solid var(--br);border-radius:14px;padding:12px 14px;margin-bottom:16px">';

      // ── Переключатель периода ──
      html += '<div style="display:flex;gap:5px;margin-bottom:12px">';
      [{id:'week',lbl:'НЕДЕЛЯ'},{id:'month',lbl:'МЕСЯЦ'},{id:'year',lbl:'ГОД'}].forEach(tab => {
        const on = period === tab.id;
        html += '<button onclick="State.historyPeriod=\'' + tab.id + '\';App.render()" style="flex:1;padding:6px 2px;border-radius:7px;border:1px solid ' + (on ? 'var(--ac)' : 'var(--br)') + ';background:' + (on ? 'var(--ad)' : 'transparent') + ';color:' + (on ? 'var(--ac)' : '#505560') + ';font-size:9px;font-weight:' + (on ? '700' : '400') + ';letter-spacing:1px;cursor:pointer;font-family:inherit">' + tab.lbl + '</button>';
      });
      html += '</div>';

      // ── Тоннаж + сравнение ──
      html += '<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px">';
      html += '<div>';
      html += '<div style="font-size:9px;color:var(--sb);letter-spacing:2px;margin-bottom:3px">' + tonLbl + '</div>';
      html += '<div style="font-size:24px;font-weight:700;color:var(--ac);line-height:1.1">' + tonFmt(curTon) + '</div>';
      html += '<div style="font-size:10px;color:var(--sb);margin-top:3px">' + cntFmt(curCnt);
      if (streak > 1) html += ' · <span style="color:#e8c84a">🔥 ' + streak + ' подряд</span>';
      html += '</div></div>';
      if (prevTon > 0) {
        html += '<div style="text-align:right">';
        html += '<div style="font-size:9px;color:var(--sb);letter-spacing:.5px;margin-bottom:3px">' + prevLbl + '</div>';
        html += '<div style="font-size:13px;color:var(--mt)">' + tonFmt(prevTon) + '</div>';
        if (vsDiff !== null) html += '<div style="font-size:11px;font-weight:700;color:' + vsColor + '">' + vsSign + vsDiff + '%</div>';
        html += '</div>';
      }
      html += '</div>';

      // ── Сетка периода ──

      if (period === 'week') {
        // 7 дней
        const DAY_LABELS = ['ПН','ВТ','СР','ЧТ','ПТ','СБ','ВС'];
        html += '<div style="display:flex;gap:5px">';
        DAY_LABELS.forEach((lbl, i) => {
          const dayDate  = new Date(monday); dayDate.setDate(monday.getDate() + i);
          const w        = dbWorkouts.find(w => sameDay(new Date(w.date), dayDate));
          const hasTrain = !!w;
          const isToday  = i === todayIdx;
          const isFuture = i > todayIdx;
          let bg, border, iconCol, icon, cursor;
          if      (hasTrain && isToday)  { bg='var(--ad)'; border='var(--ac)'; iconCol='var(--ac)'; icon='✓'; cursor='pointer'; }
          else if (hasTrain)             { bg='rgba(200,255,0,.07)'; border='rgba(200,255,0,.3)'; iconCol='var(--accent-secondary)'; icon='✓'; cursor='pointer'; }
          else if (isToday)              { bg='rgba(200,255,0,.04)'; border='var(--ac40)'; iconCol='var(--ac50)'; icon='·'; cursor='default'; }
          else if (isFuture)             { bg='transparent'; border='#1c1c20'; iconCol='#2a2c30'; icon=''; cursor='default'; }
          else                           { bg='transparent'; border='#222228'; iconCol='#353840'; icon='Zz'; cursor='default'; }
          const onc = hasTrain ? ' onclick="State.diary.historyDetailId=\'' + w.id + '\';App.render()"' : '';
          html += '<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px">';
          html += '<div' + onc + ' style="width:100%;height:36px;border-radius:8px;border:1px solid ' + border + ';background:' + bg + ';display:flex;align-items:center;justify-content:center;font-size:' + (icon==='Zz'?'8':'14') + 'px;color:' + iconCol + ';font-weight:700;cursor:' + cursor + ';box-sizing:border-box">' + icon + '</div>';
          html += '<span style="font-size:8px;color:' + (isToday?'var(--ac)':hasTrain?'var(--sb)':'#2e3035') + ';font-weight:' + (isToday?'700':'400') + '">' + lbl + '</span>';
          html += '</div>';
        });
        html += '</div>';

      } else if (period === 'month') {
        // Недели текущего месяца
        const firstMon = new Date(monthStart);
        const fd = firstMon.getDay();
        firstMon.setDate(firstMon.getDate() - (fd === 0 ? 6 : fd - 1));
        const weeks = [];
        let ws = new Date(firstMon);
        while (ws <= monthEnd) {
          const we = new Date(ws); we.setDate(ws.getDate() + 6); we.setHours(23,59,59,999);
          const wWs   = dbWorkouts.filter(w => inRange(w, ws, we));
          const wTon  = tonOf(wWs);
          const isCur = ws <= now && now <= we;
          const isFut = ws > now;
          weeks.push({ ws: new Date(ws), we: new Date(we), ton: wTon, cnt: wWs.length, isCur, isFut });
          ws.setDate(ws.getDate() + 7);
        }
        html += '<div style="display:flex;gap:5px">';
        weeks.forEach((wk, wi) => {
          const hasTrain = wk.cnt > 0;
          let bg, border, valCol;
          if      (hasTrain && wk.isCur)  { bg='var(--ad)'; border='var(--ac)'; valCol='var(--ac)'; }
          else if (hasTrain)              { bg='rgba(200,255,0,.07)'; border='rgba(200,255,0,.3)'; valCol='var(--accent-secondary)'; }
          else if (wk.isCur)              { bg='rgba(200,255,0,.04)'; border='var(--ac40)'; valCol='var(--ac50)'; }
          else if (wk.isFut)              { bg='transparent'; border='#1c1c20'; valCol='#2a2c30'; }
          else                            { bg='transparent'; border='#222228'; valCol='#353840'; }
          html += '<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px">';
          html += '<div style="width:100%;height:44px;border-radius:8px;border:1px solid ' + border + ';background:' + bg + ';display:flex;flex-direction:column;align-items:center;justify-content:center;box-sizing:border-box;padding:2px">';
          if (hasTrain) {
            html += '<span style="font-size:10px;font-weight:700;color:' + valCol + ';line-height:1.2">' + tonFmt(wk.ton) + '</span>';
            html += '<span style="font-size:8px;color:' + valCol + ';opacity:.7">' + wk.cnt + ' тр</span>';
          } else if (wk.isCur) {
            html += '<span style="font-size:13px;color:' + valCol + '">·</span>';
          }
          html += '</div>';
          html += '<span style="font-size:8px;color:' + (wk.isCur?'var(--ac)':hasTrain?'var(--sb)':'#2e3035') + ';font-weight:' + (wk.isCur?'700':'400') + '">НЕД ' + (wi+1) + '</span>';
          html += '</div>';
        });
        html += '</div>';

      } else {
        // 12 месяцев года
        const MLBL = ['ЯНВ','ФЕВ','МАР','АПР','МАЙ','ИЮН','ИЮЛ','АВГ','СЕН','ОКТ','НОЯ','ДЕК'];
        const curM = now.getMonth();
        html += '<div style="display:grid;grid-template-columns:repeat(6,1fr);gap:4px">';
        MLBL.forEach((lbl, mi) => {
          const ms   = new Date(now.getFullYear(), mi, 1);
          const me   = new Date(now.getFullYear(), mi + 1, 0, 23, 59, 59, 999);
          const mWs  = dbWorkouts.filter(w => inRange(w, ms, me));
          const mTon = tonOf(mWs);
          const isCur = mi === curM;
          const isFut = mi > curM;
          const hasTrain = mWs.length > 0;
          let bg, border, valCol;
          if      (hasTrain && isCur)  { bg='var(--ad)'; border='var(--ac)'; valCol='var(--ac)'; }
          else if (hasTrain)           { bg='rgba(200,255,0,.07)'; border='rgba(200,255,0,.3)'; valCol='var(--accent-secondary)'; }
          else if (isCur)              { bg='rgba(200,255,0,.04)'; border='var(--ac40)'; valCol='var(--ac50)'; }
          else if (isFut)              { bg='transparent'; border='#1c1c20'; valCol='#2a2c30'; }
          else                         { bg='transparent'; border='#222228'; valCol='#353840'; }
          html += '<div style="display:flex;flex-direction:column;align-items:center;gap:3px">';
          html += '<div style="width:100%;height:40px;border-radius:7px;border:1px solid ' + border + ';background:' + bg + ';display:flex;flex-direction:column;align-items:center;justify-content:center;box-sizing:border-box;padding:2px">';
          if (hasTrain) {
            const shortTon = mTon >= 1000 ? (mTon/1000).toFixed(0) + 'т' : mTon + 'к';
            html += '<span style="font-size:9px;font-weight:700;color:' + valCol + '">' + shortTon + '</span>';
          } else if (isCur) {
            html += '<span style="font-size:12px;color:' + valCol + '">·</span>';
          }
          html += '</div>';
          html += '<span style="font-size:7px;color:' + (isCur?'var(--ac)':hasTrain?'var(--sb)':'#2e3035') + ';font-weight:' + (isCur?'700':'400') + '">' + lbl + '</span>';
          html += '</div>';
        });
        html += '</div>';
      }

      html += '</div>'; // end period block
    }

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
    html += '<div style="display:flex;align-items:center;gap:12px;margin-bottom:14px">';
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
    html += '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;margin-bottom:10px">';
    [
      { label: 'УПРАЖНЕНИЙ',    val: w.exercises.length },
      { label: 'РАБ. ПОДХОДОВ', val: totalSets },
      { label: 'ТОННАЖ',        val: tonStr },
    ].forEach(it => {
      html += '<div style="background:var(--sf);border:1px solid var(--br);border-radius:10px;padding:8px 6px;text-align:center">';
      html += '<div style="font-size:8px;color:var(--sb);letter-spacing:.5px;margin-bottom:3px;line-height:1.3">' + it.label + '</div>';
      html += '<div style="font-size:15px;font-weight:700;color:var(--ac)">' + it.val + '</div>';
      html += '</div>';
    });
    html += '</div>';

    // Упражнения
    w.exercises.forEach(ex => {
      const workSets = ex.sets.filter(s => s.type === 'work');
      const exTon = workSets.reduce((s, set) => s + set.weight * set.reps, 0);
      const eq = EQUIPMENT_LIST.find(e => e.id === ex.equip);
      const ac = ACCENT_LIST.find(a => a.id === ex.accent);

      html += '<div style="background:var(--sf);border:1px solid var(--br);border-radius:12px;overflow:hidden;margin-bottom:7px">';

      // Заголовок упражнения
      html += '<div style="padding:9px 12px;border-bottom:1px solid #1e1e24;display:flex;justify-content:space-between;align-items:center">';
      html += '<div>';
      html += '<div style="font-size:12px;font-weight:700;color:var(--tx2)">' + ex.name + '</div>';
      if (eq || ac) {
        html += '<div style="display:flex;gap:4px;margin-top:3px">';
        if (eq) html += '<span style="font-size:8px;color:var(--sb);background:var(--s2);border:1px solid var(--br);border-radius:4px;padding:1px 5px">' + eq.name + '</span>';
        if (ac) html += '<span style="font-size:8px;color:var(--sb);background:var(--s2);border:1px solid var(--br);border-radius:4px;padding:1px 5px">' + ac.name + '</span>';
        html += '</div>';
      }
      html += '</div>';
      if (exTon > 0) {
        html += '<div style="font-size:12px;font-weight:700;color:var(--ac);flex-shrink:0;margin-left:8px">' + (exTon >= 1000 ? (exTon/1000).toFixed(1) + ' т' : exTon + ' кг') + '</div>';
      }
      html += '</div>';

      // Подходы
      if (ex.sets.length) {
        ex.sets.forEach((s, si) => {
          const col = SET_COLORS[s.type] || SET_COLORS.work;
          const lbl = SET_LABELS[s.type] || 'РАБ';
          const bTop = si > 0 ? 'border-top:1px solid #191920;' : '';
          html += '<div style="' + bTop + 'padding:5px 12px;display:flex;align-items:center;gap:8px">';
          html += '<span style="font-size:8px;font-weight:700;color:' + col + ';width:20px;flex-shrink:0">' + lbl + '</span>';
          const sWDisp = s.weightMode === 'bw' ? 'СВ' : (s.weightMode === 'assist' ? '−' + s.weight + 'кг' : s.weight);
          html += '<span style="font-size:13px;font-weight:600;color:var(--tx2)">' + sWDisp + '×' + s.reps + '</span>';
          if (s.rpe) html += '<span style="font-size:9px;color:#9b87f0;margin-left:3px">RPE ' + s.rpe + '</span>';
          if (s.type === 'work') {
            const setTon = s.weight * s.reps;
            if (setTon > 0) html += '<span style="font-size:9px;color:#484858;margin-left:auto">' + setTon + ' кг</span>';
          }
          html += '</div>';
        });
      } else {
        html += '<div style="padding:9px 12px;font-size:11px;color:var(--sb)">Подходов нет</div>';
      }

      html += '</div>';
    });

    return html;
};

