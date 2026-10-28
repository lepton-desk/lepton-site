---
title: Paketleme
description: Tek komutla Linux'ta tar.gz, .deb ve Arch, Windows'ta .zip ve MSI paketleri.
---

```sh
npm run lepton package
```

`lepton package` bir sürüm derler ve onu `src-lepton/bundle/<ad>-<sürüm>-<sistem>-<mimari>/` altına dizer (Linux'ta bir masaüstü girdisiyle); sonra `bundle.targets` içindeki her biçimi yazar. Varsayılan Linux'ta `tar.gz`, Windows'ta `zip`; Linux paketleri Windows'ta daha hiçbir şey derlenmeden reddedilir.

```json
{
  "bundle": {
    "targets": ["tar.gz", "deb", "arch"],
    "maintainer": "Adınız <siz@example.com>"
  }
}
```

| Biçim | |
| --- | --- |
| `tar.gz` | Kurulum öneki; her yere açılabilir. |
| `arch` | Arch Linux paketi (`.pkg.tar.zst`). Bağımlılıklar ikilinin bağlı kütüphanelerinden çıkarılır. |
| `deb` | Debian paketi. `bundle.maintainer`, ayrıca Debian kuralının istediği copyright dosyası için `bundle.copyright` ve `bundle.license` *0.1.9-beta.3* gerekir. Bağımlılık adları `dpkg-query`'den ya da onun olmadığı makinede `bundle.deb.depends`'ten gelir; asla tahmin edilmez. |
| `zip` | Windows *0.1.9-beta.0*: kurulum öneki, `bin\<ad>.exe` ve yanında ön yüz. |
| `msi` | Windows *0.1.9-beta.0*: WiX olmadan Lepton'un kendisinin yazdığı bir Windows Installer paketi. Yönetici izni istemeden kullanıcı başına kurulur (`%LOCALAPPDATA%\Programs\<ürün>`), Başlat menüsüne kısayol ekler, eski sürümü yükseltir, aynı sürümün başka bir derlemesini onun yerine kurar *0.1.9-beta.2* (Windows Installer yalnız `major.minor.build`'i karşılaştırır; `1.0.0-beta.1` → `1.0.0-beta.2` onun için aynı sürümdür), sürüm düşürmeyi reddeder, temiz kaldırılır. `bundle.icon` (bir `.ico`) kısayolun ve Uygulamalar listesinin simgesidir. Windows SDK'nın ICE doğrulamasından hatasız geçer. |

**Paketlerin uygulama hakkında söyledikleri** *0.1.9-beta.3*. `bundle` içinde isteğe bağlı altı alan:

```json
{
  "bundle": {
    "description": "Çevrimdışı notlar",
    "longDescription": "Notlar notlarınızı makinenizde tutar.\n\nHesap yok, eşitleme yok.",
    "license": "MIT",
    "homepage": "https://example.com/notes",
    "copyright": "© 2026 Örnek",
    "category": "Office"
  }
}
```

`description` (tek satır) masaüstü girdisinin `Comment`'i, Arch'ın `pkgdesc`'i ve `.deb`'in özetidir; yoksa `productName`. `longDescription` `.deb`'in uzun açıklamasıdır. `license` (bir SPDX ifadesi) ve `homepage` Arch paketine (`license`, `url`) ve `.deb`'e (`Homepage`) gider. `copyright` ve `license` verilince Linux paketleri Debian'ın makine okunur biçiminde `share/doc/<paket>/copyright` taşır. `category` masaüstü girdisinin ana kategorisidir (`AudioVideo`, `Audio`, `Video`, `Development`, `Education`, `Game`, `Graphics`, `Network`, `Office`, `Science`, `Settings`, `System` ya da `Utility`); yoksa `Development`. Her Linux paketi ayrıca `share/metainfo/<identifier>.metainfo.xml` taşır *0.1.9-beta.3*: GNOME Yazılım, KDE Discover ve Flathub'ın uygulama kurulmadan önce gösterdiği bilgiler. Ad, özet olarak `description`, paragraflar olarak `longDescription`, `license`, `homepage`, geliştirici (`bundle.maintainer`'ın adı, kimliğinizin sahip kısmının altında), program ve `SOURCE_DATE_EPOCH` ile, o yoksa `bundle.releaseDate` (`YYYY-AA-GG`) ile tarihlenen sürüm; ikisi de yoksa sürüm yazılmaz, çünkü AppStream tarihsiz sürümü reddeder, ve `lepton package` uyarır. Yaş derecelendirmesi `bundle.contentRating`: [OARS](https://hughsie.github.io/oars/) 1.1 sorularına cevaplarınız (örneğin `{ "social-chat": "intense" }`); verilmezse derecelendirme boştur ve yazılım merkezleri bunu yaş kısıtı yok diye okur. Dosyanın kendi lisansı `bundle.metadataLicense`, yoksa `CC0-1.0`. Açıklamanın ilk paragrafı 80 karakterden kısaysa `lepton package` uyarır; yazılım merkezleri kısa paragrafı iyi göstermez. `appstreamcli validate`'ten geçiyor (AppStream 1.2.1 ile, tarihli ve tarihsiz ölçüldü).

**Simge.** `lepton new`, Lepton'ın işaretini `src-lepton/icon.svg`'ye koyar *0.1.9-beta.2*; kendinizinkiyle değiştirin. Linux'ta paket onu `share/icons/hicolor/scalable/apps/<identifier>.svg` olarak kurar ve masaüstü girdisi onu adlandırır (`Icon=<identifier>`); `lepton dev` ve `run` yazdıkları girdinin yanına kurar. `bundle.icon` kendi simgenizi verir: bir yol ya da bir liste; Windows için bir `.ico` (program, MSI), Linux için bir `.svg`, örneğin `"icon": ["assets/app.ico", "assets/app.svg"]`; oradaki `.svg` `src-lepton/icon.svg`'nin önüne geçer. Linux simgeleri ölçeklenebilir olduğu için `.png` tek bir boyutta kurulmak yerine reddedilir. Hiçbiri yoksa her sistem Lepton'ın işaretini alır. Linux paketleri ayrıca `hicolor/<n>x<n>/apps` altında 16'dan 512 px'e PNG'ler taşır *0.1.9-beta.3*; SVG okumayan masaüstleri ve mağazalar için: [`lepton icon`](/tr/docs/cli/#lepton-icon-019-beta3)'un `src-lepton/icons/`'a yazdıkları, yoksa paketlerken SVG'den çizilenler. Onun `icon.ico`'su, `bundle.icon` bir tane vermiyorsa Windows programının ve MSI'ın simgesidir.

Paketler tekrarlanabilir: sıralı girdiler, `root:root` ve `SOURCE_DATE_EPOCH`. Her arşive bir `.sha256` dosyası eşlik eder. Yazılamayan bir biçim hatadır; sessizce atlanmaz.

Uygulama tarayıcı taşımaz: `lepton new` ile oluşturulan bir React uygulaması burada 176 601 baytlık bir `.tar.gz` oldu (0.1.9-beta.1, 2026-10-20) ve sistemin `wpewebkit` paketine bağlı.

## `--verify`

```sh
npm run lepton package -- --verify
```

Her paketi boş bir dizine açar, uygulamayı oradan başlatır, belleğini ölçer, kapatır; başlamazsa ya da arkada süreç bırakırsa başarısız olur. Windows'ta uygulama ve başlattığı her süreç bir iş nesnesinde tutulur ve bir kullanıcının pencereyi kapatacağı gibi kapatılır.

### Bir uygulamanın bellek maliyeti *0.1.9-beta.3*

`--verify`, açılıştan üç saniye sonra bunu yazar: Windows'ta uygulamanın ve başlattığı her sürecin özel çalışma kümesi, yani Görev Yöneticisi'nin Bellek sütunundaki değer (Linux'ta ağacın PSS'i). Lepton'ın CI'ında Windows Server 2025'te ölçüldü, aynı `vanilla-ts` şablonu iki biçimde derlendi:

| Uygulama | Süreç | Bellek |
|---|---|---|
| Web görünümü (WebView2) | 7 | 69,4 MB |
| Native, GPU (Direct3D 11) | 1 | 6,9 MB |
| Native, CPU (`LEPTON_GPU=cpu`) | 1 | 5,9 MB |

Web görünümünün değeri sayfanız kadar WebView2'nin süreçlerinden de gelir: önceki iki çalıştırma 70,6 ve 72,9 MB verdi. CI makinesinde GPU yok; Direct3D 11 orada Microsoft'un yazılım çizicisiyle (WARP, süreçte yüklü) çalışıyor. Ekran kartı olan bir makine ve Linux henüz ölçülmedi.
