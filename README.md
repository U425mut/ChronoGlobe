# ChronoGlobe

**ChronoGlobe** — tarihsel dünya haritası ve zaman kontrolü aracı. Harita üzerinden yıllara göre (zaman çizgisi) ülke bilgilerini, olayları görselleştiren, interaktif, açık kaynaklı bir web uygulaması.

> **Vizyon:** Tarihi olayları mekânsal bağlamda keşfetmeyi herkes için kolay, eğlenceli ve açık hale getirmek.

---

## İçindekiler

- [Özet](#özet)  
- [Öne çıkan özellikler](#öne-çıkan-özellikler)  
- [Proje mimarisi ve dosya yapısı](#proje-mimarisi-ve-dosya-yapısı)  
- [Hızlı başlama (local)](#hızlı-başlama-local)  
- [Veri yapıları — JSON şemaları](#veri-yapıları--json-şemaları)  
- [2011 Dünya / Tarihsel snapshot oluşturma — adım adım](#2011-dünya--tarihsel-snapshot-oluşturma--adım-adım)  
- [Coğrafi verilerle çalışmak — pratik ipuçları](#coğrafi-verilerle-çalışmak--pratik-ipuçları)  
- [map.js: önerilen geliştirmeler](#mapjs-önerilen-geliştirmeler)  
- [Katkıda bulunma rehberi](#katkıda-bulunma-rehberi)  
- [Lisans ve .gitignore önerisi](#lisans-ve-gitignore-önerisi)  
- [Gelişmiş öneriler](#gelişmiş-öneriler)  
- [SSS & sorun giderme](#sss--sorun-giderme)  
- [İletişim](#iletişim)  

---

## Özet

ChronoGlobe; HTML/CSS/JS + [Leaflet](https://leafletjs.com) tabanlı, veri kaynakları `data/` içinde saklanan, yıllara göre farklı dünya haritaları ve ülke bilgileri (history, events, census vb.) gösteren bir uygulamadır.  
Hedefi: kolayca katkı alınabilecek; veri ekleme, tarihsel snapshot yönetimi ve interaktif keşif olanağı sunmaktır.

---

## Öne çıkan özellikler

- Yıl seçici (slider + ileri/geri butonları) — harita ve bilgi paneli yıl bazlı güncellenir.
- Ülke arama kutusu (Türkçe isimler destekli).
- Bilgi paneli: başkent, nüfus, yüzölçümü, tarihçe alt bölümleri, o yıla ait olaylar.
- Harita: Leaflet ile GeoJSON gösterimi, ülkelerin üzerine gelince tooltip, tıklama ile seçme (isteğe göre zoom kapatılabilir).
- Açık veri yapısı: `countries.geo.json`, `country-info.json`, `events.json`.
- Tarihsel snapshot desteği: her yıl için farklı GeoJSON (ör. `data/geo/2011/countries.geo.json`).

---

## Proje mimarisi ve dosya yapısı

```
CHRONOGLOBE/
└── ChronoMap/
    ├── data/
    │   ├── countries.geo.json
    │   ├── country-info.json
    │   ├── country-names-tr.json
    │   └── events.json
    │
    ├── js/
    │   ├── app.js
    │   ├── documentation.html
    │   ├── license.txt
    │   ├── map.js
    │   └── test.html
    │
    ├── style/
    │   └── style.css
    │
    ├── index.html
    ├── LICENSE
    └── README.md
```

---

## Hızlı başlama (local)

1. Repo klonla:
```bash
git clone https://github.com/<kullanici>/ChronoGlobe.git
cd ChronoGlobe/ChronoMap
```

2. Lokal server başlat:
```bash
npx http-server -c-1 -p 8080 .
# veya
python -m http.server 8080
```

3. Tarayıcıda aç:
```
http://127.0.0.1:5500/ChronoMap/index.html
```

---

## Veri yapıları — JSON şemaları

### `countries.geo.json`
- **Tip:** GeoJSON FeatureCollection  
- **İçerik:** Her feature bir ülke sınırlarını temsil eder.  
- **Alanlar:** `properties.name`, `geometry` (Polygon/MultiPolygon).  

### `country-info.json`
- **Tip:** JSON  
- **İçerik:** Ülke bilgileri, yıllara göre ayrılmış metadata.  
- **Alanlar:** `capital`, `population`, `area`, `history`, `languages`, `government`, `religion`.  

### `events.json`
- **Tip:** JSON  
- **İçerik:** Ülkelerin yıllara göre önemli olayları.  
- **Alanlar:** `year`, `country`, `event`.  

---

## 2011 Dünya / Tarihsel snapshot oluşturma — adım adım

- 2011 için `South Sudan`'ı kaldırın.
- Eğer `Sudan` geometrisi güneyi içermiyorsa `South Sudan` ile birleştirin.
- Sonucu `data/geo/2011/countries.geo.json` olarak kaydedin.

---

## Coğrafi verilerle çalışmak — pratik ipuçları

- Büyük dosyalar için `mapshaper` ile simplify yapın.
- TopoJSON kullanarak boyutu küçültün.
- Yıllara göre ayrı klasörler oluşturun.

---

## map.js: önerilen geliştirmeler

- Yıla göre farklı GeoJSON yükleme.
- Tıklamada otomatik zoom kapatma.

---

## Katkıda bulunma rehberi

1. Fork → Branch → Commit → PR.
2. Kod stilini koruyun (ESLint + Prettier).
3. Veri eklerken dosya yapısına sadık kalın.

---

## Lisans ve .gitignore önerisi

MIT Lisansı kullanın.

Örnek `.gitignore`:
```
node_modules/
dist/
.vscode/
.idea/
.env
```

---

## Gelişmiş öneriler

- CI/CD için GitHub Actions.
- Gelir paylaşımı ve bounty sistemi.

---

## SSS & sorun giderme

**Harita açılmıyor:** Konsolu kontrol edin, dosya yollarını doğrulayın.

---

## İletişim

Sorularınız için repo üzerinden issue açabilirsiniz.

"deneme"



"de
