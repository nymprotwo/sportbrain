// SportBrain · Supabase Client
// Requires: <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js"></script>

const SUPABASE_URL = 'https://gvzrftlweykqccnmscux.supabase.co';
const SUPABASE_KEY = 'sb_publishable_J_fdJ4N8-qovhMyrpPmOmg_hwKTEtDZ';

const _sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ─── Internal state ────────────────────────────────────────────────────────────
let _uid    = null;   // authenticated user UUID
let _cwId   = null;   // current workout Supabase UUID
let _exMap  = {};     // app exercise id → Supabase exercise UUID
let _exSetIdx = {};   // Supabase exercise UUID → next set order_idx

// ─── Auth ──────────────────────────────────────────────────────────────────────
const CloudAuth = {

  async signUp(email, password) {
    try {
      const { data, error } = await _sb.auth.signUp({ email, password });
      return { data, error };
    } catch (e) {
      console.warn('[CloudAuth.signUp]', e.message);
      return { data: null, error: e };
    }
  },

  async signIn(email, password) {
    try {
      const { data, error } = await _sb.auth.signInWithPassword({ email, password });
      if (!error && data?.user) _uid = data.user.id;
      return { data, error };
    } catch (e) {
      console.warn('[CloudAuth.signIn]', e.message);
      return { data: null, error: e };
    }
  },

  async signOut() {
    try {
      const { error } = await _sb.auth.signOut();
      if (error) throw error;
      _uid = null;
      _cwId = null;
      _exMap = {};
      _exSetIdx = {};
    } catch (e) {
      console.warn('[CloudAuth.signOut]', e.message);
    }
  },

  async getSession() {
    try {
      const { data, error } = await _sb.auth.getSession();
      if (error) throw error;
      if (data?.session?.user) _uid = data.session.user.id;
      return data?.session ?? null;
    } catch (e) {
      console.warn('[CloudAuth.getSession]', e.message);
      return null;
    }
  },

  onStateChange(callback) {
    _sb.auth.onAuthStateChange((event, session) => {
      _uid = session?.user?.id ?? null;
      callback(event, session);
    });
  },

  async signInWithGoogle() {
    try {
      const { data, error } = await _sb.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin + window.location.pathname }
      });
      return { data, error };
    } catch(e) { return { data: null, error: e }; }
  },

  async signInWithApple() {
    try {
      const { data, error } = await _sb.auth.signInWithOAuth({
        provider: 'apple',
        options: { redirectTo: window.location.origin + window.location.pathname }
      });
      return { data, error };
    } catch(e) { return { data: null, error: e }; }
  },
};

// ─── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Builds the HISTORY key for an exercise entry.
 * Key format: "exercise_id[_equip][_grip][_accent][_tut]"
 * Omits null/undefined values and omits tut when it equals 'normal'.
 */
function _histKey(exerciseId, equip, grip, accent, tut) {
  const parts = [exerciseId];
  if (equip != null && equip !== undefined)  parts.push(equip);
  if (grip  != null && grip  !== undefined)  parts.push(grip);
  if (accent != null && accent !== undefined) parts.push(accent);
  if (tut   != null && tut   !== undefined && tut !== 'normal') parts.push(tut);
  return parts.join('_');
}

// ─── User ──────────────────────────────────────────────────────────────────────

async function cloudSetUser(userId) {
  _uid = userId;
}

// ─── History ───────────────────────────────────────────────────────────────────

/**
 * Loads the last 30 finished workouts with nested exercises and sets.
 * Returns a HISTORY object keyed by _histKey(...).
 * Each key holds an array of session objects:
 *   { date, workoutId, sets: [ { weight, reps, rpe, type, mode, grip, stance, weight_mode } ] }
 */
async function cloudLoadHistory() {
  const HISTORY = {};
  if (!_uid) return HISTORY;

  try {
    // Fetch last 30 finished workouts
    const { data: workouts, error: wErr } = await _sb
      .from('workouts')
      .select('id, created_at, finished_at, started_at')
      .eq('user_id', _uid)
      .eq('status', 'finished')
      .order('created_at', { ascending: false })
      .limit(30);

    if (wErr) throw wErr;
    if (!workouts || workouts.length === 0) return HISTORY;

    const workoutIds = workouts.map(w => w.id);

    // Fetch all exercises for these workouts
    const { data: exercises, error: eErr } = await _sb
      .from('exercises')
      .select('id, workout_id, exercise_id, equip, grip, accent, tut, order_idx')
      .in('workout_id', workoutIds)
      .order('order_idx', { ascending: true });

    if (eErr) throw eErr;
    if (!exercises || exercises.length === 0) return HISTORY;

    const exerciseIds = exercises.map(e => e.id);

    // Fetch all sets for these exercises
    const { data: sets, error: sErr } = await _sb
      .from('sets')
      .select('id, exercise_id, weight, reps, rpe, type, mode, grip, stance, weight_mode, order_idx, created_at')
      .in('exercise_id', exerciseIds)
      .order('order_idx', { ascending: true });

    if (sErr) throw sErr;

    // Index workouts by id
    const workoutMap = {};
    for (const w of workouts) workoutMap[w.id] = w;

    // Index sets by exercise_id
    const setsByExercise = {};
    for (const s of (sets || [])) {
      if (!setsByExercise[s.exercise_id]) setsByExercise[s.exercise_id] = [];
      setsByExercise[s.exercise_id].push(s);
    }

    // Build HISTORY
    for (const ex of exercises) {
      if (!ex.exercise_id) continue;

      const key = _histKey(ex.exercise_id, ex.equip, ex.grip, ex.accent, ex.tut);
      if (!HISTORY[key]) HISTORY[key] = [];

      const workout = workoutMap[ex.workout_id];
      const exSets = (setsByExercise[ex.id] || []).map(s => ({
        weight:      s.weight,
        reps:        s.reps,
        rpe:         s.rpe,
        type:        s.type,
        mode:        s.mode,
        grip:        s.grip,
        stance:      s.stance,
        weight_mode: s.weight_mode
      }));

      HISTORY[key].push({
        date:      workout ? (workout.finished_at || workout.created_at) : null,
        workoutId: ex.workout_id,
        sets:      exSets
      });
    }

    // Sort each exercise history newest-first
    for (const key of Object.keys(HISTORY)) {
      HISTORY[key].sort((a, b) => new Date(b.date) - new Date(a.date));
    }

  } catch (e) {
    console.warn('[cloudLoadHistory]', e.message);
  }

  return HISTORY;
}

// ─── 1RM ───────────────────────────────────────────────────────────────────────

/**
 * Returns { exerciseId: { value, date } } for the authenticated user.
 * Only the most recent record per exercise is returned.
 */
async function cloudLoad1RM() {
  const result = {};
  if (!_uid) return result;

  try {
    const { data, error } = await _sb
      .from('one_rm')
      .select('exercise_id, value, recorded_at')
      .eq('user_id', _uid)
      .order('recorded_at', { ascending: false });

    if (error) throw error;

    for (const row of (data || [])) {
      // Keep only the first (most recent) record per exercise
      if (!result[row.exercise_id]) {
        result[row.exercise_id] = {
          value: parseFloat(row.value),
          date:  row.recorded_at
        };
      }
    }
  } catch (e) {
    console.warn('[cloudLoad1RM]', e.message);
  }

  return result;
}

/**
 * Fire-and-forget: saves a 1RM record for the current user.
 * @param {string} exerciseId
 * @param {number} value
 * @param {string} [method='direct']
 */
async function cloudSave1RM(exerciseId, value, method = 'direct') {
  if (!_uid) return;
  try {
    const { error } = await _sb
      .from('one_rm')
      .insert({
        user_id:     _uid,
        exercise_id: exerciseId,
        value:       value,
        method:      method
      });
    if (error) throw error;
  } catch (e) {
    console.warn('[cloudSave1RM]', e.message);
  }
}

// ─── Workout lifecycle ─────────────────────────────────────────────────────────

/**
 * Creates a new workout row and sets _cwId.
 * @param {object} [opts] - optional fields: type, program_id, week_idx, day_idx
 * @returns {string|null} Supabase workout UUID
 */
async function cloudStartWorkout(opts = {}) {
  if (!_uid) return null;
  _exMap = {};
  _exSetIdx = {};

  try {
    const payload = {
      user_id:    _uid,
      status:     'active',
      started_at: new Date().toISOString(),
      type:       opts.type       ?? 'free',
      program_id: opts.program_id ?? null,
      week_idx:   opts.week_idx   ?? null,
      day_idx:    opts.day_idx    ?? null
    };

    const { data, error } = await _sb
      .from('workouts')
      .insert(payload)
      .select('id')
      .single();

    if (error) throw error;
    _cwId = data.id;
    return _cwId;
  } catch (e) {
    console.warn('[cloudStartWorkout]', e.message);
    return null;
  }
}

/**
 * Adds an exercise to the current workout.
 * @param {object} ex - exercise fields
 * @returns {string|null} Supabase exercise UUID
 */
async function cloudAddExercise(ex) {
  if (!_uid || !_cwId) return null;

  try {
    const payload = {
      user_id:     _uid,
      workout_id:  _cwId,
      name:        ex.name        ?? '',
      exercise_id: ex.exercise_id ?? null,
      muscle:      ex.muscle      ?? null,
      equip:       ex.equip       ?? null,
      grip:        ex.grip        ?? null,
      accent:      ex.accent      ?? null,
      tut:         ex.tut         ?? 'normal',
      rest_sec:    ex.rest_sec    ?? 120,
      note:        ex.note        ?? '',
      order_idx:   ex.order_idx   ?? 0
    };

    const { data, error } = await _sb
      .from('exercises')
      .insert(payload)
      .select('id')
      .single();

    if (error) throw error;

    const supabaseId = data.id;

    // Map app-side id → supabase UUID
    if (ex.app_id != null) _exMap[ex.app_id] = supabaseId;
    _exSetIdx[supabaseId] = 0;

    return supabaseId;
  } catch (e) {
    console.warn('[cloudAddExercise]', e.message);
    return null;
  }
}

/**
 * Adds a set to an exercise. Accepts either a Supabase exercise UUID or an
 * app-side exercise id that was previously mapped via cloudAddExercise.
 * Fire-and-forget safe — does not throw.
 * @param {string} exerciseRef - Supabase UUID or app exercise id
 * @param {object} set - set fields
 */
async function cloudAddSet(exerciseRef, set) {
  if (!_uid || !_cwId) return;

  try {
    // Resolve to Supabase UUID
    const supabaseExId = _exMap[exerciseRef] ?? exerciseRef;
    const orderIdx = _exSetIdx[supabaseExId] ?? 0;
    _exSetIdx[supabaseExId] = orderIdx + 1;

    const payload = {
      user_id:     _uid,
      exercise_id: supabaseExId,
      weight:      set.weight      ?? null,
      reps:        set.reps        ?? null,
      rpe:         set.rpe         ?? null,
      type:        set.type        ?? null,
      mode:        set.mode        ?? 'normal',
      grip:        set.grip        ?? null,
      stance:      set.stance      ?? null,
      weight_mode: set.weight_mode ?? null,
      order_idx:   orderIdx
    };

    const { error } = await _sb
      .from('sets')
      .insert(payload);

    if (error) throw error;
  } catch (e) {
    console.warn('[cloudAddSet]', e.message);
  }
}

/**
 * Marks the current workout as finished and records duration.
 * @param {number} [durationSec=0]
 */
async function cloudFinishWorkout(durationSec = 0) {
  if (!_uid || !_cwId) return;

  try {
    const { error } = await _sb
      .from('workouts')
      .update({
        status:       'finished',
        finished_at:  new Date().toISOString(),
        duration_sec: durationSec
      })
      .eq('id', _cwId)
      .eq('user_id', _uid);

    if (error) throw error;

    // Reset workout state
    _cwId = null;
    _exMap = {};
    _exSetIdx = {};
  } catch (e) {
    console.warn('[cloudFinishWorkout]', e.message);
  }
}

// ─── Profile ───────────────────────────────────────────────────────────────────
async function cloudSaveProfile(nickname, avatarIdx) {
  if (!_uid) return { error: 'not authed' };
  try {
    const { error } = await _sb.from('profiles').upsert(
      { id: _uid, nickname, avatar_idx: avatarIdx, updated_at: new Date().toISOString() },
      { onConflict: 'id' }
    );
    return { error };
  } catch(e) { console.warn('[cloudSaveProfile]', e.message); return { error: e }; }
}

async function cloudLoadProfile() {
  if (!_uid) return null;
  try {
    const { data, error } = await _sb.from('profiles').select('*').eq('id', _uid).maybeSingle();
    if (error) throw error;
    return data || null;
  } catch(e) { console.warn('[cloudLoadProfile]', e.message); return null; }
}

// ─── Settings ──────────────────────────────────────────────────────────────────
async function cloudSaveSettings(opts) {
  if (!_uid) return;
  try {
    await _sb.from('user_settings').upsert(
      { user_id: _uid, bg_theme: opts.bgTheme || 'dark', theme_name: opts.themeName || 'gold',
        accent_hex: opts.accentHex || null, unit: opts.unit || 'kg',
        simple_mode: opts.simpleMode || false, updated_at: new Date().toISOString() },
      { onConflict: 'user_id' }
    );
  } catch(e) { console.warn('[cloudSaveSettings]', e.message); }
}

async function cloudLoadSettings() {
  if (!_uid) return null;
  try {
    const { data } = await _sb.from('user_settings').select('*').eq('user_id', _uid).maybeSingle();
    return data || null;
  } catch(e) { console.warn('[cloudLoadSettings]', e.message); return null; }
}

// ─── Achievements ──────────────────────────────────────────────────────────────
async function cloudSaveAchievements(achObj) {
  if (!_uid) return;
  try {
    await _sb.from('user_achievements').upsert(
      { user_id: _uid, data: achObj, updated_at: new Date().toISOString() },
      { onConflict: 'user_id' }
    );
  } catch(e) { console.warn('[cloudSaveAchievements]', e.message); }
}

async function cloudLoadAchievements() {
  if (!_uid) return null;
  try {
    const { data } = await _sb.from('user_achievements').select('data').eq('user_id', _uid).maybeSingle();
    return data?.data || null;
  } catch(e) { console.warn('[cloudLoadAchievements]', e.message); return null; }
}

// ─── Goals ─────────────────────────────────────────────────────────────────────
async function cloudSaveGoals(goals) {
  if (!_uid) return;
  try {
    await _sb.from('user_goals').upsert(
      { user_id: _uid, data: goals, updated_at: new Date().toISOString() },
      { onConflict: 'user_id' }
    );
  } catch(e) { console.warn('[cloudSaveGoals]', e.message); }
}

async function cloudLoadGoals() {
  if (!_uid) return null;
  try {
    const { data } = await _sb.from('user_goals').select('data').eq('user_id', _uid).maybeSingle();
    return data?.data || null;
  } catch(e) { console.warn('[cloudLoadGoals]', e.message); return null; }
}
