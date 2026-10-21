# lepton-site

The website of [Lepton](https://github.com/lepton-desk/lepton), a Lepton Desk project, at
**[lepton-desk.vercel.app](https://lepton-desk.vercel.app)**: the landing page, the
documentation, the blog and the configuration schema, in English and Turkish.

## What it documents

Lepton's current releases: **0.1.8** (stable, Linux) and the **0.1.9 beta** (`@beta`
on npm), which adds Windows through WebView2. A feature that arrived in a release is
marked with it (*0.1.9-beta.2*); the changelog keeps "On trunk" for what is merged but
not released. Every figure on the site was measured with a real command — the docs say
where — and what is not measured yet is said to be so.

| Path | |
| --- | --- |
| `src/pages` | the landing page (`/`, `/tr/`), the blog and its RSS (`/blog/`, `/tr/blog/`), the offline page |
| `src/content/docs` | the docs, Starlight content (`/docs/`, `/tr/docs/`): getting started, requirements, the CLI, configuration, commands, plugins, packaging, web features, changelog |
| `src/content/blog` | posts, `en/` and `tr/` |
| `public/schema/config.json` | the JSON Schema of `lepton.config.json` (`$schema` in new projects); every rule in it is one the CLI enforces |
| `src/data/cli.ts` | the CLI output on the landing page, captured from real runs of `lepton`; replace it with a new capture, never by hand |
| `integrations/` | a Content-Security-Policy for every built page (the hashes of its own inline scripts and styles), and the list `public/sw.js` caches so the docs read offline |
| `DESIGN.md` | the visual system |

English and Turkish pages are kept in step: a change to one is made to the other.

## Develop

```sh
pnpm install
pnpm dev       # http://localhost:4321
pnpm build     # static site in dist/
```

On Vercel the build command is `pnpm run build` and the response headers come from
`vercel.json`.

Fonts (Archivo, Kalam, JetBrains Mono) are self-hosted under `public/fonts` with their
OFL licences; nothing is loaded from a CDN.
