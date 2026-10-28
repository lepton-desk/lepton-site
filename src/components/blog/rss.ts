// RSS 2.0 for one language, written by hand: one feed is a few lines of XML, not a dependency.
import type { APIContext } from 'astro';
import { authors } from '../../data/authors';
import { type Lang, site } from '../../i18n/site';
import { hrefOf, postsIn, slugOf } from './posts';

const escapeXml = (text: string) =>
	text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export async function feed(lang: Lang, context: APIContext): Promise<Response> {
	const origin = context.site ?? new URL('https://lepton-desk.vercel.app');
	const t = site[lang];
	const items = (await postsIn(lang))
		.map((post) => {
			const link = new URL(hrefOf(lang, slugOf(post)), origin).href;
			return `<item><title>${escapeXml(post.data.title)}</title><link>${link}</link><guid>${link}</guid><pubDate>${post.data.date.toUTCString()}</pubDate><description>${escapeXml(post.data.description)}</description>${post.data.authors.map((id) => `<dc:creator>${escapeXml(authors[id].name)}</dc:creator>`).join('')}</item>`;
		})
		.join('');
	const self = new URL(lang === 'tr' ? '/tr/blog/rss.xml' : '/blog/rss.xml', origin).href;
	const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/"><channel><title>Lepton — ${escapeXml(t.blogTitle)}</title><link>${new URL(t.blogHref, origin).href}</link><atom:link href="${self}" rel="self" type="application/rss+xml"/><description>${escapeXml(t.blogDescription)}</description><language>${lang}</language>${items}</channel></rss>`;
	return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
