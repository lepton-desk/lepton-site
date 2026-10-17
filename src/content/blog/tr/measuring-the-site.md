---
title: "Bu site 100'e nasıl ulaştı: tahmin etmeden, ölçerek"
description: "Lighthouse siteye hiçbir tahminin düzeltemediği şeyler için puan kırıyordu. Düzelten, Lighthouse'un kendi sayılarını kendi izlerinden yeniden hesaplayıp nedene kadar izlemek oldu."
date: 2026-10-17
note: "i3-2120 ve Radeon R7 240 üzerinde ölçüldü"
---

Lepton sitesi küçük: bir açılış sayfası, yedi belge sayfası, iki dil. Yine de Lighthouse'un her sayfaya 100 vermesi iki gün sürdü ve bu sürenin çoğu tek bir derse gitti: tahmin, akla ne kadar yatkın olursa olsun, neden değildir. Bu yazı neyin ölçüldüğünün ve her ölçümün neyi değiştirdiğinin kaydı.

## İşe yarayan yöntem

Lighthouse'un mobil puanı doğrudan ölçülmez. Bir sayfa yüklemesinin izini kaydeder, sonra bu iz üzerinde yavaş bir telefonu ve yavaş bir ağı *benzetir* (benzeticinin adı Lantern). Yani rapordaki bir sayı, ekranda hiç görünmeyen nedenlerle değişebilir.

Sonunda işe yarayan:

1. Lighthouse'u `--save-assets` ile çalıştırmak; iz ve ağ kaydı raporun yanında kalır.
2. Lighthouse'un kendi Lantern kodunu bir betikte yükleyip metriği bu dosyalardan yeniden hesaplamak. Her seferinde rapora milisaniyesi milisaniyesine uydu.
3. Benzetilen grafiği düğüm düğüm gezmek: metriği hangi CPU görevi ya da hangi indirme bitiriyor, benzetimde ne kadar sürüyor.

Ancak ondan sonra bir şeyi değiştirmek ve aynı yolla yeniden ölçmek.

İşe *yaramayan* ve zaman kaybettiren: doğru gibi duran şeyleri değiştirmek (CSS'i satır içine al, bir betiği ertele), üç sayfa yüklemesiyle ikiye bölerek aramak (sonunda gürültü çıkan bir "düzeltme") ve gerçek sonucu hiç öngörmeyen bir vekil sayıyı iyileştirmek.

## Yük altında açılış sayfası

Başka programlar üç çekirdeği meşgul ederken Lighthouse bazen bir şey göstermesi bir saniyeyi aşan bir sayfa bildiriyordu. 30 koşunun 18'i böyle takıldı.

Takılan bir izi temiz bir izle olay olay karşılaştırmak nedeni gösterdi. Lighthouse sayfa yüklenirken görünümü yeniden boyutlandırıyor. Bundan sonra Chrome sayfanın çerçevelerini, sayfa yeni boyutta bir çerçeve üretene kadar çizmiyor; bir saniyeye kadar bekletiyor. Sayfanın yeni boyuttaki ilk çerçevesi geç kalıyordu, çünkü rasterı yavaştı ve o rasterın üçte ikisi plakanın zeminiydi: iki büyük radyal gradyan.

Gradyanlar artık bir kez 64 pikselde çizilip gerilen aynı görüntü (herhangi bir kanalda en çok 255'te 3 fark). O raster 98 ms'den 20 ms'ye, takılmalar 30 koşuda 18'den 3'e indi.

## Kimsenin istemediği fontlar

Canlı sitede Lighthouse'un Total Blocking Time'ının neredeyse tamamı **sistem font aramaları** çıktı. İlk yerleşim web fontları gelmeden çalıştığında Chrome varsayılan fontuna dönüyor ve sayfadaki her font tanımı için sistemin font eşleştiricisine "Times New Roman"ı soruyordu. Çok font kurulu bir Linux masaüstünde bu aramaların her biri pahalı.

Her biri ölçülen üç değişiklik:

- **Genel aile yok.** Yığının sonundaki `sans-serif` ve `monospace` aynı eşleştiriciden çözülüyor; kaldırmak ilk çerçeveyi 375 ms'den 273 ms'ye indirdi (yük altında, medyan).
- **Adıyla eşleşen bir yedek yüz.** `'Plate Fallback'`, kurulu bir sans'ı `local()` ile seçen bir `@font-face`. Fontlar ilk yerleşimden sonraya bırakıldığında aramalar 101 ms'den 59 ms'ye, Lighthouse TBT 51 ms'den 23 ms'ye düştü. Son kaynağı sitenin kendi Archivo dosyası; adı geçen fontların hiçbiri olmayan bir sistemde de yüz geçerli kalıyor, bir arama daha olmuyor.
- **İlk ekranda `ch` birimi yok.** `ch` cinsinden bir genişlik, stiller hesaplanırken fontun ölçülerini ister; fontlar gelmeden bu yine varsayılan font demekti. `30ch`, aynı genişlikte `15.44em` oldu ve o stil geçişi 19 ms'den 10 ms'ye indi.

## Belgelerde yerleşim kayması

Belgeler, fontlar gelince metin kaydığı için 89–95 alıyordu (CLS 0,17–0,22). Açılış sayfasının ilk boyaması `font-display: swap` etrafında ayarlı; bu yüzden belgeler yüzlerin `font-display: optional` ile kendi kopyasını aldı: tarayıcının kısa beklemesini kaçıran font sonradan yerleştirilmiyor, bir sonraki sayfa onu önbellekten kullanıyor. Archivo'dan 100–150 ms sonra gelen JetBrains Mono artık önden yükleniyor; kod da adıyla eşleşen eş genişlikli bir yüze düşüyor, satırlar boyunu koruyor. Fontlar 300 ms geç gelirken ölçüldüğünde CLS 0'a indi.

## Son puan

Bunca şeyden sonra kod bloklu belge sayfaları yerelde hâlâ 99 alıyordu. Lantern'in LCP'sini yeniden hesaplamak, benzetilen metriğin tek bir indirmeyle bittiğini gösterdi: 65 KB'lık Archivo font dosyası. Kodlu bir sayfada kod stilleri ve betikleri benzetilen bağlantıyı onunla paylaşıyor, o da daha geç bitiyordu.

Font artık sitenin gerçekten kullandığı karakterlere kesili: tüm ASCII, Türkçe harfler ve derlenen sayfalardaki her karakter; iki değişken eksen ve sitenin ihtiyaç duyduğu özellikler korundu. 65 KB'tan 38 KB'a indi, sayfalar pikseli pikseline aynı, bir belge sayfasının benzetilen LCP'si 1966 ms'den 1667 ms'ye düştü.

## Şu an

| Sayfa | Performans | Erişilebilirlik | En iyi uygulamalar | SEO |
| --- | --- | --- | --- | --- |
| Açılış (EN, TR) | 100 | 100 | 100 | 100 |
| Belgeler (canlıda ölçülen 10 sayfa) | 100 | 100 | 100 | 100 |

Yukarıdaki her değişiklik [sitenin deposunda](https://github.com/lepton-desk/lepton-site), ölçümü commit mesajında ya da açıkladığı kodun yanında. Aynı kural Lepton'ın kendisinde de geçerli: bir iddia, bir komutun yazdırdığı şeydir.
