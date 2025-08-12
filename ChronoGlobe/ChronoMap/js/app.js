(() => {
  // Global state
  const state = {
    currentYear: 2025,
    selectedCountryName: null,
    countryInfoCache: null,
    eventsCache: null,
    countryNamesTR: {}
  };

  // HTML elemanını güncelle (boşsa fallback göster)
  const updateField = (id, value, fallback = "Bilinmiyor") => {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = (value !== undefined && value !== null && value !== "") ? value : fallback;
  };

  // Türkçe ülke isimlerini yükle
  const loadCountryNamesTR = async () => {
    try {
      const res = await fetch("data/country-names-tr.json");
      if (!res.ok) throw new Error(`country-names-tr.json yüklenemedi (${res.status})`);
      state.countryNamesTR = await res.json();
    } catch (err) {
      console.error("Ülke isimleri çeviri dosyası alınamadı:", err);
      state.countryNamesTR = {};
    }
  };

  // İngilizce ismi Türkçe çevir
  const getCountryNameTR = (englishName) => {
    return state.countryNamesTR[englishName] || englishName;
  };

  // country-info.json'u yükle ve cachele
  const loadCountryInfo = async () => {
    if (state.countryInfoCache) return state.countryInfoCache;
    try {
      const res = await fetch("data/country-info.json");
      if (!res.ok) throw new Error(`country-info.json yüklenemedi (${res.status})`);
      const json = await res.json();
      state.countryInfoCache = json;
      return json;
    } catch (err) {
      console.error("Ülke bilgileri alınamadı:", err);
      return {};
    }
  };

  // events.json'u yükle ve cachele
  const loadEvents = async () => {
    if (state.eventsCache) return state.eventsCache;
    try {
      const res = await fetch("data/events.json");
      if (!res.ok) throw new Error(`events.json yüklenemedi (${res.status})`);
      const json = await res.json();
      state.eventsCache = json;
      return json;
    } catch (err) {
      console.error("Olay bilgileri alınamadı:", err);
      return {};
    }
  };

  // Seçilen ülke ve yıl için bilgileri göster
  const showCountryDetails = async (name, year) => {
    const countryInfo = await loadCountryInfo();
    const eventsData = await loadEvents();

    const yearStr = String(year);
    const country = countryInfo[name];
    const yearData = country?.years?.[yearStr] || {};

    // Temel bilgiler
    [
      "capital", "founded", "languages", "government", "religion",
      "continent", "currency", "callingCode", "internetCode", "borders",
      "population", "area", "populationDensity"
    ].forEach(id => updateField(id, yearData[id]));

    // Tarihçe içeriği
    const historyEl = document.getElementById("history");
    if (yearData.content && typeof yearData.content === "object") {
      historyEl.innerHTML = Object.entries(yearData.content)
        .map(([title, text]) => `<div class="history-section"><h4>${title}</h4><p>${text || "Bilgi bulunamadı."}</p></div>`)
        .join("");
    } else {
      historyEl.textContent = "Henüz tarihsel bilgi bulunamadı.";
    }

    // Bu yıl ne olmuş? - events listesini göster
    const eventsListEl = document.getElementById("events-list");
    if (eventsListEl) {
      const eventsForYear = eventsData[name]?.[yearStr] || ["Bu yıl için kayıtlı olay yok."];
      eventsListEl.innerHTML = eventsForYear.map(ev => `<li>${ev}</li>`).join("");
    }
  };

  // Yıl değiştiğinde yapılacak işlemler
  const onYearChange = (newYear) => {
    state.currentYear = newYear;

    ["current-year", "year-slider-value", "footer-year"].forEach(id => updateField(id, newYear));
    updateField("selected-year", `Yıl: ${newYear}`);

    if (state.selectedCountryName) {
      showCountryDetails(state.selectedCountryName, newYear);
    }
  };

  // Yıl kontrol bileşenleri
  const initYearControls = () => {
    const slider = document.getElementById("year-slider");
    const btnPrev = document.getElementById("btn-prev");
    const btnNext = document.getElementById("btn-next");

    if (!slider || !btnPrev || !btnNext) return;

    slider.addEventListener("input", e => onYearChange(Number(e.target.value)));
    btnPrev.addEventListener("click", () => onYearChange(Math.max(Number(slider.min), state.currentYear - 1)));
    btnNext.addEventListener("click", () => onYearChange(Math.min(Number(slider.max), state.currentYear + 1)));
  };

  // Mini navigasyon paneli
  const initMiniNavPanel = () => {
    const miniPanel = document.getElementById("mini-nav-panel");
    const aboutSubmenu = document.getElementById("about-submenu");
    const infoPanel = document.getElementById("info-panel");
    const btnExpand = document.getElementById("btn-expand");

    if (!miniPanel || !aboutSubmenu || !btnExpand || !infoPanel) return;

    btnExpand.addEventListener("click", () => {
      if (infoPanel.classList.contains("fullscreen")) {
        miniPanel.style.display = "block";
      } else {
        miniPanel.style.display = "none";
        aboutSubmenu.style.display = "none";
      }
    });

    miniPanel.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn || !miniPanel.contains(btn)) return;

  const scrollId = btn.dataset.scroll;

  // "Ülke Hakkında" butonuna tıklanırsa alt menüyü aç/kapat
  if (scrollId === "history-section") {
    aboutSubmenu.style.display =
      (aboutSubmenu.style.display === "none" || aboutSubmenu.style.display === "")
        ? "block"
        : "none";
  }

  // İlgili bölüme yumuşak kaydırma
  if (scrollId) {
    document.getElementById(scrollId)?.scrollIntoView({ behavior: "smooth" });
  }
});

  };

  // Ülke seçildiğinde
  window.addEventListener("country:selected", (e) => {
    const { name } = e.detail;
    state.selectedCountryName = name;

    updateField("country-name", getCountryNameTR(name));
    updateField("selected-year", `Yıl: ${state.currentYear}`);

    showCountryDetails(name, state.currentYear);
  });

  // DOMContentLoaded
  document.addEventListener("DOMContentLoaded", async () => {
    await loadCountryNamesTR();
    initYearControls();
    onYearChange(state.currentYear);
    initMiniNavPanel();
  });

})();
