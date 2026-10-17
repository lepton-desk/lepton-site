// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import tailwindcss from '@tailwindcss/vite';
import { plateTheme } from './src/styles/code-theme.ts';

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
			expressiveCode: { themes: [plateTheme] },
			head: [
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
			],
		}),
	],
	vite: {
		plugins: [tailwindcss()],
		build: { assetsInlineLimit: 12288 },
	},
});
