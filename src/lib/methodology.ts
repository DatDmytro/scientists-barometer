// Розрахунки сторінки «Методологія», спільні для обох мовних версій: тексти різні, числа ті самі.
import wave from '../data/wave-2026.json';
import verification from '../data/verification-2026.json';
import ciData from '../data/crosstab-ci-2026.json';

export const rep = wave.representativeness;
export const compByCrit = (c: string) => rep.comparison.filter((r) => r.criterion === c);
export const biasCls = (b: number) => (b >= 0 ? 'bias-pos' : 'bias-neg');

// типова ширина ДІ у крос-табах (медіана, в пунктах) — для малих і більших груп
function widths() {
  const small: number[] = [], large: number[] = [];
  const walk = (o: unknown): void => {
    if (!o || typeof o !== 'object') return;
    const r = o as Record<string, unknown>;
    if (typeof r.n === 'number') {
      for (const [k, val] of Object.entries(r)) {
        if (k !== 'n' && Array.isArray(val) && val.length === 2 && typeof val[0] === 'number') {
          (r.n < 20 ? small : large).push((val[1] as number) - (val[0] as number));
        }
      }
      return;
    }
    Object.values(r).forEach(walk);
  };
  for (const key of ['motivation', 'categorization', 'resources', 'sufficiency', 'additional'] as const) walk(ciData[key]);
  const med = (a: number[]) => { const s = [...a].sort((x, y) => x - y); return s[Math.floor(s.length / 2)]; };
  return { small: med(small), large: med(large) };
}
export const W = widths();

export const sums = verification.shareSumCheck.distribution;
export const sumMax = Math.max(...sums.map((d) => d.n));
export const nearSum = sums.filter((d) => d.sum >= 85 && d.sum <= 115).reduce((a, d) => a + d.n, 0);
export const assessCls = (a: string) => (a === 'Обмеження' ? 'lim' : a === 'Помітна' ? 'mid' : 'ok');
