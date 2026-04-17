// ═══════════════════════════════════════════════════════════
//  storage.js — SportBrain data layer
//  localStorage for speed/offline + Supabase cloud sync.
//  Loaded before main script; State is accessed lazily.
// ═══════════════════════════════════════════════════════════

// ─── DB object ───────────────────────────────────────────
const DB = {
  workouts:       [],
  currentWorkout: null,
};

// ─── Core persistence ────────────────────────────────────
function loadDB() {
  try {
    const raw = localStorage.getItem('sportbrain_db');
    if (!raw) return;
    const data = JSON.parse(raw);
    DB.workouts       = Array.isArray(data.workouts) ? data.workouts : [];
    DB.currentWorkout = data.currentWorkout || null;
  } catch (e) {}
}

function saveDB() {
  try { localStorage.setItem('sportbrain_db', JSON.stringify(DB)); } catch (e) {}
}

// ─── Workout lifecycle ────────────────────────────────────
function startWorkout(meta) {
  DB.currentWorkout = {
    id:        Date.now(),
    date:      new Date().toISOString(),
    type:      (meta && meta.type) || 'free',
    programId: (meta && meta.programId) || null,
    weekIdx:   (meta && meta.weekIdx != null) ? meta.weekIdx : null,
    dayIdx:    (meta && meta.dayIdx  != null) ? meta.dayIdx  : null,
    exercises: [],
    finished:  false,
  };
  saveDB();
  // Cloud: fire-and-forget
  if (typeof cloudStartWorkout === 'function') cloudStartWorkout(meta).catch(() => {});
}

function addExercise(exercise) {
  if (!DB.currentWorkout) return;
  const { id, name, muscle, equip, accent, grip } = exercise;
  DB.currentWorkout.exercises.push({ id, name, muscle, equip, accent, grip, sets: [], finished: false });
  saveDB();
  // Cloud: fire-and-forget
  if (typeof cloudAddExercise === 'function') cloudAddExercise(exercise).catch(() => {});
}

function addSet(exerciseId, set) {
  if (!DB.currentWorkout) return;
  const ex = DB.currentWorkout.exercises.find(e => e.id === exerciseId);
  if (!ex) return;
  ex.sets.push({ ...set, ts: Date.now() });
  saveDB();
  // Cloud: fire-and-forget
  if (typeof cloudAddSet === 'function') cloudAddSet(exerciseId, set).catch(() => {});
}

function deleteSet(exerciseId, setIndex) {
  if (!DB.currentWorkout) return;
  const ex = DB.currentWorkout.exercises.find(e => e.id === exerciseId);
  if (!ex || setIndex < 0 || setIndex >= ex.sets.length) return;
  ex.sets.splice(setIndex, 1);
  saveDB();
}

function finishExercise(exerciseId) {
  if (!DB.currentWorkout) return;
  const ex = DB.currentWorkout.exercises.find(e => e.id === exerciseId);
  if (ex) { ex.finished = true; saveDB(); }
}

function finishWorkout() {
  if (!DB.currentWorkout) return;
  DB.currentWorkout.finished   = true;
  DB.currentWorkout.finishedAt = new Date().toISOString();
  DB.workouts.unshift(DB.currentWorkout);
  if (DB.workouts.length > 200) DB.workouts = DB.workouts.slice(0, 200);
  DB.currentWorkout = null;
  saveDB();
  // Cloud: fire-and-forget
  if (typeof cloudFinishWorkout === 'function') cloudFinishWorkout().catch(() => {});
}

function getWorkouts() { return DB.workouts; }
function getCurrentWorkout() { return DB.currentWorkout; }

// ─── Legacy Storage adapter ───────────────────────────────
const Storage = {
  saveTraining() {
    try {
      localStorage.setItem('sb_current', JSON.stringify({
        workout:    State.diary.workout,
        activeIdx:  State.diary.activeIdx,
        input:      State.diary.input,
        muscles:    State.diary.muscles,
        selections: State.diary.selections,
        plan:       State.diary.plan,
      }));
    } catch (e) {}
  },

  clearCurrent() { localStorage.removeItem('sb_current'); },

  addHistory(entry) {
    try {
      const hist = this.getHistory();
      hist.unshift(entry);
      localStorage.setItem('sb_history', JSON.stringify(hist.slice(0, 50)));
    } catch (e) {}
  },

  getHistory() {
    try { return JSON.parse(localStorage.getItem('sb_history') || '[]'); } catch (e) { return []; }
  },

  restore() {
    try {
      const raw = localStorage.getItem('sb_current');
      if (!raw) return false;
      const data = JSON.parse(raw);
      if (!data || !data.workout || !data.workout.length) return false;
      State.diary.workout    = data.workout;
      State.diary.activeIdx  = typeof data.activeIdx === 'number' ? data.activeIdx : -1;
      State.diary.input      = data.input || null;
      State.diary.muscles    = data.muscles || [];
      State.diary.selections = data.selections || {};
      State.diary.plan       = data.plan || [];
      State.diary.stage      = 'active';
      return true;
    } catch (e) { return false; }
  },
};

// ─── Active Program ───────────────────────────────────────
function getActiveProgram() {
  try { return JSON.parse(localStorage.getItem('sb_active_prog') || 'null'); } catch(e) { return null; }
}
function setActiveProgram(data) {
  try { localStorage.setItem('sb_active_prog', JSON.stringify(data)); } catch(e) {}
}
function clearActiveProgram() { localStorage.removeItem('sb_active_prog'); }

// ─── 1RM storage ─────────────────────────────────────────
function get1RM() {
  try { return JSON.parse(localStorage.getItem('sb_1rm') || '{}'); } catch(e) { return {}; }
}
function save1RM(exercise, value, method) {
  // localStorage (immediate, used for display)
  try {
    const data = get1RM();
    data[exercise] = { value, date: new Date().toISOString() };
    localStorage.setItem('sb_1rm', JSON.stringify(data));
  } catch(e) {}
  // Cloud (async fire-and-forget)
  if (typeof cloudSave1RM === 'function') cloudSave1RM(exercise, value, method || 'direct').catch(() => {});
}

// ─── Init ─────────────────────────────────────────────────
loadDB();
