---
title: Commands and events
description: Calling Zig from the page, and sending events back.
---

## Commands

A command is a Zig function in `src-lepton/main.zig`. It receives your app state, the request bytes and a buffer for the reply, and returns how many bytes it wrote.

```zig
pub const commands = core.webviewRegistry.checkedWith(
    AppState,
    &.{
        .{ .name = "app.name", .run = &appName },
    },
    core.webviewRegistry.pluginCommands(@import("lepton_plugins").all),
    core.webviewRegistry.permissionList(@import("build_options").permissions),
);

fn appName(state: *AppState, _: []const u8, out: []u8) core.webviewRegistry.HandlerError!usize {
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

The page and the core exchange **binary frames**, not JSON: `invoke` posts one request frame to `lepton://localhost/__lepton/invoke` and the reply frame is the response. Every build regenerates `src/lepton-commands.d.ts`, so the command names are typed.

## Events

Declare the events the core may send:

```zig
pub const events = core.webviewEvents.Declared(&.{ "notes.saved" });
```

emit one from Zig — an undeclared name does not compile —

```zig
_ = try events.emit(&view.bridge, "notes.saved", bytes);
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
| `permission.respond` | Answers a `permission.request` *0.1.5* |

`@lepton-desk/api/window` wraps the window commands:

```ts
import { close, minimize, toggleMaximize, state, onStateChanged, onResized } from "@lepton-desk/api/window";

await toggleMaximize(); // needs window.state, window.maximize and window.unmaximize
const { maximized, fullscreen, active } = await state();
await onResized(({ width, height }) => console.log(width, height)); // logical pixels
```

Listening to `window.state` and `window.resized` needs no permission.
