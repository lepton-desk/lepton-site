---
title: Paketleme
description: Tek komutla tar.gz, .deb ve Arch paketleri.
---

```sh
npm run lepton package
```

`lepton package` bir sürüm derler ve onu bir masaüstü girdisiyle birlikte `src-lepton/bundle/<ad>-<sürüm>-linux-<mimari>/` altına dizer; sonra `bundle.targets` içindeki her biçimi yazar. Varsayılan `tar.gz`'dir.

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

Paketler tekrarlanabilir: sıralı girdiler, `root:root` ve `SOURCE_DATE_EPOCH`. Her arşive bir `.sha256` dosyası eşlik eder. Yazılamayan bir biçim hatadır; sessizce atlanmaz.

Uygulama tarayıcı taşımaz: `lepton new` ile oluşturulan bir React uygulaması burada 173 852 baytlık bir `.tar.gz` oldu ve sistemin `wpewebkit` paketine bağlı.

## `--verify`

```sh
npm run lepton package -- --verify
```

Her paketi boş bir dizine açar, uygulamayı oradan başlatır, belleğini ölçer, kapatır; başlamazsa ya da arkada süreç bırakırsa başarısız olur.
