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
| `productName` | İkilinin adı ve masaüstünün gösterdiği ad. |
| `identifier` | Uygulama kimliği: masaüstü girdisi, pencerenin `app_id`'si, veri dizinleri (`~/.local/share/<identifier>`). |
| `version` | Paket adlarında kullanılır. |
| `renderPath` | `webview` (sayfanız WPE WebKit'te) ya da `native` (çekirdek çizer, web motoru yok). |
| `window` | Başlık ve ilk boyut. Sayfanın `<title>`'ı başlığı izler. |
| `permissions` | Sayfanın çağırabileceği komutlar, her biri adıyla. Joker karakter yok. |
| `plugins` | Eklenti ayarları, eklentinin adıyla; ör. `plugins.fs.scope`. |
| `webPermissions` | Web motorunun kendi istekleri (bildirim, kamera…) için yanıtlar: `allow`, `deny` ya da `ask`. Listelenmeyenler reddedilir. *0.1.5* |
| `bundle` | Paket biçimleri ve bilgileri; [Paketleme](/tr/docs/packaging/) sayfasına bakın. |

## İzinler

Sayfanın çağırdığı her komut listelenmelidir. Liste, **çekirdek derlenirken** kayıtlı komutlarla karşılaştırılır: karşılığı olmayan bir ad derlemeyi durdurur, listede olmayan bir komuta yapılan çağrı `denied` ile yanıtlanır.

```json
{ "permissions": ["app.name", "fs.read_file", "dialog.open"] }
```
