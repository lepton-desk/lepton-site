---
title: Commands and events
description: Calling Zig from the page, and sending events back.
---

## Commands

A command is a Zig function in `src-lepton/main.zig`. It receives your app state, the request bytes and a buffer for the reply, and returns how many bytes it wrote.

```zig
pub const commands = core.commands.checkedWith(
    AppState,
    &.{
        .{ .name = "app.name", .run = &appName },
    },
    core.commands.pluginCommands(@import("lepton_plugins").all),
    core.commands.permissionList(@import("build_options").permissions),
);

fn appName(state: *AppState, _: []const u8, out: []u8) core.commands.HandlerError!usize {
    if (state.product.len > out.len) return error.TooLarge;
    @memcpy(out[0..state.product.len], state.product);
    return state.product.len;
}
```

List it under `permissions` in `lepton.config.json`, then call it from the page:

```ts
import { invoke } from "@lepton-desk/api/core";

const bytes = await invoke("app.name");
const name = new TextDecoder().decode(bytes);
```

`invoke(command, args?, options?)` resolves with a `Uint8Array`. `args` is a `Uint8Array` or an `ArrayBuffer`; `options.signal` aborts the request. A refused or failed call rejects with `InvokeError`, whose `reason` names the status: `denied` when `permissions` does not list the command, `unknown_command`, `too_large` (the reply did not fit), `malformed` (the request frame or its argument was not what the command reads), `failed` (the handler returned an error), or `no_reply` (no reply frame arrived).

The page and the core exchange **binary frames**, not JSON: `invoke` posts one request frame to `lepton://localhost/__lepton/invoke` (on Windows `http://lepton.localhost/__lepton/invoke`, since WebView2 takes no custom scheme without Microsoft's loader) and the reply frame is the response. Every build regenerates `src/lepton-commands.d.ts`, so the command names are typed.

## Events

Declare the events the core may send:

```zig
pub const events = core.events.Declared(&.{ "notes.saved" });
```

emit one from Zig — an undeclared name does not compile —

```zig
_ = try events.emit(view.bridge.eventTarget(), "notes.saved", bytes);
```

and listen in the page:

```ts
import { listen } from "@lepton-desk/api/event";

const stop = await listen("notes.saved", (event) => {
  // event.payload: the bytes the core emitted
});
```

The core sends its own events too: `window.state`, `window.resized`, `download.started`, `download.progress`, `download.finished`, `download.failed` and `permission.request` (see [Web features](/docs/web-features/)).

## Built-in commands

The core has its own commands. Like yours, each works only when `permissions` lists it.

| Command | |
| --- | --- |
| `core.ping` | Replies with its argument. |
| `core.protocol` | Replies with the wire protocol version (`u32`, little-endian). |
| `window.close` | Asks the application to close, as the titlebar's close button does. |
| `window.minimize`, `window.maximize`, `window.unmaximize` | As named. On Wayland only the user can restore a minimized window. |
| `window.state` | The state bits: maximized, fullscreen, focused. |
| `window.start_drag` | Moves the window with the pointer, from a press on the page's own title bar *0.1.9-beta.2* |
| `window.menu` | Shows a native menu at the pointer and answers with the chosen item *0.1.9-beta.2* |
| `app.args` | The arguments the app was started with, and those later starts handed on (the last 8). In a new project's permissions; masked in recordings *0.1.9-beta.2* |
| `permission.respond` | Answers a `permission.request` *0.1.5* |

`@lepton-desk/api/window` wraps the window commands:

```ts
import { close, minimize, toggleMaximize, state, onStateChanged, onResized } from "@lepton-desk/api/window";

await toggleMaximize(); // needs window.state, window.maximize and window.unmaximize
const { maximized, fullscreen, active } = await state();
await onResized(({ width, height }) => console.log(width, height)); // logical pixels
```

Listening to `window.state` and `window.resized` needs no permission.

## Your own title bar and menus *0.1.9-beta.2*

With `"window": { "decorations": false }` the system draws no title bar and the page draws its own. `dragRegion` makes an element the bar: a press on it (not on a button, link or field inside) moves the window, a double click maximizes or restores it. `popupMenu` shows a native menu at the pointer and resolves with the chosen `id`, or `null` when the menu was dismissed.

```ts
import { dragRegion, popupMenu } from "@lepton-desk/api/window";

dragRegion(document.querySelector("header")!);          // needs window.start_drag
addEventListener("contextmenu", async (event) => {
  event.preventDefault();
  const chosen = await popupMenu([                       // needs window.menu
    { id: 1, label: "Copy" },
    { id: 2, label: "Paste", disabled: true },
    { separator: true },
    { id: 3, label: "Line numbers", checked: true },
  ]);
});
```

**The application's name in the bar** *0.1.9-beta.3*. `info()` (`@lepton-desk/api/app`) is `productName`, `version` and `identifier` from `lepton.config.json`; `title()` (`@lepton-desk/api/window`) is the window's name — the page's `document.title`, or `window.title` while the page has none, the rule the system title bar follows too — and `onTitleChanged` calls back when it changes. `info()` needs no permission and no waiting: the core writes it into the page before its scripts run. The window's name is kept by the core, whatever the engine: `title()` asks for it and needs `window.title` under `permissions`; `onTitleChanged` listens to the core's `window.title` event, which needs none.

```ts
import { info } from "@lepton-desk/api/app";
import { onTitleChanged, title } from "@lepton-desk/api/window";

const label = document.querySelector("header span")!;
const show = (name: string) => (label.textContent = `${info().name} — ${name}`);
await onTitleChanged(show);
show(await title());
```

Measured on Linux in WPE and Servo: the bar showed "Ad Test 2.3.4 — Ad Penceresi", then "Belge 1" after `document.title = "Belge 1"`, then the configured title again when it was cleared.

The menu closes, choosing nothing, on Escape, a press outside it, or when the app loses the focus. Where each part works:

| | Windows (WebView2) | Linux, Servo | Linux, WPE WebKit |
| --- | --- | --- | --- |
| `decorations: false` | yes; resize borders, shadow and snap stay | yes | not yet: the title bar stays |
| `dragRegion` / `window.start_drag` | yes, and CSS `app-region: drag` | yes | not yet (`failed`) |
| `popupMenu` / `window.menu` | the system's menu | Lepton's menu | not yet (`failed`) |
| Title bar follows the page | dark or light from `color-scheme` and `theme-color` (measured on Windows 10); on Windows 11 the bar takes the colour itself (measured on Windows Server 2025, build 26100: `#ffd700` drew an `rgb(255, 215, 0)` bar with black text) | no | no |

On Windows the title bar follows the page with nothing to configure: `<meta name="theme-color">` and CSS `color-scheme`, as they change. On Linux the compositor draws the title bar and offers no way to colour it (measured on COSMIC). WPE WebKit's own Wayland platform cannot leave the frame to the page or move the window for it; Lepton's own WPE platform, which will, is planned for 0.2.0.
