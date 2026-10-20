---
title: The CLI
description: Every lepton command and its options.
---

`lepton` is a single native binary written in Rust. The npm package `@lepton-desk/cli` only launches it; there is no postinstall and no download. In a project, run it through the `lepton` script: `npm run lepton <command> -- <flags>`, `pnpm lepton <command> <flags>`.

| Command | What it does |
| --- | --- |
| `lepton info` | Reports what this machine can build and what is missing, and for a missing web engine the command your distribution installs it with. `--json` for scripts. |
| `lepton new [name]` | Creates a project and wires Lepton into it. |
| `lepton dev` | The development loop: the front end's dev server with hot reload, the core, the window. |
| `lepton run` | Builds once and opens the app, reading the front end from disk. |
| `lepton build` | A release build. |
| `lepton package` | A release laid out as an installable tree, then each package format. |
| `lepton record` | Opens the app and records every command the page calls. *0.1.5* |
| `lepton replay <file>` | Runs a recording against the core again and compares the replies. *0.1.5* |
| `lepton update` | Brings an existing project's core and `src-lepton/` files to this version, keeping your edits. *0.1.7* |

On a terminal the output is coloured *0.1.7*: each step is framed with how long it took, and the tools Lepton runs (Vite, pnpm, npm, Zig) keep their own colours. `NO_COLOR` or a pipe gives plain text, for logs and CI.

## `lepton new`

| Option | |
| --- | --- |
| `-t, --template <name>` | `<framework>-<language>`: `vanilla`, `react`, `vue`, `svelte`, `solid`, `preact`, `lit`, `astro` and `next`, each `-ts` or `-js`, and `angular-ts`. Preact, Lit and the JavaScript forms of Vue, Svelte and Solid *0.1.9-beta.0*; Astro, Next.js and Angular too, with their own `frontend` section ([Configuration](/docs/configuration/#frontend-019-beta0)). |
| `--target <native\|webview>` | How the app renders. Without it the wizard asks; `--non-interactive` takes `native`. |
| `--plugins <list>` | Plugins to add, comma-separated: `os`, `clipboard`, `fs`, `dialog`. Every command of each is added to `permissions` (trim the list to what you use), and `fs` gets `$APPDATA` as its scope. |
| `--package-manager <name>` | `npm`, `pnpm`, `yarn` or `bun`. Without it: the one that started `lepton`, else pnpm if installed, else npm. Later commands follow the project: its `packageManager` field, then its lockfile. |
| `--install` | Install dependencies after creating. |
| `--identifier <id>` | The application identifier (desktop entry, data directories). Without it: `com.<owner>.<name>`. |
| `--owner <name>` | Who publishes the app, the middle of `com.<owner>.<name>` *0.1.9-beta.2*. Without it the wizard asks, defaulting to Git's `user.name`, else `example`. |
| `--width`, `--height` | Initial window size, in physical pixels. Default 1200×800. |
| `--directory <dir>` | Where to create the project. |
| `--non-interactive` | Ask nothing. |
| `--verbose` | List every file written, and the channel name. |

## `lepton dev`

| Option | |
| --- | --- |
| `-p, --port <port>` | The dev server's port, 5173 by default. |
| `--native` | Run the native render path. |
| `--no-server` | Open the window against a server you already started on `--port`. |
| `--print-plan` | Print the steps instead of running them. |

The dev server is started with the project's `frontend.devArgs` (Vite's flags without them). *0.1.9-beta.0* The window opens only once the server accepts a connection; a server that stops first, for instance on a taken port, is reported with its exit status. Before, a core that came from the build cache could open the window before the server listened, and the page then stayed at origin `null` with every call to the core refused.

## `lepton build`

`--native` / `--webview` choose the render path; `-n, --dry-run` prints the plan. `--servo` (with `--linux`) renders the page in Servo instead of WPE WebKit, **experimental** *0.1.9-beta.2*: install its library with `npm install -D @lepton-desk/servo-linux-x64@beta` (or set `LEPTON_SERVO_LIB` to a directory holding one); without it the build is refused with that reason. Servo has no keyboard input in Lepton yet. `--windows` and `--macos` cross-compile with Zig (`x86_64-windows-gnu`, `aarch64-macos`). From Linux, `--windows` builds the webview path for WebView2 *0.1.9-beta.0*: a 1.1 MB `.exe` that imports only Windows' own DLLs; one built from a Next.js project opened on Windows 10 and its page reached the core *0.1.9-beta.1*; the native path does not run on Windows yet, and the macOS result has not been tested.

`dev` and `run` also write `~/.local/share/applications/<identifier>.desktop`, so the dock matches the window to its name; they never overwrite an entry Lepton did not write.

## `lepton run`

`--native` / `--webview`, `--release` for the optimised core, `--print-plan`.

## `lepton package`

`--native` / `--webview`, `--no-build` to package the last build, and `--verify`: each written package is unpacked into an empty directory, started, measured and closed, and the command fails if it does not start or leaves a process behind.

## `lepton record` and `lepton replay` *0.1.5*

`lepton record -o session.lrec` writes every request, reply and event. Private commands (file contents, the clipboard, chosen paths) keep only their frame headers unless `--unmasked`. `lepton replay session.lrec` runs the recording through the real handlers with no window and exits `1` if a reply differs; `--page` opens the window and answers the page's calls from the recording instead.

Without `-o` the file is `recording-<unix seconds>.lrec` in the project. `replay` runs with `HOME` and `XDG_*` pointed at an empty temporary directory, so it cannot touch your files. Both take `--release` (the optimised core) and `--print-plan`.

`--page --close` *0.1.7* ends the run by itself once the recording has been played, so a recording can be a test: 1.5 s after the last recorded call (a call more in that time counts as diverged), or 10 s past the recording's length when calls are missing. Exit `0` when the page made the same calls with the same arguments.

## `lepton update` *0.1.7*

Only `lepton new` writes the core into a project, so fixes made later reach an existing project through this command. It replaces `src-lepton/vendor/lepton-core` and brings `main.zig`, `build.zig` and `lepton-commands.zig` up to the current template:

- a file you never edited is replaced;
- an edited one is merged three ways — the release it was made from, your file, today's template — so your commands and state stay;
- where your edit and the template's change touch the same lines, nothing is written: `main.zig.merge` holds both with conflict markers, and you resolve it and run `lepton update` again.

*0.1.8* It starts with the packages: it asks the registry for the newest `@lepton-desk/cli` (or takes `--to <version>`; a beta CLI also asks for the newest beta *0.1.9-beta.0*), moves the project's `@lepton-desk/*` dependencies to it (a `link:`, `file:` or `workspace:` one is left alone) and installs with the project's own package manager, so the lockfile follows. When that release is newer than the CLI that is running, the newly installed CLI finishes the job, because the core and templates it writes are its own. So `pnpm lepton update` is all a project needs. `--no-install` leaves package.json alone and updates only the core and templates. A React project whose `tsconfig.json` lacks `"jsx"` (react-ts projects made before 0.1.7) gets it, and a `lepton.config.json` whose `$schema` points at the old address is moved to the new one.

A project made before 0.1.8 runs the old CLI, which does not move its packages yet (0.1.6 has no `update` at all). Once, run the newest CLI from the registry instead: `npx @lepton-desk/cli@latest update`, `lepton-desk update` on Arch, or with pnpm the exact version, `pnpm dlx @lepton-desk/cli@0.1.8 update`. With pnpm, `@latest` is not enough on a release's first day: pnpm skips versions younger than its `minimumReleaseAge` and ran 0.1.6 instead (measured).

With pnpm 11 or newer, a release younger than a day is installed only because pnpm's `minimumReleaseAge` allows exceptions; pnpm adds them to `pnpm-workspace.yaml` itself. With `minimumReleaseAgeStrict` on, it holds the release back and `lepton update` says so.

`--dry-run` says what would change. Then `lepton build`.
