---
title: Web features
description: What the engine offers a page beyond drawing it — downloads, permissions, notifications, links, the inspector. New in 0.1.5.
---

*0.1.5* — WebKit leaves each of these to the embedder and refuses when nobody answers. Lepton answers them; this page says how.

## Downloads

A download goes to the user's download directory (`XDG_DOWNLOAD_DIR`, e.g. `~/Downloads` or `~/İndirilenler`) under the name the server suggested, made safe: only its last path element, no control characters, never hidden (a leading `.` becomes `_`), and made unique when the file exists. No permission is needed to listen:

```ts
import { onDownload } from "@lepton-desk/api/download";

const stop = await onDownload((event) => {
  if (event.kind === "progress") console.log(event.received, event.expected);
  if (event.kind === "finished") console.log("saved to", event.path);
});
```

`kind` is `started` (with `name`), `progress` (`received`, and `expected`, which is 0 when the server did not say — at most four a second), `finished` (`path`) or `failed` (`message`). Every event carries the download's `id`.

## Permissions the page asks for

Notifications, camera, location and the rest are decided by `webPermissions` in `lepton.config.json`. A kind not listed is denied.

```json
"webPermissions": { "notifications": "allow", "camera": "ask" }
```

The kinds: `notifications`, `camera`, `microphone`, `geolocation`, `pointer-lock`, `device-info`, `media-keys`, `storage-access`, `xr`.

`allow` and `deny` answer at once and never reach your code; `navigator.permissions.query` reports them as `granted` and `denied` (`ask` as `prompt`). With `ask`, the request comes to the page so you can ask in your own interface:

```ts
import { onPermissionRequest } from "@lepton-desk/api/permission";

await onPermissionRequest(async ({ kinds }) => confirm(`Allow ${kinds.join(" and ")}?`));
```

Answering is the built-in command `permission.respond`, so list it under `permissions`. A request nobody answers is denied after a minute. A page asking for camera and microphone at once gets one request with both kinds.

## Notifications

With `notifications` allowed, `new Notification(title, { body })` reaches the desktop through `org.freedesktop.Notifications`, under the application's name and desktop entry.

## Storage and cookies *0.1.9-beta.2*

`localStorage`, `sessionStorage` and IndexedDB keep the page's data in the application's own data folder (`$APPDATA`), apart from every other application, and it is still there at the next start (measured on WPE WebKit and Servo).

A packaged page is served from `lepton://localhost/`, and both Linux engines give a page on a scheme other than http(s) no cookies, as the HTML standard says they should: `document.cookie` reads `""` and drops what is written. Lepton defines `document.cookie` for that page itself, kept in `localStorage` under `__lepton.cookies`: `Max-Age`, `Expires`, deleting with `Max-Age=0` and `Path` work as in a browser; a script cannot set an `HttpOnly` cookie, and a `Domain` other than `localhost` is refused, as in a browser. The cookies are the page's alone: requests do not carry them, and `localStorage.clear()` clears them too. A page from the dev server and every page on Windows (`http://lepton.localhost`) have the engine's own cookies.

## Links and new windows

A web link the user clicks — `http(s)` to any host other than `localhost`, `127.0.0.1` or `[::1]`, or `mailto:`, `tel:` and other schemes — opens in the desktop's default application through the `OpenURI` portal; the window stays on your page. `window.open` follows the same rule: an outside address goes to the desktop and returns `null`, the application's own page opens a second window on the same engine, which can call the core like the first.

## Frames inside your page

Only your application's own page gets `__lepton` and this run's key; a frame inside it gets neither. A frame on your page's origin can still read its parent, as same-origin frames can anywhere on the web: an `<iframe srcdoc>`, an `about:blank` frame your script fills, or another of your own pages. Such a frame takes the key from `parent.__lepton` and calls the core with your page's rights. `permissions` still apply to it. Measured on WPE WebKit: a `srcdoc` frame and an `about:blank` frame each read the key, ran `app.args` (`ok`) and got `denied` for `window.title`, which the app's `permissions` did not list.

Put content you do not fully trust in `<iframe sandbox="allow-scripts">`, without `allow-same-origin`. The frame then has an opaque origin: reading `parent.__lepton` throws `SecurityError`, and it never gets the key (measured). With `allow-same-origin` added it has your page's rights again. Measured on WPE WebKit only; WebView2 and Servo are not measured yet.

## The Web Inspector

In debug builds — `lepton dev` and `lepton run` without `--release` — F12 or Ctrl+Shift+I opens WebKit's inspector. Release builds (`lepton build`, `lepton package`) leave it out.

## The window and the system

- The window's title follows the page's `document.title`.
- Before the engine starts, the application moves into its own systemd scope, `app-<identifier>-<pid>.scope`, so a system monitor shows it and its WebKit processes as one application, named by its desktop entry. Started from a launcher that already made one, nothing changes.

## On Windows *0.1.9-beta.0*

The same configuration and the same page code work under WebView2; what differs is who answers. `webPermissions` is applied to WebView2's permission requests (`ask` comes to the page the same way), an allowed `new Notification()` is shown by WebView2 itself, downloads go to the user's Downloads folder with the same `download.*` events, and `window.open` for the app's own page opens a second window that can call the core. Debug builds have WebView2's developer tools, its context menu and its browser keys; release builds turn them off. Lepton's systemd scope is Linux's: on Windows the engine's processes are already the app's children.
