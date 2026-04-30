// ═══ STATE & UTILITIES ═══
const State = {
  auth: {
    showScreen: true,   // показываем на старте, скрываем после входа/гостя
    status: 'unauthed', // 'unauthed' | 'authed' | 'guest'
    user: null,
    profile: null,      // { nickname, avatar_idx } после загрузки из БД
    mode: 'login',      // 'login' | 'register'
    email: '', password: '',
    error: '', loading: false,
    profileSetup: false,   // показывать экран настройки профиля
    avatarIdx: 0,          // выбранный аватар (0-4)
    nickInput: null,       // null = не редактировался, '' = очищен, 'str' = введён
    suggestedNick: '',     // случайный ник-предложение
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
    unit: 'kg',        // 'kg' | 'lb'
    simpleMode: false, // только вес + повторы, без типов и RPE
    bgTheme: 'dark',   // 'dark' | 'grey' | 'light'
  },
  settingsPage: null,  // null | 'appearance' | 'workout' | 'account' | 'help'
  supps: SUPPS_DATA.map((s, i) => ({...s, on: i === 0 || i === 1 || i === 3 || i === 5})),
  darkUnlocked: false,
  modal: null,         // { type, data }
  timer: { on: false, sec: 0, _iv: null },
  prevTab: null,    // для кнопки «назад» из programs → откуда пришли
  filterDays: null,
  filterGoal: null,
  showForgotten: true,
  expandedMuscles: new Set(),
  goals: [],        // [{id,name,current,target,unit,weeklyGain,createdAt}]
  goalForm: { name: '', current: 0, target: 0, weeklyGain: 2.5, unit: 'кг' },
  achView: false,   // показывать экран всех достижений
  achCat: 'all',    // фильтр категории на экране достижений
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

// ─────────────── UNIT HELPERS (kg / lb) ───────────────
// Конвертация: хранение всегда в кг, отображение по настройке
function kgToLb(kg) { return Math.round(kg * 2.2046 * 2) / 2; }       // → ближайшие 0.5 lb
function lbToKg(lb) { return Math.round(lb / 2.2046 * 4) / 4; }       // → ближайшие 0.25 кг
function dispW(kg)  { return State.settings.unit === 'lb' ? kgToLb(kg) : kg; }
function unitLbl()  { return State.settings.unit === 'lb' ? 'lb' : 'кг'; }
function inputToKg(v) { return State.settings.unit === 'lb' ? lbToKg(v) : v; }
function unitStep() { return State.settings.unit === 'lb' ? lbToKg(2.5) : 2.5; }  // шаг кнопок
function saveUnit(u) {
  State.settings.unit = u;
  try { localStorage.setItem('sb_unit', u); } catch(e) {}
  if (State.auth.status === 'authed' && typeof _cloudSaveSettingsNow === 'function') _cloudSaveSettingsNow();
}
function toggleSimpleMode() {
  State.settings.simpleMode = !State.settings.simpleMode;
  try { localStorage.setItem('sb_simple', State.settings.simpleMode ? '1' : '0'); } catch(e) {}
  if (State.settings.simpleMode && State.diary.input) State.diary.input.type = 'work';
  if (State.auth.status === 'authed' && typeof _cloudSaveSettingsNow === 'function') _cloudSaveSettingsNow();
  App.render();
}
// Загружаем сохранённые настройки
(function() {
  try { const u = localStorage.getItem('sb_unit'); if (u === 'kg' || u === 'lb') State.settings.unit = u; } catch(e) {}
  try { const s = localStorage.getItem('sb_simple'); if (s !== null) State.settings.simpleMode = s === '1'; } catch(e) {}
  try { const bg = localStorage.getItem('sb_bg'); if (bg === 'dark' || bg === 'grey' || bg === 'light') State.settings.bgTheme = bg; } catch(e) {}
  try { const g = localStorage.getItem('sb_goals'); if (g) State.goals = JSON.parse(g); } catch(e) {}
})();

function saveGoals() {
  try { localStorage.setItem('sb_goals', JSON.stringify(State.goals)); } catch(e) {}
  if (State.auth.status === 'authed' && typeof cloudSaveGoals === 'function') {
    cloudSaveGoals(State.goals).catch(() => {});
  }
}

// Storage и DB живут в js/storage.js (загружается перед этим скриптом)

