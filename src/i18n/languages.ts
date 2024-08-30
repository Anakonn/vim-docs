export const allLanguages = {
	ko: '한국어',
	en: 'English',
	// es: 'Español',
	// hi: 'हिन्दी',
	// 'pt-br': 'Português do Brasil',
	// ar: 'العربية',
	// fr: 'Français',
	// de: 'Deutsch',
	// ja: '日本語',
	// ru: 'Русский',
	// id: 'Bahasa Indonesia',
	// tr: 'Türkçe',
	// it: 'Italiano',
	// vi: 'Tiếng Việt',
	// th: 'ไทย',
	// pl: 'Polski',
	// sv: 'Svenska',
	// nl: 'Nederlands',
	// fa: 'فارسی',
	// 'zh-cn': '简体中文',
	// 'zh-tw': '正體中文',
} as const;

// Build for two languages only to speed up Astro's smoke tests
const twoLanguages = {
	ko: '한국어',
	en: 'English',
};

export default import.meta.env?.PUBLIC_TWO_LANGUAGES ? twoLanguages : allLanguages;

export const rtlLanguages = new Set(['ar', 'fa']);
