---
title: Sistem gereksinimleri
description: Lepton uygulamasını derlemek için makinede ne gerekir, kullanıcının makinesinde çalıştırmak için ne gerekir; platform platform.
---

Lepton **Linux**'ta, 0.1.9 betasında da WebView2 ile **Windows**'ta çalışıyor. macOS (WKWebView ile) planlı, henüz yapılmadı. Aşağıdaki alt sınırlar araçların kendisinden geliyor, 2026-10-17'de denetlendi; "genelde çalışır" tahmini değil.

## Linux

| | Gereken | Neden |
| --- | --- | --- |
| Çekirdek | 5.10 ya da üstü | Çekirdeğin yazıldığı Zig 0.16, Linux 5.10 ve üstünü destekliyor. |
| Görüntü | Wayland ya da X11 | Çekirdek kendi penceresini ikisinde de açar. |
| Web motoru (webview uygulamaları) | WPE Platform API'siyle WPE WebKit 2.54 ya da üstü | Çekirdeğin kullandığı API; 2.54'ten beri kararlı ve varsayılan. Native uygulamalar motor istemez. |
| WPE WebKit 2.54'ü derlemek için | GLib 2.70, ICU 70.1, GStreamer 1.18.4, Wayland 1.20, libinput 1.19; Clang 18 ya da GCC 12 | WebKit'in kendi derleme denetimleri. Hangi dağıtımda 2.54 olabileceğini bu belirler. |

**Geliştirmek** için ayrıca [Zig 0.16](https://ziglang.org/download/), Node 20 ya da üstü ve npm, pnpm, Yarn veya Bun gerekir. `lepton info` hepsini denetler.

### Arch'ta CLI *0.1.7*

`npm create lepton-app` her dağıtımda çalışır. Arch'ta CLI ayrıca paketli: `lepton-desk` kaynaktan derler, `lepton-desk-bin` npm'de yayımlanan ikiliyi kurar; ikisi de Zig 0.16'yı ve WPE WebKit'i kendisi kurdurur. AUR yeni hesap kaydını şimdilik kapattığı için paketler AUR'a gelene kadar depodan derleyin:

```sh
git clone https://github.com/lepton-desk/lepton.git
cd lepton/packaging/aur/lepton-desk-bin && makepkg -si
```

Komutun adı `lepton-desk` (`lepton-desk new uygulamam`): AUR'daki `lepton`, Dropbox'ın JPEG sıkıştırıcısı ve `/usr/bin/lepton`'ı o kuruyor; böylece ikisi yan yana kurulabiliyor. Projenin içinde `lepton` betiği, her kurulumda olduğu gibi projenin kendi CLI'sını çalıştırır.

### Dağıtıma göre WPE WebKit

| Dağıtım | WPE WebKit 2.54 |
| --- | --- |
| Arch, EndeavourOS, Manjaro | dağıtımdan `wpewebkit` |
| openSUSE Tumbleweed | dağıtımdan `wpewebkit-devel` |
| Debian testing ve unstable | dağıtımdan `libwpewebkit-2.0-dev` |
| Ubuntu 24.04, 26.04, 26.10 | Ubuntu paketlemiyor; Lepton'ın kendi deposundan, kuruluyor |
| Fedora 43, 44, 45 | Fedora kaldırdı; Lepton'ın kendi deposundan, kuruluyor |
| Debian 13 (trixie) | dağıtımda 2.48.3 var; kütüphaneleri 2.54'e yetiyor, Lepton derlemesi mümkün ama henüz sunulmuyor |
| Debian 12 (bookworm), Ubuntu 22.04 | kütüphaneler 2.54'ün alt sınırlarını, bazıları kıl payı, karşılıyor; henüz sunulmuyor |
| Ubuntu 20.04 ve öncesi | hayır: GLib 2.64, 2.54'ün istediğinin altında |

Motor yoksa `lepton info` paket yöneticinize neyi kurabileceğini sorar ve komutu yazar. *0.1.5* `lepton build`, `dev` ve `run` de webview derlemesinden önce aynısını yapar ve terminaldeyseniz komutu çalıştırmayı önerir.

### Paketlenmiş uygulamalar

`lepton package` ile üretilen paket, onu derleyen makinenin kütüphanelerine bağlanır; o dağıtımda ve daha yenilerinde çalışır, eskilerinde çalışmaz. Eski dağıtımlar için paketlemek, onların üzerinde derlemek demek; bu Lepton'ın CI'ıyla planlı, henüz yapılmadı.

## Windows *0.1.9-beta.0*

Windows'la gelen Chromium tabanlı WebView2 ile; uygulamanız onu taşımaz. Çekirdek kurulu çalışma zamanını kendisi bulur, bu yüzden uygulamayla `WebView2Loader.dll` gitmez. Derlemek için Linux'taki gibi Zig 0.16 ve Node 20 ya da üstü gerekir; `lepton info` çalışma zamanını denetler. Paketler `.zip` ve istenirse WiX'siz yazılmış, yönetici izni istemeden kullanıcı başına kurulan bir MSI ([Paketleme](/tr/docs/packaging/)). Henüz yok: yerel çizim yolu, `dialog` ve `fs` eklentileri, MSIX. Yükleyiciler imzalı değil; Windows SmartScreen uyarısını gösterir.

- **Windows 10 (1709 ve sonrası, LTSC sürümleri) ve Windows 11**: Microsoft'un WebView2'yi desteklediği sürümler.
- **Windows 8.1, 8 ve 7: desteklenmiyor.** WebView2 bunlarda Ocak 2023'te 109. sürümde durdu ve güvenlik düzeltmesi almıyor; yamasız bir motorda çalışan web uygulaması kullanıcısını riske atar. Zig 0.16 de yalnız Windows 10 ve üstünü destekliyor. Web motoru olmayan ayrı bir yol düşünülüyor.

## macOS *planlı*

macOS'la gelen WKWebView ile. Zig 0.16 macOS 13 ve üstünü destekliyor; beklenecek alt sınır bu.
