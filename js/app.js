/**
 * Main Application Controller
 * Sistem Digital - Media Ajar Interaktif HTML5
 */

const App = (() => {
  let activeWeek = 1;
  let activeSubmenu = 'central-hub'; // default to Central Binary Hub in Week 1
  let currentBase = 'dec';

  function init() {
    renderWeekNav();
    switchWeek(1, 'central-hub');
  }

  function renderWeekNav() {
    const navEl = document.getElementById('week-nav-container');
    if (!navEl) return;

    let html = '';
    DigitalCurriculum.weeks.forEach(w => {
      const isActive = w.id === activeWeek;
      const statusClass = w.status === 'ready' ? 'ready' : 'upcoming';
      const badgeText = w.status === 'ready' ? 'Tersedia' : 'Rencana';

      html += `
        <button class="week-btn ${isActive ? 'active' : ''} ${statusClass}" onclick="App.switchWeek(${w.id})">
          <span class="week-number">Minggu ${w.id}</span>
          <span class="week-badge">${badgeText}</span>
        </button>
      `;
    });

    navEl.innerHTML = html;
  }

  function switchWeek(weekId, defaultSub = null) {
    activeWeek = weekId;
    const weekData = DigitalCurriculum.weeks.find(w => w.id === weekId);
    if (!weekData) return;

    activeSubmenu = defaultSub || weekData.submenus[0].id;
    renderWeekNav();
    renderSubmenus(weekData);
    renderWeekContent(weekData);
  }

  function renderSubmenus(weekData) {
    const subBar = document.getElementById('submenu-container');
    if (!subBar) return;

    let html = '';
    weekData.submenus.forEach(sub => {
      const isActive = sub.id === activeSubmenu;
      html += `
        <button class="submenu-btn ${isActive ? 'active' : ''}" onclick="App.switchSubmenu('${sub.id}')">
          <span>${sub.icon}</span>
          <span>${sub.name}</span>
        </button>
      `;
    });

    subBar.innerHTML = html;
  }

  function switchSubmenu(subId) {
    activeSubmenu = subId;
    const weekData = DigitalCurriculum.weeks.find(w => w.id === activeWeek);
    if (!weekData) return;

    renderSubmenus(weekData);
    renderWeekContent(weekData);
  }

  function renderWeekContent(weekData) {
    const contentEl = document.getElementById('main-content-container');
    if (!contentEl) return;

    // Header info of current week
    const headerHtml = `
      <div style="margin-bottom: 1.25rem;">
        <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
          <span style="font-size: 0.8rem; font-weight: 700; color: var(--accent-cyan); text-transform: uppercase;">
            Minggu ke-${weekData.id}
          </span>
          <span style="color: var(--text-dim);">•</span>
          <span style="font-size: 0.8rem; color: var(--accent-emerald);">${weekData.cpmk}</span>
        </div>
        <h2 style="font-size: 1.6rem; font-weight: 800; color: #fff;">${weekData.title}</h2>
        <p style="font-size: 0.9rem; color: var(--text-muted);">${weekData.subtitle}</p>
      </div>
    `;

    if (activeWeek === 1) {
      contentEl.innerHTML = headerHtml + getWeek1Content();
      if (activeSubmenu === 'central-hub') {
        runHubConversion();
      } else if (activeSubmenu === 'bit-lab') {
        BitSwitchLab.init('switch-board-container');
      } else if (activeSubmenu === 'quiz') {
        DigitalQuiz.init('quiz-module-container');
      }
    } else if (activeWeek === 2) {
      contentEl.innerHTML = headerHtml + `<div id="week2-content-area"></div>`;
      if (activeSubmenu === 'w2-interactive') {
        Week2Module.init('week2-content-area');
      } else {
        renderWeek2Theory();
      }
    } else {
      contentEl.innerHTML = headerHtml + getUpcomingWeekContent(weekData);
    }
  }

  /* -------------------------------------------------------------
     WEEK 1 CONTENTS
     ------------------------------------------------------------- */
  function getWeek1Content() {
    if (activeSubmenu === 'central-hub') {
      return `
        <!-- Infografis Konsep Poros Biner Sentral -->
        <div class="central-method-banner">
          <div style="flex: 1; min-width: 280px;">
            <div style="font-size: 0.75rem; font-weight: 800; color: var(--accent-cyan); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.35rem;">
              Metode Pedagogis Utama
            </div>
            <h3 style="font-size: 1.15rem; font-weight: 700; color: #fff; margin-bottom: 0.5rem;">
              Konsep Biner Sebagai Poros Sentral (Central Binary Hub)
            </h3>
            <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.5;">
              Dalam kurikulum Sistem Digital, bilangan tidak dikonversi secara langsung antar basis yang rumit (misal Oktal ke Hexa langsung). Sebaliknya, <strong>semua sistem bilangan bermuara ke BINER terlebih dahulu</strong>. Dari Biner, kita hanya perlu mengelompokkan <strong>4 bit</strong> untuk Heksadesimal, <strong>3 bit</strong> untuk Oktal, dan <strong>menjumlahkan bobot 2ⁿ</strong> untuk Desimal.
            </p>
          </div>
          
          <div class="central-method-diagram">
            <div class="node-chip dec">
              <span>DESIMAL</span>
              <span style="font-size: 0.7rem; font-weight: normal;">Basis 10</span>
            </div>
            <div class="node-arrow">&harr;<span>Σ bi · 2ⁱ</span></div>
            <div class="node-chip central">
              <span>BINER (POROS)</span>
              <span style="font-size: 0.7rem; font-weight: 400;">Basis 2</span>
            </div>
            <div class="node-arrow">&harr;<span>Grup 4 Bit</span></div>
            <div class="node-chip hex">
              <span>HEKSADESIMAL</span>
              <span style="font-size: 0.7rem; font-weight: normal;">Basis 16 (0-F)</span>
            </div>
            <div class="node-arrow" style="margin-left: 0.5rem;">&harr;<span>Grup 3 Bit</span></div>
            <div class="node-chip oct">
              <span>OKTAL</span>
              <span style="font-size: 0.7rem; font-weight: normal;">Basis 8 (0-7)</span>
            </div>
          </div>
        </div>

        <!-- Interactive Converter Interface -->
        <div class="card">
          <div class="card-header">
            <div>
              <div class="card-title">
                <span>⚡</span> Simulator Konversi Biner Sentral (Langkah demi Langkah)
              </div>
              <div class="card-subtitle">
                Mendukung bilangan bulat dan pecahan (contoh slide: 258, 251.0011, 0.625, 7562, dll.)
              </div>
            </div>
          </div>

          <div class="converter-box">
            
            <!-- Panel Input -->
            <div class="input-panel">
              
              <div class="form-group">
                <label class="form-label">1. Pilih Basis Asal (Input)</label>
                <div class="base-selector">
                  <button class="base-btn ${currentBase === 'dec' ? 'active' : ''}" onclick="App.setBase('dec')">Desimal (10)</button>
                  <button class="base-btn ${currentBase === 'bin' ? 'active' : ''}" onclick="App.setBase('bin')">Biner (2)</button>
                  <button class="base-btn ${currentBase === 'oct' ? 'active' : ''}" onclick="App.setBase('oct')">Oktal (8)</button>
                  <button class="base-btn ${currentBase === 'hex' ? 'active' : ''}" onclick="App.setBase('hex')">Heksa (16)</button>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label" id="input-label">2. Masukkan Angka (Desimal)</label>
                <input type="text" id="hub-input-val" class="custom-input" value="258" placeholder="Contoh: 258 atau 0.625" onkeyup="if(event.key==='Enter') App.runHubConversion()">
                
                <div style="font-size: 0.75rem; color: var(--text-dim); margin-top: 0.5rem;">
                  Contoh Cepat dari Slide Kuliah:
                </div>
                <div class="preset-pills">
                  <span class="preset-pill" onclick="App.loadPreset('258', 'dec')">258 (Slide 37)</span>
                  <span class="preset-pill" onclick="App.loadPreset('0.625', 'dec')">0.625 (Pecahan Slide 35)</span>
                  <span class="preset-pill" onclick="App.loadPreset('25.625', 'dec')">25.625 (Campuran)</span>
                  <span class="preset-pill" onclick="App.loadPreset('100000010', 'bin')">100000010₂</span>
                  <span class="preset-pill" onclick="App.loadPreset('1101.101', 'bin')">1101.101₂</span>
                  <span class="preset-pill" onclick="App.loadPreset('175', 'oct')">175₈ (Slide 31)</span>
                  <span class="preset-pill" onclick="App.loadPreset('2F', 'hex')">2F₁₆ (Slide 32)</span>
                  <span class="preset-pill" onclick="App.loadPreset('1D.A8', 'hex')">1D.A8₁₆</span>
                </div>
              </div>

              <button class="btn-convert" onclick="App.runHubConversion()">
                <span>Proses Melalui Biner Sentral &rarr;</span>
              </button>

              <div id="converter-error" style="display: none; margin-top: 1rem;" class="quiz-feedback error"></div>
            </div>

            <!-- Panel Output & Visualizer Langkah demi Langkah -->
            <div class="results-area" id="hub-results-area">
              <!-- Dynamically populated -->
            </div>

          </div>
        </div>
      `;
    } else if (activeSubmenu === 'theory') {
      return getWeek1Theory();
    } else if (activeSubmenu === 'bit-lab') {
      return `<div id="switch-board-container"></div>`;
    } else if (activeSubmenu === 'quiz') {
      return `<div id="quiz-module-container"></div>`;
    }
    return '';
  }

  function getWeek1Theory() {
    return `
      <div style="display: flex; flex-direction: column; gap: 1.5rem;">
        
        <!-- Dasar Sistem Digital & Analog vs Digital (Slide 4-5) -->
        <div class="card">
          <div class="card-title">
            <span>💻</span> 1. Definisi & Karakteristik Sistem Digital (Slide 4 - 5)
          </div>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; margin-top: 1rem;">
            
            <div style="background: var(--bg-subtle); padding: 1rem; border-radius: var(--radius-md); border-left: 3px solid var(--accent-cyan);">
              <div style="font-weight: 700; color: #fff; margin-bottom: 0.35rem;">Sistem Analog</div>
              <p style="font-size: 0.85rem; color: var(--text-muted);">
                Memproses data dalam bentuk <strong>sinyal kontinu</strong> (seperti gelombang suara atau tegangan halus tak terputus). Rentan terhadap gangguan (noise) dan distorsi sinyal.
              </p>
            </div>

            <div style="background: var(--bg-subtle); padding: 1rem; border-radius: var(--radius-md); border-left: 3px solid var(--accent-emerald);">
              <div style="font-weight: 700; color: #fff; margin-bottom: 0.35rem;">Sistem Digital (Diskrit)</div>
              <p style="font-size: 0.85rem; color: var(--text-muted);">
                Bekerja dengan data dalam bentuk <strong>diskrit (terputus)</strong> berbasis angka biner (0 dan 1). Memiliki akurasi sangat tinggi, kebal noise, serta mudah diproses dan disimpan oleh komputer.
              </p>
            </div>

          </div>
        </div>

        <!-- Terminologi Bit (Slide 29) -->
        <div class="card">
          <div class="card-title">
            <span>📐</span> 2. Notasi, Istilah & Pengelompokan Bit (Slide 29)
          </div>
          <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem;">
            Setiap digit biner disebut <strong>bit (binary digit)</strong>. Komputer mengorganisasi bit ke dalam beberapa tingkatan ukuran standar:
          </p>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem;">
            
            <div style="background: var(--bg-subtle); padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <div style="font-size: 0.75rem; color: var(--accent-cyan); font-weight: bold;">MSB vs LSB</div>
              <div style="font-weight: 700; color: #fff; margin-top: 0.25rem;">Most / Least Significant Bit</div>
              <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.5rem;">
                <strong>MSB</strong> adalah bit paling kiri dengan bobot posisi terbesar (2ⁿ⁻¹). <strong>LSB</strong> adalah bit paling kanan dengan bobot terkecil (2⁰).
              </p>
            </div>

            <div style="background: var(--bg-subtle); padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <div style="font-size: 0.75rem; color: var(--group-hex); font-weight: bold;">Nibble (4 Bit)</div>
              <div style="font-weight: 700; color: #fff; margin-top: 0.25rem;">Kapasitas 1 Digit Hex</div>
              <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.5rem;">
                Kombinasi 4 bit merepresentasikan rentang 0000₂ s.d. 1111₂ (0 s.d. 15), tepat setara dengan satu digit heksadesimal (0-F).
              </p>
            </div>

            <div style="background: var(--bg-subtle); padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <div style="font-size: 0.75rem; color: var(--accent-emerald); font-weight: bold;">Byte (8 Bit)</div>
              <div style="font-weight: 700; color: #fff; margin-top: 0.25rem;">Satuan Dasar Memori</div>
              <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.5rem;">
                Kumpulan 8 bit (2 nibble) mampu menyimpan 256 kombinasi (0 s.d. 255 pada unsigned, atau -128 s.d. +127 pada signed C2).
              </p>
            </div>

            <div style="background: var(--bg-subtle); padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <div style="font-size: 0.75rem; color: var(--accent-amber); font-weight: bold;">Word (16 / 32 / 64 Bit)</div>
              <div style="font-weight: 700; color: #fff; margin-top: 0.25rem;">Arsitektur Prosesor</div>
              <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.5rem;">
                Lebar data alami yang diproses oleh register arsitektur komputer (misal 16-bit word, 32-bit dword, 64-bit qword).
              </p>
            </div>

          </div>
        </div>

        <!-- Penanganan Pecahan dalam Sistem Digital (Slide 34-36) -->
        <div class="card">
          <div class="card-title">
            <span>🔢</span> 3. Bilangan Pecahan dalam Sistem Digital (Slide 34 - 36)
          </div>
          <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem;">
            Bilangan pecahan memiliki bobot pangkat negatif berturut-turut dari titik radix (titik koma):
          </p>

          <div style="background: #070a12; padding: 1rem; border-radius: var(--radius-md); font-family: var(--font-mono); font-size: 0.9rem; line-height: 1.8; margin-bottom: 1rem;">
            <div>Titik Radix: &bull; &rarr; ke kiri: 2⁰ (1), 2¹ (2), 2² (4), 2³ (8)...</div>
            <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&rarr; ke kanan: 2⁻¹ (0.5), 2⁻² (0.25), 2⁻³ (0.125), 2⁻⁴ (0.0625)...</div>
          </div>

          <div style="background: var(--bg-subtle); padding: 1rem; border-radius: var(--radius-md);">
            <div style="font-weight: bold; color: var(--accent-cyan); margin-bottom: 0.5rem;">Contoh Slide ITERA: Konversi 0.625₁₀ ke Biner, Heksa & Oktal</div>
            <ol style="margin-left: 1.5rem; font-size: 0.85rem; color: var(--text-muted); line-height: 1.8;">
              <li><strong>Desimal ke Biner</strong>: 0.625 × 2 = 1.25 (ambil 1) &rarr; 0.25 × 2 = 0.5 (ambil 0) &rarr; 0.5 × 2 = 1.0 (ambil 1). Biner = <strong>0.101₂</strong></li>
              <li><strong>Biner ke Heksadesimal</strong>: Kelompokkan pecahan per 4 bit dari kiri ke kanan. 0.101₂ ditambah 0 di kanan menjadi 0.1010₂ = <strong>0.A₁₆</strong></li>
              <li><strong>Biner ke Oktal</strong>: Kelompokkan pecahan per 3 bit dari kiri ke kanan. 0.101₂ sudah pas 3 bit = <strong>0.5₈</strong></li>
            </ol>
          </div>
        </div>

      </div>
    `;
  }

  function setBase(base) {
    currentBase = base;
    const label = document.getElementById('input-label');
    const input = document.getElementById('hub-input-val');
    const baseNames = {
      dec: 'Desimal (Basis 10)',
      bin: 'Biner (Basis 2)',
      oct: 'Oktal (Basis 8)',
      hex: 'Heksadesimal (Basis 16)'
    };
    if (label) label.innerText = `2. Masukkan Angka (${baseNames[base]})`;

    // update active button state
    document.querySelectorAll('.base-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    // Berikan default contoh sesuai basis jika saat ini kosong/tidak valid
    if (base === 'bin' && !input.value.match(/^[01.]+$/)) input.value = '100000010';
    if (base === 'oct' && !input.value.match(/^[0-7.]+$/)) input.value = '402';
    if (base === 'hex' && !input.value.match(/^[0-9A-Fa-f.]+$/)) input.value = '102';
    if (base === 'dec' && !input.value.match(/^[0-9.]+$/)) input.value = '258';

    runHubConversion();
  }

  function loadPreset(val, base) {
    currentBase = base;
    const input = document.getElementById('hub-input-val');
    if (input) input.value = val;

    // update base button ui
    const baseBtns = document.querySelectorAll('.base-btn');
    const baseOrder = ['dec', 'bin', 'oct', 'hex'];
    const idx = baseOrder.indexOf(base);
    if (idx !== -1 && baseBtns[idx]) {
      baseBtns.forEach(b => b.classList.remove('active'));
      baseBtns[idx].classList.add('active');
    }

    const label = document.getElementById('input-label');
    const baseNames = { dec: 'Desimal', bin: 'Biner', oct: 'Oktal', hex: 'Heksadesimal' };
    if (label) label.innerText = `2. Masukkan Angka (${baseNames[base]})`;

    runHubConversion();
  }

  function runHubConversion() {
    const inputEl = document.getElementById('hub-input-val');
    const errEl = document.getElementById('converter-error');
    const resEl = document.getElementById('hub-results-area');
    if (!inputEl || !resEl) return;

    const val = inputEl.value;
    const conversion = BinaryHub.processFullConversion(val, currentBase);

    if (!conversion.success) {
      if (errEl) {
        errEl.style.display = 'block';
        errEl.innerText = conversion.error;
      }
      return;
    }

    if (errEl) errEl.style.display = 'none';

    const c = conversion.central;
    const h = conversion.toHex;
    const o = conversion.toOct;
    const d = conversion.toDec;

    // Render Langkah demi Langkah dan Hasil Biner Sentral
    let html = `
      <!-- TAHAP 1: KONVERSI DARI ASAL MENUJU BINER SENTRAL -->
      <div class="card" style="margin-bottom: 0; background: var(--bg-subtle);">
        <div style="font-size: 0.8rem; font-weight: 700; color: var(--accent-cyan); text-transform: uppercase;">
          Tahap 1: Konversi Masukan Menuju Poros Biner Sentral
        </div>
        <div style="font-size: 1.05rem; font-weight: 700; color: #fff; margin: 0.25rem 0 0.75rem 0;">
          ${c.steps[0]?.title || 'Konversi ke Biner'}
        </div>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem;">
          ${c.steps[0]?.desc || c.steps[0]?.detail || ''}
        </p>
    `;

    // Jika input desimal: tampilkan tabel pembagian bulat atau perkalian pecahan
    c.steps.forEach(step => {
      if (step.divisionTable) {
        html += `
          <div style="margin-bottom: 1rem;">
            <div style="font-size: 0.8rem; color: #fff; font-weight: 600; margin-bottom: 0.4rem;">Tabel Pembagian Berulang 2 (Bagian Bulat):</div>
            <table class="weights-table" style="max-width: 500px;">
              <thead>
                <tr>
                  <th>Operasi</th>
                  <th>Hasil Bagi (Quotient)</th>
                  <th>Sisa (Remainder)</th>
                  <th>Arah Baca</th>
                </tr>
              </thead>
              <tbody>
                ${step.divisionTable.map((row, idx) => `
                  <tr>
                    <td>${row.n} ÷ 2</td>
                    <td><strong>${row.q}</strong></td>
                    <td style="color: var(--accent-cyan); font-weight: bold;">${row.r}</td>
                    <td style="font-size: 0.75rem; color: var(--text-dim);">${idx === step.divisionTable.length - 1 ? '↑ MSB (Paling Atas)' : (idx === 0 ? 'LSB (Paling Awal)' : '↑')}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            <div style="font-size: 0.8rem; color: var(--accent-cyan); margin-top: 0.5rem;">
              Hasil Biner Bulat: <strong>${step.resultInt}₂</strong>
            </div>
          </div>
        `;
      }

      if (step.multTable) {
        html += `
          <div style="margin-bottom: 1rem;">
            <div style="font-size: 0.8rem; color: #fff; font-weight: 600; margin-bottom: 0.4rem;">Tabel Perkalian Berulang 2 (Bagian Pecahan):</div>
            <table class="weights-table" style="max-width: 520px;">
              <thead>
                <tr>
                  <th>Operasi</th>
                  <th>Hasil Kali</th>
                  <th>Bit Diambil (Bulat)</th>
                  <th>Arah Baca</th>
                </tr>
              </thead>
              <tbody>
                ${step.multTable.map((row, idx) => `
                  <tr>
                    <td>0.${row.input.split('.')[1] || row.input} × 2</td>
                    <td>${row.multiplied}</td>
                    <td style="color: var(--accent-emerald); font-weight: bold;">${row.bit}</td>
                    <td style="font-size: 0.75rem; color: var(--text-dim);">${idx === 0 ? '↓ Awal (2⁻¹)' : '↓'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            <div style="font-size: 0.8rem; color: var(--accent-emerald); margin-top: 0.5rem;">
              Hasil Biner Pecahan: <strong>0.${step.resultFrac}₂</strong>
            </div>
          </div>
        `;
      }

      if (step.intExpansions) {
        html += `
          <div style="margin-bottom: 1rem;">
            <div style="font-size: 0.8rem; color: #fff; font-weight: 600; margin-bottom: 0.4rem;">Pemetaan Ekspansi Digit ke Bit:</div>
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
              ${step.intExpansions.map(e => `
                <div style="background: rgba(0,0,0,0.3); border: 1px solid var(--border-color); padding: 0.4rem 0.6rem; border-radius: 6px; text-align: center;">
                  <div style="font-size: 1.1rem; font-weight: 800; color: var(--accent-cyan);">${e.digit}</div>
                  <div style="font-size: 0.65rem; color: var(--text-dim);">&darr;</div>
                  <div style="font-family: var(--font-mono); font-weight: bold; color: #fff;">${e.bits}</div>
                </div>
              `).join('')}
              ${step.fracExpansions && step.fracExpansions.length > 0 ? `
                <div style="display: flex; align-items: center; font-size: 1.5rem; font-weight: bold; color: var(--accent-amber); padding: 0 0.2rem;">.</div>
                ${step.fracExpansions.map(e => `
                  <div style="background: rgba(0,0,0,0.3); border: 1px solid var(--border-color); padding: 0.4rem 0.6rem; border-radius: 6px; text-align: center;">
                    <div style="font-size: 1.1rem; font-weight: 800; color: var(--accent-emerald);">${e.digit}</div>
                    <div style="font-size: 0.65rem; color: var(--text-dim);">&darr;</div>
                    <div style="font-family: var(--font-mono); font-weight: bold; color: #fff;">${e.bits}</div>
                  </div>
                `).join('')}
              ` : ''}
            </div>
          </div>
        `;
      }
    });

    html += `</div>`; // end tahap 1 card

    // TAHAP 2: DISPLAY BINER SENTRAL (STRIP OF BITS)
    html += `
      <div class="central-binary-card">
        <span class="central-badge">Poros Sentral: Biner (Basis 2)</span>
        <div style="text-align: center; margin-top: 0.25rem;">
          <span style="font-size: 0.8rem; color: var(--text-muted);">
            Seluruh konversi berikutnya bersumber dari susunan bit di bawah ini:
          </span>
        </div>

        <div class="bit-stream-wrapper">
    `;

    // Render bit boxes for integer part
    const intBits = c.binInt.split('');
    const intLen = intBits.length;
    intBits.forEach((b, i) => {
      const p = intLen - 1 - i;
      html += `
        <div class="bit-box ${b === '1' ? 'one' : 'zero'}">
          <span class="bit-val">${b}</span>
          <span class="bit-pos">2^${p}</span>
        </div>
      `;
    });

    // If fractional part exists
    if (c.binFrac && c.binFrac.length > 0) {
      html += `<div class="bit-box radix">.</div>`;
      const fracBits = c.binFrac.split('');
      fracBits.forEach((b, i) => {
        const p = -(i + 1);
        html += `
          <div class="bit-box ${b === '1' ? 'one' : 'zero'}">
            <span class="bit-val">${b}</span>
            <span class="bit-pos">2^(${p})</span>
          </div>
        `;
      });
    }

    html += `
        </div>
        <div style="text-align: center; font-family: var(--font-mono); font-size: 1.25rem; font-weight: 800; color: var(--accent-cyan); letter-spacing: 0.05em;">
          ${c.fullBinary}₂
        </div>
      </div>
    `;

    // TAHAP 3: CABANG PENGELOMPOKAN KE HEKSADESIMAL & OKTAL
    html += `
      <div class="grouping-tabs">
        
        <!-- CABANG A: HEKSADESIMAL (GRUP 4 BIT / NIBBLE) -->
        <div class="group-card hex">
          <div class="group-header">
            <div class="group-title hex">
              <span>🟪</span> Konversi ke Heksadesimal
            </div>
            <span class="group-pill hex">Kelompok 4 Bit (2⁴ = 16)</span>
          </div>
          <p style="font-size: 0.8rem; color: var(--text-muted);">
            Kelompokkan bit per <strong>4 digit</strong> dari titik koma ke kiri (bulat) dan ke kanan (pecahan). Jika kurang dari 4, tambahkan bit 0 (zero padding).
          </p>

          <div class="group-clusters">
            <!-- Kelompok Bulat Hex -->
            ${h.intGroups.map(g => `
              <div class="cluster-block hex">
                ${g.padAdded > 0 ? `<span class="cluster-pad-tag">+${g.padAdded} nol</span>` : ''}
                <div class="cluster-bits">
                  ${g.padAdded > 0 ? `<span style="color: var(--accent-amber);">${'0'.repeat(g.padAdded)}</span>` : ''}${g.originalBits}
                </div>
                <div class="cluster-down-arrow">&darr;</div>
                <div class="cluster-result-digit">${g.hexDigit}</div>
                <div style="font-size: 0.65rem; color: var(--text-dim);">= ${g.decVal}</div>
              </div>
            `).join('')}

            ${h.fracGroups.length > 0 ? `
              <div style="font-size: 1.8rem; font-weight: bold; color: var(--accent-amber); padding: 0 0.25rem;">.</div>
              ${h.fracGroups.map(g => `
                <div class="cluster-block hex">
                  ${g.padAdded > 0 ? `<span class="cluster-pad-tag">+${g.padAdded} nol</span>` : ''}
                  <div class="cluster-bits">
                    ${g.originalBits}${g.padAdded > 0 ? `<span style="color: var(--accent-amber);">${'0'.repeat(g.padAdded)}</span>` : ''}
                  </div>
                  <div class="cluster-down-arrow">&darr;</div>
                  <div class="cluster-result-digit">${g.hexDigit}</div>
                  <div style="font-size: 0.65rem; color: var(--text-dim);">= ${g.decVal}</div>
                </div>
              `).join('')}
            ` : ''}
          </div>

          <div class="final-output-box">
            <span class="final-label">Hasil Heksadesimal:</span>
            <span class="final-value" style="color: var(--group-hex);">0x${h.fullHex}₁₆</span>
          </div>
        </div>

        <!-- CABANG B: OKTAL (GRUP 3 BIT) -->
        <div class="group-card oct">
          <div class="group-header">
            <div class="group-title oct">
              <span>🟦</span> Konversi ke Oktal
            </div>
            <span class="group-pill oct">Kelompok 3 Bit (2³ = 8)</span>
          </div>
          <p style="font-size: 0.8rem; color: var(--text-muted);">
            Kelompokkan bit per <strong>3 digit</strong> dari titik koma ke kiri (bulat) dan ke kanan (pecahan). Jika kurang dari 3, tambahkan bit 0.
          </p>

          <div class="group-clusters">
            <!-- Kelompok Bulat Oct -->
            ${o.intGroups.map(g => `
              <div class="cluster-block oct">
                ${g.padAdded > 0 ? `<span class="cluster-pad-tag">+${g.padAdded} nol</span>` : ''}
                <div class="cluster-bits">
                  ${g.padAdded > 0 ? `<span style="color: var(--accent-amber);">${'0'.repeat(g.padAdded)}</span>` : ''}${g.originalBits}
                </div>
                <div class="cluster-down-arrow">&darr;</div>
                <div class="cluster-result-digit">${g.octDigit}</div>
                <div style="font-size: 0.65rem; color: var(--text-dim);">= ${g.decVal}</div>
              </div>
            `).join('')}

            ${o.fracGroups.length > 0 ? `
              <div style="font-size: 1.8rem; font-weight: bold; color: var(--accent-amber); padding: 0 0.25rem;">.</div>
              ${o.fracGroups.map(g => `
                <div class="cluster-block oct">
                  ${g.padAdded > 0 ? `<span class="cluster-pad-tag">+${g.padAdded} nol</span>` : ''}
                  <div class="cluster-bits">
                    ${g.originalBits}${g.padAdded > 0 ? `<span style="color: var(--accent-amber);">${'0'.repeat(g.padAdded)}</span>` : ''}
                  </div>
                  <div class="cluster-down-arrow">&darr;</div>
                  <div class="cluster-result-digit">${g.octDigit}</div>
                  <div style="font-size: 0.65rem; color: var(--text-dim);">= ${g.decVal}</div>
                </div>
              `).join('')}
            ` : ''}
          </div>

          <div class="final-output-box">
            <span class="final-label">Hasil Oktal:</span>
            <span class="final-value" style="color: var(--group-oct);">${o.fullOct}₈</span>
          </div>
        </div>

      </div>
    `;

    // TAHAP 4: CABANG KE DESIMAL (PENJUMLAHAN BOBOT POSISI)
    html += `
      <div class="card" style="border-color: var(--group-dec-border); background: var(--bg-subtle);">
        <div class="card-header">
          <div>
            <div class="card-title" style="color: var(--group-dec);">
              <span>🧮</span> Konversi ke Desimal: Penjumlahan Bobot Posisi (Σ bi × 2ⁿ)
            </div>
            <div class="card-subtitle">
              Setiap bit dikalikan dengan faktor 2 berpangkat posisi dan dijumlahkan seluruhnya.
            </div>
          </div>
          <span class="group-pill" style="background: var(--group-dec-bg); color: var(--group-dec);">Basis 10</span>
        </div>

        <div style="overflow-x: auto;">
          <table class="weights-table">
            <thead>
              <tr>
                <th>Digit Biner (bi)</th>
                <th>Posisi Pangkat (n)</th>
                <th>Bobot Posisi (2ⁿ)</th>
                <th>Kontribusi Nilai (bi × 2ⁿ)</th>
              </tr>
            </thead>
            <tbody>
              ${d.intWeights.map(w => `
                <tr class="${w.bit === 1 ? 'active-row' : ''}">
                  <td style="font-weight: bold; font-family: var(--font-mono); font-size: 1.1rem;">${w.bit}</td>
                  <td>2^${w.power}</td>
                  <td>${w.weight}</td>
                  <td style="font-family: var(--font-mono);">${w.contribution}</td>
                </tr>
              `).join('')}
              ${d.fracWeights.map(w => `
                <tr class="${w.bit === 1 ? 'active-row' : ''}">
                  <td style="font-weight: bold; font-family: var(--font-mono); font-size: 1.1rem; color: var(--accent-emerald);">${w.bit}</td>
                  <td>2^(${w.power})</td>
                  <td>${w.weight}</td>
                  <td style="font-family: var(--font-mono);">${w.contribution}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div class="decimal-summation-box">
          <div style="color: var(--text-muted); font-size: 0.8rem; margin-bottom: 0.35rem;">Persamaan Akumulasi Penjumlahan:</div>
          <div style="color: #fff; font-size: 1rem; word-break: break-all;">
            ${[...d.activeIntBits, ...d.activeFracBits].map(w => `${w.weight}`).join(' + ') || '0'} = <strong style="color: var(--accent-amber); font-size: 1.3rem;">${d.totalDec}₁₀</strong>
          </div>
        </div>

        <div class="final-output-box" style="margin-top: 1rem;">
          <span class="final-label">Hasil Desimal Akhir:</span>
          <span class="final-value" style="color: var(--group-dec);">${d.totalDec}₁₀</span>
        </div>
      </div>
    `;

    resEl.innerHTML = html;
  }

  function renderWeek2Theory() {
    const el = document.getElementById('week2-content-area');
    if (!el) return;
    el.innerHTML = `
      <div class="card">
        <div class="card-title"><span>📖</span> Rangkuman Teori Slide Pertemuan 2 (ITERA)</div>
        <div style="margin-top: 1rem; display: flex; flex-direction: column; gap: 1rem; font-size: 0.88rem; color: var(--text-muted);">
          <div>
            <strong style="color: #fff;">1. Mengapa 2's Complement Dipilih Komputer?</strong><br>
            Sistem Sign-Magnitude dan 1's Complement memiliki kelemahan fatal: adanya representasi ganda untuk nol (+0 dan -0). Pada 2's Complement, angka 0 hanya satu (00000000). Selain itu, operasi pengurangan <code>A - B</code> langsung diproses menggunakan rangkaian penjumlah (adder) tanpa komponen pengurangan tambahan.
          </div>
          <div>
            <strong style="color: #fff;">2. Sign Extension (Slide 20)</strong><br>
            Ketika mengubah tipe data dari ukuran kecil ke besar (misal 8-bit ke 16-bit), bit MSB (bit tanda) disalin ke seluruh bit baru di sebelah kiri.<br>
            Contoh: <code>-37</code> (8-bit) = <code>1101 1011₂</code> &rarr; jika diperlebar ke 16-bit menjadi <code>1111 1111 1101 1011₂</code>.
          </div>
          <div>
            <strong style="color: #fff;">3. Deteksi Overflow (Slide 19)</strong><br>
            Overflow terjadi saat hasil penjumlahan melebihi kapasitas representasi bit (misal dua bilangan positif menghasilkan tanda negatif, atau dua bilangan negatif menghasilkan tanda positif). Secara hardware dideteksi dengan rumus logika: <code>Carry ke MSB ⊕ Carry keluar MSB = 1</code>.
          </div>
        </div>
      </div>
    `;
  }

  function getUpcomingWeekContent(weekData) {
    return `
      <div class="card" style="border-style: dashed; border-color: var(--border-color);">
        <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem;">
          <div style="width: 54px; height: 54px; border-radius: var(--radius-md); background: rgba(59, 130, 246, 0.15); display: flex; align-items: center; justify-content: center; font-size: 1.75rem;">
            📅
          </div>
          <div>
            <div style="font-size: 1.2rem; font-weight: 700; color: #fff;">Modul Perkuliahan Minggu ke-${weekData.id}</div>
            <div style="font-size: 0.85rem; color: var(--accent-cyan);">${weekData.cpmk}</div>
          </div>
        </div>

        <div style="background: var(--bg-subtle); padding: 1.25rem; border-radius: var(--radius-md); margin-bottom: 1.5rem;">
          <h4 style="font-size: 0.95rem; color: #fff; font-weight: 700; margin-bottom: 0.5rem;">Silabus & Rencana Pembelajaran:</h4>
          <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.6;">
            Modul untuk topik <strong>"${weekData.title}"</strong> telah disiapkan dalam arsitektur pembelajaran sistem digital ini. Struktur komponen interaktif, simulator logika, dan evaluasi kuis dapat ditambahkan dengan format modular yang sama seperti pada modul Minggu 1 & 2.
          </p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1rem;">
          
          <div style="background: var(--bg-card); padding: 1rem; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
            <div style="font-size: 0.75rem; color: var(--accent-purple); font-weight: bold;">REFERENSI BUKU TEKS UTAMA</div>
            <ul style="margin-top: 0.5rem; margin-left: 1.25rem; font-size: 0.8rem; color: var(--text-muted); line-height: 1.6;">
              <li>Frank Vahid & Tony Givargis – Embedded System Design (Wiley)</li>
              <li>Raj Kamal – Embedded Systems (McGraw-Hill)</li>
              <li>Peter Barry & Patrick Crowley – Modern Embedded Computing</li>
            </ul>
          </div>

          <div style="background: var(--bg-card); padding: 1rem; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
            <div style="font-size: 0.75rem; color: var(--accent-emerald); font-weight: bold;">INDIKATOR KELULUSAN MAHASISWA</div>
            <p style="margin-top: 0.5rem; font-size: 0.8rem; color: var(--text-muted); line-height: 1.6;">
              Mahasiswa mampu memahami konsep teori, menganalisis tabel kebenaran / diagram status, merancang simulasi sirkuit, dan menyelesaikan latihan soal mandiri.
            </p>
          </div>

        </div>

        <div style="margin-top: 1.5rem; text-align: center;">
          <button class="preset-pill" style="background: rgba(6, 182, 212, 0.2); color: var(--accent-cyan); border-color: var(--accent-cyan); padding: 0.5rem 1.5rem;" onclick="App.switchWeek(1)">
            &larr; Kembali ke Media Ajar Interaktif Minggu 1
          </button>
        </div>

      </div>
    `;
  }

  return {
    init,
    switchWeek,
    switchSubmenu,
    setBase,
    loadPreset,
    runHubConversion
  };
})();

if (typeof window !== 'undefined') {
  window.App = App;
}
