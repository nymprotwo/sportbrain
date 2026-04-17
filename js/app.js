// ═══ APP & DIARY ═══
// ─────────────── APP ───────────────
const App = {
  nav(tab) {
    State.tab = tab;
    document.querySelectorAll('.nav button').forEach(b => {
      b.classList.toggle('active', b.id === 'nav-' + tab);
    });
    this.render();
  },

  render() {
    const sc = document.getElementById('screen');
    const nav = document.getElementById('nav');
    sc.innerHTML = '';
    sc.className = 'fadein';

    // ── Auth screen (required until logged in) ──
    if (State.auth.showScreen) {
      try {
        sc.innerHTML = Screens.authScreen();
      } catch(e) {
        sc.innerHTML = '<div style="padding:40px 24px;text-align:center;color:var(--sb);font-size:13px">Ошибка: ' + e.message + '</div>';
        console.error('authScreen error:', e);
      }
      if (nav) nav.style.display = 'none';
      return;
    }

    const _stage = State.diary.stage;
    if (nav) nav.style.display = '';

    try {
      if (State.tab === 'workout')  sc.innerHTML = Screens.workout();
      if (State.tab === 'home')     sc.innerHTML = Screens.home();
      if (State.tab === 'programs') sc.innerHTML = State.programNav.active ? Screens.programDetail() : Screens.programs();
      if (State.tab === 'bio')      sc.innerHTML = Screens.bio();
    } catch(e) {
      sc.innerHTML = '<div style="padding:24px;color:#e06060;font-size:12px">Ошибка: ' + e.message + '</div>';
      console.error('Render error:', e);
    }

    // ── Отступ снизу под фиксированные кнопки ────────
    const fab = document.getElementById('fab-start');
    if (fab) fab.innerHTML = '';
    if (_stage === 'browse') {
      sc.style.paddingBottom = '220px'; // место под фиксированную кнопку + воздух
    } else {
      sc.style.paddingBottom = '';
    }

    this.renderModal();
    // Auto-save active training
    if (State.diary.stage === 'active' || State.diary.stage === 'regress_check') Storage.saveTraining();
  },

  renderModal() {
    const root = document.getElementById('modal-root');
    root.innerHTML = '';
    if (!State.modal) return;
    const fn = {swap: Modals.swap, note: Modals.note, program: Modals.program, dark: Modals.dark};
    if (fn[State.modal.type]) root.innerHTML = fn[State.modal.type]();
  },

  closeModal() {
    State.modal = null;
    document.getElementById('modal-root').innerHTML = '';
  },

  timerToggle() {
    const t = State.timer;
    if (t.on) {
      clearInterval(t._iv);
      t.on = false;
    } else {
      t.on = true;
      t._iv = setInterval(() => {
        t.sec++;
        const el = document.getElementById('timer-display');
        if (el) el.textContent = '⏸ ' + fmt(t.sec);
      }, 1000);
    }
    App.render();
  },

  timerReset() {
    clearInterval(State.timer._iv);
    State.timer = {on: false, sec: 0, _iv: null};
    App.render();
  },

  timerStart() {
    clearInterval(State.timer._iv);
    State.timer.sec = 0;
    State.timer.on  = true;
    State.timer._iv = setInterval(() => {
      State.timer.sec++;
      // Обновляем без полного рендера
      const ex = State.diary.workout[State.diary.activeIdx];
      const restSec = ex ? parseInt(ex.rest || '120') : 120;
      const el = document.getElementById('timer-display');
      if (el) el.textContent = fmt(Math.min(State.timer.sec, restSec));
    }, 1000);
  },
};

// ─────────────── DIARY ACTIONS ───────────────
const Diary = {
  toggleMuscle(m) {
    const ms = State.diary.muscles;
    State.diary.muscles = ms.includes(m) ? ms.filter(x => x !== m) : [...ms, m];
    App.render();
  },

  toggleExercise(muscle, exId) {
    const sel = State.diary.selections;
    const cur = sel[muscle] || [];
    sel[muscle] = cur.includes(exId) ? cur.filter(x => x !== exId) : [...cur, exId];
    App.render();
  },

  buildWorkout() {
    const blocks = [];
    State.diary.muscles.forEach(muscle => {
      (State.diary.selections[muscle] || []).forEach(exId => {
        const ex = (EXERCISES[muscle] || []).find(e => e.id === exId);
        if (ex) blocks.push({
          id: ex.id, name: ex.name, muscle,
          grip: (ex.grips && ex.grips[0]) || 'medium', equip: (ex.equip && ex.equip[0]) || 'barbell', tut: 'normal', rest: '120',
          accent: (ex.accents && ex.accents[0]) || null,
          equipChosen: true, gripChosen: true, setupDone: false,
          sets: [], note: '',
        });
      });
    });
    if (!blocks.length) return;
    State.diary.workout = blocks;
    State.diary.activeIdx = 0;
    State.diary.stage = 'active';
    App.render();
  },

  addSet() {
    const ex  = State.diary.workout[State.diary.activeIdx];
    const inp = State.diary.input || { type: 'work', weight: 0, reps: 1, rpe: null, mode: 'normal', grip: null, stance: null, position: null, weightMode: null };
    const effectiveWeight = (inp.weightMode === 'bw') ? 0 : inp.weight;
    const newSet = { type: inp.type, weight: effectiveWeight, reps: inp.reps, rpe: inp.rpe, mode: inp.mode || 'normal', grip: inp.grip || null, stance: inp.stance || null, position: inp.position || null, weightMode: inp.weightMode || null };
    ex.sets.push(newSet);
    addSet(ex.id, newSet); // DB layer: persist immediately
    const p  = prevOf(ex.id);
    const n  = ex.sets.length;
    const ck = [ex.id, ex.equip, ex.grip, ex.accent, ex.tut !== 'normal' ? ex.tut : null].filter(Boolean).join('_');
    const h  = HISTORY[ck] || null;
    const curMode     = inp.mode || 'normal';
    const curGrip     = inp.grip || null;
    const curStance   = inp.stance || null;
    const curPosition = inp.position || null;
    // ── Адаптивная подсказка следующего подхода ──
    const r25 = w => Math.round(w / 2.5) * 2.5;
    const lastSet  = ex.sets[ex.sets.length - 1];
    const lastType = lastSet.type;
    // Если разминка без веса (bodyweight) — берём 40% от рабочего как базу
    const lastW    = lastSet.weight > 0 ? lastSet.weight : r25(p.w * 0.4);
    const hasNonWork = ex.sets.some(s => s.type !== 'work');

    if (!hasNonWork) {
      // Все рабочие — без разминки, повторяем последний
      State.diary.input = { type:'work', weight: lastSet.weight, reps: lastSet.reps, rpe:null, mode: curMode, grip: curGrip, stance: curStance, position: curPosition, _hint: null };
    } else if (lastType === 'warmup') {
      // После разминки → подводящий +25%
      const nw  = r25(lastW * 1.25);
      const pct = Math.round((nw / lastW - 1) * 100);
      State.diary.input = { type:'leadup', weight: nw, reps: 5, rpe:null, mode: curMode, grip: curGrip, stance: curStance, position: curPosition, _hint: 'Подводящий: ' + nw + ' кг (+' + pct + '%)' };
    } else if (lastType === 'leadup') {
      if (lastW >= p.w * 0.82) {
        // Достаточно подводки → рабочий
        const ww = Math.max(r25(p.w), lastW);
        State.diary.input = { type:'work', weight: ww, reps: p.r, rpe:null, mode: curMode, grip: curGrip, stance: curStance, position: curPosition, _hint: null };
      } else {
        // Ещё один подводящий +25%
        const nw  = r25(lastW * 1.25);
        const pct = Math.round((nw / lastW - 1) * 100);
        State.diary.input = { type:'leadup', weight: nw, reps: 4, rpe:null, mode: curMode, grip: curGrip, stance: curStance, _hint: 'Подводящий: ' + nw + ' кг (+' + pct + '%)' };
      }
    } else {
      // Последний был рабочим → повторяем
      State.diary.input = { type:'work', weight: lastSet.weight, reps: lastSet.reps, rpe:null, mode: curMode, grip: curGrip, stance: curStance, position: curPosition, _hint: null };
    }
    App.timerStart();
    App.render();
  },

  updateInput(field, val) {
    if (!State.diary.input) State.diary.input = { type: 'work', weight: 0, reps: 1, rpe: null, mode: 'normal', grip: null };
    State.diary.input[field] = val;
    // Ручное изменение типа или веса сбрасывает подсказку
    if (field === 'type' || field === 'weight') State.diary.input._hint = null;
    App.render();
  },

  cycleInputType() {
    const types = ['warmup', 'leadup', 'work'];
    const inp = State.diary.input;
    if (!inp) return;
    inp.type = types[(types.indexOf(inp.type) + 1) % types.length];
    App.render();
  },

  cycleInputRpe() {
    const vals = [null, 6, 7, 8, 9, 10];
    const inp = State.diary.input;
    if (!inp) return;
    inp.rpe = vals[(vals.indexOf(inp.rpe) + 1) % vals.length];
    App.render();
  },

  cycleRpe(si) {
    const s = State.diary.workout[State.diary.activeIdx].sets[si];
    const vals = [null, 6, 7, 8, 9, 10];
    s.rpe = vals[(vals.indexOf(s.rpe) + 1) % vals.length];
    App.render();
  },

  updateSet(si, field, val) {
    State.diary.workout[State.diary.activeIdx].sets[si][field] = val;
    App.render();
  },

  updateExField(field, val) {
    const ex = State.diary.workout[State.diary.activeIdx];
    ex[field] = val;
    if (field === 'equip') ex.equipChosen = true;
    if (field === 'grip') ex.gripChosen = true;
    App.render();
  },

  startExercise() {
    const ex = State.diary.workout[State.diary.activeIdx];
    ex.setupDone = true;
    const p  = prevOf(ex.id);
    const ck = [ex.id, ex.equip, ex.grip, ex.accent, ex.tut !== 'normal' ? ex.tut : null].filter(Boolean).join('_');
    const h  = HISTORY[ck] || null;
    const hw = h ? h.sets.find(s => s.type === 'warmup') : null;
    // Инициализируем форму из истории (если есть) или дефолт
    State.diary.input = {
      type:     'warmup',
      weight:   hw ? hw.weight : Math.round(p.w * 0.5 / 2.5) * 2.5,
      reps:     hw ? hw.reps   : 12,
      rpe:      null,
      position: ex.defaultPosition || null,
      _hint:    null,
    };
    App.render();
  },

  removeSet(si) {
    const ex = State.diary.workout[State.diary.activeIdx];
    ex.sets.splice(si, 1);
    deleteSet(ex.id, si); // DB layer: sync deletion
    if (State.diary.rowEditIdx === si) State.diary.rowEditIdx = -1;
    App.render();
  },

  toggleRowEditMode() {
    State.diary.rowEditMode = !State.diary.rowEditMode;
    State.diary.rowEditIdx  = -1;
    App.render();
  },

  openRowEdit(si) {
    State.diary.rowEditIdx = State.diary.rowEditIdx === si ? -1 : si;
    App.render();
  },

  updateSetField(si, field, val) {
    const s = State.diary.workout[State.diary.activeIdx].sets[si];
    s[field] = val;
    App.render();
  },

  setRpeForRow(si, val) {
    const s = State.diary.workout[State.diary.activeIdx].sets[si];
    s.rpe = s.rpe === val ? null : val;
    App.render();
  },

  cycleSetType(si) {
    const types = ['warmup', 'leadup', 'work'];
    const ex = State.diary.workout[State.diary.activeIdx];
    const cur = ex.sets[si].type;
    ex.sets[si].type = types[(types.indexOf(cur) + 1) % types.length];
    App.render();
  },

  goTo(idx) {
    State.diary.activeIdx = idx;
    App.render();
  },

  swapExercise(newId, muscle) {
    const newEx = (EXERCISES[muscle] || []).find(e => e.id === newId);
    if (!newEx) return;
    State.diary.workout[State.diary.activeIdx] = {
      id: newEx.id, name: newEx.name, muscle,
      grip: (newEx.grips && newEx.grips[0]) || 'medium', equip: (newEx.equip && newEx.equip[0]) || 'barbell', tut: 'normal', rest: '120',
      accent: (newEx.accents && newEx.accents[0]) || null,
      equipChosen: true, gripChosen: true, setupDone: false,
      sets: [], note: '',
    };
    App.closeModal();
    App.render();
  },

  saveNote(txt) {
    State.diary.workout[State.diary.activeIdx].note = txt;
    App.closeModal();
    App.render();
  },

  finish() {
    // Считаем общий тоннаж текущей тренировки (все подходы)
    const curTon = State.diary.workout.reduce((a, e) =>
      a + e.sets.reduce((s, set) => s + set.weight * set.reps, 0), 0);

    // Считаем суммарный исторический тоннаж по тем же упражнениям
    let histTon = 0;
    State.diary.workout.forEach(ex => {
      const ck = [ex.id, ex.equip, ex.grip, ex.accent, ex.tut !== 'normal' ? ex.tut : null].filter(Boolean).join('_');
      const h = HISTORY[ck];
      if (h) histTon += h.sets.reduce((s, set) => s + set.weight * set.reps, 0);
    });

    // Если тоннаж значительно ниже (>12%) → показать экран "что повлияло"
    if (histTon > 0 && curTon > 0 && curTon < histTon * 0.88) {
      State.diary._regressData = { curTon, histTon, reasons: [] };
      State.diary.stage = 'regress_check';
      App.render();
      return;
    }

    Diary._doFinish();
  },

  startProgramWorkout(weekIdx, dayIdx, programId) {
    const structure = PROGRAM_STRUCTURE[programId];
    if (!structure) return;
    const week = structure[weekIdx];
    if (!week) return;
    const day = week.days[dayIdx];
    if (!day) return;

    // Запускаем тренировку с мета-данными программы
    startWorkout({ type: 'program', programId, weekIdx, dayIdx });

    // Строим план из упражнений дня
    State.diary.plan = [];
    day.exercises.forEach(ex => {
      const mapped = PROG_EX_MAP[ex.name];
      if (!mapped) return;
      State.diary.plan.push({
        exId:   mapped.exId,
        name:   mapped.name,
        muscle: mapped.muscle,
        equip:  mapped.equip,
        accent: null,
        grip:   null,
      });
    });

    // Загружаем план в workout и переходим к первому упражнению
    State.diary.workout  = [];
    State.diary.muscles  = [];
    State.diary.selections = {};
    State.diary.activeIdx = 0;
    State.diary.stage    = 'build';

    // Добавляем все упражнения сразу из плана
    State.diary.plan.forEach(ex => {
      const exObj = { id: ex.exId, name: ex.name, muscle: ex.muscle, equip: ex.equip, accent: ex.accent, grip: ex.grip };
      addExercise(exObj);
      State.diary.workout.push({ ...exObj, sets: [], finished: false });
    });

    State.diary.stage    = 'active';
    State.diary.activeIdx = 0;
    Storage.saveTraining();
    App.render();
  },

  _doFinish() {
    // Save to history only if at least one set was performed
    const totalSets = State.diary.workout.reduce((a, e) => a + e.sets.length, 0);
    if (totalSets > 0) {
      const totalTon = State.diary.workout.reduce((a, e) =>
        a + e.sets.reduce((s, set) => s + set.weight * set.reps, 0), 0);
      const d = new Date();
      const months = ['янв','фев','мар','апр','май','июн','июл','авг','сен','окт','ноя','дек'];
      const dateStr = d.getDate() + ' ' + months[d.getMonth()] + ' ' + d.getFullYear();
      Storage.addHistory({
        date:          dateStr,
        ts:            Date.now(),
        exerciseCount: State.diary.workout.length,
        totalTonnage:  totalTon,
        exercises:     State.diary.workout.map(ex => ({ name: ex.name, workSets: ex.sets.filter(s => s.type === 'work').length })),
      });
      finishWorkout(); // DB layer: move currentWorkout → workouts[]

      // Авто-прогрессия активной программы
      const ap = getActiveProgram();
      if (ap && DB.workouts[0] && DB.workouts[0].type === 'program' && DB.workouts[0].programId === ap.programId) {
        const structure = PROGRAM_STRUCTURE[ap.programId];
        if (structure) {
          const week = structure[ap.weekIdx];
          let nextDayIdx  = ap.dayIdx + 1;
          let nextWeekIdx = ap.weekIdx;
          if (!week || nextDayIdx >= week.days.length) {
            nextDayIdx  = 0;
            nextWeekIdx = ap.weekIdx + 1;
          }
          if (structure[nextWeekIdx]) {
            setActiveProgram({ ...ap, weekIdx: nextWeekIdx, dayIdx: nextDayIdx });
          } else {
            // Программа завершена
            clearActiveProgram();
          }
        }
      }
    }
    Storage.clearCurrent();
    State.diary.stage        = 'browse';
    State.diary.muscles      = [];
    State.diary.selections   = {};
    State.diary.plan         = [];
    State.diary.workout      = [];
    State.diary.activeIdx    = 0;
    State.diary._regressData = null;
    App.render();
  },

  saveRegressReasons(reasons) {
    // Сохраняем причины (в будущем — в историю или на сервер)
    if (State.diary._regressData) {
      State.diary._regressData.reasons = reasons;
      // TODO: persist to HISTORY or analytics storage
    }
    Diary._doFinish();
  },

  // ── Selector helpers ──────────────────────────
  selectorSetMuscle(muscle) {
    State.selector = { muscle, categoryId: null, typeId: null, equip: null, accent: null, grip: null };
    App.render();
  },
  selectorSetCategory(catId) {
    State.selector.categoryId = catId;
    State.selector.typeId = null;
    State.selector.equip = null;
    State.selector.accent = null;
    State.selector.grip = null;
    App.render();
  },
  selectorSetType(typeId) {
    State.selector.typeId = typeId;
    State.selector.equip = null;
    State.selector.accent = null;
    State.selector.grip = null;
    App.render();
  },
  selectorSetEquip(equip) { State.selector.equip = equip; App.render(); },
  selectorSetAccent(accent) { State.selector.accent = accent; App.render(); },
  selectorSetGrip(grip) { State.selector.grip = grip; App.render(); },

  addToPlan() {
    const sel = State.selector;
    const categories = MOVEMENT_TREE[sel.muscle] || null;
    let exId, equip, accent, grip;
    if (categories) {
      // Tree-based selection
      // Если одна категория — она авто-выбрана (ДВИЖЕНИЕ шаг скрыт)
      const effectiveCatId = sel.categoryId || (categories.length === 1 ? categories[0].id : null);
      const cat = categories.find(c => c.id === effectiveCatId);
      if (!cat) return;
      const type = cat.types.find(t => t.id === sel.typeId) || (cat.types.length === 1 ? cat.types[0] : null);
      if (!type) return;
      // exId: либо фиксированный, либо по снаряду (equipsExMap), либо по акценту
      let accentEquip = null;
      // Предварительно вычисляем снаряд (нужен для equipsExMap)
      // При наличии accentEquips берём первый доступный для текущего акцента
      const _eqPool = (type.accentEquips && sel.accent && type.accentEquips[sel.accent]) || type.equips;
      const preEquip = type.fixedEquip || sel.equip || (_eqPool && _eqPool[0]);
      if (type.exId) {
        exId = type.exId;
      } else if (type.equipsExMap && preEquip && type.equipsExMap[preEquip]) {
        // exId определяется выбранным снарядом (напр. Махи: гантели→shoulder_raise, блок→cable_raise)
        exId = type.equipsExMap[preEquip];
      } else if (type.accentEquipsExMap && sel.accent && preEquip) {
        // exId определяется комбинацией акцента + снаряда (напр. Французский жим лёжа+штанга)
        const accentExMap = type.accentEquipsExMap[sel.accent];
        if (accentExMap && accentExMap[preEquip]) exId = accentExMap[preEquip];
      } else if (type.accents && sel.accent) {
        const accentObj = type.accents.find(a => a.id === sel.accent);
        exId = accentObj ? accentObj.exId : null;
        // Акцент может нести в себе equipId (напр. тяга в наклоне: штанга/смит/гантели)
        if (accentObj && accentObj.equipId) accentEquip = accentObj.equipId;
      }
      if (!exId) return;
      // equip: фиксированный снаряд > снаряд из акцента > выбор пользователя > первый из списка
      equip  = type.fixedEquip || accentEquip || sel.equip || (type.equips && type.equips[0]) || 'barbell';
      // Авто-выбор акцента если для данного снаряда он единственный
      const effAcc = (type.equipAccents && equip && type.equipAccents[equip]) || type.accents;
      accent = sel.accent || (effAcc && effAcc.length === 1 ? effAcc[0].id : null);
      const tg = type.grips || [];
      // если grips:null — хват задаётся на уровне сета, не упражнения
      grip = type.grips === null ? null : (sel.grip || (tg.includes('medium') ? 'medium' : tg[0]) || 'medium');
    } else {
      // Flat fallback: typeId = exId
      exId   = sel.typeId;
      const exData = Object.values(EXERCISES).flat().find(e => e.id === exId);
      if (!exData) return;
      equip  = sel.equip  || (exData.equip  && exData.equip[0])  || 'barbell';
      accent = sel.accent || (exData.accents && exData.accents[0]) || null;
      grip   = sel.grip   || (exData.grips   && exData.grips[0])  || 'medium';
    }
    const exData = Object.values(EXERCISES).flat().find(e => e.id === exId);
    if (!exData) return;
    if (!grip) grip = (exData.grips && exData.grips[0]) || 'medium';
    // Если добавляем во время активной тренировки — идём в workout, не в plan
    if (State.diary.midWorkoutAdd) {
      const block = {
        id: exId, name: exData.name, muscle: sel.muscle,
        equip, accent, grip: grip || 'medium', tut: 'normal', rest: '120',
        equipChosen: true, gripChosen: true, setupDone: false,
        sets: [], note: '',
      };
      State.diary.workout.push(block);
      addExercise(block);
      State.diary.midWorkoutAdd = false;
      State.diary.stage = 'active';
      State.selector.typeId = null; State.selector.equip = null;
      State.selector.accent = null; State.selector.grip  = null;
      App.render();
      return;
    }
    State.diary.plan.push({ exId, name: exData.name, muscle: sel.muscle, equip, accent, grip });
    // Reset type/equip/accent but keep muscle+category for fast re-add
    State.selector.typeId = null;
    State.selector.equip  = null;
    State.selector.accent = null;
    State.selector.grip   = null;
    App.render();
  },

  removeFromPlan(idx) {
    State.diary.plan.splice(idx, 1);
    App.render();
  },

  removeFromWorkout(idx) {
    const d = State.diary;
    d.workout.splice(idx, 1);
    if (d.activeIdx >= idx) d.activeIdx = Math.max(-1, d.activeIdx - 1);
    App.render();
  },

  addMidWorkout() {
    State.diary.midWorkoutAdd = true;
    State.diary.stage = 'select';
    State.selector = { muscle: null, categoryId: null, typeId: null, equip: null, accent: null, grip: null };
    App.render();
  },

  movePlan(idx, dir) {
    const plan = State.diary.plan;
    const to = idx + dir;
    if (to < 0 || to >= plan.length) return;
    [plan[idx], plan[to]] = [plan[to], plan[idx]];
    App.render();
  },

  startWorkout() {
    const blocks = State.diary.plan.map(p => ({
      id: p.exId, name: p.name, muscle: p.muscle,
      equip: p.equip, grip: p.grip, tut: 'normal', rest: '120',
      accent: p.accent,
      equipChosen: true, gripChosen: true, setupDone: false,
      sets: [], note: '',
    }));
    if (!blocks.length) return;
    State.diary.workout = blocks;
    State.diary.activeIdx = -1;
    State.diary.stage = 'active';
    // DB layer: create new workout and register all planned exercises
    startWorkout();
    blocks.forEach(b => addExercise(b));
    App.render();
  },
};

