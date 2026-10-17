---
title: Yapılandırma
description: lepton.config.json, alan alan.
---

`lepton.config.json` proje kökündedir. `lepton new` onu şöyle yazar:

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

| Alan | |
| --- | --- |
| `productName` | Masaüstünün gösterdiği ad. İkilinin adı bundan türer: küçük harf, diğer karakter dizileri tek `-` (`My App` → `my-app`). |
| `identifier` | Uygulama kimliği: masaüstü girdisi, pencerenin `app_id`'si, veri dizinleri (`~/.local/share/<identifier>`). `lepton new`'den sonra değişirse yalnız masaüstü girdisi ve paket adları izler; pencerenin `app_id`'si, veri dizinleri ve systemd kapsamı `src-lepton/main.zig`'e yazılan kimlikte kalır. |
| `version` | Paket adlarında kullanılır. Varsayılan `0.1.0`. |
| `renderPath` | `webview` (sayfanız WPE WebKit'te; varsayılan) ya da `native` (çekirdek çizer, web motoru yok). |
| `target` | `lepton new`'in kurduğu ön yüz: `vanilla-ts`, `react`, `vue`, `svelte`, `solid`. Yalnız kayıt; değiştirmek bir şey değiştirmez. |
| `window` | Başlık ve ilk boyut; `lepton new` bunları `src-lepton/main.zig`'e ve `index.html`'e yazar, sonradan burada değiştirmek etkisizdir. Varsayılan 1200×800, başlık `productName`. Çalışırken pencere sayfanın `<title>`'ını izler. |
| `permissions` | Sayfanın çağırabileceği komutlar, her biri adıyla. Joker karakter yok. |
| `plugins` | Eklenti ayarları, eklentinin adıyla; ör. `plugins.fs.scope`. |
| `webPermissions` | Web motorunun kendi istekleri (bildirim, kamera…) için yanıtlar: `allow`, `deny` ya da `ask`. Listelenmeyenler reddedilir. *0.1.5* |
| `bundle` | Paket biçimleri ve bilgileri; [Paketleme](/tr/docs/packaging/) sayfasına bakın. |
| `sdkScope`, `channel` | `lepton new` yazar (`@lepton-desk`; paylaşımlı bellek kanalı `/lepton-<identifier>` ve boyutu). Kanal adı bir kez `src-lepton/main.zig`'e yazılır; burada değiştirmek etkisizdir. |

## İzinler

Sayfanın çağırdığı her komut listelenmelidir. Liste, **çekirdek derlenirken** kayıtlı komutlarla karşılaştırılır: karşılığı olmayan bir ad derlemeyi durdurur, listede olmayan bir komuta yapılan çağrı `denied` ile yanıtlanır.

```json
{ "permissions": ["app.name", "fs.read_file", "dialog.open"] }
```
