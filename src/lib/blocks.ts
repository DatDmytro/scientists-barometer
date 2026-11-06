// Шість блоків анкети — порядок, назви й підводки сторінок.
// Підводка: дослівне питання там, де блок побудований на одному питанні (Мотивація)
// або має спільну основу (Категоризація); для решти — тема блоку, без лапок,
// бо єдиного формулювання в анкеті немає (той самий принцип, що й у наборі на Zenodo).
import { localize, tr, type Lang } from '../i18n';

export interface Block {
  slug: string;
  href: string;
  title: string;
  lead?: { kind: 'question' | 'topic'; text: string };
  teaser: string;
}

export const BLOCKS: Block[] = [
  {
    slug: 'motivation', href: '/motivation', title: 'Мотивація',
    lead: { kind: 'question', text: 'Як ви бачите головну мету своєї роботи?' },
    teaser: 'Навіщо науковці займаються наукою: дев’ять варіантів мети, дописані відповіді й розрізи за групами.',
  },
  {
    slug: 'categorization', href: '/categorization', title: 'Категоризація діяльності',
    lead: { kind: 'question', text: 'Категоризуйте представлені нижче види діяльності за категоріями' },
    teaser: '54 види діяльності: що науковці вважають наукою, корисною ненауковою і безглуздою роботою.',
  },
  {
    slug: 'time-structure', href: '/time-structure', title: 'Структура робочого часу',
    lead: { kind: 'topic', text: 'розподіл робочого часу між дійсною науковою, корисною ненауковою та безглуздою діяльністю' },
    teaser: 'Яку частку тижня забирає кожен вид діяльності, скільки годин працюють насправді і як це змінилося.',
  },
  {
    slug: 'resources', href: '/resources', title: 'Забезпеченість ресурсами',
    lead: { kind: 'topic', text: 'забезпеченість ресурсами для наукової роботи та достатність часу' },
    teaser: 'Фінансування, обладнання й час: поточна забезпеченість, оцінка змін, достатність часу на сон і роздуми.',
  },
  {
    slug: 'quality', href: '/quality', title: 'Якість і очікування',
    lead: { kind: 'topic', text: 'оцінка якості досліджень і очікування щодо розвитку науки' },
    teaser: 'Як науковці оцінюють якість власних і чужих досліджень та чого чекають від розвитку науки.',
  },
  {
    slug: 'additional', href: '/additional', title: 'Додаткові питання',
    teaser: 'Глухий кут у дослідженні, вплив навантаження на якість, публікації без примусу, уважне читання.',
  },
];

// англійські назви — як у наборі на Zenodo; питання й теми — з його перекладів
const EN: Record<string, { title: string; teaser: string }> = {
  motivation: { title: 'Motivation', teaser: 'Why researchers do research: nine possible purposes, write-in answers and breakdowns by group.' },
  categorization: { title: 'Categorisation of activities', teaser: '54 activities: what researchers count as research, useful non-scientific work and meaningless work.' },
  'time-structure': { title: 'Working time structure', teaser: 'What share of the week each kind of activity takes, how many hours people really work and how this has changed.' },
  resources: { title: 'Adequacy of resources', teaser: 'Funding, equipment and time: current adequacy, assessed change, and whether there is enough time for sleep and thinking.' },
  quality: { title: 'Quality and expectations', teaser: 'How researchers assess the quality of their own and others’ research, and what they expect for the development of science.' },
  additional: { title: 'Additional questions', teaser: 'Research dead ends, the effect of workload on quality, publishing without compulsion, attentive reading.' },
};

/** блоки мовою сторінки: назви, підводки й адреси */
export const blocksFor = (lang: Lang): Block[] =>
  lang === 'uk' ? BLOCKS : BLOCKS.map((b) => ({
    ...b,
    ...EN[b.slug],
    href: localize(b.href, lang),
    lead: b.lead && { ...b.lead, text: tr(b.lead.text, lang) },
  }));

export const blockBySlug = (slug: string, lang: Lang = 'uk') => {
  const b = blocksFor(lang).find((x) => x.slug === slug);
  if (!b) throw new Error(`Невідомий блок: ${slug}`);
  return b;
};
