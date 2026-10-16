---
title: Plugins
description: fs, dialog, clipboard and os — npm packages with a Zig half.
---

A plugin is an npm package carrying both halves: TypeScript for the page and Zig for the core. `lepton build`, `run` and `dev` find plugins among the project's dependencies and compile them into the core. Their commands still have to be listed under `permissions`.

```sh
npm create lepton-app@latest my-app -- --plugins fs,dialog
# or later
npm install @lepton-desk/plugin-fs
```

The function names follow Tauri's plugins, so moving code over is mostly an import change.

## `@lepton-desk/plugin-fs`

`readTextFile`, `writeTextFile`, `readFile`, `writeFile`, `readDir`, `mkdir`, `remove`, `stat`, `exists`, `BaseDirectory`.

```json
{
  "permissions": ["fs.read_file", "fs.write_file", "fs.mkdir"],
  "plugins": { "fs": { "scope": ["$APPDATA", "$DOCUMENT/notes"] } }
}
```

A scope entry is a base directory — `$APPDATA` `$APPCONFIG` `$APPCACHE` `$HOME` `$DOCUMENT` `$DOWNLOAD` `$DESKTOP` `$PICTURE` `$MUSIC` `$VIDEO` — optionally followed by names below it. No wildcards, no `..`. Without a scope every path is refused.

## `@lepton-desk/plugin-dialog`

`open(options)` and `save(options)`, drawn by the desktop through xdg-desktop-portal, so the dialog looks like the rest of the desktop. Each resolves with the chosen path(s) or `null`.

```json
{ "permissions": ["dialog.open", "dialog.save"] }
```

## `@lepton-desk/plugin-clipboard`

`writeText(text)` and `readText()`. Wayland only tells a focused window what the selection is, so both wait for focus; pass `{ signal }` to stop waiting.

```json
{ "permissions": ["clipboard.read_text", "clipboard.write_text"] }
```

## `@lepton-desk/plugin-os`

`platform()`, `arch()`, `family()`, `version()`, `hostname()`, `locale()`, `exeExtension()`.

```json
{ "permissions": ["os.platform", "os.arch", "os.locale"] }
```

In a **native** (non-webview) app the dialog and clipboard commands reject with `failed`.
