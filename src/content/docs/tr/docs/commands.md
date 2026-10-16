---
title: Komutlar ve olaylar
description: Sayfadan Zig çağırmak ve olayları geri göndermek.
---

## Komutlar

Bir komut, `src-lepton/main.zig` içindeki bir Zig fonksiyonudur. Uygulama durumunuzu, istek baytlarını ve yanıt için bir arabelleği alır; kaç bayt yazdığını döndürür.

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

`lepton.config.json` içinde `permissions` altında listeleyin, sonra sayfadan çağırın:

```ts
import { invoke } from "@lepton-desk/api/core";

const bytes = await invoke("app.name");
const name = new TextDecoder().decode(bytes);
```

`invoke(komut, args?, options?)` bir `Uint8Array` ile çözülür. `args` bir `Uint8Array` ya da `ArrayBuffer`'dır; `options.signal` isteği iptal eder. Reddedilen ya da başarısız bir çağrı `InvokeError` fırlatır; `reason` durumu adlandırır: komut `permissions`'ta yoksa `denied`, ayrıca `unknown_command`, `too_large` ya da `no_reply`.

Sayfa ve çekirdek JSON değil **ikili çerçeveler** alışverişi yapar: `invoke`, `lepton://localhost/__lepton/invoke` adresine tek bir istek çerçevesi gönderir ve yanıt çerçevesi cevaptır. Her derleme `src/lepton-commands.d.ts` dosyasını yeniden üretir, böylece komut adları tiplidir.

## Olaylar

Çekirdeğin gönderebileceği olayları bildirin:

```zig
pub const events = core.webviewEvents.Declared(&.{ "notes.saved" });
```

Zig'den gönderin (bildirilmemiş bir ad derlenmez):

```zig
_ = try events.emit(&view.bridge, "notes.saved", bytes);
```

ve sayfada dinleyin:

```ts
import { listen } from "@lepton-desk/api/event";

const stop = await listen("notes.saved", (event) => {
  // event.payload: çekirdeğin gönderdiği baytlar
});
```

Çekirdek ayrıca `window.state` ve `window.resized` gönderir; pencereyi `@lepton-desk/api/window` yönetir.
