// Числа для українського тексту: десяткова кома, нерозривний пробіл перед «%», справжній мінус.
const cache = new Map<number, Intl.NumberFormat>();
const nf = (digits: number) => {
  if (!cache.has(digits)) {
    cache.set(digits, new Intl.NumberFormat('uk-UA', { minimumFractionDigits: digits, maximumFractionDigits: digits }));
  }
  return cache.get(digits)!;
};

/** 113,3 · −4,7 */
export const num = (x: number, digits = 1) => nf(digits).format(x).replace('-', '−');

/** +0,351 / −0,196 — для коефіцієнтів і зміщень */
export const signed = (x: number, digits = 1) => (x > 0 ? '+' : '') + num(x, digits);

/** 63,8 % */
export const pct = (x: number, digits = 1) => `${num(x, digits)} %`;

/** 108,2–118,5 */
export const range = (lo: number, hi: number, digits = 1) => `${num(lo, digits)}–${num(hi, digits)}`;

/** 113,3 (108,2–118,5) */
export const withCi = (v: number, lo: number, hi: number, digits = 1) => `${num(v, digits)} (${range(lo, hi, digits)})`;

/** 136 131 */
export const int = (n: number) => n.toLocaleString('uk-UA');

/** p-значення: «< 0,001» або три знаки */
export const pval = (p: number) => (p < 0.001 ? '< 0,001' : num(p, 3));
