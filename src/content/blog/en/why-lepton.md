---
title: "Lepton, and what it is not"
description: "A desktop framework that runs your web front end on the engine the system already has, with a Zig core and a Rust CLI. What works today, what it costs, and what is still a plan."
date: 2026-10-17
note: "numbers from lepton's own measurement log"
---

Lepton is a framework for desktop applications written with web technologies. Your front end (React, Vue, Svelte, Solid or plain TypeScript, built by Vite) runs in a window; a core written in Zig owns that window and talks to the page. A single Rust binary, `lepton`, creates, runs, builds and packages the application.

What it does differently is one thing, and the rest follows from it: **Lepton does not ship a browser.** It uses the web engine the operating system provides.

## The engine the system already has

On Linux that engine is WPE WebKit, through the `wpe-platform` API that arrived in 2.54; WebKitGTK is not used. The build also has a separate path for WebKit 2.52 and older (the `libwpe` API), chosen automatically when that is what the machine has, but 2.54 is the one Lepton is developed on. Servo can be linked instead with `lepton build --linux --servo`, for those who would rather avoid WebKit; it is experimental.

macOS (WKWebView) and Windows (WebView2) are planned, not built. WebView2 is Chromium-based, so on Windows Lepton will not be "Chromium-free"; the difference is that it comes with Windows and your application does not carry it.

## No JSON between the page and the core

The page calls the core with `invoke`, and the core sends events back. Both are binary frames, not JSON: a call is one request frame posted to `lepton://localhost/__lepton/invoke`, and the reply frame is the response. The offsets and command ids the page uses are generated from the core's own structures when it compiles, so the two sides cannot drift apart. The shared-memory ring underneath the core's channel measured a round trip of 248 ns at the median (`zig build roundtrip`, 20 000 trips).

Commands are Zig functions you register in `src-lepton/main.zig`. The page may call only the commands listed under `permissions` in `lepton.config.json`, each by name, with no wildcards, and the list is checked **when the core compiles**: a name with no command fails the build, and a call to an unlisted command is answered `denied`.

## From `npm create` to a package

```sh
npm create lepton-app@latest hello-lepton -- --template react-ts --target webview
cd hello-lepton
npm run lepton dev       # Vite with hot reload, the core, the window
npm run lepton package   # .tar.gz by default; .deb and Arch on request
```

The packaged hello application was a 173 852-byte `.tar.gz`. Packages are reproducible (sorted entries, fixed owner and time, a `.sha256` beside each), and `lepton package --verify` unpacks each one into an empty directory, starts it, measures it and closes it, failing if it does not start or leaves a process behind.

## What it costs

Not shipping a browser does not make a web page free. A packaged Lepton application with a web front end measured:

| | |
| --- | --- |
| The application process | 67.5 MiB resident |
| The whole tree, WebKit's processes included (8 processes) | about 200 MB, counted as PSS so shared pages are not counted twice |
| Idle CPU over 10 seconds | 1.6% of one core |

That is WebKit's web and network processes doing what a browser engine does. The memory a web page needs is the honest cost of a web front end; Lepton's part is not adding a second engine on top of the one the system has.

## Where it stands

- **Works today:** Linux, WPE WebKit; `lepton new | dev | run | build | package | info`; the fs, dialog, clipboard and os plugins; npm, pnpm, Yarn and Bun.
- **0.1.5, next:** downloads, the web permission flow, notifications, the Web Inspector in debug builds, links opening on the desktop, and `lepton record` / `lepton replay`, which records every call a page makes and replays it against the core.
- **0.2.0, planned as a beta:** direct GPU rendering, and native interfaces written with web technologies but drawn by Lepton itself, without a browser engine.

The source is at [github.com/lepton-desk/lepton](https://github.com/lepton-desk/lepton), and the [docs](/docs/getting-started/) say what each command does today.
