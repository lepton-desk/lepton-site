---
title: Eklentiler
description: fs, dialog, clipboard ve os — Zig yarısı olan npm paketleri.
---

Eklenti, iki yarıyı birlikte taşıyan bir npm paketidir: sayfa için TypeScript, çekirdek için Zig. `lepton build`, `run` ve `dev` eklentileri projenin bağımlılıkları arasında bulur ve çekirdeğe derler. Komutlarının yine de `permissions` altında listelenmesi gerekir.

```sh
npm create lepton-app@latest uygulamam -- --plugins fs,dialog
# ya da sonradan
npm install @lepton-desk/plugin-fs
```

Fonksiyon adları Tauri'nin eklentileriyle aynıdır; kodu taşımak çoğunlukla bir import değişikliğidir.

## `@lepton-desk/plugin-fs`

`readTextFile`, `writeTextFile`, `readFile`, `writeFile`, `readDir`, `mkdir`, `remove`, `stat`, `exists`, `BaseDirectory`.

```json
{
  "permissions": ["fs.read_file", "fs.write_file", "fs.mkdir"],
  "plugins": { "fs": { "scope": ["$APPDATA", "$DOCUMENT/notlar"] } }
}
```

Kapsam girdisi bir temel dizindir (`$APPDATA` `$APPCONFIG` `$APPCACHE` `$HOME` `$DOCUMENT` `$DOWNLOAD` `$DESKTOP` `$PICTURE` `$MUSIC` `$VIDEO`), isteğe bağlı olarak altındaki adlarla. Joker karakter yok, `..` yok. Kapsam yoksa her yol reddedilir. Kullanıcı dizinleri `user-dirs.dirs`'ten gelir; Türkçe masaüstünde `$DOCUMENT`, `~/Belgeler`'dir.

## `@lepton-desk/plugin-dialog`

`open(options)` ve `save(options)`; diyaloğu masaüstü xdg-desktop-portal ile çizer, böylece masaüstünün geri kalanına benzer. Her biri seçilen yol(lar) ya da `null` ile çözülür.

```json
{ "permissions": ["dialog.open", "dialog.save"] }
```

## `@lepton-desk/plugin-clipboard`

`writeText(text)` ve `readText()`. Wayland seçimi yalnızca odaktaki pencereye bildirir; bu yüzden ikisi de odağı bekler. Beklemeyi durdurmak için `{ signal }` verin.

```json
{ "permissions": ["clipboard.read_text", "clipboard.write_text"] }
```

## `@lepton-desk/plugin-os`

`platform()`, `arch()`, `family()`, `version()`, `hostname()`, `locale()`, `exeExtension()`.

```json
{ "permissions": ["os.platform", "os.arch", "os.locale"] }
```

**Native** (webview olmayan) bir uygulamada dialog ve clipboard komutları `failed` ile reddedilir.
