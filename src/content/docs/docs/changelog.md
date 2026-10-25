---
title: Changes
description: What changed in each Lepton release, what the next one brings, and how far 0.2.0 has come. Every figure was measured.
---

Every figure on this page was measured on the project's own machine (Radeon R7 240, Linux, Wayland), with the command recorded in the repository.

## 0.1.9-beta.3 *not released yet*

The last beta of 0.1.9: its API is frozen here, and what comes after it is 0.1.9 itself and its fixes. 0.1.9-beta.2 went out only in part, from Windows (`@lepton-desk/cli-win32-x64`, `api`, `plugin-clipboard`, `plugin-dialog`); every package moves to beta.3 together, so everything below arrives at once. To update a project: `npm run lepton update` (or `pnpm lepton update`) once beta.3 is out; it also brings the core and `src-lepton/` files.

- **Your app's name in a title bar the page draws.** `info()` from `@lepton-desk/api/app` gives `productName`, `version` and `identifier`; `title()` and `onTitleChanged()` from `@lepton-desk/api/window` give the window's name, which the core keeps whatever the engine (`title()` needs `window.title` under `permissions`). Measured on Linux in WPE WebKit and Servo. [Commands](/docs/commands/#your-own-title-bar-and-menus-019-beta2)
- **New names in `main.zig` and plugins.** `core.commands` and `core.events` replace `core.webviewRegistry` and `core.webviewEvents` (the old names still build), and an event is emitted with `events.emit(view.bridge.eventTarget(), …)`; `lepton update` writes the new `main.zig`. In a project made by the Linux 0.1.9-beta.2 CLI, `lepton update` no longer reports a conflict in `main.zig` that you did not make.
- **A right-click menu by default.** Cut, Copy, Paste and Select All (and Inspect in a developer's build) wherever the page does not take the click with `preventDefault()`; items that would do nothing are disabled. On WebView2 it is WebView2's own menu kept to those items. Measured on Linux in WPE WebKit; Servo and WebView2 are still to be measured. `"window": { "contextMenu": false }` turns it off. [Configuration](/docs/configuration/)
- **Servo apps can be packaged.** `lepton package --linux --servo` puts Servo's library in the package beside the app (`lib/<name>/`, `/usr/lib/<name>/` in the Arch and Debian packages), so it starts on a machine without your `node_modules`; it adds about 45 MB to a `.tar.gz`. Measured with `--verify` on the `.tar.gz` and the Arch package. Run `lepton update` first. [CLI](/docs/cli/)
- **The dock knows a WPE WebKit app.** Its window used to carry an `org.webkit.app-…` name with no icon; it now carries the app's identifier, and COSMIC's dock shows the app's icon and name (measured).
- **Servo: cursors, and top-level `await`.** The pointer now changes over links, text and the edges of a frameless window (measured from the screen: `pointer`, `text`, `grab`, `not-allowed`, `none`, `n-resize`). A module with top-level `await` no longer reports `uncaught exception: undefined`, and a real rejection there now reaches the page's `error` event, which it never did.
- **Packages carry only the current frontend.** A rebuilt app's package could hold the previous build's script files beside the new ones; it no longer does.
- **The native app's title bar shows its title on the CPU path too.** It was empty there; on the GPU it now shows `window.title`, like the system's.
- **`src-lepton/native.zig`.** The native program moved out of `main.zig`, which keeps your commands, state and events; `lepton update` adds the new file.
- **The app's folders are its own.** Its data and cache folders are narrowed to the owner (0700) when an older version or the engine left them wider.
- **One running copy, and deep links.** A second start hands its arguments to the running copy, whose page hears it as `app.opened`; `deepLinks` in `lepton.config.json` registers URL schemes (the desktop entry on Linux, `HKCU\Software\Classes` in the MSI). `@lepton-desk/api/app` gives `launchArgs()` and `onOpened()`. Measured on Linux: `xdg-open myapp://open/43` reached the running page and no second window opened; a link started a closed app with it in `launchArgs()`. [Configuration](/docs/configuration/#deeplinks-and-the-single-running-copy-019-beta2)
- **`fs.watch`.** A watched folder's changes reach the page as they happen, with no polling: a write from the page and one from another program were both reported (`created`, `modified`). On Linux and on Windows (below). [Plugins](/docs/plugins/)
- **Reading the clipboard needs the user.** `readText` answers only within five seconds of a key or button press in the window, judged by the core from real input; a read at page load is refused (`NotAllowedError`), one after a click answers (measured). `"plugins": { "clipboard": { "read": "always" } }` for a clipboard manager.
- **The native render path on Windows.** `--target native` makes an app that opens a Win32 window with no web engine: drawn on the GPU with Direct3D 11 (the CPU and GDI when the machine gives no device, or with `LEPTON_GPU=cpu`), its text set by DirectWrite (Segoe UI, Consolas and the system's fallback fonts), at the display's refresh, a dark title bar to match the page. Measured with `lepton new --target native` and `lepton run` on Windows 10: a 565 KB release binary, the template's screen, a resize redrawn, exit 0 on close. On the GPU: 59.8 frames a second, 156 ms of CPU in 5 s; on the CPU, 59.8 and 1594 ms. [System requirements](/docs/requirements/)
- **Unlimited frames, if you want the number.** `"window": { "frameRate": "unlimited" }` (or `LEPTON_FRAME_RATE=unlimited` when the program runs) lets a native app draw as fast as the machine can instead of at the display's refresh, which stays the default (`"display"`). On Windows the GPU presents without waiting and tears where the system allows it; on Linux the GLES swap interval is 0 and no frame waits for the compositor. Measured on a Radeon R7 240 with a 60 Hz screen: the template's screen at 2881 frames a second on the GPU and 271 on the CPU, against 59.8 paced; a 2001-shape scene at 1046–1188 a second, 0.7 ms of GPU a frame. Frames the screen cannot show are dropped or torn, and the CPU or GPU runs flat out. On Linux (Wayland, the same card): 3870 frames a second on GLES and 169 on the CPU, against 59.8 and 58.0 paced.
- **macOS is not supported, and `--macos` says so.** `lepton build --macos` used to cross-compile for `aarch64-macos` and hand over a binary nobody had run; it is now refused before anything is built, with the reason: signing and notarizing for macOS need a paid Apple account and Mac hardware, which Lepton cannot keep up. [System requirements](/docs/requirements/)
- **Lepton's mark as the default icon.** New projects get `src-lepton/icon.svg`; Linux packages install it under `share/icons` with `Icon=` in the entry, and the MSI uses an `.ico` of it when `bundle.icon` is not set.
- **A new identifier is `com.<owner>.<app>`.** The wizard asks who publishes the app (default: Git's `user.name`), and `--owner` says it on the command line. It used to be the bare app name.
- **Ctrl+C on `lepton dev` leaves nothing behind.** Ctrl+C reaches the app and the CLI, which also sends SIGTERM; the core took that second signal as "stuck" and ended without unlinking its channel (four files in `/dev/shm`, measured), and the CLI printed `✖ app failed`. A second signal within a second is now the same request: no files left, `✔ app`.
- **Channel names are per user** (`.u<uid>`), so another user cannot keep an app from starting by taking its name in `/dev/shm`. A deferred private command that answers at once is recorded masked like the rest.
- **Zig 0.16 and 0.17 both build Lepton.** 0.17 removed `@cImport` and `**`, renamed the build API's `findProgram` and `getInstallPath`, and lists a type's fields differently. The C headers are now translated by the build (`src/c/`, which 0.16 does too), and the rest of the differences sit in one place each (`compat.zig`, `zig_017` in `build_support.zig`). Measured with each version: the core's tests and GPU, scene, Vulkan and invoke checks; a webview app with every plugin, built, run and cross-built for Windows; a native app. The CLI takes `zig`, `zig-0.17` or `zig-0.16`, whichever is first.
- **Lepton picks a Zig 0.16 itself.** Zig 0.17 stops at Lepton's own `build.zig` (8 errors, measured), and Arch moved its `zig` to 0.17. The CLI now takes `LEPTON_ZIG` when set, else the first of `zig` and `zig-0.16` on `PATH` that reports 0.16, and names the version it found when none fits. The Arch packages depend on the AUR's `zig0.16-bin` and hand it to the CLI, so the system's `zig` can be upgraded. [System requirements](/docs/requirements/)
- **Debug builds link again on an up-to-date Arch.** glibc 2.44's `crt1.o` carries an `.sframe` section that Zig 0.16's own linker, which Debug builds use, cannot read; `zig build` in a new webview project failed at its command-types helper, and the core's tests failed the same way. Every Linux binary now links through LLVM and LLD, which read it (as Zig 0.17's linker does).
- **A project made with beta.1 runs `dev` again after `lepton update`.** beta.1's CLI ran whatever `zig` was on `PATH`; with Arch's Zig 0.17 a new project stopped at its `build.zig` (`no field named 'ReleaseSmall'`), and with Zig 0.16 its Debug build stopped at the linker above. Measured on a copy of such a project with trunk's CLI: `lepton update` replaced `main.zig`, `build.zig` and 27 core files; then `lepton build` passed, and `lepton dev` built the core and opened the window. Once beta.2 is out, `npm run lepton update` (or `pnpm lepton update`) in the project is the whole fix.
- **The core answers the application's own page only.** Each run makes a random key, and the core's paths (`invoke`, events, the ring, `close`) are under `/__lepton/<key>/`; the key is written only into the transport, which the core now adds to the application's own page and no other. Measured on WPE WebKit: a page the app navigated to used to reach the core (5 requests) and now makes none; a sandboxed iframe's unkeyed request is refused.
- **Other sites stay out of the window.** A link or script that leads the window to another site opens it in the system browser (http, https and mailto only; `tel:` and other schemes are no longer handed on) on all three engines, and the page there gets no transport.
- **File grants live in the app's state folder** (`~/.local/state/<identifier>`, `%LOCALAPPDATA%\<identifier>\State`), out of reach of the `fs` plugin's scopes. A save dialog grants the file it saved, not its folder, and no grant covers the home folder or anything above it. Folders granted under beta.1 are asked for once more.
- **Names in `lepton.config.json` are checked.** `productName`, `window.title`, `identifier` and `version` refuse control characters, and the name and identifier refuse path separators; values written into generated Zig, desktop entries and `.deb` control files are escaped. The [schema](/schema/config.json) carries the same rules.
- **Smaller fixes:** `plugin-fs` reads nothing for an offset past any file's end rather than stopping the core, and a file saved in pieces keeps the old file's permissions; `lepton replay` makes its temporary home new and owner-only; `lepton update` accepts only a semver pre-release from the registry; the command types are never written through a link.
- **`--servo` links Servo when its library is there, and is refused with the reason when it is not.** It used to exit 0 with a WPE WebKit binary. Servo is now the core's third engine, built and measured in CI only (`servo-bridge`): a template app built with `--servo` opened at 1200×800 and its page read the core's ring through the keyed path. Its library ships as `@lepton-desk/servo-linux-x64` (Linux x86-64, experimental; CI builds it), which `--servo` finds in the project; `lepton build`, `run` and `dev` all take `--servo`. Under `dev` the app used to hang on exit: Servo's shutdown waits for every worker without a limit, and the Vite client's never stopped. The core now leaves Servo to the process's end and exits with `_exit` after its own cleanup (measured: Ctrl+C ends it at once, no files left, exit code 0 on SIGTERM).
- **Servo: storage, the window's events and its close button.** Servo gave `lepton://` pages an opaque origin, so `localStorage` threw `SecurityError`; Lepton now builds Servo with a small patch to `servo-url` that gives the app's scheme a (scheme, host) origin, as on WPE WebKit (measured: `localStorage` kept across restarts, `runs` 1, 2, 3). `window.resized` never reached a Servo page and the window did not list `WM_DELETE_WINDOW`, so a window manager's close did not reach the app; both fixed (measured: the same sizes as WPE on maximize and restore, and a clean exit on `WM_DELETE_WINDOW`).
- **`document.cookie` on the packaged page.** Both Linux engines keep no cookies for a page on `lepton://`, by the HTML standard; Lepton now defines `document.cookie` there, kept in `localStorage` (measured on WPE WebKit and Servo: a cookie written in one run read in the next). Real cookies, on the dev server's page, did not last past a run on either engine: WPE kept them in memory until told a file (now `cookies.sqlite` in the app's data folder), and Servo writes its jar only at the end of a shutdown the core skips (a small patch to `servo` writes it before). Measured: read at the next start on both. [Web features](/docs/web-features/#storage-and-cookies-019-beta2)
- **Ctrl+C on `lepton run` always reports the app.** The signal handler's exit raced the line for the application, and one Ctrl+C in four ended `lepton run` with no `✔ app` (measured); the handler now waits for that line. Six in six reported it, exit code 130.
- **Your own title bar, native menus, and a title bar that follows the page.** `"window": { "decorations": false }`, `dragRegion` and `popupMenu` in `@lepton-desk/api/window`. Measured on Windows 10 with real input: the page's bar moved the window, a double click maximized it, the left border resized it; the system menu chose with the keyboard, skipped the separator, Escape gave `null`. On Windows the title bar takes the page's `color-scheme` and `theme-color` (dark and light measured; Windows 10 needed `WM_NCACTIVATE` to repaint at once). On Linux under Servo the window drops its frame (`_MOTIF_WM_HINTS`), the bar moves it (`_NET_WM_MOVERESIZE`) and the menu is Lepton's own, closing when the app loses the focus (measured by hand on COSMIC); under WPE WebKit these three wait for Lepton's own WPE platform. [Commands](/docs/commands/#your-own-title-bar-and-menus-019-beta2)
- **The right button reaches a Servo page.** The core's X11 window gave a right press to the native path's frame menu, so a Servo page never saw `mousedown` 2 or `contextmenu`; it now does.
- **On Windows: the app's icon in its title bar, a window that fits a small screen, `fs.watch`, and a clipboard write without focus.** The executable carries the icon (`bundle.icon` or Lepton's); a 1200×800 window on a 1024×768 screen opens fitted to the work area; `fs.watch` uses `ReadDirectoryChangesW` (created, modified, renamed, removed, recursive; a junction in the tree is refused); `writeText` no longer waits for the focus there. All measured on Windows 10.
- **`app.args` is in a new project's permissions,** and recordings mask what it returns (a start argument can carry a secret, such as an OAuth code).
- **On Windows 11 the title bar takes the page's colour (measured).** Lepton's `windows` workflow builds and opens the template app on Windows Server 2025 (Windows 11's base, build 26100): with `theme-color: #ffd700` the bar is `rgb(255, 215, 0)` with black text; with `rgb(27 29 28)` it is that colour with white text. The same job installs the MSI, runs the installed app through the same checks and removes it, leaving no folder.
- **`lepton new` works on Windows where npm is a `.cmd`.** Node's installer gives npm as `npm.cmd` (so does a pnpm installed by npm); the CLI looked only for `.exe` and said "`npm` is not found on PATH" with npm installed (measured in CI). A name is now looked up in `PATHEXT` order, as the shell does. `lepton new` on Windows now names the engine WebView2.
- **Zig 0.17 on Windows.** The core's tests, the plugins, the tools and the template app build and run with 0.17 too (Windows 10), with the same results as 0.16.
- **Three GPU backends for the Windows native path.** Vulkan, Direct3D 11 and OpenGL 3.3 are tried in that order, and the CPU is the last resort; `LEPTON_GPU=vulkan|d3d11|gl|cpu` forces one. Vulkan is used only when the device meets the renderer's threshold (Vulkan 1.3, dynamic rendering, synchronization2). Measured on a Radeon R7 240 with a 2001-shape scene, unlimited:
  - Direct3D 11: 1046–1188 frames a second, 0.7 ms of GPU a frame;
  - OpenGL 3.3: 1002–1039, 0.45 ms;
  - Vulkan: 689–706, 0.45 ms. Presenting to the window costs this driver about 0.9 ms more a frame.

  Its Vulkan 1.2 misses the threshold, so the app opens Direct3D 11. All three were paced at 59 a second on a 60 Hz screen. The older swap chains (Windows 8's flip-sequential, Windows 7's blt model) were forced one by one and drew correctly.
- **The page's notifications are the app's own Windows notifications.** They carry the app's name and icon, not "lepton.localhost". `onshow`, `onclick`, `onclose` and `close()` work (measured from the screen). `webPermissions` now reaches the page before it asks: with `notifications: "allow"`, `Notification.permission` and `permissions.query` say `granted`. Before, they said `default` and `prompt`, and a notification made before `requestPermission` failed. The MSI registers the name and icon and removes them on uninstall (ICE: 0 errors).
- **An MSI replaces another build of the same version.** Windows Installer compares only `major.minor.build`, so a rebuilt package, and `1.0.0-beta.1` → `1.0.0-beta.2`, were refused with 1638 while the older one was installed. Each build now has its own ProductCode and removes the installed one up to its own version. Measured: two builds of 0.1.0 installed in turn left one product, with the second build's page; the same package again is a repair (0); 0.1.0 over 0.2.0 is still refused.
- **`identifier`, `productName`, `channel.name` and `window.title` are read from `lepton.config.json` on every build.** `lepton new` used to write them into `main.zig`. An identifier changed later, such as the `com.example` default before release, reached the installer but not the program. Measured: a renamed project's program now uses the new identifier. A project made before this keeps its `main.zig` until `lepton update`.
- **Smaller Windows fixes, all measured on Windows 10:**
  - A popup follows `webPermissions` and the download rules.
  - Signing out closes the app cleanly (exit 0).
  - `lepton dev` and `run` register `deepLinks`.
  - A Debug build prints the page's console in the terminal.
  - The CLI asks children to close before it ends them.
  - A missing WebView2 is offered through `winget`.
  - Cookies on the dev server's page last across runs.
- **On Linux, measured there afterwards:**
  - WPE WebKit fits a window larger than the screen to it (1200×800 → 1200×768). COSMIC proposes its own first size to every new window, a GTK 4 one included (910×458 for 1200×800), and that wins.
  - Servo's window takes the app's identifier (the dock shows its icon) and resizes from its edges when frameless; its menu draws `&` correctly.
  - `bundle.icon` takes an `.svg` for Linux packages, installed byte for byte under `share/icons`; a `.png` is refused with the reason.
  - `LEPTON_GPU=cpu` is read there too; a Windows-only value falls back to GLES with a warning.
  - The native path's tests run in CI, under Mesa.
  - `lepton package --windows` on Linux makes the same files on every run; its MSI installs on Windows and passes the same checks as one made there. The two machines' packages differed only in the `.exe`: on Windows, Zig built for that machine's own Windows version, and code the standard library adds from Windows 10 1803 on came with it. Windows builds now name their oldest Windows (Windows 10 for a web view app, Windows 7 SP1 for a native one), and the two machines' `zip` and `msi` are the same bytes (measured). A web view app on Windows 8.1 or older says it needs Windows 10 or 11 in a message box and stops.
- **Release builds are for the plain x86-64.** A build for the platform you are on used to be made for that machine's own CPU, so a package could stop with "illegal instruction" on an older processor (measured: 2253 AVX instructions in a native app built here before, none now).

## 0.1.9-beta.1 *2026-10-19, beta*

- **The plugins on Windows.** `os`, `fs` and `dialog` were measured end to end in a WebView2 app; `clipboard` is built for Windows but not measured there yet (a window driven for the test has no focus, and `writeText` waits for it). `plugin-dialog` opens Windows' own file dialogs; `plugin-fs` keeps its scope with one `NtCreateFile` relative to the scope folder and refuses every link out of it, stricter than on Linux (a junction planted inside the folder opened without the flag and is refused with it, measured); `plugin-os` reports the Windows version, host name and locale. `$APPDATA`, `$APPCACHE` and the other folders come from Windows' Known Folders.
- **No console error on a new project under WebView2.** WebView2 asks for `/favicon.ico` on every page; the 404 is now an empty 204.
- **The `.exe` cross-built from Linux opens on Windows.** One built from a Next.js project opened on Windows 10: its table filled, its origin was `http://lepton.localhost`, and closing it left no WebView2 process behind.
- 0.1.9-beta.0's Windows binary went out before the plugins ran there, and npm takes a version once, so every package moved to beta.1 together.

## 0.1.9-beta.0 *2026-10-19, beta*

Published under the `beta` tag: `npm create lepton-app@beta`, or with pnpm the exact version, `pnpm dlx create-lepton-app@0.1.9-beta.1`. The rest of 0.1.9 (starter screens, WebAssembly, opt-in server rendering) comes before 0.1.9 itself. [What each framework needed](/blog/astro-next-angular/)

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
- **A Windows build from Linux links.** `lepton build --windows` handed the Windows binary the Linux libraries pkg-config found; it is now a 1.1 MB `.exe` that imports only Windows DLLs. It had not been started on Windows at this release; it has since (0.1.9-beta.1).
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

0.2.0 is published as a beta first, then as 0.2.0: a native renderer that draws on the GPU directly, a JavaScript engine for native apps, native UI, and Lepton's own WPE platform, which lets a WPE WebKit page draw its own title bar, move the window and show a native menu. The groundwork so far:

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
- Not yet: native drawing on Windows, MSIX (it needs a code-signing certificate). The plugins came in 0.1.9-beta.1. Unsigned installers get Windows' SmartScreen warning, as other frameworks' do.

## 0.1.6

- `npm create lepton-app` works again: 0.1.5's `create-lepton-app` stopped before creating the project (it read `lepton info --json` in an older shape). 0.1.5 of that package is deprecated on npm.

## 0.1.5

- **`lepton record` and `lepton replay`**: a session's calls to the core, written to a file and run again, with or without the window.
- **The app is one app to the desktop**: its own systemd scope, so task managers show the core and the web engine's processes under its name; the window title follows `document.title`.
- **Web engine features**: the inspector in debug builds (F12), links opened in the desktop's browser, `window.open`, downloads, permission requests and notifications. [Web features](/docs/web-features/)
- **One `lepton` script** in new projects (`pnpm lepton dev`), and `lepton new` asks its questions in colour.
- **Webview builds no longer need WPEBackend-fdo**, which Arch no longer packages; a missing engine is reported with the command your distribution installs it with.
