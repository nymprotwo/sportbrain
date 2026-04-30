// ═══ DATA LAYER ═══
const MUSCLES = ["Грудь","Бицепс","Трицепс","Спина","Плечи","Ноги","Пресс"];

// ── СНАРЯДЫ ──
const EQUIPMENT_LIST = [
  {id:"barbell",        name:"Штанга"},
  {id:"ez",             name:"EZ-гриф"},
  {id:"dumbbells",      name:"Гантели"},
  {id:"hammer",         name:"Хаммер"},
  {id:"butterfly",      name:"Бабочка"},
  {id:"cable_rope",     name:"Блок — канат"},
  {id:"cable_straight", name:"Блок — прямая"},
  {id:"cable_v",        name:"Блок — V"},
  {id:"cable_d",        name:"Блок — D-рукоять"},
  {id:"cable_single",   name:"Блок — одиночный"},
  {id:"cable_wide",     name:"Блок — широкий"},
  {id:"cable_narrow",   name:"Блок — узкий"},
  {id:"smith",          name:"Смит"},
  {id:"scott",          name:"Скамья Скотта"},
  {id:"preacher_machine", name:"Тренажёр"},
  {id:"leg_press_eq",   name:"Платформа"},
  {id:"hack",           name:"Гак-машина"},
  {id:"bodyweight",     name:"Собств. вес"},
  {id:"dip_bars",       name:"Брусья"},
  {id:"pullup_bar",     name:"Турник"},
  {id:"tbar",           name:"T-гриф"},
  {id:"chest_row_eq",   name:"Упор в грудь"},
  {id:"disc",           name:"Диск"},
  {id:"sandbag",        name:"Мешок"},
];

const GRIPS_LIST = [
  {id:"straight",    name:"Прямой"},
  {id:"reverse",     name:"Обратный"},
  {id:"supination",  name:"Супинация"},
  {id:"neutral",     name:"Нейтральный"},
  {id:"narrow",      name:"Узкий"},
  {id:"medium",      name:"Средний"},
  {id:"wide",        name:"Широкий"},
  {id:"with_sup",    name:"С супинацией"},
  {id:"no_sup",      name:"Без супинации"},
];

// Хват уровня сета — только для отображения в форме подхода
const SET_GRIPS = [
  {id:"straight",   name:"Прямой"},
  {id:"reverse",    name:"Обратный"},
  {id:"supination", name:"Супинация"},
  {id:"neutral",    name:"Нейтральный"},
];

// Тип хвата (направление) — только штанга / EZ-гриф
const GRIP_TYPES = [
  {id:"straight", name:"Прямой"},
  {id:"reverse",  name:"Обратный"},
];

// Ширина хвата — только штанга / EZ-гриф
const GRIP_WIDTHS = [
  {id:"narrow", name:"Узкий"},
  {id:"medium", name:"Средний"},
  {id:"wide",   name:"Широкий"},
];

// Постановка ног уровня сета — показывается только для Ноги
const SET_STANCE = [
  {id:"narrow",    name:"Узко"},
  {id:"medium",    name:"Средне"},
  {id:"wide",      name:"Широко"},
  {id:"toes_out",  name:"Носки ↗"},
  {id:"toes_in",   name:"Носки ↘"},
];

// Положение тела уровня сета (Стоя / Сидя) — для отдельных упражнений
const SET_POSITIONS = [
  {id:"standing", name:"Стоя"},
  {id:"seated",   name:"Сидя"},
];
// Упражнения, у которых положение задаётся на уровне сета
const POSITION_EX = [
  'bicep_curl_bar',
  'bicep_curl_ez',
];

// Снаряды, для которых выбор хвата имеет смысл (старый список, для обратной совместимости)
const GRIP_EQUIPS = new Set([
  'barbell', 'ez', 'pullup_bar', 'smith', 'tbar',
  'cable_wide', 'cable_straight', 'cable_v', 'cable_narrow', 'cable_rope',
]);

// Снаряды, для которых хват разделён на ТИП + ШИРИНУ (только штанга и EZ-гриф)
const GRIP_TYPE_EQUIPS  = new Set(['barbell', 'ez']);
const GRIP_WIDTH_EQUIPS = new Set(['barbell', 'ez']);

// Постановка ног — только приседания (grip не показывается для этих упражнений)
const STANCE_LIST = [
  {id:'narrow',   name:'Узкая'},
  {id:'shoulder', name:'На ширине плеч'},
  {id:'wide',     name:'Широкая'},
];
const STANCE_EX_IDS = new Set([
  'squat_bar_classic', 'squat_smith', 'squat_db',
  'squat_bar_front',   'squat_front_smith',
  'squat_sumo_bar',    'squat_sumo_db', 'hack_squat',
]);
const STANCE_EFFECTS = {
  narrow:   'Акцент на квадрицепс',
  shoulder: 'Баланс ног',
  wide:     'Акцент на ягодицы и заднюю цепь',
};

// ─────────────── ЭФФЕКТЫ ХВАТА ПО УПРАЖНЕНИЮ ───────────────
// Ключи совпадают с ex.id; _default используется для остальных

const EX_GRIP_TYPE_FX = {
  _default: {
    straight: 'Прямой хват · стандартная нагрузка',
    reverse:  'Обратный хват · другой вектор усилия',
  },
  bench_press: {
    straight: 'Классика · грудь, трицепс, передняя дельта',
    reverse:  'Нижняя грудь · бицепс включается · меньше нагрузки на плечи',
  },
  incline_press: {
    straight: 'Классика верха груди · передняя дельта + трицепс',
    reverse:  'Верхняя грудь · щадит запястья · усиленная передняя дельта',
  },
  decline_press: {
    straight: 'Нижняя грудь · минимум дельты · мощный жим',
    reverse:  'Нижняя и средняя грудь · снижает стресс на плечи',
  },
  barbell_row: {
    straight: 'Трапеция · ромбовидные · задняя дельта',
    reverse:  'Широчайшие · бицепс активируется сильнее',
  },
  deadlift: {
    straight: 'Симметричный хват · равномерная нагрузка',
    reverse:  'Разнохват · держит больший вес · небольшая асимметрия нагрузки',
  },
  sumo_deadlift: {
    straight: 'Симметричный хват · стандарт для сумо',
    reverse:  'Разнохват · помогает удержать максимальный вес',
  },
  romanian_dl: {
    straight: 'Стандарт · акцент бицепс бедра и ягодицы',
    reverse:  'Облегчает удержание при больших весах · небольшой дисбаланс',
  },
  bicep_curl_bar: {
    straight: 'Максимальная нагрузка на бицепс',
    reverse:  'Брахиалис + брахиорадиалис · акцент предплечья',
  },
  bicep_curl_ez: {
    straight: 'EZ-угол · нагрузка на обе головки бицепса',
    reverse:  'Брахиалис · брахиорадиалис · предплечья',
  },
  preacher_curl_bar: {
    straight: 'Изоляция бицепса · обе головки работают равномерно',
    reverse:  'Брахиалис + предплечья · изоляция на скамье Скотта',
  },
  preacher_curl_ez: {
    straight: 'EZ-угол · комфорт запястий · баланс головок бицепса',
    reverse:  'Брахиалис · предплечья · изоляция Скотта',
  },
  tri_press_bar: {
    straight: 'Классика · равномерная нагрузка на трицепс',
    reverse:  'Нетипично · нагружает запястья · не рекомендован',
  },
  tri_french_lying_bar: {
    straight: 'Медиальная и латеральная головки · классика',
    reverse:  'Меняет вектор нагрузки · перегружает запястья',
  },
  tri_french_lying_ez: {
    straight: 'EZ-угол снижает нагрузку на запястья · все головки трицепса',
    reverse:  'Перегружает запястья · не рекомендован',
  },
  tri_french_seated_ez: {
    straight: 'EZ сидя · изоляция длинной головки трицепса · комфортно',
    reverse:  'Дискомфорт для суставов · не рекомендован',
  },
  shoulder_press_bar: {
    straight: 'Классика · передняя и средняя дельта + трицепс',
    reverse:  'Нетипично · дискомфорт запястий · не рекомендован',
  },
  upright_row_bar: {
    straight: 'Трапеция + дельта · стресс ротаторов при узком хвате',
    reverse:  'Снижает нагрузку на ротаторы плеча',
  },
  upright_row_ez: {
    straight: 'EZ снижает стресс запястий · трапеция + дельта',
    reverse:  'Нетипично для EZ · возможен дискомфорт',
  },
  shrug_bar: {
    straight: 'Стандарт · максимальная нагрузка на трапецию',
    reverse:  'Облегчает удержание при больших весах',
  },
};

const EX_GRIP_WIDTH_FX = {
  _default: {
    narrow: 'Акцент трицепс · узкая постановка',
    medium: 'Равномерная нагрузка',
    wide:   'Акцент грудь · широкая постановка',
  },
  bench_press: {
    narrow: 'Акцент трицепс + передняя дельта · меньше груди',
    medium: 'Баланс: грудь · трицепс · дельта',
    wide:   'Максимум груди · короткая амплитуда · меньше трицепса',
  },
  incline_press: {
    narrow: 'Трицепс + передняя дельта · меньше верхней груди',
    medium: 'Баланс: верхняя грудь · трицепс · дельта',
    wide:   'Максимум верхней груди · укороченная амплитуда',
  },
  decline_press: {
    narrow: 'Акцент трицепс · нижняя грудь частично',
    medium: 'Нижняя грудь + трицепс · минимум дельты',
    wide:   'Изоляция нижней груди · очень короткая амплитуда',
  },
  barbell_row: {
    narrow: 'Нижние отделы широчайших · толщина спины',
    medium: 'Средняя спина · баланс нагрузки',
    wide:   'Верхняя спина · трапеция · задняя дельта',
  },
  deadlift: {
    narrow: 'Классическая постановка · руки вдоль бёдер',
    medium: 'Стандартная ширина хвата · оптимальный баланс',
    wide:   'Рывковый хват · растяжка спины · укороченная амплитуда',
  },
  sumo_deadlift: {
    narrow: 'Хват внутри ног · стандарт для сумо',
    medium: 'Умеренная ширина хвата',
    wide:   'Более широкий хват · смещение нагрузки',
  },
  romanian_dl: {
    narrow: 'Акцент медиальная часть бицепса бедра',
    medium: 'Равномерная нагрузка на заднюю цепь',
    wide:   'Акцент ягодицы · лёгкое сокращение амплитуды',
  },
  bicep_curl_bar: {
    narrow: 'Длинная головка · пик бицепса',
    medium: 'Баланс обеих головок бицепса',
    wide:   'Короткая головка · ширина бицепса',
  },
  bicep_curl_ez: {
    narrow: 'Длинная головка · пик бицепса · максимальный стретч',
    medium: 'Обе головки равномерно · стандарт EZ',
    wide:   'Короткая головка · ширина бицепса',
  },
  preacher_curl_bar: {
    narrow: 'Длинная головка · пиковое сокращение на скамье',
    medium: 'Классика Скотта · обе головки',
    wide:   'Короткая головка · ширина бицепса',
  },
  preacher_curl_ez: {
    narrow: 'Длинная головка · максимальный стретч',
    medium: 'Обе головки равномерно · EZ-стандарт',
    wide:   'Короткая головка бицепса',
  },
  tri_press_bar: {
    narrow: 'Максимум трицепса · изоляция · стандарт упражнения',
    medium: 'Трицепс + нижняя грудь · безопаснее для запястий',
    wide:   'Трицепс + нижняя грудь · короткая амплитуда',
  },
  tri_french_lying_bar: {
    narrow: 'Длинная головка трицепса · максимальная амплитуда',
    medium: 'Все три головки · классика французского жима',
    wide:   'Медиальная и латеральная головки · укороченная амплитуда',
  },
  tri_french_lying_ez: {
    narrow: 'Длинная головка · глубокий стретч трицепса',
    medium: 'Оптимальный баланс нагрузки · стандарт EZ',
    wide:   'Медиальная и латеральная головки',
  },
  tri_french_seated_ez: {
    narrow: 'Максимальный стретч длинной головки',
    medium: 'Баланс трицепса · комфортная позиция · стандарт',
    wide:   'Медиальная головка · меньше работы длинной головки',
  },
  shoulder_press_bar: {
    narrow: 'Акцент трицепс + передняя дельта',
    medium: 'Баланс: дельта + трицепс · оптимальный вариант',
    wide:   'Акцент средняя дельта · короткая амплитуда · осторожно с суставами',
  },
  upright_row_bar: {
    narrow: 'Трапеция · высокий подъём · риск импинджмента плеча',
    medium: 'Баланс трапеции и боковой дельты · рекомендованный хват',
    wide:   'Акцент средняя дельта · снижает риск для ротаторов',
  },
  upright_row_ez: {
    narrow: 'Трапеция · высокий подъём штанги',
    medium: 'Баланс: трапеция и боковая дельта',
    wide:   'Акцент средняя дельта · рекомендованная ширина',
  },
  shrug_bar: {
    narrow: 'Ближе к корпусу · естественная позиция · верхняя трапеция',
    medium: 'Стандарт · верхняя и средняя трапеция',
    wide:   'Неудобно · не рекомендован при больших весах',
  },
};

// Упражнения с режимами веса: своё тело / с отягощением / ассист
const WEIGHT_MODE_EX = ['dips_chest', 'pullup'];
const WEIGHT_MODES = [
  { id:'plus',   name:'+Вес',   hint:'С отягощением' },
  { id:'bw',     name:'Свой',   hint:'Собственный вес' },
  { id:'assist', name:'Ассист', hint:'С помощью (резина/тренажёр)' },
];

const TUT_LIST = [
  {id:"normal",    name:"Без паузы"},
  {id:"pause1",    name:"Пауза 1 сек"},
  {id:"pause3",    name:"Пауза 3 сек"},
  {id:"pause_mid", name:"Пауза в середине"},
  {id:"negative3", name:"Негатив 3 сек"},
  {id:"slow",      name:"Медленно 4-0-4"},
];

// Доступные варианты темпа для каждого упражнения (без 'normal' — он всегда доступен через выключение переключателя)
const TUT_EX_OPTIONS = {
  // ── ГРУДЬ — жимы: полный набор (пауза на груди — классика) ──
  bench_press:                 ['pause1','pause3','pause_mid','negative3','slow'],
  incline_press:               ['pause1','pause3','pause_mid','negative3','slow'],
  decline_press:               ['pause1','pause3','pause_mid','negative3','slow'],
  // ── ГРУДЬ — сведения: только негатив/медленно ──
  butterfly:                   ['negative3','slow'],
  dumbbell_fly:                ['negative3','slow'],
  cable_cross:                 ['negative3','slow'],
  cable_fly:                   ['negative3','slow'],
  // ── ГРУДЬ — отжимания ──
  dips_chest:                  ['pause1','negative3'],
  gravitron:                   ['pause1','negative3'],
  pushup:                      ['pause1','negative3'],
  pushup_elevated:             ['pause1','negative3'],
  hammer_chest:                ['pause1','negative3'],
  // ── СПИНА — вертикальные тяги ──
  pullup:                      ['pause1','negative3'],
  lat_pulldown:                ['pause1','negative3'],
  hammer_pulldown:             ['pause1','negative3'],
  // ── СПИНА — горизонтальные тяги ──
  barbell_row:                 ['pause1','negative3'],
  dumbbell_row:                ['pause1','negative3'],
  seated_row:                  ['pause1','negative3'],
  tbar_row:                    ['pause1','negative3'],
  hammer_row:                  ['pause1','negative3'],
  chest_row:                   ['pause1','negative3'],
  face_pull:                   ['pause1'],
  // ── СПИНА — становые ──
  deadlift:                    ['pause1'],
  sumo_deadlift:               ['pause1'],
  romanian_dl:                 ['negative3'],
  hyperextension:              ['pause1','slow'],
  // ── БИЦЕПС ──
  bicep_curl_bar:              ['pause1','negative3','slow'],
  bicep_curl_ez:               ['pause1','negative3','slow'],
  bicep_curl_db:               ['pause1','negative3','slow'],
  bicep_curl_db_seated:        ['pause1','negative3','slow'],
  bicep_curl_db_incline:       ['pause1','negative3','slow'],
  bicep_curl_cable_straight:   ['pause1','negative3'],
  bicep_curl_cable_d:          ['pause1','negative3'],
  bicep_curl_cable_rope:       ['pause1','negative3'],
  bicep_curl_cable_single:     ['pause1','negative3'],
  preacher_curl_bar:           ['pause1','negative3'],
  preacher_curl_ez:            ['pause1','negative3'],
  preacher_curl_db:            ['pause1','negative3'],
  preacher_curl_machine:       ['pause1','negative3'],
  hammer_curl:                 ['pause1','negative3'],
  hammer_curl_seated:          ['pause1','negative3'],
  hammer_curl_cable:           ['pause1','negative3'],
  // ── ТРИЦЕПС — жим ──
  tri_press_bar:               ['pause1','negative3'],
  tri_press_smith:             ['pause1','negative3'],
  // ── ТРИЦЕПС — французский жим (негатив первичен) ──
  tri_french_lying_bar:        ['negative3','pause1'],
  tri_french_lying_ez:         ['negative3','pause1'],
  tri_french_lying_db:         ['negative3','pause1'],
  tri_french_seated_ez:        ['negative3','pause1'],
  tri_french_seated_db:        ['negative3','pause1'],
  // ── ТРИЦЕПС — блок ──
  tri_cable_down_rope:         ['pause1','negative3'],
  tri_cable_down_v:            ['pause1','negative3'],
  tri_cable_down_straight:     ['pause1','negative3'],
  tri_cable_down_single:       ['pause1','negative3'],
  tri_cable_down_d:            ['pause1','negative3'],
  tri_cable_down_rope_single:  ['pause1','negative3'],
  tri_cable_overhead_straight: ['pause1','negative3'],
  tri_cable_overhead_rope:     ['pause1','negative3'],
  tri_cable_overhead_single:   ['pause1','negative3'],
  // ── ТРИЦЕПС — брусья ──
  dips_tri:                    ['pause1','negative3'],
  dips_tri_gravitron:          ['pause1','negative3'],
  // ── ПЛЕЧИ — жим ──
  shoulder_press_bar:          ['pause1','negative3'],
  shoulder_press_db:           ['pause1','negative3'],
  shoulder_press_smith:        ['pause1','negative3'],
  shoulder_press_hammer:       ['pause1','negative3'],
  // ── ПЛЕЧИ — махи (пауза в пике — ключевое) ──
  shoulder_raise_side_db:      ['pause1','slow'],
  shoulder_raise_side_cable:   ['pause1','slow'],
  shoulder_raise_side_hammer:  ['pause1','slow'],
  shoulder_raise_front_db:     ['pause1','slow'],
  shoulder_raise_front_cable:  ['pause1','slow'],
  shoulder_raise_rear_db:      ['pause1','slow'],
  shoulder_raise_rear_cable:   ['pause1','slow'],
  rear_delt_machine:           ['pause1','slow'],
  // ── ПЛЕЧИ — тяга к подбородку / шраги (пауза в верхней точке) ──
  upright_row_bar:             ['pause1'],
  upright_row_ez:              ['pause1'],
  upright_row_db:              ['pause1'],
  upright_row_cable:           ['pause1'],
  shrug_bar:                   ['pause1'],
  shrug_db:                    ['pause1'],
  shrug_smith:                 ['pause1'],
  shrug_hammer:                ['pause1'],
  // ── НОГИ — приседания ──
  squat_bar_classic:           ['pause1','pause3','negative3'],
  squat_smith:                 ['pause1','pause3','negative3'],
  squat_db:                    ['pause1','negative3'],
  squat_bar_front:             ['pause1','pause3','negative3'],
  squat_front_smith:           ['pause1','pause3','negative3'],
  squat_sumo_bar:              ['pause1','negative3'],
  squat_sumo_db:               ['pause1','negative3'],
  // ── НОГИ — тренажёры ──
  leg_press:                   ['pause1','negative3'],
  hack_squat:                  ['pause1','negative3'],
  leg_extension:               ['pause1'],
  leg_curl_lying:              ['pause1','negative3'],
  leg_curl_seated:             ['pause1','negative3'],
  leg_curl_standing:           ['pause1','negative3'],
  hip_adduction:               ['pause1'],
  hip_abduction:               ['pause1'],
  // ── НОГИ — выпады ──
  lunge_static:                ['pause1','negative3'],
  lunge_walking:               ['pause1'],
  lunge_bulgarian:             ['pause1','negative3'],
  lunge_step_up:               ['pause1'],
  // ── НОГИ — ягодичный мост ──
  glute_bridge_bar:            ['pause1'],
  glute_bridge_smith:          ['pause1'],
  glute_bridge_machine:        ['pause1'],
  // ── НОГИ — икры (задержка в верхней точке) ──
  calf_raise_standing:         ['pause1','slow'],
  calf_raise_seated:           ['pause1','slow'],
  calf_raise_machine:          ['pause1','slow'],
  // ── ПРЕСС ──
  crunch_bw:                   ['pause1','slow'],
  crunch_decline:              ['pause1','slow'],
  crunch_cable:                ['pause1'],
  crunch_machine:              ['pause1'],
  leg_raise_lying:             ['pause1','slow'],
  leg_raise_hanging:           ['pause1'],
  leg_raise_bars:              ['pause1'],
  plank:                       [],   // статика — темп неприменим
  plank_side:                  [],
  ab_twist:                    ['slow'],
};

const REST_LIST = [
  {id:'45',  name:'45с'},
  {id:'60',  name:'1 мин'},
  {id:'90',  name:'1:30'},
  {id:'120', name:'2 мин'},
  {id:'180', name:'3 мин'},
  {id:'300', name:'5 мин'},
];

const ACCENT_LIST = [
  {id:'upper',    name:'Верх'},
  {id:'middle',   name:'Середина'},
  {id:'lower',    name:'Низ'},
  {id:'floor',    name:'Ноги на полу'},
  {id:'elevated', name:'Ноги выше'},
];

// ── ДЕРЕВО ДВИЖЕНИЙ (для экрана выбора) ──
// Порядок для жимовых: Тип → Акцент/Угол → Снаряд
// accents[].exId  — упражнение определяется углом (наклон/горизонталь/отрицательный)
// type.exId       — фиксированное упражнение (хаммер не зависит от угла)
// type.fixedEquip — снаряд предопределён (смит, хаммер)
// type.equips     — список на выбор (только скамья: штанга / гантели)
const CABLE_ICONS = {
  cable_narrow:      'assets/crops/r0_c0.png',  // двойные ременные ручки
  cable_rope:        'assets/crops/r0_c1.png',  // двойной канат
  cable_wide:        'assets/crops/r0_c2.png',  // изогнутая широкая перекладина
  cable_straight:    'assets/crops/r0_c3.png',  // прямая палка
  cable_v_small:     'assets/crops/r0_c4.png',  // V-образная малая
  cable_rope_single: 'assets/crops/r1_c0.png',  // одиночный канат
  cable_handle:      'assets/crops/r1_c1.png',  // компактная рукоятка
  cable_d:           'assets/crops/r1_c2.png',  // D-рукоятка (пистолетная)
  cable_v:           'assets/crops/r1_c3.png',  // V-рукоятка
  cable_single:      'assets/crops/r1_c4.png',  // одиночный карабин
};

const MOVEMENT_TREE = {
  "Спина": [
    {
      id:"vertical", name:"Вертикальные тяги",
      types:[
        {
          id:"pullup_t", name:"Подтягивания",
          exId:"pullup", fixedEquip:"pullup_bar",
          grips:["wide","medium","narrow","reverse"],
          accents:null, equips:null,
        },
        {
          id:"lat_pd", name:"Блок сверху",
          exId:"lat_pulldown",
          equips:["cable_wide","cable_narrow","cable_v","cable_d","cable_single","cable_handle"],
          grips:null, accents:null,
        },
      ]
    },
    {
      id:"horizontal", name:"Горизонтальные тяги",
      types:[
        {
          id:"row_incline", name:"Тяга в наклоне",
          exId: null,
          accentLabel: 'СНАРЯД',
          accents:[
            {id:"barbell",   name:"Штанга",  exId:"barbell_row",  equipId:"barbell"},
            {id:"smith",     name:"Смит",    exId:"barbell_row",  equipId:"smith"},
            {id:"dumbbells", name:"Гантели", exId:"dumbbell_row", equipId:"dumbbells"},
            {id:"tbar",      name:"Т-гриф",  exId:"tbar_row",     equipId:"tbar"},
          ],
          equips:null, grips:null,
        },
        {
          id:"cable_row", name:"Тяга блока к поясу",
          exId:"seated_row",
          equipLabel: 'РУКОЯТЬ',
          equips:["cable_v","cable_d","cable_wide","cable_single","cable_handle"],
          accents:null, grips:null,
        },
      ]
    },
    {
      id:"hammer_back", name:"Хаммер",
      types:[
        {
          id:"hammer_pd", name:"Хаммер вертикальный",
          exId:"hammer_pulldown", fixedEquip:"hammer",
          accents:[
            {id:"lats",  name:"Широчайшие", sub:"Тяга с широкой постановкой"},
            {id:"upper", name:"Верх спины", sub:"Ромбовидные и трапеции"},
          ],
          equips:null, grips:null,
        },
        {
          id:"hammer_r", name:"Хаммер горизонтальный",
          exId:"hammer_row", fixedEquip:"hammer",
          accents:[
            {id:"lower", name:"Низ спины",  sub:"Толщина, широчайшие"},
            {id:"upper", name:"Верх спины", sub:"Ромбовидные, трапеции"},
          ],
          equips:null, grips:null,
        },
      ]
    },
    {
      id:"hyperext_cat", name:"Гиперэкстензия",
      types:[
        {
          id:"hyperext_t", name:"Гиперэкстензия",
          exId:"hyperextension", fixedEquip:"bodyweight",
          accents:null, equips:null, grips:null,
        }
      ]
    },
  ],
  "Грудь": [
    {
      id:"press", name:"Жимовые",
      types:[
        {
          id:"bench", name:"Скамья",
          accents:[
            {id:"upper",  name:"Верх груди",     sub:"Наклонная 30–45°",   exId:"incline_press"},
            {id:"middle", name:"Середина груди", sub:"Горизонтальная",      exId:"bench_press"},
            {id:"lower",  name:"Низ груди",      sub:"Отрицательный угол",  exId:"decline_press"},
          ],
          equips:["barbell","dumbbells"],
        },
        {
          id:"smith", name:"Смит",
          accents:[
            {id:"upper",  name:"Верх груди",     sub:"Наклонная 30–45°",   exId:"incline_press"},
            {id:"middle", name:"Середина груди", sub:"Горизонтальная",      exId:"bench_press"},
            {id:"lower",  name:"Низ груди",      sub:"Отрицательный угол",  exId:"decline_press"},
          ],
          equips:null, fixedEquip:"smith",
        },
        {
          id:"hammer", name:"Хаммер",
          exId:"hammer_chest",
          accents:[
            {id:"upper",  name:"Верх груди",     sub:"Наклонная 30–45°"},
            {id:"middle", name:"Середина груди", sub:"Горизонтальная"},
            {id:"lower",  name:"Низ груди",      sub:"Отрицательный угол"},
          ],
          equips:null, fixedEquip:"hammer",
        },
      ]
    },
    {
      id:"fly", name:"Сведения",
      types:[
        {id:"butterfly",   name:"Бабочка",   exId:"butterfly",    equips:null, accents:null, fixedEquip:"butterfly"},
        {id:"dumbbellfly", name:"Гантели",   exId:"dumbbell_fly", equips:null, accents:[{id:"upper",name:"Верх"},{id:"middle",name:"Середина"},{id:"lower",name:"Низ"}]},
        {id:"crossover",   name:"Кроссовер", exId:"cable_cross",  equips:null, accents:[{id:"upper",name:"Верх"},{id:"middle",name:"Середина"},{id:"lower",name:"Низ"}]},
        {id:"cablefly",    name:"Блок лёжа", exId:"cable_fly",    equips:null, accents:[{id:"flat",name:"Горизонт"},{id:"incline",name:"Наклон вверх"}]},
      ]
    },
    {
      id:"push", name:"Отжимания",
      types:[
        {id:"dips",       name:"Брусья",     exId:"dips_chest", equips:null, accents:null},
        {id:"gravitron",  name:"Гравитрон",  exId:"gravitron",  equips:null, fixedEquip:"dip_bars", accents:null},
        {id:"pushup",     name:"От пола",    exId:"pushup",     equips:null, grips:["narrow","medium","wide"], gripLabel:"ПОСТАНОВКА РУК",
          accents:[
            {id:"floor",    name:"Ноги на полу", sub:"Стандартные"},
            {id:"elevated", name:"Ноги выше",    sub:"Акцент верх груди"},
          ]
        },
      ]
    },
  ],
  "Бицепс": [
    {
      id:"curl_cat", name:"Сгибание рук",
      types:[
        {
          id:"barbell_t", name:"Штанга",
          equipFirst:true,
          equips:["barbell","ez"],
          equipsExMap:{ barbell:"bicep_curl_bar", ez:"bicep_curl_ez" },
          accents:null, grips:null,
        },
        {
          id:"db_t", name:"Гантели",
          fixedEquip:"dumbbells",
          accents:[
            {id:"standing", name:"Стоя",      exId:"bicep_curl_db"},
            {id:"seated",   name:"Сидя",      exId:"bicep_curl_db_seated"},
            {id:"incline",  name:"Наклонная", exId:"bicep_curl_db_incline"},
          ],
          accentLabel:"ПОЛОЖЕНИЕ",
          equips:null,
          grips:["with_sup","no_sup"],
          gripLabel:"ТЕХНИКА",
        },
        {
          id:"cable_t", name:"Блок",
          equipFirst:true,
          equips:["cable_straight","cable_rope","cable_single"],
          equipsExMap:{
            cable_straight: "bicep_curl_cable_straight",
            cable_rope:     "bicep_curl_cable_rope",
            cable_single:   "bicep_curl_cable_single",
          },
          accents:null, grips:null,
        },
        {
          id:"scott_t", name:"Скамья Скотта",
          equipFirst:true,
          equips:["barbell","ez","dumbbells","preacher_machine"],
          equipsExMap:{
            barbell:          "preacher_curl_bar",
            ez:               "preacher_curl_ez",
            dumbbells:        "preacher_curl_db",
            preacher_machine: "preacher_curl_machine",
          },
          accents:null, grips:null,
        },
        {
          id:"hammer_t", name:"Молотки",
          equipFirst:true,
          equips:["dumbbells","cable_rope"],
          accents:[
            {id:"standing", name:"Стоя", exId:"hammer_curl"},
            {id:"seated",   name:"Сидя", exId:"hammer_curl_seated"},
          ],
          accentLabel:"ПОЛОЖЕНИЕ",
          equipAccents:{
            cable_rope: [],  // без позиции — только equipsExMap
          },
          equipsExMap:{
            cable_rope: "hammer_curl_cable",
          },
          grips:null,
        },
      ]
    },
  ],
  "Трицепс": [
    {
      id:"tri_cat", name:"Трицепс",
      types:[
        // ЖИМ — узкий хват, снаряд определяет упражнение
        {
          id:"press_t", name:"Жим",
          equipFirst:true,
          equips:["barbell","smith"],
          equipsExMap:{ barbell:"tri_press_bar", smith:"tri_press_smith" },
          accents:null, grips:null,
        },
        // ФРАНЦУЗСКИЙ ЖИМ — сначала положение, потом снаряд
        {
          id:"french_t", name:"Французский жим",
          accents:[
            {id:"lying",  name:"Лёжа"},
            {id:"seated", name:"Сидя"},
          ],
          accentLabel:"ПОЛОЖЕНИЕ",
          accentEquips:{
            lying:  ["barbell","ez","dumbbells"],
            seated: ["ez","dumbbells"],          // штанга сидя — неудобно, убрана
          },
          accentEquipsExMap:{
            lying:  { barbell:"tri_french_lying_bar", ez:"tri_french_lying_ez", dumbbells:"tri_french_lying_db"  },
            seated: {                                  ez:"tri_french_seated_ez", dumbbells:"tri_french_seated_db" },
          },
          equips:null, grips:null,
        },
        // БЛОК — сначала направление, потом насадка
        {
          id:"cable_t", name:"Блок",
          accents:[
            {id:"down",     name:"Вниз"},
            {id:"overhead", name:"Из-за головы"},
          ],
          accentLabel:"НАПРАВЛЕНИЕ",
          accentEquips:{
            down:     ["cable_rope","cable_straight","cable_single","cable_rope_single"],
            overhead: ["cable_rope","cable_single","cable_straight"],
          },
          accentEquipsExMap:{
            down:     { cable_rope:"tri_cable_down_rope", cable_straight:"tri_cable_down_straight", cable_single:"tri_cable_down_single", cable_rope_single:"tri_cable_down_rope_single" },
            overhead: { cable_rope:"tri_cable_overhead_rope", cable_single:"tri_cable_overhead_single", cable_straight:"tri_cable_overhead_straight" },
          },
          equips:null, grips:null,
        },
        // БРУСЬЯ
        {
          id:"dips_t", name:"Брусья",
          exId:"dips_tri",
          fixedEquip:"dip_bars",
          accents:null, equips:null, grips:null,
        },
        {
          id:"gravitron_t", name:"Гравитрон",
          exId:"dips_tri_gravitron",
          fixedEquip:"dip_bars",
          accents:null, equips:null, grips:null,
        },
      ]
    },
  ],
  "Плечи": [
    {
      id:"shoulders_cat", name:"Плечи",
      typeLabel:"УПРАЖНЕНИЕ",
      types:[
        // ЖИМ — снаряд определяет упражнение
        {
          id:"press_t", name:"Жим",
          equipFirst:true,
          equips:["barbell","dumbbells","smith","hammer"],
          equipsExMap:{
            barbell:  "shoulder_press_bar",
            dumbbells:"shoulder_press_db",
            smith:    "shoulder_press_smith",
            hammer:   "shoulder_press_hammer",
          },
          accents:null, grips:null,
        },
        // МАХИ — сначала направление, потом снаряд
        {
          id:"raise_t", name:"Махи",
          accents:[
            {id:"side",  name:"В стороны"},
            {id:"front", name:"Вперёд"},
            {id:"rear",  name:"В наклоне"},
          ],
          accentLabel:"НАПРАВЛЕНИЕ",
          accentEquips:{
            side:  ["dumbbells","cable_single","hammer"],
            front: ["dumbbells","cable_single"],
            rear:  ["dumbbells","cable_single"],
          },
          accentEquipsExMap:{
            side:  { dumbbells:"shoulder_raise_side_db",  cable_single:"shoulder_raise_side_cable",  hammer:"shoulder_raise_side_hammer" },
            front: { dumbbells:"shoulder_raise_front_db", cable_single:"shoulder_raise_front_cable"                                     },
            rear:  { dumbbells:"shoulder_raise_rear_db",  cable_single:"shoulder_raise_rear_cable"                                      },
          },
          equipNames:{ cable_single:"Блок", hammer:"Тренажёр" },
          equips:null, grips:null,
        },
        // БАБОЧКА (задняя дельта)
        {
          id:"butterfly_t", name:"Бабочка",
          exId:"rear_delt_machine",
          fixedEquip:"butterfly",
          accents:null, equips:null, grips:null,
        },
        // ТЯГА К ПОДБОРОДКУ — снаряд определяет упражнение
        {
          id:"upright_t", name:"Тяга к подбородку",
          equipFirst:true,
          equips:["barbell","ez","dumbbells","cable_rope"],
          equipsExMap:{
            barbell:    "upright_row_bar",
            ez:         "upright_row_ez",
            dumbbells:  "upright_row_db",
            cable_rope: "upright_row_cable",
          },
          accents:null, grips:null,
        },
        // ШРАГИ — снаряд определяет упражнение
        {
          id:"shrug_t", name:"Шраги",
          equipFirst:true,
          equips:["barbell","dumbbells","smith","hammer"],
          equipsExMap:{
            barbell:  "shrug_bar",
            dumbbells:"shrug_db",
            smith:    "shrug_smith",
            hammer:   "shrug_hammer",
          },
          accents:null, grips:null,
        },
      ]
    },
  ],
  "Ноги": [
    {
      id:"legs_cat", name:"Ноги",
      typeLabel:"УПРАЖНЕНИЕ",
      types:[
        // ПРИСЕДАНИЯ — тип × снаряд → разные упражнения
        {
          id:"squat_t", name:"Приседания",
          accents:[
            {id:"classic", name:"Классические"},
            {id:"front",   name:"Фронтальные"},
          ],
          accentLabel:"ТИП",
          accentEquips:{
            classic: ["barbell","smith","dumbbells"],
            front:   ["barbell","smith"],
          },
          accentEquipsExMap:{
            classic: { barbell:"squat_bar_classic", smith:"squat_smith", dumbbells:"squat_db"  },
            front:   { barbell:"squat_bar_front",   smith:"squat_front_smith"                  },
          },
          equips:null, grips:null,
        },
        // ЖИМ ПЛАТФОРМЫ
        {
          id:"leg_press_t", name:"Жим платформы",
          exId:"leg_press",
          fixedEquip:"leg_press_eq",
          accents:null, equips:null, grips:null,
        },
        // ГАК-ПРИСЕД
        {
          id:"hack_t", name:"Гак-присед",
          exId:"hack_squat",
          fixedEquip:"hack",
          accents:null, equips:null, grips:null,
        },
        // ВЫПАДЫ — тип определяет упражнение, снаряды по типу разные
        {
          id:"lunge_t", name:"Выпады",
          accents:[
            {id:"static",    name:"На месте",    exId:"lunge_static"},
            {id:"walking",   name:"В ходьбе",    exId:"lunge_walking"},
            {id:"bulgarian", name:"Болгарские",  exId:"lunge_bulgarian"},
            {id:"step_up",   name:"Зашагивания", exId:"lunge_step_up"},
          ],
          accentLabel:"ТИП",
          accentEquips:{
            static:    ["dumbbells","barbell","smith"],
            walking:   ["dumbbells","sandbag"],
            bulgarian: ["dumbbells","barbell","smith"],
            step_up:   ["dumbbells","sandbag"],
          },
          equips:null, grips:null,
        },
        // СГИБАНИЕ НОГ — положение определяет упражнение
        {
          id:"leg_curl_t", name:"Сгибание ног",
          accents:[
            {id:"lying",    name:"Лёжа",  exId:"leg_curl_lying"},
            {id:"seated",   name:"Сидя",  exId:"leg_curl_seated"},
            {id:"standing", name:"Стоя",  exId:"leg_curl_standing"},
          ],
          accentLabel:"ПОЛОЖЕНИЕ",
          fixedEquip:"hammer",
          equips:null, grips:null,
        },
        // РАЗГИБАНИЕ НОГ
        {
          id:"leg_ext_t", name:"Разгибание ног",
          exId:"leg_extension",
          fixedEquip:"hammer",
          accents:null, equips:null, grips:null,
        },
        // ПРИВЕДЕНИЕ / ОТВЕДЕНИЕ
        {
          id:"adduction_t", name:"Приведение / Отведение",
          accents:[
            {id:"adduction", name:"Приведение", exId:"hip_adduction"},
            {id:"abduction", name:"Отведение",  exId:"hip_abduction"},
          ],
          accentLabel:"ДВИЖЕНИЕ",
          fixedEquip:"hammer",
          equips:null, grips:null,
        },
        // ЯГОДИЧНЫЙ МОСТ — снаряд определяет упражнение
        {
          id:"hip_thrust_t", name:"Ягодичный мост",
          equipFirst:true,
          equips:["barbell","smith","hammer"],
          equipsExMap:{
            barbell: "glute_bridge_bar",
            smith:   "glute_bridge_smith",
            hammer:  "glute_bridge_machine",
          },
          equipNames:{hammer:"Тренажёр", smith:"Смит", barbell:"Штанга"},
          accents:null, grips:null,
        },
        // ИКРЫ — положение определяет упражнение
        {
          id:"calf_t", name:"Икры",
          accents:[
            {id:"standing", name:"Стоя",        exId:"calf_raise_standing"},
            {id:"seated",   name:"Сидя",        exId:"calf_raise_seated"},
            {id:"machine",  name:"В тренажёре", exId:"calf_raise_machine"},
          ],
          accentLabel:"ПОЛОЖЕНИЕ",
          equips:null, grips:null,
        },
        // РУМЫНСКАЯ ТЯГА
        {
          id:"romanian_t", name:"Румынская тяга",
          exId:"romanian_dl",
          equips:["barbell","dumbbells","smith"],
          accents:null, grips:null,
        },
        // СТАНОВАЯ ТЯГА
        {
          id:"deadlift_t", name:"Становая тяга",
          exId:"deadlift",
          equips:["barbell"],
          accents:null, grips:null,
        },
        // СУМО ТЯГА — снаряд не выбирается, добавляется сразу
        {
          id:"sumo_t", name:"Сумо тяга",
          exId:"sumo_deadlift",
          fixedEquip:"barbell",
          accents:null, equips:null, grips:null,
        },
      ]
    },
  ],
  "Пресс": [
    {
      id:"abs_cat", name:"Пресс",
      typeLabel:"УПРАЖНЕНИЕ",
      types:[
        // СКРУЧИВАНИЯ — сгибание корпуса
        {
          id:"crunch_t", name:"Скручивания", sub:"сгибание корпуса",
          accents:[
            {id:"bw",      name:"Кранчи",         exId:"crunch_bw"},
            {id:"decline", name:"Наклонная",       exId:"crunch_decline"},
            {id:"cable",   name:"Блок (канат)",    exId:"crunch_cable"},
            {id:"machine", name:"Тренажёр",        exId:"crunch_machine"},
          ],
          accentLabel:"ВИД",
          equips:null, grips:null,
        },
        // ПОДЪЁМ НОГ — акцент на низ
        {
          id:"leg_raise_t", name:"Подъём ног", sub:"акцент на низ",
          accents:[
            {id:"lying",   name:"Лёжа",        exId:"leg_raise_lying"},
            {id:"hanging", name:"В висе",       exId:"leg_raise_hanging"},
            {id:"bars",    name:"На брусьях",   exId:"leg_raise_bars"},
          ],
          accentLabel:"ТИП",
          equips:null, grips:null,
        },
        // ПЛАНКА — удержание корпуса
        {
          id:"plank_t", name:"Планка", sub:"удержание корпуса",
          accents:[
            {id:"normal",   name:"Обычная",        exId:"plank"},
            {id:"side",     name:"Боковая",        exId:"plank_side"},
            {id:"movement", name:"С движением",    exId:"plank_movement"},
          ],
          accentLabel:"ВИД",
          equips:null, grips:null,
        },
        // ПОВОРОТЫ — вращение корпуса
        {
          id:"rotation_t", name:"Повороты", sub:"вращение корпуса",
          accents:[
            {id:"russian", name:"Русские повороты", exId:"russian_twist"},
            {id:"cable",   name:"С блоком",         exId:"cable_rotation"},
          ],
          accentLabel:"ВИД",
          equips:null, grips:null,
        },
        // НАКЛОНЫ — боковая нагрузка
        {
          id:"lateral_t", name:"Наклоны", sub:"боковая нагрузка",
          accents:[
            {id:"db",    name:"С гантелей",  exId:"side_bend_db"},
            {id:"cable", name:"С блоком",    exId:"side_bend_cable"},
          ],
          accentLabel:"ВИД",
          equips:null, grips:null,
        },
      ]
    },
  ],
};

const RPE_OPTIONS = [5,6,7,8,9,10];
const STIMS = TUT_LIST.map(t => t.name);

// ── ИСТОРИЯ (тестовые данные, ключ = exId_equip_grip_accent_tut) ──
// tut='normal' фильтруется из ключа, остальные добавляются
let HISTORY = {
  // Подтягивания · Широкий хват
  "pullup_pullup_bar_wide": {
    date:"5 дней назад", rpe:8,
    sets:[
      {type:'warmup', weight:0,  reps:8},
      {type:'work',   weight:10, reps:6,  rpe:7},
      {type:'work',   weight:10, reps:6,  rpe:8},
      {type:'work',   weight:10, reps:5,  rpe:9},
      {type:'work',   weight:10, reps:4,  rpe:9},
    ]
  },
  // Тяга блока · Cable Wide
  "lat_pulldown_cable_wide": {
    date:"5 дней назад", rpe:7,
    sets:[
      {type:'warmup', weight:40, reps:12},
      {type:'leadup', weight:55, reps:8},
      {type:'work',   weight:70, reps:8,  rpe:7},
      {type:'work',   weight:70, reps:8,  rpe:8},
      {type:'work',   weight:70, reps:7,  rpe:8},
    ]
  },
  // Тяга штанги в наклоне · Прямой хват
  "barbell_row_barbell_straight": {
    date:"8 дней назад", rpe:8,
    sets:[
      {type:'warmup', weight:40, reps:10},
      {type:'leadup', weight:65, reps:6},
      {type:'work',   weight:90, reps:6,  rpe:7},
      {type:'work',   weight:90, reps:6,  rpe:8},
      {type:'work',   weight:90, reps:5,  rpe:9},
    ]
  },
  // Тяга блока к поясу · V-рукоять
  "seated_row_cable_v": {
    date:"8 дней назад", rpe:7,
    sets:[
      {type:'warmup', weight:35, reps:12},
      {type:'work',   weight:65, reps:10, rpe:7},
      {type:'work',   weight:65, reps:10, rpe:8},
      {type:'work',   weight:65, reps:8,  rpe:8},
    ]
  },
  // Жим лёжа · Штанга · Средний · Середина · без паузы
  "bench_press_barbell_medium_middle": {
    date:"3 дня назад", rpe:8,
    sets:[
      {type:'warmup', weight:60,  reps:10},
      {type:'leadup', weight:80,  reps:5},
      {type:'work',   weight:100, reps:5,  rpe:7},
      {type:'work',   weight:100, reps:5,  rpe:8},
      {type:'work',   weight:100, reps:4,  rpe:9},
    ]
  },
  // Жим лёжа · Штанга · Средний · Середина · пауза 1с
  "bench_press_barbell_medium_middle_pause1": {
    date:"10 дней назад", rpe:8,
    sets:[
      {type:'warmup', weight:60,  reps:8},
      {type:'work',   weight:90,  reps:5,  rpe:7},
      {type:'work',   weight:90,  reps:5,  rpe:8},
      {type:'work',   weight:90,  reps:4,  rpe:9},
    ]
  },
  // Жим лёжа · Штанга · Средний · Середина · пауза 3с
  "bench_press_barbell_medium_middle_pause3": {
    date:"18 дней назад", rpe:9,
    sets:[
      {type:'warmup', weight:50,  reps:8},
      {type:'work',   weight:80,  reps:5,  rpe:8},
      {type:'work',   weight:80,  reps:4,  rpe:9},
    ]
  },
  // Жим лёжа · Штанга · Широкий · Середина · без паузы
  "bench_press_barbell_wide_middle": {
    date:"7 дней назад", rpe:8,
    sets:[
      {type:'warmup', weight:60,  reps:8},
      {type:'work',   weight:105, reps:5,  rpe:7},
      {type:'work',   weight:105, reps:5,  rpe:8},
      {type:'work',   weight:100, reps:5,  rpe:8},
    ]
  },
  // Жим лёжа · Штанга · Узкий · Середина · без паузы
  "bench_press_barbell_narrow_middle": {
    date:"14 дней назад", rpe:7,
    sets:[
      {type:'warmup', weight:60, reps:8},
      {type:'work',   weight:85, reps:8,  rpe:7},
      {type:'work',   weight:85, reps:7,  rpe:8},
    ]
  },
};

const EXERCISES = {
  "Грудь": [
    {id:"bench_press",   name:"Жим лёжа",                 last:5,  prev:{w:100,r:5,s:4},  equip:["barbell","dumbbells","smith"],                        grips:["narrow","medium","wide"],  accents:["upper","middle","lower"], notes:"Узкий — трицепс, широкий — грудь"},
    {id:"incline_press", name:"Жим наклонный 45°",         last:35, prev:{w:85,r:8,s:3},   equip:["barbell","dumbbells","smith","hammer"],               grips:["narrow","medium","wide"],  accents:["upper"],                  notes:"Угол 45°, акцент верхняя грудь"},
    {id:"decline_press", name:"Жим под углом вниз",       last:60, prev:{w:90,r:8,s:3},   equip:["barbell","dumbbells","smith"],                        grips:["medium","wide"],           accents:["lower"],                  notes:"Нижняя часть груди"},
    {id:"hammer_chest",  name:"Хаммер грудь",             last:20, prev:{w:80,r:10,s:3},  equip:["hammer"],                                            grips:["neutral"],                 accents:["middle"],                 notes:"Нейтральный хват — меньше нагрузки на плечи"},
    {id:"butterfly",     name:"Бабочка",                  last:14, prev:{w:60,r:12,s:3},  equip:["butterfly"],                                         grips:["neutral"],                 accents:["upper","middle","lower"], notes:"Изоляция. Не разводи слишком широко"},
    {id:"cable_cross",   name:"Кроссовер на блоке",       last:42, prev:{w:20,r:12,s:3},  equip:["cable_single"],                                      grips:["straight","neutral"],      accents:["upper","middle","lower"], notes:"Снизу — нижняя грудь, сверху — верхняя"},
    {id:"dips_chest",    name:"Отжимания на брусьях",     last:8,  prev:{w:20,r:10,s:3},  equip:["dip_bars"],                                          grips:["neutral"],                                                     notes:"Наклон вперёд — акцент грудь"},
    {id:"pushup",          name:"Отжимания от пола",        last:30, prev:{w:0,r:20,s:3},  equip:["bodyweight"],  grips:["narrow","medium","wide"],                                      notes:"Широкая — грудь, узкая — трицепс"},
    {id:"pushup_elevated", name:"Отжимания ноги выше",      last:0,  prev:{w:0,r:15,s:3},  equip:["bodyweight"],  grips:["narrow","medium","wide"],                                      notes:"Ноги на возвышении — акцент верхняя грудь"},
    {id:"gravitron",       name:"Брусья (гравитрон)",       last:0,  prev:{w:-20,r:10,s:3}, equip:["dip_bars"],   grips:["neutral"],                    accents:["middle","lower"],        notes:"Ассист-машина. Наклон вперёд — грудь"},
    {id:"dumbbell_fly",  name:"Разведения гантелей",      last:25, prev:{w:18,r:12,s:3},  equip:["dumbbells"],                                         grips:["neutral"],                 accents:["upper","middle","lower"], notes:"Изоляция. Лёгкий сгиб в локтях"},
    {id:"cable_fly",     name:"Разведения на блоке",      last:50, prev:{w:15,r:12,s:3},  equip:["cable_single"],                                      grips:["straight","neutral"],      accents:["upper","middle","lower"], notes:"Постоянное напряжение по всей амплитуде"},
  ],
  "Спина": [
    {id:"hammer_pulldown",name:"Хаммер вертикальная тяга",last:15, prev:{w:60,r:10,s:3},  equip:["hammer"],                                            grips:["neutral"],                 accents:["upper","lower"],          notes:"Вертикальная тяга в тренажёре хаммер"},
    {id:"pullup",        name:"Подтягивания",              last:7,  prev:{w:20,r:6,s:4},   equip:["pullup_bar"],                                        grips:["narrow","medium","wide","reverse","neutral"], notes:"Широкий — широчайшие, обратный — бицепс"},
    {id:"lat_pulldown",  name:"Тяга блока вертикальная",  last:10, prev:{w:70,r:8,s:4},   equip:["cable_wide","cable_narrow","cable_v","cable_d","cable_single","cable_handle"], grips:["wide","narrow","neutral","reverse"], notes:"Аналог подтягиваний на блоке"},
    {id:"seated_row",    name:"Тяга блока горизонтальная",last:45, prev:{w:65,r:10,s:3},  equip:["cable_v","cable_d","cable_wide","cable_single","cable_handle"], grips:["narrow","medium","wide","neutral"],          notes:"V-рукоять — середина спины"},
    {id:"barbell_row",   name:"Тяга штанги в наклоне",    last:11, prev:{w:90,r:6,s:4},   equip:["barbell","ez"],                                      grips:["straight","reverse","medium","wide"],        notes:"Прямой — трапеция, обратный — широчайшие"},
    {id:"dumbbell_row",  name:"Тяга гантели в наклоне",   last:18, prev:{w:38,r:10,s:3},  equip:["dumbbells"],                                         grips:["neutral"],                                   notes:"Большая амплитуда, хорошая растяжка"},
    {id:"hammer_row",    name:"Хаммер тяга к поясу",      last:22, prev:{w:80,r:10,s:3},  equip:["hammer"],                                            grips:["neutral"],                                   notes:"Нейтральный хват, меньше нагрузки на запястья"},
    {id:"tbar_row",      name:"Тяга T-грифа",              last:35, prev:{w:80,r:8,s:4},   equip:["tbar"],                                              grips:["wide","narrow","neutral"],                   notes:"T-образный гриф — большой диапазон, акцент на среднюю спину"},
    {id:"chest_row",     name:"Тяга с упором в грудь",    last:0,  prev:{w:60,r:10,s:3},  equip:["chest_row_eq"],                                      grips:["neutral"],                                   notes:"Упор устраняет читинг — чистая изолированная нагрузка на спину"},
    {id:"deadlift",      name:"Становая тяга",            last:9,  prev:{w:160,r:5,s:3},  equip:["barbell"],                                           grips:["straight","reverse","medium"],               notes:"Разнохват — можно взять больше веса"},
    {id:"romanian_dl",   name:"Румынская тяга",           last:20, prev:{w:100,r:10,s:3}, equip:["barbell","dumbbells"],                               grips:["straight","medium"],                         notes:"Бицепс бедра и поясница"},
    {id:"hyperextension",name:"Гиперэкстензия",           last:22, prev:{w:30,r:15,s:3},  equip:["bodyweight","barbell"],                              grips:["neutral"],                                   notes:"Не переразгибай в верхней точке"},
    {id:"face_pull",     name:"Тяга к лицу",              last:55, prev:{w:20,r:15,s:3},  equip:["cable_rope"],                                        grips:["neutral"],                                   notes:"Задние дельты и ротаторы. Важно для плеч"},
  ],
  "Бицепс": [
    // Штанга
    {id:"bicep_curl_bar",           name:"Сгибание рук со штангой",              last:10, prev:{w:50,r:8,s:3},  equip:["barbell"],        grips:["straight","reverse","narrow","medium","wide"], notes:"Прямой хват — бицепс; обратный — брахиалис"},
    {id:"bicep_curl_ez",            name:"Сгибание рук с EZ-штангой",            last:8,  prev:{w:45,r:8,s:3},  equip:["ez"],             grips:["straight","narrow","medium"],                  notes:"EZ-гриф снижает нагрузку на запястья"},
    // Гантели
    {id:"bicep_curl_db",            name:"Сгибание рук с гантелями (стоя)",      last:7,  prev:{w:22,r:10,s:3}, equip:["dumbbells"],      grips:["with_sup","no_sup"],                           notes:"Супинация в верхней точке — максимальное сокращение"},
    {id:"bicep_curl_db_seated",     name:"Сгибание рук с гантелями (сидя)",      last:0,  prev:{w:20,r:10,s:3}, equip:["dumbbells"],      grips:["with_sup","no_sup"],                           notes:"Сидя — меньше читинга, чистая изоляция"},
    {id:"bicep_curl_db_incline",    name:"Сгибание рук с гантелями (наклонная)", last:0,  prev:{w:16,r:10,s:3}, equip:["dumbbells"],      grips:["with_sup","no_sup"],                           notes:"Наклонная скамья — максимальная растяжка бицепса"},
    // Блок
    {id:"bicep_curl_cable_straight",name:"Сгибание рук на блоке (прямая)",       last:20, prev:{w:25,r:12,s:3}, equip:["cable_straight"], grips:["straight","reverse"],                          notes:"Постоянное натяжение во всём диапазоне"},
    {id:"bicep_curl_cable_d",       name:"Сгибание рук на блоке (D-образная)",   last:0,  prev:{w:20,r:12,s:3}, equip:["cable_d"],        grips:["straight","neutral","reverse"],                notes:"Одиночная рукоять — изолируем каждую руку"},
    {id:"bicep_curl_cable_rope",    name:"Сгибание рук на блоке (канат)",         last:0,  prev:{w:20,r:12,s:3}, equip:["cable_rope"],     grips:["neutral"],                                     notes:"Канат — нейтральный хват, акцент на брахиалис"},
    // Скамья Скотта
    {id:"preacher_curl_bar",        name:"Скамья Скотта со штангой",             last:30, prev:{w:35,r:10,s:3}, equip:["barbell"],        grips:["straight","reverse","narrow","medium"],        notes:"Полная изоляция бицепса без читинга"},
    {id:"preacher_curl_ez",         name:"Скамья Скотта с EZ-штангой",           last:0,  prev:{w:30,r:10,s:3}, equip:["ez"],             grips:["straight","narrow"],                           notes:"EZ снижает нагрузку на запястья при изоляции"},
    {id:"preacher_curl_db",         name:"Скамья Скотта с гантелями",            last:0,  prev:{w:16,r:10,s:3}, equip:["dumbbells"],        grips:["with_sup","no_sup"],                           notes:"Одна рука — максимальный контроль движения"},
    {id:"preacher_curl_machine",    name:"Скамья Скотта в тренажёре",           last:0,  prev:{w:40,r:10,s:3}, equip:["preacher_machine"], grips:["neutral"],                                     notes:"Тренажёр фиксирует угол — удобно контролировать нагрузку"},
    // Молотки
    {id:"hammer_curl",              name:"Молотки с гантелями (стоя)",           last:6,  prev:{w:22,r:10,s:3}, equip:["dumbbells"],      grips:["neutral"],                                     notes:"Брахиалис и брахиорадиалис — толщина руки"},
    {id:"hammer_curl_seated",       name:"Молотки с гантелями (сидя)",           last:0,  prev:{w:20,r:10,s:3}, equip:["dumbbells"],      grips:["neutral"],                                     notes:"Сидя — чистая изоляция без раскачки"},
    {id:"hammer_curl_cable",        name:"Молотки на блоке (канат)",              last:0,  prev:{w:20,r:10,s:3}, equip:["cable_rope"],     grips:["neutral"],                                     notes:"Постоянное натяжение — нейтральный хват канатом"},
    {id:"bicep_curl_cable_single",   name:"Сгибание рук на блоке (одиночный)",       last:0,  prev:{w:15,r:12,s:3}, equip:["cable_single"],   grips:["straight","neutral","reverse"],            notes:"Одиночная рукоять — изолированная работа каждой руки, устраняет дисбаланс"},
  ],
  "Трицепс": [
    // Жим узкий хват
    {id:"tri_press_bar",            name:"Жим со штангой (узкий хват)",                      last:9,  prev:{w:70,r:8,s:3},  equip:["barbell"],        grips:["narrow"],             notes:"Локти прижаты к корпусу — изоляция трицепса"},
    {id:"tri_press_smith",          name:"Жим в Смите (узкий хват)",                         last:0,  prev:{w:65,r:8,s:3},  equip:["smith"],          grips:["narrow"],             notes:"Смит фиксирует траекторию — удобно дорабатывать объём"},
    // Французский жим лёжа
    {id:"tri_french_lying_bar",     name:"Французский жим лёжа (штанга)",                    last:50, prev:{w:35,r:10,s:3}, equip:["barbell"],        grips:["narrow"],             notes:"Максимальная амплитуда — акцент на длинную головку"},
    {id:"tri_french_lying_ez",      name:"Французский жим лёжа (EZ-гриф)",                   last:0,  prev:{w:30,r:10,s:3}, equip:["ez"],             grips:["narrow"],             notes:"EZ снижает нагрузку на запястья"},
    {id:"tri_french_lying_db",      name:"Французский жим лёжа (гантели)",                   last:0,  prev:{w:16,r:10,s:3}, equip:["dumbbells"],      grips:["neutral"],            notes:"Независимая амплитуда каждой руки — меньше дисбаланса"},
    // Французский жим сидя
    {id:"tri_french_seated_ez",     name:"Французский жим сидя (EZ-гриф)",                   last:0,  prev:{w:25,r:10,s:3}, equip:["ez"],             grips:["narrow"],             notes:"Сидя — удобно для EZ-грифа, стабильная спина"},
    {id:"tri_french_seated_db",     name:"Французский жим сидя (гантели)",                   last:0,  prev:{w:14,r:10,s:3}, equip:["dumbbells"],      grips:["neutral"],            notes:"Удобен при акценте на форму и лёгком весе"},
    // Блок вниз
    {id:"tri_cable_down_rope",      name:"Разгибание рук на блоке вниз (канат)",              last:9,  prev:{w:30,r:12,s:3}, equip:["cable_rope"],     grips:["neutral"],            notes:"Нейтральный хват, естественное движение запястий"},
    {id:"tri_cable_down_v",         name:"Разгибание рук на блоке вниз (V-рукоять)",         last:0,  prev:{w:32,r:12,s:3}, equip:["cable_v"],        grips:["neutral"],            notes:"V-рукоять — комфортный нейтральный хват"},
    {id:"tri_cable_down_straight",  name:"Разгибание рук на блоке вниз (прямая рукоять)",    last:0,  prev:{w:28,r:12,s:3}, equip:["cable_straight"], grips:["straight","reverse"], notes:"Прямая рукоять — можно варьировать хват"},
    {id:"tri_cable_down_single",    name:"Разгибание рук на блоке вниз (одной рукой)",       last:0,  prev:{w:15,r:12,s:3}, equip:["cable_single"],   grips:["neutral"],            notes:"Одной рукой — устранение мышечного дисбаланса"},
    {id:"tri_cable_down_d",           name:"Разгибание рук на блоке вниз (W-рукоять)",         last:0,  prev:{w:28,r:12,s:3}, equip:["cable_d"],         grips:["neutral"],            notes:"W-рукоять — нейтральный хват, комфортное положение запястий"},
    // Блок из-за головы
    {id:"tri_cable_overhead_rope",  name:"Разгибание рук на блоке из-за головы (канат)",     last:0,  prev:{w:20,r:12,s:3}, equip:["cable_rope"],     grips:["neutral"],            notes:"Максимальное растяжение длинной головки"},
    {id:"tri_cable_overhead_single",  name:"Разгибание рук на блоке из-за головы (одной рукой)",       last:0, prev:{w:12,r:12,s:3}, equip:["cable_single"],        grips:["neutral"],            notes:"Одной рукой — контроль и коррекция дисбаланса"},
    {id:"tri_cable_overhead_straight", name:"Разгибание рук на блоке из-за головы (прямая рукоять)",    last:0, prev:{w:20,r:12,s:3}, equip:["cable_straight"],      grips:["straight","reverse"],notes:"Прямая рукоять — можно варьировать хват при разгибании"},
    {id:"tri_cable_down_rope_single",   name:"Разгибание рук на блоке вниз (одиночный канат)",          last:0, prev:{w:18,r:12,s:3}, equip:["cable_rope_single"],   grips:["neutral"],            notes:"Одиночный канат — одной рукой, устраняет дисбаланс"},
    // Брусья
    {id:"dips_tri",                 name:"Отжимания на брусьях (трицепс)",                   last:4,  prev:{w:10,r:12,s:3},  equip:["dip_bars"],      grips:["neutral"],            notes:"Вертикальный корпус, локти прижаты — акцент трицепс"},
    {id:"dips_tri_gravitron",       name:"Брусья трицепс (гравитрон)",                        last:0,  prev:{w:-20,r:10,s:3}, equip:["dip_bars"],      grips:["neutral"],            notes:"Ассист-машина — удобен для новичков и объёмных тренировок"},
  ],
  "Плечи": [
    // ── Жим ──
    {id:"shoulder_press_bar",    name:"Жим штангой",                   last:14, prev:{w:60,r:6,s:4},  equip:["barbell"],      grips:["narrow","medium","wide"], notes:"Базовый жим стоя или сидя. Широкий хват — акцент средняя дельта"},
    {id:"shoulder_press_db",     name:"Жим гантелями",                 last:7,  prev:{w:24,r:8,s:4},  equip:["dumbbells"],    grips:["neutral"],               notes:"Больший диапазон движения чем со штангой. Стоя или сидя"},
    {id:"shoulder_press_smith",  name:"Жим в Смите",                   last:30, prev:{w:50,r:8,s:4},  equip:["smith"],        grips:["medium","wide"],          notes:"Фиксированная траектория — меньше стабилизация, больше изоляция"},
    {id:"shoulder_press_hammer", name:"Жим в тренажёре",               last:21, prev:{w:55,r:10,s:3}, equip:["hammer"],       grips:["neutral"],               notes:"Тренажёрный жим — безопасен при проблемах со стабилизацией"},
    // ── Махи ──
    {id:"shoulder_raise_side_db",     name:"Махи в стороны (гантели)",      last:4,  prev:{w:12,r:15,s:4}, equip:["dumbbells"],    grips:["neutral"],  notes:"Изоляция средней дельты. Лёгкий наклон вперёд"},
    {id:"shoulder_raise_side_cable",  name:"Махи в стороны (блок)",         last:10, prev:{w:10,r:15,s:3}, equip:["cable_single"], grips:["neutral"],  notes:"Постоянное натяжение в нижней точке — лучше для изоляции"},
    {id:"shoulder_raise_side_hammer", name:"Махи в стороны (тренажёр)",     last:28, prev:{w:15,r:15,s:3}, equip:["hammer"],       grips:["neutral"],  notes:"Унилатеральный тренажёр — удобно для коррекции дисбаланса"},
    {id:"shoulder_raise_front_db",    name:"Махи вперёд (гантели)",         last:20, prev:{w:10,r:15,s:3}, equip:["dumbbells"],    grips:["straight"], notes:"Передняя дельта. Попеременно или одновременно"},
    {id:"shoulder_raise_front_cable", name:"Махи вперёд (блок)",            last:35, prev:{w:10,r:15,s:3}, equip:["cable_single"], grips:["straight"], notes:"Постоянное натяжение, передняя дельта"},
    {id:"shoulder_raise_rear_db",     name:"Махи в наклоне (гантели)",      last:6,  prev:{w:10,r:15,s:4}, equip:["dumbbells"],    grips:["neutral"],  notes:"Задняя дельта. Корпус почти параллелен полу"},
    {id:"shoulder_raise_rear_cable",  name:"Махи в наклоне (блок)",         last:14, prev:{w:10,r:15,s:3}, equip:["cable_single"], grips:["neutral"],  notes:"Постоянное натяжение, задняя дельта"},
    // ── Бабочка ──
    {id:"rear_delt_machine", name:"Бабочка (задняя дельта)", last:14, prev:{w:30,r:15,s:3}, equip:["butterfly"], grips:["neutral"], notes:"Изоляция задней дельты — важно для осанки и здоровья плеч"},
    // ── Тяга к подбородку ──
    {id:"upright_row_bar",   name:"Тяга к подбородку (штанга)", last:45, prev:{w:40,r:12,s:3}, equip:["barbell"],      grips:["narrow","medium"], notes:"Трапеция + средние дельты. Хват не уже плеч"},
    {id:"upright_row_ez",    name:"Тяга к подбородку (EZ)",     last:60, prev:{w:35,r:12,s:3}, equip:["ez"],           grips:["narrow","medium"], notes:"EZ-гриф снижает нагрузку на запястья"},
    {id:"upright_row_db",    name:"Тяга к подбородку (гантели)",last:50, prev:{w:16,r:12,s:3}, equip:["dumbbells"],    grips:["neutral"],         notes:"Больший диапазон движения, независимые руки"},
    {id:"upright_row_cable", name:"Тяга к подбородку (блок)",   last:40, prev:{w:30,r:12,s:3}, equip:["cable_rope"],   grips:["neutral"],         notes:"Постоянное натяжение по всей амплитуде"},
    // ── Шраги ──
    {id:"shrug_bar",    name:"Шраги (штанга)",    last:20, prev:{w:100,r:12,s:3}, equip:["barbell"],   grips:["straight","neutral"], notes:"Трапеция. Задержка в верхней точке"},
    {id:"shrug_db",     name:"Шраги (гантели)",   last:25, prev:{w:30,r:12,s:3},  equip:["dumbbells"], grips:["neutral"],            notes:"Свободный диапазон — можно немного вращать плечи"},
    {id:"shrug_smith",  name:"Шраги в Смите",     last:35, prev:{w:80,r:12,s:3},  equip:["smith"],     grips:["straight"],           notes:"Фиксированная траектория — удобна при большом весе"},
    {id:"shrug_hammer", name:"Шраги в тренажёре", last:30, prev:{w:70,r:12,s:3},  equip:["hammer"],    grips:["neutral"],            notes:"Тренажёрные шраги — хорош для объёмной работы"},
  ],
  "Ноги": [
    // ── Приседания ──
    {id:"squat_bar_classic",  name:"Приседания классические (штанга)", last:7,  prev:{w:140,r:5,s:4},  equip:["barbell"], grips:[], notes:"Основное упражнение для квадрицепсов и ягодиц. Штанга на трапеции"},
    {id:"squat_smith",        name:"Приседания в Смите (классик)",     last:14, prev:{w:100,r:8,s:4},  equip:["smith"],   grips:[], notes:"Фиксированная траектория — удобно для изучения техники"},
    {id:"squat_db",           name:"Приседания с гантелями",           last:21, prev:{w:30,r:12,s:3},  equip:["dumbbells"],grips:[],notes:"Удобно для домашних тренировок или разминки"},
    {id:"squat_bar_front",    name:"Фронтальные приседания (штанга)",  last:30, prev:{w:100,r:5,s:4},  equip:["barbell"], grips:[], notes:"Штанга на передних дельтах — акцент квадрицепс, более вертикальный корпус"},
    {id:"squat_front_smith",  name:"Фронтальные приседания в Смите",   last:45, prev:{w:80,r:8,s:3},   equip:["smith"],   grips:[], notes:"Фронтальный присед в тренажёре Смита"},
    {id:"squat_sumo_bar",     name:"Сумо-присед (штанга)",             last:20, prev:{w:120,r:6,s:3},  equip:["barbell"], grips:[], notes:"Широкая постановка — приводящие и ягодицы"},
    {id:"squat_sumo_db",      name:"Сумо-присед (гантель)",            last:28, prev:{w:32,r:12,s:3},  equip:["dumbbells"],grips:[],notes:"Гантель между ног, присед сумо — удобно без штанги"},
    // ── Тренажёры ──
    {id:"leg_press",     name:"Жим платформы",  last:12, prev:{w:200,r:10,s:3}, equip:["leg_press_eq"], grips:[], notes:"Постановка ног меняет акцент: высоко — ягодицы, низко — квадрицепс"},
    {id:"hack_squat",    name:"Гак-присед",     last:40, prev:{w:120,r:10,s:3}, equip:["hack"],         grips:[], notes:"Спина зафиксирована — чистая нагрузка на квадрицепс"},
    {id:"leg_extension", name:"Разгибание ног", last:40, prev:{w:55,r:12,s:3},  equip:["hammer"],       grips:[], notes:"Изоляция квадрицепса"},
    // ── Выпады ──
    {id:"lunge_static",    name:"Выпады на месте",    last:5,  prev:{w:24,r:10,s:3}, equip:["dumbbells","barbell","smith"], grips:[], notes:"Классические выпады на месте — квадрицепс и ягодицы"},
    {id:"lunge_walking",   name:"Выпады в ходьбе",    last:10, prev:{w:20,r:12,s:3}, equip:["dumbbells","sandbag"],         grips:[], notes:"Динамическая версия — больше координации и нагрузки на ягодицы"},
    {id:"lunge_bulgarian", name:"Болгарские выпады",  last:8,  prev:{w:20,r:10,s:3}, equip:["dumbbells","barbell","smith"], grips:[], notes:"Задняя нога на лавке — акцент ягодицы и растяжка сгибателей бедра"},
    {id:"lunge_step_up",   name:"Зашагивания на тумбу",last:15,prev:{w:20,r:10,s:3}, equip:["dumbbells","sandbag"],         grips:[], notes:"Унилатеральная нагрузка — ягодицы и баланс"},
    // ── Сгибание ног ──
    {id:"leg_curl_lying",   name:"Сгибание ног лёжа",  last:25, prev:{w:50,r:12,s:3}, equip:["hammer"], grips:[], notes:"Изоляция бицепса бедра лёжа"},
    {id:"leg_curl_seated",  name:"Сгибание ног сидя",  last:30, prev:{w:45,r:12,s:3}, equip:["hammer"], grips:[], notes:"Сидя — длиннее амплитуда, акцент на нижнюю часть бицепса бедра"},
    {id:"leg_curl_standing",name:"Сгибание ног стоя",  last:45, prev:{w:25,r:12,s:3}, equip:["hammer"], grips:[], notes:"Унилатеральная изоляция бицепса бедра"},
    // ── Приведение / отведение ──
    {id:"hip_adduction", name:"Приведение ног", last:0,  prev:{w:40,r:15,s:3}, equip:["hammer"], grips:[], notes:"Приводящие мышцы бедра"},
    {id:"hip_abduction", name:"Отведение ног",  last:0,  prev:{w:35,r:15,s:3}, equip:["hammer"], grips:[], notes:"Средняя ягодичная мышца"},
    // ── Ягодичный мост ──
    {id:"glute_bridge_bar",     name:"Ягодичный мост (штанга)",    last:35, prev:{w:80,r:12,s:3}, equip:["barbell"], grips:[], notes:"Полное сокращение ягодиц в верхней точке. Штанга на тазе"},
    {id:"glute_bridge_smith",   name:"Ягодичный мост в Смите",     last:40, prev:{w:70,r:12,s:3}, equip:["smith"],   grips:[], notes:"Фиксированная траектория — удобен при большом весе"},
    {id:"glute_bridge_machine", name:"Ягодичный мост (тренажёр)",  last:28, prev:{w:60,r:12,s:3}, equip:["hammer"],  grips:[], notes:"Тренажёрный хип-траст — безопасная траектория"},
    // ── Икры ──
    {id:"calf_raise_standing", name:"Икры стоя",        last:15, prev:{w:80,r:15,s:4}, equip:["hammer","barbell","bodyweight"], grips:[], notes:"Обе головки икры. Полная амплитуда"},
    {id:"calf_raise_seated",   name:"Икры сидя",        last:20, prev:{w:40,r:15,s:4}, equip:["hammer"],                       grips:[], notes:"Акцент камбаловидная мышца. Колени согнуты 90°"},
    {id:"calf_raise_machine",  name:"Икры в тренажёре", last:25, prev:{w:70,r:15,s:3}, equip:["hammer"],                       grips:[], notes:"Жим платформой от носков — большая нагрузка"},
    // ── Тяги ──
    {id:"romanian_dl",  name:"Румынская тяга",  last:20, prev:{w:100,r:8,s:3}, equip:["barbell","dumbbells","smith"], grips:[], notes:"Бицепс бедра и ягодицы. Спина прямая, колени немного согнуты"},
    {id:"deadlift",     name:"Становая тяга",   last:14, prev:{w:160,r:5,s:4}, equip:["barbell"],                    grips:[], notes:"Базовое многосуставное упражнение. Спина нейтральна"},
    {id:"sumo_deadlift",name:"Сумо тяга",       last:0,  prev:{w:120,r:5,s:3}, equip:["barbell","dumbbells","smith"], grips:[], notes:"Широкая постановка — акцент приводящие и ягодицы"},
  ],
  "Пресс": [
    // ── Скручивания ──
    {id:"crunch_bw",      name:"Скручивания (с весом тела)", last:3,  prev:{w:0,r:20,s:3},  equip:["bodyweight"], grips:[], notes:"Базовые скручивания. Не тяни за шею — сокращай пресс"},
    {id:"crunch_decline", name:"Скручивания на наклонной",  last:14, prev:{w:5,r:15,s:3},  equip:["disc"],       grips:[], notes:"Наклонная скамья — больший диапазон движения"},
    {id:"crunch_cable",   name:"Скручивания блок (канат)",  last:10, prev:{w:25,r:15,s:3}, equip:["cable_rope"], grips:[], notes:"Постоянное натяжение. С весом — прогрессия нагрузки"},
    {id:"crunch_machine", name:"Скручивания в тренажёре",   last:20, prev:{w:40,r:15,s:3}, equip:["hammer"],     grips:[], notes:"Тренажёрные скручивания — безопасно для позвоночника"},
    // ── Подъём ног ──
    {id:"leg_raise_lying",   name:"Подъём ног лёжа",      last:48, prev:{w:0,r:15,s:3}, equip:["bodyweight"], grips:[], notes:"Нижний пресс. Поясница прижата к полу. Без раскачки"},
    {id:"leg_raise_hanging", name:"Подъём ног в висе",    last:35, prev:{w:0,r:10,s:3}, equip:["pullup_bar"], grips:[], notes:"В висе — больше амплитуды. Можно с отягощением"},
    {id:"leg_raise_bars",    name:"Подъём ног на брусьях",last:40, prev:{w:0,r:12,s:3}, equip:["dip_bars"],   grips:[], notes:"На брусьях с упором на предплечья — устойчивее"},
    // ── Планка ──
    {id:"plank",          name:"Планка",              last:8,  prev:{w:0,r:60,s:3},  equip:["bodyweight"],   grips:[], notes:"Статика — кор целиком. Повторы = секунды"},
    {id:"plank_side",     name:"Боковая планка",       last:15, prev:{w:0,r:30,s:3},  equip:["bodyweight"],   grips:[], notes:"Акцент косые мышцы. Таз не провисает"},
    {id:"plank_movement", name:"Планка с движением",   last:0,  prev:{w:0,r:30,s:3},  equip:["bodyweight"],   grips:[], notes:"Шаги, касания плеч или тяга — добавляет нестабильность"},
    // ── Повороты ──
    {id:"ab_twist",       name:"Повороты (общее)",     last:20, prev:{w:10,r:20,s:3}, equip:["disc","dumbbells","cable_rope"], grips:[], notes:"Косые мышцы. Контролируй движение, не маши руками"},
    {id:"russian_twist",  name:"Русские повороты",     last:0,  prev:{w:8,r:20,s:3},  equip:["disc","dumbbells"], grips:[], notes:"Сидя, наклон ~45°. Поворачивай корпус, не руки. Ноги вверх — сложнее"},
    {id:"cable_rotation", name:"Повороты с блоком",    last:0,  prev:{w:15,r:15,s:3}, equip:["cable_single"],     grips:[], notes:"Блок на уровне груди. Руки прямые — вращение идёт от корпуса"},
    // ── Наклоны ──
    {id:"side_bend_db",   name:"Наклоны с гантелей",  last:0,  prev:{w:20,r:15,s:3}, equip:["dumbbells"],    grips:[], notes:"Одна рука у бедра. Наклон строго вбок — только косые мышцы"},
    {id:"side_bend_cable",name:"Наклоны в блоке",      last:0,  prev:{w:20,r:15,s:3}, equip:["cable_single"], grips:[], notes:"Блок сбоку на уровне бедра. Постоянное натяжение на косых"},
  ],
};

// ── Equipment prepositions (legacy, kept for reference) ──
const EQUIP_PREP = {
  barbell:'со штангой', ez:'с EZ-грифом', dumbbells:'с гантелями',
  smith:'в Смите', hammer:'в хаммере', butterfly:'',
  cable_rope:'на блоке', cable_straight:'на блоке', cable_v:'на блоке',
  cable_single:'на блоке', cable_wide:'на блоке', cable_narrow:'на блоке',
  cable_d:'на блоке', cable_handle:'на блоке', cable_rope_single:'на блоке', cable_v_small:'на блоке', scott:'на скамье Скотта', preacher_machine:'в тренажёре',
  leg_press_eq:'', hack:'', bodyweight:'', dip_bars:'', pullup_bar:'',
  tbar:'с Т-грифом', chest_row_eq:'', disc:'', sandbag:'с мешком',
};
// ── Equipment short labels for "Name · Equip" format ──
const EQUIP_SHORT = {
  barbell:'Штанга', ez:'EZ-гриф', dumbbells:'Гантели',
  smith:'Смит', hammer:'Хаммер', butterfly:'',
  cable_rope:'Блок', cable_straight:'Блок', cable_v:'Блок',
  cable_single:'Блок', cable_wide:'Блок', cable_narrow:'Блок',
  cable_d:'Блок', cable_handle:'Блок', cable_rope_single:'Блок', cable_v_small:'Блок', scott:'Скотт', preacher_machine:'Тренажёр',
  leg_press_eq:'', hack:'', bodyweight:'', dip_bars:'', pullup_bar:'',
  tbar:'Т-гриф', chest_row_eq:'', disc:'', sandbag:'Мешок',
};
// ── Accent short labels ──
const ACCENT_SHORT = {
  upper:'Верх', middle:'Середина', lower:'Низ',
  floor:'С пола', elevated:'Ноги выше',
  flat:'Горизонталь', incline:'Наклон вверх',
};
// ── Exercises where the accent is inherently obvious from the name ──
const SUPPRESS_ACCENT_EX = new Set(['incline_press','decline_press','hammer_chest']);
// ── Press exercises: grip WIDTH is primary, grip TYPE hidden ──
const PRESS_EX_IDS = new Set(['bench_press','incline_press','decline_press']);
// ── Per-exercise variations (специфические редкие техники) ──
// equip: [] означает доступно для любого снаряда; иначе фильтруется по текущему
const EX_VARIATIONS = {
  // Только горизонтальный жим — обратный хват и гильотина
  'bench_press': [
    {id:'reverse_grip', name:'Обратный хват', equip:['barbell','smith']},
    {id:'guillotine',   name:'Гильотина',     equip:['barbell']},
  ],
  // incline_press и decline_press — вариаций нет (тоглер показывается серым)
};

const MUSCLE_GEN = {
  'Грудь':'груди','Спина':'спины','Бицепс':'бицепса',
  'Трицепс':'трицепса','Плечи':'плеч','Ноги':'ног','Пресс':'пресса',
};

/**
 * Build compound display name: "Жим лёжа · Смит · Верх"
 * baseName — base exercise name from DB
 * equipId  — equipment id (e.g. 'smith', 'barbell')
 * accentId — accent id (e.g. 'middle', 'upper')
 * muscle   — muscle group string (e.g. 'Грудь') — kept for API compat, unused
 * exId     — exercise id for accent suppression (e.g. 'incline_press')
 */
function formatExName(baseName, equipId, accentId, muscle, exId) {
  const parts = [baseName];
  // Equipment label — skip if name already mentions it
  const short = equipId ? EQUIP_SHORT[equipId] : null;
  if (short) {
    const nameHasEquip = /штанг|гантел|блок|смит|хаммер|T-гриф|Т-гриф|скотт|тренажёр|\(EZ\)/i.test(baseName);
    if (!nameHasEquip) parts.push(short);
  }
  // Accent label — skip for exercises where it's inherently obvious
  if (accentId && !(exId && SUPPRESS_ACCENT_EX.has(exId))) {
    const acShort = ACCENT_SHORT[accentId];
    if (acShort) parts.push(acShort);
  }
  return parts.join(' · ');
}

function prevOf(id) {
  for (const group of Object.values(EXERCISES)) {
    const found = group.find(e => e.id === id);
    if (found) return found.prev;
  }
  return {w:60, r:8, s:3};
}
function exGrips(ex) {
  if (!ex.grips || ex.grips.length === 0) return GRIPS_LIST;
  return GRIPS_LIST.filter(g => ex.grips.includes(g.id));
}
function exEquip(ex) {
  if (!ex.equip || ex.equip.length === 0) return EQUIPMENT_LIST;
  return EQUIPMENT_LIST.filter(e => ex.equip.includes(e.id));
}


const SUPPS_DATA = [
  {name:"Креатин",   dose:"5г",      timing:"Утром",            tag:"СИЛА",    col:"#C8FF00"},
  {name:"Протеин",   dose:"30г",     timing:"После тренировки", tag:"МАССА",   col:"#06B6D4"},
  {name:"Омега-3",   dose:"2г",      timing:"С едой",           tag:"ЗДОРОВЬЕ",col:"#FF6B35"},
  {name:"Витамин D", dose:"5000 МЕ", timing:"Утром",            tag:"ЗДОРОВЬЕ",col:"#FF6B35"},
  {name:"Магний",    dose:"400мг",   timing:"На ночь",          tag:"СОН",     col:"#a855f7"},
  {name:"Цинк",      dose:"25мг",    timing:"На ночь",          tag:"ТЕСТ",    col:"#a855f7"},
];

const PROGRAMS = [
  {id:1, name:"5/3/1 BBB",          author:"Джим Вендлер",    days:4, weeks:16, goal:"сила",  level:"средний",     focus:"Базовые движения с линейным ростом нагрузки.",    results:["+5–10 кг к жиму за цикл", "Стабильный прогресс 6–12 мес"]},
  {id:2, name:"Texas Method",       author:"Марк Риппето",    days:3, weeks:8,  goal:"сила",  level:"новичок",     focus:"Объём в начале недели, интенсивность в конце.",   results:["+2.5 кг/нед на приседе", "Быстрый старт с нуля"]},
  {id:3, name:"Sheiko #37",         author:"Борис Шейко",     days:4, weeks:12, goal:"сила",  level:"средний",     focus:"Высокий тоннаж на приседе, жиме и тяге.",        results:["Рост техники и объёма", "+15–20% к рабочему весу"]},
  {id:4, name:"Push Pull Legs",     author:"Классика",        days:6, weeks:8,  goal:"масса", level:"средний",     focus:"Разделение: толчок / тяга / ноги. Высокая частота.", results:["+2–3 кг мышц за цикл", "Прокачка всех групп 2×/нед"]},
  {id:5, name:"ГЗТ Протокол А",    author:"Спорт. медицина", days:4, weeks:12, goal:"масса", level:"продвинутый", focus:"Силовая работа под гормональную оптимизацию.",    results:["+4–6 кг мышц за цикл", "Ускоренное восстановление"]},
  {id:6, name:"ХАРДКОР МАССОНАБОР",author:"Элита",            days:5, weeks:20, goal:"масса", level:"продвинутый", focus:"Максимальный объём и нагрузка для опытных.",      results:["+5–8 кг мышц", "Предел рабочей ёмкости"]},
];

// ─────────────── PROGRAM STRUCTURE ──────────────
const PROG_EX_MAP = {
  'Присед':               {exId:'squat',         name:'Приседания',              muscle:'Ноги',   equip:'barbell'},
  'Присед (BBB)':         {exId:'squat',         name:'Приседания (BBB)',         muscle:'Ноги',   equip:'barbell'},
  'Жим лёжа':            {exId:'bench_press',    name:'Жим лёжа',                muscle:'Грудь',  equip:'barbell'},
  'Жим лёжа (BBB)':      {exId:'bench_press',    name:'Жим лёжа (BBB)',          muscle:'Грудь',  equip:'barbell'},
  'Становая тяга':        {exId:'deadlift',       name:'Становая тяга',           muscle:'Спина',  equip:'barbell'},
  'Становая тяга (BBB)':  {exId:'deadlift',       name:'Становая тяга (BBB)',     muscle:'Спина',  equip:'barbell'},
  'Жим стоя':             {exId:'shoulder_press', name:'Жим',                    muscle:'Плечи',  equip:'barbell'},
  'Подтягивания':         {exId:'pullup',         name:'Подтягивания',            muscle:'Спина',  equip:'pullup_bar'},
  'Жим наклонный':        {exId:'incline_press',  name:'Жим наклонный 45°',      muscle:'Грудь',  equip:'barbell'},
  'Жим на наклонной':     {exId:'incline_press',  name:'Жим наклонный 45°',      muscle:'Грудь',  equip:'barbell'},
  'Тяга штанги':          {exId:'barbell_row',    name:'Тяга штанги в наклоне',   muscle:'Спина',  equip:'barbell'},
  'Тяга гантели':         {exId:'dumbbell_row',   name:'Тяга гантели в наклоне',  muscle:'Спина',  equip:'dumbbells'},
  'Тяга блока':           {exId:'lat_pulldown',   name:'Тяга блока вертикальная', muscle:'Спина',  equip:'cable_wide'},
  'Румынская тяга':       {exId:'romanian_dl',    name:'Румынская тяга',          muscle:'Спина',  equip:'barbell'},
  'Жим ногами':           {exId:'leg_press',      name:'Жим платформы',           muscle:'Ноги',   equip:'leg_press_eq'},
  'Выпады':               {exId:'lunge',          name:'Выпады',                  muscle:'Ноги',   equip:'dumbbells'},
  'Сгибания ног':         {exId:'leg_curl',       name:'Сгибания ног',            muscle:'Ноги',   equip:'hammer'},
  'Бабочка':              {exId:'butterfly',      name:'Бабочка',                 muscle:'Грудь',  equip:'butterfly'},
  'Отжимания на брусьях': {exId:'dips_chest',     name:'Отжимания на брусьях',    muscle:'Грудь',  equip:'dip_bars'},
};

const PROGRAM_STRUCTURE = (() => {
  // ── 5/3/1 BBB (id=1) ─────────────────────
  const bbbWeeks = [];
  const bbbPcts  = [[65,75,85],[70,80,90],[75,85,95],[40,50,60]];
  const bbbDays  = [
    ['День 1 — Присед + Жим (BBB)',       'Присед',        'Жим лёжа (BBB)'],
    ['День 2 — Жим + Становая (BBB)',     'Жим лёжа',      'Становая тяга (BBB)'],
    ['День 3 — Становая + Присед (BBB)', 'Становая тяга', 'Присед (BBB)'],
    ['День 4 — ОГП + Жим (BBB)',         'Жим стоя',      'Жим лёжа (BBB)'],
  ];
  for (let cycle = 0; cycle < 4; cycle++) {
    for (let wi = 0; wi < 4; wi++) {
      const pcts   = bbbPcts[wi];
      const deload = wi === 3;
      const mainSets = deload
        ? pcts.map(p => ({pct:p,reps:5}))
        : [{pct:pcts[0],reps:5},{pct:pcts[1],reps:5},{pct:pcts[2],reps:'5+',note:'AMRAP'}];
      const bbbSets = Array.from({length:5},()=>({pct:deload?40:50,reps:10}));
      bbbWeeks.push({
        label: 'Неделя ' + (cycle*4+wi+1) + (deload ? ' — Разгрузка' : ' — ' + pcts.join('/') + '%'),
        days: bbbDays.map(([label, main, acc]) => ({label, exercises:[
          {name:main, sets:mainSets.map(s=>({...s}))},
          {name:acc,  sets:bbbSets.map(s=>({...s}))},
        ]})),
      });
    }
  }

  // ── Texas Method (id=2) ───────────────────
  const txWeeks = Array.from({length:8},(_,i) => ({
    label: 'Неделя ' + (i+1),
    days: [
      {label:'Объёмный день (Пн)', exercises:[
        {name:'Присед',      sets:[{pct:90,reps:5},{pct:90,reps:5},{pct:90,reps:5},{pct:90,reps:5},{pct:90,reps:5}]},
        {name:'Жим лёжа',   sets:[{pct:90,reps:5},{pct:90,reps:5},{pct:90,reps:5},{pct:90,reps:5},{pct:90,reps:5}]},
        {name:'Становая тяга', sets:[{pct:90,reps:4}]},
      ]},
      {label:'Восстановительный день (Ср)', exercises:[
        {name:'Присед',       sets:[{pct:80,reps:5},{pct:80,reps:5},{pct:80,reps:5}]},
        {name:'Жим стоя',    sets:[{pct:80,reps:5},{pct:80,reps:5},{pct:80,reps:5},{pct:80,reps:5},{pct:80,reps:5}]},
        {name:'Подтягивания', sets:[{pct:null,reps:8},{pct:null,reps:8},{pct:null,reps:8}]},
      ]},
      {label:'Интенсивный день (Пт)', exercises:[
        {name:'Присед',       sets:[{pct:100,reps:5,note:'Новый 5ПМ'}]},
        {name:'Жим лёжа',    sets:[{pct:100,reps:5,note:'Новый 5ПМ'}]},
        {name:'Становая тяга',sets:[{pct:100,reps:5,note:'Новый 5ПМ'}]},
      ]},
    ],
  }));

  // ── Sheiko #37 (id=3) ────────────────────
  const shDays = [
    {label:'День 1', exercises:[
      {name:'Жим лёжа',    sets:[{pct:50,reps:5},{pct:60,reps:4},{pct:70,reps:3},{pct:75,reps:3},{pct:75,reps:3},{pct:75,reps:3}]},
      {name:'Присед',      sets:[{pct:60,reps:5},{pct:70,reps:4},{pct:80,reps:3},{pct:80,reps:3},{pct:80,reps:3}]},
    ]},
    {label:'День 2', exercises:[
      {name:'Присед',        sets:[{pct:55,reps:5},{pct:65,reps:4},{pct:70,reps:3},{pct:75,reps:3},{pct:75,reps:3}]},
      {name:'Становая тяга', sets:[{pct:60,reps:5},{pct:70,reps:4},{pct:80,reps:3},{pct:80,reps:3},{pct:80,reps:3}]},
    ]},
    {label:'День 3', exercises:[
      {name:'Жим лёжа', sets:[{pct:55,reps:5},{pct:65,reps:4},{pct:70,reps:3},{pct:75,reps:3},{pct:75,reps:3}]},
      {name:'Присед',   sets:[{pct:60,reps:5},{pct:70,reps:4},{pct:75,reps:3},{pct:80,reps:3},{pct:80,reps:3}]},
    ]},
    {label:'День 4', exercises:[
      {name:'Становая тяга', sets:[{pct:55,reps:5},{pct:65,reps:4},{pct:70,reps:3},{pct:75,reps:3}]},
      {name:'Жим лёжа',     sets:[{pct:50,reps:5},{pct:60,reps:4},{pct:65,reps:3},{pct:70,reps:3}]},
    ]},
  ];
  const shWeeks = Array.from({length:12},(_,i) => ({
    label:'Неделя ' + (i+1),
    days: shDays.map(d => ({...d, exercises: d.exercises.map(e => ({...e, sets: e.sets.map(s=>({...s}))}))})),
  }));

  // ── Push Pull Legs (id=4) ────────────────
  const pplDays = [
    {label:'Толчок (Пн)', exercises:[
      {name:'Жим лёжа',      sets:[{pct:75,reps:8},{pct:75,reps:8},{pct:75,reps:8},{pct:75,reps:8}]},
      {name:'Жим на наклонной',sets:[{pct:65,reps:10},{pct:65,reps:10},{pct:65,reps:10}]},
      {name:'Жим стоя',      sets:[{pct:70,reps:8},{pct:70,reps:8},{pct:70,reps:8}]},
    ]},
    {label:'Тяга (Вт)', exercises:[
      {name:'Подтягивания', sets:[{pct:null,reps:8},{pct:null,reps:8},{pct:null,reps:8},{pct:null,reps:8}]},
      {name:'Тяга штанги',  sets:[{pct:70,reps:8},{pct:70,reps:8},{pct:70,reps:8}]},
      {name:'Тяга блока',   sets:[{pct:65,reps:10},{pct:65,reps:10},{pct:65,reps:10}]},
    ]},
    {label:'Ноги (Ср)', exercises:[
      {name:'Присед',       sets:[{pct:75,reps:8},{pct:75,reps:8},{pct:75,reps:8},{pct:75,reps:8}]},
      {name:'Жим ногами',   sets:[{pct:70,reps:10},{pct:70,reps:10},{pct:70,reps:10}]},
      {name:'Румынская тяга',sets:[{pct:65,reps:10},{pct:65,reps:10},{pct:65,reps:10}]},
    ]},
    {label:'Толчок (Чт)', exercises:[
      {name:'Жим лёжа',           sets:[{pct:80,reps:6},{pct:80,reps:6},{pct:80,reps:6},{pct:80,reps:6}]},
      {name:'Бабочка',            sets:[{pct:65,reps:12},{pct:65,reps:12},{pct:65,reps:12}]},
      {name:'Отжимания на брусьях',sets:[{pct:null,reps:10},{pct:null,reps:10},{pct:null,reps:10}]},
    ]},
    {label:'Тяга (Пт)', exercises:[
      {name:'Тяга штанги',  sets:[{pct:75,reps:8},{pct:75,reps:8},{pct:75,reps:8}]},
      {name:'Подтягивания', sets:[{pct:null,reps:8},{pct:null,reps:8},{pct:null,reps:8}]},
      {name:'Тяга гантели', sets:[{pct:65,reps:10},{pct:65,reps:10},{pct:65,reps:10}]},
    ]},
    {label:'Ноги (Сб)', exercises:[
      {name:'Присед',     sets:[{pct:80,reps:5},{pct:80,reps:5},{pct:80,reps:5},{pct:80,reps:5}]},
      {name:'Выпады',     sets:[{pct:60,reps:10},{pct:60,reps:10},{pct:60,reps:10}]},
      {name:'Сгибания ног',sets:[{pct:null,reps:12},{pct:null,reps:12},{pct:null,reps:12}]},
    ]},
  ];
  const pplWeeks = Array.from({length:8},(_,i) => ({
    label:'Неделя ' + (i+1),
    days: pplDays.map(d => ({...d, exercises: d.exercises.map(e => ({...e, sets: e.sets.map(s=>({...s}))}))})),
  }));

  return {1:bbbWeeks, 2:txWeeks, 3:shWeeks, 4:pplWeeks};
})();

