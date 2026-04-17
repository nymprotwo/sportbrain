// ═══ STATE & UTILITIES ═══
const State = {
  auth: {
    showScreen: false,  // показывать только по требованию пользователя
    status: 'unauthed', // 'unauthed' | 'authed'
    user: null,
    mode: 'login',      // 'login' | 'register'
    email: '', password: '',
    error: '', loading: false,
  },
  tab: "workout",
  diary: {
    stage: "browse",   // browse | select | plan | build | active
    muscles: [],
    selections: {},    // { muscle: [exId, ...] }
    plan: [],          // [{exId, name, muscle, equip, accent, grip}]
    workout: [],
    activeIdx: 0,
    editOverlay: false,
    input: null,      // { type, weight, reps, rpe } — форма добавления подхода
    rowEditMode: false, // режим редактирования строк таблицы
    rowEditIdx: -1,     // индекс редактируемого подхода (-1 = нет)
    historyDetailId: null, // id тренировки для детального просмотра
  },
  orm: {
    active: false,
    step: 0,       // 0=intro 1=method 2=exercise 3=input 4=result
    method: null,  // 'direct' | 'calc'
    exercise: null,// 'bench' | 'squat' | 'deadlift'
    weight: 0,
    reps: 1,
    result: null,
  },
  selector: {
    muscle: null,
    categoryId: null,
    typeId: null,
    equip: null,
    accent: null,
    grip: null,
  },
  settings: {
    timer: true,
    rpe: true,
    tempo: true,
    hints: true,
  },
  supps: SUPPS_DATA.map((s, i) => ({...s, on: i === 0 || i === 1 || i === 3 || i === 5})),
  darkUnlocked: false,
  modal: null,         // { type, data }
  timer: { on: false, sec: 0, _iv: null },
  filterDays: null,
  filterGoal: null,
  showForgotten: true,
  expandedMuscles: new Set(),
  programNav: {
    active: false,    // показывать ли экран программы
    programId: null,  // id выбранной программы
    weekIdx: null,    // открытая неделя (null = список недель)
    dayIdx: null,     // открытый день (null = список дней недели)
  },
};

// ─────────────── HELPERS ───────────────
function fmt(s) {
  return String(Math.floor(s/60)).padStart(2,'0') + ':' + String(s%60).padStart(2,'0');
}
function workTonnage(ex) {
  return ex.sets.filter(s => s.type === 'work').reduce((a, s) => a + s.weight * s.reps, 0);
}
function prevTonnage(ex) {
  const p = prevOf(ex.id);
  return p.w * p.r * p.s;
}
function tonnageDiff(ex) {
  const wt = workTonnage(ex);
  const ws = ex.sets.filter(s => s.type === 'work');
  if (!wt || ws.length < prevOf(ex.id).s) return null;
  return wt - prevTonnage(ex);
}
function isRegress(ex) {
  const d = tonnageDiff(ex);
  return d !== null && d < -(prevTonnage(ex) * 0.05);
}
function hlColor(hl) {
  return hl === 'dark' ? 'var(--pu)' : hl === 'orange' ? 'var(--or)' : 'var(--ac)';
}
function tagColor(t) {
  if (t.includes('🖤')) return 'var(--pu)';
  if (t.includes('ГЗТ') || t.includes('предпочт')) return 'var(--or)';
  return 'var(--ac)';
}

// Storage и DB живут в js/storage.js (загружается перед этим скриптом)

