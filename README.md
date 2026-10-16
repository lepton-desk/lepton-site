# lepton-site

The website of [Lepton](https://github.com/lepton-desk/lepton), a Lepton Desk project: the landing page and the documentation, in English and Turkish.

Built with Astro and Starlight. The landing page lives in `src/pages` (`/`, `/tr/`); the docs are Starlight content under `src/content/docs` (`/docs/`, `/tr/docs/`). The visual system is described in `DESIGN.md`.

```sh
pnpm install
pnpm dev       # http://localhost:4321
pnpm build     # static site in dist/
```

The CLI output shown on the landing page (`src/data/cli.ts`) was captured from real runs of `lepton`; replace it with a new capture, never by hand.

Fonts (Archivo, Kalam, JetBrains Mono) are self-hosted under `public/fonts` with their OFL licences.
