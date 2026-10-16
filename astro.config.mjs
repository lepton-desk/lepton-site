// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import tailwindcss from '@tailwindcss/vite';
import { plateTheme } from './src/styles/code-theme.ts';

// The landing page lives in src/pages (`/`, `/tr/`); the docs are Starlight, under `/docs/`
// and `/tr/docs/`.
export default defineConfig({
	site: 'https://lepton-desk.vercel.app',
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
			expressiveCode: { themes: [plateTheme] },
			head: [
				{ tag: 'link', attrs: { rel: 'preload', href: '/fonts/archivo.woff2', as: 'font', type: 'font/woff2', crossorigin: '' } },
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
					items: [{ slug: 'docs/commands' }, { slug: 'docs/plugins' }, { slug: 'docs/packaging' }],
				},
			],
		}),
	],
	vite: {
		plugins: [tailwindcss()],
	},
});
