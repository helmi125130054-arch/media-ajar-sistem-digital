# Media Ajar Interaktif MK Sistem Digital (HTML5)

Aplikasi media ajar berbasis web mandiri (*self-contained HTML5*) yang dirancang khusus untuk mata kuliah **Sistem Digital** (3 SKS), mengacu pada silabus standar perguruan tinggi dan materi perkuliahan Institut Teknologi Sumatera (ITERA).

---

## 🌟 Fitur Utama

### 1. Struktur Kurikulum Semester Penuh (Minggu 1 s.d. 14)
- **Navigasi Minggu 1–14**: Bar navigasi atas yang dapat digeser (*scrollable*) dengan indikator status modul (*Tersedia* / *Rencana*).
- **Sub-Navigasi Terstruktur**:
  - 📖 **Materi & Konsep**: Teori ringkas, definisi, analog vs digital, MSB/LSB, nibble, byte, word, bilangan pecahan.
  - ⚡ **Metode Biner Sentral**: Simulator konversi interaktif multi-arah yang menjadikan Biner sebagai poros sentral.
  - 🎛️ **Lab Sakelar Bit**: Simulator sakelar fisik 8-bit, 12-bit, dan 16-bit dengan pengelompokan 3 & 4 bit seketika.
  - 🎯 **Latihan Terstruktur & Kuis**: Latihan terstruktur persis dari slide kuliah (contoh: 258, 0.625, 2F) dan Generator Soal Acak (Mode Tantangan).

### 2. Konsep Pedagogis: Biner sebagai Poros Sentral (Central Binary Hub)
Sesuai rancangan instruktur:
- Bilangan masukan (Desimal, Oktal, atau Heksadesimal) selalu **dikonversi terlebih dahulu ke BINER**.
- Dari representasi BINER sentral:
  - Dikelompokkan **4 bit (nibble)** dari titik koma ke kiri/kanan &rarr; **Heksadesimal** (dengan *zero padding* otomatis yang disorot).
  - Dikelompokkan **3 bit** dari titik koma ke kiri/kanan &rarr; **Oktal** (dengan *zero padding* otomatis yang disorot).
  - Dikalikan dengan bobot posisi **$2^n$** lalu dijumlahkan seluruhnya &rarr; **Desimal**.
- Mendukung **bilangan bulat maupun pecahan** (contoh: $0.625_{10} = 0.101_2$, $1101.101_2$, $25.625_{10}$).

### 3. Bonus Lengkap: Modul Minggu 2 (Pertemuan 2 ITERA)
- Representasi Bilangan Negatif: **Sign-Magnitude**, **1's Complement**, dan **2's Complement (C2)**.
- Simulator 3-Langkah Pembentukan C2 (Magnitudo &rarr; NOT &rarr; +1 pada LSB).
- Aritmatika Pengurangan via Penjumlahan: $A - B = A + C_2(B)$.
- Deteksi Hardware **Overflow**: $(\text{Carry ke MSB}) \oplus (\text{Carry keluar MSB}) = 1$.
- Prinsip **Sign Extension** ($8 \rightarrow 16$ bit).

---

## 🚀 Cara Menjalankan Aplikasi

Aplikasi ini bersifat **100% Client-Side** tanpa memerlukan instalasi Node.js, Python, ataupun web server:

1. **Cara Termudah**:
   Cukup klik ganda berkas `index.html` pada peramban web modern apa pun:
   - Google Chrome
   - Microsoft Edge
   - Mozilla Firefox
   - Safari / Opera

2. Berkas proyek tersedia pada:
   - Berkas mandiri (*all-in-one*): `C:\Users\miuu\.gemini\antigravity\brain\e9e6a638-9626-4b8f-9db7-74f62e000ade\index.html`
   - Berkas terstruktur: `C:\Users\miuu\.gemini\antigravity\brain\e9e6a638-9626-4b8f-9db7-74f62e000ade\sistem-digital-learning-media\`

---

## 📚 Referensi Buku Teks Kuliah
1. **Frank Vahid & Tony Givargis** – *Embedded System Design: A Unified Hardware/Software Introduction* (Wiley, 2nd Ed., 2010).
2. **Raj Kamal** – *Embedded Systems: Architecture, Programming and Design* (McGraw-Hill, 3rd Ed., 2014).
3. **Peter Barry & Patrick Crowley** – *Modern Embedded Computing* (Morgan Kaufmann, 2012).
