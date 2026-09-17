/**
 * Quiz & Structured Exercises Module
 * Sistem Digital - Media Ajar Interaktif HTML5
 */

const DigitalQuiz = (() => {
  const structuredQuestions = [
    {
      id: 'q1',
      badge: 'Latihan Terstruktur Slide ITERA 1',
      title: 'Soal 1: Konversi 258₁₀ ke Heksadesimal dan Oktal via Biner Sentral',
      description: 'Gunakan metode Biner Sentral: Konversi 258₁₀ ke Biner terlebih dahulu, lalu kelompokkan 4-bit untuk Hex dan 3-bit untuk Oktal.',
      inputVal: '258',
      inputBase: 'dec',
      expectedBin: '100000010',
      expectedHex: '102',
      expectedOct: '402',
      hint: '258 dibagi 2 berulang kali menghasilkan biner 100000010₂ (9 bit). Kelompokkan 4-bit dari kanan untuk Hex (tambah padding 0 di kiri), dan kelompokkan 3-bit dari kanan untuk Oct.'
    },
    {
      id: 'q2',
      badge: 'Latihan Terstruktur Slide ITERA 2 (Pecahan)',
      title: 'Soal 2: Konversi Desimal Pecahan 0.625₁₀ ke Biner, Heksa, dan Oktal',
      description: 'Lakukan perkalian berulang 2 pada pecahan 0.625, lalu kelompokkan biner pecahan untuk mendapatkan Heksa (4 bit) dan Oktal (3 bit).',
      inputVal: '0.625',
      inputBase: 'dec',
      expectedBin: '0.101',
      expectedHex: '0.A',
      expectedOct: '0.5',
      hint: '0.625 × 2 = 1.25 (bit 1) -> 0.25 × 2 = 0.5 (bit 0) -> 0.5 × 2 = 1.0 (bit 1). Biner = 0.101₂. Untuk Heksa kelompokkan 4-bit: 0.1010₂ = 0.A₁₆. Untuk Oktal: 0.101₂ = 0.5₈.'
    },
    {
      id: 'q3',
      badge: 'Latihan Terstruktur Slide ITERA 3',
      title: 'Soal 3: Konversi Heksadesimal 2F₁₆ ke Biner, Oktal, dan Desimal',
      description: 'Pecah digit 2 dan F menjadi masing-masing 4 bit biner, lalu konversi biner ke oktal (kelompok 3 bit) dan desimal (jumlah bobot).',
      inputVal: '2F',
      inputBase: 'hex',
      expectedBin: '101111',
      expectedOct: '57',
      expectedDec: '47',
      hint: 'Digit 2 = 0010₂, Digit F = 1111₂ -> Biner = 00101111₂ = 101111₂. Dikelompokkan 3-bit: (101)(111) = 57₈. Jumlah bobot: 32 + 8 + 4 + 2 + 1 = 47₁₀.'
    }
  ];

  let currentRandomQuestion = null;

  function init(containerId = 'quiz-module-container') {
    render(containerId);
  }

  function render(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;

    let html = `
      <div style="margin-bottom: 2rem;">
        <h3 style="font-size: 1.25rem; font-weight: 700; color: #fff; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;">
          <span>🎯</span> Latihan Terstruktur & Kuis Pemahaman
        </h3>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1.5rem;">
          Uji pemahaman Anda mengenai konversi dengan metode <strong>Biner sebagai Sentral</strong>. Jawaban dievaluasi langkah demi langkah.
        </p>

        <!-- Structured Questions from Slide -->
        <div style="display: flex; flex-direction: column; gap: 1.25rem;">
    `;

    structuredQuestions.forEach((q, idx) => {
      html += `
        <div class="quiz-card" id="card-${q.id}">
          <span class="quiz-badge itera">${q.badge}</span>
          <div class="quiz-prompt">${q.title}</div>
          <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem;">${q.description}</p>

          <div class="quiz-steps-area">
            <div class="quiz-step-input">
              <div class="quiz-step-label">1. Biner Sentral (Basis 2):</div>
              <input type="text" id="ans-bin-${q.id}" class="quiz-input-field" placeholder="contoh: ${q.expectedBin.includes('.') ? '0.xxx' : '1000...'}">
            </div>

            ${q.expectedHex ? `
            <div class="quiz-step-input">
              <div class="quiz-step-label">2. Heksadesimal (Basis 16):</div>
              <input type="text" id="ans-hex-${q.id}" class="quiz-input-field" placeholder="contoh: 102 atau 0.A">
            </div>` : ''}

            ${q.expectedOct ? `
            <div class="quiz-step-input">
              <div class="quiz-step-label">3. Oktal (Basis 8):</div>
              <input type="text" id="ans-oct-${q.id}" class="quiz-input-field" placeholder="contoh: 402 atau 0.5">
            </div>` : ''}

            ${q.expectedDec ? `
            <div class="quiz-step-input">
              <div class="quiz-step-label">4. Desimal (Basis 10):</div>
              <input type="text" id="ans-dec-${q.id}" class="quiz-input-field" placeholder="contoh: 47">
            </div>` : ''}
          </div>

          <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;">
            <button class="preset-pill" style="background: var(--accent-cyan); color: #000; font-weight: 700; padding: 0.4rem 1rem;" onclick="DigitalQuiz.checkStructured('${q.id}')">
              Periksa Jawaban
            </button>
            <button class="preset-pill" onclick="DigitalQuiz.showHint('${q.id}')">
              Lihat Petunjuk / Langkah
            </button>
          </div>

          <div class="quiz-feedback" id="feedback-${q.id}"></div>
        </div>
      `;
    });

    html += `
        </div>

        <!-- Mode Generator Soal Acak -->
        <div class="card" style="margin-top: 2rem; border-color: rgba(168, 85, 247, 0.4); background: rgba(168, 85, 247, 0.05);">
          <div class="card-header">
            <div>
              <div class="card-title" style="color: var(--accent-purple);">
                <span>⚡</span> Generator Soal Latihan Mandiri (Mode Tantangan)
              </div>
              <div class="card-subtitle">Hasilkan soal acak tak terbatas untuk mengasah kecepatan dan ketelitian Anda.</div>
            </div>
            <button class="btn-convert" style="width: auto; padding: 0.5rem 1.25rem; font-size: 0.85rem; background: linear-gradient(135deg, var(--accent-purple), var(--accent-blue));" onclick="DigitalQuiz.generateRandom()">
              Buat Soal Baru
            </button>
          </div>

          <div id="random-quiz-body" style="padding: 1rem 0;">
            <div style="color: var(--text-muted); font-size: 0.9rem; text-align: center; padding: 1rem;">
              Klik tombol <strong>"Buat Soal Baru"</strong> di atas untuk memulai latihan mandiri.
            </div>
          </div>
        </div>

      </div>
    `;

    el.innerHTML = html;
  }

  function checkStructured(id) {
    const q = structuredQuestions.find(item => item.id === id);
    if (!q) return;

    const binInput = (document.getElementById(`ans-bin-${id}`)?.value || '').trim().toUpperCase();
    const hexInput = (document.getElementById(`ans-hex-${id}`)?.value || '').trim().toUpperCase().replace(/^0X/, '');
    const octInput = (document.getElementById(`ans-oct-${id}`)?.value || '').trim().toUpperCase();
    const decInput = (document.getElementById(`ans-dec-${id}`)?.value || '').trim().toUpperCase();
    const feedbackEl = document.getElementById(`feedback-${id}`);

    const errors = [];

    // Normalisasi perbandingan biner (abaikan leading zero jika bulat)
    const normBinInput = binInput.includes('.') ? binInput : binInput.replace(/^0+/, '') || '0';
    const normExpectedBin = q.expectedBin.includes('.') ? q.expectedBin : q.expectedBin.replace(/^0+/, '') || '0';

    if (normBinInput !== normExpectedBin) {
      errors.push(`Biner Sentral belum tepat (Anda: ${binInput || 'kosong'}, Kunci: ${q.expectedBin})`);
    }

    if (q.expectedHex) {
      const normHexInput = hexInput.replace(/^0+/, '') || '0';
      const normExpectedHex = q.expectedHex.replace(/^0+/, '') || '0';
      if (normHexInput !== normExpectedHex) {
        errors.push(`Heksadesimal belum tepat (Anda: ${hexInput || 'kosong'}, Kunci: ${q.expectedHex})`);
      }
    }

    if (q.expectedOct) {
      const normOctInput = octInput.replace(/^0+/, '') || '0';
      const normExpectedOct = q.expectedOct.replace(/^0+/, '') || '0';
      if (normOctInput !== normExpectedOct) {
        errors.push(`Oktal belum tepat (Anda: ${octInput || 'kosong'}, Kunci: ${q.expectedOct})`);
      }
    }

    if (q.expectedDec) {
      if (decInput !== q.expectedDec) {
        errors.push(`Desimal belum tepat (Anda: ${decInput || 'kosong'}, Kunci: ${q.expectedDec})`);
      }
    }

    if (errors.length === 0) {
      feedbackEl.className = 'quiz-feedback success';
      feedbackEl.innerHTML = `<strong>Luar Biasa! Jawaban Anda Benar Semua! 🎉</strong><br>Metode biner sentral Anda telah diterapkan dengan sangat tepat.`;
    } else {
      feedbackEl.className = 'quiz-feedback error';
      feedbackEl.innerHTML = `<strong>Perlu perbaikan:</strong><br><ul>${errors.map(e => `<li>${e}</li>`).join('')}</ul>`;
    }
  }

  function showHint(id) {
    const q = structuredQuestions.find(item => item.id === id);
    if (!q) return;
    const feedbackEl = document.getElementById(`feedback-${id}`);
    feedbackEl.className = 'quiz-feedback';
    feedbackEl.style.display = 'block';
    feedbackEl.style.background = 'rgba(6, 182, 212, 0.12)';
    feedbackEl.style.border = '1px solid var(--accent-cyan)';
    feedbackEl.style.color = '#38bdf8';
    feedbackEl.innerHTML = `<strong>💡 Petunjuk & Langkah Pengerjaan:</strong><br>${q.hint}`;
  }

  function generateRandom() {
    const bases = ['dec', 'oct', 'hex', 'bin'];
    const randomBase = bases[Math.floor(Math.random() * bases.length)];
    const randomVal = Math.floor(Math.random() * 240) + 15; // 15..255

    let inputStr = '';
    if (randomBase === 'dec') inputStr = randomVal.toString(10);
    else if (randomBase === 'oct') inputStr = randomVal.toString(8);
    else if (randomBase === 'hex') inputStr = randomVal.toString(16).toUpperCase();
    else if (randomBase === 'bin') inputStr = randomVal.toString(2);

    const full = BinaryHub.processFullConversion(inputStr, randomBase);
    currentRandomQuestion = {
      base: randomBase,
      val: inputStr,
      full
    };

    const targetBaseName = {
      dec: 'Desimal',
      oct: 'Oktal',
      hex: 'Heksadesimal',
      bin: 'Biner'
    }[randomBase];

    const bodyEl = document.getElementById('random-quiz-body');
    bodyEl.innerHTML = `
      <div style="background: var(--bg-card); padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
        <div style="font-size: 1.1rem; font-weight: 700; color: #fff; margin-bottom: 0.5rem;">
          Konversikan nilai: <span style="color: var(--accent-cyan); font-family: var(--font-mono); font-size: 1.3rem;">${inputStr}</span><sub>(${targetBaseName})</sub>
        </div>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem;">
          Ingat: Jadikan <strong>Biner</strong> sebagai poros sentral terlebih dahulu!
        </p>

        <div class="quiz-steps-area">
          <div class="quiz-step-input">
            <div class="quiz-step-label">1. Biner Sentral:</div>
            <input type="text" id="rand-ans-bin" class="quiz-input-field" placeholder="Ketik representasi biner...">
          </div>
          <div class="quiz-step-input">
            <div class="quiz-step-label">2. Heksadesimal (Hex):</div>
            <input type="text" id="rand-ans-hex" class="quiz-input-field" placeholder="Ketik representasi heksadesimal...">
          </div>
          <div class="quiz-step-input">
            <div class="quiz-step-label">3. Oktal:</div>
            <input type="text" id="rand-ans-oct" class="quiz-input-field" placeholder="Ketik representasi oktal...">
          </div>
          <div class="quiz-step-input">
            <div class="quiz-step-label">4. Desimal:</div>
            <input type="text" id="rand-ans-dec" class="quiz-input-field" placeholder="Ketik representasi desimal...">
          </div>
        </div>

        <div style="display: flex; gap: 0.5rem; margin-top: 1rem;">
          <button class="preset-pill" style="background: var(--accent-purple); color: #fff; font-weight: 700; padding: 0.4rem 1.25rem;" onclick="DigitalQuiz.checkRandom()">
            Cek Solusi Acak
          </button>
          <button class="preset-pill" onclick="DigitalQuiz.showRandomSolution()">
            Buka Solusi Lengkap
          </button>
        </div>

        <div class="quiz-feedback" id="rand-feedback"></div>
      </div>
    `;
  }

  function checkRandom() {
    if (!currentRandomQuestion) return;
    const binIn = (document.getElementById('rand-ans-bin')?.value || '').trim().replace(/^0+/, '') || '0';
    const hexIn = (document.getElementById('rand-ans-hex')?.value || '').trim().toUpperCase().replace(/^0X/, '').replace(/^0+/, '') || '0';
    const octIn = (document.getElementById('rand-ans-oct')?.value || '').trim().replace(/^0+/, '') || '0';
    const decIn = (document.getElementById('rand-ans-dec')?.value || '').trim().replace(/^0+/, '') || '0';

    const f = currentRandomQuestion.full;
    const expBin = f.central.binInt.replace(/^0+/, '') || '0';
    const expHex = f.toHex.hexIntResult.replace(/^0+/, '') || '0';
    const expOct = f.toOct.octIntResult.replace(/^0+/, '') || '0';
    const expDec = f.toDec.totalInt.toString();

    const errors = [];
    if (binIn !== expBin) errors.push(`Biner belum sesuai (kunci: ${expBin})`);
    if (hexIn !== expHex) errors.push(`Heksadesimal belum sesuai (kunci: ${expHex})`);
    if (octIn !== expOct) errors.push(`Oktal belum sesuai (kunci: ${expOct})`);
    if (decIn !== expDec) errors.push(`Desimal belum sesuai (kunci: ${expDec})`);

    const fb = document.getElementById('rand-feedback');
    if (errors.length === 0) {
      fb.className = 'quiz-feedback success';
      fb.innerHTML = `<strong>Tepat Sekali! 🎉</strong> Semua basis berhasil Anda hitung dengan akurat melalui poros biner sentral.`;
    } else {
      fb.className = 'quiz-feedback error';
      fb.innerHTML = `<strong>Catatan Evaluasi:</strong><br><ul>${errors.map(e => `<li>${e}</li>`).join('')}</ul>`;
    }
  }

  function showRandomSolution() {
    if (!currentRandomQuestion) return;
    const f = currentRandomQuestion.full;
    const fb = document.getElementById('rand-feedback');
    fb.className = 'quiz-feedback';
    fb.style.display = 'block';
    fb.style.background = 'rgba(16, 185, 129, 0.1)';
    fb.style.border = '1px solid var(--accent-emerald)';
    fb.style.color = '#fff';
    fb.innerHTML = `
      <div style="font-weight: bold; margin-bottom: 0.5rem; color: var(--accent-emerald);">Kunci Jawaban & Alur Biner Sentral:</div>
      <div>1. Biner Sentral: <code style="color: var(--accent-cyan); font-weight: bold;">${f.central.fullBinary}₂</code></div>
      <div>2. Heksadesimal: <code style="color: var(--group-hex); font-weight: bold;">0x${f.toHex.fullHex}₁₆</code> (dikelompokkan 4-bit)</div>
      <div>3. Oktal: <code style="color: var(--group-oct); font-weight: bold;">${f.toOct.fullOct}₈</code> (dikelompokkan 3-bit)</div>
      <div>4. Desimal: <code style="color: var(--group-dec); font-weight: bold;">${f.toDec.totalDec}₁₀</code> (penjumlahan bobot 2ⁿ)</div>
    `;
  }

  return {
    init,
    checkStructured,
    showHint,
    generateRandom,
    checkRandom,
    showRandomSolution
  };
})();

if (typeof window !== 'undefined') {
  window.DigitalQuiz = DigitalQuiz;
}
