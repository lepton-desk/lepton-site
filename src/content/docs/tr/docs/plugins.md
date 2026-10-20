---
title: Eklentiler
description: fs, dialog, clipboard ve os — Zig yarısı olan npm paketleri.
---

Eklenti, iki yarıyı birlikte taşıyan bir npm paketidir: sayfa için TypeScript, çekirdek için Zig. `lepton build`, `run` ve `dev` eklentileri projenin bağımlılıkları arasında bulur ve çekirdeğe derler. Komutlarının yine de `permissions` altında listelenmesi gerekir.

Windows'ta *0.1.9-beta.1* `os`, `fs` ve `dialog` bir WebView2 uygulamasında ölçüldü; `clipboard` Windows için yazıldı ama orada henüz ölçülmedi. `dialog` Windows'un kendi dosya pencerelerini açıyor, `fs` ise kapsamını orada dışarı çıkan her bağlantıyı reddederek koruyor; Linux'takinden katı. Temel klasörler (`$APPDATA`, `$APPCACHE`, …) Windows'un Known Folders'ı.

```sh
npm create lepton-app@latest uygulamam -- --plugins fs,dialog
# ya da sonradan
npm install @lepton-desk/plugin-fs
```

Fonksiyon adları Tauri'nin eklentileriyle aynıdır; kodu taşımak çoğunlukla bir import değişikliğidir.

## `@lepton-desk/plugin-fs`

`readTextFile`, `writeTextFile`, `readFile`, `writeFile`, `readDir`, `mkdir`, `remove`, `rename` *0.1.5*, `stat`, `exists`, `BaseDirectory`. Her komut `fs.` ve adının yılan biçimidir: `fs.read_file` (iki okuma işlevi de), `fs.write_file`, `fs.read_dir`, `fs.mkdir`, `fs.remove`, `fs.rename`, `fs.stat`, `fs.exists`.

```json
{
  "permissions": ["fs.read_file", "fs.write_file", "fs.mkdir"],
  "plugins": { "fs": { "scope": ["$APPDATA", "$DOCUMENT/notlar"] } }
}
```

Kapsam girdisi bir temel dizindir (`$APPDATA` `$APPCONFIG` `$APPCACHE` `$HOME` `$DOCUMENT` `$DOWNLOAD` `$DESKTOP` `$PICTURE` `$MUSIC` `$VIDEO`), isteğe bağlı olarak altındaki adlarla. Joker karakter yok, `..` yok. Kapsam yoksa her yol reddedilir. Kullanıcı dizinleri `user-dirs.dirs`'ten gelir; Türkçe masaüstünde `$DOCUMENT`, `~/Belgeler`'dir.

Linux'ta her yol çekirdeğin `RESOLVE_BENEATH`'iyle açılır; izinli bir dizindeki sembolik bağlantı dışarı çıkaramaz. Kapsam dışındaki yol `denied` ile reddedilir, `exists` de öyle — `false` yanıtı sayfaya bakamayacağı yerde ne olduğunu söylerdi.

- `writeFile(yol, veri, { append: true })` sona ekler; `mkdir(yol, { recursive: true })` eksik üst dizinleri de oluşturur.
- `remove(yol, { recursive: true })` dizini içindekilerle siler; içerideki bağlantılar izlenmez, kendileri silinir. *0.1.5*
- `rename(kaynak, hedef)` tek bir kapsam dizini içinde kalır ve var olan hedefi tek adımda değiştirir. *0.1.5*
- Tek çağrı en çok 64 KiB taşır. `readFile` daha büyük dosyayı parça parça okur; `writeFile` parça parça `<ad>.lepton-save` adına yazar ve eskisinin üzerine taşır, böylece yarıda kalan yazma eski dosyayı bozmaz. *0.1.5*

`watch(path, handler)` her değişiklikte `handler({ change, name })` çağırır: bir klasörde bir girdinin `created`, `modified` (yazan onu kapatınca), `removed`, `renamedFrom` ya da `renamedTo` olması; izlenen yolun kendisi için `gone`. Çekirdek her değişikliği okuduğu anda iletir, en geç çeyrek saniyede; hiçbir şey yoklanmaz. Yol izlenmeden önce kapsamın içinde açılır, bu yüzden bir bağlantı izlemeyi kapsamın dışına çeviremez. İzlemeyi durduran bir fonksiyonla çözülür. Alt klasörler izlenmez; şimdilik yalnız Linux (Windows `failed` ile reddeder). Komutlar `fs.watch` ve `fs.unwatch`. *0.1.9-beta.2*

```ts
import { BaseDirectory, watch } from "@lepton-desk/plugin-fs";

const stop = await watch("notes", ({ change, name }) => console.log(change, name), {
  baseDir: BaseDirectory.AppData,
});
```

`fs` ayarlarında `"chosen": true` ile kullanıcının `@lepton-desk/plugin-dialog`'da seçtiği şey kapsama katılır ve sonraki açılışlarda hatırlanır: seçilen klasör içindekilerle, seçilen dosya yalnız kendisi. *0.1.5*

```json
"plugins": { "fs": { "scope": ["$APPDATA"], "chosen": true } }
```

## `@lepton-desk/plugin-dialog`

`open(options)` ve `save(options)`; diyaloğu Linux'ta masaüstü xdg-desktop-portal ile, Windows'ta Windows'un kendi dosya pencereleri çizer; böylece masaüstünün geri kalanına benzer. Her biri seçilen yol(lar) ile, kullanıcı vazgeçerse `null` ile çözülür; diyalog açık kaldıkça söz bekler.

```ts
import { open, save } from "@lepton-desk/plugin-dialog";

const files = await open({ multiple: true, filters: [{ name: "Metin", extensions: ["txt", "md"] }] });
const folder = await open({ directory: true, title: "Bir klasör seçin" });
const target = await save({ defaultName: "notlar.md", acceptLabel: "Dışa aktar" });
```

İkisi de `title`, `defaultPath`, `filters`, `acceptLabel` ve `signal` alır; `open` ayrıca `multiple` ve `directory`, `save` ayrıca `defaultName`. Seçilen yol plugin-fs ile yalnız kapsam içindeyse ya da `chosen` açıksa (yukarıda) okunur.

```json
{ "permissions": ["dialog.open", "dialog.save"] }
```

## `@lepton-desk/plugin-clipboard`

`writeText(text)` ve `readText()`. Wayland seçimi yalnızca odaktaki pencereye bildirir; bu yüzden ikisi de odağı bekler. Beklemeyi durdurmak için `{ signal }` verin.

`readText` yalnızca kullanıcı pencerede bir tuşa ya da düğmeye bastıktan sonraki beş saniye içinde cevap verir; tarayıcı da panoyu yalnızca bir kullanıcı hareketi sırasında okutur. Aksi halde `NotAllowedError` `DOMException` ile reddeder. Kararı çekirdek gördüğü girdiden verir; sayfaya sızmış bir betik kullanıcının başka yerde kopyaladığını okuyamaz (ölçüldü: sayfa yüklenirken yapılan okuma reddedildi, bir tıklamadan hemen sonraki cevaplandı). Bunsuz okuması gereken bir pano yöneticisi `"read": "always"` verir. *0.1.9-beta.2*

```json
{
  "permissions": ["clipboard.read_text", "clipboard.write_text"],
  "plugins": { "clipboard": { "read": "always" } }
}
```

## `@lepton-desk/plugin-os`

`platform()`, `arch()`, `family()`, `version()`, `hostname()`, `locale()`, `exeExtension()`.

```json
{ "permissions": ["os.platform", "os.arch", "os.locale"] }
```

**Native** (webview olmayan) bir uygulamada dialog ve clipboard komutları `failed` ile reddedilir.

## Eklenti yazmak

Eklenti, `package.json`'ı Zig dosyasını gösteren bir npm paketidir:

```json
"lepton": { "plugin": "zig/plugin.zig", "settings": "eklentim" }
```

`plugin.zig` komutlarını dışa verir. Uygulama durumu almazlar — yalnız istek baytlarını ve yanıt arabelleğini:

```zig
const core = @import("lepton_core");
const Registry = core.webviewRegistry;

pub const commands = [_]Registry.PluginCommand{
    .{ .name = "eklentim.merhaba", .run = &merhaba },
};

fn merhaba(_: []const u8, out: []u8) Registry.HandlerError!usize {
    const text = "merhaba";
    if (text.len > out.len) return error.TooLarge;
    @memcpy(out[0..text.len], text);
    return text.len;
}
```

TypeScript yarısı onları `@lepton-desk/api/core`'daki `invoke` ile çağırır (eş bağımlılık). Paketin `files` listesine `zig/` klasörünü ekleyin. Uygulama her komutu yine `permissions`'ta listeler.

- `settings`, eklentinin `lepton.config.json`'daki bölümünü adlandırır (`plugins.eklentim`); çekirdek onu derleme anında `core.pluginConfig` ile okur.
- `pub const private = .{ "eklentim.gizli" };` bir komutun baytlarını [`lepton record`](/tr/docs/cli/) kayıtlarından uzak tutar.
- Bir şeyi izleyen eklenti `pub fn tick(bridge: anytype) void` dışa aktarır; uygulamanın döngüsü onu her turda çağırır (en az 250 ms'de bir), o da `bridge.emit("eklentim.degisti", baytlar)` ile olay yayar (en çok 256 bayt). TypeScript yarısı olayı `AppEvents`'te bildirir (`@lepton-desk/api/event`). *0.1.9-beta.2*
