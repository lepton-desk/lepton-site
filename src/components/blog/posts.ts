import { type CollectionEntry, getCollection } from 'astro:content';
import type { Lang } from '../../i18n/site';

export type Post = CollectionEntry<'blog'>;

/** `en/<slug>` → `<slug>`. */
export const slugOf = (post: Post) => post.id.split('/').slice(1).join('/');
export const langOf = (post: Post): Lang => (post.id.startsWith('tr/') ? 'tr' : 'en');
export const hrefOf = (lang: Lang, slug: string) =>
	lang === 'tr' ? `/tr/blog/${slug}/` : `/blog/${slug}/`;

/** Newest first; posts of the same day by slug, descending. */
export async function postsIn(lang: Lang): Promise<Post[]> {
	const all = await getCollection('blog', (post) => langOf(post) === lang);
	return all.sort(
		(a, b) => b.data.date.valueOf() - a.data.date.valueOf() || slugOf(b).localeCompare(slugOf(a)),
	);
}

/** Whole minutes at 220 words a minute, code included. */
export function minutesOf(post: Post): number {
	const words = (post.body ?? '').split(/\s+/).filter(Boolean).length;
	return Math.max(1, Math.round(words / 220));
}
