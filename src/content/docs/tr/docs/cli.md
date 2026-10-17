---
title: CLI
description: Tüm lepton komutları ve seçenekleri.
---

`lepton`, Rust ile yazılmış tek bir yerel programdır. npm paketi `@lepton-desk/cli` yalnızca onu başlatır; kurulum sonrası betik ya da indirme yoktur. Projede `lepton` betiğiyle çalıştırın: `npm run lepton <komut> -- <bayraklar>`, `pnpm lepton <komut> <bayraklar>`.

| Komut | Ne yapar |
| --- | --- |
| `lepton info` | Bu makinenin neyi derleyebildiğini ve neyin eksik olduğunu söyler; web motoru eksikse dağıtımınızın onu hangi komutla kurduğunu da. Betikler için `--json`. |
| `lepton new [ad]` | Proje oluşturur ve Lepton'u bağlar. |
| `lepton dev` | Geliştirme döngüsü: anında yenilenen Vite, çekirdek, pencere. |
| `lepton run` | Bir kez derler ve uygulamayı açar; arayüzü diskten okur. |
| `lepton build` | Sürüm derlemesi. |
| `lepton package` | Sürümü kurulabilir bir ağaç olarak dizer, sonra her paket biçimini yazar. |
| `lepton record` | Uygulamayı açar ve sayfanın çağırdığı her komutu kaydeder. *0.1.5* |
| `lepton replay <dosya>` | Kaydı çekirdeğe yeniden oynatır ve yanıtları karşılaştırır. *0.1.5* |

## `lepton new`

| Seçenek | |
| --- | --- |
| `-t, --template <ad>` | `vanilla-ts`, `vanilla-js`, `react-ts`, `react-js`, `vue-ts`, `svelte-ts`, `solid-ts` |
| `--target <native\|webview>` | Uygulamanın nasıl çizileceği. Verilmezse sihirbaz sorar; `--non-interactive` `native` seçer. |
| `--plugins <liste>` | Eklenecek eklentiler, virgülle: `os`, `clipboard`, `fs`, `dialog`. Her birinin tüm komutları `permissions`'a eklenir (kullandıklarınıza indirin); `fs` kapsam olarak `$APPDATA` alır. |
| `--package-manager <ad>` | `npm`, `pnpm`, `yarn` ya da `bun`. Verilmezse: `lepton`'ı başlatan, yoksa kuruluysa pnpm, yoksa npm. Sonraki komutlar projeyi izler: önce `packageManager` alanı, sonra kilit dosyası. |
| `--install` | Oluşturduktan sonra bağımlılıkları kurar. |
| `--identifier <kimlik>` | Uygulama kimliği (masaüstü girdisi, veri dizinleri). |
| `--width`, `--height` | İlk pencere boyutu, fiziksel piksel. Varsayılan 1200×800. |
| `--directory <dizin>` | Projenin oluşturulacağı yer. |
| `--non-interactive` | Hiçbir şey sormaz. |
| `--verbose` | Yazılan her dosyayı ve kanal adını listeler. |

## `lepton dev`

| Seçenek | |
| --- | --- |
| `-p, --port <port>` | Vite'ın portu; varsayılan 5173. |
| `--native` | Yerel çizim yolunu çalıştırır. |
| `--no-server` | Pencereyi `--port`'ta sizin başlattığınız sunucuya karşı açar. |
| `--print-plan` | Adımları çalıştırmak yerine yazdırır. |

## `lepton build`

`--native` / `--webview` çizim yolunu seçer; `--servo`, WebKit yerine deneysel Servo motorunu bağlar (`--linux` ile); `-n, --dry-run` planı yazdırır. `--windows` ve `--macos` yerel çizim yolunu Zig ile çapraz derler (`x86_64-windows-gnu`, `aarch64-macos`); webview yolu yalnız Linux'tadır ve iki çıktı da o sistemlerde henüz denenmedi.

`dev` ve `run` ayrıca `~/.local/share/applications/<identifier>.desktop` yazar, böylece görev çubuğu pencereyi adıyla eşleştirir; Lepton'ın yazmadığı bir girdinin üzerine asla yazmaz.

## `lepton run`

`--native` / `--webview`, eniyileştirilmiş çekirdek için `--release`, `--print-plan`.

## `lepton package`

`--native` / `--webview`, son derlemeyi paketlemek için `--no-build` ve `--verify`: yazılan her paket boş bir dizine açılır, başlatılır, ölçülür ve kapatılır; başlamazsa ya da arkada süreç bırakırsa komut başarısız olur.

## `lepton record` ve `lepton replay` *0.1.5*

`lepton record -o oturum.lrec` her isteği, yanıtı ve olayı yazar. Özel komutlar (dosya içerikleri, pano, seçilen yollar) `--unmasked` verilmedikçe yalnızca çerçeve başlıklarını tutar. `lepton replay oturum.lrec` kaydı pencere açmadan gerçek işleyicilerden geçirir ve bir yanıt farklıysa `1` ile çıkar; `--page` pencereyi açar ve sayfanın çağrılarını kayıttan yanıtlar.

`-o` verilmezse dosya projede `recording-<unix saniyesi>.lrec` olur. `replay`, `HOME` ve `XDG_*` boş bir geçici dizini gösterecek şekilde çalışır; dosyalarınıza dokunamaz. İkisi de `--release` (eniyileştirilmiş çekirdek) ve `--print-plan` alır.
