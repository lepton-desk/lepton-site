// A Content Security Policy for every built page, as a <meta> tag right after the charset, made
// from the page itself: the SHA-256 of each inline <script> and <style> is allowed, nothing else
// inline is. Astro's own `security.csp` was tried first and hashes only the scripts Astro bundles:
// Starlight's `is:inline` scripts (theme, menu, sidebar), the service worker registration and the
// landing page's own were left out, so the browser refused them (measured: 182 inline blocks on 32
// pages, the landing page's sections never opened). Style *attributes* stay allowed inline, and only
// those: Expressive Code colours each token with one (3,747 on 32 pages). frame-ancestors has no
// effect in a <meta> CSP, so it and the other headers are in vercel.json.
import { createHash } from 'node:crypto';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const fixed = [
	"default-src 'self'",
	"img-src 'self' data:",
	"font-src 'self' data:",
	"connect-src 'self'",
	"manifest-src 'self'",
	"worker-src 'self'",
	"base-uri 'self'",
	"form-action 'self'",
	"object-src 'none'",
	"style-src-attr 'unsafe-inline'",
];

// Data blocks are never run, so the policy does not apply to them.
const dataBlock = /type\s*=\s*["']?(application\/(ld\+)?json|speculationrules|importmap)/i;

const hash = (text) => `'sha256-${createHash('sha256').update(text, 'utf8').digest('base64')}'`;

async function htmlFiles(dir) {
	const out = [];
	for (const entry of await readdir(dir, { withFileTypes: true })) {
		const full = path.join(dir, entry.name);
		if (entry.isDirectory()) out.push(...(await htmlFiles(full)));
		else if (entry.name.endsWith('.html')) out.push(full);
	}
	return out;
}

/** The policy for one page: its own inline blocks, by hash. */
export function policyFor(html) {
	const scripts = new Set();
	const styles = new Set();
	for (const [, attrs = '', body] of html.matchAll(/<script(\s[^>]*)?>([\s\S]*?)<\/script>/gi)) {
		if (/\ssrc\s*=/.test(attrs) || dataBlock.test(attrs)) continue;
		scripts.add(hash(body));
	}
	for (const [, body] of html.matchAll(/<style(?:\s[^>]*)?>([\s\S]*?)<\/style>/gi)) styles.add(hash(body));
	return [
		...fixed,
		// Pagefind (the docs search) compiles WebAssembly.
		["script-src 'self' 'wasm-unsafe-eval'", ...scripts].join(' '),
		["style-src-elem 'self'", ...styles].join(' '),
	].join('; ');
}

export default function inlineCsp() {
	return {
		name: 'inline-csp',
		hooks: {
			'astro:build:done': async ({ dir, logger }) => {
				const root = fileURLToPath(dir);
				let pages = 0;
				for (const file of await htmlFiles(root)) {
					const html = await readFile(file, 'utf8');
					if (/http-equiv="content-security-policy"/i.test(html)) {
						throw new Error(`${file} already has a CSP; two policies would both apply`);
					}
					const charset = html.match(/<meta charset="[^"]*"\s*\/?>/i);
					if (!charset || charset.index === undefined) throw new Error(`${file} has no <meta charset>`);
					const at = charset.index + charset[0].length;
					const meta = `<meta http-equiv="content-security-policy" content="${policyFor(html)}">`;
					await writeFile(file, html.slice(0, at) + meta + html.slice(at));
					pages++;
				}
				logger.info(`${pages} pages`);
			},
		},
	};
}
