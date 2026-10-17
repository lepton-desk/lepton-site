---
title: The CLI
description: Every lepton command and its options.
---

`lepton` is a single native binary written in Rust. The npm package `@lepton-desk/cli` only launches it; there is no postinstall and no download. In a project, run it through the `lepton` script: `npm run lepton <command> -- <flags>`, `pnpm lepton <command> <flags>`.

| Command | What it does |
| --- | --- |
| `lepton info` | Reports what this machine can build and what is missing. `--json` for scripts. |
| `lepton new [name]` | Creates a project and wires Lepton into it. |
| `lepton dev` | The development loop: Vite with hot reload, the core, the window. |
| `lepton run` | Builds once and opens the app, reading the front end from disk. |
| `lepton build` | A release build. |
| `lepton package` | A release laid out as an installable tree, then each package format. |
| `lepton record` | Opens the app and records every command the page calls. *0.1.5* |
| `lepton replay <file>` | Runs a recording against the core again and compares the replies. *0.1.5* |

## `lepton new`

| Option | |
| --- | --- |
| `-t, --template <name>` | `vanilla-ts`, `vanilla-js`, `react-ts`, `react-js`, `vue-ts`, `svelte-ts`, `solid-ts` |
| `--target <native\|webview>` | How the app renders. Without it the wizard asks; `--non-interactive` takes `native`. |
| `--plugins <list>` | Plugins to add, comma-separated: `os`, `clipboard`, `fs`, `dialog`. Every command of each is added to `permissions` (trim the list to what you use), and `fs` gets `$APPDATA` as its scope. |
| `--package-manager <name>` | `npm`, `pnpm`, `yarn` or `bun`. Without it: the one that started `lepton`, else pnpm if installed, else npm. Later commands follow the project: its `packageManager` field, then its lockfile. |
| `--install` | Install dependencies after creating. |
| `--identifier <id>` | The application identifier (desktop entry, data directories). |
| `--width`, `--height` | Initial window size, in physical pixels. Default 1200×800. |
| `--directory <dir>` | Where to create the project. |
| `--non-interactive` | Ask nothing. |
| `--verbose` | List every file written, and the channel name. |

## `lepton dev`

| Option | |
| --- | --- |
| `-p, --port <port>` | Vite's port, 5173 by default. |
| `--native` | Run the native render path. |
| `--no-server` | Open the window against a server you already started on `--port`. |
| `--print-plan` | Print the steps instead of running them. |

## `lepton build`

`--native` / `--webview` choose the render path; `--servo` links the experimental Servo engine instead of WebKit (with `--linux`); `-n, --dry-run` prints the plan. `--windows` and `--macos` cross-compile the native render path with Zig (`x86_64-windows-gnu`, `aarch64-macos`); the webview path is Linux only, and neither result has been tested on those systems yet.

`dev` and `run` also write `~/.local/share/applications/<identifier>.desktop`, so the dock matches the window to its name; they never overwrite an entry Lepton did not write.

## `lepton run`

`--native` / `--webview`, `--release` for the optimised core, `--print-plan`.

## `lepton package`

`--native` / `--webview`, `--no-build` to package the last build, and `--verify`: each written package is unpacked into an empty directory, started, measured and closed, and the command fails if it does not start or leaves a process behind.

## `lepton record` and `lepton replay` *0.1.5*

`lepton record -o session.lrec` writes every request, reply and event. Private commands (file contents, the clipboard, chosen paths) keep only their frame headers unless `--unmasked`. `lepton replay session.lrec` runs the recording through the real handlers with no window and exits `1` if a reply differs; `--page` opens the window and answers the page's calls from the recording instead.

Without `-o` the file is `recording-<unix seconds>.lrec` in the project. `replay` runs with `HOME` and `XDG_*` pointed at an empty temporary directory, so it cannot touch your files. Both take `--release` (the optimised core) and `--print-plan`.
