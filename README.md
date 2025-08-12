ChronoGlobe
ChronoGlobe — tarihsel dünya haritası ve zaman kontrolü aracı. Harita üzerinden yıllara göre (zaman çizgisi) ülke bilgilerini, olayları görselleştiren, interaktif, açık kaynaklı bir web uygulaması.

Vizyon: Tarihi olayları mekânsal bağlamda keşfetmeyi herkes için kolay, eğlenceli ve açık hale getirmek.

İçindekiler
Özet

Öne çıkan özellikler

Düzeltilmiş proje dosya yapısı

Hızlı başlama (local)

Veri yapıları — JSON şemaları (örnekler)

2011 Dünya / Tarihsel snapshot oluşturma — adımlar (özet & uygulanabilir)

Coğrafi verilerle çalışmak — pratik ipuçları

map.js için önerilen değişiklikler

Katkıda bulunma rehberi (özet)

Lisans, .gitignore ve repo yönetimi önerileri

Sık Sorulan Sorular (SSS) & sorun giderme

İletişim / kaynaklar

1 — Özet
ChronoGlobe; HTML/CSS/JS + Leaflet kullanır. Tüm veri kaynakları data/ içinde JSON/GeoJSON olarak saklanır. Amaç; yıllara göre (snapshot) farklı coğrafi durumları/paylaşılan veriyi kolay yönetilebilir hâle getirmek ve geliştirici/topluluk katkısını teşvik etmektir.

2 — Öne çıkan özellikler
Yıl seçici (slider + ileri/geri) — UI ve harita yıl bazlı güncellenir.

Ülke arama kutusu (Türkçe isim desteği).

Bilgi paneli: başkent, nüfus, yüzölçümü, tarihçe alt bölümleri ve o yıla ait olaylar.

Harita: Leaflet + GeoJSON, hover tooltip, tıklama seçimi (isteğe göre zoom kapatılabilir).

Açık veri yapısı: countries.geo.json, country-info.json, events.json.

Tarihsel snapshot desteği: data/geo/<year>/countries.geo.json şeklinde dizinleme.

3 — Düzeltilmiş proje dosya yapısı
Bu README, tutarlı ve kolay yönetilebilir bir dosya yapısına göre düzenlenmiştir:

yaml
Kopyala
Düzenle
ChronoGlobe/
├─ index.html
├─ README.md
├─ LICENSE
├─ .gitignore
├─ package.json                # opsiyonel: build / dev script'leri için
├─ data/
│  ├─ countries.geo.json       # güncel (varsayılan) dünya GeoJSON
│  ├─ country-names-tr.json
│  ├─ country-info.json
│  ├─ events.json
│  └─ geo/
│     ├─ 2011/
│     │  └─ countries.geo.json  # 2011 snapshot
│     └─ 2025/
│        └─ countries.geo.json  # 2025 snapshot (varsayılan örnek)
├─ js/
│  ├─ app.js
│  ├─ map.js
│  └─ utils/
│     └─ make-2011-world.js     # yardımcı araç (opsiyonel)
├─ style/
│  └─ style.css
└─ .github/
   └─ workflows/
      └─ ci.yml                 # opsiyonel CI konfigürasyonu
Not: Önceki karışık ChronoMap/ alt klasörü ya da benzeri iki katmanlı yapı yerine tek kök ChronoGlobe/ tavsiye ediyorum — hem GitHub Pages hem de local server kullanımında daha basit olur. Eğer repo hâli hazırda başka bir kök kullanıyorsa README'yi ona göre kolayca uyarlayabilirsin.

4 — Hızlı başlama (local)
bash
Kopyala
Düzenle
git clone https://github.com/<kullanici>/ChronoGlobe.git
cd ChronoGlobe

# opsiyonel node bağımlılıkları
npm install

# basit bir static server
npx http-server -c-1 -p 8080 .
# veya
python -m http.server 8080

# tarayıcıda aç:
http://localhost:8080
5 — Veri yapıları — JSON şemaları (örnekler)
5.1 countries.geo.json (GeoJSON — FeatureCollection)
Her feature bir ülkeyi temsil eder. Örnek küçük bir entry:

json
Kopyala
Düzenle
{
  "type": "Feature",
  "id": "SDN",
  "properties": {
    "name": "Sudan",
    "name_tr": "Sudan",
    "iso_a3": "SDN"
  },
  "geometry": {
    "type": "Polygon",
    "coordinates": [
      [
        [29.0, 10.0],
        [30.0, 10.0],
        ...
      ]
    ]
  }
}
Önemli notlar:

id olarak ISO-3166-3 veya ISO-3166-2 formatı (tutarlı tuttuğun bir format) kullanılmalı.

properties.name (İngilizce) uygulamada ana anahtar olarak kullanılır. name_tr opsiyonel ama arama/i18n için faydalı.

5.2 country-info.json
Yıl bazlı metadata örneği:

json
Kopyala
Düzenle
{
  "SDN": {
    "name": "Sudan",
    "capital": "Khartoum",
    "years": {
      "2010": {
        "population": 35000000,
        "area": 1886068,
        "content": {
          "Kuruluş": "Bilgi...",
          "Siyasi": "Bilgi..."
        }
      },
      "2011": {
        "population": 35300000,
        "area": 1886068
      }
    }
  }
}
years objesi anahtarları string yıl (örn. "2011") olmalı.

5.3 events.json
json
Kopyala
Düzenle
{
  "SDN": {
    "2011": [
      {
        "title": "Güney Sudan'ın bağımsızlığı",
        "date": "2011-07-09",
        "description": "Güney Sudan bağımsız bir devlet olarak ilan edildi."
      }
    ]
  }
}
6 — 2011 Dünya / Tarihsel snapshot oluşturma — adım adım (özet)
Aşağıdaki adımlar, 2011 yılı için geçerli dünya haritasını (ör. South Sudan henüz ayrılmamış hâliyle Sudan) oluşturmanı sağlar.

Özet adımlar (uygulanabilir, pratik):

Mevcut en güncel GeoJSON’u yedekle (data/countries.geo.json).

Kaynak GeoJSON'u hazırla: elimizde güncel (2025 gibi) GeoJSON varsa, 2011 durumunu elde etmek için:

South Sudan (feature SSD) varsa, onu kaldır ya da Sudan (SDN) ile birleştir (merge).

Eğer SDN geometrisi Güney Sudan'ı kapsayacak şekilde genişletilmişse, 2011 için bu hali kullan; aksi halde SDN ve SSD geometrilerini birleştirip yeni SDN geometrisini oluştur.

GeoJSON editör / araç kullan:

mapshaper ile prune / merge / simplify işlemleri yap:

bash
Kopyala
Düzenle
# örnek: SSD sil, SDN'yi birleştir
mapshaper data/countries.geo.json -filter 'properties.name!="South Sudan"' -o data/geo/2011/countries.geo.json
(Daha net merge gerekiyorsa .json açıp SDN geometrisini SSD geometrisiyle birleştir.)

Topolojik tutarlılığı kontrol et: Çokgenlerin yönleri, çakışma(duplicate) veya küçük delikler olup olmadığına bak. mapshaper -clean kullanılabilir.

bash
Kopyala
Düzenle
mapshaper data/geo/2011/countries.geo.json -clean -o data/geo/2011/countries.geo.json
Dosya küçültme (opsiyonel ama önerilir): -simplify ile noktaları azalt; TopoJSON'ye çevir ve sıkıştır. Örnek:

bash
Kopyala
Düzenle
mapshaper data/geo/2011/countries.geo.json -simplify 5% -o data/geo/2011/countries.simplified.geo.json
Uygulama entegrasyonu: map.js veya app.js içinde yıl seçimine göre data/geo/2011/countries.geo.json yükleyecek kodu ekle.

Test: Local server üzerinde 2011 yılı seçildiğinde beklenen haritanın (Sudan’ın güneyi dahil değil) görüntülendiğini doğrula.

Not: South Sudan 9 Temmuz 2011'de resmen bağımsız oldu. 2011 yılının "başı" için (ör. 2011-01-01) Güney Sudan hâlâ Sudan parçası kabul edilir; 2011 sonrası (özellikle 2011-07-09) için ayrı bir feature (SSD) kullanmak mantıklı.

7 — Coğrafi verilerle çalışmak — pratik ipuçları
Büyük GeoJSON dosyalarını mapshaper ile basitleştir:
mapshaper input.geojson -simplify 10% -o output.geojson

TopoJSON kullanmak transfer boyutunu ciddi azaltır (özellikle web).

Her feature properties içinde en az: id, name, iso_a3 olsun. Bu alanlara uygulama kodu bağlı olacak.

Coğrafi sınırlar (öz. ayrılma tarihleri) için güvenilir kaynak kullan. (Natural Earth, GADM vb.)

Versiyon kontrolü: büyük GeoJSON'ları metin farkı (diff) açısından daha okunabilir hale getirmek için mapshaper -o format=geojson veya prettier ile biçimlendir.

8 — map.js için önerilen değişiklikler
Yıl bazlı GeoJSON yükleme: Slider değiştiğinde fetch("data/geo/<year>/countries.geo.json") ile lazy-load yap. Cache: aynı yıl tekrar istenirse tekrar fetch yapma.

Tıklamada otomatik zoom kapatma: map.fitBounds() çağrısını kaldır veya bir ayar (config.clickZoom = false) ile kontrol et.

Seçili ülke vurgulama: Seçili layer'a özel style ver, hover/mouseout reset mantığını selectedLayer ile koru.

Performans: Büyük dosyalar için ekran dışındaki bölgeler için GeoJSON parçalarına ayırma (tile/region-based loading).

9 — Katkıda bulunma rehberi (kısa)
Repo'yu fork et.

Yeni bir branch aç (feature/your-change).

Değişiklik yap, küçük ve anlamlı commit mesajları kullan.

Test et — lokal server çalışıyor mu kontrol et.

Pull request açarken ne yaptığını ve nedenini açıkça yaz.

Veri ekliyorsan; country-info ve events için örnek ve kaynak belirt.

Bağış / ödül sistemi düşünüyorsanız (bounty): katkı kurallarını CONTRIBUTING.md içinde açıkça yazın. Örnek: "Yılı/özelliği ekleyen, doğrulayan ve PR onayını alan kişi ödülün %x'ini alır" gibi.

10 — Lisans ve .gitignore önerisi
Lisans: MIT önerilir. LICENSE dosyasına MIT metnini ekle.

Örnek .gitignore:

bash
Kopyala
Düzenle
node_modules/
dist/
.vscode/
.idea/
.env
.DS_Store
data/geo/**/countries.geo.json.gz   # opsiyonel: sıkıştırılmış büyük dosyalar
11 — SSS & sorun giderme
Harita açılmıyor / boş görünüyor:

Konsolu (DevTools) kontrol et (404 hataları, CORS, JSON parse hatası).

data/ yolunu kontrol et. Local olarak file:// ile değil bir HTTP server ile çalıştır.

GeoJSON çok ağır / sayfa yavaş:

mapshaper -simplify ile azalt. TopoJSON'ye dönüştür.

Sudan / Güney Sudan sınır problemi:

2011 snapshot'ında SSD'yi kaldır veya SDN geometri ile birleştir. Çift özellik (duplicate) veya overlapped polygon olmasın.

12 — İletişim / kaynaklar
Leaflet: https://leafletjs.com

mapshaper: https://mapshaper.org

Natural Earth (coğrafi referans): https://www.naturalearthdata.com

Son söz
Bu README, projenin yapısını düzene koymak, tarihsel snapshot yönetimini netleştirmek ve katkı süreçlerini kolaylaştırmak için hazırlandı. İstersen ben bunu doğrudan proje köküne README.md olarak yazabilirim (yerel olarak oluşturup link veririm) veya .github/ISSUE_TEMPLATE.md, CONTRIBUTING.md gibi destekleyici dosyaları da hazırlayayım.
