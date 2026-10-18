---
title: Değişiklikler
description: Her Lepton sürümünde ne değişti, bir sonraki sürüm için trunk'ta ne var ve 0.2.0 ne kadar ilerledi. Her sayı ölçüldü.
---

Bu sayfadaki her sayı projenin kendi makinesinde (Radeon R7 240, Linux, Wayland) ölçüldü; komutu depoda kayıtlı.

## 0.1.7 *2026-10-18*

### Komutlar

- **Renkli çıktı.** `lepton build`, `run`, `dev` ve `package` her adımı çerçeveliyor (`▸ frontend  pnpm run build`, `✔ frontend  0.9 s`) ve bilgileri hizalı yazıyor. Çalıştırdıkları araçlar kendi renklerini koruyor: Vite'ın derleme tablosu ve pnpm'in satırları, Lepton onları borudan okuduğu için renksiz çıkıyordu. `NO_COLOR` ile ya da boruya yazarken düz metin. `lepton dev` artık Vite'ın terminali temizlemesine izin vermiyor.
- **`lepton update`.** Var olan projenin çekirdeğini ve `src-lepton/` dosyalarını kurulu sürüme getiriyor, düzenlemelerinizi üç yollu birleştirmeyle koruyor; çakışan bir düzenlemede `main.zig.merge` yazıyor ve hiçbir şeyi değiştirmiyor. [CLI](/tr/docs/cli/#lepton-update-017)
- **`lepton replay --page --close`.** Kendiliğinden biten sayfa tekrarı; böylece bir kayıt test olabiliyor. [CLI](/tr/docs/cli/#lepton-record-ve-lepton-replay-015)

### Çekirdek

- **Uygulamayı durdurmak iz bırakmıyor.** SIGTERM, Ctrl+C ya da oturumun kapanması artık çekirdeği öldürmüyor, döngüyü bitiriyor; kanalı `/dev/shm`'den silinip gidiyor. Önceden sinyalle durdurulan her uygulama dört dosya bırakıyordu.
- **Yoklama yok.** Sayfa çekirdeğin 532 KB'lık halkasını 250 ms'de bir okuyordu. Artık çekirdek yayınlayana kadar bekliyor ve yalnız değişeni okuyor. Boşta, uygulamanın süreçleri 30 sn'de 0,87 sn yerine 0,07 sn CPU harcıyor; web süreci 175–207 MiB arasındaki testere dişinden sabit 176 MiB'a indi.
- **`lepton.config.json`'daki pencere boyutu her derlemede okunuyor.** Önceden `lepton new` onu bir kez `main.zig`'e yazıyordu.
- **Paylaşımlı bellekte native uygulamalar.** GPU'suz bir native pencere 60 Hz ekran için saniyede yaklaşık 300 kare çiziyor ve her seferinde yeni tampon açıyordu. Artık iki tamponu yeniden kullanıyor ve bileşimciyi bekliyor: 10 sn'de 9,06 sn → 1,10 sn CPU.

### Projeler

- **Yeni projeler `tsc` ve `biome check`'ten geçiyor**, ilk derlemeden önce de sonra da. Tam bunu denetleyerek üç şablon hatası bulundu: react-ts'te `jsx` ayarı yoktu, üretilen tür dosyasında Biome'un reddettiği boş bir arayüz vardı, eklentilerle açılan projede izinler 140 karakterlik tek satırdı.
- **Örnek uygulama:** [`examples/notes`](https://github.com/lepton-desk/lepton/tree/trunk/examples/notes), fs, dialog ve clipboard eklentileri üzerine kurulu bir Markdown not uygulaması (CodeMirror, Milkdown, wiki bağlantıları, geri bağlantılar, pano görünümü, komut paleti). Açılışı kaydedilip test olarak yeniden oynatılıyor; eski bir hata geri konunca (klasör ağacını iki kez yürümek) tekrar, olması gerektiği gibi başarısız oldu.

### Arch paketleri

- `lepton-desk` (kaynaktan) ve `lepton-desk-bin` (npm'deki ikili); AUR'daki `lepton` ile yan yana durabilsin diye `lepton-desk` adıyla kuruluyor. AUR yeni hesapları şimdilik kapattı; o zamana kadar depodan derleniyor. [Sistem gereksinimleri](/tr/docs/requirements/#archta-cli-017)

## 0.2.0 *hazırlanıyor*

0.2.0 bir `@beta` sürümü olarak planlandı: doğrudan GPU'da çizen bir native çizici, native uygulamalar için bir JavaScript motoru ve native arayüz. Şimdiye kadarki temel:

- **Vulkan tabanı Radeon R7 240'ınki.** Dynamic rendering, synchronization2, timeline semaphore, descriptor indexing ve buffer device address ile Vulkan 1.3; bunları olmayan cihaz GLES 3 yolunu alır. `zig build vulkan-check` bir makineyi denetler ve tam bu özelliklerle çizer; Khronos doğrulaması altında hata bildirmiyor.
- **GPU'nun çizdiği bir komut listesi.** Yuvarlak köşeli ve kenarlıklı dikdörtgenler, yumuşak gölgeler ve metin şekil başına 64 bayt ve tek çağrıda çiziliyor. 2001 şekillik 1200×800 bir sahne R7 240'ta 0,65 ms; karede GPU'ya 128 KB gidiyor, bugünkü native yol ise 3,84 MB'lık kareyi yüklüyor. Metni HarfBuzz şekillendiriyor, her glif bir kez yükleniyor.
- **Native şablon bunu kullanıyor.** Ekranı ve pencerenin başlık çubuğu ile menüsü tek komut listesi; başlık artık çubukta yazıyor. Uygulama 10 sn'de 0,21 sn CPU harcıyor; CPU'da boyayıp kareyi yükleyen yol 0,82 sn. GPU yoksa o yola düşüyor.
- **Karar:** düzen motoru Lepton'un kendi flexbox'ı, Zig'de yazılacak.

## 0.1.6

- `npm create lepton-app` yeniden çalışıyor: 0.1.5'teki `create-lepton-app` projeyi oluşturmadan duruyordu (`lepton info --json`'u eski biçimde okuyordu). O paketin 0.1.5'i npm'de kullanımdan kaldırıldı.

## 0.1.5

- **`lepton record` ve `lepton replay`**: bir oturumun çekirdeğe yaptığı çağrılar dosyaya yazılıp pencereyle ya da penceresiz yeniden oynatılıyor.
- **Uygulama masaüstüne tek uygulama olarak görünüyor**: kendi systemd kapsamı sayesinde görev yöneticileri çekirdeği ve web motorunun süreçlerini onun adıyla gösteriyor; pencere başlığı `document.title`'ı izliyor.
- **Web motoru özellikleri**: hata ayıklama derlemelerinde denetçi (F12), bağlantıların masaüstünün tarayıcısında açılması, `window.open`, indirmeler, izin istekleri ve bildirimler. [Web özellikleri](/tr/docs/web-features/)
- **Yeni projelerde tek `lepton` betiği** (`pnpm lepton dev`), ve `lepton new` sorularını renkli soruyor.
- **Webview derlemeleri artık WPEBackend-fdo istemiyor** (Arch artık paketlemiyor); motor eksikse dağıtımınızın kurulum komutu yazılıyor.
