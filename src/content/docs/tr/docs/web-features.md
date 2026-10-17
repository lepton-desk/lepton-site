---
title: Web özellikleri
description: Motorun sayfaya çizmenin ötesinde sunduğu şeyler — indirmeler, izinler, bildirimler, bağlantılar, denetleyici. 0.1.5'te yeni.
---

*0.1.5* — WebKit bunların her birini gömen uygulamaya bırakır ve kimse yanıt vermezse reddeder. Lepton yanıt verir; bu sayfa nasıl verdiğini anlatır.

## İndirmeler

Her indirme kullanıcının indirme dizinine (`XDG_DOWNLOAD_DIR`; ör. `~/İndirilenler` ya da `~/Downloads`) sunucunun önerdiği adla, güvenli hale getirilerek yazılır: yalnız yolun son parçası, denetim karakteri yok, asla gizli değil (baştaki `.` `_` olur), dosya varsa benzersiz ad. Dinlemek için izin gerekmez:

```ts
import { onDownload } from "@lepton-desk/api/download";

const stop = await onDownload((event) => {
  if (event.kind === "progress") console.log(event.received, event.expected);
  if (event.kind === "finished") console.log("kaydedildi:", event.path);
});
```

`kind`: `started` (`name` ile), `progress` (`received` ve `expected`; sunucu boyut söylemediyse 0 — saniyede en çok dört kez), `finished` (`path`) ya da `failed` (`message`). Her olay indirmenin `id`'sini taşır.

## Sayfanın istediği izinler

Bildirim, kamera, konum ve diğerleri `lepton.config.json`'daki `webPermissions` ile belirlenir. Listelenmeyen tür reddedilir.

```json
"webPermissions": { "notifications": "allow", "camera": "ask" }
```

Türler: `notifications`, `camera`, `microphone`, `geolocation`, `pointer-lock`, `device-info`, `media-keys`, `storage-access`, `xr`.

`allow` ve `deny` hemen yanıtlanır ve kodunuza hiç ulaşmaz; `navigator.permissions.query` bunları `granted` ve `denied` olarak bildirir (`ask`'i `prompt`). `ask` ile istek sayfaya gelir, kendi arayüzünüzde sorarsınız:

```ts
import { onPermissionRequest } from "@lepton-desk/api/permission";

await onPermissionRequest(async ({ kinds }) => confirm(`${kinds.join(" ve ")} izni verilsin mi?`));
```

Yanıt yerleşik `permission.respond` komutuyla gider; onu `permissions`'a ekleyin. Kimsenin yanıtlamadığı istek bir dakika sonra reddedilir. Kamerayı ve mikrofonu birlikte isteyen sayfa iki türü taşıyan tek bir istek alır.

## Bildirimler

`notifications` izinliyse `new Notification(başlık, { body })` masaüstüne `org.freedesktop.Notifications` üzerinden, uygulamanın adı ve masaüstü girdisiyle ulaşır.

## Bağlantılar ve yeni pencereler

Kullanıcının tıkladığı web bağlantısı — `localhost`, `127.0.0.1` ya da `[::1]` dışındaki bir adrese `http(s)`, ya da `mailto:`, `tel:` ve diğer şemalar — `OpenURI` portalı üzerinden masaüstünün varsayılan uygulamasında açılır; pencere sayfanızda kalır. `window.open` da aynı kuralı izler: dış adres masaüstüne gider ve `null` döner; uygulamanın kendi sayfası aynı motorda ikinci bir pencere açar ve o pencere de çekirdeği ilki gibi çağırabilir.

## Web Inspector

Hata ayıklama derlemelerinde — `lepton dev` ve `--release` olmadan `lepton run` — F12 ya da Ctrl+Shift+I WebKit'in denetleyicisini açar. Sürüm derlemeleri (`lepton build`, `lepton package`) onu içermez.

## Pencere ve sistem

- Pencere başlığı sayfanın `document.title`'ını izler.
- Motor başlamadan uygulama kendi systemd kapsamına, `app-<identifier>-<pid>.scope`'a geçer; böylece sistem izleyicisi onu ve WebKit süreçlerini tek uygulama olarak, masaüstü girdisindeki adıyla gösterir. Kapsamı zaten oluşturan bir başlatıcıdan açıldıysa bir şey değişmez.
