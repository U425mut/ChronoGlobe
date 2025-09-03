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

// 🗺️ OpenStreetMap katmanı
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>'
}).addTo(map);

// 🎨 Ülke varsayılan stili (şeffaflık var)
const defaultCountryStyle = {
  fillColor: "#38A1DB", // mavi
  color: "#ffffff",     // beyaz sınır
  weight: 1,
  opacity: 0.8,         // sınırların şeffaflığı
  fillOpacity: 0.5      // iç rengin şeffaflığı
};

// ✨ Hover stili
const highlightStyle = {
  weight: 2,
  color: "#333333",
  fillOpacity: 0.7
};

let geojsonLayer = null;
let selectedLayer = null;
let hasInitView = false;

/**
 * Ülke etkileşimleri
 */
function handleCountryInteraction(feature, layer) {
  const countryName =
    feature.properties.name_tr ||
    feature.properties.ADMIN ||
    feature.properties.ADMIN_NAME ||
    feature.properties.NAME ||
    feature.properties.name ||
    "Bilinmeyen Ülke";

  const isoCode =
    feature.properties.ISO_A3 ||
    feature.properties.iso_a3 ||
    "---";

  // Tooltip ekle
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
      if (selectedLayer && e.target === selectedLayer) return;
      geojsonLayer.resetStyle(e.target);
    }
  });

  // Tıklama olayı → app.js’e veri gönder
  layer.on("click", function () {
    if (selectedLayer && selectedLayer !== layer) {
      geojsonLayer.resetStyle(selectedLayer);
    }
    selectedLayer = layer;

    const event = new CustomEvent("country:selected", {
      detail: { name: countryName, iso: isoCode }
    });
    window.dispatchEvent(event);
  });
}

/**
 * Seçilen yıla göre GeoJSON verisini yükle
 */
window.loadGeoJsonCountries = function (year) {
  const url = (year === 2011)
    ? "data/countries.geo.2011.json"
    : "data/countries.geo.json";

  // mevcut görünümü sakla
  const center = map.getCenter();
  const zoom   = map.getZoom();

  if (geojsonLayer) {
    map.removeLayer(geojsonLayer);
    geojsonLayer = null;
  }

  fetch(url)
    .then((res) => {
      if (!res.ok) throw new Error("GeoJSON yüklenemedi");
      return res.json();
    })
    .then((geoData) => {
      geojsonLayer = L.geoJSON(geoData, {
        style: defaultCountryStyle,
        onEachFeature: handleCountryInteraction
      }).addTo(map);

      if (!hasInitView) {
        map.fitBounds(geojsonLayer.getBounds());
        map.panBy([0, 95]); // ilk açılışta yukarı kaydır
        hasInitView = true;
      } else {
        map.setView(center, zoom, { animate: false }); // yıl değişince mevcut konum korunur
      }
    })
    .catch((err) => {
      console.error("GeoJSON yükleme hatası:", err);
      alert(`Harita verileri yüklenemedi: ${url}`);
    });
};

// İlk açılışta varsayılan yıl
window.loadGeoJsonCountries(2025);

/**
 * Haritada seçilen ülkeyi odaklar ve seçili stili uygular
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

  if (selectedLayer && selectedLayer !== foundLayer) {
    geojsonLayer.resetStyle(selectedLayer);
  }

  selectedLayer = foundLayer;

  foundLayer.setStyle({
    fillColor: "#FF5722",
    color: "#FF3D00",
    weight: 2,
    fillOpacity: 0.8
  });
};
