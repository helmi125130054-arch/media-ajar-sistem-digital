/**
 * Week 2 Module: Representasi Bilangan Negatif & Aritmatika Komplemen Dua (C2)
 * Berdasarkan Slide Pertemuan 2 Sistem Digital ITERA
 */

const Week2Module = (() => {
  function toFixedBin(num, bits = 8) {
    let s = (num >>> 0).toString(2);
    if (s.length > bits) {
      s = s.slice(s.length - bits);
    } else {
      s = '0'.repeat(bits - s.length) + s;
    }
    return s;
  }

  function invertBits(binStr) {
    return binStr.split('').map(c => (c === '0' ? '1' : '0')).join('');
  }

  function addBinaryOne(binStr) {
    let carry = 1;
    let res = [];
    for (let i = binStr.length - 1; i >= 0; i--) {
      let b = parseInt(binStr[i], 10);
      let sum = b + carry;
      if (sum === 2) {
        res.unshift('0');
        carry = 1;
      } else if (sum === 1) {
        res.unshift('1');
        carry = 0;
      } else {
        res.unshift('0');
        carry = 0;
      }
    }
    return res.join('');
  }

  function calculateRepresentations(val, bitWidth = 8) {
    const absVal = Math.abs(val);
    const maxVal = Math.pow(2, bitWidth - 1) - 1;
    const minVal = -Math.pow(2, bitWidth - 1);

    if (val < minVal || val > maxVal) {
      return { valid: false, error: `Nilai di luar jangkauan ${bitWidth}-bit signed [${minVal} .. +${maxVal}].` };
    }

    const posBin = toFixedBin(absVal, bitWidth);
    let sm = posBin;
    let c1 = posBin;
    let c2 = posBin;

    if (val < 0) {
      // Sign-Magnitude: bit MSB = 1, sisanya magnitude
      sm = '1' + posBin.slice(1);

      // 1's Complement: inversi semua bit
      c1 = invertBits(posBin);

      // 2's Complement: inversi semua bit + 1
      c2 = addBinaryOne(c1);
    }

    // Hex and Octal representation of the 8-bit C2 pattern
    const hexVal = parseInt(c2, 2).toString(16).toUpperCase().padStart(bitWidth / 4, '0');
    const octVal = parseInt(c2, 2).toString(8).padStart(Math.ceil(bitWidth / 3), '0');

    return {
      valid: true,
      val,
      bitWidth,
      posBin,
      sm,
      c1,
      c2,
      hexVal: '0x' + hexVal,
      octVal: octVal + '₈'
    };
  }

  function render(containerId = 'week2-content-area') {
    const el = document.getElementById(containerId);
    if (!el) return;

    el.innerHTML = `
      <div style="margin-bottom: 2rem;">
        
        <!-- Header Minggu 2 -->
        <div class="central-method-banner" style="border-color: rgba(168, 85, 247, 0.4); background: linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(59, 130, 246, 0.1));">
          <div style="flex: 1;">
            <div style="display: inline-flex; align-items: center; gap: 0.5rem; background: rgba(168, 85, 247, 0.2); padding: 0.2rem 0.6rem; border-radius: 9999px; font-size: 0.75rem; color: #c084fc; font-weight: bold; margin-bottom: 0.5rem;">
              Pertemuan 2: CPMK-2
            </div>
            <h2 style="font-size: 1.4rem; font-weight: 800; color: #fff;">Representasi Bilangan Negatif & Aritmatika Biner (C2)</h2>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.25rem;">
              Dosen Pengampu: Dr. Swadexi Istiqphara, S.T., M.T. | Efa Maydhona, S.T., M.T. | Nia Saputri Utami, S.T., M.T. (ITERA)
            </p>
          </div>
        </div>

        <!-- Tabel Perbandingan 3 Skema Populer (Slide 6 & 22) -->
        <div class="card">
          <div class="card-title" style="margin-bottom: 0.75rem;">
            <span>📊</span> Perbandingan 3 Skema Representasi Negatif (8-Bit)
          </div>
          <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem;">
            Berdasarkan slide kuliah, sistem komputer modern (CPU/MCU) secara universal menggunakan <strong>2's Complement (C2)</strong> karena proses pengurangan dapat diselesaikan hanya dengan sirkuit penjumlah (adder).
          </p>

          <table class="weights-table">
            <thead>
              <tr>
                <th>Skema</th>
                <th>Rentang Nilai (8-bit)</th>
                <th>Cara Mendapatkan -X dari +X</th>
                <th>Keunikan / Karakteristik</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="font-weight: bold; color: var(--accent-cyan);">Sign-Magnitude (SM)</td>
                <td>-127 .. +127</td>
                <td>Ubah bit MSB menjadi 1 (sisa bit tetap magnitudo)</td>
                <td>Memiliki dua representasi nol (+0 dan -0), sirkuit aritmatika rumit</td>
              </tr>
              <tr>
                <td style="font-weight: bold; color: var(--accent-purple);">1's Complement (C1)</td>
                <td>-127 .. +127</td>
                <td>Inversi (NOT) semua bit</td>
                <td>Masih memiliki +0 dan -0; butuh <em>end-around carry</em> saat penjumlahan</td>
              </tr>
              <tr class="active-row">
                <td style="font-weight: bold; color: var(--accent-emerald);">2's Complement (C2) ★</td>
                <td><strong>-128 .. +127</strong></td>
                <td><strong>NOT semua bit, lalu + 1 pada LSB</strong></td>
                <td><strong>Hanya memiliki satu nol unik (00000000); standar mutlak CPU/MCU</strong></td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Interactive 2's Complement Laboratory -->
        <div class="card" style="border-color: rgba(16, 185, 129, 0.4);">
          <div class="card-header">
            <div>
              <div class="card-title" style="color: var(--accent-emerald);">
                <span>🧪</span> Laboratorium Interaktif: Inversi 3-Langkah 2's Complement
              </div>
              <div class="card-subtitle">
                Ketikkan sembarang angka desimal negatif (misal: -13, -37, -58 dari slide ITERA) dan saksikan proses 3 langkah pembentukan C2.
              </div>
            </div>
            <div style="display: flex; gap: 0.5rem;">
              <button class="preset-pill" onclick="Week2Module.setVal(-13)">Contoh -13 (Slide 12)</button>
              <button class="preset-pill" onclick="Week2Module.setVal(-37)">Contoh -37 (Slide 12)</button>
              <button class="preset-pill" onclick="Week2Module.setVal(-58)">Latihan -58 (Slide 24)</button>
            </div>
          </div>

          <div style="display: flex; gap: 1rem; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap;">
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <label style="font-size: 0.85rem; color: var(--text-muted); font-weight: bold;">Nilai Desimal:</label>
              <input type="number" id="c2-input-val" class="custom-input" style="width: 140px; padding: 0.4rem 0.75rem;" value="-13">
            </div>
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <label style="font-size: 0.85rem; color: var(--text-muted); font-weight: bold;">Lebar Bit:</label>
              <select id="c2-bit-width" class="custom-input" style="width: 100px; padding: 0.4rem 0.75rem;" onchange="Week2Module.calculateLive()">
                <option value="8" selected>8-bit</option>
                <option value="16">16-bit</option>
              </select>
            </div>
            <button class="preset-pill" style="background: var(--accent-emerald); color: #000; font-weight: bold; padding: 0.5rem 1.25rem;" onclick="Week2Module.calculateLive()">
              Hitung C2
            </button>
          </div>

          <div id="c2-breakdown-result"></div>
        </div>

        <!-- Aritmatika Pengurangan via Penjumlahan & Overflow (Slide 18 & 19) -->
        <div class="card" style="border-color: rgba(245, 158, 11, 0.4);">
          <div class="card-title" style="color: var(--accent-amber);">
            <span>➕</span> Aritmatika C2: Pengurangan via Penjumlahan (A - B = A + C2(B))
          </div>
          <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem;">
            CPU tidak memerlukan sirkuit pengurang khusus; operasi <code>A - B</code> dihitung sebagai <code>A + (-B)</code> di mana <code>-B</code> adalah 2's complement dari B.
          </p>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem;">
            
            <div class="input-panel">
              <div style="font-weight: 700; color: #fff; margin-bottom: 0.5rem;">Simulasi Operasi (8-Bit Signed):</div>
              <div style="display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.5rem;">
                <input type="number" id="arith-a" class="custom-input" style="padding: 0.4rem;" value="75" placeholder="A">
                <span style="font-weight: bold; font-size: 1.2rem;">-</span>
                <input type="number" id="arith-b" class="custom-input" style="padding: 0.4rem;" value="103" placeholder="B">
                <button class="preset-pill" style="background: var(--accent-amber); color: #000; font-weight: bold; padding: 0.5rem 1rem;" onclick="Week2Module.runArithmetic()">
                  Hitung
                </button>
              </div>
              <div style="display: flex; gap: 0.35rem; flex-wrap: wrap;">
                <button class="preset-pill" onclick="Week2Module.setArith(18, 25)">18 - 25 (Slide 18)</button>
                <button class="preset-pill" onclick="Week2Module.setArith(75, 103)">75 - 103 (Slide 23)</button>
                <button class="preset-pill" onclick="Week2Module.setArith(100, -60)">+100 + +60 (Overflow +)</button>
                <button class="preset-pill" onclick="Week2Module.setArith(-100, 50)">-100 + -50 (Overflow -)</button>
              </div>
            </div>

            <div id="arith-result-box" style="background: var(--bg-card); padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <div style="font-size: 0.85rem; color: var(--text-muted);">Hasil perhitungan aritmatika akan ditampilkan di sini.</div>
            </div>

          </div>
        </div>

      </div>
    `;

    calculateLive();
    runArithmetic();
  }

  function setVal(v) {
    const inputEl = document.getElementById('c2-input-val');
    if (inputEl) {
      inputEl.value = v;
      calculateLive();
    }
  }

  function calculateLive() {
    const v = parseInt(document.getElementById('c2-input-val')?.value || '0', 10);
    const bits = parseInt(document.getElementById('c2-bit-width')?.value || '8', 10);
    const res = calculateRepresentations(v, bits);
    const out = document.getElementById('c2-breakdown-result');
    if (!out) return;

    if (!res.valid) {
      out.innerHTML = `<div class="quiz-feedback error" style="display: block;">${res.error}</div>`;
      return;
    }

    const absVal = Math.abs(v);
    const c1Str = invertBits(res.posBin);

    out.innerHTML = `
      <div style="background: var(--bg-card); border-radius: var(--radius-md); padding: 1.25rem; border: 1px solid var(--border-color);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem;">
          <div style="font-size: 1.15rem; font-weight: 700; color: #fff;">
            Nilai: <span style="color: var(--accent-cyan);">${v}</span> (${bits}-bit signed)
          </div>
          <div style="display: flex; gap: 0.5rem; font-family: var(--font-mono); font-size: 0.85rem;">
            <span style="background: var(--group-hex-bg); color: var(--group-hex); padding: 0.2rem 0.5rem; border-radius: 4px;">Hex: ${res.hexVal}</span>
            <span style="background: var(--group-oct-bg); color: var(--group-oct); padding: 0.2rem 0.5rem; border-radius: 4px;">Oktal: ${res.octVal}</span>
          </div>
        </div>

        <!-- 3-Langkah Algoritma C2 (Slide 11-12) -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 0.75rem; margin-bottom: 1.25rem;">
          
          <div style="background: var(--bg-subtle); padding: 0.85rem; border-radius: var(--radius-sm); border-left: 3px solid var(--accent-cyan);">
            <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700;">LANGKAH 1: Biner Magnitudo (+${absVal})</div>
            <div style="font-family: var(--font-mono); font-size: 1.1rem; font-weight: bold; color: #fff; margin-top: 0.35rem;">
              ${res.posBin}₂
            </div>
            <div style="font-size: 0.7rem; color: var(--text-dim); margin-top: 0.25rem;">Tulis biner positif pada lebar ${bits} bit</div>
          </div>

          <div style="background: var(--bg-subtle); padding: 0.85rem; border-radius: var(--radius-sm); border-left: 3px solid var(--accent-purple);">
            <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700;">LANGKAH 2: Inversi Bit (NOT / C1)</div>
            <div style="font-family: var(--font-mono); font-size: 1.1rem; font-weight: bold; color: var(--accent-purple); margin-top: 0.35rem;">
              ${c1Str}₂
            </div>
            <div style="font-size: 0.7rem; color: var(--text-dim); margin-top: 0.25rem;">Balik seluruh bit (0 jadi 1, 1 jadi 0)</div>
          </div>

          <div style="background: var(--bg-subtle); padding: 0.85rem; border-radius: var(--radius-sm); border-left: 3px solid var(--accent-emerald);">
            <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700;">LANGKAH 3: Tambahkan 1 pada LSB (C2)</div>
            <div style="font-family: var(--font-mono); font-size: 1.25rem; font-weight: 800; color: var(--accent-emerald); margin-top: 0.35rem;">
              ${res.c2}₂
            </div>
            <div style="font-size: 0.7rem; color: var(--text-dim); margin-top: 0.25rem;">Hasil akhir representasi 2's Complement</div>
          </div>

        </div>

        <!-- Perbandingan 3 Skema untuk Nilai Tersebut -->
        <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.5rem; font-weight: 700;">HASIL DALAM 3 SKEMA BERBEDA:</div>
        <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; font-family: var(--font-mono); font-size: 0.9rem;">
          <div style="background: rgba(6, 182, 212, 0.1); border: 1px solid var(--accent-cyan); padding: 0.4rem 0.75rem; border-radius: 6px;">
            Sign-Magnitude: <strong style="color: var(--accent-cyan);">${res.sm}₂</strong>
          </div>
          <div style="background: rgba(168, 85, 247, 0.1); border: 1px solid var(--accent-purple); padding: 0.4rem 0.75rem; border-radius: 6px;">
            1's Complement: <strong style="color: var(--accent-purple);">${res.c1}₂</strong>
          </div>
          <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid var(--accent-emerald); padding: 0.4rem 0.75rem; border-radius: 6px;">
            2's Complement: <strong style="color: var(--accent-emerald);">${res.c2}₂</strong>
          </div>
        </div>

      </div>
    `;
  }

  function setArith(a, b) {
    const elA = document.getElementById('arith-a');
    const elB = document.getElementById('arith-b');
    if (elA && elB) {
      elA.value = a;
      elB.value = b;
      runArithmetic();
    }
  }

  function runArithmetic() {
    const a = parseInt(document.getElementById('arith-a')?.value || '0', 10);
    const b = parseInt(document.getElementById('arith-b')?.value || '0', 10);
    const out = document.getElementById('arith-result-box');
    if (!out) return;

    const repA = calculateRepresentations(a, 8);
    const repNegB = calculateRepresentations(-b, 8);
    const theoreticalSum = a - b;

    if (!repA.valid || !repNegB.valid) {
      out.innerHTML = `<div class="quiz-feedback error" style="display:block;">Angka melebihi rentang 8-bit signed (-128 .. +127).</div>`;
      return;
    }

    // Binary addition simulation
    const binA = repA.c2;
    const binNegB = repNegB.c2;

    let carry = 0;
    let sumBits = [];
    let carryIntoMSB = 0;
    let carryOutMSB = 0;

    for (let i = 7; i >= 0; i--) {
      let bitA = parseInt(binA[i], 10);
      let bitB = parseInt(binNegB[i], 10);
      let total = bitA + bitB + carry;

      if (i === 0) {
        carryIntoMSB = carry;
      }

      sumBits.unshift(total % 2);
      carry = Math.floor(total / 2);

      if (i === 0) {
        carryOutMSB = carry;
      }
    }

    const resultBinStr = sumBits.join('');
    // Check overflow: (carry into MSB) XOR (carry out MSB)
    const isOverflow = (carryIntoMSB !== carryOutMSB);

    // Interpret resultBinStr in signed 8-bit
    let interpretedDecimal = parseInt(resultBinStr, 2);
    if (resultBinStr[0] === '1') {
      interpretedDecimal = interpretedDecimal - 256;
    }

    out.innerHTML = `
      <div>
        <div style="font-weight: bold; color: #fff; margin-bottom: 0.5rem;">
          Perhitungan Biner: <span style="color: var(--accent-cyan);">${a}</span> + (<span style="color: var(--accent-amber);">${-b}</span>) = <span style="color: var(--accent-emerald);">${theoreticalSum}</span>
        </div>
        <div style="font-family: var(--font-mono); font-size: 0.95rem; line-height: 1.7; background: #070a12; padding: 0.75rem; border-radius: 6px;">
          <div>&nbsp;&nbsp;${binA}&nbsp;&nbsp;(${a})</div>
          <div>+ ${binNegB}&nbsp;&nbsp;(${ -b }, C2 dari ${b})</div>
          <div style="border-top: 1px dashed #64748b; margin: 0.25rem 0;"></div>
          <div style="color: var(--accent-emerald); font-weight: bold;">= ${resultBinStr}&nbsp;&nbsp;(${interpretedDecimal})</div>
        </div>

        <div style="margin-top: 0.75rem; font-size: 0.8rem;">
          ${isOverflow ? `
            <div style="background: rgba(244, 63, 94, 0.15); border: 1px solid var(--accent-rose); color: #fb7185; padding: 0.5rem; border-radius: 6px;">
              <strong>⚠️ OVERFLOW TERDETEKSI!</strong><br>
              Hasil sesungguhnya (${theoreticalSum}) di luar rentang 8-bit signed [-128 .. +127].<br>
              Deteksi hardware: Carry ke MSB (${carryIntoMSB}) ⊕ Carry keluar MSB (${carryOutMSB}) = 1.
            </div>
          ` : `
            <div style="background: rgba(16, 185, 129, 0.12); border: 1px solid var(--accent-emerald); color: #34d399; padding: 0.5rem; border-radius: 6px;">
              <strong>✅ Hasil Sah (Tidak Overflow)</strong><br>
              Hasil komputasi hardware cocok dengan nilai desimal: <strong>${interpretedDecimal}</strong>.
            </div>
          `}
        </div>
      </div>
    `;
  }

  return {
    init: render,
    setVal,
    calculateLive,
    setArith,
    runArithmetic
  };
})();

if (typeof window !== 'undefined') {
  window.Week2Module = Week2Module;
}
