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
		{ scope: ['comment', 'punctuation.definition.comment'], settings: { foreground: '#5f6560', fontStyle: 'italic' } },
		{ scope: ['keyword', 'storage', 'storage.type', 'keyword.control'], settings: { foreground: '#a52c18' } },
		{ scope: ['string', 'string.quoted'], settings: { foreground: '#2f5d4a' } },
		{ scope: ['constant.numeric', 'constant.language'], settings: { foreground: '#7a3a12' } },
		{ scope: ['entity.name.function', 'support.function'], settings: { foreground: '#1b1d1c', fontStyle: 'bold' } },
		{ scope: ['entity.name.type', 'support.type', 'support.type.property-name'], settings: { foreground: '#2a3f66' } },
		{ scope: ['variable', 'variable.other'], settings: { foreground: '#1b1d1c' } },
		{ scope: ['punctuation', 'meta.brace'], settings: { foreground: '#4a4f4c' } },
	],
};
