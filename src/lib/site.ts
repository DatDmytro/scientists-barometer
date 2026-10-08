// Набір даних на Zenodo — одне місце для DOI, назви й рядка цитування.
// Цитувати англійською назвою: під нею набір зареєстровано на Zenodo.
export const DOI = '10.5281/zenodo.23161485';
export const DOI_URL = `https://doi.org/${DOI}`;
// concept DOI завжди веде на найновішу версію запису
export const CONCEPT_DOI = '10.5281/zenodo.23161484';
export const CONCEPT_DOI_URL = `https://doi.org/${CONCEPT_DOI}`;
export const DATASET_VERSION = '1.0';

export const TITLE_EN = 'Scientists Barometer: Aggregated data from a survey of Ukrainian researchers (wave 2026)';
export const TITLE_UA = 'Науковий Барометр: агреговані дані опитування українських науковців (хвиля 2026)';
export const CITATION = `Maslov, D. (2026). ${TITLE_EN} [Data set]. Zenodo. ${DOI_URL}`;

export const LICENSE = { name: 'CC BY 4.0', url: 'https://creativecommons.org/licenses/by/4.0/deed.uk' };

// Подача вибірки (рішення автора 2026-10-07): описуємо зміщення, але висновок про узагальнення
// лишаємо користувачам — таке зміщення типове для подібних опитувань, а оцінки кваліфікованих
// науковців для системи найважливіші.
export const SAMPLE_BIAS = 'зміщена в бік кваліфікованіших і залученіших у науку респондентів — це типово для подібних опитувань';
export const SAMPLE_ARGUMENT = 'Водночас саме оцінки кваліфікованих і досвідчених науковців найважливіші для розуміння стану системи.';

// файли запису (теки dataset/ аналітичного репо)
export const FILES = [
  { name: 'scientists-barometer-2026-uk.xlsx', what: 'усі дані українською: 17 аркушів, перший — «Про набір» — пояснює решту' },
  { name: 'scientists-barometer-2026-en.xlsx', what: 'ті самі дані англійською; коментарі респондентів — мовою оригіналу з перекладом' },
  { name: 'README_UK.md · README_EN.md', what: 'опис набору, як цитувати, ліцензія, етика' },
  { name: 'CODEBOOK_UK.md · CODEBOOK_EN.md', what: 'словник даних: аркуші, стовпці, дослівні формулювання питань, глосарій 24 індексів' },
  { name: 'METHODOLOGY_UK.md · METHODOLOGY_EN.md', what: 'збір і підготовка даних, формула індексу, надійність, валідність, репрезентативність, етика, межі' },
  { name: 'LICENSE.txt', what: 'ліцензія CC BY 4.0' },
];
