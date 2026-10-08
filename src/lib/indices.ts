// Довідник 24 індексів: повні назви, тип вимірювання, напрям «добре/погано», вердикт.
// Значення, ДІ й n — з wave-2026.json; розподіли відповідей — з verification-2026.json.
import wave from '../data/wave-2026.json';
import verification from '../data/verification-2026.json';

/** стан зараз · оцінка змін (ретроспектива на момент опитування) · очікування */
export type Kind = 'state' | 'change' | 'expect';
export const KIND: Record<Kind, { label: string; note: string }> = {
  state: { label: 'Стан зараз', note: 'оцінка поточного стану на момент опитування' },
  change: {
    label: 'Оцінка змін',
    note: 'як змінилося, на думку респондентів; це не виміряна динаміка, а їхня оцінка на момент опитування',
  },
  expect: { label: 'Очікування', note: 'чого респонденти очікують у майбутньому' },
};
/** застереження для підписів під графіками оцінок змін */
export const CHANGE_CAVEAT = 'Це не виміряна динаміка, а оцінка респондентів на момент опитування.';

/** +1 — більше = краще для науки; −1 — більше = гірше; 0 — без оцінки */
type Valence = 1 | 0 | -1;
interface Family { abbr: string; name: string; what: string; valence: Valence; href: string }

// повні назви й «що оцінює» — за глосарієм набору (CODEBOOK, «Глосарій індексів»);
// «динаміку» там замінено на «оцінку змін»: це оцінка респондентів, а не виміряна динаміка
export const FAMILIES: Record<string, Family> = {
  ІНЧ: { abbr: 'ІНЧ', name: 'Індекс наукового часу', what: 'оцінка змін частки часу на дійсну наукову діяльність', valence: 1, href: '/time-structure' },
  ІКННЧ: { abbr: 'ІКННЧ', name: 'Індекс корисного ненаукового часу', what: 'оцінка змін частки часу на корисну ненаукову діяльність', valence: 0, href: '/time-structure' },
  ІБВЧ: { abbr: 'ІБВЧ', name: 'Індекс безглуздих витрат часу', what: 'оцінка змін частки часу на безглузду діяльність', valence: -1, href: '/time-structure' },
  ІНМ: { abbr: 'ІНМ', name: 'Індекс наукових можливостей', what: 'забезпеченість ресурсами: фінансування, обладнання, час', valence: 1, href: '/resources' },
  ІЯНР: { abbr: 'ІЯНР', name: 'Індекс якості наукових результатів', what: 'якість досліджень — власних і чужих', valence: 1, href: '/quality' },
  ІОРН: { abbr: 'ІОРН', name: 'Індекс очікувань розвитку науки', what: 'очікування щодо перспектив наукової системи', valence: 1, href: '/quality' },
};

// короткі слова відповідей для вердикту: «переважають оцінки "зросла"»
interface Scale { up: string; down: string; neutral: string }
const SCALES: Record<string, Scale> = {
  time: { up: 'зросла', down: 'скоротилася', neutral: 'майже не змінилася' },
  provision: { up: 'забезпечені', down: 'незабезпечені', neutral: 'нейтрально' },
  better: { up: 'покращилася', down: 'погіршилася', neutral: 'не змінилася' },
  quality: { up: 'висока', down: 'низька', neutral: 'нормальна' },
  expect: { up: 'стане краще', down: 'стане гірше', neutral: 'нічого не зміниться' },
};

interface Meta { family: string; subject: string; kind: Kind; horizon: 0 | 1 | 5; scale: keyof typeof SCALES }
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

export const horizonLabel = (m: { kind: Kind; horizon: number }) =>
  m.horizon === 0 ? '' : m.kind === 'expect'
    ? (m.horizon === 1 ? 'на рік уперед' : 'на 5 років уперед')
    : (m.horizon === 1 ? 'за рік' : 'за 5 років');

/** good / bad — відрізняється від 100 у бік, кращий чи гірший для науки;
 *  neutral — відрізняється, але без оцінки (ІКННЧ); ns — 95 % ДІ перетинає 100 */
export type Tone = 'good' | 'bad' | 'neutral' | 'ns';

export interface Category { label: string; n: number; pct: number }
export interface Index {
  code: string;
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

function build(raw: (typeof wave.indices)[number]): Index {
  const m = META[raw.code];
  if (!m) throw new Error(`Немає метаданих індексу ${raw.code}`);
  const family = FAMILIES[m.family];
  const scale = SCALES[m.scale];
  const dist = (DIST.get(raw.code) as Category[] | undefined) ?? null;
  const crosses100 = raw.ciLow <= 100 && raw.ciHigh >= 100;
  const tone: Tone = crosses100 ? 'ns' : family.valence === 0 ? 'neutral'
    : (raw.value > 100) === (family.valence > 0) ? 'good' : 'bad';
  const up = dist ? dist[0].pct + dist[1].pct : NaN;
  const down = dist ? dist[3].pct + dist[4].pct : NaN;
  const neutralPct = dist ? dist[2].pct : NaN;
  let verdict: string;
  if (!crosses100) verdict = `переважають оцінки «${raw.value > 100 ? scale.up : scale.down}»`;
  else if (dist && neutralPct >= 50) verdict = `переважно «${scale.neutral}»`;
  else verdict = 'думки розділилися';
  return {
    code: raw.code, family, subject: m.subject, kind: m.kind, horizon: m.horizon,
    horizonText: horizonLabel(m), value: raw.value, ciLow: raw.ciLow, ciHigh: raw.ciHigh, n: raw.n,
    dist, tone, crosses100, up, down, neutralPct, verdict, scale,
  };
}

export const INDICES: Index[] = wave.indices.map(build);
export const byCode = (code: string) => {
  const i = INDICES.find((x) => x.code === code);
  if (!i) throw new Error(`Немає індексу ${code}`);
  return i;
};
export const byKind = (kind: Kind) => INDICES.filter((i) => i.kind === kind);

/** знак напряму: ↑ вище 100, ↓ нижче, ≈ у межах ДІ */
export const arrow = (i: Index) => (i.crosses100 ? '≈' : i.value > 100 ? '↑' : '↓');
