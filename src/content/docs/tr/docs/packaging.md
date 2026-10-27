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
| `deb` | Debian paketi. `bundle.maintainer` gerekir. Bağımlılık adları `dpkg-query`'den ya da onun olmadığı makinede `bundle.deb.depends`'ten gelir; asla tahmin edilmez. |
| `zip` | Windows *0.1.9-beta.0*: kurulum öneki, `bin\<ad>.exe` ve yanında ön yüz. |
| `msi` | Windows *0.1.9-beta.0*: WiX olmadan Lepton'un kendisinin yazdığı bir Windows Installer paketi. Yönetici izni istemeden kullanıcı başına kurulur (`%LOCALAPPDATA%\Programs\<ürün>`), Başlat menüsüne kısayol ekler, eski sürümü yükseltir, aynı sürümün başka bir derlemesini onun yerine kurar *0.1.9-beta.2* (Windows Installer yalnız `major.minor.build`'i karşılaştırır; `1.0.0-beta.1` → `1.0.0-beta.2` onun için aynı sürümdür), sürüm düşürmeyi reddeder, temiz kaldırılır. `bundle.icon` (bir `.ico`) kısayolun ve Uygulamalar listesinin simgesidir. Windows SDK'nın ICE doğrulamasından hatasız geçer. |

**Simge.** `lepton new`, Lepton'ın işaretini `src-lepton/icon.svg`'ye koyar *0.1.9-beta.2*; kendinizinkiyle değiştirin. Linux'ta paket onu `share/icons/hicolor/scalable/apps/<identifier>.svg` olarak kurar ve masaüstü girdisi onu adlandırır (`Icon=<identifier>`); `lepton dev` ve `run` yazdıkları girdinin yanına kurar. `bundle.icon` kendi simgenizi verir: bir yol ya da bir liste; Windows için bir `.ico` (program, MSI), Linux için bir `.svg`, örneğin `"icon": ["assets/app.ico", "assets/app.svg"]`; oradaki `.svg` `src-lepton/icon.svg`'nin önüne geçer. Linux simgeleri ölçeklenebilir olduğu için `.png` tek bir boyutta kurulmak yerine reddedilir. Hiçbiri yoksa her sistem Lepton'ın işaretini alır.

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
