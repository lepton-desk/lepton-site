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

`readTextFile`, `writeTextFile`, `readFile`, `writeFile`, `readDir`, `mkdir`, `remove`, `rename` *0.1.5*, `stat`, `exists`, `BaseDirectory`. Each command is `fs.` plus its name in snake case: `fs.read_file` (both read functions), `fs.write_file`, `fs.read_dir`, `fs.mkdir`, `fs.remove`, `fs.rename`, `fs.stat`, `fs.exists`.

```json
{
  "permissions": ["fs.read_file", "fs.write_file", "fs.mkdir"],
  "plugins": { "fs": { "scope": ["$APPDATA", "$DOCUMENT/notes"] } }
}
```

A scope entry is a base directory — `$APPDATA` `$APPCONFIG` `$APPCACHE` `$HOME` `$DOCUMENT` `$DOWNLOAD` `$DESKTOP` `$PICTURE` `$MUSIC` `$VIDEO` — optionally followed by names below it. No wildcards, no `..`. Without a scope every path is refused. The user directories come from `user-dirs.dirs`; on a Turkish desktop `$DOCUMENT` is `~/Belgeler`.

Every path is opened with the kernel's `RESOLVE_BENEATH`, so a symbolic link inside an allowed directory cannot lead out of it; a path outside the scope rejects with `denied`, and so does `exists` — answering `false` would tell the page what is where it may not look.

- `writeFile(path, data, { append: true })` adds to the end; `mkdir(path, { recursive: true })` makes missing parents.
- `remove(path, { recursive: true })` removes a directory with everything in it; links inside are removed, not followed. *0.1.5*
- `rename(from, to)` stays inside one scope directory and replaces an existing `to` in one step. *0.1.5*
- One call carries at most 64 KiB. `readFile` reads a larger file in pieces; `writeFile` writes it in pieces under `<name>.lepton-save` and renames it over the old file, so a write cut short leaves the old file whole. *0.1.5*

With `"chosen": true` in the `fs` settings, what the user picks in `@lepton-desk/plugin-dialog` joins the scope and is remembered across runs: a chosen folder with everything in it, a chosen file by itself. *0.1.5*

```json
"plugins": { "fs": { "scope": ["$APPDATA"], "chosen": true } }
```

## `@lepton-desk/plugin-dialog`

`open(options)` and `save(options)`, drawn by the desktop through xdg-desktop-portal, so the dialog looks like the rest of the desktop. Each resolves with the chosen path(s), or `null` when the user cancels; the promise stays pending as long as the dialog is open.

```ts
import { open, save } from "@lepton-desk/plugin-dialog";

const files = await open({ multiple: true, filters: [{ name: "Text", extensions: ["txt", "md"] }] });
const folder = await open({ directory: true, title: "Pick a folder" });
const target = await save({ defaultName: "notes.md", acceptLabel: "Export" });
```

Both take `title`, `defaultPath`, `filters`, `acceptLabel` and `signal`; `open` also `multiple` and `directory`, `save` also `defaultName`. A chosen path is readable through plugin-fs only inside its scope, or with `chosen` (above).

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

## Writing a plugin

A plugin is an npm package whose `package.json` points at its Zig file:

```json
"lepton": { "plugin": "zig/plugin.zig", "settings": "myplugin" }
```

`plugin.zig` exports its commands. They take no app state — only the request bytes and the reply buffer:

```zig
const core = @import("lepton_core");
const Registry = core.webviewRegistry;

pub const commands = [_]Registry.PluginCommand{
    .{ .name = "myplugin.hello", .run = &hello },
};

fn hello(_: []const u8, out: []u8) Registry.HandlerError!usize {
    const text = "hello";
    if (text.len > out.len) return error.TooLarge;
    @memcpy(out[0..text.len], text);
    return text.len;
}
```

The TypeScript half calls them with `invoke` from `@lepton-desk/api/core` (a peer dependency). Ship `zig/` in the package's `files`. The application still lists each command under `permissions`.

- `settings` names the plugin's section in `lepton.config.json` (`plugins.myplugin`); the core reads it at compile time with `core.pluginConfig`.
- `pub const private = .{ "myplugin.secret" };` keeps a command's bytes out of [`lepton record`](/docs/cli/) recordings.
