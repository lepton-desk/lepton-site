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

`invoke(komut, args?, options?)` bir `Uint8Array` ile çözülür. `args` bir `Uint8Array` ya da `ArrayBuffer`'dır; `options.signal` isteği iptal eder. Reddedilen ya da başarısız bir çağrı `InvokeError` fırlatır; `reason` durumu adlandırır: komut `permissions`'ta yoksa `denied`, ayrıca `unknown_command`, `too_large` (yanıt sığmadı), `malformed` (istek çerçevesi ya da argümanı komutun okuduğu biçimde değil), `failed` (işleyici hata döndürdü) ya da `no_reply` (yanıt çerçevesi gelmedi).

Sayfa ve çekirdek JSON değil **ikili çerçeveler** alışverişi yapar: `invoke`, `lepton://localhost/__lepton/invoke` adresine (Windows'ta `http://lepton.localhost/__lepton/invoke`: WebView2, Microsoft'un yükleyicisi olmadan özel şema almıyor) tek bir istek çerçevesi gönderir ve yanıt çerçevesi cevaptır. Her derleme `src/lepton-commands.d.ts` dosyasını yeniden üretir, böylece komut adları tiplidir.

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

Çekirdeğin kendi olayları da vardır: `window.state`, `window.resized`, `download.started`, `download.progress`, `download.finished`, `download.failed` ve `permission.request` ([Web özellikleri](/tr/docs/web-features/) sayfasına bakın).

## Yerleşik komutlar

Çekirdeğin kendi komutları vardır. Sizinkiler gibi her biri yalnız `permissions`'ta listelendiğinde çalışır.

| Komut | |
| --- | --- |
| `core.ping` | Argümanını geri döndürür. |
| `core.protocol` | Kablo protokolünün sürümünü döndürür (`u32`, little-endian). |
| `window.close` | Başlık çubuğundaki kapatma düğmesi gibi uygulamadan kapanmasını ister. |
| `window.minimize`, `window.maximize`, `window.unmaximize` | Adlarındaki işi yapar. Wayland'de küçültülmüş pencereyi yalnız kullanıcı geri getirebilir. |
| `window.state` | Durum bitleri: büyütülmüş, tam ekran, odakta. |
| `permission.respond` | Bir `permission.request`'i yanıtlar. *0.1.5* |

`@lepton-desk/api/window` pencere komutlarını sarar:

```ts
import { close, minimize, toggleMaximize, state, onStateChanged, onResized } from "@lepton-desk/api/window";

await toggleMaximize(); // window.state, window.maximize ve window.unmaximize gerekir
const { maximized, fullscreen, active } = await state();
await onResized(({ width, height }) => console.log(width, height)); // mantıksal piksel
```

`window.state` ve `window.resized` olaylarını dinlemek izin gerektirmez.
