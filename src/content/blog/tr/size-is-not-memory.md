---
title: "Küçük indirme, küçük uygulama demek değil"
description: "Aynı sayfa, aynı pencere, her biri tek başına: Lepton, Tauri ve Electron. Hangisi ne kadar dağıtıyor, çalışırken ne kadar kullanıyor ve ölçümün Lepton'da bulduğu hata."
date: 2026-10-17
note: "i3-2120 ve Radeon R7 240 üzerinde ölçüldü"
---

Lepton'ın paketi küçük. Merhaba uygulaması 173 852 baytlık bir `.tar.gz`; aşağıda kullanılan release paketinin ağacı 736 KB. Bu sayı doğru, ama söylediğinden fazlasını okumak kolay: bu sizin indirdiğiniz, çalışan değil. Web motoru yine de çalışmak zorunda; Linux'ta Lepton sistemde zaten olanı kullanıyor. Biz de üçünün çalışırken ne kullandığını ölçtük: Lepton, Tauri ve Electron.

## Nasıl ölçtük

- **Üçünde aynı sayfa:** `create-vite`'ın React + TypeScript şablonunun varsayılan sayfası; bir kez derlendi (`vite build`, göreli yollar) ve her uygulamaya bayt bayt aynı kondu. Hiçbir çatının kendi şablonu yok, köprü çağrısı yok.
- **Release derlemeleri:** Lepton 0.1.6 `lepton package` ile, Tauri 2 `tauri build` ile, Electron 44.9.0 `@electron/packager` ile.
- **Aynı pencere,** 800×600, ve **her seferinde tek uygulama;** o sırada hiçbir şey derlenmiyordu.
- **Neyi saydık:** uygulamanın süreci ve onun başlattığı bütün süreçler. Vite gibi geliştirme araçları dahil değil.
- **Bellek PSS olarak:** birkaç sürecin paylaştığı bir sayfa aralarında bölünür; bir kütüphanenin paylaşılan kısmı her süreç için ayrı ayrı sayılmaz. 5 saniye arayla 24 örnek.
- **Boştaki işlemci:** pencere açık ve dokunulmadan dururken bütün ağacın 30 saniyede harcadığı işlemci süresi.

## Ne dağıtıyor, ne kullanıyor

| | Lepton | Tauri | Electron |
| --- | --- | --- | --- |
| Dağıttığınız | 736 KB | 5,8 MB | 284 MB |
| Çalışırken bellek (PSS, bütün süreçler) | 243 MiB | 255 MiB | 230 MiB |
| Sayfayı çizen süreç | 172–175 MiB | 135 MiB | ayrılamadı |
| Boştaki işlemci | bir çekirdeğin %0,2–0,3'ü | 0 | 0 |

Dağıtılan boyutlar arasında 400 kata yakın fark var. Bellekte fark %10 kadar; bu turda en az kullanan Electron'du.

Üçü de sayfayı bir tarayıcı motoruyla çiziyor; fark yalnızca motoru kimin getirdiği. Electron, Chromium'u her uygulamayla birlikte getiriyor. Tauri ve Lepton sistemdekini kullanıyor: Tauri WebKitGTK'yı, Lepton WPE WebKit'i. Motoru dağıtmamak indirmeden ve diskten kazandırıyor. Motorun kullandığı bellekten kazandırmıyor, çünkü motor yine yükleniyor; yalnızca sistemden geliyor.

## Sayıları aralık olarak okuyun

Aynı uygulama gün içinde turdan tura 10–50 MiB oynadı; nedenini ölçmedik. Gün boyunca toplamlar Lepton 243–282, Tauri 255–306, Electron 230–255 MiB oldu. Bir turun içindeki sıralama, tek bir sayıdan daha çok şey söylüyor.

Electron'un toplamı eksiksiz ölçüldü. Eksik olan yalnızca sayfayı çizen sürecin ayrı satırı: Electron'un bütün süreçleri aynı adı taşıyor ve betik onları ayırt edemedi. Önceki bir turda renderer'ı 40–75 MiB, GPU süreci yaklaşık 46 MiB ölçülmüştü.

Süreç başına özel bellekte (USS) de en az Electron kullanıyor. Süreçleri birbirinden çatallanıyor ve sayfalarının çoğunu paylaşıyor; her birinin kendine ait payı küçük kalıyor.

## Ölçüm Lepton'da ne buldu

İlk turlarda Lepton'ın sayfa süreci 175 ile 207 MiB arasında gidip geliyordu, boştaki pencere de bir çekirdeğin %2,9'unu kullanıyordu. Neden Lepton'ın kendisiydi. Lepton'ın her sayfaya koyduğu betik, çekirdeğin bütün giden halkasını (532 608 bayt) hiçbir şey değişmese bile saniyede dört kez okuyordu; motor her okumada yeni bir tampon ayırıyordu.

Artık sayfa, çekirdek yeni bir şey yayımlayana kadar bekliyor ve yalnızca yeni çerçeveleri alıyor. Sayfa süreci 176 MiB'ta sabit kalıyor, boştaki işlemci %0,2–0,3'e indi. Şablonun çekirdeği hâlâ saniyede bir örnek yayımlıyor ve sayfa her birinde uyanıyor; kalan payın kaynağı büyük olasılıkla bu, ama o kısmı ayrıca ölçmedik. Düzeltme [`214e48f`](https://github.com/lepton-desk/lepton/commit/214e48f) commit'inde ve sonraki sürümle çıkacak.

## Bundan ne çıkarıyoruz

Bir web ön yüzü, çatı hangisi olursa olsun, bellek ister. Bu sayfada 230–255 MiB kadardı; çoğu motorun kendi süreçleri. Lepton'ın değiştirdiği, dağıttığınız ve diskte kalan şey: makinede bütün Lepton uygulamaları için tek bir motor, Windows'taki WebView2 gibi. Sayfanın kendisini ucuzlatmıyor.

0.2.0 planları bu bedeli de hedefliyor: web teknolojileriyle yazılan ama altında tarayıcı motoru olmadan Lepton'ın kendisinin çizdiği yerel arayüzler. Hazır olduklarında aynı yöntemle ölçülecekler ve sonuçları buraya gelecek.
