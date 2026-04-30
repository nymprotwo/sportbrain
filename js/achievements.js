// ═══ ACHIEVEMENTS SYSTEM ═══

// ─── Definition format ─────────────────────────────────────
// { id, cat, icon, title, desc, target, unit, eval(data) → number }
// Achievement unlocked when eval(data) >= target
// unit: 'workout'|'ton'|'kg'|'rep'|'set'|'ex'|'day'|null (null = binary, no bar)

const ACH_CATS = {
  start:    'СТАРТ',
  volume:   'ОБЪЁМ',
  exercise: 'УПРАЖНЕНИЯ',
  progress: 'ПРОГРЕСС',
  streak:   'СЕРИИ',
  variety:  'РАЗНООБРАЗИЕ',
  fun:      'ФАН',
};

const ACH_DEFS = [
  // ── СТАРТ ────────────────────────────────────────────────
  { id:'first_step',     cat:'start',    icon:'🚀', title:'Первый шаг',          desc:'Заверши первую тренировку',                   target:1,    unit:null,      eval: d => d.total },
  { id:'in_the_game',    cat:'start',    icon:'💪', title:'В деле',              desc:'Заверши 5 тренировок',                         target:5,    unit:'workout', eval: d => d.total },
  { id:'first_goal_set', cat:'start',    icon:'🎯', title:'Цель поставлена',     desc:'Добавь первую цель на экране Фокус',           target:1,    unit:null,      eval: d => d.goals },
  { id:'first_tonnage',  cat:'start',    icon:'⚖️', title:'Первый тоннаж',      desc:'Выполни первый рабочий подход с весом',         target:1,    unit:null,      eval: d => d.totalTon > 0 ? 1 : 0 },
  { id:'week_starter',   cat:'start',    icon:'📅', title:'Стартовая неделя',    desc:'Заверши 3 тренировки за первую неделю',        target:3,    unit:'workout', eval: d => d.firstWeekCount },
  { id:'dedicated',      cat:'start',    icon:'🏅', title:'Преданный',           desc:'Заверши 4 тренировки за любые 7 дней',         target:4,    unit:'workout', eval: d => d.bestWeekCount },

  // ── ОБЪЁМ — тренировки ───────────────────────────────────
  { id:'w10',            cat:'volume',   icon:'🔟', title:'10 тренировок',       desc:'Заверши 10 тренировок',                         target:10,   unit:'workout', eval: d => d.total },
  { id:'w25',            cat:'volume',   icon:'💥', title:'25 тренировок',       desc:'25 тренировок позади',                          target:25,   unit:'workout', eval: d => d.total },
  { id:'w50',            cat:'volume',   icon:'🏆', title:'Полтинник',           desc:'50 тренировок — ты серьёзен',                   target:50,   unit:'workout', eval: d => d.total },
  { id:'w100',           cat:'volume',   icon:'💯', title:'Сотня',              desc:'100 завершённых тренировок',                     target:100,  unit:'workout', eval: d => d.total },
  { id:'w200',           cat:'volume',   icon:'🌟', title:'200 тренировок',      desc:'200 тренировок — настоящий спортсмен',          target:200,  unit:'workout', eval: d => d.total },
  { id:'w365',           cat:'volume',   icon:'📅', title:'Год в игре',          desc:'365 завершённых тренировок',                    target:365,  unit:'workout', eval: d => d.total },
  { id:'w500',           cat:'volume',   icon:'🔥', title:'500 тренировок',      desc:'500 тренировок — легенда',                      target:500,  unit:'workout', eval: d => d.total },
  { id:'w1000',          cat:'volume',   icon:'👑', title:'1000 тренировок',     desc:'Зал — твой второй дом',                         target:1000, unit:'workout', eval: d => d.total },

  // ── ОБЪЁМ — тоннаж за сессию ─────────────────────────────
  { id:'ses_ton1',       cat:'volume',   icon:'🏋️', title:'Тонна за раз',       desc:'1000 кг за одну тренировку',                    target:1,    unit:null,      eval: d => d.maxTonSession },
  { id:'ses_ton2',       cat:'volume',   icon:'💪', title:'Две тонны',          desc:'2 тонны за одну тренировку',                     target:2,    unit:null,      eval: d => d.maxTonSession },
  { id:'ses_ton5',       cat:'volume',   icon:'⚡', title:'Пять тонн',          desc:'5 тонн за одну тренировку',                      target:5,    unit:null,      eval: d => d.maxTonSession },
  { id:'ses_ton10',      cat:'volume',   icon:'🌋', title:'10 тонн за раз',     desc:'10 тонн за одну тренировку',                     target:10,   unit:null,      eval: d => d.maxTonSession },
  { id:'ses_ton15',      cat:'volume',   icon:'💎', title:'15 тонн за раз',     desc:'15 тонн за одну тренировку — монстр',            target:15,   unit:null,      eval: d => d.maxTonSession },

  // ── ОБЪЁМ — суммарный тоннаж ─────────────────────────────
  { id:'tot_5t',         cat:'volume',   icon:'📦', title:'5 тонн суммарно',     desc:'5 тонн суммарного тоннажа',                     target:5,    unit:'ton',     eval: d => d.totalTon },
  { id:'tot_10t',        cat:'volume',   icon:'📦', title:'10 тонн',            desc:'10 тонн суммарного тоннажа',                     target:10,   unit:'ton',     eval: d => d.totalTon },
  { id:'tot_25t',        cat:'volume',   icon:'📦', title:'25 тонн',            desc:'25 тонн суммарного тоннажа',                     target:25,   unit:'ton',     eval: d => d.totalTon },
  { id:'tot_50t',        cat:'volume',   icon:'🚛', title:'50 тонн',            desc:'50 тонн суммарного тоннажа',                     target:50,   unit:'ton',     eval: d => d.totalTon },
  { id:'tot_100t',       cat:'volume',   icon:'🏗️', title:'100 тонн',           desc:'100 тонн — ты подъёмный кран',                  target:100,  unit:'ton',     eval: d => d.totalTon },
  { id:'tot_250t',       cat:'volume',   icon:'🌍', title:'250 тонн',           desc:'250 тонн суммарного тоннажа',                    target:250,  unit:'ton',     eval: d => d.totalTon },
  { id:'tot_500t',       cat:'volume',   icon:'🌍', title:'500 тонн',           desc:'Половина мегатонны',                             target:500,  unit:'ton',     eval: d => d.totalTon },
  { id:'tot_1000t',      cat:'volume',   icon:'☄️', title:'1000 тонн',          desc:'Килотонна мощи',                                target:1000, unit:'ton',     eval: d => d.totalTon },

  // ── УПРАЖНЕНИЯ — повторения ──────────────────────────────
  { id:'reps100_ses',    cat:'exercise', icon:'🔁', title:'Сотня за раз',        desc:'100 рабочих повторений за тренировку',          target:100,  unit:'rep',     eval: d => d.maxRepsSession },
  { id:'reps200_ses',    cat:'exercise', icon:'🔁', title:'200 за раз',          desc:'200 рабочих повторений за тренировку',          target:200,  unit:'rep',     eval: d => d.maxRepsSession },
  { id:'reps500_ses',    cat:'exercise', icon:'⚙️', title:'500 повторов',       desc:'500 повторений за тренировку',                   target:500,  unit:'rep',     eval: d => d.maxRepsSession },
  { id:'tot_reps1k',     cat:'exercise', icon:'📊', title:'1000 повторов всего', desc:'1000 рабочих повторений суммарно',              target:1000, unit:'rep',     eval: d => d.totalReps },
  { id:'tot_reps5k',     cat:'exercise', icon:'📊', title:'5000 повторов',       desc:'5000 рабочих повторений суммарно',             target:5000, unit:'rep',     eval: d => d.totalReps },
  { id:'tot_reps10k',    cat:'exercise', icon:'📊', title:'10000 повторов',      desc:'10 тысяч рабочих повторений',                  target:10000,unit:'rep',     eval: d => d.totalReps },

  // ── УПРАЖНЕНИЯ — подходы ─────────────────────────────────
  { id:'sets5_ses',      cat:'exercise', icon:'💪', title:'5 подходов',          desc:'5 рабочих подходов за тренировку',              target:5,    unit:'set',     eval: d => d.maxSetsSession },
  { id:'sets10_ses',     cat:'exercise', icon:'💪', title:'10 подходов',         desc:'10 рабочих подходов за тренировку',             target:10,   unit:'set',     eval: d => d.maxSetsSession },
  { id:'sets15_ses',     cat:'exercise', icon:'💪', title:'15 подходов',         desc:'15 рабочих подходов за тренировку',             target:15,   unit:'set',     eval: d => d.maxSetsSession },
  { id:'sets20_ses',     cat:'exercise', icon:'🔩', title:'20 подходов',         desc:'20 рабочих подходов за тренировку',             target:20,   unit:'set',     eval: d => d.maxSetsSession },
  { id:'tot_sets100',    cat:'exercise', icon:'📋', title:'100 подходов',        desc:'100 рабочих подходов суммарно',                 target:100,  unit:'set',     eval: d => d.totalSets },
  { id:'tot_sets500',    cat:'exercise', icon:'📋', title:'500 подходов',        desc:'500 рабочих подходов суммарно',                 target:500,  unit:'set',     eval: d => d.totalSets },
  { id:'tot_sets1k',     cat:'exercise', icon:'📋', title:'1000 подходов',       desc:'1000 рабочих подходов суммарно',                target:1000, unit:'set',     eval: d => d.totalSets },

  // ── РАЗНООБРАЗИЕ ─────────────────────────────────────────
  { id:'ex5',            cat:'variety',  icon:'🎨', title:'5 упражнений',        desc:'Освой 5 разных упражнений',                     target:5,    unit:'ex',      eval: d => d.uniqueEx },
  { id:'ex10',           cat:'variety',  icon:'🎨', title:'10 упражнений',       desc:'10 разных упражнений в арсенале',               target:10,   unit:'ex',      eval: d => d.uniqueEx },
  { id:'ex25',           cat:'variety',  icon:'🎭', title:'25 упражнений',       desc:'25 разных упражнений — знаток',                  target:25,   unit:'ex',      eval: d => d.uniqueEx },
  { id:'ex50',           cat:'variety',  icon:'🗺️', title:'50 упражнений',       desc:'50 упражнений — мастер зала',                   target:50,   unit:'ex',      eval: d => d.uniqueEx },
  { id:'muscles3',       cat:'variety',  icon:'🧩', title:'3 группы мышц',       desc:'Тренируй 3 разные группы мышц',                 target:3,    unit:'ex',      eval: d => d.uniqueMuscles },
  { id:'muscles5',       cat:'variety',  icon:'🧩', title:'5 групп мышц',        desc:'5 разных групп мышц в арсенале',                target:5,    unit:'ex',      eval: d => d.uniqueMuscles },
  { id:'muscles_all',    cat:'variety',  icon:'🏅', title:'Полный охват',         desc:'Тренируй все 7 групп мышц',                    target:7,    unit:'ex',      eval: d => d.uniqueMuscles },
  { id:'equip5',         cat:'variety',  icon:'🔧', title:'Арсенал',             desc:'Используй 5 разных снарядов',                   target:5,    unit:'ex',      eval: d => d.uniqueEquips },

  // ── ЖИМ ЛЁЖА ─────────────────────────────────────────────
  { id:'bench60',        cat:'progress', icon:'🏋️', title:'Жим 60 кг',          desc:'Рабочий вес в жиме лёжа ≥ 60 кг',               target:60,   unit:null,      eval: d => d.benchMax },
  { id:'bench80',        cat:'progress', icon:'🏋️', title:'Жим 80 кг',          desc:'Рабочий вес в жиме лёжа ≥ 80 кг',               target:80,   unit:null,      eval: d => d.benchMax },
  { id:'bench100',       cat:'progress', icon:'💯', title:'Жим сотки',           desc:'100 кг в жиме лёжа!',                           target:100,  unit:null,      eval: d => d.benchMax },
  { id:'bench120',       cat:'progress', icon:'⚡', title:'Жим 120 кг',          desc:'120 кг в жиме — серьёзный уровень',             target:120,  unit:null,      eval: d => d.benchMax },
  { id:'bench140',       cat:'progress', icon:'🔥', title:'Жим 140 кг',          desc:'140 кг в жиме — элита',                         target:140,  unit:null,      eval: d => d.benchMax },
  { id:'bench160',       cat:'progress', icon:'👑', title:'Жим 160 кг',          desc:'160 кг в жиме — легенда',                       target:160,  unit:null,      eval: d => d.benchMax },

  // ── ПРИСЕД ───────────────────────────────────────────────
  { id:'squat80',        cat:'progress', icon:'🦵', title:'Присед 80 кг',        desc:'Рабочий вес в приседе ≥ 80 кг',                 target:80,   unit:null,      eval: d => d.squatMax },
  { id:'squat100',       cat:'progress', icon:'🦵', title:'Присед 100 кг',       desc:'100 кг в приседе',                              target:100,  unit:null,      eval: d => d.squatMax },
  { id:'squat120',       cat:'progress', icon:'💪', title:'Присед 120 кг',       desc:'120 кг в приседе',                              target:120,  unit:null,      eval: d => d.squatMax },
  { id:'squat140',       cat:'progress', icon:'🦵', title:'Присед 140 кг',       desc:'140 кг в приседе',                              target:140,  unit:null,      eval: d => d.squatMax },
  { id:'squat160',       cat:'progress', icon:'🔱', title:'Присед 160 кг',       desc:'160 кг в приседе — чемпион',                    target:160,  unit:null,      eval: d => d.squatMax },
  { id:'squat180',       cat:'progress', icon:'👑', title:'Присед 180 кг',       desc:'180 кг в приседе — это мощь',                   target:180,  unit:null,      eval: d => d.squatMax },

  // ── СТАНОВАЯ ТЯГА ────────────────────────────────────────
  { id:'dl100',          cat:'progress', icon:'⛓️', title:'Тяга 100 кг',         desc:'100 кг в становой тяге',                        target:100,  unit:null,      eval: d => d.dlMax },
  { id:'dl120',          cat:'progress', icon:'⛓️', title:'Тяга 120 кг',         desc:'120 кг в становой тяге',                        target:120,  unit:null,      eval: d => d.dlMax },
  { id:'dl140',          cat:'progress', icon:'⛓️', title:'Тяга 140 кг',         desc:'140 кг в становой тяге',                        target:140,  unit:null,      eval: d => d.dlMax },
  { id:'dl160',          cat:'progress', icon:'🔑', title:'Тяга 160 кг',         desc:'160 кг в становой — сильный человек',           target:160,  unit:null,      eval: d => d.dlMax },
  { id:'dl180',          cat:'progress', icon:'🏆', title:'Тяга 180 кг',         desc:'180 кг в становой тяге',                        target:180,  unit:null,      eval: d => d.dlMax },
  { id:'dl200',          cat:'progress', icon:'👑', title:'Тяга двести',         desc:'200 кг в становой — легенда',                   target:200,  unit:null,      eval: d => d.dlMax },

  // ── ЖИМ СТОЯ ─────────────────────────────────────────────
  { id:'ohp40',          cat:'progress', icon:'🙌', title:'ОХП 40 кг',           desc:'40 кг в жиме стоя (штангой)',                   target:40,   unit:null,      eval: d => d.ohpMax },
  { id:'ohp60',          cat:'progress', icon:'🙌', title:'ОХП 60 кг',           desc:'60 кг в жиме стоя',                             target:60,   unit:null,      eval: d => d.ohpMax },
  { id:'ohp80',          cat:'progress', icon:'🙌', title:'ОХП 80 кг',           desc:'80 кг в жиме стоя — мощные плечи',              target:80,   unit:null,      eval: d => d.ohpMax },
  { id:'ohp100',         cat:'progress', icon:'🙌', title:'ОХП 100 кг',          desc:'100 кг в жиме стоя — редкость',                 target:100,  unit:null,      eval: d => d.ohpMax },

  // ── ПРОГРЕСС ─────────────────────────────────────────────
  { id:'prog_first',     cat:'progress', icon:'📈', title:'Первый прогресс',     desc:'Прибавь вес в любом упражнении',                target:1,    unit:null,      eval: d => d.progFirst },
  { id:'prog10',         cat:'progress', icon:'📈', title:'+10 кг',             desc:'Прибавь 10 кг в любом упражнении',               target:10,   unit:null,      eval: d => d.progMax },
  { id:'prog20',         cat:'progress', icon:'🚀', title:'+20 кг',             desc:'Прибавь 20 кг в любом упражнении',               target:20,   unit:null,      eval: d => d.progMax },
  { id:'prog50',         cat:'progress', icon:'🌟', title:'+50 кг',             desc:'Прибавь 50 кг в любом упражнении от старта',     target:50,   unit:null,      eval: d => d.progMax },

  // ── СЕРИИ ────────────────────────────────────────────────
  { id:'streak2',        cat:'streak',   icon:'🔥', title:'2 подряд',            desc:'2 тренировки подряд',                           target:2,    unit:'day',     eval: d => d.maxStreak },
  { id:'streak3',        cat:'streak',   icon:'🔥', title:'3 подряд',            desc:'3 тренировки подряд',                           target:3,    unit:'day',     eval: d => d.maxStreak },
  { id:'streak5',        cat:'streak',   icon:'🔥', title:'5 дней подряд',       desc:'5 тренировок подряд',                           target:5,    unit:'day',     eval: d => d.maxStreak },
  { id:'streak7',        cat:'streak',   icon:'🌟', title:'Неделя',              desc:'7 тренировок подряд — неделя без пропусков',    target:7,    unit:'day',     eval: d => d.maxStreak },
  { id:'streak10',       cat:'streak',   icon:'⚡', title:'10 дней подряд',      desc:'10 тренировок подряд',                          target:10,   unit:'day',     eval: d => d.maxStreak },
  { id:'streak14',       cat:'streak',   icon:'💥', title:'Две недели',          desc:'14 тренировок подряд',                          target:14,   unit:'day',     eval: d => d.maxStreak },
  { id:'streak21',       cat:'streak',   icon:'🏆', title:'Три недели',          desc:'21 тренировка подряд',                          target:21,   unit:'day',     eval: d => d.maxStreak },
  { id:'streak30',       cat:'streak',   icon:'👑', title:'Месяц',               desc:'30 тренировок подряд — железная воля',          target:30,   unit:'day',     eval: d => d.maxStreak },

  // ── ФАН ──────────────────────────────────────────────────
  { id:'monday',         cat:'fun',      icon:'📅', title:'Понедельник',         desc:'Потренируйся в понедельник',                    target:1,    unit:null,      eval: d => d.mondayCount },
  { id:'monday5',        cat:'fun',      icon:'📅', title:'5 понедельников',     desc:'5 тренировок в понедельник',                   target:5,    unit:'workout', eval: d => d.mondayCount },
  { id:'friday_pump',    cat:'fun',      icon:'🎉', title:'Пятничный памп',      desc:'Потренируйся в пятницу',                        target:1,    unit:null,      eval: d => d.fridayCount },
  { id:'friday5',        cat:'fun',      icon:'🎊', title:'5 пятниц',            desc:'5 тренировок в пятницу',                       target:5,    unit:'workout', eval: d => d.fridayCount },
  { id:'weekend1',       cat:'fun',      icon:'🌅', title:'Выходной? Нет.',      desc:'Потренируйся в выходной день',                  target:1,    unit:null,      eval: d => d.weekendCount },
  { id:'weekend5',       cat:'fun',      icon:'🌅', title:'5 выходных',          desc:'5 тренировок в выходные',                      target:5,    unit:'workout', eval: d => d.weekendCount },
  { id:'night_owl',      cat:'fun',      icon:'🦉', title:'Ночная сессия',       desc:'Тренировка после 22:00',                        target:1,    unit:null,      eval: d => d.nightCount },
  { id:'early_bird',     cat:'fun',      icon:'🌄', title:'Ранний подъём',       desc:'Тренировка до 7 утра',                          target:1,    unit:null,      eval: d => d.earlyCount },
  { id:'beast_mode',     cat:'fun',      icon:'🦁', title:'Beast Mode',          desc:'2 тренировки в один день',                      target:1,    unit:null,      eval: d => d.twiceInDay },
  { id:'marathon',       cat:'fun',      icon:'🏃', title:'Марафон',             desc:'10 упражнений в одной тренировке',              target:10,   unit:'ex',      eval: d => d.maxExSession },
  { id:'minimalist',     cat:'fun',      icon:'🎯', title:'Минималист',          desc:'Тренировка ровно с одним упражнением',          target:1,    unit:null,      eval: d => d.hasOneExSession },
  { id:'high_freq',      cat:'fun',      icon:'⚙️', title:'Высокая частота',     desc:'30 тренировок за 35 дней',                     target:30,   unit:'workout', eval: d => d.last35Count },
  { id:'no_rest',        cat:'fun',      icon:'💀', title:'Без отдыха',          desc:'4 тренировки за 4 дня подряд',                  target:4,    unit:'day',     eval: d => d.maxStreak },
];

// ─── Data computation ───────────────────────────────────────
function computeAchData(workouts) {
  const goals = State.goals || [];

  // Tonnage helpers (skip BW/assist)
  const setTon = s => (s.weightMode === 'bw' || s.weightMode === 'assist') ? 0 : (s.weight || 0) * (s.reps || 0);
  const exTon  = ex => ex.sets.filter(s => s.type === 'work').reduce((a, s) => a + setTon(s), 0);
  const wTon   = w  => w.exercises.reduce((a, ex) => a + exTon(ex), 0);

  const allSessionTons = workouts.map(wTon);
  const totalTonKg     = allSessionTons.reduce((a, b) => a + b, 0);
  const maxTonSession  = allSessionTons.length ? Math.max(...allSessionTons) / 1000 : 0; // in tonnes

  // Reps / sets
  const wReps = w => w.exercises.reduce((a, ex) => a + ex.sets.filter(s => s.type === 'work').reduce((b, s) => b + (s.reps || 0), 0), 0);
  const wSets = w => w.exercises.reduce((a, ex) => a + ex.sets.filter(s => s.type === 'work').length, 0);
  const allSessionReps = workouts.map(wReps);
  const allSessionSets = workouts.map(wSets);
  const totalReps      = allSessionReps.reduce((a, b) => a + b, 0);
  const totalSets      = allSessionSets.reduce((a, b) => a + b, 0);
  const maxRepsSession = allSessionReps.length ? Math.max(...allSessionReps) : 0;
  const maxSetsSession = allSessionSets.length ? Math.max(...allSessionSets) : 0;

  // Unique exercises / muscles / equips
  const uniqueEx      = new Set(workouts.flatMap(w => w.exercises.map(ex => ex.id))).size;
  const uniqueMuscles = new Set(workouts.flatMap(w => w.exercises.map(ex => ex.muscle).filter(Boolean))).size;
  const uniqueEquips  = new Set(workouts.flatMap(w => w.exercises.map(ex => ex.equip).filter(Boolean))).size;

  // Max weight by exercise filter
  const getMax = fn => {
    let m = 0;
    workouts.forEach(w => w.exercises.forEach(ex => {
      if (!fn(ex)) return;
      ex.sets.filter(s => s.type === 'work' && s.weightMode !== 'bw' && s.weightMode !== 'assist')
        .forEach(s => { m = Math.max(m, s.weight || 0); });
    }));
    return m;
  };
  const nm = ex => (ex.name || '').toLowerCase();
  const benchMax = getMax(ex => nm(ex).includes('жим') && (ex.muscle === 'Грудь'));
  const squatMax = getMax(ex => nm(ex).includes('присед'));
  const dlMax    = getMax(ex => nm(ex).includes('становая'));
  const ohpMax   = getMax(ex => nm(ex).includes('жим') && ex.muscle === 'Плечи');

  // Streaks
  const dateSet = new Set(workouts.map(w => w.date.slice(0, 10)));
  const dates   = [...dateSet].sort();
  let maxStreak = dates.length ? 1 : 0;
  let runS = 1;
  for (let i = 1; i < dates.length; i++) {
    const diff = Math.round((new Date(dates[i]) - new Date(dates[i - 1])) / 86400000);
    runS = diff === 1 ? runS + 1 : 1;
    if (runS > maxStreak) maxStreak = runS;
  }
  let currentStreak = 0;
  const today0 = new Date(); today0.setHours(0, 0, 0, 0);
  for (let dd = new Date(today0); ; dd.setDate(dd.getDate() - 1)) {
    if (dateSet.has(dd.toISOString().slice(0, 10))) currentStreak++;
    else break;
    if (currentStreak > 10000) break; // safety
  }

  // Date-based fun stats
  const wDates     = workouts.map(w => new Date(w.date));
  const mondayCount  = wDates.filter(d => d.getDay() === 1).length;
  const fridayCount  = wDates.filter(d => d.getDay() === 5).length;
  const weekendCount = wDates.filter(d => d.getDay() === 0 || d.getDay() === 6).length;
  const nightCount   = wDates.filter(d => d.getHours() >= 22).length;
  const earlyCount   = wDates.filter(d => d.getHours() < 7).length;

  // Two in one day
  const dayMap = {};
  workouts.forEach(w => { const dk = w.date.slice(0, 10); dayMap[dk] = (dayMap[dk] || 0) + 1; });
  const twiceInDay = Object.values(dayMap).some(c => c >= 2) ? 1 : 0;

  // Max / special sessions
  const maxExSession   = workouts.length ? Math.max(...workouts.map(w => w.exercises.filter(ex => ex.sets.some(s => s.type === 'work')).length)) : 0;
  const hasOneExSession = workouts.some(w => w.exercises.filter(ex => ex.sets.some(s => s.type === 'work')).length === 1) ? 1 : 0;

  // Last 35 days count
  const cutoff35 = Date.now() - 35 * 86400000;
  const last35Count = workouts.filter(w => new Date(w.date).getTime() >= cutoff35).length;

  // First week count (oldest 7-day window)
  let firstWeekCount = 0, bestWeekCount = 0;
  if (dates.length) {
    const first = new Date(dates[0]);
    const firstEnd = new Date(first); firstEnd.setDate(first.getDate() + 6); firstEnd.setHours(23, 59, 59, 999);
    firstWeekCount = workouts.filter(w => { const d = new Date(w.date); return d >= first && d <= firstEnd; }).length;
    // Best any 7-day window
    dates.forEach(d => {
      const ws = new Date(d); const we = new Date(d); we.setDate(ws.getDate() + 6); we.setHours(23, 59, 59, 999);
      const c = workouts.filter(w => { const wd = new Date(w.date); return wd >= ws && wd <= we; }).length;
      if (c > bestWeekCount) bestWeekCount = c;
    });
  }

  // Progress: per-exercise improvement
  const exFirstW = {}, exLastW = {};
  workouts.slice().reverse().forEach(w => {
    w.exercises.forEach(ex => {
      const mx = ex.sets.filter(s => s.type === 'work' && s.weightMode !== 'bw' && s.weightMode !== 'assist')
        .reduce((m, s) => Math.max(m, s.weight || 0), 0);
      if (mx > 0) {
        if (exFirstW[ex.id] === undefined) exFirstW[ex.id] = mx;
        exLastW[ex.id] = mx;
      }
    });
  });
  let progFirst = 0, progMax = 0;
  Object.keys(exFirstW).forEach(id => {
    const diff = (exLastW[id] || 0) - exFirstW[id];
    if (diff > 0) { progFirst = 1; progMax = Math.max(progMax, diff); }
  });

  return {
    total: workouts.length,
    totalTon: totalTonKg / 1000, // in tonnes
    maxTonSession,
    totalReps, maxRepsSession,
    totalSets, maxSetsSession,
    uniqueEx, uniqueMuscles, uniqueEquips,
    benchMax, squatMax, dlMax, ohpMax,
    maxStreak, currentStreak,
    mondayCount, fridayCount, weekendCount, nightCount, earlyCount,
    twiceInDay, maxExSession, hasOneExSession,
    last35Count, firstWeekCount, bestWeekCount,
    progFirst, progMax,
    goals: goals.length,
  };
}

// ─── Evaluate all achievements ──────────────────────────────
function evaluateAchievements(workouts) {
  const data  = computeAchData(workouts);
  let saved   = {};
  try { saved = JSON.parse(localStorage.getItem('sb_ach') || '{}'); } catch(e) {}

  let changed = false;
  const now   = Date.now();

  const result = ACH_DEFS.map(a => {
    const cur      = a.eval(data);
    const unlocked = cur >= a.target;
    if (unlocked && !saved[a.id]) {
      saved[a.id] = now;
      changed = true;
    }
    const unlockedAt = saved[a.id] || null;
    const isNew      = unlockedAt && (now - unlockedAt) < 86400000; // <24h

    return {
      ...a,
      cur:       Math.min(cur, a.target),
      pct:       Math.min(1, cur / a.target),
      unlocked,
      unlockedAt,
      isNew,
    };
  });

  if (changed) {
    try { localStorage.setItem('sb_ach', JSON.stringify(saved)); } catch(e) {}
    // Cloud sync when logged in
    if (typeof State !== 'undefined' && State.auth && State.auth.status === 'authed'
        && typeof cloudSaveAchievements === 'function') {
      cloudSaveAchievements(saved).catch(() => {});
    }
  }

  return result;
}

// ─── Select achievements for home screen ───────────────────
function selectHomeAchs(all) {
  // 1. Recently unlocked (< 24h)
  const fresh    = all.filter(a => a.isNew).slice(0, 2);
  // 2. Almost done: not unlocked, pct > 0, sorted by pct desc
  const close    = all.filter(a => !a.unlocked && a.pct > 0)
                      .sort((a, b) => b.pct - a.pct).slice(0, 3);
  // 3. Beginner unlocked ones (to show the system exists)
  const beginner = all.filter(a => a.unlocked && !a.isNew && a.cat === 'start').slice(0, 2);
  // 4. Not-started low-target ones (no slice — fill remaining spots up to 5)
  const easy     = all.filter(a => !a.unlocked && a.pct === 0)
                      .sort((a, b) => a.target - b.target);

  const seen = new Set();
  const picks = [];
  [...fresh, ...close, ...beginner, ...easy].forEach(a => {
    if (!seen.has(a.id) && picks.length < 5) { seen.add(a.id); picks.push(a); }
  });
  return picks;
}

// ─── Format progress label ──────────────────────────────────
function achProgressLabel(a) {
  if (a.target === 1) return null;
  const c = a.cur, t = a.target;
  switch (a.unit) {
    case 'ton':     return (c < 1 ? Math.round(c * 1000) + ' кг' : c.toFixed(1) + ' т') + ' / ' + t + ' т';
    case 'workout': return c + ' / ' + t + ' тр';
    case 'rep':     return c + ' / ' + t + ' пов';
    case 'set':     return c + ' / ' + t + ' подх';
    case 'ex':      return c + ' / ' + t + ' уп';
    case 'day':     return c + ' / ' + t + ' дн';
    default:        return c + ' / ' + t;
  }
}
