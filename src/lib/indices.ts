// Довідник 24 індексів: повні назви, тип вимірювання, напрям «добре/погано», вердикт.
// Значення, ДІ й n — з wave-2026.json; розподіли відповідей — з verification-2026.json.
import wave from '../data/wave-2026.json';
import verification from '../data/verification-2026.json';
import { localize, tr, type Lang } from '../i18n';

/** стан зараз · оцінка змін (ретроспектива на момент опитування) · очікування */
export type Kind = 'state' | 'change' | 'expect';
const KIND_UK: Record<Kind, { label: string; note: string }> = {
  state: { label: 'Стан зараз', note: 'оцінка поточного стану на момент опитування' },
  change: {
    label: 'Оцінка змін',
    note: 'як змінилося, на думку респондентів; це не виміряна динаміка, а їхня оцінка на момент опитування',
  },
  expect: { label: 'Очікування', note: 'чого респонденти очікують у майбутньому' },
};
/** застереження для підписів під графіками оцінок змін */
const CAVEAT_UK = 'Це не виміряна динаміка, а оцінка респондентів на момент опитування.';

/** +1 — більше = краще для науки; −1 — більше = гірше; 0 — без оцінки */
type Valence = 1 | 0 | -1;
interface Family { abbr: string; name: string; what: string; valence: Valence; href: string }

// повні назви й «що оцінює» — за глосарієм набору (CODEBOOK, «Глосарій індексів»);
// «динаміку» там замінено на «оцінку змін»: це оцінка респондентів, а не виміряна динаміка
const FAMILIES_UK: Record<string, Family> = {
  ІНЧ: { abbr: 'ІНЧ', name: 'Індекс наукового часу', what: 'оцінка змін частки часу на дійсну наукову діяльність', valence: 1, href: '/time-structure' },
  ІКННЧ: { abbr: 'ІКННЧ', name: 'Індекс корисного ненаукового часу', what: 'оцінка змін частки часу на корисну ненаукову діяльність', valence: 0, href: '/time-structure' },
  ІБВЧ: { abbr: 'ІБВЧ', name: 'Індекс безглуздих витрат часу', what: 'оцінка змін частки часу на безглузду діяльність', valence: -1, href: '/time-structure' },
  ІНМ: { abbr: 'ІНМ', name: 'Індекс наукових можливостей', what: 'забезпеченість ресурсами: фінансування, обладнання, час', valence: 1, href: '/resources' },
  ІЯНР: { abbr: 'ІЯНР', name: 'Індекс якості наукових результатів', what: 'якість досліджень — власних і чужих', valence: 1, href: '/quality' },
  ІОРН: { abbr: 'ІОРН', name: 'Індекс очікувань розвитку науки', what: 'очікування щодо перспектив наукової системи', valence: 1, href: '/quality' },
};

// короткі слова відповідей для вердикту: «переважають оцінки "зросла"»
interface Scale { up: string; down: string; neutral: string }
const SCALES_UK: Record<string, Scale> = {
  time: { up: 'зросла', down: 'скоротилася', neutral: 'майже не змінилася' },
  provision: { up: 'забезпечені', down: 'незабезпечені', neutral: 'нейтрально' },
  better: { up: 'покращилася', down: 'погіршилася', neutral: 'не змінилася' },
  quality: { up: 'висока', down: 'низька', neutral: 'нормальна' },
  expect: { up: 'стане краще', down: 'стане гірше', neutral: 'нічого не зміниться' },
};

interface Meta { family: string; subject: string; kind: Kind; horizon: 0 | 1 | 5; scale: keyof typeof SCALES_UK }
const META: Record<string, Meta> = {
  'ІНЧ 1': { family: 'ІНЧ', subject: 'Час на дійсну наукову діяльність', kind: 'change', horizon: 1, scale: 'time' },
  'ІНЧ 5': { family: 'ІНЧ', subject: 'Час на дійсну наукову діяльність', kind: 'change', horizon: 5, scale: 'time' },
  'ІКННЧ 1': { family: 'ІКННЧ', subject: 'Час на корисну ненаукову діяльність', kind: 'change', horizon: 1, scale: 'time' },
  'ІКННЧ 5': { family: 'ІКННЧ', subject: 'Час на корисну ненаукову діяльність', kind: 'change', horizon: 5, scale: 'time' },
  'ІБВЧ 1': { family: 'ІБВЧ', subject: 'Час на безглузду діяльність', kind: 'change', horizon: 1, scale: 'time' },
  'ІБВЧ 5': { family: 'ІБВЧ', subject: 'Час на безглузду діяльність', kind: 'change', horizon: 5, scale: 'time' },
  'ІНМ ф': { family: 'ІНМ', subject: 'Забезпеченість фінансуванням', kind: 'state', horizon: 0, scale: 'provision' },
  'ІНМ о': { family: 'ІНМ', subject: 'Забезпеченість обладнанням', kind: 'state', horizon: 0, scale: 'provision' },
  'ІНМ ч': { family: 'ІНМ', subject: 'Забезпеченість часом', kind: 'state', horizon: 0, scale: 'provision' },
  ІНМ: { family: 'ІНМ', subject: 'Наукові можливості (зведений індекс)', kind: 'state', horizon: 0, scale: 'provision' },
  'ІНМ ф1': { family: 'ІНМ', subject: 'Забезпеченість фінансуванням', kind: 'change', horizon: 1, scale: 'better' },
  'ІНМ ф5': { family: 'ІНМ', subject: 'Забезпеченість фінансуванням', kind: 'change', horizon: 5, scale: 'better' },
  'ІНМ о1': { family: 'ІНМ', subject: 'Забезпеченість обладнанням', kind: 'change', horizon: 1, scale: 'better' },
  'ІНМ о5': { family: 'ІНМ', subject: 'Забезпеченість обладнанням', kind: 'change', horizon: 5, scale: 'better' },
  'ІНМ ч1': { family: 'ІНМ', subject: 'Забезпеченість часом', kind: 'change', horizon: 1, scale: 'better' },
  'ІНМ ч5': { family: 'ІНМ', subject: 'Забезпеченість часом', kind: 'change', horizon: 5, scale: 'better' },
  'ІЯНР в': { family: 'ІЯНР', subject: 'Якість власних досліджень', kind: 'state', horizon: 0, scale: 'quality' },
  'ІЯНР ч': { family: 'ІЯНР', subject: 'Якість досліджень інших', kind: 'state', horizon: 0, scale: 'quality' },
  'ІЯНР в1': { family: 'ІЯНР', subject: 'Якість власних досліджень', kind: 'change', horizon: 1, scale: 'better' },
  'ІЯНР в5': { family: 'ІЯНР', subject: 'Якість власних досліджень', kind: 'change', horizon: 5, scale: 'better' },
  'ІЯНР ч1': { family: 'ІЯНР', subject: 'Якість досліджень інших', kind: 'change', horizon: 1, scale: 'better' },
  'ІЯНР ч5': { family: 'ІЯНР', subject: 'Якість досліджень інших', kind: 'change', horizon: 5, scale: 'better' },
  'ІОРН 1': { family: 'ІОРН', subject: 'Розвиток науки', kind: 'expect', horizon: 1, scale: 'expect' },
  'ІОРН 5': { family: 'ІОРН', subject: 'Розвиток науки', kind: 'expect', horizon: 5, scale: 'expect' },
};

const horizonLabel = (m: { kind: Kind; horizon: number }, lang: Lang) => {
  if (m.horizon === 0) return '';
  if (lang === 'en') return m.kind === 'expect'
    ? (m.horizon === 1 ? 'one year ahead' : '5 years ahead')
    : (m.horizon === 1 ? 'over 1 year' : 'over 5 years');
  return m.kind === 'expect'
    ? (m.horizon === 1 ? 'на рік уперед' : 'на 5 років уперед')
    : (m.horizon === 1 ? 'за рік' : 'за 5 років');
};

// англійські назви й коди — за глосарієм набору (CODEBOOK_EN, translations_en.json)
const KIND_EN: Record<Kind, { label: string; note: string }> = {
  state: { label: 'Current state', note: 'assessment of the current state at the time of the survey' },
  change: {
    label: 'Assessed change',
    note: 'how things have changed in respondents’ view; this is not measured change but their assessment at the time of the survey',
  },
  expect: { label: 'Expectations', note: 'what respondents expect in the future' },
};
const CAVEAT_EN = 'This is not measured change but respondents’ assessment at the time of the survey.';
const FAMILY_EN: Record<string, { abbr: string; name: string; what: string }> = {
  ІНЧ: { abbr: 'STI', name: 'Scientific Time Index', what: 'assessed change in the share of time spent on actual scientific activity' },
  ІКННЧ: { abbr: 'UNSTI', name: 'Useful Non-Scientific Time Index', what: 'assessed change in the share of time spent on useful non-scientific activity' },
  ІБВЧ: { abbr: 'MAI', name: 'Meaningless Activity Index', what: 'assessed change in the share of time spent on meaningless activity' },
  ІНМ: { abbr: 'RCI', name: 'Research Capacity Index', what: 'adequacy of resources: funding, equipment, time' },
  ІЯНР: { abbr: 'RQI', name: 'Research Quality Index', what: 'quality of research: one’s own and other people’s' },
  ІОРН: { abbr: 'SEI', name: 'Science Expectations Index', what: 'expectations about the prospects of the research system' },
};
const SCALES_EN: Record<string, Scale> = {
  time: { up: 'increased', down: 'decreased', neutral: 'almost unchanged' },
  provision: { up: 'adequate', down: 'inadequate', neutral: 'neutral' },
  better: { up: 'improved', down: 'deteriorated', neutral: 'unchanged' },
  quality: { up: 'high', down: 'low', neutral: 'adequate' },
  expect: { up: 'will improve', down: 'will worsen', neutral: 'nothing will change' },
};
const SUBJECT_EN: Record<string, string> = {
  'Час на дійсну наукову діяльність': 'Time on actual scientific activity',
  'Час на корисну ненаукову діяльність': 'Time on useful non-scientific activity',
  'Час на безглузду діяльність': 'Time on meaningless activity',
  'Забезпеченість фінансуванням': 'Adequacy of funding',
  'Забезпеченість обладнанням': 'Adequacy of equipment',
  'Забезпеченість часом': 'Adequacy of time',
  'Наукові можливості (зведений індекс)': 'Research capacity (composite index)',
  'Якість власних досліджень': 'Quality of own research',
  'Якість досліджень інших': 'Quality of others’ research',
  'Розвиток науки': 'Development of science',
};
const CODE_EN: Record<string, string> = {
  'ІНЧ 1': 'STI-1y', 'ІНЧ 5': 'STI-5y', 'ІКННЧ 1': 'UNSTI-1y', 'ІКННЧ 5': 'UNSTI-5y', 'ІБВЧ 1': 'MAI-1y', 'ІБВЧ 5': 'MAI-5y',
  'ІНМ ф': 'RCI-fund', 'ІНМ о': 'RCI-infra', 'ІНМ ч': 'RCI-time', ІНМ: 'RCI',
  'ІНМ ф1': 'RCI-fund-1y', 'ІНМ ф5': 'RCI-fund-5y', 'ІНМ о1': 'RCI-infra-1y', 'ІНМ о5': 'RCI-infra-5y', 'ІНМ ч1': 'RCI-time-1y', 'ІНМ ч5': 'RCI-time-5y',
  'ІЯНР в': 'RQI-own', 'ІЯНР ч': 'RQI-others', 'ІЯНР в1': 'RQI-own-1y', 'ІЯНР в5': 'RQI-own-5y', 'ІЯНР ч1': 'RQI-others-1y', 'ІЯНР ч5': 'RQI-others-5y',
  'ІОРН 1': 'SEI-1y', 'ІОРН 5': 'SEI-5y',
};

/** good / bad — відрізняється від 100 у бік, кращий чи гірший для науки;
 *  neutral — відрізняється, але без оцінки (ІКННЧ); ns — 95 % ДІ перетинає 100 */
export type Tone = 'good' | 'bad' | 'neutral' | 'ns';

export interface Category { label: string; n: number; pct: number }
export interface Index {
  key: string; // код із даних (українською) — для пошуку
  code: string; // код для показу мовою сторінки
  family: Family;
  subject: string;
  kind: Kind;
  horizon: 0 | 1 | 5;
  horizonText: string;
  value: number;
  ciLow: number;
  ciHigh: number;
  n: number;
  dist: Category[] | null; // 5 категорій від найпозитивнішої; null для композита ІНМ
  tone: Tone;
  crosses100: boolean;
  up: number; // % двох позитивних категорій
  down: number; // % двох негативних
  neutralPct: number;
  verdict: string;
  scale: Scale;
}

const DIST = new Map(verification.indexDistributions.map((d) => [d.code, d.categories]));

function api(lang: Lang) {
  const en = lang === 'en';
  const scales = en ? SCALES_EN : SCALES_UK;
  const family = (k: string): Family => {
    const f = { ...FAMILIES_UK[k], href: localize(FAMILIES_UK[k].href, lang) };
    return en ? { ...f, ...FAMILY_EN[k] } : f;
  };

  function build(raw: (typeof wave.indices)[number]): Index {
    const m = META[raw.code];
    if (!m) throw new Error(`Немає метаданих індексу ${raw.code}`);
    const fam = family(m.family);
    const scale = scales[m.scale];
    const src = (DIST.get(raw.code) as Category[] | undefined) ?? null;
    const dist = src && src.map((c) => ({ ...c, label: tr(c.label, lang) }));
    const crosses100 = raw.ciLow <= 100 && raw.ciHigh >= 100;
    const tone: Tone = crosses100 ? 'ns' : fam.valence === 0 ? 'neutral'
      : (raw.value > 100) === (fam.valence > 0) ? 'good' : 'bad';
    const up = dist ? dist[0].pct + dist[1].pct : NaN;
    const down = dist ? dist[3].pct + dist[4].pct : NaN;
    const neutralPct = dist ? dist[2].pct : NaN;
    const word = raw.value > 100 ? scale.up : scale.down;
    let verdict: string;
    if (!crosses100) verdict = en ? `“${word}” assessments prevail` : `переважають оцінки «${word}»`;
    else if (dist && neutralPct >= 50) verdict = en ? `mostly “${scale.neutral}”` : `переважно «${scale.neutral}»`;
    else verdict = en ? 'opinions are divided' : 'думки розділилися';
    return {
      key: raw.code, code: en ? CODE_EN[raw.code] : raw.code, family: fam,
      subject: en ? SUBJECT_EN[m.subject] : m.subject, kind: m.kind, horizon: m.horizon,
      horizonText: horizonLabel(m, lang), value: raw.value, ciLow: raw.ciLow, ciHigh: raw.ciHigh, n: raw.n,
      dist, tone, crosses100, up, down, neutralPct, verdict, scale,
    };
  }

  const INDICES: Index[] = wave.indices.map(build);
  const byCode = (code: string) => {
    const i = INDICES.find((x) => x.key === code);
    if (!i) throw new Error(`Немає індексу ${code}`);
    return i;
  };
  const byKind = (kind: Kind) => INDICES.filter((i) => i.kind === kind);
  return { INDICES, byCode, byKind, KIND: en ? KIND_EN : KIND_UK, CHANGE_CAVEAT: en ? CAVEAT_EN : CAVEAT_UK };
}

const API = { uk: api('uk'), en: api('en') };
/** довідник індексів мовою сторінки */
export const indexApi = (lang: Lang) => API[lang];

/** знак напряму: ↑ вище 100, ↓ нижче, ≈ у межах ДІ */
export const arrow = (i: Index) => (i.crosses100 ? '≈' : i.value > 100 ? '↑' : '↓');
