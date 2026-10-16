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

`invoke(command, args?, options?)` resolves with a `Uint8Array`. `args` is a `Uint8Array` or an `ArrayBuffer`; `options.signal` aborts the request. A refused or failed call rejects with `InvokeError`, whose `reason` names the status: `denied` when `permissions` does not list the command, `unknown_command`, `too_large`, or `no_reply`.

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

The core also sends `window.state` and `window.resized`; `@lepton-desk/api/window` controls the window.
