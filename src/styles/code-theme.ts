// A Shiki theme in the plate's inks: graphite for code, grease-pencil red for keywords,
// softer greys for strings and comments. Used by the landing page and the docs.
export const plateTheme = {
	name: 'lepton-plate',
	type: 'light' as const,
	colors: {
		'editor.background': '#f2f1eb',
		'editor.foreground': '#1b1d1c',
	},
	tokenColors: [
		{
			scope: ['comment', 'punctuation.definition.comment'],
			settings: { foreground: '#5f6560', fontStyle: 'italic' },
		},
		{
			scope: ['keyword', 'storage', 'storage.type', 'keyword.control'],
			settings: { foreground: '#a52c18' },
		},
		{ scope: ['string', 'string.quoted'], settings: { foreground: '#2f5d4a' } },
		{ scope: ['constant.numeric', 'constant.language'], settings: { foreground: '#7a3a12' } },
		{
			scope: ['entity.name.function', 'support.function'],
			settings: { foreground: '#1b1d1c', fontStyle: 'bold' },
		},
		{
			scope: ['entity.name.type', 'support.type', 'support.type.property-name'],
			settings: { foreground: '#2a3f66' },
		},
		{ scope: ['variable', 'variable.other'], settings: { foreground: '#1b1d1c' } },
		{ scope: ['punctuation', 'meta.brace'], settings: { foreground: '#4a4f4c' } },
	],
};

// The same inks on the film negative, for the landing page's dark theme: pale graphite on a dark
// print, the grease pencil lifted. Every colour is at least 5.5:1 on the print (#141615).
export const plateNegativeTheme = {
	name: 'lepton-plate-negative',
	type: 'dark' as const,
	colors: {
		'editor.background': '#141615',
		'editor.foreground': '#e3e5de',
	},
	tokenColors: [
		{
			scope: ['comment', 'punctuation.definition.comment'],
			settings: { foreground: '#8f958f', fontStyle: 'italic' },
		},
		{
			scope: ['keyword', 'storage', 'storage.type', 'keyword.control'],
			settings: { foreground: '#e8806a' },
		},
		{ scope: ['string', 'string.quoted'], settings: { foreground: '#93c4aa' } },
		{ scope: ['constant.numeric', 'constant.language'], settings: { foreground: '#e2a676' } },
		{
			scope: ['entity.name.function', 'support.function'],
			settings: { foreground: '#e3e5de', fontStyle: 'bold' },
		},
		{
			scope: ['entity.name.type', 'support.type', 'support.type.property-name'],
			settings: { foreground: '#a3b8e2' },
		},
		{ scope: ['variable', 'variable.other'], settings: { foreground: '#e3e5de' } },
		{ scope: ['punctuation', 'meta.brace'], settings: { foreground: '#b0b5ad' } },
	],
};
