---
title: Changes
description: What changed in each Lepton release, what is on trunk for the next one, and how far 0.2.0 has come. Every figure was measured.
---

Every figure on this page was measured on the project's own machine (Radeon R7 240, Linux, Wayland), with the command recorded in the repository.

## 0.1.7 *2026-10-18*

### Commands

- **Coloured output.** `lepton build`, `run`, `dev` and `package` frame each step (`▸ frontend  pnpm run build`, `✔ frontend  0.9 s`) and print their facts aligned. The tools they run keep their own colours: Vite's build table and pnpm's lines used to come out plain because Lepton reads them through a pipe. Plain text with `NO_COLOR` or when piped. `lepton dev` no longer lets Vite clear the terminal.
- **`lepton update`.** Brings an existing project's core and `src-lepton/` files to the installed version and keeps your edits by a three-way merge; a conflicting edit writes `main.zig.merge` and changes nothing. [The CLI](/docs/cli/#lepton-update-017)
- **`lepton replay --page --close`.** A page replay that ends by itself, so a recording can be a test. [The CLI](/docs/cli/#lepton-record-and-lepton-replay-015)

### The core

- **Stopping an app cleans up.** SIGTERM, Ctrl+C or the session ending now end the loop instead of killing the core, so its channel leaves `/dev/shm`. Before, every app stopped by a signal left four files behind.
- **No more polling.** The page used to read the core's 532 KB ring every 250 ms. It now waits until the core publishes and reads only what changed. Idle, the app's processes went from 0.87 s to 0.07 s of CPU in 30 s, and the web process from a 175–207 MiB sawtooth to a flat 176 MiB.
- **The window size in `lepton.config.json` is read on every build.** It used to be written once into `main.zig` by `lepton new`.
- **Native apps on shared memory.** A native window without the GPU drew about 300 frames a second for a 60 Hz screen and made a new buffer each time. It now reuses two buffers and waits for the compositor: 9.06 s → 1.10 s of CPU in 10 s.

### Projects

- **New projects pass `tsc` and `biome check`**, before and after the first build. Three template bugs were found by checking exactly that: react-ts had no `jsx` setting, the generated types file had an empty interface Biome rejects, and a project made with plugins had a 140-character permissions line.
- **An example app:** [`examples/notes`](https://github.com/lepton-desk/lepton/tree/trunk/examples/notes), a Markdown notes app (CodeMirror, Milkdown, wiki links, backlinks, a board view, a command palette) built on the fs, dialog and clipboard plugins. Its start-up is recorded and replayed as a test; putting an old bug back (walking the folder tree twice) made the replay fail, as it should.

### Arch packages

- `lepton-desk` (from source) and `lepton-desk-bin` (the npm binary), installed as `lepton-desk` so they sit beside the AUR's `lepton`. New AUR accounts are closed for now; until then they build from the repository. [System requirements](/docs/requirements/#the-cli-on-arch-017)

## 0.2.0 *in preparation*

0.2.0 is planned as a `@beta` release: a native renderer that draws on the GPU directly, a JavaScript engine for native apps, and native UI. The groundwork so far:

- **The Vulkan floor is the Radeon R7 240's.** Vulkan 1.3 with dynamic rendering, synchronization2, timeline semaphores, descriptor indexing and buffer device address; a device without them gets the GLES 3 path. `zig build vulkan-check` checks a machine and draws with exactly those features; under Khronos validation it reports no errors.
- **A draw command list, drawn by the GPU.** Rectangles with rounded corners and borders, soft shadows and text are 64 bytes each and drawn in one call. A 1200×800 scene of 2001 shapes takes 0.65 ms on the R7 240; 128 KB a frame reaches the GPU, where today's native path uploads a 3.84 MB frame. Text is shaped by HarfBuzz and each glyph is uploaded once.
- **The native template draws on it.** Its screen and the window's title bar and menu are one command list; the title is now drawn in the bar. The app uses 0.21 s of CPU in 10 s, against 0.82 s painting on the CPU and uploading the frame. Without the GPU it falls back to that path.
- **Decided:** layout will be Lepton's own flexbox, written in Zig.

## 0.1.6

- `npm create lepton-app` works again: 0.1.5's `create-lepton-app` stopped before creating the project (it read `lepton info --json` in an older shape). 0.1.5 of that package is deprecated on npm.

## 0.1.5

- **`lepton record` and `lepton replay`**: a session's calls to the core, written to a file and run again, with or without the window.
- **The app is one app to the desktop**: its own systemd scope, so task managers show the core and the web engine's processes under its name; the window title follows `document.title`.
- **Web engine features**: the inspector in debug builds (F12), links opened in the desktop's browser, `window.open`, downloads, permission requests and notifications. [Web features](/docs/web-features/)
- **One `lepton` script** in new projects (`pnpm lepton dev`), and `lepton new` asks its questions in colour.
- **Webview builds no longer need WPEBackend-fdo**, which Arch no longer packages; a missing engine is reported with the command your distribution installs it with.
