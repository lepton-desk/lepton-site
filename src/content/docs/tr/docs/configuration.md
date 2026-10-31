---
title: Yapılandırma
description: lepton.config.json, alan alan.
---

`lepton.config.json` proje kökündedir. `lepton new` onu şöyle yazar:

```json
{
  "$schema": "https://lepton-desk.vercel.app/schema/config.json",
  "productName": "hello-lepton",
  "identifier": "com.siz.hello-lepton",
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
| `identifier` | Uygulama kimliği, ters DNS: `com.<sahip>.<uygulama>`; sahip uygulamayı yayımlayan (bir alan adının ya da sizin adınız; `lepton new` sorar, varsayılanı Git'in `user.name`'i) *0.1.9-beta.2*. Masaüstü girdisini, pencerenin `app_id`'sini, veri ve durum dizinlerini (`~/.local/share/<identifier>`, izinler `~/.local/state/<identifier>`'da), paylaşılan bellek kanalını ve tek çalışan kopyayı adlandırır; iki uygulama asla aynısını paylaşmamalı. Harf, rakam, `.`, `_` ve `-`. `lepton new`'den sonra değişirse yalnız masaüstü girdisi ve paket adları izler; pencerenin `app_id`'si, veri dizinleri ve systemd kapsamı `src-lepton/main.zig`'e yazılan kimlikte kalır. |
| `version` | Paket adlarında kullanılır. Varsayılan `0.1.0`. |
| `renderPath` | `webview` (sayfanız Linux'ta WPE WebKit'te, Windows'ta WebView2'de; varsayılan) ya da `native` (çekirdek çizer, web motoru yok). |
| `engine` | Linux'ta sayfayı çizen motor: `wpe` (varsayılan) ya da `servo` (deneysel) *0.1.9-beta.3*; aşağıda. |
| `target` | `lepton new`'in kurduğu çatı: `vanilla-ts`, `react`, `vue`, `svelte`, `solid`, `preact`, `lit`, `angular`, `astro` ya da `next`. Yalnız kayıt; değiştirmek bir şey değiştirmez. |
| `window` | Başlık ve ilk boyut. Boyut her derlemede okunur *0.1.7*; başlığı `lepton new` `src-lepton/main.zig`'e ve sayfaya yazar, çalışırken pencere sayfanın `<title>`'ını izler. Varsayılan 1200×800, başlık `productName`. `"decorations": false` başlık çubuğunu sayfaya bırakır *0.1.9-beta.2* ([Komutlar](/tr/docs/commands/#kendi-başlık-çubuğunuz-ve-menüleriniz-019-beta2)). `"frameRate": "unlimited"` native yolun ekranın tazelemesi yerine makinenin yetebildiği kadar hızlı çizmesini sağlar (`"display"` varsayılan) *0.1.9-beta.2*; `LEPTON_FRAME_RATE=display|unlimited` çalışırken bunu ezer. `"contextMenu": false` varsayılan sağ tık menüsünü kapatır *0.1.9-beta.3*: sayfanın `preventDefault()` ile almadığı her sağ tıkta Kes, Kopyala, Yapıştır ve Tümünü seç (geliştirici derlemesinde İncele de); WebView2'de bu, WebView2'nin kendi menüsünün bu öğelere süzülmüş halidir. Boyuta yetmeyen küçük ekranda pencere çalışma alanına sığdırılıp ortalanır. |
| `permissions` | Sayfanın çağırabileceği komutlar, her biri adıyla. Joker karakter yok. |
| `plugins` | Eklenti ayarları, eklentinin adıyla; ör. `plugins.fs.scope`. |
| `deepLinks` | Uygulamanın açtığı URL şemaları; ör. `myapp://…` için `["myapp"]` *0.1.9-beta.2*; aşağıda. |
| `webPermissions` | Web motorunun kendi istekleri (bildirim, kamera…) için yanıtlar: `allow`, `deny` ya da `ask`. Listelenmeyenler reddedilir. *0.1.5* |
| `wasm` | `"threads": true` sayfaya WebAssembly thread'leri verir *0.1.9-beta.3*; aşağıda. |
| `servo` | `"webgl2": true` Servo derlemesinde WebGL 2'yi açar, deneysel *0.1.9-beta.3*; aşağıda. |
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

## `wasm.threads` *0.1.9-beta.3*

WebAssembly thread'leri `SharedArrayBuffer` ister; tarayıcı motorları onu yalnız cross-origin isolated (kökenler arası yalıtılmış) bir sayfaya verir. `"wasm": { "threads": true }` sayfayı derlenmiş uygulamada da `lepton dev`'de de böyle yapar:

```json
{ "wasm": { "threads": true } }
```

- Çekirdek yanıtlarına `Cross-Origin-Opener-Policy: same-origin` ve `Cross-Origin-Embedder-Policy: require-corp` koyar. `lepton dev`'de sayfayı dev sunucusu verdiği için her şablonun dev ayarı aynı ayarı okuyup aynı başlıkları gönderir (`vite.config`, `astro.config.mjs`, `next dev` için `next.config`). Angular'ın `angular.json`'u başka bir dosyayı okuyamaz: onun `frontend.devArgs`'ında `{isolation}` vardır, `lepton dev` onu `--headers` bayraklarına çevirir.
- Yalıtılmış bir sayfa başka bir kökenden bir kaynağı (CDN'den bir betik, bir görsel) ancak o köken CORS ya da `Cross-Origin-Resource-Policy` ile izin verirse yükler. Sayfanın thread'e ihtiyacı yoksa ayarı kapalı bırakın.
- Linux'ta WPE WebKit 2.54 yalıtılmış sayfaya da `SharedArrayBuffer` vermiyor; bu yüzden çekirdek uygulamanın web süreci için JavaScriptCore'un kendi seçeneğini de açar. Bu seçenek köken başına değildir: uygulamanın gösterdiği her sayfada `SharedArrayBuffer` olur, yalnız kendi sayfasında değil.

Linux'ta WPE WebKit 2.54'te ve Windows'ta WebView2'de ölçüldü: ayar açıkken sayfa yalıtılmış ve bir Worker paylaşımlı `WebAssembly.Memory`'yi okuyup yazıyor; kapalıyken `SharedArrayBuffer` yok. Servo'da ayar açık da olsa kapalı da olsa WebAssembly thread'i yok (`SharedArrayBuffer` yok); `lepton build --servo` bunu söyler ve uygulamayı thread'siz derler.

0.1.9-beta.3'ten önceki bir proje: `lepton update`, `lepton new`'in yazdığı haliyle duran dev ayarını yenisiyle değiştirir, düzenlediğiniz bir dosyaya eklenecek satırları yazar ve Angular projesinin bayraklarına `{isolation}` ekler.

## `engine` *0.1.9-beta.3*

Linux'ta sayfayı varsayılan olarak WPE WebKit çizer. `"engine": "servo"` projenin motorunu Servo yapar: `lepton build`, `run`, `dev` ve `package` her seferinde `--servo` verilmiş gibi davranır, Linux paketi Servo kitaplığını yanında taşır. Windows'ta sayfayı her zaman WebView2 çizer; `renderPath: "native"` bir projede de web motoru yoktur. İkisinde de ayarın etkisi yoktur.

```json
{ "engine": "servo" }
```

Servo deneyseldir. WPE WebKit'te olup Servo'da olmayanlar: dead key, compose ve giriş yöntemleri; WebAssembly thread'leri; varsayılan olarak WebGL 2 ([`servo.webgl2`](#servowebgl2-019-beta3)). Servo yalnız x86_64 Linux içindir ve GStreamer'ı sistemden ister. Kitaplığı `npm install -D @lepton-desk/servo-linux-x64` ile kurulur.

## `servo.webgl2` *0.1.9-beta.3*

Servo 0.6 sayfalara WebGL 2 vermez: motorun kendi ayarı kapalı gelir. `"servo": { "webgl2": true }` onu yalnız `--servo` derlemelerinde açar. WPE WebKit'te ve WebView2'de WebGL 2 bu ayardan bağımsız olarak vardır; ayar onlara dokunmaz.

```json
{ "servo": { "webgl2": true } }
```

Servo'da WebGL 2 deneyseldir. Bir Babylon.js oyununda ölçülenler:

- Açıldığında Servo'nun WebGL iş parçacığı sRGB bir görüntü dokusunu yüklerken çöküyordu. Lepton'ın Servo'su bunu yamalar.
- Bundan sonra oyun çimi siyah çizdi; WebGL 1'de doğru çiziyordu. Nedeni henüz bilinmiyor.
- WebGL 1'e göre kare süresinde bir kazanç görülmedi; karşılaştırılan iki çalıştırmanın sahnesi aynı değildi.

Sayfanız için WebGL 2 şartsa Linux'ta WPE WebKit'i (varsayılan motor), Windows'ta WebView2'yi kullanın.

Ayar, aynı sürümün Servo kitaplığını (`@lepton-desk/servo-linux-x64`) ister. 0.1.9-beta.3'ten önceki bir proje: `lepton update`; o zamana kadar `lepton build --servo` ayarın okunmadığını söyler ve WebGL 2 kapalı kalır.

## `deepLinks` ve tek çalışan kopya *0.1.9-beta.2*

Bir uygulama kullanıcı başına bir kez çalışır. Yeniden başlatmak — başlatıcıdan, dosya yöneticisinden ya da bir bağlantıdan — yeni başlangıcın argümanlarını çalışan kopyaya verir; o da sayfasına `app.opened` olayıyla bildirir ve yeni başlangıç biter. `@lepton-desk/api/app` ikisini de okur: `launchArgs()` bu başlangıcınkini, `onOpened(handler)` sonrakilerin her birini.

```json
{ "deepLinks": ["myapp"], "permissions": ["app.args"] }
```

```ts
import { launchArgs, onOpened } from "@lepton-desk/api/app";

const first = await launchArgs();          // uygulamayı bir bağlantı açtıysa ["myapp://open/7"]
await onOpened((args) => route(args[0]));  // çalışırken tıklanan bir bağlantı
```

Linux'ta masaüstü girdisi şemayı üstlenir (`MimeType=x-scheme-handler/myapp;`, `Exec … %u`); `lepton dev`/`run` da başka bir uygulama zaten değilse onu şemanın varsayılan işleyicisi yapar. Windows'ta MSI şemayı kullanıcı için kaydeder (`HKCU\Software\Classes\myapp`). Şemalar küçük harflidir; `http`, `https`, `file`, `mailto` ve benzerleri başka programlarındır, reddedilir. Linux'ta ölçüldü: `xdg-open myapp://open/43` çalışan kopyanın sayfasına ulaştı, ikinci pencere açılmadı; kapalı bir uygulamayı açan bağlantı `launchArgs()`'ta geldi. Windows yarısı derleniyor ve tabloları test ediliyor, Windows'ta henüz çalıştırılmadı.

## İzinler

Sayfanın çağırdığı her komut listelenmelidir. Liste, **çekirdek derlenirken** kayıtlı komutlarla karşılaştırılır: karşılığı olmayan bir ad derlemeyi durdurur, listede olmayan bir komuta yapılan çağrı `denied` ile yanıtlanır.

```json
{ "permissions": ["app.name", "fs.read_file", "dialog.open"] }
```
