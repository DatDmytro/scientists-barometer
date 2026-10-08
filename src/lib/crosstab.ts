// Спільне для теплокарт розрізів: 95 % ДІ клітинок (crosstab-ci-2026.json), мала база, підказки.
import { range, int } from './format';

export type CI = [number, number];
/** база клітинки, нижче якої вона штрихується: ДІ тут зазвичай ширші за 40 пунктів */
export const SMALL_N = 20;

/** нульова ширина: у малій групі всі відповіді однакові, розкид 0 — формула дає фіктивну «певність»,
 *  тож такий ДІ не показуємо (для часток Вілсон нульової ширини не дає — це лише індекси й середні) */
export const degenerate = (ci: CI | undefined) => !!ci && ci[1] - ci[0] < 0.05;

/** «52 % (95 % ДІ 38–66), n = 24» */
export const tip = (value: string, ci: CI | undefined, n: number | undefined, digits = 0) =>
  degenerate(ci)
    ? `${value}, n = ${int(n ?? 0)}: усі відповіді однакові — 95 % ДІ не оцінюється`
    : `${value}${ci ? ` (95 % ДІ ${range(ci[0], ci[1], digits)})` : ''}${n !== undefined ? `, n = ${int(n)}` : ''}`;

export const ciText = (ci: CI | undefined, digits = 0) => (!ci ? '' : degenerate(ci) ? '—' : range(ci[0], ci[1], digits));

/** медіанна ширина ДІ у кубі — окремо для малих (n < 20) і більших баз */
export function typicalWidths(cube: unknown): { small: number; large: number } {
  const small: number[] = [];
  const large: number[] = [];
  const walk = (o: unknown): void => {
    if (!o || typeof o !== 'object') return;
    const r = o as Record<string, unknown>;
    if (typeof r.n === 'number') {
      for (const [k, v] of Object.entries(r)) {
        if (k !== 'n' && Array.isArray(v) && v.length === 2) (r.n < SMALL_N ? small : large).push(v[1] - v[0]);
      }
      return;
    }
    Object.values(r).forEach(walk);
  };
  walk(cube);
  const med = (a: number[]) => {
    if (!a.length) return NaN;
    const s = [...a].sort((x, y) => x - y);
    return s[Math.floor(s.length / 2)];
  };
  return { small: med(small), large: med(large) };
}
