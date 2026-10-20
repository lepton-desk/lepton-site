---
title: Başlarken
description: Bir Lepton projesi oluşturun, penceresini açın ve sürüm derleyin.
---

Lepton, masaüstü uygulamalarını **Zig çekirdek** ve **web arayüzü** ile kurar. Pencereyi çekirdek açar ve komutlarınızı çalıştırır; sayfa, sistemde zaten olan web motorunda çalışır: **Linux**'ta **WPE WebKit**, 0.1.9 betasında **Windows 10 ve 11**'de **WebView2**.

## Gerekenler

Her platformda:

- [Zig 0.16](https://ziglang.org/download/) (0.17 Lepton'ı henüz derleyemiyor)
- Node 20 ya da üstü; npm, pnpm, Yarn veya Bun

**Linux**'ta:

- Wayland ya da X11
- WPE Platform API'siyle derlenmiş WPE WebKit 2.54 ya da üstü (`pkg-config wpe-webkit-2.0 wpe-platform-2.0`) ve libsoup 3. Platform API'si 2.54'ten beri kararlı ve varsayılan olarak açık; bu yolda libwpe ve WPEBackend-fdo kullanılmaz.

**Windows**'ta *0.1.9-beta.0*, betada (`npm create lepton-app@beta`):

- Windows 10 (1709 ya da sonrası) veya Windows 11
- Windows'la gelen WebView2 çalışma zamanı; uygulamanızla hiçbir şey gitmez

`lepton info` makineyi denetler ve neyin eksik olduğunu söyler:

```sh
npx @lepton-desk/cli info
```

Her dağıtım WPE WebKit 2.54'ü paketlemiyor; nereden edinileceği ve her platformun neye ihtiyaç duyduğu [Sistem gereksinimleri](/tr/docs/requirements/) sayfasında.

:::caution[0.1.6 ya da sonrasını kullanın]
`npm create lepton-app@latest` 0.1.8'i getirir; `npm create lepton-app@beta` ise Windows'u ve Astro, Next.js, Angular şablonlarını getiren 0.1.9-beta.1'i (pnpm'de sürümü tam yazın: `pnpm dlx create-lepton-app@0.1.9-beta.1`). Önceki iki sürümde birer sorun vardı: 0.1.4'ün webview derlemesi `wpebackend-fdo-1.0`'ı istiyordu; 2.54 yolu onu hiç yüklemiyor ve Arch artık paketlemiyor, bu yüzden yeni kurulmuş bir Arch'ta derlenemiyordu (0.1.5'te düzeltildi). `create-lepton-app` 0.1.5 ise projeyi oluşturmadan duruyordu (0.1.6'da düzeltildi; 0.1.5 npm'de kullanımdan kaldırıldı olarak işaretli).
:::

## Proje oluşturun

```sh
npm create lepton-app@latest
```

Sihirbaz bir ad, bir arayüz (düz TypeScript ya da JavaScript, React, Vue, Svelte, Solid; betada ayrıca Preact, Lit, Angular, Next.js ve Astro) ve uygulamanın nasıl çizileceğini sorar. Sayfanızı sistemin web motorunda (Linux'ta WPE WebKit, Windows'ta WebView2) açmak için **webview**'ı seçin; **native**, web motoru olmadan doğrudan pencereye çizer.

Soru sormadan:

```sh
npm create lepton-app@latest hello-lepton -- --template react-ts --target webview --non-interactive
```

## Çalıştırın

`create-lepton-app`, `--no-install` vermediğiniz sürece bağımlılıkları kurar. Lepton komutları tek bir betikten geçer: `lepton` *0.1.5* (0.1.4 projelerinde `lepton:dev` ve `lepton:build` vardır); `check` ve `format` Biome'u çalıştırır, çatının kendi `dev`, `build` ve `preview` betikleri de durur. npm'de bayraklardan önce `--` yazın; pnpm, Yarn ve Bun'da gerekmez.

```sh
cd hello-lepton
npm run lepton dev
```

`dev`, ön yüzün dev sunucusunu (Vite ya da Astro'nunki, Next.js'inki, Angular'ınki) başlatır, çekirdeği bir kez derler ve sunucu dinlemeye başlayınca pencereyi açar. Sayfadaki değişiklikler anında yenilenir; çekirdek yalnızca Zig değiştiğinde yeniden derlenir.

## Derleyin ve paketleyin

```sh
npm run lepton build      # sürüm ikilisi
npm run lepton package    # Linux'ta .tar.gz, Windows'ta .zip; istenirse .deb, Arch ve MSI
```

Biçimler için [Paketleme](/tr/docs/packaging/), tüm komutlar için [CLI](/tr/docs/cli/) sayfasına bakın.

:::note[Erken aşama]
Lepton 0.1 sürümünde. Webview yolu, derlendiği ve denendiği makinelerde çalışıyor ama henüz her yerde uçtan uca doğrulanmadı. Windows 0.1.9 betasında, yalnız WebView2 ile (henüz yerel çizim yok); macOS planlanıyor, henüz yapılmadı.
:::
