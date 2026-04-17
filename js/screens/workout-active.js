// ═══ SCREEN: WORKOUT ACTIVE ═══

Screens.workoutActive = function() {
    const d = State.diary;

    // ── Список упражнений (пользователь выбирает с чего начать) ──
    if (d.activeIdx === -1) {
      // Считаем прогресс для шапки
      const doneCount = d.workout.filter(w => w.setupDone && w.sets.filter(s=>s.type==='work').length > 0).length;
      const totalCount = d.workout.length;

      let html = '';

      // Шапка
      html += '<div style="display:flex;align-items:center;gap:10px;margin-bottom:16px">';
      html += '<button class="btn btn-ghost" onclick="State.diary.stage=\'select\';App.render()">‹</button>';
      html += '<div><span class="lbl">ТРЕНИРОВКА</span>';
      html += '<div class="ttl" style="font-size:28px">Текущая тренировка</div></div>';
      html += '</div>';

      // Прогресс + подсказка
      html += '<div style="background:var(--sf);border:1px solid var(--br);border-radius:12px;padding:12px 16px;margin-bottom:20px;display:flex;align-items:center;justify-content:space-between">';
      html += '<div style="font-size:12px;color:var(--sb)">👇 Нажми на упражнение, чтобы начать</div>';
      html += '<div style="font-size:13px;font-weight:700;color:' + (doneCount === totalCount && totalCount > 0 ? '#4a8a4a' : 'var(--ac)') + '">' + doneCount + ' / ' + totalCount + '</div>';
      html += '</div>';

      d.workout.forEach((w, i) => {
        const eq = EQUIPMENT_LIST.find(e => e.id === w.equip);
        const ac = ACCENT_LIST.find(a => a.id === w.accent);
        const workSets = w.sets.filter(s => s.type === 'work').length;

        // Статус
        const isDone    = w.setupDone && workSets > 0;
        const isActive  = w.setupDone && workSets === 0;
        // idle = !w.setupDone

        let cardBg     = 'var(--sf)';
        let cardBorder = 'var(--br)';
        let nameColor  = 'var(--tx2)';
        let opacity    = '1';
        let statusEl   = '';

        if (isDone) {
          // ● Зелёный — завершено
          cardBg     = '#121a12';
          cardBorder = 'rgba(72,130,72,.35)';
          nameColor  = '#7a9a7a';
          opacity    = '.75';
          statusEl   = '<div style="width:14px;height:14px;border-radius:50%;background:#4a8a4a;box-shadow:0 0 8px rgba(72,160,72,.4);flex-shrink:0"></div>';
        } else if (isActive) {
          // ● Жёлтый — в процессе
          cardBorder = 'var(--ac40)';
          cardBg     = 'var(--ac04)';
          statusEl   = '<div style="width:14px;height:14px;border-radius:50%;background:var(--ac);box-shadow:0 0 8px var(--ac50);flex-shrink:0"></div>';
        } else {
          // ○ Серый — не начато
          cardBorder = 'var(--br)';
          statusEl   = '<div style="width:14px;height:14px;border-radius:50%;background:transparent;border:2px solid #3a3c40;flex-shrink:0"></div>';
        }

        html += '<div style="position:relative;width:100%;padding:14px 16px;border-radius:12px;border:1px solid ' + cardBorder + ';background:' + cardBg + ';text-align:left;cursor:pointer;font-family:inherit;margin-bottom:8px;display:flex;align-items:center;gap:12px;opacity:' + opacity + ';transition:opacity .2s;box-sizing:border-box" onclick="Diary.goTo(' + i + ')">';
        html += '<div style="flex:1" onclick="Diary.goTo(' + i + ')">';
        const displayName = formatExName(w.name, w.equip, w.accent, w.muscle);
        html += '<div style="font-size:14px;font-weight:700;color:' + nameColor + ';margin-bottom:' + (isDone && workSets > 0 ? '6px' : '0') + '">' + displayName + '</div>';
        if (isDone && workSets > 0) {
          html += '<div style="display:flex;gap:5px;flex-wrap:wrap">';
          html += '<span style="padding:2px 7px;border-radius:6px;border:1px solid rgba(80,140,80,.2);background:rgba(80,140,80,.08);font-size:9px;color:#6a8a6a">' + workSets + ' подх</span>';
          html += '</div>';
        }
        html += '</div>';
        html += statusEl;
        html += '<button onclick="event.stopPropagation();if(confirm(\'Удалить ' + w.name.replace(/'/g, '') + '?\'))Diary.removeFromWorkout(' + i + ')" style="background:none;border:none;color:#2a2c30;cursor:pointer;font-size:16px;padding:4px 2px;flex-shrink:0;line-height:1" title="Удалить">✕</button>';
        html += '</div>';
      });

      // Кнопка добавить + кнопка завершить
      html += '<div style="margin-top:12px;display:flex;flex-direction:column;gap:8px">';
      html += '<button onclick="Diary.addMidWorkout()" style="width:100%;padding:12px;border-radius:12px;border:1px solid var(--ac25);background:var(--ac04);color:var(--ac);font-size:13px;font-weight:600;font-family:inherit;cursor:pointer;letter-spacing:.3px">+ Добавить упражнение</button>';
      if (doneCount === totalCount && totalCount > 0) {
        html += '<button onclick="Diary.finish()" class="btn btn-accent btn-full" style="border-radius:14px;font-size:14px;padding:14px;box-shadow:0 0 18px var(--ac30)">✓ Завершить тренировку</button>';
      } else {
        html += '<button onclick="Diary.finish()" style="width:100%;padding:13px;border-radius:14px;border:1px solid #2a2b2e;background:transparent;color:#A0A2A8;font-size:13px;font-weight:600;font-family:inherit;cursor:pointer;letter-spacing:.5px">Завершить тренировку</button>';
      }
      html += '</div>';

      return html;
    }

    const ex = d.workout[d.activeIdx];
    if (!ex) return '';

    const wSets  = ex.sets.filter(s => s.type === 'work');
    const wmSets = ex.sets.filter(s => s.type === 'warmup');
    const ldSets = ex.sets.filter(s => s.type === 'leadup');
    const wTon   = workTonnage(ex);
    const pTon   = prevTonnage(ex);
    const timer  = State.timer;
    const p      = prevOf(ex.id);

    const exData      = Object.values(EXERCISES).flat().find(e => e.id === ex.id);
    const availGrips  = exData ? exGrips(exData) : GRIPS_LIST;
    const availEquip  = exData ? exEquip(exData) : EQUIPMENT_LIST;
    const availAccents = (exData && exData.accents) ? ACCENT_LIST.filter(a => exData.accents.includes(a.id)) : [];
    // Хват показываем только если снаряд его поддерживает (не гантели, не тренажёры)
    const showGrip = availGrips.length > 1 && GRIP_EQUIPS.has(ex.equip);
    const gripObj     = availGrips.find(g => g.id === ex.grip);
    const equipObj    = availEquip.find(e => e.id === ex.equip);
    const accentObj   = availAccents.find(a => a.id === ex.accent);
    const tutShortMap = {normal:'Обычный', pause1:'Пауза 1с', pause3:'Пауза 3с', pause_mid:'Пауза в середине', negative3:'Негатив 3с', slow:'4-0-4'};
    const tutShort    = tutShortMap[ex.tut] || '';
    const workRpes    = wSets.filter(s => s.rpe).map(s => s.rpe);
    const maxRpe      = workRpes.length ? Math.max(...workRpes) : null;
    const canProgress = wSets.length >= p.s && wSets.length > 0
      && wSets.every(s => s.reps >= p.r)
      && workRpes.length === wSets.length && Math.max(...workRpes) <= 8;

    // Config key: движение_снаряд_хват_акцент_темп
    const configKey = [ex.id, ex.equip, ex.grip, ex.accent, ex.tut !== 'normal' ? ex.tut : null]
      .filter(Boolean).join('_');

    // Semantic line
    const semParts = [];
    if (accentObj) semParts.push(accentObj.name + ' грудь');
    else semParts.push(ex.muscle);
    if (gripObj && showGrip) semParts.push(gripObj.name + ' хват');
    if (ex.tut !== 'normal') semParts.push(tutShort);
    const semLine = semParts.join(' · ');

    // Chips renderer
    const chips = (list, activeId, field) => list.map(item => {
      const on = activeId === item.id;
      return '<button onclick="Diary.updateExField(\'' + field + '\',\'' + item.id + '\')" style="padding:6px 12px;border-radius:16px;border:1px solid ' + (on?'var(--ac)':'var(--br)') + ';background:' + (on?'var(--ad)':'var(--sf)') + ';color:' + (on?'var(--ac)':'var(--mt)') + ';font-size:11px;cursor:pointer;font-family:inherit;font-weight:' + (on?'700':'400') + ';transition:all .15s">' + item.name + '</button>';
    }).join('');

    const tutChips = (activeId) => TUT_LIST.map(item => {
      const on = activeId === item.id;
      return '<button onclick="Diary.updateExField(\'tut\',\'' + item.id + '\')" style="padding:6px 12px;border-radius:16px;border:1px solid ' + (on?'var(--ac)':'var(--br)') + ';background:' + (on?'var(--ad)':'var(--sf)') + ';color:' + (on?'var(--ac)':'var(--mt)') + ';font-size:11px;cursor:pointer;font-family:inherit;font-weight:' + (on?'700':'400') + ';transition:all .15s">' + (tutShortMap[item.id]||item.name) + '</button>';
    }).join('');

    // Params block для overlay (только темп + отдых)
    const paramsBlock = () => {
      let h = '';
      if (exData && exData.notes && State.settings.hints) h += '<div style="font-size:10px;color:#9EAA8C;margin-bottom:12px;line-height:1.5">💡 ' + exData.notes + '</div>';

      // Темп
      if (State.settings.tempo) {
        h += '<div style="margin-bottom:12px"><div style="font-size:9px;color:var(--sb);letter-spacing:2px;margin-bottom:6px">ТЕМП</div>';
        h += '<div style="display:flex;flex-wrap:wrap;gap:6px">' + tutChips(ex.tut) + '</div></div>';
      }

      // Отдых
      h += '<div style="margin-bottom:12px"><div style="font-size:9px;color:var(--sb);letter-spacing:2px;margin-bottom:6px">ОТДЫХ</div>';
      h += '<div style="display:flex;flex-wrap:wrap;gap:6px">' + chips(REST_LIST, ex.rest || '120', 'rest') + '</div></div>';

      // В overlay — дополнительно снаряд/хват/акцент для корректировки
      if (availEquip.length > 1) {
        h += '<div style="margin-bottom:12px"><div style="font-size:9px;color:var(--sb);letter-spacing:2px;margin-bottom:6px">СНАРЯД</div>';
        h += '<div style="display:flex;flex-wrap:wrap;gap:6px">' + chips(availEquip, ex.equip, 'equip') + '</div></div>';
      }
      if (availAccents.length > 1) {
        h += '<div style="margin-bottom:12px"><div style="font-size:9px;color:var(--sb);letter-spacing:2px;margin-bottom:6px">АКЦЕНТ</div>';
        h += '<div style="display:flex;flex-wrap:wrap;gap:6px">' + chips(availAccents, ex.accent, 'accent') + '</div></div>';
      }
      if (showGrip) {
        h += '<div style="margin-bottom:12px"><div style="font-size:9px;color:var(--sb);letter-spacing:2px;margin-bottom:6px">ХВАТ</div>';
        h += '<div style="display:flex;flex-wrap:wrap;gap:6px">' + chips(availGrips, ex.grip, 'grip') + '</div></div>';
      }
      return h;
    };

    // ══════════════════════════════════════════════
    // SETUP SCREEN
    // ══════════════════════════════════════════════
    if (!ex.setupDone) {

      // ── Таблица эффектов ──────────────────────
      const GRIP_EFFECTS = {
        narrow:   'Акцент на трицепс',
        medium:   'Равномерная нагрузка',
        wide:     'Акцент на грудь · меньше нагрузки на трицепс',
        neutral:  'Снижение нагрузки на запястья',
        reverse:  'Акцент на бицепс',
        straight: 'Стандартная позиция',
      };
      const TUT_EFFECTS = {
        normal:    'Базовая сила · естественная скорость',
        pause1:    'Устранение инерции · стартовая сила',
        pause3:    'Максимальный контроль · сила из статики',
        pause_mid: 'Сила в слабой точке · контроль траектории',
        negative3: 'Время под нагрузкой · гипертрофия',
        slow:      'Максимальное напряжение во всей амплитуде',
      };
      const REST_EFFECTS = {
        '45':  'выносливость · плотность',
        '60':  'выносливость · плотность',
        '90':  'выносливость · плотность',
        '120': 'баланс силы и объёма',
        '180': 'баланс силы и объёма',
        '300': 'максимум силы · полный отдых',
      };
      const gripEffect = showGrip ? (GRIP_EFFECTS[ex.grip] || null) : null;
      const tutEffect  = TUT_EFFECTS[ex.tut]  || null;
      const restEffect = REST_EFFECTS[ex.rest || '120'] || null;
      const hasEffect  = gripEffect || tutEffect || restEffect;

      let html = '';
      html += '<button class="btn btn-ghost" style="margin-bottom:16px" onclick="State.diary.activeIdx=-1;App.render()">‹ Список</button>';
      html += '<span class="lbl">УПР ' + (d.activeIdx+1) + '/' + d.workout.length + ' · ' + ex.muscle.toUpperCase() + '</span>';
      html += '<div class="ttl" style="font-size:28px;margin-bottom:4px">' + ex.name + '</div>';

      // Конфигурация из планирования (снаряд / акцент)
      const planTags = [equipObj ? equipObj.name : null, accentObj ? accentObj.name : null].filter(Boolean);
      if (planTags.length) {
        html += '<div style="display:flex;gap:5px;flex-wrap:wrap;margin-bottom:16px">';
        planTags.forEach(tag => {
          html += '<span style="padding:3px 9px;border-radius:8px;border:1px solid var(--br2);background:var(--s2);font-size:10px;color:var(--ac)">' + tag + '</span>';
        });
        html += '</div>';
      } else {
        html += '<div style="margin-bottom:16px"></div>';
      }

      // ── Параметры техники ─────────────────────
      html += '<div class="card" style="padding:16px;margin-bottom:12px">';

      // 1. Хват — только если снаряд его поддерживает
      if (showGrip) {
        html += '<div style="margin-bottom:14px"><div style="font-size:9px;color:var(--sb);letter-spacing:2px;margin-bottom:6px">ХВАТ</div>';
        html += '<div style="display:flex;flex-wrap:wrap;gap:6px">' + chips(availGrips, ex.grip, 'grip') + '</div></div>';
      }

      // 2. Положение (между хватом и темпом)
      if (POSITION_EX.includes(ex.id)) {
        html += '<div style="margin-bottom:14px"><div style="font-size:9px;color:var(--sb);letter-spacing:2px;margin-bottom:6px">ПОЛОЖЕНИЕ</div>';
        html += '<div style="display:flex;flex-wrap:wrap;gap:6px">' + chips(SET_POSITIONS, ex.defaultPosition, 'defaultPosition') + '</div></div>';
      }

      // 3. Темп
      if (State.settings.tempo) {
        html += '<div style="margin-bottom:14px"><div style="font-size:9px;color:var(--sb);letter-spacing:2px;margin-bottom:6px">ТЕМП</div>';
        html += '<div style="display:flex;flex-wrap:wrap;gap:6px">' + tutChips(ex.tut) + '</div></div>';
      }

      // 4. Отдых
      html += '<div><div style="font-size:9px;color:var(--sb);letter-spacing:2px;margin-bottom:6px">ОТДЫХ</div>';
      html += '<div style="display:flex;flex-wrap:wrap;gap:6px">' + chips(REST_LIST, ex.rest || '120', 'rest') + '</div></div>';

      html += '</div>';  // end params card

      // ── 5. Эффект ─────────────────────────────
      if (hasEffect) {
        html += '<div style="background:#0f1210;border:1px solid #1e2a1e;border-radius:12px;padding:12px 14px;margin-bottom:12px">';
        html += '<div style="font-size:9px;color:#4a6a4a;letter-spacing:2px;margin-bottom:8px">ЭФФЕКТ</div>';
        if (gripEffect && showGrip) {
          html += '<div style="display:flex;align-items:baseline;gap:8px;margin-bottom:' + (tutEffect || restEffect ? '6px' : '0') + '">';
          html += '<span style="font-size:9px;color:#3a5a3a;letter-spacing:1px;white-space:nowrap">ХВАТ</span>';
          html += '<span style="font-size:12px;color:#7aaa7a">→ ' + gripEffect + '</span></div>';
        }
        if (tutEffect) {
          html += '<div style="display:flex;align-items:baseline;gap:8px;margin-bottom:' + (restEffect ? '6px' : '0') + '">';
          html += '<span style="font-size:9px;color:#3a5a3a;letter-spacing:1px;white-space:nowrap">ТЕМП</span>';
          html += '<span style="font-size:12px;color:#7aaa7a">→ ' + tutEffect + '</span></div>';
        }
        if (restEffect) {
          html += '<div style="display:flex;align-items:baseline;gap:8px">';
          html += '<span style="font-size:9px;color:#2a4a2a;letter-spacing:1px;white-space:nowrap">ОТДЫХ</span>';
          html += '<span style="font-size:12px;color:#5a8a5a">→ ' + restEffect + '</span></div>';
        }
        html += '</div>';
      }

      // История перенесена в Execution (после начала упражнения)

      // подсказка перенесена в экран выполнения

      html += '<button class="btn btn-accent btn-full" style="border-radius:14px;font-size:15px;padding:16px" onclick="Diary.startExercise()">▶ Начать упражнение</button>';
      return html;
    }

    // ══════════════════════════════════════════════
    // EXECUTION SCREEN
    // ══════════════════════════════════════════════
    let html = '';

    // ── Top nav: Список + Замена на одном уровне ──
    html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">';
    html += '<button class="btn btn-ghost" onclick="State.diary.activeIdx=-1;App.render()">‹ Список</button>';
    html += '<button class="btn btn-surface" style="font-size:11px" onclick="State.modal={type:\'swap\',data:{muscle:\'' + ex.muscle + '\',exId:\'' + ex.id + '\'}};App.renderModal()">⇄ Замена</button>';
    html += '</div>';

    // ── Header ────────────────────────────────────
    html += '<div style="margin-bottom:8px">';
    html += '<span class="lbl">УПР ' + (d.activeIdx+1) + '/' + d.workout.length + ' · ' + ex.muscle.toUpperCase() + '</span>';
    html += '<div class="ttl" style="font-size:26px">' + ex.name + '</div>';
    html += '<div style="display:flex;flex-wrap:wrap;align-items:center;gap:4px;margin-top:5px">';
    [equipObj ? equipObj.name : null, accentObj ? accentObj.name : null, (gripObj && showGrip) ? gripObj.name + ' хват' : null, ex.tut !== 'normal' ? tutShort : null, maxRpe ? 'RPE ' + maxRpe : null]
      .filter(Boolean).forEach(tag => {
        html += '<span style="padding:2px 7px;border-radius:8px;border:1px solid var(--br);background:#0f1011;font-size:9px;color:var(--am)">' + tag + '</span>';
      });
    html += '<button onclick="State.diary.editOverlay=true;App.render()" style="background:none;border:none;color:var(--mt);cursor:pointer;font-size:13px;padding:0;line-height:1;margin-left:2px">✏️</button>';
    html += '</div>';
    html += '</div>';

    // ── История lookup ────────────────────────────
    const histEntry = HISTORY[configKey] || null;
    const histWork   = histEntry ? histEntry.sets.filter(s => s.type === 'work') : [];
    const histTon    = histWork.reduce((a, s) => a + s.weight * s.reps, 0);
    const histAllTon = histEntry ? histEntry.sets.reduce((a, s) => a + s.weight * s.reps, 0) : 0;
    const curAllTon  = ex.sets.reduce((a, s) => a + s.weight * s.reps, 0);


    // ─── Таблица ПРОШЛАЯ | ТЕКУЩАЯ ──────────────────
    const SET_COL = {
      warmup: { label:'РЗМ', col:'#6ac882' },
      leadup: { label:'ПДВ', col:'#6aaae0' },
      work:   { label:'РАБ', col:'var(--ac)' },
    };
    const RPE_COL  = '#9b87f0';
    const histSets = histEntry ? histEntry.sets : [];
    const maxRows  = Math.max(histSets.length, ex.sets.length);
    const rowEditIdx = State.diary.rowEditIdx;

    const rBtnSt = (col) =>
      'width:30px;height:30px;border-radius:7px;border:1px solid #2a2a30;background:#0d0e0f;color:' +
      col + ';font-size:17px;cursor:pointer;line-height:1;font-family:inherit;flex-shrink:0';
    const rInpSt =
      'text-align:center;background:#0a0b0c;border:1px solid #222228;border-radius:6px;' +
      'color:#EAEAEA;font-size:14px;font-weight:700;padding:3px 2px;font-family:inherit;flex:1;min-width:0';

    html += '<div style="background:#111214;border:1px solid #252528;border-radius:12px;overflow:hidden;margin-bottom:10px">';

    // Шапка
    html += '<div style="display:grid;grid-template-columns:1fr 1px 1fr;border-bottom:1px solid #252528">';
    html += '<div style="padding:10px 14px;display:flex;align-items:center;gap:8px">';
    html += '<span style="font-size:11px;font-weight:700;color:var(--ac);letter-spacing:1px">ПРОШЛАЯ</span>';
    if (histEntry) html += '<span style="font-size:10px;color:var(--ac55)">' + histEntry.date + '</span>';
    else           html += '<span style="font-size:10px;color:#A0A2A8">нет данных</span>';
    html += '</div>';
    html += '<div style="background:#252528"></div>';
    const editMode = State.diary.rowEditMode;
    html += '<div style="padding:10px 14px;display:flex;align-items:center;justify-content:space-between">';
    html += '<span style="font-size:11px;font-weight:700;color:' + (editMode ? '#e8c84a' : 'var(--ac)') + ';letter-spacing:1px">' + (editMode ? 'ВЫБЕРИ ПОДХОД' : 'ТЕКУЩАЯ') + '</span>';
    html += '<div style="display:flex;gap:4px;align-items:center">';
    html += '<button onclick="Diary.toggleRowEditMode()" style="background:' + (editMode ? 'var(--ac18)' : 'none') + ';border:1px solid ' + (editMode ? 'var(--ac40)' : 'transparent') + ';border-radius:7px;cursor:pointer;font-size:15px;padding:3px 6px;line-height:1" title="Редактировать подходы">✏️</button>';
    html += '<button onclick="State.modal={type:\'note\'};App.renderModal()" style="background:none;border:none;cursor:pointer;font-size:17px;padding:2px;line-height:1;opacity:' + (ex.note ? '1' : '.55') + '" title="Заметка">📝</button>';
    html += '</div>';
    html += '</div>';
    html += '</div>';

    // Строки
    if (maxRows === 0) {
      html += '<div style="display:grid;grid-template-columns:1fr 1px 1fr">';
      html += '<div style="padding:22px 14px;font-size:12px;color:#A0A2A8">—</div>';
      html += '<div style="background:#252528"></div>';
      html += '<div style="padding:22px 14px;font-size:12px;color:#B4B6BC">Добавь первый подход ↓</div>';
      html += '</div>';
    } else {
      for (let ri = 0; ri < maxRows; ri++) {
        const hs = histSets[ri] || null;
        const cs = ex.sets[ri]  || null;
        const hc = hs ? (SET_COL[hs.type] || SET_COL.work) : null;
        const cc = cs ? (SET_COL[cs.type] || SET_COL.work) : null;
        const isEditing = rowEditIdx === ri && !!cs;
        const isNew     = ri === ex.sets.length - 1 && !!cs;
        const bTop = ri > 0 ? 'border-top:1px solid #1e1e24;' : '';
        const rowBg = isEditing ? 'var(--ac06)' : (editMode && cs ? 'var(--ac04)' : 'transparent');

        html += '<div class="' + (isNew ? 'fadein' : '') + '" style="' + bTop + 'background:' + rowBg + '">';
        html += '<div style="display:grid;grid-template-columns:1fr 1px 1fr">';

        // ── История (слева) ─────────────────────────
        html += '<div style="padding:7px 12px 7px 14px;display:flex;align-items:center;gap:8px">';
        if (hs) {
          html += '<span style="font-size:9px;font-weight:700;color:' + hc.col + ';width:22px;flex-shrink:0">' + hc.label + '</span>';
          const hwDisp = hs.weightMode === 'bw' ? 'СВ' : (hs.weightMode === 'assist' ? '−' + hs.weight + 'кг' : hs.weight);
          html += '<span style="font-size:13px;font-weight:400;color:#7E8088">' + hwDisp + '×' + hs.reps + '</span>';
          if (hs.rpe) html += '<span style="font-size:10px;color:' + RPE_COL + ';margin-left:auto">RPE ' + hs.rpe + '</span>';
        } else {
          html += '<span style="font-size:15px;color:#333338">—</span>';
        }
        html += '</div>';

        html += '<div style="background:#1e1e24"></div>';

        // ── Текущая (справа) — тап = редактировать (только в editMode) ───
        const rowClick = (editMode && cs) ? 'Diary.openRowEdit(' + ri + ')' : '';
        html += '<div ' + (rowClick ? 'onclick="' + rowClick + '"' : '') + ' style="padding:7px 12px 7px 14px;display:flex;align-items:center;gap:8px;' +
          (editMode && cs ? 'cursor:pointer;' : '') +
          (isEditing ? 'background:var(--ac06)' : '') +
          '" ontouchstart="State._swipeX=event.touches[0].clientX" ' +
          'ontouchend="if(State._swipeX - event.changedTouches[0].clientX > 60){event.stopPropagation();Diary.removeSet(' + ri + ')}">';
        if (cs) {
          html += '<span style="font-size:9px;font-weight:700;color:' + cc.col + ';width:22px;flex-shrink:0">' + cc.label + '</span>';
          const cwDisp = cs.weightMode === 'bw' ? 'СВ' : (cs.weightMode === 'assist' ? '−' + cs.weight + 'кг' : cs.weight);
          html += '<span style="font-size:13px;color:#EAEAEA;font-weight:400">' + cwDisp + '×' + cs.reps + '</span>';
          if (cs.rpe) html += '<span style="font-size:10px;color:' + RPE_COL + ';font-weight:600;margin-left:4px">RPE ' + cs.rpe + '</span>';
          if (cs.grip) { const gr = SET_GRIPS.find(g=>g.id===cs.grip); if(gr) html += '<span style="font-size:9px;color:#6abf7e;margin-left:4px">' + gr.name + '</span>'; }
          if (cs.stance) { const st = SET_STANCE.find(s=>s.id===cs.stance); if(st) html += '<span style="font-size:9px;color:#b07ee8;margin-left:4px">' + st.name + '</span>'; }
          if (cs.position) { const po = SET_POSITIONS.find(p=>p.id===cs.position); if(po) html += '<span style="font-size:9px;color:var(--or, #e8944a);margin-left:4px">' + po.name + '</span>'; }
          if (editMode) {
            html += '<span style="font-size:11px;color:' + (isEditing ? 'var(--ac)' : '#555560') + ';margin-left:auto;flex-shrink:0">' + (isEditing ? '✏️' : '›') + '</span>';
          } else {
            html += '<button onclick="event.stopPropagation();Diary.removeSet(' + ri + ')" style="background:none;border:none;color:#7E8088;cursor:pointer;font-size:13px;padding:2px;margin-left:auto;flex-shrink:0">✕</button>';
          }
        } else {
          html += '<span style="font-size:15px;color:#333338">—</span>';
        }
        html += '</div>';

        html += '</div>'; // end grid row

        // ── Панель редактирования ────────────────────
        if (isEditing && cs) {
          html += '<div class="fadein" style="padding:10px 14px 12px;border-top:1px solid #1e1e24;background:#0a0b0c">';

          // Тип
          html += '<div style="display:flex;gap:5px;margin-bottom:8px">';
          ['warmup','leadup','work'].forEach(t => {
            const tc2 = SET_COL[t];
            const active = cs.type === t;
            html += '<div onclick="Diary.updateSetField(' + ri + ',\'type\',\'' + t + '\')" style="flex:1;text-align:center;padding:5px 2px;border-radius:7px;cursor:pointer;user-select:none;' +
              'border:1px solid ' + (active ? tc2.col + '55' : '#252528') + ';' +
              'background:' + (active ? tc2.col + '18' : 'transparent') + '">' +
              '<span style="font-size:10px;font-weight:700;color:' + (active ? tc2.col : '#7E8088') + '">' + tc2.label + '</span></div>';
          });
          html += '</div>';

          // Положение (Стоя/Сидя) — для отдельных упражнений
          if (POSITION_EX.includes(ex.id)) {
            html += '<div style="display:flex;gap:4px;margin-bottom:8px">';
            SET_POSITIONS.forEach(p => {
              const active = cs.position === p.id;
              html += '<button onclick="Diary.updateSetField(' + ri + ',\'position\',' + (active ? 'null' : '\'' + p.id + '\'') + ')" style="flex:1;padding:4px 2px;border-radius:6px;cursor:pointer;font-size:11px;font-weight:' + (active ? '700' : '400') + ';font-family:inherit;border:1px solid ' + (active ? 'var(--ac)' : 'var(--br)') + ';background:' + (active ? 'var(--ad)' : 'var(--sf)') + ';color:' + (active ? 'var(--ac)' : 'var(--mt)') + ';transition:all .15s">' + p.name + '</button>';
            });
            html += '</div>';
          }

          // Режим веса (редактирование)
          const csWm = cs.weightMode || 'plus';
          if (WEIGHT_MODE_EX.includes(ex.id)) {
            html += '<div style="display:flex;gap:4px;margin-bottom:8px">';
            WEIGHT_MODES.forEach(m => {
              const on = csWm === m.id;
              html += '<button onclick="Diary.updateSetField(' + ri + ',\'weightMode\',\'' + m.id + '\')" style="flex:1;padding:4px 2px;border-radius:6px;cursor:pointer;font-size:9px;font-weight:700;font-family:inherit;' +
                'border:1px solid ' + (on ? 'var(--ac)55' : '#252528') + ';' +
                'background:' + (on ? 'var(--ac12)' : 'transparent') + ';' +
                'color:' + (on ? 'var(--ac)' : '#7E8088') + '">' + m.name + '</button>';
            });
            html += '</div>';
          }

          // Вес + Повт
          const csShowW = !WEIGHT_MODE_EX.includes(ex.id) || csWm !== 'bw';
          html += '<div style="display:grid;grid-template-columns:' + (csShowW ? '1fr 1fr' : '1fr') + ';gap:8px;margin-bottom:8px">';

          if (csShowW) {
            const csWLabel = WEIGHT_MODE_EX.includes(ex.id) ? (csWm === 'assist' ? 'АССИСТ, кг' : '+ВЕС, кг') : 'ВЕС, кг';
            html += '<div style="min-width:0">';
            html += '<div style="font-size:8px;color:#A0A2A8;letter-spacing:1px;margin-bottom:4px">' + csWLabel + '</div>';
            html += '<div style="display:flex;align-items:center;gap:3px;overflow:hidden">';
            html += '<button onclick="Diary.updateSetField(' + ri + ',\'weight\',' + Math.max(0, cs.weight-2.5) + ')" style="' + rBtnSt(cc.col) + '">−</button>';
            html += '<input type="text" inputmode="decimal" value="' + cs.weight + '" onfocus="this.select()" onblur="Diary.updateSetField(' + ri + ',\'weight\',parseFloat(this.value.replace(\',\',\'.\'))||0)" style="' + rInpSt + '">';
            html += '<button onclick="Diary.updateSetField(' + ri + ',\'weight\',' + (cs.weight+2.5) + ')" style="' + rBtnSt(cc.col) + '">+</button>';
            html += '</div></div>';
          }

          html += '<div style="min-width:0">';
          html += '<div style="font-size:8px;color:#A0A2A8;letter-spacing:1px;margin-bottom:4px">' + (ex.id === 'plank' ? 'ВРЕМЯ (СЕК)' : 'ПОВТОРЫ') + '</div>';
          html += '<div style="display:flex;align-items:center;gap:3px;overflow:hidden">';
          html += '<button onclick="Diary.updateSetField(' + ri + ',\'reps\',' + Math.max(1, cs.reps - (ex.id === 'plank' ? 5 : 1)) + ')" style="' + rBtnSt(cc.col) + '">−</button>';
          html += '<input type="number" inputmode="numeric" value="' + cs.reps + '" onfocus="this.select()" onchange="Diary.updateSetField(' + ri + ',\'reps\',+this.value)" style="' + rInpSt + '">';
          html += '<button onclick="Diary.updateSetField(' + ri + ',\'reps\',' + (cs.reps+1) + ')" style="' + rBtnSt(cc.col) + '">+</button>';
          html += '</div></div>';

          html += '</div>';

          // RPE кнопки
          html += '<div style="display:flex;gap:5px;margin-bottom:8px">';
          [6,7,8,9,10].forEach(v => {
            const active = cs.rpe === v;
            html += '<button onclick="Diary.setRpeForRow(' + ri + ',' + v + ')" style="flex:1;padding:6px 0;border-radius:7px;cursor:pointer;font-size:12px;font-weight:700;font-family:inherit;' +
              'border:1px solid ' + (active ? 'rgba(155,135,240,.45)' : '#252528') + ';' +
              'background:' + (active ? 'rgba(155,135,240,.15)' : '#111214') + ';' +
              'color:' + (active ? RPE_COL : '#7E8088') + '">' + v + '</button>';
          });
          html += '</div>';

          // Постановка ног (только для Ноги)
          if (ex.muscle === 'Ноги') {
            html += '<div style="display:flex;gap:4px;margin-bottom:6px">';
            SET_STANCE.forEach(s => {
              const active = cs.stance === s.id;
              html += '<button onclick="Diary.updateSetField(' + ri + ',\'stance\',' + (active ? 'null' : '\'' + s.id + '\'') + ')" style="flex:1;padding:4px 2px;border-radius:6px;cursor:pointer;font-size:9px;font-weight:700;font-family:inherit;border:1px solid ' + (active ? '#7e5fb055' : '#252528') + ';background:' + (active ? 'rgba(126,95,176,.15)' : 'transparent') + ';color:' + (active ? '#b07ee8' : '#7E8088') + '">' + s.name + '</button>';
            });
            html += '</div>';
          }

          html += '</div>'; // end edit panel
        }

        html += '</div>'; // end row wrapper
      }
    }

    // ── Тоннаж — последняя строка таблицы ───────────
    if (histAllTon > 0 || curAllTon > 0) {
      const pct = (histAllTon > 0 && curAllTon > 0)
        ? Math.round((curAllTon - histAllTon) / histAllTon * 1000) / 10 : null;
      const tc = pct !== null ? (pct > 0 ? '#5ac870' : pct < 0 ? '#e06060' : '#B4B6BC') : '#B4B6BC';
      html += '<div style="border-top:1px solid #252528;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;padding:7px 14px">';
      html += '<div style="text-align:center">';
      if (histAllTon > 0) html += '<span style="font-size:12px;font-weight:400;color:#7E8088">' + histAllTon + ' кг</span>';
      html += '</div>';
      html += '<div style="text-align:center;padding:0 8px">';
      if (pct !== null) html += '<span style="font-size:10px;font-weight:500;color:' + tc + ';white-space:nowrap">' + (pct > 0 ? '↑ +' : pct < 0 ? '↓ ' : '= ') + pct + '%</span>';
      html += '</div>';
      html += '<div style="text-align:center">';
      if (curAllTon > 0) html += '<span style="font-size:12px;font-weight:500;color:var(--ac)">' + curAllTon + ' кг</span>';
      html += '</div>';
      html += '</div>';
    }

    html += '</div>'; // end table card

    // ══ Форма добавления подхода ══════════════════
    {
      const inp = State.diary.input || { type: 'work', weight: 0, reps: 1, rpe: null, mode: 'normal' };
      const ic  = SET_COL[inp.type] || SET_COL.work;
      const iBtnSt = (col) =>
        'width:30px;height:30px;border-radius:7px;border:1px solid #2a2a30;background:#0d0e0f;color:' +
        col + ';font-size:17px;cursor:pointer;line-height:1;font-family:inherit;flex-shrink:0';
      const iInpSt =
        'text-align:center;background:#0a0b0c;border:1px solid #222228;border-radius:7px;' +
        'color:#c8cacc;font-size:13px;font-weight:400;padding:3px 2px;font-family:inherit;flex:1;min-width:0';

      html += '<div style="background:#111214;border:1px solid #252528;border-radius:12px;padding:10px;margin-bottom:10px">';

      // Тип: 3 компактные пилюли
      html += '<div style="display:flex;gap:5px;margin-bottom:8px">';
      ['warmup','leadup','work'].forEach(t => {
        const tc = SET_COL[t];
        const active = inp.type === t;
        html += '<div onclick="Diary.updateInput(\'type\',\'' + t + '\')" style="flex:1;text-align:center;padding:5px 4px;border-radius:7px;cursor:pointer;user-select:none;' +
          'border:1px solid ' + (active ? tc.col + '55' : '#1e1e24') + ';' +
          'background:' + (active ? tc.col + '18' : 'transparent') + '">';
        html += '<span style="font-size:11px;font-weight:700;letter-spacing:.5px;color:' + (active ? tc.col : '#7E8088') + '">' + tc.label + '</span>';
        html += '</div>';
      });
      html += '</div>';

      // Положение (Стоя/Сидя) — сразу после типа подхода
      if (POSITION_EX.includes(ex.id)) {
        html += '<div style="font-size:9px;color:var(--sb);letter-spacing:2px;margin-bottom:4px">ПОЛОЖЕНИЕ</div>';
        html += '<div style="display:flex;gap:5px;margin-bottom:8px">';
        SET_POSITIONS.forEach(p => {
          const active = inp.position === p.id;
          html += '<button onclick="Diary.updateInput(\'position\',' + (active ? 'null' : '\'' + p.id + '\'') + ')" style="flex:1;padding:6px 2px;border-radius:8px;cursor:pointer;font-size:11px;font-weight:' + (active ? '700' : '400') + ';font-family:inherit;border:1px solid ' + (active ? 'var(--ac)' : 'var(--br)') + ';background:' + (active ? 'var(--ad)' : 'var(--sf)') + ';color:' + (active ? 'var(--ac)' : 'var(--mt)') + ';transition:all .15s">' + p.name + '</button>';
        });
        html += '</div>';
      }

      // Подсказка следующего подхода
      if (inp._hint) {
        html += '<div style="font-size:10px;font-weight:600;color:var(--am);text-align:center;margin-bottom:7px;padding:4px 10px;background:rgba(106,170,224,.08);border:1px solid rgba(106,170,224,.15);border-radius:7px;letter-spacing:.3px">' + inp._hint + '</div>';
      }

      // Режим веса (только для брусьев и подтягиваний)
      const wm = inp.weightMode || 'plus';
      if (WEIGHT_MODE_EX.includes(ex.id)) {
        html += '<div style="display:flex;gap:4px;margin-bottom:8px">';
        WEIGHT_MODES.forEach(m => {
          const on = wm === m.id;
          html += '<button onclick="Diary.updateInput(\'weightMode\',\'' + m.id + '\')" title="' + m.hint + '" style="flex:1;padding:5px 2px;border-radius:7px;cursor:pointer;font-size:10px;font-weight:700;font-family:inherit;' +
            'border:1px solid ' + (on ? 'var(--ac)55' : '#1e1e24') + ';' +
            'background:' + (on ? 'var(--ac14)' : 'transparent') + ';' +
            'color:' + (on ? 'var(--ac)' : '#7E8088') + '">' + m.name + '</button>';
        });
        html += '</div>';
      }

      // Вес + Повт в одну строку
      const showWeight = !WEIGHT_MODE_EX.includes(ex.id) || wm !== 'bw';
      html += '<div style="display:grid;grid-template-columns:' + (showWeight ? '1fr 1fr' : '1fr') + ';gap:8px;margin-bottom:' + (inp.type === 'work' ? '6' : '8') + 'px">';

      if (showWeight) {
        const weightLabel = WEIGHT_MODE_EX.includes(ex.id) ? (wm === 'assist' ? 'АССИСТ, кг' : '+ВЕС, кг') : 'ВЕС, кг';
        html += '<div style="min-width:0">';
        html += '<div style="font-size:9px;color:#B4B6BC;letter-spacing:1px;margin-bottom:3px">' + weightLabel + '</div>';
        html += '<div style="display:flex;align-items:center;gap:4px;overflow:hidden">';
        html += '<button onclick="Diary.updateInput(\'weight\',' + Math.max(0, inp.weight-2.5) + ')" style="' + iBtnSt(ic.col) + '">−</button>';
        html += '<input type="text" inputmode="decimal" value="' + inp.weight + '" onfocus="this.select()" onblur="Diary.updateInput(\'weight\',parseFloat(this.value.replace(\',\',\'.\'))||0)" style="' + iInpSt + '">';
        html += '<button onclick="Diary.updateInput(\'weight\',' + (inp.weight+2.5) + ')" style="' + iBtnSt(ic.col) + '">+</button>';
        html += '</div></div>';
      }

      html += '<div style="min-width:0">';
      html += '<div style="font-size:9px;color:#B4B6BC;letter-spacing:1px;margin-bottom:3px">' + (ex.id === 'plank' ? 'ВРЕМЯ (СЕК)' : 'ПОВТОРЫ') + '</div>';
      html += '<div style="display:flex;align-items:center;gap:4px;overflow:hidden">';
      html += '<button onclick="Diary.updateInput(\'reps\',' + Math.max(1, inp.reps - (ex.id === 'plank' ? 5 : 1)) + ')" style="' + iBtnSt(ic.col) + '">−</button>';
      html += '<input type="number" inputmode="numeric" value="' + inp.reps + '" onfocus="this.select()" onchange="Diary.updateInput(\'reps\',+this.value)" style="' + iInpSt + '">';
      html += '<button onclick="Diary.updateInput(\'reps\',' + (inp.reps + (ex.id === 'plank' ? 5 : 1)) + ')" style="' + iBtnSt(ic.col) + '">+</button>';
      html += '</div></div>';

      html += '</div>';

      // RPE [6][7][8][9][10] — только для рабочих
      if (inp.type === 'work') {
        html += '<div style="display:flex;align-items:baseline;gap:6px;margin-bottom:4px">';
        html += '<span style="font-size:9px;color:#B4B6BC;letter-spacing:1px">RPE</span>';
        html += '<span style="font-size:9px;color:#A0A2A8">(оценка усилия)</span>';
        html += '</div>';
        html += '<div style="display:flex;gap:4px;margin-bottom:14px">';
        [6,7,8,9,10].forEach(v => {
          const active = inp.rpe === v;
          html += '<button onclick="Diary.updateInput(\'rpe\',' + (active ? 'null' : v) + ')" style="flex:1;padding:5px 0;border-radius:7px;cursor:pointer;font-size:11px;font-weight:700;font-family:inherit;' +
            'border:1px solid ' + (active ? 'rgba(155,135,240,.45)' : '#1e1e24') + ';' +
            'background:' + (active ? 'rgba(155,135,240,.15)' : '#0a0b0c') + ';' +
            'color:' + (active ? RPE_COL : '#A2A4AC') + '">' + v + '</button>';
        });
        html += '</div>';
      }

      // Постановка ног (только для Ноги)
      if (ex.muscle === 'Ноги') {
        html += '<div style="font-size:9px;color:#7E8088;letter-spacing:2px;margin-bottom:4px">ПОСТАНОВКА</div>';
        html += '<div style="display:flex;gap:5px;margin-bottom:8px">';
        SET_STANCE.forEach(s => {
          const active = inp.stance === s.id;
          html += '<button onclick="Diary.updateInput(\'stance\',' + (active ? 'null' : '\'' + s.id + '\'') + ')" style="flex:1;padding:6px 2px;border-radius:8px;cursor:pointer;font-size:9px;font-weight:700;font-family:inherit;border:1px solid ' + (active ? '#7e5fb055' : '#1e1e24') + ';background:' + (active ? 'rgba(126,95,176,.15)' : 'transparent') + ';color:' + (active ? '#b07ee8' : '#7E8088') + '">' + s.name + '</button>';
        });
        html += '</div>';
      }

      html += '<button class="btn btn-accent btn-full" style="padding:11px;font-size:13px;border-radius:10px;font-weight:700;box-shadow:0 0 14px var(--ac28);letter-spacing:.5px" onclick="Diary.addSet()">+ Подход</button>';
      html += '</div>';
    }

    // ── Завершить упражнение ──────────────────────
    html += '<button class="btn btn-accent btn-full" style="padding:14px;font-size:14px;border-radius:12px;font-weight:700;letter-spacing:.5px;margin-bottom:4px" onclick="Diary.goTo(-1)">Завершить упражнение</button>';

    // ── Edit Overlay ──────────────────────────────
    if (d.editOverlay) {
      html += '<div onclick="if(event.target===this){State.diary.editOverlay=false;App.render()}" style="position:fixed;inset:0;background:rgba(0,0,0,.7);z-index:300;display:flex;align-items:flex-end;justify-content:center">';
      html += '<div style="width:100%;max-width:430px;background:var(--sf);border-radius:20px 20px 0 0;padding:20px 20px 40px;border-top:1px solid var(--br2);max-height:85vh;overflow-y:auto" onclick="event.stopPropagation()">';
      html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">';
      html += '<div style="font-size:14px;font-weight:700;color:var(--tx2)">' + ex.name + '</div>';
      html += '<button onclick="State.diary.editOverlay=false;App.render()" style="background:var(--s2);border:1px solid var(--br);border-radius:8px;padding:6px 12px;color:var(--sb);cursor:pointer;font-size:14px;font-family:inherit">✕</button>';
      html += '</div>';
      html += paramsBlock();
      html += '</div></div>';
    }

    return html;
};

Screens.ormScreen = function() {
    const o = State.orm;
    const ORM_EX = [
      {id:'bench',    name:'Жим лёжа',      icon:'🏋️'},
      {id:'squat',    name:'Присед',         icon:'🦵'},
      {id:'deadlift', name:'Становая тяга',  icon:'⛓️'},
    ];
    const saved = get1RM();

    const back = () => { o.step = o.step === 3 ? 1 : o.step - 1; App.render(); };
    const close = () => { State.orm.active=false; App.render(); };

    const iBtnSt = 'width:34px;height:34px;border-radius:8px;border:1px solid #2a2a30;background:#0d0e0f;color:var(--ac);font-size:18px;cursor:pointer;line-height:1;font-family:inherit;flex-shrink:0';
    const iInpSt = 'text-align:center;background:#0a0b0c;border:1px solid #222228;border-radius:8px;color:#c8cacc;font-size:15px;font-weight:400;padding:6px 4px;font-family:inherit;flex:1;min-width:0';

    let html = '';

    // Шапка
    html += '<div style="display:flex;align-items:center;gap:10px;margin-bottom:20px">';
    if (o.step > 0) {
      html += '<button class="btn btn-ghost" onclick="State.orm.step=State.orm.step===3?1:State.orm.step-1;App.render()">‹</button>';
    } else {
      html += '<button class="btn btn-ghost" onclick="State.orm.active=false;App.render()">‹</button>';
    }
    html += '<div><span class="lbl">СИЛА</span><div class="ttl" style="font-size:26px">1 Повторный Максимум</div></div>';
    html += '</div>';

    // ── Шаг 0: Выбор упражнения ───────────────────
    if (o.step === 0) {

      // Sell-блок
      html += '<div style="background:linear-gradient(135deg,var(--ac10),var(--ac04));border:1px solid var(--ac20);border-radius:14px;padding:14px 16px;margin-bottom:16px">';
      html += '<div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">';
      html += '<span style="font-size:18px;line-height:1">💪</span>';
      html += '<span style="font-size:13px;font-weight:700;color:var(--tx2)">Зачем нужен 1ПМ?</span>';
      html += '</div>';
      const ormPoints = [
        ['📊', 'Точный вес на каждый подход', 'Рассчитывается по % от твоего максимума — не «на глаз»'],
        ['📈', 'Прогрессия на весь курс', 'Программа автоматически повышает нагрузку неделя за неделей'],
        ['🎯', 'Результат в 2–3 раза выше', 'Системный подход vs хаотичные тренировки'],
      ];
      ormPoints.forEach(([icon, title, sub]) => {
        html += '<div style="display:flex;align-items:flex-start;gap:10px;margin-bottom:8px">';
        html += '<span style="font-size:14px;line-height:1;margin-top:1px;flex-shrink:0">' + icon + '</span>';
        html += '<div>';
        html += '<div style="font-size:12px;font-weight:600;color:var(--tx2);margin-bottom:1px">' + title + '</div>';
        html += '<div style="font-size:10px;color:var(--sb);line-height:1.4">' + sub + '</div>';
        html += '</div>';
        html += '</div>';
      });
      html += '<div style="margin-top:4px;padding-top:10px;border-top:1px solid var(--ac12);display:flex;align-items:center;justify-content:space-between">';
      html += '<span style="font-size:10px;color:var(--ac50)">Без 1ПМ — всегда «на глаз»</span>';
      html += '<span style="font-size:11px;font-weight:700;color:var(--ac)">С 1ПМ — система</span>';
      html += '</div>';
      html += '</div>';

      html += '<div style="font-size:9px;color:var(--sb);letter-spacing:2px;margin-bottom:14px">ВЫБЕРИ УПРАЖНЕНИЕ</div>';
      ORM_EX.forEach(e => {
        const sv = saved[e.id];
        const dateStr = sv ? (function(d){const p=d.slice(0,10).split('-');return p[2]+'.'+p[1];})(sv.date) : null;
        html += '<button onclick="State.orm.exercise=\'' + e.id + '\';State.orm.step=1;State.orm.weight=0;State.orm.reps=5;State.orm.method=null;App.render()" style="width:100%;background:var(--sf);border:1px solid var(--br);border-radius:14px;padding:16px;cursor:pointer;font-family:inherit;text-align:left;margin-bottom:10px;display:flex;align-items:center;gap:14px">';
        html += '<div style="font-size:28px;flex-shrink:0">' + e.icon + '</div>';
        html += '<div style="flex:1">';
        html += '<div style="font-size:15px;font-weight:700;color:var(--tx2)">' + e.name + '</div>';
        if (sv) {
          html += '<div style="display:flex;align-items:center;gap:8px;margin-top:4px">';
          html += '<span style="font-size:13px;font-weight:700;color:var(--ac)">' + sv.value + ' кг</span>';
          html += '<span style="font-size:10px;color:var(--sb)">' + dateStr + '</span>';
          html += '</div>';
        } else {
          html += '<div style="font-size:11px;color:#3a3c40;margin-top:3px">Данных нет</div>';
        }
        html += '</div>';
        html += '<span style="font-size:18px;color:var(--sb)">›</span>';
        html += '</button>';
      });
    }

    // ── Шаг 1: Способ измерения ───────────────────
    else if (o.step === 1) {
      const exDef = ORM_EX.find(e => e.id === o.exercise);
      html += '<div style="display:flex;align-items:center;gap:10px;margin-bottom:20px">';
      html += '<span style="font-size:26px">' + (exDef ? exDef.icon : '') + '</span>';
      html += '<span style="font-size:17px;font-weight:700;color:var(--tx2)">' + (exDef ? exDef.name : '') + '</span>';
      html += '</div>';

      html += '<div style="display:flex;flex-direction:column;gap:10px">';

      // PRIMARY: Рассчитать по формуле
      html += '<button onclick="State.orm.method=\'calc\';State.orm.step=3;App.render()" style="width:100%;background:var(--gradient-primary);border:none;border-radius:14px;padding:13px 16px;cursor:pointer;font-family:inherit;text-align:left;display:flex;align-items:center;gap:12px;box-shadow:0 4px 16px var(--ac20)">';
      html += '<div style="width:40px;height:40px;border-radius:10px;background:rgba(0,0,0,.2);display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0">≈</div>';
      html += '<div style="flex:1">';
      html += '<div style="display:flex;align-items:center;gap:8px;margin-bottom:3px">';
      html += '<span style="font-size:14px;font-weight:700;color:var(--btn-main-color)">Рассчитать по формуле</span>';
      html += '<span style="font-size:8px;font-weight:700;color:var(--accent-secondary);background:rgba(0,0,0,.15);border-radius:4px;padding:2px 7px;letter-spacing:.5px">РЕКОМЕНДУЕМ</span>';
      html += '</div>';
      html += '<div style="font-size:11px;color:rgba(26,20,16,.7)">Сделай рабочий подход — мы посчитаем за тебя</div>';
      html += '</div>';
      html += '<span style="font-size:20px;color:rgba(26,20,16,.5)">›</span>';
      html += '</button>';

      // Инструкция для calc метода
      html += '<div style="background:var(--ac05);border:1px solid var(--ac12);border-radius:10px;padding:10px 14px">';
      html += '<div style="font-size:9px;color:var(--ac50);letter-spacing:2px;margin-bottom:6px">КАК ПРОВЕСТИ ТЕСТ</div>';
      [
        'Разминка: 2–3 лёгких подхода',
        'Подводящие: подходы по 3–5 повторов, прибавляя вес',
        'Рабочий подход: 3–8 повторений до отказа',
      ].forEach(tip => {
        html += '<div style="display:flex;align-items:flex-start;gap:7px;margin-bottom:3px">';
        html += '<span style="color:var(--ac);font-size:10px;flex-shrink:0;margin-top:1px">—</span>';
        html += '<span style="font-size:11px;color:var(--sb)">' + tip + '</span>';
        html += '</div>';
      });
      html += '</div>';

      // SECONDARY: Ввести вручную
      html += '<button onclick="State.orm.method=\'direct\';State.orm.step=3;App.render()" style="width:100%;background:var(--sf);border:1px solid var(--br);border-radius:14px;padding:13px 16px;cursor:pointer;font-family:inherit;text-align:left;display:flex;align-items:center;gap:12px">';
      html += '<div style="width:40px;height:40px;border-radius:10px;background:var(--ac10);border:1px solid var(--ac20);display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:700;color:var(--ac);flex-shrink:0">1</div>';
      html += '<div style="flex:1">';
      html += '<div style="font-size:14px;font-weight:700;color:var(--tx2);margin-bottom:3px">Ввести вручную</div>';
      html += '<div style="font-size:11px;color:var(--sb)">Знаешь свой максимум? Просто введи вес</div>';
      html += '</div>';
      html += '<span style="font-size:20px;color:var(--sb)">›</span>';
      html += '</button>';

      html += '</div>';
    }

    // ── Шаг 3: Ввод данных ───────────────────────
    else if (o.step === 3) {
      const exName = ORM_EX.find(e => e.id === o.exercise)?.name || '';
      html += '<div style="font-size:9px;color:var(--sb);letter-spacing:2px;margin-bottom:4px">УПРАЖНЕНИЕ</div>';
      html += '<div style="font-size:16px;font-weight:700;color:var(--tx2);margin-bottom:16px">' + exName + '</div>';

      html += '<div style="background:var(--sf);border:1px solid var(--br);border-radius:14px;padding:16px;margin-bottom:16px">';

      if (o.method === 'direct') {
        html += '<div style="font-size:9px;color:var(--sb);letter-spacing:2px;margin-bottom:10px">ВЕС, КГ (1 повторение)</div>';
        html += '<div style="display:flex;align-items:center;gap:8px">';
        html += '<button onclick="State.orm.weight=Math.max(0,State.orm.weight-2.5);App.render()" style="' + iBtnSt + '">−</button>';
        html += '<input type="text" inputmode="decimal" value="' + o.weight + '" onfocus="this.select()" onblur="State.orm.weight=parseFloat(this.value.replace(\',\',\'.\'))||0;App.render()" style="' + iInpSt + '">';
        html += '<button onclick="State.orm.weight+=2.5;App.render()" style="' + iBtnSt + '">+</button>';
        html += '</div>';
      } else {
        html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">';
        html += '<div>';
        html += '<div style="font-size:9px;color:var(--sb);letter-spacing:2px;margin-bottom:8px">ВЕС, КГ</div>';
        html += '<div style="display:flex;align-items:center;gap:6px">';
        html += '<button onclick="State.orm.weight=Math.max(0,State.orm.weight-2.5);App.render()" style="' + iBtnSt + '">−</button>';
        html += '<input type="text" inputmode="decimal" value="' + o.weight + '" onfocus="this.select()" onblur="State.orm.weight=parseFloat(this.value.replace(\',\',\'.\'))||0;App.render()" style="' + iInpSt + '">';
        html += '<button onclick="State.orm.weight+=2.5;App.render()" style="' + iBtnSt + '">+</button>';
        html += '</div></div>';
        html += '<div>';
        html += '<div style="font-size:9px;color:var(--sb);letter-spacing:2px;margin-bottom:8px">ПОВТОРЫ</div>';
        html += '<div style="display:flex;align-items:center;gap:6px">';
        html += '<button onclick="State.orm.reps=Math.max(1,State.orm.reps-1);App.render()" style="' + iBtnSt + '">−</button>';
        html += '<input type="number" inputmode="numeric" value="' + o.reps + '" onfocus="this.select()" onchange="State.orm.reps=Math.max(1,+this.value);App.render()" style="' + iInpSt + '">';
        html += '<button onclick="State.orm.reps=Math.min(30,State.orm.reps+1);App.render()" style="' + iBtnSt + '">+</button>';
        html += '</div></div>';
        html += '</div>';
      }
      html += '</div>';

      const canCalc = o.weight > 0 && (o.method === 'direct' || o.reps >= 1);
      const calcExpr = o.method === 'direct'
        ? 'State.orm.weight'
        : 'Math.round(State.orm.weight*(1+State.orm.reps/30)*10)/10';
      html += '<button ' + (canCalc ? 'onclick="State.orm.result=' + calcExpr + ';State.orm.step=4;App.render()"' : 'disabled') + ' class="btn btn-accent btn-full" style="padding:14px;font-size:14px;border-radius:12px;font-weight:700;opacity:' + (canCalc?1:.4) + '">Рассчитать →</button>';
    }

    // ── Шаг 4: Результат ─────────────────────────
    else if (o.step === 4) {
      const exName = ORM_EX.find(e => e.id === o.exercise)?.name || '';
      const prevVal = saved[o.exercise]?.value;
      const diff = prevVal ? Math.round((o.result - prevVal) * 10) / 10 : null;

      html += '<div style="background:var(--sf);border:1px solid var(--ac30);border-radius:16px;padding:24px;text-align:center;margin-bottom:16px">';
      html += '<div style="font-size:11px;color:var(--sb);letter-spacing:2px;margin-bottom:8px">' + exName.toUpperCase() + ' · 1ПМ</div>';
      html += '<div style="font-size:52px;font-weight:700;color:var(--ac);line-height:1;margin-bottom:4px">' + o.result + '</div>';
      html += '<div style="font-size:16px;color:var(--sb);margin-bottom:12px">кг</div>';
      if (diff !== null) {
        const dc = diff > 0 ? '#5ac870' : diff < 0 ? '#e06060' : '#7E8088';
        html += '<div style="font-size:12px;font-weight:600;color:' + dc + '">' + (diff > 0 ? '↑ +' : diff < 0 ? '↓ ' : '= ') + diff + ' кг к прошлому результату</div>';
      }
      if (o.method === 'calc') {
        html += '<div style="font-size:10px;color:#555560;margin-top:8px">Формула: ' + o.weight + ' × (1 + ' + o.reps + '/30)</div>';
      }
      html += '</div>';

      // Зоны от 1ПМ
      html += '<div style="font-size:9px;color:var(--sb);letter-spacing:2px;margin-bottom:8px">РАБОЧИЕ ЗОНЫ</div>';
      html += '<div style="background:var(--sf);border:1px solid var(--br);border-radius:12px;overflow:hidden;margin-bottom:16px">';
      [{pct:90,label:'Сила (1–3 пов)'},{pct:80,label:'Гипертрофия (5–8 пов)'},{pct:70,label:'Объём (10–12 пов)'},{pct:60,label:'Выносливость (15+ пов)'}].forEach((z, i) => {
        const w = Math.round(o.result * z.pct / 100 / 2.5) * 2.5;
        html += '<div style="display:flex;justify-content:space-between;align-items:center;padding:9px 14px;' + (i>0?'border-top:1px solid #1a1a1e':'') + '">';
        html += '<span style="font-size:11px;color:var(--sb)">' + z.label + '</span>';
        html += '<span style="font-size:12px;font-weight:600;color:var(--tx2)">' + w + ' кг <span style="font-size:9px;color:var(--sb);font-weight:400">(' + z.pct + '%)</span></span>';
        html += '</div>';
      });
      html += '</div>';

      html += '<div style="display:flex;gap:8px">';
      html += '<button onclick="save1RM(\'' + o.exercise + '\',' + o.result + ');State.orm.active=false;App.render()" class="btn btn-accent" style="flex:2;padding:14px;font-size:13px;border-radius:12px;font-weight:700">Сохранить</button>';
      html += '<button onclick="State.orm.active=false;App.render()" class="btn btn-surface" style="flex:1;padding:14px;font-size:12px;border-radius:12px">Закрыть</button>';
      html += '</div>';
    }

    return html;
};

Screens.workoutRegressCheck = function() {
    const rd  = State.diary._regressData || { curTon: 0, histTon: 0, reasons: [] };
    const pct = rd.histTon > 0 ? Math.round((rd.curTon - rd.histTon) / rd.histTon * 100) : 0;

    const reasons = [
      { id:'sleep',   icon:'😴', label:'Плохой сон',          hint:'Менее 6–7 часов или плохое качество' },
      { id:'stress',  icon:'🧠', label:'Высокий стресс',       hint:'Работа, личное — голова занята' },
      { id:'recover', icon:'💪', label:'Недовосстановление',   hint:'Мышцы ещё болят с прошлой тренировки' },
      { id:'food',    icon:'🍽', label:'Мало ел',              hint:'Не хватило энергии перед тренировкой' },
      { id:'bad_day', icon:'🤷', label:'Просто плохой день',   hint:'Бывает — не грузись' },
    ];

    // Текущий выбор хранится временно в State
    if (!State._regressSel) State._regressSel = {};

    let html = '<div style="padding:20px 0 100px">';

    // Иконка + заголовок
    html += '<div style="text-align:center;margin-bottom:28px">';
    html += '<div style="font-size:48px;margin-bottom:12px">📉</div>';
    html += '<div style="font-size:22px;font-weight:700;color:var(--tx2);margin-bottom:8px">Объём ниже обычного</div>';
    html += '<div style="font-size:13px;color:#A2A4AC">';
    html += rd.curTon + ' кг против ' + rd.histTon + ' кг (' + pct + '%)';
    html += '</div>';
    html += '<div style="font-size:12px;color:#A0A2A8;margin-top:6px">Что повлияло сегодня?</div>';
    html += '</div>';

    // Варианты ответов
    reasons.forEach(r => {
      const sel = !!State._regressSel[r.id];
      html += '<div onclick="State._regressSel[\'' + r.id + '\']=!' + sel + ';App.render()" style="' +
        'display:flex;align-items:center;gap:14px;padding:14px 16px;border-radius:14px;cursor:pointer;' +
        'margin-bottom:10px;user-select:none;' +
        'border:1px solid ' + (sel ? 'var(--ac45)' : '#252528') + ';' +
        'background:' + (sel ? 'var(--ac07)' : '#111214') + '">';
      html += '<span style="font-size:26px;flex-shrink:0">' + r.icon + '</span>';
      html += '<div style="flex:1">';
      html += '<div style="font-size:14px;font-weight:600;color:' + (sel ? 'var(--ac)' : 'var(--tx)') + ';margin-bottom:2px">' + r.label + '</div>';
      html += '<div style="font-size:11px;color:#A0A2A8">' + r.hint + '</div>';
      html += '</div>';
      html += '<div style="width:20px;height:20px;border-radius:6px;border:1.5px solid ' + (sel ? 'var(--ac)' : '#303038') + ';background:' + (sel ? 'var(--ac20)' : 'transparent') + ';display:flex;align-items:center;justify-content:center;flex-shrink:0">';
      if (sel) html += '<span style="font-size:12px;color:var(--ac)">✓</span>';
      html += '</div>';
      html += '</div>';
    });

    // Кнопки
    html += '<div style="display:flex;flex-direction:column;gap:8px;margin-top:20px">';
    html += '<button onclick="' +
      'Diary.saveRegressReasons(Object.keys(State._regressSel).filter(k=>State._regressSel[k]));' +
      'State._regressSel={}" ' +
      'class="btn btn-accent btn-full" style="padding:14px;font-size:14px;border-radius:12px;font-weight:700">' +
      'Сохранить и завершить</button>';
    html += '<button onclick="State._regressSel={};Diary._doFinish()" ' +
      'style="background:none;border:none;color:#A0A2A8;cursor:pointer;font-size:12px;padding:10px;font-family:inherit;letter-spacing:.5px">' +
      'Пропустить</button>';
    html += '</div>';

    html += '</div>';
    return html;
};

