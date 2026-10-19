---
title: Changes
description: What changed in each Lepton release, what is on trunk for the next one, and how far 0.2.0 has come. Every figure was measured.
---

Every figure on this page was measured on the project's own machine (Radeon R7 240, Linux, Wayland), with the command recorded in the repository.

## 0.1.9-beta.0 *2026-10-19, beta*

Published under the `beta` tag: `npm create lepton-app@beta`, or with pnpm the exact version, `pnpm dlx create-lepton-app@0.1.9-beta.0`. The rest of 0.1.9 (starter screens, WebAssembly, opt-in server rendering) comes before 0.1.9 itself. [What each framework needed](/blog/astro-next-angular/)

### Templates

- **Astro, Next.js and Angular.** `astro-ts`, `astro-js`, `next-ts`, `next-js` and `angular-ts`, each with the same starter screen as the others. Next.js exports a static site (`out/`) and loads the screen in the window only; Astro's page loads the plain-DOM screen. Measured with fresh projects: `biome check` and `tsc` pass before and after a build, `lepton package --verify` passes, and the window shows no console errors under `run` and `dev`.
- **JavaScript for every Vite template, and Preact and Lit:** `vue-js`, `svelte-js`, `solid-js`, `preact-ts`/`js`, `lit-ts`/`js`. 19 templates in all. JavaScript projects pass `biome check` as created.

### Commands

- **A `frontend` setting** in `lepton.config.json`: where the build goes (`dist`) and how the dev server takes its port and address (`devArgs`, with `{port}` and `{host}`). Without it a project is a Vite project, as before.
- **`lepton dev` opens the window once the dev server listens.** With a cached core the window opened before Astro was ready, and the page stayed at origin `null` with every call to the core refused. A server that stops first (a taken port) is reported with its exit status.
- **`lepton update` on a beta also asks for the newest beta;** `latest` stays at the last release. Old projects' `$schema` moves to the new address.
- Debug builds print the page's console to the terminal. pnpm's and npm's own output stays coloured under `lepton`.

### The rest

- **A JSON schema for `lepton.config.json`,** [published with this site](/schema/config.json): every rule the CLI checks, and unknown fields flagged, so a typo such as `devArg` shows in the editor. Projects used to point at an address that never resolved.
- **A Windows build from Linux links.** `lepton build --windows` handed the Windows binary the Linux libraries pkg-config found; it is now a 1.1 MB `.exe` that imports only Windows DLLs. Not started on Windows yet.
- `create-lepton-app` names WebView2, not WPE WebKit, when the engine is missing on Windows.

## 0.1.8 *2026-10-18*

- **`lepton update` updates the packages too.** It asks the registry for the newest release, moves the project's `@lepton-desk/*` dependencies to it, installs them with the project's package manager and hands over to the newly installed CLI, which updates the core and templates it carries. Found on 0.1.7's release day: in a 0.1.6 project the lockfile kept the CLI at 0.1.6, which has no `update`, so a project could not reach a newer core by itself. From 0.1.8 on, `pnpm lepton update` is enough; an older project runs the newest CLI once. [The CLI](/docs/cli/#lepton-update-017)
- **React projects made before 0.1.7 type-check again**: `lepton update` adds the `"jsx"` setting their `tsconfig.json` lacked (`tsc` failed on every component).
- Measured on a copy of a real 0.1.6 project: one `pnpm dlx @lepton-desk/cli@0.1.8 update` moved six packages to 0.1.8, refreshed the core and the `tsconfig.json`, and the project built.

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

## Windows *in 0.1.9-beta.0*

An app builds, runs and is packaged on Windows 10 with WebView2. The changes below were checked again on Linux afterwards: tests, both render paths, a webview app and its three Linux packages. Measured on the same machine under Windows 10 22H2:

- **WebView2 in a real window.** `zig build webview2-check` opens a Win32 window, puts WebView2 in it, loads a page, runs a script in it and captures a frame. The installed runtime (155 here) is found the way Microsoft's loader finds it and its own DLL is called directly, so no `WebView2Loader.dll` is shipped; only Microsoft's `WebView2.h` is in the repository, under its BSD-style licence. The page loaded in 704 ms, the script answered at 719 ms and the frame was captured at 829 ms. WebView2 is Chromium, the copy that comes with Windows: no browser is bundled, but it is not Chromium-free.
- **The CLI builds and its tests pass on Windows** (293). `lepton new` works there; `build`, `dev` and `run` do not yet, because the core's shared-memory channel and window layer are Linux's.
- **Children end with Lepton.** On Windows `lepton` joins a job object that ends everything it started when it ends, even when it is killed outright: there, ending `cmd` alone had left the dev server's Node process running.
- **LF on every checkout.** A CLI built from a Windows checkout embedded its templates with CRLF line endings, and `zig fmt` refused the generated `main.zig`. The repository now keeps LF everywhere.
- **The webview path runs on WebView2.** `lepton new`, `build`, `dev`, `run`, `record` and `replay` work. The page is served from `http://lepton.localhost` and answered by the same bridge as on Linux: `invoke` (2 ms from the page), events, the shared-memory ring, window commands, `webPermissions`, downloads, `window.open`, the clipboard. A built app is 7 processes and about 100 MiB of private working set, the core 3.3 MiB of it; closing it leaves no WebView2 process behind.
- **`lepton package` on Windows.** A reproducible `.zip` and an **MSI written without WiX**: WiX 3–5 are out of support and 6 onwards come under a maintenance fee, which a framework should not hand to every company using it. The MSI installs per user without admin rights, adds a Start menu shortcut, upgrades an older version and refuses a downgrade, uninstalls cleanly, and passes the Windows SDK's ICE validation with 0 errors. `--verify` starts the packaged app, measures it and closes it, on Windows as on Linux.
- Not yet: native drawing on Windows, `plugin-dialog` and `plugin-fs` there, MSIX (it needs a code-signing certificate). Unsigned installers get Windows' SmartScreen warning, as other frameworks' do.

## 0.1.6

- `npm create lepton-app` works again: 0.1.5's `create-lepton-app` stopped before creating the project (it read `lepton info --json` in an older shape). 0.1.5 of that package is deprecated on npm.

## 0.1.5

- **`lepton record` and `lepton replay`**: a session's calls to the core, written to a file and run again, with or without the window.
- **The app is one app to the desktop**: its own systemd scope, so task managers show the core and the web engine's processes under its name; the window title follows `document.title`.
- **Web engine features**: the inspector in debug builds (F12), links opened in the desktop's browser, `window.open`, downloads, permission requests and notifications. [Web features](/docs/web-features/)
- **One `lepton` script** in new projects (`pnpm lepton dev`), and `lepton new` asks its questions in colour.
- **Webview builds no longer need WPEBackend-fdo**, which Arch no longer packages; a missing engine is reported with the command your distribution installs it with.
