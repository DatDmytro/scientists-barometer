// Числа для тексту сайту. Українська: десяткова кома, нерозривний пробіл перед «%», справжній мінус.
// Англійська: десяткова крапка, «%» без пробілу, той самий мінус.
export type Lang = 'uk' | 'en';

export function formatters(lang: Lang = 'uk') {
  const en = lang === 'en';
  const locale = en ? 'en-GB' : 'uk-UA';
  const cache = new Map<number, Intl.NumberFormat>();
  const nf = (digits: number) => {
    if (!cache.has(digits)) {
      cache.set(digits, new Intl.NumberFormat(locale, { minimumFractionDigits: digits, maximumFractionDigits: digits }));
    }
    return cache.get(digits)!;
  };

  /** 113,3 · −4,7 */
  const num = (x: number, digits = 1) => nf(digits).format(x).replace('-', '−');

  /** +0,351 / −0,196 — для коефіцієнтів і зміщень */
  const signed = (x: number, digits = 1) => (x > 0 ? '+' : '') + num(x, digits);

  /** 63,8 % */
  const pct = (x: number, digits = 1) => `${num(x, digits)}${en ? '' : ' '}%`;

  /** 108,2–118,5 */
  const range = (lo: number, hi: number, digits = 1) => `${num(lo, digits)}–${num(hi, digits)}`;

  /** 113,3 (108,2–118,5) */
  const withCi = (v: number, lo: number, hi: number, digits = 1) => `${num(v, digits)} (${range(lo, hi, digits)})`;

  /** 136 131 */
  const int = (n: number) => n.toLocaleString(locale);

  /** p-значення: «< 0,001» або три знаки */
  const pval = (p: number) => (p < 0.001 ? `< ${num(0.001, 3)}` : num(p, 3));

  return { num, signed, pct, range, withCi, int, pval };
}
