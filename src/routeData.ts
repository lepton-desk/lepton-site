import { defineRouteMiddleware } from '@astrojs/starlight/route-data';

// The share image in the page's language: the landing page's first viewport (docs/plans tools render it).
export const onRequest = defineRouteMiddleware((context) => {
	const { head, locale, sidebar } = context.locals.starlightRoute;
	const tr = locale === 'tr';
	// Starlight does not prefix a sidebar `link`; the Turkish docs lead to the Turkish blog.
	if (tr) for (const entry of sidebar) if (entry.type === 'link' && entry.href === '/blog/') entry.href = '/tr/blog/';
	const image = new URL(tr ? '/og-tr.png' : '/og-en.png', context.site).href;
	head.push(
		{ tag: 'link', attrs: { rel: 'manifest', href: tr ? '/tr/manifest.webmanifest' : '/manifest.webmanifest' } },
		{ tag: 'meta', attrs: { property: 'og:image', content: image } },
		{ tag: 'meta', attrs: { property: 'og:image:width', content: '1200' } },
		{ tag: 'meta', attrs: { property: 'og:image:height', content: '630' } },
		{ tag: 'meta', attrs: { property: 'og:image:alt', content: tr ? 'Lepton: sisteminizdeki web motoruyla masaüstü uygulamaları' : 'Lepton: desktop apps on the web engine your system already has' } },
	);
});
