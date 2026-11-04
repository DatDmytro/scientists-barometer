// Набір даних на Zenodo — одне місце для DOI, назви й рядка цитування.
// Цитувати англійською назвою: під нею набір зареєстровано на Zenodo.
export const DOI = '10.5281/zenodo.23161485';
export const DOI_URL = `https://doi.org/${DOI}`;

export const TITLE_EN = 'Scientists Barometer: Aggregated data from a survey of Ukrainian researchers (wave 2026)';
export const CITATION = `Maslov, D. (2026). ${TITLE_EN} [Data set]. Zenodo. ${DOI_URL}`;

export const LICENSE = { name: 'CC BY 4.0', url: 'https://creativecommons.org/licenses/by/4.0/deed.uk' };

// Подача вибірки (рішення автора 2026-10-07): описуємо зміщення, але висновок про узагальнення
// лишаємо користувачам — таке зміщення типове для подібних опитувань, а оцінки кваліфікованих
// науковців для системи найважливіші.
export const SAMPLE_BIAS = 'зміщена в бік кваліфікованіших і залученіших у науку респондентів — це типово для подібних опитувань';
export const SAMPLE_ARGUMENT = 'Водночас саме оцінки кваліфікованих і досвідчених науковців найважливіші для розуміння стану системи.';

