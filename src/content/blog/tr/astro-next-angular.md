---
title: "Astro, Next.js ve Angular, bir de bekleyen pencere"
description: "0.1.9-beta.0, kendi sunucusunu getiren üç çatıya şablon, Lepton'a herhangi birini nasıl çalıştıracağını söyleyen bir ayar ve her Lepton projesinde olan bir yarışın düzeltmesini getiriyor. Her çatının neye ihtiyaç duyduğu, gerçek projelerde ölçüldü."
authors: [galaxysal]
date: 2026-10-19
note: "i3-2120 ve Radeon R7 240 üzerinde ölçüldü"
---

Şimdiye kadar her Lepton şablonu bir Vite projesiydi: bir `index.html`, bir `src/main.ts`, `dist/`'e `vite build`, ve `lepton dev` Vite'ı Vite'ın bayraklarıyla başlatıyordu. Astro, Next.js ve Angular bu kalıba uymuyor. Her birinin kendi sayfaları, kendi dev sunucusu ve kendi çıktı klasörü var. 0.1.9-beta.0 üçüne de şablon ekliyor. Oraya varmak için önce, kod yazmadan, her birinin gerçek projelerde ne yaptığını ölçtük.

## Her çatının ihtiyacı

| | Çıktı | Dev sunucusu bayrakları | Zaten dolu bir port |
| --- | --- | --- | --- |
| Astro 7.4 | `dist/` | `--port --host --ignore-lock` | `strictPort` verilmezse bir sonrakine geçer |
| Next.js 16.4 | `out/` (statik dışa aktarım) | `--port --hostname` | hatayla durur |
| Angular 22.2 | `dist/<ad>/browser`, ayarlanınca `dist/` | `--port --host` (`ng serve`) | hatayla durur |

Tablo sürprizlerin çoğunu göstermiyor:

- **Astro 7.4, bir yapay zekâ ajanı algıladığında dev sunucusunu arka plana atıyor.** Bir kilit dosyası yazıyor; onu başlatan süreç bitse de sunucu çalışmaya devam ediyor. Ajan ortamında ikinci bir `astro dev`, "already running" deyip istenen porta bakmadan 0 ile çıktı. Lepton sunucuyu başlatıyor ve pencere kapanınca durduruyor; kendi başına giden bir sunucu bu döngüyü bozuyor. `--ignore-lock` onu önde tutuyor ve şablon bu bayrağı geçiyor. Dolu bir port Astro'yu sessizce bir sonrakine taşıyordu; şablonun `astro.config.mjs`'i bunu hataya çeviriyor, çünkü pencereye hangi portu yükleyeceği zaten söylenmiş oluyor.
- **Next.js, `@types/node` eksikse ilk derlemede onu kendisi kuruyor ve o derleme düşüyor** ("Cannot read properties of null (reading 'useContext')"). İkinci derleme geçiyor; bir prototipte bir kez görüp ardından gelen derlemelerde tekrar üretemememizin nedeni buydu. Şablon artık `@types/node`'u listeliyor.
- **Next.js her sayfayı derleme sırasında bir kez işliyor;** orada pencere yok. Lepton'ın bağlaması yüklenir yüklenmez pencerenin kanalına bağlanıyor. Bu yüzden şablonun sayfası ekranı `next/dynamic` ve `ssr: false` ile yüklüyor.
- **pnpm 11 ve sonrası Angular kurulumunu durduruyor:** dört bağımlılığın (esbuild, lmdb, @parcel/watcher, msgpackr-extract) kimsenin onaylamadığı derleme betikleri var. Bunlar hazır ikililerle geliyor ve proje betikler çalışmadan derleniyor; şablonun `pnpm-workspace.yaml`'ı bu betikleri açıkça reddediyor.

## Her çatı için bir sürüm yerine tek ayar

`lepton.config.json`'daki yeni `frontend` bölümü, derlemenin nereye gittiğini ve dev sunucusunun portu ile adresi nasıl aldığını Lepton'a söylüyor:

```json
"frontend": {
  "dist": "out",
  "devArgs": ["--port", "{port}", "--hostname", "{host}"]
}
```

Bu bölüm yoksa proje eskisi gibi, bir Vite projesi olarak davranıyor. Bayraklar bir çatı adı değil bir liste; böylece Lepton'ın hiç duymadığı bir çatı yeni bir sürüm değil, tek satır ayar istiyor. `lepton build`, `run` ve `dev` bu ayarı okuyor. Bayraklar hem `{port}`'u hem `{host}`'u geçmek zorunda: çekirdek sayfayı tam o adresten yüklüyor ve CLI ikisinden birini dışarıda bırakan bir ayarı reddediyor.

## Her projede olan yarış

Astro'nun `lepton dev` altındaki ilk çalışmasında açılan pencerenin sayfası hiç bağlanmadı. Çekirdeğe giden her istek "Origin null is not allowed" ile reddedildi. `lepton dev` dev sunucusunu başlatıyor, çekirdeği derliyor ve sunucunun dinleyip dinlemediğine bakmadan pencereyi açıyordu. Çekirdek derleme önbelleğinden 385 ms'de geldi, yani Astro hazır olmadan. Sayfa yüklenemedi ve oturumun sonuna kadar `null` kökende kaldı.

Bu hiçbir zaman Astro'ya özgü değildi. Vite'ta çekirdek derlemesi genelde Vite'ın açılışından uzun sürüyordu, bu yüzden pencere tesadüfen zamanında açılıyordu. Artık pencere ancak sunucu bir bağlantı kabul edince açılıyor. Sunucu ondan önce durursa, örneğin port doluysa, `lepton dev` boş bir pencere açmak yerine çıkış durumunu söylüyor.

## Her şablon gibi denetlendi

Beş yeni şablonun her biri (TypeScript ve JavaScript'te Astro ile Next.js, TypeScript'te Angular) `lepton new` ile sıfırdan oluşturuldu ve şu denetimlerin hepsinden geçmesi gerekti:

- derlemeden önce ve sonra hatasız `biome check`;
- TypeScript şablonlarında hatasız `tsc`;
- `lepton package --verify`: paketlenmiş uygulama açılıyor, 3 sn çalışıyor ve kapanıyor;
- `lepton run` ve `lepton dev` altında pencerede hiç konsol hatası olmaması;
- pencere kapanınca portun yeniden boşalması.

Pencerede başlangıç tablosu üçünde de çekirdeğin paylaşımlı bellek kanalından doldu. Paketlenmiş bir uygulamanın bütün süreçleriyle birlikte PSS olarak ölçülen belleği: Astro yaklaşık 216 MiB, Next.js yaklaşık 245 MiB, Angular yaklaşık 231 MiB; Vite'lı React yaklaşık 232 MiB. Lepton'ın artık 19 şablonu var.

## Windows ve editörünüz için bir şema

0.1.9-beta.0 aynı zamanda içinde Windows olan ilk sürüm: web yolu WebView2'de çalışıyor, `lepton package` da `.zip` ve WiX'siz bir MSI yazıyor. Ölçümler [değişiklikler sayfasında](/tr/docs/changelog/). Linux'tan çapraz derleme bağlama adımında düşüyordu, çünkü derleme Windows ikilisine makinede bulduğu Linux kütüphanelerini veriyordu. Linux'ta `lepton build --windows` artık yalnızca Windows'un kendi DLL'lerini içe aktaran 1,1 MB'lık bir `.exe` üretiyor. Bu `.exe` henüz Windows'ta açılmadı; sıradaki denetim bu.

Her projenin `lepton.config.json`'ı `$schema`'sını hiç çözülmeyen bir adrese gösteriyordu, bu yüzden editörler şemayı yükleyemiyordu. Şema artık [bu siteyle birlikte yayında](/schema/config.json). 19 şablonun ayarlarına ve 14 bozuk ayara karşı denendi; CLI'nin eskiden yok saydığı `devArg` gibi bir yazım hatasını işaretliyor. `lepton update` var olan projeleri yeni adrese taşıyor.

## Denemek için

Beta `beta` etiketiyle yayında:

```sh
npm create lepton-app@beta
```

pnpm'de sürümü tam yazın: pnpm yeni bir sürümü kullanmadan önce bir gün bekliyor, bu yüzden yalnızca `@beta` hâlâ bir öncekine çözülebilir.

```sh
pnpm dlx create-lepton-app@0.1.9-beta.1
```

---

*Nasıl yazıldı: yukarıdaki her sayı projenin kendi makinesinde (i3-2120, Radeon R7 240, Linux, Wayland) çalıştırılmış bir komuttan geliyor; komutlar ve düzeltmeler deponun 19 Ekim 2026 tarihli commit'lerinde. Çalışma ve bu yazı Claude Code'un yardımıyla hazırlandı.*
