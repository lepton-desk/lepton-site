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
| `--plugins <list>` | Plugins to add, comma-separated: `os`, `clipboard`, `fs`, `dialog`. |
| `--package-manager <name>` | `npm`, `pnpm`, `yarn` or `bun`. |
| `--install` | Install dependencies after creating. |
| `--identifier <id>` | The application identifier (desktop entry, data directories). |
| `--width`, `--height` | Initial window size. |
| `--directory <dir>` | Where to create the project. |
| `--non-interactive` | Ask nothing. |

## `lepton dev`

| Option | |
| --- | --- |
| `-p, --port <port>` | Vite's port. |
| `--native` | Run the native render path. |
| `--no-server` | Don't start Vite. |
| `--keep-open` | Keep running after the window closes. |
| `--print-plan` | Print the steps instead of running them. |

## `lepton build`

`--native` / `--webview` choose the render path; `--servo` links the experimental Servo engine instead of WebKit (with `--linux`); `-n, --dry-run` prints the plan.

## `lepton run`

`--native` / `--webview`, `--release` for the optimised core, `--print-plan`.

## `lepton package`

`--native` / `--webview`, `--no-build` to package the last build, and `--verify`: each written package is unpacked into an empty directory, started, measured and closed, and the command fails if it does not start or leaves a process behind.

## `lepton record` and `lepton replay` *0.1.5*

`lepton record -o session.lrec` writes every request, reply and event. Private commands (file contents, the clipboard, chosen paths) keep only their frame headers unless `--unmasked`. `lepton replay session.lrec` runs the recording through the real handlers with no window and exits `1` if a reply differs; `--page` opens the window and answers the page's calls from the recording instead.
