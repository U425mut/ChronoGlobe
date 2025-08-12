# ChronoGlobe

**ChronoGlobe** — tarihsel dünya haritası ve zaman kontrolü aracı. Harita üzerinden yıllara göre (zaman çizgisi) ülke bilgilerini, olayları görselleştiren, interaktif, açık kaynaklı bir web uygulaması.

> **Vizyon:** Tarihi olayları mekânsal bağlamda keşfetmeyi herkes için kolay, eğlenceli ve açık hale getirmek.

---

## İçindekiler
1. [Özet](#özet)  
2. [Öne çıkan özellikler](#öne-çıkan-özellikler)  
3. [Proje mimarisi ve dosya yapısı](#proje-mimarisi-ve-dosya-yapısı)  
4. [Hızlı başlama (local)](#hızlı-başlama-local)  
5. [Veri yapıları — JSON şemaları](#veri-yapıları---json-şemaları)  
6. [2011 Dünya / Tarihsel snapshot oluşturma — adım adım](#2011-dünya--tarihsel-snapshot-oluşturma---adım-adım)  
7. [Coğrafi verilerle çalışmak — pratik ipuçları](#coğrafi-verilerle-çalışmak---pratik-ipuçları)  
8. [map.js: önerilen geliştirmeler](#mapjs-önerilen-geliştirmeler)  
9. [Katkıda bulunma rehberi](#katkıda-bulunma-rehberi)  
10. [Lisans ve .gitignore önerisi](#lisans-ve-gitignore-önerisi)  
11. [Gelişmiş öneriler](#gelişmiş-öneriler)  
12. [SSS & sorun giderme](#sss--sorun-giderme)  
13. [İletişim](#iletişim)  

---

## Özet
ChronoGlobe; HTML/CSS/JS + [Leaflet](https://leafletjs.com) tabanlı, veri kaynakları `data/` klasöründe saklanan, yıllara göre farklı dünya haritaları ve ülke bilgilerini gösteren (history, events, census vb.) bir uygulamadır.  
Hedef: kolayca katkı alınabilecek, veri ekleme ve tarihsel snapshot yönetimiyle interaktif keşif olanağı sunmak.

---

## Öne çıkan özellikler
- **Yıl seçici** (slider + ileri/geri butonları) — harita ve bilgi paneli yıl bazlı güncellenir.
- **Ülke arama kutusu** — Türkçe isim desteği.
- **Bilgi paneli** — başkent, nüfus, yüzölçümü, tarihçe, o yıla ait olaylar.
- **Harita** — Leaflet ile GeoJSON gösterimi, hover ile tooltip, tıklama ile seçim (isteğe bağlı zoom kapatma).
- **Açık veri yapısı** — `countries.geo.json`, `country-info.json`, `events.json`.
- **Tarihsel snapshot desteği** — her yıl için farklı GeoJSON dosyaları (örn. `2011` yılı haritası).

---

## Proje mimarisi ve dosya yapısı
CHRONOGLOBE/
└── ChronoMap/
├── data/
│ ├── countries.geo.json # Ülkelerin coğrafi sınır verileri
│ ├── country-info.json # Ülkelerin yıllara göre detaylı bilgileri
│ ├── country-names-tr.json # Ülkelerin Türkçe adları
│ └── events.json # Ülkelerin yıllara göre önemli olayları
│
├── js/
│ ├── app.js # Ana uygulama mantığı
│ ├── documentation.html # Proje dokümantasyonu (HTML formatında)
│ ├── license.txt # Lisans metni
│ ├── map.js # Harita işleme ve Leaflet entegrasyonu
│ └── test.html # Test sayfası
│
├── style/
│ └── style.css # Stil dosyaları
│
├── index.html # Ana sayfa
├── LICENSE # Lisans dosyası
└── README.md # Proje tanıtım ve kullanım kılavuzu

---

## Hızlı başlama (local)
1. Depoyu klonlayın:
```bash
git clone https://github.com/<kullanici>/ChronoGlobe.git
cd ChronoGlobe/ChronoMap
(Opsiyonel) Bağımlılıkları yükleyin:

bash
Kopyala
Düzenle
npm install
Lokal sunucu başlatın:

bash
Kopyala
Düzenle
npx http-server -c-1 -p 8080 .
# veya
python -m http.server 8080
Tarayıcıda açın:

arduino
Kopyala
Düzenle
http://localhost:8080
Veri yapıları — JSON şemaları
countries.geo.json
GeoJSON FeatureCollection formatında

Her feature bir ülkeyi temsil eder.

properties alanı ISO kod, İngilizce ve Türkçe isim içerir.

country-info.json
Ülke bilgileri yıllara göre ayrılmıştır.

Örnek:

json
Kopyala
Düzenle
{
  "SDN": {
    "name": "Sudan",
    "capital": "Khartoum",
    "data": {
      "2010": { "population": 35000000, "area": 1886068 },
      "2011": { "population": 35300000, "area": 1886068 }
    }
  }
}
events.json
Ülkelerin yıllara göre önemli olaylarını içerir.

json
Kopyala
Düzenle
{
  "SDN": {
    "2011": [
      { "title": "Olay adı", "description": "Açıklama", "date": "2011-07-09" }
    ]
  }
}
2011 Dünya / Tarihsel snapshot oluşturma — adım adım
South Sudan verisini kaldırın.

Eğer Sudan geometrisi eksikse South Sudan sınırları ile birleştirin.

Dosyayı data/geo/2011/countries.geo.json olarak kaydedin.

Coğrafi verilerle çalışmak — pratik ipuçları
Büyük dosyaları mapshaper ile küçültün (simplify).

Mümkünse TopoJSON formatına dönüştürün.

Yıllara göre ayrı klasörlerde saklayın (data/geo/).

map.js: önerilen geliştirmeler
Yıl seçildiğinde dinamik olarak ilgili GeoJSON’u yükleme.

Tıklamada zoom özelliğini opsiyonel hale getirme.

Katkıda bulunma rehberi
Fork → Branch → Commit → Pull Request.

Kod stilini koruyun (ESLint + Prettier).

Veri eklerken mevcut dosya yapısına uygun ekleme yapın.

Lisans ve .gitignore önerisi
MIT Lisansı önerilir.

Örnek .gitignore:

bash
Kopyala
Düzenle
node_modules/
dist/
.vscode/
.idea/
.env
Gelişmiş öneriler
CI/CD için GitHub Actions kullanın.

Gelir paylaşımı veya ödül sistemi eklenebilir.

SSS & sorun giderme
Harita açılmıyor:

Konsolu kontrol edin (F12 → Console / Network).

Dosya yollarının doğru olduğundan emin olun.

file:// yerine lokal sunucu ile çalıştırın.

İletişim
Sorularınız için GitHub üzerinden issue açabilirsiniz.
