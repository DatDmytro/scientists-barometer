// Запобіжник після збірки: падає, якщо в dist/ потрапило те, чого на сайті бути не може.
//  1. Згадки внутрішнього звіту і поля звіряння з ним (сайт посилається лише на набір на Zenodo).
//  2. Інлайн-скрипти: CSP дозволяє лише script-src 'self', тож інлайн-скрипт тихо не виконається.
//  3. Англійські сторінки (/en/): українські слова й десяткова кома в тексті.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const DIST = new URL('../dist/', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
// межі слів: у дослівних коментарях і назвах видів діяльності є «звітів», «звітування»
const REPORT = /reportValue|matchesReport|reportPct|reportChi2|(Report|Звіт)\s*20\d\d|(?<![\p{L}])(зі звіту|у звіті|звіт:)(?![\p{L}])/u;
const INLINE_SCRIPT = /<script(?![^>]*\bsrc=)(?![^>]*type="application\/(ld\+)?json")[^>]*>/i;

const files = [];
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(html|json|js|txt|xml)$/.test(name)) files.push(p);
  }
};
walk(DIST);

const problems = [];
for (const f of files) {
  const text = readFileSync(f, 'utf8');
  const m = text.match(REPORT);
  if (m) problems.push(`${relative(DIST, f)}: згадка звіту «${m[0]}» → …${text.slice(Math.max(0, m.index - 40), m.index + 40).replace(/\s+/g, ' ')}…`);
  if (f.endsWith('.html') && INLINE_SCRIPT.test(text)) problems.push(`${relative(DIST, f)}: інлайн-<script> (CSP його заблокує)`);
}

// кирилиця в /en/: дозволені лише перемикач мови й українська назва у футері
const CYRILLIC = /[А-ЩЬЮЯҐЄІЇа-щьюяґєії]/;
const DECIMAL_COMMA = /(?<![\d,])\d{1,3},\d{1,2}(?![\d,])|\b0,\d{3}\b/;
for (const f of files.filter((p) => /[\\/]en[\\/].*\.html$/.test(p))) {
  const html = readFileSync(f, 'utf8')
    .replace(/<(script|style)\b[\s\S]*?<\/\1>/g, ' ')
    .replace(/<a [^>]*hreflang="uk"[^>]*>УКР<\/a>/g, ' ')
    .replace(/Scientists Barometer \/ Науковий Барометр/g, ' ');
  const attrs = [...html.matchAll(/\b(?:title|aria-label|alt|content)="([^"]*)"/g)].map((m) => m[1]).join(' ');
  const text = html.replace(/<[^>]+>/g, ' ') + ' ' + attrs;
  const c = text.match(CYRILLIC);
  if (c) problems.push(`${relative(DIST, f)}: кирилиця → …${text.slice(Math.max(0, c.index - 40), c.index + 40).replace(/\s+/g, ' ')}…`);
  const d = text.match(DECIMAL_COMMA);
  if (d) problems.push(`${relative(DIST, f)}: десяткова кома «${d[0]}» → …${text.slice(Math.max(0, d.index - 40), d.index + 40).replace(/\s+/g, ' ')}…`);
}

if (problems.length) {
  console.error(`check-dist: ${problems.length} проблем(и):\n  ` + problems.join('\n  '));
  process.exit(1);
}
console.log(`check-dist: OK — ${files.length} файлів, згадок звіту й інлайн-скриптів немає.`);
