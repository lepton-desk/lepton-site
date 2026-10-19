---
title: Yapılandırma
description: lepton.config.json, alan alan.
---

`lepton.config.json` proje kökündedir. `lepton new` onu şöyle yazar:

```json
{
  "$schema": "https://lepton-desk.vercel.app/schema/config.json",
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
| `$schema` | Dosyanın [JSON şeması](/schema/config.json) *0.1.9-beta.0*: editör alanları tamamlar, bilinmeyen bir alanı işaretler. Önceki projeler hiç çözülmeyen bir adrese gösteriyor; `lepton update` onları taşır. |
| `productName` | Masaüstünün gösterdiği ad. İkilinin adı bundan türer: küçük harf, diğer karakter dizileri tek `-` (`My App` → `my-app`). |
| `identifier` | Uygulama kimliği: masaüstü girdisi, pencerenin `app_id`'si, veri dizinleri (`~/.local/share/<identifier>`). `lepton new`'den sonra değişirse yalnız masaüstü girdisi ve paket adları izler; pencerenin `app_id`'si, veri dizinleri ve systemd kapsamı `src-lepton/main.zig`'e yazılan kimlikte kalır. |
| `version` | Paket adlarında kullanılır. Varsayılan `0.1.0`. |
| `renderPath` | `webview` (sayfanız WPE WebKit'te; varsayılan) ya da `native` (çekirdek çizer, web motoru yok). |
| `target` | `lepton new`'in kurduğu çatı: `vanilla-ts`, `react`, `vue`, `svelte`, `solid`, `preact`, `lit`, `angular`, `astro` ya da `next`. Yalnız kayıt; değiştirmek bir şey değiştirmez. |
| `window` | Başlık ve ilk boyut. Boyut her derlemede okunur *0.1.7*; başlığı `lepton new` `src-lepton/main.zig`'e ve sayfaya yazar, çalışırken pencere sayfanın `<title>`'ını izler. Varsayılan 1200×800, başlık `productName`. |
| `permissions` | Sayfanın çağırabileceği komutlar, her biri adıyla. Joker karakter yok. |
| `plugins` | Eklenti ayarları, eklentinin adıyla; ör. `plugins.fs.scope`. |
| `webPermissions` | Web motorunun kendi istekleri (bildirim, kamera…) için yanıtlar: `allow`, `deny` ya da `ask`. Listelenmeyenler reddedilir. *0.1.5* |
| `bundle` | Paket biçimleri ve bilgileri; [Paketleme](/tr/docs/packaging/) sayfasına bakın. |
| `frontend` | Derlemenin nereye gittiği ve dev sunucusunun nasıl başlatıldığı *0.1.9-beta.0*; aşağıda. Yoksa proje bir Vite projesidir. |
| `sdkScope`, `channel` | `lepton new` yazar (`@lepton-desk`; paylaşımlı bellek kanalı `/lepton-<identifier>` ve boyutu). Kanal adı bir kez `src-lepton/main.zig`'e yazılır; burada değiştirmek etkisizdir. |

## `frontend` *0.1.9-beta.0*

Lepton bir ön yüzden iki şey bilmek ister: derlemesinin yazdığı klasör ve dev sunucusunun `lepton dev`'in seçtiği portu ve adresi nasıl aldığı. Bu bölüm yoksa ikisi de Vite'ınkidir: `dist` ve `--port {port} --strict-port --host {host} --clearScreen false`. Astro, Next.js ve Angular şablonları kendilerininkini yazar:

```json
{
  "frontend": {
    "dist": "out",
    "devArgs": ["--port", "{port}", "--hostname", "{host}"]
  }
}
```

| Alan | |
| --- | --- |
| `dist` | Derlemenin çıktı klasörü, proje içinde: Vite, Astro ve Angular için `dist`, Next.js statik dışa aktarımı için `out`. `lepton build`, `run` ve `package` onu ikilinin yanına kurar. |
| `devArgs` | `<yönetici> run dev`'den sonraki bayraklar. `{port}` ve `{host}`, pencerenin yüklediği port ve adresle değiştirilir; ikisi de geçmelidir, yoksa CLI dosyayı reddeder. |

Şablonu olmayan bir çatı da aynı yolla çalışır: çıktı klasörünü ve dev sunucusunun aldığı bayrakları yazın. Sunucu dolu bir portta başka porta geçmemeli, durmalı; çünkü pencereye port zaten söylenmiş olur.

## İzinler

Sayfanın çağırdığı her komut listelenmelidir. Liste, **çekirdek derlenirken** kayıtlı komutlarla karşılaştırılır: karşılığı olmayan bir ad derlemeyi durdurur, listede olmayan bir komuta yapılan çağrı `denied` ile yanıtlanır.

```json
{ "permissions": ["app.name", "fs.read_file", "dialog.open"] }
```
