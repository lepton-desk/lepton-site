---
title: Configuration
description: lepton.config.json, field by field.
---

`lepton.config.json` sits at the project root. `lepton new` writes it:

```json
{
  "$schema": "https://lepton-desk.vercel.app/schema/config.json",
  "productName": "hello-lepton",
  "identifier": "com.you.hello-lepton",
  "version": "0.1.0",
  "renderPath": "webview",
  "target": "react",
  "window": { "title": "hello-lepton", "width": 1200, "height": 800 },
  "permissions": ["app.name"]
}
```

| Field | |
| --- | --- |
| `$schema` | The file's [JSON schema](/schema/config.json) *0.1.9-beta.0*: an editor completes the fields and flags an unknown one. Projects made earlier point at an address that never resolved; `lepton update` moves them. |
| `productName` | What the desktop shows. The binary is named after it in lowercase, with every other run of characters made one `-` (`My App` → `my-app`). |
| `identifier` | The application id, reverse-DNS: `com.<owner>.<app>`, where the owner is who publishes it (a domain's name or yours; `lepton new` asks, defaulting to Git's `user.name`) *0.1.9-beta.2*. It names the desktop entry, window `app_id`, data and state directories (`~/.local/share/<identifier>`, grants in `~/.local/state/<identifier>`), the shared-memory channel and the single running copy, so two apps must never share one. Letters, digits, `.`, `_` and `-`. Changed after `lepton new`, only the desktop entry and package names follow; the window `app_id`, data directories and systemd scope keep the id written into `src-lepton/main.zig`. |
| `version` | Used in package names. Default `0.1.0`. |
| `renderPath` | `webview` (your page in WPE WebKit on Linux, WebView2 on Windows; the default) or `native` (drawn by the core, no web engine). |
| `target` | The framework `lepton new` scaffolded: `vanilla-ts`, `react`, `vue`, `svelte`, `solid`, `preact`, `lit`, `angular`, `astro` or `next`. A record; changing it changes nothing. |
| `window` | Title and initial size. The size is read on every build *0.1.7*; the title is written into `src-lepton/main.zig` and the page by `lepton new`, and at run time the window follows the page's `<title>`. Default 1200×800, titled with `productName`. `"decorations": false` leaves the title bar to the page *0.1.9-beta.2* ([Commands](/docs/commands/#your-own-title-bar-and-menus-019-beta2)). `"frameRate": "unlimited"` lets the native path draw as fast as the machine can instead of at the display's refresh (`"display"`, the default) *0.1.9-beta.2*; `LEPTON_FRAME_RATE=display|unlimited` overrides it when the program runs. On a screen too small for the size, the window is fitted to the work area and centred. |
| `permissions` | The commands the page may call, each by name. No wildcards. |
| `plugins` | Settings for plugins, by the plugin's name, e.g. `plugins.fs.scope`. |
| `deepLinks` | URL schemes the app opens, e.g. `["myapp"]` for `myapp://…` *0.1.9-beta.2*; see below. |
| `webPermissions` | Answers for the web engine's own requests (notifications, camera…): `allow`, `deny` or `ask`. Unlisted kinds are denied. *0.1.5* |
| `bundle` | Package formats and metadata; see [Packaging](/docs/packaging/). |
| `frontend` | Where the build goes and how the dev server is started *0.1.9-beta.0*; see below. Without it a project is a Vite project. |
| `sdkScope`, `channel` | Written by `lepton new` (`@lepton-desk`; the shared-memory channel `/lepton-<identifier>` and its size). The channel name goes into `src-lepton/main.zig` once; changing either here has no effect. |

## `frontend` *0.1.9-beta.0*

Lepton needs two things from a front end: the folder its build writes, and how its dev server takes the port and address `lepton dev` chooses. Without this section they are Vite's: `dist`, and `--port {port} --strict-port --host {host} --clearScreen false`. The Astro, Next.js and Angular templates write their own:

```json
{
  "frontend": {
    "dist": "out",
    "devArgs": ["--port", "{port}", "--hostname", "{host}"]
  }
}
```

| Field | |
| --- | --- |
| `dist` | The build's output folder, inside the project: `dist` for Vite, Astro and Angular, `out` for a Next.js static export. `lepton build`, `run` and `package` install it beside the binary. |
| `devArgs` | The flags after `<manager> run dev`. `{port}` and `{host}` are replaced by the port and address the window loads; both must appear, or the CLI refuses the file. |

A framework without a template works the same way: give its output folder and the flags its dev server takes. The server must stop on a port that is already taken rather than move to another one, because the window has already been told the port.

## `deepLinks` and the single running copy *0.1.9-beta.2*

An application runs once per user. Starting it again — from the launcher, a file manager or a link — hands the new start's arguments to the running copy, which tells its page with the `app.opened` event, and the new start ends. `@lepton-desk/api/app` reads both: `launchArgs()` this start's own, `onOpened(handler)` every later one's.

```json
{ "deepLinks": ["myapp"], "permissions": ["app.args"] }
```

```ts
import { launchArgs, onOpened } from "@lepton-desk/api/app";

const first = await launchArgs();          // ["myapp://open/7"] when a link started the app
await onOpened((args) => route(args[0]));  // a link clicked while it runs
```

On Linux the desktop entry handles the scheme (`MimeType=x-scheme-handler/myapp;`, `Exec … %u`), and `lepton dev`/`run` make it the scheme's default handler unless another application already is. On Windows the MSI registers it for the user (`HKCU\Software\Classes\myapp`). Schemes are lowercase; `http`, `https`, `file`, `mailto` and the like belong to other programs and are refused. Measured on Linux: `xdg-open myapp://open/43` reached the running copy's page and no second window opened; a link started a closed app with the link in `launchArgs()`. The Windows half is built and tested as tables, not yet run on Windows.

## Permissions

A command the page calls must be listed. The list is checked against the registered commands **when the core compiles**: a listed name with no command fails the build, and a call to an unlisted one is answered with `denied`.

```json
{ "permissions": ["app.name", "fs.read_file", "dialog.open"] }
```
