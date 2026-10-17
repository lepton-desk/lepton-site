---
title: "Lepton ve ne olmadığı"
description: "Web ön yüzünüzü sistemde zaten olan motorda çalıştıran, Zig çekirdekli ve Rust CLI'lı bir masaüstü çatısı. Bugün ne çalışıyor, bedeli ne, ne hâlâ plan."
date: 2026-10-17
note: "sayılar Lepton'ın kendi ölçüm kaydından"
---

Lepton, web teknolojileriyle yazılan masaüstü uygulamaları için bir çatı. Ön yüzünüz (React, Vue, Svelte, Solid ya da düz TypeScript, Vite ile derlenmiş) bir pencerede çalışır; Zig ile yazılmış bir çekirdek o pencerenin sahibidir ve sayfayla konuşur. Tek bir Rust programı, `lepton`, uygulamayı oluşturur, çalıştırır, derler ve paketler.

Farklı yaptığı tek bir şey var, gerisi ondan çıkıyor: **Lepton bir tarayıcı taşımaz.** İşletim sisteminin sağladığı web motorunu kullanır.

## Sistemde zaten olan motor

Linux'ta bu motor WPE WebKit; 2.54'te kararlı ve varsayılan olan WPE Platform API'si üzerinden. WebKitGTK kullanılmaz. WPE'nin eski API'si, yani libwpe ve WPEBackend-fdo gibi bir arka uç, 2.54'te hâlâ bir derleme seçeneği; dağıtımlar onu geride bırakıyor: Arch, WebKit'i onsuz derliyor ve libwpe'yi artık paketlemiyor. Lepton, motorda varsa Platform API'sini kullanır; eski motorlar için libwpe API'sine giden bir yol da var, ama Lepton onunla test edilmiyor. WebKit'ten uzak durmak isteyenler için `lepton build --linux --servo` ile yerine Servo bağlanabilir; bu deneysel.

macOS (WKWebView) ve Windows (WebView2) planlı, henüz yapılmadı. WebView2 Chromium tabanlı; yani Windows'ta Lepton "Chromium'suz" olmayacak. Fark şu: Windows'la birlikte gelir, uygulamanız onu taşımaz.

## Sayfayla çekirdek arasında JSON yok

Sayfa çekirdeği `invoke` ile çağırır, çekirdek olayları geri gönderir. İkisi de JSON değil, ikili çerçeve: bir çağrı, `lepton://localhost/__lepton/invoke` adresine gönderilen tek bir istek çerçevesidir; yanıt çerçevesi de cevaptır. Sayfanın kullandığı ofsetler ve komut numaraları çekirdek derlenirken onun kendi yapılarından üretilir, iki taraf birbirinden kopamaz. Çekirdeğin kanalının altındaki paylaşımlı bellek halkasında gidiş-dönüş medyanda 248 ns ölçüldü (`zig build roundtrip`, 20 000 tur).

Komutlar, `src-lepton/main.zig`'de kaydettiğiniz Zig işlevleridir. Sayfa yalnızca `lepton.config.json`'da `permissions` altında adıyla listelenen komutları çağırabilir, joker karakter yok; liste **çekirdek derlenirken** denetlenir: komutu olmayan bir ad derlemeyi durdurur, listede olmayan komuta yapılan çağrı `denied` ile yanıtlanır.

## `npm create`'ten pakete

```sh
npm create lepton-app@latest hello-lepton -- --template react-ts --target webview
cd hello-lepton
npm run lepton dev       # anlık yenilemeli Vite, çekirdek, pencere
npm run lepton package   # varsayılan .tar.gz; istenirse .deb ve Arch
```

Paketlenen merhaba uygulaması 173 852 baytlık bir `.tar.gz` oldu. Paketler yeniden üretilebilir (sıralı girdiler, sabit sahip ve zaman, her birinin yanında `.sha256`); `lepton package --verify` her paketi boş bir dizine açar, başlatır, ölçer ve kapatır; başlamazsa ya da arkada süreç bırakırsa başarısız olur.

## Bedeli

Tarayıcı taşımamak bir web sayfasını bedava yapmaz. Web ön yüzlü, paketlenmiş bir Lepton uygulamasında ölçülen:

| | |
| --- | --- |
| Uygulama süreci | 67,5 MiB bellekte |
| WebKit süreçleriyle tüm ağaç (8 süreç) | yaklaşık 200 MB; paylaşılan sayfalar iki kez sayılmasın diye PSS olarak |
| 10 saniyede boştaki CPU | bir çekirdeğin %1,6'sı |

Bu, WebKit'in web ve ağ süreçlerinin bir tarayıcı motorunun yaptığını yapması. Bir web sayfasının istediği bellek, web ön yüzünün dürüst bedeli; Lepton'ın payı, sistemdeki motorun üstüne ikinci bir motor eklememek.

## Şu an nerede

- **Bugün çalışan:** Linux, WPE WebKit; `lepton new | dev | run | build | package | info`; fs, dialog, clipboard ve os eklentileri; npm, pnpm, Yarn ve Bun.
- **Sıradaki, 0.1.5:** indirmeler, web izin akışı, bildirimler, hata ayıklama derlemelerinde Web Inspector, bağlantıların masaüstünde açılması ve sayfanın yaptığı her çağrıyı kaydedip çekirdeğe yeniden oynatan `lepton record` / `lepton replay`.
- **0.2.0, beta olarak planlı:** doğrudan GPU ile çizim ve web teknolojileriyle yazılıp tarayıcı motoru olmadan Lepton'ın kendisinin çizdiği yerel arayüzler.

Kaynak [github.com/lepton-desk/lepton](https://github.com/lepton-desk/lepton) adresinde; [belgeler](/tr/docs/getting-started/) her komutun bugün ne yaptığını anlatıyor.
