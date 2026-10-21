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
| `window.start_drag` | Sayfanın kendi başlık çubuğundaki bir basıştan pencereyi işaretçiyle taşır. *0.1.9-beta.2* |
| `window.menu` | İşaretçide yerel bir menü açar, seçilen öğeyle yanıtlar. *0.1.9-beta.2* |
| `app.args` | Uygulamanın başlatıldığı argümanlar ve sonraki başlatmaların devrettikleri (son 8). Yeni projenin izinlerinde; kayıtlarda maskelenir. *0.1.9-beta.2* |
| `permission.respond` | Bir `permission.request`'i yanıtlar. *0.1.5* |

`@lepton-desk/api/window` pencere komutlarını sarar:

```ts
import { close, minimize, toggleMaximize, state, onStateChanged, onResized } from "@lepton-desk/api/window";

await toggleMaximize(); // window.state, window.maximize ve window.unmaximize gerekir
const { maximized, fullscreen, active } = await state();
await onResized(({ width, height }) => console.log(width, height)); // mantıksal piksel
```

`window.state` ve `window.resized` olaylarını dinlemek izin gerektirmez.

## Kendi başlık çubuğunuz ve menüleriniz *0.1.9-beta.2*

`"window": { "decorations": false }` ile sistem başlık çubuğu çizmez, sayfa kendisininkini çizer. `dragRegion` bir öğeyi çubuk yapar: üzerine basmak (içindeki düğme, bağlantı ya da alan dışında) pencereyi taşır, çift tıklamak büyütür ya da geri alır. `popupMenu` işaretçide yerel bir menü açar, seçilen `id` ile, menü kapatıldıysa `null` ile döner.

```ts
import { dragRegion, popupMenu } from "@lepton-desk/api/window";

dragRegion(document.querySelector("header")!);          // window.start_drag gerekir
addEventListener("contextmenu", async (event) => {
  event.preventDefault();
  const chosen = await popupMenu([                       // window.menu gerekir
    { id: 1, label: "Kopyala" },
    { id: 2, label: "Yapıştır", disabled: true },
    { separator: true },
    { id: 3, label: "Satır numaraları", checked: true },
  ]);
});
```

Menü Esc'de, dışına basılınca ya da uygulama odağı kaybedince bir şey seçmeden kapanır. Hangisi nerede çalışır:

| | Windows (WebView2) | Linux, Servo | Linux, WPE WebKit |
| --- | --- | --- | --- |
| `decorations: false` | evet; boyutlandırma kenarları, gölge ve yaslama kalır | evet | henüz değil: başlık çubuğu kalır |
| `dragRegion` / `window.start_drag` | evet, CSS `app-region: drag` da | evet | henüz değil (`failed`) |
| `popupMenu` / `window.menu` | sistemin menüsü | Lepton'ın menüsü | henüz değil (`failed`) |
| Başlık çubuğu sayfayı izler | `color-scheme` ve `theme-color`'dan koyu ya da açık (Windows 10'da ölçüldü); Windows 11'de çubuk rengin kendisini alır (Windows Server 2025, derleme 26100'de ölçüldü: `#ffd700` siyah yazılı `rgb(255, 215, 0)` bir çubuk çizdi) | hayır | hayır |

Windows'ta başlık çubuğu hiçbir ayar olmadan sayfayı izler: `<meta name="theme-color">` ve CSS `color-scheme`, değiştikçe. Linux'ta başlık çubuğunu bileşimci çizer ve rengini değiştirmenin yolunu vermez (COSMIC'te ölçüldü). WPE WebKit'in kendi Wayland platformu çerçeveyi sayfaya bırakamıyor, pencereyi onun için taşıyamıyor; bunları yapacak olan Lepton'ın kendi WPE platformu 0.1.9-beta.3 için planlandı.
