---
title: Configuration
description: lepton.config.json, field by field.
---

`lepton.config.json` sits at the project root. `lepton new` writes it:

```json
{
  "productName": "hello-lepton",
  "identifier": "hello-lepton",
  "version": "0.1.0",
  "renderPath": "webview",
  "target": "react",
  "window": { "title": "hello-lepton", "width": 1200, "height": 800 },
  "permissions": ["app.name"]
}
```

| Field | |
| --- | --- |
| `productName` | What the desktop shows. The binary is named after it in lowercase, with every other run of characters made one `-` (`My App` → `my-app`). |
| `identifier` | The application id: desktop entry, window `app_id`, data directories (`~/.local/share/<identifier>`). Changed after `lepton new`, only the desktop entry and package names follow; the window `app_id`, data directories and systemd scope keep the id written into `src-lepton/main.zig`. |
| `version` | Used in package names. Default `0.1.0`. |
| `renderPath` | `webview` (your page in WPE WebKit, the default) or `native` (drawn by the core, no web engine). |
| `target` | The frontend `lepton new` scaffolded: `vanilla-ts`, `react`, `vue`, `svelte`, `solid`. A record; changing it changes nothing. |
| `window` | Title and initial size, written into `src-lepton/main.zig` and `index.html` by `lepton new`; editing them here afterwards has no effect. Default 1200×800, titled with `productName`. At run time the window follows the page's `<title>`. |
| `permissions` | The commands the page may call, each by name. No wildcards. |
| `plugins` | Settings for plugins, by the plugin's name, e.g. `plugins.fs.scope`. |
| `webPermissions` | Answers for the web engine's own requests (notifications, camera…): `allow`, `deny` or `ask`. Unlisted kinds are denied. *0.1.5* |
| `bundle` | Package formats and metadata; see [Packaging](/docs/packaging/). |
| `sdkScope`, `channel` | Written by `lepton new` (`@lepton-desk`; the shared-memory channel `/lepton-<identifier>` and its size). The channel name goes into `src-lepton/main.zig` once; changing either here has no effect. |

## Permissions

A command the page calls must be listed. The list is checked against the registered commands **when the core compiles**: a listed name with no command fails the build, and a call to an unlisted one is answered with `denied`.

```json
{ "permissions": ["app.name", "fs.read_file", "dialog.open"] }
```
