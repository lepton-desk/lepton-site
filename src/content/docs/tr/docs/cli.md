---
title: CLI
description: Tüm lepton komutları ve seçenekleri.
---

`lepton`, Rust ile yazılmış tek bir yerel programdır. npm paketi `@lepton-desk/cli` yalnızca onu başlatır; kurulum sonrası betik ya da indirme yoktur. Projede `lepton` betiğiyle çalıştırın: `npm run lepton <komut> -- <bayraklar>`, `pnpm lepton <komut> <bayraklar>`.

| Komut | Ne yapar |
| --- | --- |
| `lepton info` | Bu makinenin neyi derleyebildiğini ve neyin eksik olduğunu söyler; web motoru eksikse dağıtımınızın onu hangi komutla kurduğunu da. Betikler için `--json`. |
| `lepton new [ad]` | Proje oluşturur ve Lepton'u bağlar. |
| `lepton dev` | Geliştirme döngüsü: ön yüzün anında yenilenen dev sunucusu, çekirdek, pencere. |
| `lepton run` | Bir kez derler ve uygulamayı açar; arayüzü diskten okur. |
| `lepton build` | Sürüm derlemesi. |
| `lepton package` | Sürümü kurulabilir bir ağaç olarak dizer, sonra her paket biçimini yazar. |
| `lepton record` | Uygulamayı açar ve sayfanın çağırdığı her komutu kaydeder. *0.1.5* |
| `lepton replay <dosya>` | Kaydı çekirdeğe yeniden oynatır ve yanıtları karşılaştırır. *0.1.5* |
| `lepton update` | Var olan projenin çekirdeğini ve `src-lepton/` dosyalarını bu sürüme getirir, düzenlemelerinizi korur. *0.1.7* |

Terminalde çıktı renkli *0.1.7*: her adım süresiyle çerçeveleniyor, Lepton'un çalıştırdığı araçlar (Vite, pnpm, npm, Zig) kendi renklerini koruyor. `NO_COLOR` ya da boru düz metin verir; günlükler ve CI için.

## `lepton new`

| Seçenek | |
| --- | --- |
| `-t, --template <ad>` | `<çatı>-<dil>`: `vanilla`, `react`, `vue`, `svelte`, `solid`, `preact`, `lit`, `astro` ve `next`, her biri `-ts` ya da `-js`, ve `angular-ts`. Preact, Lit ve Vue, Svelte, Solid'in JavaScript sürümleri *0.1.9-beta.0*; Astro, Next.js ve Angular da, kendi `frontend` bölümleriyle ([Yapılandırma](/tr/docs/configuration/#frontend-019-beta0)). |
| `--target <native\|webview>` | Uygulamanın nasıl çizileceği. Verilmezse sihirbaz sorar; `--non-interactive` `native` seçer. |
| `--plugins <liste>` | Eklenecek eklentiler, virgülle: `os`, `clipboard`, `fs`, `dialog`. Her birinin tüm komutları `permissions`'a eklenir (kullandıklarınıza indirin); `fs` kapsam olarak `$APPDATA` alır. |
| `--package-manager <ad>` | `npm`, `pnpm`, `yarn` ya da `bun`. Verilmezse: `lepton`'ı başlatan, yoksa kuruluysa pnpm, yoksa npm. Sonraki komutlar projeyi izler: önce `packageManager` alanı, sonra kilit dosyası. |
| `--install` | Oluşturduktan sonra bağımlılıkları kurar. |
| `--identifier <kimlik>` | Uygulama kimliği (masaüstü girdisi, veri dizinleri). Verilmezse `com.<sahip>.<ad>`. |
| `--owner <ad>` | Uygulamayı yayımlayan, `com.<sahip>.<ad>`'ın ortası *0.1.9-beta.2*. Verilmezse sihirbaz sorar; varsayılanı Git'in `user.name`'i, o da yoksa `example`. |
| `--width`, `--height` | İlk pencere boyutu, fiziksel piksel. Varsayılan 1200×800. |
| `--directory <dizin>` | Projenin oluşturulacağı yer. |
| `--non-interactive` | Hiçbir şey sormaz. |
| `--verbose` | Yazılan her dosyayı ve kanal adını listeler. |

## `lepton dev`

| Seçenek | |
| --- | --- |
| `-p, --port <port>` | Dev sunucusunun portu; varsayılan 5173. |
| `--native` | Yerel çizim yolunu çalıştırır. |
| `--no-server` | Pencereyi `--port`'ta sizin başlattığınız sunucuya karşı açar. |
| `--print-plan` | Adımları çalıştırmak yerine yazdırır. |
| `--servo` | WPE WebKit yerine Servo'da çizer, **deneysel** *0.1.9-beta.2* (Linux; kitaplık `build --servo`'daki gibi). Ölçüldü: sayfa dev sunucusundan yükleniyor, bir düzenleme sayfayı yeniliyor, Ctrl+C geride çalışan bir şey bırakmıyor. |

Dev sunucusu projenin `frontend.devArgs`'ıyla başlatılır (yoksa Vite'ın bayraklarıyla). *0.1.9-beta.0* Pencere ancak sunucu bir bağlantı kabul edince açılır; önce duran bir sunucu, örneğin dolu bir portta, çıkış durumuyla bildirilir. Önceden, derleme önbelleğinden gelen bir çekirdek pencereyi sunucu dinlemeden açabiliyordu; sayfa da `null` kökende kalıyor, çekirdeğe her çağrı reddediliyordu.

## `lepton build`

`--native` / `--webview` çizim yolunu seçer; `-n, --dry-run` planı yazdırır. `--servo` (`--linux` ile) sayfayı WPE WebKit yerine Servo'da çizer, **deneysel** *0.1.9-beta.2*: kitaplığını `npm install -D @lepton-desk/servo-linux-x64@beta` ile kurun (ya da `LEPTON_SERVO_LIB`'i onu tutan bir dizine verin); o olmadan derleme bu gerekçeyle reddedilir. Servo yalnız Linux içindir; Windows'ta sayfayı WebView2 çizer. Klavye ve tekerlek sayfaya ulaşır; dead key, compose ve giriş yöntemleri henüz yok. `--windows` ve `--macos` Zig ile çapraz derler (`x86_64-windows-gnu`, `aarch64-macos`). Linux'tan `--windows`, webview yolunu WebView2 için derler *0.1.9-beta.0*: yalnız Windows'un kendi DLL'lerini içe aktaran 1,1 MB'lık bir `.exe`; bir Next.js projesinden derlenen Windows 10'da açıldı ve sayfası çekirdeğe ulaştı *0.1.9-beta.1*; yerel çizim yolu Windows'ta henüz çalışmıyor, macOS çıktısı denenmedi.

`dev` ve `run` ayrıca `~/.local/share/applications/<identifier>.desktop` yazar, böylece görev çubuğu pencereyi adıyla eşleştirir; Lepton'ın yazmadığı bir girdinin üzerine asla yazmaz.

## `lepton run`

`--native` / `--webview`, eniyileştirilmiş çekirdek için `--release`, `--print-plan`, `--servo` (WPE WebKit yerine Servo, `build`'deki gibi) *0.1.9-beta.2*.

## `lepton package`

`--native` / `--webview`, son derlemeyi paketlemek için `--no-build` ve `--verify`: yazılan her paket boş bir dizine açılır, başlatılır, ölçülür ve kapatılır; başlamazsa ya da arkada süreç bırakırsa komut başarısız olur.

## `lepton record` ve `lepton replay` *0.1.5*

`lepton record -o oturum.lrec` her isteği, yanıtı ve olayı yazar. Özel komutlar (dosya içerikleri, pano, seçilen yollar) `--unmasked` verilmedikçe yalnızca çerçeve başlıklarını tutar. `lepton replay oturum.lrec` kaydı pencere açmadan gerçek işleyicilerden geçirir ve bir yanıt farklıysa `1` ile çıkar; `--page` pencereyi açar ve sayfanın çağrılarını kayıttan yanıtlar.

`-o` verilmezse dosya projede `recording-<unix saniyesi>.lrec` olur. `replay`, `HOME` ve `XDG_*` boş bir geçici dizini gösterecek şekilde çalışır; dosyalarınıza dokunamaz. İkisi de `--release` (eniyileştirilmiş çekirdek) ve `--print-plan` alır.

`--page --close` *0.1.7* kayıt oynatılınca çalışmayı kendisi bitirir; böylece bir kayıt test olur: son kayıtlı çağrıdan 1,5 sn sonra (bu sürede gelen fazladan çağrı ayrışma sayılır) ya da eksik çağrı varsa kaydın süresinden 10 sn sonra. Sayfa aynı çağrıları aynı argümanlarla yaptıysa çıkış `0`.

## `lepton update` *0.1.7*

Çekirdeği projeye yalnız `lepton new` yazar; sonradan gelen düzeltmeler var olan projeye bu komutla ulaşır. `src-lepton/vendor/lepton-core`'u değiştirir, `main.zig`, `build.zig` ve `lepton-commands.zig`'i güncel şablona getirir:

- hiç düzenlemediğiniz dosya değiştirilir;
- düzenlenmiş dosya üç yollu birleştirilir — yapıldığı sürüm, sizin dosyanız, bugünkü şablon — komutlarınız ve durumunuz kalır;
- düzenlemeniz ile şablonun değişikliği aynı satırlara dokunuyorsa hiçbir şey yazılmaz: `main.zig.merge` ikisini çakışma işaretleriyle tutar; çözüp `lepton update`'i yeniden çalıştırırsınız.

*0.1.8* İşe paketlerden başlar: kayıt defterine en yeni `@lepton-desk/cli` sürümünü sorar (ya da `--to <sürüm>`'ü alır; betadaki CLI en yeni betayı da sorar *0.1.9-beta.0*), projenin `@lepton-desk/*` bağımlılıklarını ona yükseltir (`link:`, `file:` ya da `workspace:` olanlara dokunmaz) ve projenin kendi paket yöneticisiyle kurar; kilit dosyası da güncellenir. Bu sürüm çalışan CLI'dan yeniyse işi yeni kurulan CLI bitirir, çünkü yazdığı çekirdek ve şablonlar onunkidir. Yani bir projeye `pnpm lepton update` yeter. `--no-install` package.json'a dokunmaz, yalnız çekirdeği ve şablonları günceller. `tsconfig.json`'ında `"jsx"` olmayan React projesine (0.1.7'den önce açılan react-ts projeleri) o satır eklenir; `$schema`'sı eski adrese gösteren bir `lepton.config.json` da yenisine taşınır.

0.1.8'den önce açılmış bir proje eski CLI'yı çalıştırır; o paketleri henüz yükseltmez (0.1.6'da `update` hiç yok). Bir kerelik, kayıt defterindeki en yeni CLI'yı çalıştırın: `npx @lepton-desk/cli@latest update`, Arch'ta `lepton-desk update` ya da pnpm'de tam sürümle `pnpm dlx @lepton-desk/cli@0.1.8 update`. pnpm'de bir sürümün ilk gününde `@latest` yetmez: pnpm `minimumReleaseAge`'dan genç sürümleri atlıyor ve yerine 0.1.6'yı çalıştırdı (ölçüldü).

pnpm 11 ve üstünde bir günden genç bir sürüm, pnpm'in `minimumReleaseAge` ayarı istisnaya izin verdiği için kurulur; istisnaları `pnpm-workspace.yaml`'a pnpm kendisi ekler. `minimumReleaseAgeStrict` açıksa sürümü bekletir ve `lepton update` bunu söyler.

`--dry-run` neyin değişeceğini söyler. Sonra `lepton build`.
