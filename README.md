# 🌤️ SkyCheck — Aplikasi Informasi Cuaca

Mini Project Pemrograman Web | Sistem Informasi | Universitas Muhammadiyah Surakarta

---

## 📁 Struktur Folder

```
WeatherApp/
│
├── index.html        ← Halaman utama (struktur HTML)
│
├── css/
│   └── style.css     ← Semua styling (tampilan & layout)
│
├── js/
│   └── app.js        ← Logika aplikasi & koneksi ke API
│
└── README.md         ← Dokumentasi project ini
```

---

## 🚀 Cara Menjalankan

1. Buka folder **WeatherApp** di VS Code
2. Install ekstensi **Live Server** (oleh Ritwick Dey)
3. Klik kanan `index.html` → **Open with Live Server**
4. Browser membuka `http://127.0.0.1:5500`
5. Masukkan **API Key OpenWeatherMap** → klik **Simpan**
6. Ketik nama kota → klik **Cari** ✅

---

## 🔑 Cara Mendapat API Key OpenWeatherMap

1. Buka https://openweathermap.org/api
2. Klik **Sign Up** → isi form → verifikasi email
3. Login → klik nama profil → **My API Keys**
4. Copy API Key yang sudah tersedia (aktif dalam ~2 jam)

---

## 🌐 API yang Digunakan

| Keterangan | Detail |
|---|---|
| Nama API | OpenWeatherMap |
| Endpoint | `api.openweathermap.org/data/2.5/weather` |
| Format | JSON |
| Biaya | Gratis |

## 📊 Data yang Ditampilkan

- Suhu saat ini, terasa seperti, min/maks
- Kondisi cuaca + emoji dinamis
- Kelembapan udara
- Kecepatan & arah angin
- Tekanan udara
- Jarak pandang
- Waktu matahari terbit & terbenam
- Waktu lokal kota yang dicari
