// Keeps the offline pages out of the sitemap (nothing to search for there), and writes dist/offline-docs.json for the service worker (public/sw.js): every docs page per
// language, every font those pages reference, every build file (136 KB in all, measured; the docs'
// scripts also import modules no page names) and the manifests and icons, so the docs read offline.
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

async function htmlFiles(dir) {
	const out = [];
	for (const entry of await readdir(dir, { withFileTypes: true })) {
		const full = path.join(dir, entry.name);
		if (entry.isDirectory()) out.push(...(await htmlFiles(full)));
		else if (entry.name === 'index.html') out.push(full);
	}
	return out;
}

export default function offlineDocs() {
	return {
		name: 'offline-docs',
		hooks: {
			'astro:build:done': async ({ dir, logger }) => {
				const root = fileURLToPath(dir);
				const pages = { en: [], tr: [] };
				const files = new Set();
				for (const lang of ['en', 'tr']) {
					const base = path.join(root, lang === 'tr' ? 'tr/docs' : 'docs');
					for (const file of await htmlFiles(base)) {
						pages[lang].push(`/${path.relative(root, path.dirname(file)).split(path.sep).join('/')}/`);
						const html = await readFile(file, 'utf8');
						for (const [, ref] of html.matchAll(/(?:href|src)="(\/(?:_astro|fonts)\/[^"#?]+)"/g)) files.add(ref);
					}
					pages[lang].sort();
				}
				for (const name of await readdir(path.join(root, '_astro'))) files.add(`/_astro/${name}`);
				for (const extra of ['/manifest.webmanifest', '/tr/manifest.webmanifest', '/icons/icon-192.png', '/icons/icon-512.png', '/icons/maskable-512.png']) files.add(extra);
				const list = { pages, files: [...files].sort() };
				await writeFile(path.join(root, 'offline-docs.json'), JSON.stringify(list));
				for (const name of await readdir(root)) {
					if (!/^sitemap-\d+\.xml$/.test(name)) continue;
					const file = path.join(root, name);
					const xml = await readFile(file, 'utf8');
					await writeFile(file, xml.replace(/<url><loc>[^<]*\/offline\/<\/loc>.*?<\/url>/g, ''));
				}
				logger.info(`${pages.en.length} + ${pages.tr.length} docs pages, ${list.files.length} files`);
			},
		},
	};
}
