export const allLanguages = {
	en: 'English',
	ko: '한국어',
	es: 'Español',
	hi: 'हिन्दी',
	'pt-br': 'Português do Brasil',
	ar: 'العربية',
	fr: 'Français',
	de: 'Deutsch',
	ja: '日本語',
	ru: 'Русский',
	id: 'Bahasa Indonesia',
	tr: 'Türkçe',
	it: 'Italiano',
	vi: 'Tiếng Việt',
	th: 'ไทย',
	pl: 'Polski',
	sv: 'Svenska',
	nl: 'Nederlands',
	fa: 'فارسی',
} as const;

// Build for two languages only to speed up Astro's smoke tests
const twoLanguages = {
	en: 'English',
	ko: '한국어',
};

export default import.meta.env?.PUBLIC_TWO_LANGUAGES ? twoLanguages : allLanguages;

export const rtlLanguages = new Set(['ar', 'fa']);
