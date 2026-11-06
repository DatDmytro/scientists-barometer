// Дві мовні версії сайту: українська (без префікса) і англійська (/en/).
//  • Тексти сторінок записано поруч обома мовами: {en ? 'English' : 'Українська'}.
//  • Рядки з даних (питання, варіанти, групи, коментарі) перекладає tr() за перекладами набору на
//    Zenodo: src/data/translations-en.json (пише sync_site_data.py) плюс data-en.ts — рядки лише сайту.
//    Рядка без перекладу англійська збірка не пропустить: tr() зупинить її з назвою цього рядка.
import dataset from '../data/translations-en.json';
import { DATA_EN } from './data-en';
import { crosstabText } from '../lib/crosstab';
import { formatters, type Lang } from '../lib/format';

export type { Lang };

const norm = (s: string) => s.replace(/\s+/g, ' ').trim();
const DICT = new Map<string, string>(
  Object.entries({ ...dataset, ...DATA_EN }).map(([k, v]) => [norm(k), v as string]),
);

export function tr(s: string, lang: Lang): string {
  if (lang === 'uk') return s;
  const found = DICT.get(norm(s));
  if (found === undefined) throw new Error(`Немає англійського перекладу рядка: «${s}»`);
  return found;
}

/** внутрішнє посилання мовою сторінки: /about → /en/about, / → /en/ */
export const localize = (href: string, lang: Lang) => (lang === 'en' && href.startsWith('/') ? `/en${href}` : href);

/** усе мовозалежне для сторінки чи компонента */
export function i18n(Astro: { currentLocale?: string }) {
  const lang: Lang = Astro.currentLocale === 'en' ? 'en' : 'uk';
  return {
    lang,
    en: lang === 'en',
    tr: (s: string) => tr(s, lang),
    link: (href: string) => localize(href, lang),
    ...formatters(lang),
    ...crosstabText(lang),
  };
}
