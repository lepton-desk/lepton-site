---
title: Getting started
description: Create a Lepton project, open its window, and build a release.
---

Lepton builds desktop applications with a **Zig core** and a **web front end**. The core opens the window and runs your commands; the page runs in the web engine the system already has: **WPE WebKit** on **Linux**, and **WebView2** on **Windows 10 and 11** in the 0.1.9 beta.

## What you need

- Linux, with Wayland or X11
- [Zig 0.16](https://ziglang.org/download/)
- WPE WebKit 2.54 or newer, built with its WPE Platform API (`pkg-config wpe-webkit-2.0 wpe-platform-2.0`), and libsoup 3. The Platform API is stable and on by default since 2.54; libwpe and WPEBackend-fdo are not used on this path.
- Node 20 or newer, and npm, pnpm, Yarn or Bun

`lepton info` checks the machine and says what is missing:

```sh
npx @lepton-desk/cli info
```

Not every distribution ships WPE WebKit 2.54; [System requirements](/docs/requirements/) lists where to get it and what each platform needs.

:::caution[Use 0.1.6 or later]
`npm create lepton-app@latest` gets 0.1.8; `npm create lepton-app@beta` gets 0.1.9-beta.0, with Windows and the Astro, Next.js and Angular templates (with pnpm, name the exact version: `pnpm dlx create-lepton-app@0.1.9-beta.0`). Two earlier versions had a problem: 0.1.4's webview build asked for `wpebackend-fdo-1.0`, which the 2.54 path never loads and Arch no longer packages, so a fresh Arch install could not build with it (fixed in 0.1.5). `create-lepton-app` 0.1.5 stopped before creating the project (fixed in 0.1.6; 0.1.5 is marked deprecated on npm).
:::

## Create a project

```sh
npm create lepton-app@latest
```

The wizard asks for a name, a front end (plain TypeScript or JavaScript, React, Vue, Svelte, Solid; in the beta also Preact, Lit, Angular, Next.js and Astro) and how the app renders. Choose **webview** to load your page in WPE WebKit; **native** draws straight to the window with no web engine.

Without questions:

```sh
npm create lepton-app@latest hello-lepton -- --template react-ts --target webview --non-interactive
```

## Run it

`create-lepton-app` installs the dependencies unless you pass `--no-install`. Lepton's commands go through one script, `lepton` *0.1.5* (0.1.4 projects have `lepton:dev` and `lepton:build`); `check` and `format` run Biome, and the framework's own `dev`, `build` and `preview` scripts stay. With npm put `--` before flags; pnpm, Yarn and Bun don't need it.

```sh
cd hello-lepton
npm run lepton dev
```

`dev` starts the front end's dev server (Vite, or Astro's, Next.js's or Angular's), builds the core once and opens the window once the server listens. Edits to the page reload it; the core is rebuilt only when you change Zig.

## Build and package

```sh
npm run lepton build      # a release binary
npm run lepton package    # .tar.gz on Linux, .zip on Windows; .deb, Arch and MSI on request
```

See [Packaging](/docs/packaging/) for the formats, and [The CLI](/docs/cli/) for every command.

:::note[Early]
Lepton is at 0.1. The webview path works on the machines it is built and tested on, but is not yet verified end to end everywhere. Windows is in the 0.1.9 beta, with WebView2 only (no native drawing yet); macOS is planned, not built.
:::
