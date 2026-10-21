---
title: Değişiklikler
description: Her Lepton sürümünde ne değişti, bir sonraki sürüm için trunk'ta ne var ve 0.2.0 ne kadar ilerledi. Her sayı ölçüldü.
---

Bu sayfadaki her sayı projenin kendi makinesinde (Radeon R7 240, Linux, Wayland) ölçüldü; komutu depoda kayıtlı.

## Trunk'ta, 0.1.9-beta.2 için *yayınlanmadı*

- **Tek çalışan kopya ve derin bağlantılar.** İkinci başlangıç argümanlarını çalışan kopyaya verir; onun sayfası bunu `app.opened` olarak duyar. `lepton.config.json`'daki `deepLinks` URL şemalarını kaydeder (Linux'ta masaüstü girdisi, MSI'da `HKCU\Software\Classes`). `@lepton-desk/api/app` `launchArgs()` ve `onOpened()` verir. Linux'ta ölçüldü: `xdg-open myapp://open/43` çalışan sayfaya ulaştı, ikinci pencere açılmadı; kapalı bir uygulamayı açan bağlantı `launchArgs()`'ta geldi. [Yapılandırma](/tr/docs/configuration/)
- **`fs.watch`.** İzlenen klasörün değişiklikleri sayfaya olduğu anda ulaşır, yoklama yok: sayfanın kendi yazdığı ve başka bir programın yazdığı ikisi de bildirildi (`created`, `modified`). Linux'ta ve Windows'ta (aşağıda). [Eklentiler](/tr/docs/plugins/)
- **Panoyu okumak kullanıcıyı gerektiriyor.** `readText` yalnızca pencerede bir tuşa ya da düğmeye basıldıktan sonraki beş saniyede cevap verir; kararı çekirdek gerçek girdiden verir. Sayfa yüklenirken okuma reddedilir (`NotAllowedError`), bir tıklamadan sonraki cevaplanır (ölçüldü). Pano yöneticisi için `"plugins": { "clipboard": { "read": "always" } }`.
- **Varsayılan simge Lepton'ın işareti.** Yeni projeler `src-lepton/icon.svg` alır; Linux paketleri onu `share/icons` altına kurar ve girdiye `Icon=` yazar; `bundle.icon` verilmemişse MSI onun `.ico`'sunu kullanır.
- **Yeni kimlik `com.<sahip>.<uygulama>`.** Sihirbaz uygulamayı kimin yayımladığını sorar (varsayılan: Git'in `user.name`'i), `--owner` bunu komut satırında söyler. Önceden çıplak uygulama adıydı.
- **`lepton dev`'de Ctrl+C geride bir şey bırakmıyor.** Ctrl+C uygulamaya ve CLI'ye ulaşır, CLI de SIGTERM gönderir; çekirdek bu ikinci sinyali "takıldı" sayıp kanalını silmeden çıkıyordu (`/dev/shm`'de dört dosya, ölçüldü) ve CLI `✖ app failed` yazıyordu. Bir saniye içindeki ikinci sinyal artık aynı istek: dosya kalmıyor, `✔ app`.
- **Kanal adları kullanıcıya özel** (`.u<uid>`); başka bir kullanıcı `/dev/shm`'de adı alıp uygulamanın açılmasını engelleyemiyor. Hemen cevap veren ertelenmiş özel bir komut da diğerleri gibi maskeli kaydediliyor.
- **Lepton'ı Zig 0.16 de 0.17 de derliyor.** 0.17 `@cImport`'u ve `**`'yı kaldırdı, derleme API'sinde `findProgram` ile `getInstallPath`'i değiştirdi ve bir türün alanlarını başka biçimde veriyor. C başlıkları artık derleme tarafından çevriliyor (`src/c/`; 0.16 da böyle yapıyor), kalan farkların her biri tek bir yerde (`compat.zig`, `build_support.zig`'deki `zig_017`). Her iki sürümle ölçüldü: çekirdeğin testleri ile GPU, sahne, Vulkan ve invoke denetimleri; bütün eklentileriyle bir webview uygulaması (derlendi, çalıştırıldı, Windows için çapraz derlendi); bir yerel uygulama. CLI `zig`, `zig-0.17` ya da `zig-0.16`'dan önce bulduğunu alıyor.
- **Lepton bir Zig 0.16'yı kendisi seçiyor.** Zig 0.17, Lepton'ın kendi `build.zig`'inde duruyor (8 hata, ölçüldü) ve Arch `zig`'ini 0.17'ye taşıdı. CLI artık `LEPTON_ZIG` verilmişse onu, yoksa `PATH`'teki `zig` ve `zig-0.16`'dan 0.16 diyen ilkini kullanıyor; uygun yoksa bulduğu sürümü söylüyor. Arch paketleri AUR'daki `zig0.16-bin`'e bağlı ve onu CLI'ye veriyor; sistemin `zig`'i güncellenebilir. [Sistem gereksinimleri](/tr/docs/requirements/)
- **Güncel Arch'ta hata ayıklama derlemeleri yeniden bağlanıyor.** glibc 2.44'ün `crt1.o`'su, Zig 0.16'nın hata ayıklama derlemelerinde kullandığı kendi bağlayıcısının okuyamadığı bir `.sframe` bölümü taşıyor; yeni bir webview projesinde `zig build` komut tiplerini üreten yardımcıda düştü, çekirdeğin testleri de aynı yerde. Artık her Linux ikilisi bu bölümü okuyabilen LLVM ve LLD ile bağlanıyor (Zig 0.17'nin bağlayıcısı da okuyor).
- **beta.1 ile oluşturulan bir proje `lepton update`'ten sonra yeniden `dev` çalıştırıyor.** beta.1'in CLI'si `PATH`'teki `zig` neyse onu çalıştırıyordu; Arch'ın Zig 0.17'siyle yeni bir proje `build.zig`'inde duruyordu (`no field named 'ReleaseSmall'`), Zig 0.16 ile de hata ayıklama derlemesi yukarıdaki bağlayıcı sorununda. Böyle bir projenin kopyasında trunk'ın CLI'siyle ölçüldü: `lepton update` `main.zig`'i, `build.zig`'i ve çekirdeğin 27 dosyasını değiştirdi; ardından `lepton build` geçti, `lepton dev` çekirdeği derleyip pencereyi açtı. beta.2 çıkınca projede `npm run lepton update` (ya da `pnpm lepton update`) yeterli.
- **Çekirdek yalnızca uygulamanın kendi sayfasına cevap veriyor.** Her çalıştırma rastgele bir anahtar üretiyor; çekirdeğin yolları (`invoke`, olaylar, halka, `close`) `/__lepton/<anahtar>/` altında. Anahtar yalnızca transport'a yazılıyor; çekirdek transport'u artık yalnızca uygulamanın kendi sayfasına ekliyor. WPE WebKit'te ölçüldü: uygulamanın gittiği başka bir sayfa önceden çekirdeğe ulaşıyordu (5 istek), artık hiç istek yapmıyor; sandbox'lı bir iframe'in anahtarsız isteği reddediliyor.
- **Başka siteler pencereye girmiyor.** Pencereyi başka bir siteye götüren bağlantı ya da betik, siteyi sistem tarayıcısında açıyor (yalnızca http, https ve mailto; `tel:` ve diğer şemalar artık iletilmiyor); bu üç motorda da böyle ve oradaki sayfa transport almıyor.
- **Dosya izinleri uygulamanın state klasöründe** (`~/.local/state/<identifier>`, `%LOCALAPPDATA%\<identifier>\State`), `fs` eklentisinin kapsamlarının erişemeyeceği yerde. Kaydetme penceresi klasöre değil, kaydettiği dosyaya izin veriyor; hiçbir izin ev klasörünü ya da üstünü kapsamıyor. beta.1'de izin verilen klasörler bir kez daha soruluyor.
- **`lepton.config.json`'daki adlar denetleniyor.** `productName`, `window.title`, `identifier` ve `version` kontrol karakterlerini, ad ve identifier yol ayırıcılarını reddediyor; üretilen Zig'e, masaüstü girdilerine ve `.deb` control dosyalarına yazılan değerler kaçışlanıyor. [Şema](/schema/config.json) aynı kuralları taşıyor.
- **Küçük düzeltmeler:** `plugin-fs` dosyanın sonundan öteki bir ofsette çekirdeği durdurmak yerine boş dönüyor, parça parça kaydedilen dosya eskisinin izinlerini koruyor; `lepton replay` geçici ev klasörünü yeni ve yalnızca sahibine açık oluşturuyor; `lepton update` kayıt defterinden yalnızca semver ön sürümü kabul ediyor; komut tipleri hiçbir zaman bir bağlantının üzerinden yazılmıyor.
- **`--servo`, kitaplığı varsa Servo'yu bağlıyor, yoksa gerekçesiyle reddediliyor.** Önceden 0 ile çıkıp WPE WebKit'li bir ikili veriyordu. Servo artık çekirdeğin üçüncü motoru; yalnızca CI'da derlenip ölçülüyor (`servo-bridge`): `--servo` ile derlenen bir şablon uygulaması 1200×800 açıldı ve sayfası çekirdeğin halkasını anahtarlı yoldan okudu. Kitaplığı `@lepton-desk/servo-linux-x64` olarak geliyor (Linux x86-64, deneysel; CI derliyor); `--servo` onu projede bulur; `lepton build`, `run` ve `dev`'in üçü de `--servo` alıyor. `dev`'de uygulama kapanırken asılı kalıyordu: Servo'nun kapanışı her worker'ı süresiz bekliyor, Vite istemcisininki hiç durmadı. Çekirdek artık Servo'yu sürecin sonuna bırakıp kendi temizliğinden sonra `_exit` ile çıkıyor (ölçüldü: Ctrl+C hemen bitiriyor, dosya kalmıyor, SIGTERM'de çıkış kodu 0).
- **Servo: depolama, pencere olayları ve kapat düğmesi.** Servo `lepton://` sayfalarına opak köken veriyordu, `localStorage` `SecurityError` atıyordu; Lepton artık Servo'yu `servo-url`'ye küçük bir yamayla derliyor, uygulamanın şeması WPE WebKit'teki gibi (şema, host) kökeni alıyor (ölçüldü: `localStorage` yeniden açılışlarda kaldı, `runs` 1, 2, 3). `window.resized` Servo sayfasına hiç ulaşmıyordu ve pencere `WM_DELETE_WINDOW`'u bildirmediği için pencere yöneticisinin kapatması uygulamaya varmıyordu; ikisi düzeltildi (ölçüldü: büyütme ve geri almada WPE ile aynı boyutlar, `WM_DELETE_WINDOW`'da temiz çıkış).
- **Paketlenmiş sayfada `document.cookie`.** Linux'taki iki motor HTML standardı gereği `lepton://` sayfasına çerez vermez; Lepton artık orada `document.cookie`'yi tanımlıyor, `localStorage`'da tutuyor (WPE WebKit ve Servo'da ölçüldü: bir çalıştırmada yazılan çerez sonrakinde okundu). Gerçek çerezler, dev sunucusunun sayfasında, iki motorda da çalıştırmadan sonra kalmıyordu: WPE onları bir dosya verilene kadar bellekte tutuyordu (artık uygulamanın veri klasöründe `cookies.sqlite`), Servo da kavanozunu yalnız çekirdeğin atladığı kapanışın sonunda yazıyor (`servo`'ya küçük bir yama onu önceden yazdırıyor). Ölçüldü: iki motorda da sonraki açılışta okundu. [Web özellikleri](/tr/docs/web-features/#depolama-ve-çerezler-019-beta2)
- **`lepton run`'da Ctrl+C uygulamayı her zaman bildiriyor.** Sinyal işleyicisinin çıkışı uygulamanın satırıyla yarışıyordu; dört Ctrl+C'den biri `lepton run`'ı `✔ app` olmadan bitirdi (ölçüldü). İşleyici artık o satırı bekliyor; altıda altı bildirdi, çıkış kodu 130.
- **Kendi başlık çubuğunuz, yerel menüler ve sayfayı izleyen başlık çubuğu.** `"window": { "decorations": false }`, `@lepton-desk/api/window`'da `dragRegion` ve `popupMenu`. Windows 10'da gerçek girdiyle ölçüldü: sayfanın çubuğu pencereyi taşıdı, çift tıklama büyüttü, sol kenar boyutlandırdı; sistem menüsü klavyeyle seçti, ayırıcıyı atladı, Esc `null` verdi. Windows'ta başlık çubuğu sayfanın `color-scheme` ve `theme-color`'ını alır (koyu ve açık ölçüldü; Windows 10'un hemen yeniden çizmesi için `WM_NCACTIVATE` gerekti). Linux'ta Servo altında pencere çerçevesini bırakır (`_MOTIF_WM_HINTS`), çubuk onu taşır (`_NET_WM_MOVERESIZE`), menü Lepton'ın kendisidir ve uygulama odağı kaybedince kapanır (COSMIC'te elle ölçüldü); WPE WebKit altında bu üçü Lepton'ın kendi WPE platformunu bekliyor. [Komutlar](/tr/docs/commands/#kendi-başlık-çubuğunuz-ve-menüleriniz-019-beta2)
- **Sağ tuş Servo sayfasına ulaşıyor.** Çekirdeğin X11 penceresi sağ basışı native yolun çerçeve menüsüne veriyordu, Servo sayfası `mousedown` 2'yi ve `contextmenu`'yü hiç görmüyordu; artık görüyor.
- **Windows'ta: başlık çubuğunda uygulamanın simgesi, küçük ekrana sığan pencere, `fs.watch` ve odaksız pano yazma.** Çalıştırılabilir dosya simgeyi taşır (`bundle.icon` ya da Lepton'ınki); 1024×768 ekranda 1200×800'lük pencere çalışma alanına sığdırılmış açılır; `fs.watch` `ReadDirectoryChangesW` kullanır (oluşturma, değişiklik, ad değişikliği, silme, özyinelemeli; ağaçtaki junction reddedilir); `writeText` orada artık odak beklemiyor. Hepsi Windows 10'da ölçüldü.
- **`app.args` yeni projenin izinlerinde,** kayıtlar döndürdüğünü maskeler (başlatma argümanı OAuth kodu gibi bir sır taşıyabilir).
- **Windows 11'de başlık çubuğu sayfanın rengini alır (ölçüldü).** Lepton'ın `windows` iş akışı Windows Server 2025'te (Windows 11'in tabanı, derleme 26100) şablon uygulamayı derleyip açıyor: sayfa `theme-color: #ffd700` verince çubuk `rgb(255, 215, 0)`, yazı siyah; `rgb(27 29 28)` verince çubuk o renk, yazı beyaz. Aynı iş MSI'yı kuruyor, kurulu uygulamayı aynı denetimlerden geçiriyor ve geride klasör bırakmadan kaldırıyor.
- **npm `.cmd` olarak kuruluyken Windows'ta `lepton new` çalışır.** Node'un kurucusu npm'i `npm.cmd` olarak veriyor (npm ile kurulan pnpm da öyle); CLI yalnız `.exe` arıyordu ve npm kuruluyken "`npm` is not found on PATH" diyordu (CI'da ölçüldü). Artık ad, kabuğun yaptığı gibi `PATHEXT` sırasıyla aranıyor. `lepton new` Windows'ta motoru artık WebView2 diye yazıyor.
- **Windows'ta Zig 0.17.** Çekirdek testleri, eklentiler, araçlar ve şablon uygulama 0.17 ile de derlenip çalıştı (Windows 10), 0.16 ile aynı sonuçla.

## 0.1.9-beta.1 *2026-10-20, beta*

- **Windows'ta eklentiler.** `os`, `fs` ve `dialog` bir WebView2 uygulamasında uçtan uca ölçüldü; `clipboard` Windows için yazıldı ama orada henüz ölçülmedi (test için sürülen pencerede odak yok, `writeText` de odağı bekliyor). `plugin-dialog` Windows'un kendi dosya pencerelerini açıyor; `plugin-fs` kapsamını kapsam klasörüne göre tek bir `NtCreateFile` ile koruyor ve klasörden dışarı çıkan her bağlantıyı reddediyor; Linux'takinden de katı (klasörün içine konmuş bir junction bayrak olmadan açıldı, bayrakla reddediliyor; ölçüldü). `plugin-os` Windows sürümünü, makine adını ve yerel ayarı veriyor. `$APPDATA`, `$APPCACHE` ve diğer klasörler Windows'un Known Folders'ından geliyor.
- **WebView2'de yeni projede konsol hatası yok.** WebView2 her sayfada `/favicon.ico` istiyor; 404 artık boş bir 204.
- **Linux'tan çapraz derlenen `.exe` Windows'ta açılıyor.** Bir Next.js projesinden derlenen Windows 10'da açıldı: tablosu doldu, kökeni `http://lepton.localhost` idi ve kapanınca geride WebView2 süreci kalmadı.
- 0.1.9-beta.0'ın Windows ikilisi eklentiler orada çalışmadan önce yayımlanmıştı ve npm bir sürümü bir kez alıyor; bu yüzden bütün paketler birlikte beta.1'e geçti.

## 0.1.9-beta.0 *2026-10-19, beta*

`beta` etiketiyle yayında: `npm create lepton-app@beta`, pnpm'de ise tam sürümle `pnpm dlx create-lepton-app@0.1.9-beta.1`. 0.1.9'un kalanı (başlangıç ekranları, WebAssembly, isteğe bağlı sunucu işleme) 0.1.9'un kendisinden önce geliyor. [Her çatının ihtiyacı](/tr/blog/astro-next-angular/)

### Şablonlar

- **Astro, Next.js ve Angular.** `astro-ts`, `astro-js`, `next-ts`, `next-js` ve `angular-ts`; her biri diğerleriyle aynı başlangıç ekranıyla. Next.js statik bir site dışa aktarıyor (`out/`) ve ekranı yalnızca pencerede yüklüyor; Astro'nun sayfası düz DOM ekranını yüklüyor. Sıfırdan projelerle ölçüldü: `biome check` ve `tsc` derlemeden önce ve sonra geçiyor, `lepton package --verify` geçiyor, `run` ve `dev` altında pencerede konsol hatası yok.
- **Her Vite şablonunun JavaScript sürümü, Preact ve Lit:** `vue-js`, `svelte-js`, `solid-js`, `preact-ts`/`js`, `lit-ts`/`js`. Toplam 19 şablon. JavaScript projeleri oluşturuldukları hâliyle `biome check`'ten geçiyor.

### Komutlar

- **`lepton.config.json`'da `frontend` ayarı:** derlemenin nereye gittiği (`dist`) ve dev sunucusunun portu ile adresi nasıl aldığı (`devArgs`, `{port}` ve `{host}` ile). Ayar yoksa proje eskisi gibi bir Vite projesi.
- **`lepton dev` pencereyi dev sunucusu dinleyince açıyor.** Çekirdek önbellekten gelince pencere Astro hazır olmadan açılıyordu; sayfa `null` kökende kalıyor, çekirdeğe her çağrı reddediliyordu. Önce duran bir sunucu (dolu port) çıkış durumuyla bildiriliyor.
- **Betadaki `lepton update` en yeni betayı da soruyor;** `latest` son sürümde kalıyor. Eski projelerin `$schema`'sı yeni adrese taşınıyor.
- Hata ayıklama derlemeleri sayfanın konsolunu terminale yazıyor. pnpm'in ve npm'in kendi çıktısı `lepton` altında da renkli kalıyor.

### Diğerleri

- **`lepton.config.json` için bir JSON şeması,** [bu siteyle yayında](/schema/config.json): CLI'nin denetlediği her kural ve bilinmeyen alanların işaretlenmesi; `devArg` gibi bir yazım hatası editörde görünüyor. Projeler eskiden hiç çözülmeyen bir adrese gösteriyordu.
- **Linux'tan Windows derlemesi bağlanıyor.** `lepton build --windows`, Windows ikilisine pkg-config'in bulduğu Linux kütüphanelerini veriyordu; artık yalnızca Windows DLL'lerini içe aktaran 1,1 MB'lık bir `.exe`. Bu sürümde henüz Windows'ta açılmamıştı; sonra açıldı (0.1.9-beta.1).
- `create-lepton-app`, Windows'ta motor eksikse WPE WebKit'i değil WebView2'yi söylüyor.

## 0.1.8 *2026-10-18*

- **`lepton update` paketleri de güncelliyor.** Kayıt defterine en yeni sürümü soruyor, projenin `@lepton-desk/*` bağımlılıklarını ona yükseltiyor, projenin paket yöneticisiyle kuruyor ve işi yeni kurulan CLI'ya devrediyor; çekirdeği ve şablonları o güncelliyor. 0.1.7'nin yayın günü bulundu: 0.1.6 projesinde kilit dosyası CLI'yı 0.1.6'da tutuyordu, onda da `update` yok; yani proje daha yeni bir çekirdeğe kendi başına ulaşamıyordu. 0.1.8'den sonra `pnpm lepton update` yetiyor; daha eski bir proje en yeni CLI'yı bir kez çalıştırıyor. [CLI](/tr/docs/cli/#lepton-update-017)
- **0.1.7'den önce açılan React projeleri yine tür denetiminden geçiyor**: `lepton update`, `tsconfig.json`'larında eksik olan `"jsx"` ayarını ekliyor (`tsc` her bileşende hata veriyordu).
- Gerçek bir 0.1.6 projesinin kopyasında ölçüldü: tek bir `pnpm dlx @lepton-desk/cli@0.1.8 update` altı paketi 0.1.8'e taşıdı, çekirdeği ve `tsconfig.json`'ı yeniledi, proje derlendi.

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

## Windows *0.1.9-beta.0'da*

Bir uygulama Windows 10'da WebView2 ile derleniyor, çalışıyor ve paketleniyor. Aşağıdaki değişiklikler sonradan Linux'ta yeniden denetlendi: testler, iki çizim yolu, bir web görünümü uygulaması ve onun üç Linux paketi. Aynı makinede Windows 10 22H2 altında ölçüldü:

- **Gerçek bir pencerede WebView2.** `zig build webview2-check` bir Win32 penceresi açıyor, içine WebView2'yi yerleştiriyor, bir sayfa yüklüyor, sayfada betik çalıştırıyor ve bir kare yakalıyor. Kurulu çalışma zamanı (burada 155) Microsoft'un yükleyicisinin bulduğu yoldan bulunuyor ve kendi DLL'i doğrudan çağrılıyor; yani `WebView2Loader.dll` taşınmıyor, depoda yalnız Microsoft'un `WebView2.h`'si var, BSD tarzı lisansıyla. Sayfa 704 ms'de yüklendi, betik 719 ms'de yanıt verdi, kare 829 ms'de yakalandı. WebView2 Chromium'dur, Windows'la gelen kopyası: kutuda tarayıcı yok, ama Chromium'suz da değil.
- **CLI Windows'ta derleniyor ve testleri geçiyor** (293). `lepton new` orada çalışıyor; `build`, `dev` ve `run` henüz çalışmıyor, çünkü çekirdeğin paylaşımlı bellek kanalı ve pencere katmanı Linux'unki.
- **Alt süreçler Lepton'la birlikte bitiyor.** Windows'ta `lepton`, bittiğinde başlattığı her şeyi bitiren bir iş nesnesine (job object) giriyor; zorla öldürülse bile. Orada yalnız `cmd`'yi bitirmek, geliştirme sunucusunun Node sürecini ayakta bırakıyordu.
- **Her klonda LF.** Windows klonundan derlenen CLI şablonları CRLF satır sonlarıyla gömüyordu ve `zig fmt` üretilen `main.zig`'i reddediyordu. Depo artık her yerde LF tutuyor.
- **Webview yolu WebView2'de çalışıyor.** `lepton new`, `build`, `dev`, `run`, `record` ve `replay` çalışıyor. Sayfa `http://lepton.localhost` üzerinden sunuluyor ve Linux'takiyle aynı köprü yanıtlıyor: `invoke` (sayfadan 2 ms), olaylar, paylaşımlı bellek halkası, pencere komutları, `webPermissions`, indirmeler, `window.open`, pano. Derlenmiş bir uygulama 7 süreç ve yaklaşık 100 MiB özel çalışma kümesi, bunun 3,3 MiB'ı çekirdek; kapatınca geride WebView2 süreci kalmıyor.
- **Windows'ta `lepton package`.** Tekrarlanabilir bir `.zip` ve **WiX'siz yazılan bir MSI**: WiX 3–5 artık desteklenmiyor, 6 ve sonrası bir bakım ücretine bağlı; bir framework bunu onu kullanan her şirkete yüklememeli. MSI yönetici izni olmadan kullanıcı başına kuruluyor, Başlat menüsüne kısayol ekliyor, eski sürümü yükseltiyor ve düşürmeyi reddediyor, temiz kaldırılıyor ve Windows SDK'nın ICE doğrulamasından 0 hatayla geçiyor. `--verify` paketlenmiş uygulamayı başlatıp ölçüyor ve kapatıyor, Linux'taki gibi Windows'ta da.
- Henüz yok: Windows'ta native çizim, MSIX (kod imzalama sertifikası gerekiyor). Eklentiler 0.1.9-beta.1'de geldi. İmzasız yükleyiciler, diğer framework'lerdekiler gibi, Windows'un SmartScreen uyarısını alıyor.

## 0.1.6

- `npm create lepton-app` yeniden çalışıyor: 0.1.5'teki `create-lepton-app` projeyi oluşturmadan duruyordu (`lepton info --json`'u eski biçimde okuyordu). O paketin 0.1.5'i npm'de kullanımdan kaldırıldı.

## 0.1.5

- **`lepton record` ve `lepton replay`**: bir oturumun çekirdeğe yaptığı çağrılar dosyaya yazılıp pencereyle ya da penceresiz yeniden oynatılıyor.
- **Uygulama masaüstüne tek uygulama olarak görünüyor**: kendi systemd kapsamı sayesinde görev yöneticileri çekirdeği ve web motorunun süreçlerini onun adıyla gösteriyor; pencere başlığı `document.title`'ı izliyor.
- **Web motoru özellikleri**: hata ayıklama derlemelerinde denetçi (F12), bağlantıların masaüstünün tarayıcısında açılması, `window.open`, indirmeler, izin istekleri ve bildirimler. [Web özellikleri](/tr/docs/web-features/)
- **Yeni projelerde tek `lepton` betiği** (`pnpm lepton dev`), ve `lepton new` sorularını renkli soruyor.
- **Webview derlemeleri artık WPEBackend-fdo istemiyor** (Arch artık paketlemiyor); motor eksikse dağıtımınızın kurulum komutu yazılıyor.
