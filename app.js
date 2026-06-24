// ============================================
//   SkyCheck — app.js
//   Mini Project Web Programming
//   Universitas Muhammadiyah Surakarta
// ============================================

// ── KONSTANTA ──
const API_BASE = 'https://api.openweathermap.org/data/2.5/weather';
let API_KEY = localStorage.getItem('owm_api_key') || '';

// ── ELEMEN DOM MODAL ──
const modal = document.getElementById('settingsModal');
const settingsBtn = document.getElementById('settingsBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const modalOverlay = document.getElementById('modalOverlay');

// ── INISIALISASI ──
document.addEventListener('DOMContentLoaded', () => {
  if (API_KEY) {
    document.getElementById('apiKeyInput').value = API_KEY;
    document.getElementById('keyStatus').textContent = '✅ API Key tersimpan';
    document.getElementById('keyStatus').style.color = '#2ecc71';
    updateKeyIndicator(true);
    showState('ready');
  } else {
    updateKeyIndicator(false);
    showState('nokey');
    // Buka modal secara otomatis jika pengguna belum mengatur API Key
    showSettingsModal();
  }
});

// ── EVENT LISTENERS MODAL ──
settingsBtn.addEventListener('click', showSettingsModal);
closeModalBtn.addEventListener('click', hideSettingsModal);
modalOverlay.addEventListener('click', hideSettingsModal);

// Tutup modal dengan tombol Escape
window.addEventListener('keydown', e => {
  if (e.key === 'Escape' && modal.style.display === 'flex') {
    hideSettingsModal();
  }
});

// ── FUNGSI: Kontrol Modal ──
function showSettingsModal() {
  modal.style.display = 'flex';
}

function hideSettingsModal() {
  modal.style.display = 'none';
}

// ── FUNGSI: Perbarui Indikator Kunci ──
function updateKeyIndicator(isConfigured) {
  const indicator = document.getElementById('keyIndicator');
  if (indicator) {
    if (isConfigured) {
      indicator.classList.add('configured');
    } else {
      indicator.classList.remove('configured');
    }
  }
}

// ── FUNGSI: Simpan API Key ──
function saveApiKey() {
  const val = document.getElementById('apiKeyInput').value.trim();
  if (!val) { 
    alert('Masukkan API Key terlebih dahulu!'); 
    return; 
  }
  API_KEY = val;
  localStorage.setItem('owm_api_key', val);
  
  document.getElementById('keyStatus').textContent = '✅ Tersimpan! Sekarang cari kota.';
  document.getElementById('keyStatus').style.color = '#2ecc71';
  updateKeyIndicator(true);
  showState('ready');

  // Tutup modal secara otomatis setelah 800ms
  setTimeout(() => {
    hideSettingsModal();
  }, 800);
}

// ── FUNGSI: Tampilkan State ──
function showState(type) {
  const container = document.getElementById('weatherContainer');
  const mainCard  = document.getElementById('mainCard');
  mainCard.style.display = 'none';
  container.style.display = 'block';

  // Reset kelas latar belakang ke default saat kembali ke state awal/error
  if (type !== 'loading' && type !== 'ready') {
    updateBodyTheme('default');
  }

  const states = {
    nokey: { 
      icon: '🔑', 
      text: 'API Key OpenWeatherMap belum diatur.<br>Silakan klik tombol <strong>⚙️ API Key</strong> di kanan atas untuk menyiapkannya.' 
    },
    ready: { 
      icon: '🌤️', 
      text: 'Ketik nama kota di kolom pencarian di atas, lalu tekan Cari.' 
    },
    loading: { 
      icon: '⏳', 
      text: 'Mengambil data cuaca...' 
    },
    notfound: { 
      icon: '🗺️', 
      text: 'Kota tidak ditemukan.<br>Coba periksa kembali ejaan nama kota.' 
    },
    error: { 
      icon: '⚠️', 
      text: 'Gagal mengambil data.<br>Cek API Key Anda atau periksa koneksi internet Anda.' 
    },
  };

  const s = states[type] || states.error;
  container.innerHTML = `
    <div class="state-box">
      <div class="s-icon">${s.icon}</div>
      <p>${s.text}</p>
    </div>`;
}

// ── FUNGSI: Perbarui Tema Latar Belakang Tubuh ──
function updateBodyTheme(theme) {
  // Hapus semua kelas tema yang ada
  document.body.classList.remove(
    'weather-default',
    'weather-sunny',
    'weather-cloudy',
    'weather-rainy',
    'weather-snowy',
    'weather-night'
  );
  // Tambahkan kelas tema baru
  document.body.classList.add(`weather-${theme}`);
}

// ── FUNGSI: Format waktu Unix → HH:MM ──
function formatTime(unix, offset) {
  const d = new Date((unix + offset) * 1000);
  return d.toUTCString().slice(17, 22);
}

// ── FUNGSI: Emoji cuaca berdasarkan kode kondisi ──
function weatherEmoji(code, icon) {
  const night = icon && icon.endsWith('n');
  if (code >= 200 && code < 300) return '⛈️';
  if (code >= 300 && code < 400) return '🌦️';
  if (code >= 500 && code < 600) return '🌧️';
  if (code >= 600 && code < 700) return '❄️';
  if (code >= 700 && code < 800) return '🌫️';
  if (code === 800) return night ? '🌙' : '☀️';
  if (code === 801) return night ? '🌙' : '🌤️';
  if (code >= 802 && code <= 804) return '☁️';
  return '🌡️';
}

// ── FUNGSI: Arah angin dari derajat ──
function windDir(deg) {
  const dirs = ['U','TL','T','TG','S','BD','B','BL'];
  return dirs[Math.round(deg / 45) % 8];
}

// ── FUNGSI: Cari cuaca kota ──
async function searchWeather() {
  const city = document.getElementById('searchInput').value.trim();
  if (!city) return;
  if (!API_KEY) { 
    showState('nokey'); 
    showSettingsModal();
    return; 
  }

  showState('loading');

  try {
    const url = `${API_BASE}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=id`;
    const res  = await fetch(url);

    if (res.status === 404) { 
      showState('notfound'); 
      return; 
    }
    if (res.status === 401) {
      document.getElementById('keyStatus').textContent = '❌ API Key tidak valid';
      document.getElementById('keyStatus').style.color = '#ff7675';
      updateKeyIndicator(false);
      showState('error'); 
      showSettingsModal(); 
      return;
    }
    if (!res.ok) { 
      showState('error'); 
      return; 
    }

    const data = await res.json();
    renderWeather(data);

  } catch (e) {
    showState('error');
  }
}

// ── FUNGSI: Render data cuaca ke tampilan ──
function renderWeather(d) {
  const container = document.getElementById('weatherContainer');
  const mainCard  = document.getElementById('mainCard');

  const tempNow   = Math.round(d.main.temp);
  const tempFeel  = Math.round(d.main.feels_like);
  const tempMin   = Math.round(d.main.temp_min);
  const tempMax   = Math.round(d.main.temp_max);
  const humidity  = d.main.humidity;
  const pressure  = d.main.pressure;
  const windSpeed = (d.wind.speed * 3.6).toFixed(1); // m/s → km/h
  const windDeg   = d.wind.deg;
  const visibility= d.visibility ? (d.visibility / 1000).toFixed(1) + ' km' : '—';
  const condition = d.weather[0].description;
  const code      = d.weather[0].id;
  const icon      = d.weather[0].icon;
  const emoji     = weatherEmoji(code, icon);
  const country   = d.sys.country;
  const sunrise   = formatTime(d.sys.sunrise, d.timezone);
  const sunset    = formatTime(d.sys.sunset, d.timezone);

  // Waktu lokal kota
  const localTime = new Date((Math.floor(Date.now()/1000) + d.timezone) * 1000);
  const timeStr   = localTime.toUTCString().slice(0, 25);

  // Tentukan tema latar belakang berdasarkan cuaca & siang/malam
  const isNight = icon && icon.endsWith('n');
  if (isNight) {
    updateBodyTheme('night');
  } else {
    if (code >= 200 && code < 600) {
      updateBodyTheme('rainy');
    } else if (code >= 600 && code < 700) {
      updateBodyTheme('snowy');
    } else if (code >= 700 && code < 800 || code > 800) {
      updateBodyTheme('cloudy');
    } else if (code === 800) {
      updateBodyTheme('sunny');
    } else {
      updateBodyTheme('default');
    }
  }

  // Sembunyikan state, tampilkan card
  container.style.display = 'none';
  mainCard.style.display = 'block';

  document.getElementById('cityName').innerHTML    = `<span class="flag">📍</span> ${d.name}, ${country}`;
  document.getElementById('tempBig').innerHTML     = `${tempNow}<sup>°C</sup>`;
  document.getElementById('weatherIcon').textContent = emoji;
  document.getElementById('condition').textContent = condition;
  document.getElementById('feelsLike').textContent = `Terasa seperti ${tempFeel}°C · Min ${tempMin}°C / Maks ${tempMax}°C`;

  document.getElementById('statHumidity').textContent  = `${humidity}%`;
  document.getElementById('statWind').textContent      = `${windSpeed} km/j ${windDir(windDeg)}`;
  document.getElementById('statPressure').textContent  = `${pressure} hPa`;
  document.getElementById('statVis').textContent       = visibility;

  document.getElementById('sunrise').textContent = sunrise;
  document.getElementById('sunset').textContent  = sunset;
  document.getElementById('datetime').textContent = `🕐 Waktu lokal: ${timeStr}`;
}

// ── FUNGSI: Klik kota cepat ──
function quickSearch(city) {
  document.getElementById('searchInput').value = city;
  searchWeather();
}

// ── EVENT: Enter di input pencarian ──
document.getElementById('searchInput')
  .addEventListener('keydown', e => { 
    if (e.key === 'Enter') searchWeather(); 
  });
