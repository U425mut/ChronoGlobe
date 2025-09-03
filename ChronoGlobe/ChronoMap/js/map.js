
/**
 * ChronoGlobe - Harita Modülü (Leaflet)
 * Geliştirici: Umut, 2025
 * Güncelleme: Ülke isimlerini Türkçe gösterme ve seçilen ülkeyi odaklama
 */

// 🌍 Harita oluştur
const map = L.map("leaflet-map", {
  minZoom: 1,
  maxZoom: 8,
  worldCopyJump: true
}).setView([20, 0], 1);

// 🗺️ OpenStreetMap katmanı (dilersen Türkçe destekleyen tile server ekleyebilirsin)
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>'
}).addTo(map);

// 🎨 Ülke varsayılan stili
const defaultCountryStyle = {
  fillColor: "#38A1DB",
  color: "#ffffff",
  weight: 1,
  opacity: 1,
  fillOpacity: 0.6
};

// ✨ Hover stili
const highlightStyle = {
  weight: 2,
  color: "#333333",
  fillOpacity: 0.8
};

let geojsonLayer = null;
let selectedLayer = null; // seçilen ülke katmanı referansı

/**
 * Ülke etkileşimleri
 */
function handleCountryInteraction(feature, layer) {
  // Eğer GeoJSON'da Türkçe isim varsa, onu kullan. Yoksa İngilizce isim.
  const countryName =
    feature.properties.name_tr ||  // Türkçe isim (yeni eklendi)
    feature.properties.ADMIN ||
    feature.properties.ADMIN_NAME ||
    feature.properties.NAME ||
    feature.properties.name ||
    "Bilinmeyen Ülke";

  const isoCode =
    feature.properties.ISO_A3 ||
    feature.properties.iso_a3 ||
    "---";

  // Tooltip ekle (ülke ismi)
  layer.bindTooltip(countryName, {
    permanent: false,
    direction: "center",
    className: "country-tooltip",
    sticky: true
  });

  // Hover efekti
  layer.on("mouseover", function (e) {
    e.target.setStyle(highlightStyle);
    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
      e.target.bringToFront();
    }
  });

  layer.on("mouseout", function (e) {
    if (geojsonLayer) {
      // Seçili katman dışındaki katmanların stili resetlenir
      if (selectedLayer && e.target === selectedLayer) return;
      geojsonLayer.resetStyle(e.target);
    }
  });

  // Tıklama olayı → app.js’e veri gönder
  layer.on("click", function () {
    // Önce önceki seçili ülkenin stili sıfırlanır
    if (selectedLayer && selectedLayer !== layer) {
      geojsonLayer.resetStyle(selectedLayer);
    }

    selectedLayer = layer;




    // Ülke seçimi eventini gönder
    const event = new CustomEvent("country:selected", {
      detail: { name: countryName, iso: isoCode }
    });
    window.dispatchEvent(event);
  });
}

/**
 * GeoJSON verisini yükle ve haritaya ekle
 */
fetch("data/countries.geo.json")
  .then((res) => {
    if (!res.ok) throw new Error("GeoJSON yüklenemedi");
    return res.json();
  })
  .then((geoData) => {
    geojsonLayer = L.geoJSON(geoData, {
      style: defaultCountryStyle,
      onEachFeature: handleCountryInteraction
    }).addTo(map);

    // 🌍 Haritayı tüm dünya görünümüne ayarla
    map.fitBounds(geojsonLayer.getBounds());

    // 📍 Haritayı biraz yukarı kaydır
    map.panBy([0, -60]); // 60px yukarı



    // 🌍 Tüm dünya görünümünü ortala
map.fitBounds(geojsonLayer.getBounds());

// yukarı kaydır
map.panBy([0, 95]); 
  })

  .catch((err) => {
    console.error("GeoJSON yükleme hatası:", err);
    alert(
      'Harita verileri yüklenemedi. "data/countries.geo.json" dosyasını kontrol edin.'
    );
  });

/**
 * Haritada seçilen ülkeyi odaklar ve seçili stili uygular
 * @param {string} engName - Ülkenin İngilizce adı (GeoJSON properties.name ile eşleşmeli)
 */
window.selectCountryOnMap = function (engName) {
  if (!geojsonLayer) return;

  let foundLayer = null;

  geojsonLayer.eachLayer(layer => {
    if (layer.feature && layer.feature.properties.name === engName) {
      foundLayer = layer;
    }
  });

  if (!foundLayer) {
    console.warn("Haritada ülke bulunamadı:", engName);
    return;
  }

  // Önce önceki seçili ülkenin stili sıfırlanır
  if (selectedLayer && selectedLayer !== foundLayer) {
    geojsonLayer.resetStyle(selectedLayer);
  }

  selectedLayer = foundLayer;

  // Seçili ülkeye özel stil uygula
  foundLayer.setStyle({
    fillColor: "#FF5722",
    color: "#FF3D00",
    weight: 2,
    fillOpacity: 0.8
  });

};
