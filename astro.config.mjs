// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import tailwindcss from '@tailwindcss/vite';
import { plateTheme } from './src/styles/code-theme.ts';
import offlineDocs from './integrations/offline-docs.mjs';

// The landing page lives in src/pages (`/`, `/tr/`); the docs are Starlight, under `/docs/`
// and `/tr/docs/`.
export default defineConfig({
	site: 'https://lepton-desk.vercel.app',
	// Inlined, the CSS no longer stands between the HTML and the fonts it names (measured).
	build: { inlineStylesheets: 'always' },
	// No module script file on the landing page: a deferred module delays DOMContentLoaded, and
	// Chrome's first style pass waited for it (measured under load: first commit 237 → 175 ms
	// median). So prefetch is off (Starlight turns it on for every page) and the plate's script
	// is small enough to be inlined.
	prefetch: false,
	integrations: [
		starlight({
			title: 'Lepton',
			description: 'Desktop apps on the web engine your system already has.',
			logo: { src: './src/assets/logo.svg', alt: 'Lepton' },
			favicon: '/favicon.svg',
			defaultLocale: 'root',
			locales: {
				root: { label: 'English', lang: 'en' },
				tr: { label: 'Türkçe', lang: 'tr' },
			},
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/lepton-desk/lepton' }],
			customCss: ['./src/styles/starlight.css'],
			routeMiddleware: './src/routeData.ts',
			// Code styles in the page, not ec.*.css: that stylesheet sits in the body and blocks the parser,
			// so the rest of the page waited for it and the first frame came ~540 ms in. Under Lighthouse's
			// resize that was late enough for Chrome to hold the page's frames for a second, in 5 of 10
			// live runs of a post with code (none on pages without code). Markdown is rendered again on
			// every build (`astro build --force` in package.json): the content store under node_modules/.astro
			// survives between Vercel builds and had kept code blocks rendered with the old option.
			expressiveCode: { themes: [plateTheme], emitExternalStylesheet: false },
			head: [
				{ tag: 'link', attrs: { rel: 'apple-touch-icon', href: '/icons/apple-touch-icon.png' } },
				// Registered after load, so it never competes with the first paint; a docs page then
				// asks it to keep the whole docs in its language for offline reading.
				{
					tag: 'script',
					content:
						"if('serviceWorker' in navigator)addEventListener('load',()=>{navigator.serviceWorker.register('/sw.js');navigator.serviceWorker.ready.then(r=>r.active&&r.active.postMessage({type:'cache-docs',lang:document.documentElement.lang==='tr'?'tr':'en'}))})",
				},
				{ tag: 'link', attrs: { rel: 'preload', href: '/fonts/archivo-latin.woff2', as: 'font', type: 'font/woff2', crossorigin: '' } },
				// Code is on every docs page; unpreloaded, JetBrains Mono was requested 100–150 ms
				// after Archivo and arrived after the first paint (measured).
				{ tag: 'link', attrs: { rel: 'preload', href: '/fonts/jbmono.woff2', as: 'font', type: 'font/woff2', crossorigin: '' } },
			],
			sidebar: [
				{
					label: 'Start',
					translations: { tr: 'Başla' },
					items: [
						{ slug: 'docs/getting-started' },
						{ slug: 'docs/requirements' },
						{ slug: 'docs/cli' },
						{ slug: 'docs/configuration' },
					],
				},
				{
					label: 'Build',
					translations: { tr: 'Geliştir' },
					items: [
						{ slug: 'docs/commands' },
						{ slug: 'docs/web-features' },
						{ slug: 'docs/plugins' },
						{ slug: 'docs/packaging' },
					],
				},
				// Localised to /tr/blog/ by src/routeData.ts.
				{ label: 'Blog', link: '/blog/' },
			],
		}),
		offlineDocs(),
	],
	vite: {
		plugins: [tailwindcss()],
		build: { assetsInlineLimit: 12288 },
	},
});
