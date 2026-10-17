---
title: Başlarken
description: Bir Lepton projesi oluşturun, penceresini açın ve sürüm derleyin.
---

Lepton, masaüstü uygulamalarını **Zig çekirdek** ve **web arayüzü** ile kurar. Pencereyi çekirdek açar ve komutlarınızı çalıştırır; sayfa, sistemde zaten olan web motorunda çalışır. Bugün bu, **Linux** ve **WPE WebKit** demek.

## Gerekenler

- Wayland ya da X11 ile Linux
- [Zig 0.16](https://ziglang.org/download/)
- `wpe-platform` API'siyle WPE WebKit 2.54 ya da üstü (`pkg-config wpe-webkit-2.0`) ve libsoup 3
- Node 20 ya da üstü; npm, pnpm, Yarn veya Bun

`lepton info` makineyi denetler ve neyin eksik olduğunu söyler:

```sh
npx @lepton-desk/cli info
```

## Proje oluşturun

```sh
npm create lepton-app@latest
```

Sihirbaz bir ad, bir arayüz (React, Vue, Svelte, Solid ya da düz TypeScript) ve uygulamanın nasıl çizileceğini sorar. Sayfanızı WPE WebKit'te açmak için **webview**'ı seçin; **native**, web motoru olmadan doğrudan pencereye çizer.

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

`dev`, Vite'ı başlatır, çekirdeği bir kez derler ve pencereyi açar. Sayfadaki değişiklikler anında yenilenir; çekirdek yalnızca Zig değiştiğinde yeniden derlenir.

## Derleyin ve paketleyin

```sh
npm run lepton build      # sürüm ikilisi
npm run lepton package    # varsayılan .tar.gz; istenirse .deb ve Arch
```

Biçimler için [Paketleme](/tr/docs/packaging/), tüm komutlar için [CLI](/tr/docs/cli/) sayfasına bakın.

:::note[Erken aşama]
Lepton 0.1 sürümünde. Webview yolu, derlendiği ve denendiği makinelerde çalışıyor ama henüz her yerde uçtan uca doğrulanmadı. macOS ve Windows planlanıyor, henüz yapılmadı.
:::
