---
title: Getting started
description: Create a Lepton project, open its window, and build a release.
---

Lepton builds desktop applications with a **Zig core** and a **web front end**. The core opens the window and runs your commands; the page runs in the web engine the system already has. Today that means **Linux** and **WPE WebKit**.

## What you need

- Linux, with Wayland or X11
- [Zig 0.16](https://ziglang.org/download/)
- WPE WebKit 2.54 or newer, built with its WPE Platform API (`pkg-config wpe-webkit-2.0 wpe-platform-2.0`), and libsoup 3. The Platform API is stable and on by default since 2.54; libwpe and WPEBackend-fdo are not used on this path.
- Node 20 or newer, and npm, pnpm, Yarn or Bun

`lepton info` checks the machine and says what is missing:

```sh
npx @lepton-desk/cli info
```

:::caution[Known issue in 0.1.4]
The webview build still asks `pkg-config` for `wpebackend-fdo-1.0` and stops when it is not there, and `lepton info` reports it as missing, although the 2.54 path never loads it. Arch no longer packages libwpe or WPEBackend-fdo, so on a fresh Arch install the webview build fails. This is being fixed; native builds (`--target native`) are not affected.
:::

## Create a project

```sh
npm create lepton-app@latest
```

The wizard asks for a name, a front end (React, Vue, Svelte, Solid or plain TypeScript) and how the app renders. Choose **webview** to load your page in WPE WebKit; **native** draws straight to the window with no web engine.

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

`dev` starts Vite, builds the core once and opens the window. Edits to the page reload it; the core is rebuilt only when you change Zig.

## Build and package

```sh
npm run lepton build      # a release binary
npm run lepton package    # .tar.gz by default; .deb and Arch on request
```

See [Packaging](/docs/packaging/) for the formats, and [The CLI](/docs/cli/) for every command.

:::note[Early]
Lepton is at 0.1. The webview path works on the machines it is built and tested on, but is not yet verified end to end everywhere. macOS and Windows are planned, not built.
:::
