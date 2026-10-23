---
title: Sistem gereksinimleri
description: Lepton uygulamasını derlemek için makinede ne gerekir, kullanıcının makinesinde çalıştırmak için ne gerekir; platform platform.
---

Lepton **Linux**'ta, 0.1.9 betasında da WebView2 ile **Windows**'ta çalışıyor. macOS desteklenmiyor. Aşağıdaki alt sınırlar araçların kendisinden geliyor, 2026-10-17'de denetlendi; "genelde çalışır" tahmini değil.

## Linux

| | Gereken | Neden |
| --- | --- | --- |
| Çekirdek | 5.10 ya da üstü | Çekirdeğin yazıldığı Zig 0.16, Linux 5.10 ve üstünü destekliyor. |
| Görüntü | Wayland ya da X11 | Çekirdek kendi penceresini ikisinde de açar. |
| Web motoru (webview uygulamaları) | WPE Platform API'siyle WPE WebKit 2.54 ya da üstü | Çekirdeğin kullandığı API; 2.54'ten beri kararlı ve varsayılan. Native uygulamalar motor istemez. |
| WPE WebKit 2.54'ü derlemek için | GLib 2.70, ICU 70.1, GStreamer 1.18.4, Wayland 1.20, libinput 1.19; Clang 18 ya da GCC 12 | WebKit'in kendi derleme denetimleri. Hangi dağıtımda 2.54 olabileceğini bu belirler. |
| Yerine Servo (`--servo`, deneysel) *0.1.9-beta.2* | Linux x86-64, X11 (Wayland'de XWayland); projede `@lepton-desk/servo-linux-x64`; başlıklarıyla libX11 ve libxkbcommon (Debian ve Ubuntu'da `libx11-dev libxkbcommon-dev`; Arch'ta `libx11` ve `libxkbcommon`'un içinde) | Servo çekirdeğin X11 penceresine çizer, çekirdek tuşları Xlib ve xkbcommon ile okur. Windows her zaman WebView2 kullanır. |

**Geliştirmek** için ayrıca [Zig 0.16 ya da 0.17](https://ziglang.org/download/), Node 20 ya da üstü ve npm, pnpm, Yarn veya Bun gerekir. `lepton info` hepsini denetler. *0.1.9-beta.2* CLI, `PATH`'teki `zig`, `zig-0.17` ve `zig-0.16`'dan 0.16 ya da 0.17 olan ilkini ya da `LEPTON_ZIG`'in gösterdiğini alır; yalnız başka bir sürüm bulursa bunu söyler. İkisi de aynı çekirdeği, eklentileri ve projeleri derler (ölçüldü: her biriyle çekirdek testleri, bütün eklentileriyle bir webview uygulaması, bir yerel uygulama ve Windows derlemesi).

### Arch'ta CLI *0.1.7*

`npm create lepton-app` her dağıtımda çalışır. Arch'ta CLI ayrıca paketli: `lepton-desk` kaynaktan derler, `lepton-desk-bin` npm'de yayımlanan ikiliyi kurar; ikisi de WPE WebKit'i kendisi kurdurur. Arch'ın `zig`'i 0.17, bu yüzden ikisi de AUR'daki `zig0.16-bin`'e bağlı: o, Zig 0.16'yı sistem Zig'inin yanına `/opt/zig0.16`'ya kurar; `lepton-desk` CLI'ya onu verir ve sistemin `zig`'i güncellenebilir. AUR yeni hesap kaydını şimdilik kapattığı için paketler AUR'a gelene kadar depodan derleyin (`makepkg` AUR bağımlılıklarını kendisi indirmez):

```sh
paru -S zig0.16-bin
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

Windows'la gelen Chromium tabanlı WebView2 ile; uygulamanız onu taşımaz. Çekirdek kurulu çalışma zamanını kendisi bulur, bu yüzden uygulamayla `WebView2Loader.dll` gitmez. Derlemek için Linux'taki gibi Zig 0.16 ya da 0.17 ve Node 20 ya da üstü gerekir; `lepton info` çalışma zamanını denetler. Paketler `.zip` ve istenirse WiX'siz yazılmış, yönetici izni istemeden kullanıcı başına kurulan bir MSI ([Paketleme](/tr/docs/packaging/)). `os`, `fs` ve `dialog` eklentileri orada ölçüldü *0.1.9-beta.1*, `clipboard` da *0.1.9-beta.2*; dördü de bir WebView2 uygulamasında baştan sona denendi (`fs.watch` dahil). Henüz yok: yerel çizim yolu, MSIX. Yükleyiciler imzalı değil; Windows SmartScreen uyarısını gösterir.

- **Windows 10 (1709 ve sonrası, LTSC sürümleri) ve Windows 11**: Microsoft'un WebView2'yi desteklediği sürümler.
- **Windows 8.1, 8 ve 7: desteklenmiyor.** WebView2 bunlarda Ocak 2023'te 109. sürümde durdu ve güvenlik düzeltmesi almıyor; yamasız bir motorda çalışan web uygulaması kullanıcısını riske atar. Zig 0.16 de yalnız Windows 10 ve üstünü destekliyor. Web motoru olmayan ayrı bir yol düşünülüyor.

## macOS: desteklenmiyor

Lepton macOS'u desteklemiyor ve bunu planlamıyor. macOS için imzalama ve noter onayı ücretli bir Apple geliştirici hesabı, denemek için de Mac donanımı istiyor; Lepton bunu sürdüremez. `lepton build --macos` bu gerekçeyle reddedilir.
