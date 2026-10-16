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
| `productName` | The binary's name and what the desktop shows. |
| `identifier` | The application id: desktop entry, window `app_id`, data directories (`~/.local/share/<identifier>`). |
| `version` | Used in package names. |
| `renderPath` | `webview` (your page in WPE WebKit) or `native` (drawn by the core, no web engine). |
| `window` | Title and initial size. The page's `<title>` follows. |
| `permissions` | The commands the page may call, each by name. No wildcards. |
| `plugins` | Settings for plugins, by the plugin's name, e.g. `plugins.fs.scope`. |
| `webPermissions` | Answers for the web engine's own requests (notifications, camera…): `allow`, `deny` or `ask`. Unlisted kinds are denied. *0.1.5* |
| `bundle` | Package formats and metadata; see [Packaging](/docs/packaging/). |

## Permissions

A command the page calls must be listed. The list is checked against the registered commands **when the core compiles**: a listed name with no command fails the build, and a call to an unlisted one is answered with `denied`.

```json
{ "permissions": ["app.name", "fs.read_file", "dialog.open"] }
```
