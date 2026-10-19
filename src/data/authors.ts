// The people who write the blog, by the id a post names in its `authors` front matter.
// A post written with tools says so in its own closing note; tools are never listed here.

import type { Lang } from '../i18n/site';

export interface Author {
	name: string;
	role: Record<Lang, string>;
	href: string;
}

export const authors = {
	galaxysal: {
		name: 'GalaxySal',
		role: { en: 'founder and maintainer', tr: 'kurucu ve baş bakımcı' },
		href: 'https://github.com/GalaxySal',
	},
} as const satisfies Record<string, Author>;

export type AuthorId = keyof typeof authors;
export const authorIds = Object.keys(authors) as [AuthorId, ...AuthorId[]];
