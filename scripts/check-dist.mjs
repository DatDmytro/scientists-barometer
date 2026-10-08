// Запобіжник після збірки: падає, якщо в dist/ потрапило те, чого на сайті бути не може.
//  1. Згадки внутрішнього звіту і поля звіряння з ним (сайт посилається лише на набір на Zenodo).
//  2. Інлайн-скрипти: CSP дозволяє лише script-src 'self', тож інлайн-скрипт тихо не виконається.
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

if (problems.length) {
  console.error(`check-dist: ${problems.length} проблем(и):\n  ` + problems.join('\n  '));
  process.exit(1);
}
console.log(`check-dist: OK — ${files.length} файлів, згадок звіту й інлайн-скриптів немає.`);
