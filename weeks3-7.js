/**
 * Modul Minggu 3-7: teori ringkas (dari slide) + lab interaktif.
 * 3 Boolean/SOP-POS | 4 K-Map | 5 Adder-Subtractor | 6 NAND/NOR & MUX | 7 Decoder/Encoder/7-Segment
 */
const Weeks37 = (() => {
  const card = (t, b) => `<div class="card"><div class="card-title">${t}</div><div style="margin-top:.75rem;font-size:.88rem;color:var(--text-muted);line-height:1.7">${b}</div></div>`;
  const tbl = (h, rows) => `<div style="overflow-x:auto"><table class="weights-table"><thead><tr>${h.map(x => `<th>${x}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  const IN = 'background:var(--bg-subtle);color:#fff;border:1px solid var(--border-color);border-radius:6px;padding:.4rem .6rem;font-family:inherit;';
  const bin = (n, w) => n.toString(2).padStart(w, '0');
  const $ = id => document.getElementById(id);

  /* ---------- W3: parser ekspresi Boolean (A' = NOT, + = OR, AB / A*B = AND, ^ = XOR) ---------- */
  function parse(src) {
    const t = src.replace(/\s+/g, '').toUpperCase().match(/[A-Z]|[()+*.!'^⊕]/g) || [];
    let i = 0; const vars = new Set();
    const or = () => { let l = xor(); while (t[i] === '+') { i++; const a = l, b = xor(); l = e => a(e) | b(e); } return l; };
    const xor = () => { let l = and(); while (t[i] === '^' || t[i] === '⊕') { i++; const a = l, b = and(); l = e => a(e) ^ b(e); } return l; };
    const and = () => { let l = not(); while (t[i] === '*' || t[i] === '.' || (t[i] && /[A-Z(!]/.test(t[i]))) { if (t[i] === '*' || t[i] === '.') i++; const a = l, b = not(); l = e => a(e) & b(e); } return l; };
    const not = () => { if (t[i] === '!') { i++; const a = not(); return e => a(e) ^ 1; } let a = atom(); while (t[i] === "'") { i++; const p = a; a = e => p(e) ^ 1; } return a; };
    const atom = () => { const c = t[i++]; if (c === '(') { const f = or(); if (t[i++] !== ')') throw 0; return f; } if (c && /[A-Z]/.test(c)) { vars.add(c); return e => e[c]; } throw 0; };
    const f = or(); if (!t.length || i < t.length) throw 0;
    return { f, vars: [...vars].sort() };
  }
  function truth(src) {
    const { f, vars } = parse(src); const n = vars.length; if (n > 5) throw 0;
    const rows = [];
    for (let m = 0; m < 1 << n; m++) { const e = {}; vars.forEach((v, k) => e[v] = (m >> (n - 1 - k)) & 1); rows.push({ m, e, y: f(e) & 1 }); }
    return { vars, rows };
  }
  function labW3(id) {
    $(id).innerHTML = card('💡 Simulator Tabel Kebenaran & SOP/POS', `
      <p>Ketik ekspresi (maks. 5 variabel). <code>'</code> = NOT, <code>+</code> = OR, <code>AB</code> atau <code>A*B</code> = AND, <code>^</code> = XOR.</p>
      <div style="display:flex;gap:.5rem;flex-wrap:wrap;margin:.75rem 0">
        <input id="w3-expr" value="A'B + AB'" style="${IN}flex:1;min-width:200px;font-family:'JetBrains Mono',monospace">
        <button class="preset-pill" id="w3-go">Hitung</button></div>
      <div id="w3-out"></div>`);
    const go = () => {
      const out = $('w3-out');
      try {
        const { vars, rows } = truth($('w3-expr').value);
        const mt = rows.filter(r => r.y).map(r => r.m), Mx = rows.filter(r => !r.y).map(r => r.m);
        const sop = mt.map(m => vars.map((v, k) => v + ((m >> (vars.length - 1 - k)) & 1 ? '' : "'")).join('')).join(' + ') || '0';
        out.innerHTML = tbl([...vars, 'Y'], rows.map(r => [...vars.map(v => r.e[v]), `<b style="color:${r.y ? 'var(--accent-emerald)' : 'var(--text-dim)'}">${r.y}</b>`])) +
          `<p style="margin-top:.75rem">SOP (minterm): <b>Σm(${mt.join(', ') || '-'})</b> → <code>Y = ${sop}</code><br>POS (maxterm): <b>ΠM(${Mx.join(', ') || '-'})</b></p>`;
      } catch (e) { out.innerHTML = '<p style="color:#f87171">Ekspresi tidak valid. Contoh: A\'B + AB\', (A+B)C, A^B</p>'; }
    };
    $('w3-go').onclick = go; $('w3-expr').onkeydown = e => { if (e.key === 'Enter') go(); }; go();
  }

  /* ---------- W4: K-Map 4 variabel (klik: 0 → 1 → X/don't care) ---------- */
  const lit = (v, mask) => mask === 15 ? '1' : 'ABCD'.split('').map((c, k) => (mask >> (3 - k)) & 1 ? '' : c + ((v >> (3 - k)) & 1 ? '' : "'")).join('');
  function kmap(cells) {
    const ones = [...Array(16).keys()].filter(m => cells[m] === 1);
    if (!ones.length) return '0';
    const imps = [];
    for (let mask = 0; mask < 16; mask++) for (let v = 0; v < 16; v++) {
      if (v & mask) continue;
      const cov = []; for (let m = 0; m < 16; m++) if ((m & ~mask & 15) === v) cov.push(m);
      if (cov.every(m => cells[m])) imps.push({ mask, v, cov });
    }
    const prime = imps.filter(a => !imps.some(b => b !== a && b.cov.length > a.cov.length && a.cov.every(m => b.cov.includes(m))));
    const cost = p => p.reduce((s, x) => s + 4 - [0, 1, 2, 3].filter(k => (x.mask >> k) & 1).length, 0);
    let best = null;
    for (let s = 1; s < 1 << prime.length; s++) {
      const pick = prime.filter((_, k) => (s >> k) & 1);
      if (!ones.every(m => pick.some(p => p.cov.includes(m)))) continue;
      if (!best || pick.length < best.length || (pick.length === best.length && cost(pick) < cost(best))) best = pick;
    }
    return best.map(p => lit(p.v, p.mask)).join(' + ');
  }
  function labW4(id) {
    const cells = Array(16).fill(0), gray = [0, 1, 3, 2];
    const draw = () => {
      let h = '<table class="weights-table" style="text-align:center"><thead><tr><th>AB \\ CD</th>' + gray.map(g => `<th>${bin(g, 2)}</th>`).join('') + '</tr></thead><tbody>';
      gray.forEach(r => { h += `<tr><th>${bin(r, 2)}</th>` + gray.map(c => { const m = r * 4 + c, s = cells[m]; return `<td><button data-m="${m}" style="${IN}width:100%;cursor:pointer;color:${s === 1 ? '#34d399' : s === 2 ? '#fbbf24' : '#64748b'}">${s === 2 ? 'X' : s}<br><small>m${m}</small></button></td>`; }).join('') + '</tr>'; });
      const mt = cells.map((c, m) => c === 1 ? m : -1).filter(m => m >= 0), dc = cells.map((c, m) => c === 2 ? m : -1).filter(m => m >= 0);
      $(id).innerHTML = card('🗺️ Simulator K-Map 4 Variabel', `<p>Klik sel: 0 → 1 → X (don't care). Penyederhanaan SOP minimum dihitung otomatis.</p>${h}</tbody></table>
        <p style="margin-top:.75rem">Σm(${mt.join(', ') || '-'})${dc.length ? ' + d(' + dc.join(', ') + ')' : ''}<br>Hasil: <code style="color:var(--accent-emerald);font-size:1.1rem">Q = ${kmap(cells)}</code></p>
        <button class="preset-pill" id="w4-ex">Contoh: Alarm (D + AC + BC)</button> <button class="preset-pill" id="w4-clr">Reset</button>`);
      $(id).querySelectorAll('button[data-m]').forEach(b => b.onclick = () => { const m = +b.dataset.m; cells[m] = (cells[m] + 1) % 3; draw(); });
      $('w4-clr').onclick = () => { cells.fill(0); draw(); };
      $('w4-ex').onclick = () => { cells.fill(0); [1, 3, 5, 6, 7, 9, 10, 11, 13, 14, 15].forEach(m => cells[m] = 1); draw(); };
    };
    draw();
  }

  /* ---------- W5: Adder-Subtractor 4-bit terintegrasi ---------- */
  function labW5(id) {
    $(id).innerHTML = card('➕➖ Simulator Adder-Subtractor 4-bit', `
      <div style="display:flex;gap:1rem;flex-wrap:wrap;align-items:center">
        <label>A (0-15) <input id="w5a" type="number" min="0" max="15" value="9" style="${IN}width:70px"></label>
        <label>B (0-15) <input id="w5b" type="number" min="0" max="15" value="5" style="${IN}width:70px"></label>
        <label>Mode M <select id="w5m" style="${IN}"><option value="0">0 = Add (A+B)</option><option value="1" selected>1 = Sub (A−B)</option></select></label></div>
      <div id="w5out" style="margin-top:1rem"></div>`);
    const run = () => {
      const A = Math.min(15, Math.max(0, +$('w5a').value || 0)), B = Math.min(15, Math.max(0, +$('w5b').value || 0)), M = +$('w5m').value;
      let c = M, rows = [], S = '';
      for (let i = 0; i < 4; i++) {
        const a = (A >> i) & 1, b = (B >> i) & 1, bp = b ^ M, s = a ^ bp ^ c, co = (a & bp) | (c & (a ^ bp));
        rows.push([i, a, b, M, bp, c, s, co]); S = s + S; c = co;
      }
      $('w5out').innerHTML = tbl(['Bit', 'Aᵢ', 'Bᵢ', 'M', "Bᵢ' = Bᵢ⊕M", 'Cin', 'Sᵢ', 'Cout'], rows) +
        `<p style="margin-top:.75rem">A = ${bin(A, 4)}₂, B = ${bin(B, 4)}₂ → hasil: <code>${c}${S}₂</code> = <b>${parseInt(c + S, 2)}₁₀</b><br>` +
        (M ? `Cout final = ${c} → ${c ? 'tidak ada borrow (hasil ≥ 0): <b>' + parseInt(S, 2) + '</b>' : 'ada borrow (hasil negatif, dalam bentuk C2)'}` : `Cout final = ${c} → carry ${c ? 'ada (hasil melebihi 4 bit)' : 'tidak ada'}`) + '</p>';
    };
    ['w5a', 'w5b', 'w5m'].forEach(k => $(k).oninput = run); run();
  }

  /* ---------- W6: Multiplexer 4:1 ---------- */
  function labW6(id) {
    $(id).innerHTML = card('🔀 Simulator Multiplexer 4:1', `
      <div style="display:flex;gap:1rem;flex-wrap:wrap">${[0, 1, 2, 3].map(k => `<label>D${k} <select id="w6d${k}" style="${IN}"><option>0</option><option ${k === 1 || k === 2 ? 'selected' : ''}>1</option></select></label>`).join('')}
        <label>S1 <select id="w6s1" style="${IN}"><option>0</option><option>1</option></select></label>
        <label>S0 <select id="w6s0" style="${IN}"><option>0</option><option>1</option></select></label></div>
      <div id="w6out" style="margin-top:1rem"></div>`);
    const run = () => {
      const s = +$('w6s1').value * 2 + +$('w6s0').value, d = [0, 1, 2, 3].map(k => +$('w6d' + k).value);
      $('w6out').innerHTML = `<p>Select S1S0 = <b>${bin(s, 2)}</b> → memilih <b>D${s}</b> = ${d[s]}</p>
        <p style="font-size:1.4rem">Y = <b style="color:${d[s] ? 'var(--accent-emerald)' : 'var(--text-dim)'}">${d[s]}</b></p>
        <p><code>Y = S1'S0'D0 + S1'S0 D1 + S1 S0' D2 + S1 S0 D3</code></p>`;
    };
    document.querySelectorAll('#' + id + ' select').forEach(e => e.onchange = run); run();
  }

  /* ---------- W7: BCD/HEX ke 7-segment ---------- */
  const SEG = ['abcdef', 'bc', 'abdeg', 'abcdg', 'bcfg', 'acdfg', 'acdefg', 'abc', 'abcdefg', 'abcdfg', 'abcefg', 'cdefg', 'adef', 'bcdeg', 'adefg', 'aefg'];
  function labW7(id) {
    const R = { a: [12, 4, 36, 8], b: [50, 14, 8, 32], c: [50, 54, 8, 32], d: [12, 88, 36, 8], e: [2, 54, 8, 32], f: [2, 14, 8, 32], g: [12, 46, 36, 8] };
    $(id).innerHTML = card('🔢 Simulator Decoder BCD/HEX ke 7-Segment', `
      <div style="display:flex;gap:1.5rem;flex-wrap:wrap;align-items:center">
        <label>Input D C B A: <select id="w7n" style="${IN}">${SEG.map((_, n) => `<option value="${n}" ${n === 5 ? 'selected' : ''}>${bin(n, 4)} (${n.toString(16).toUpperCase()})</option>`).join('')}</select></label>
        <label>Tipe: <select id="w7t" style="${IN}"><option value="1">Common Cathode (aktif HIGH)</option><option value="0">Common Anode (aktif LOW)</option></select></label></div>
      <div style="display:flex;gap:2rem;flex-wrap:wrap;align-items:center;margin-top:1rem"><div id="w7svg"></div><div id="w7tab" style="flex:1;min-width:240px"></div></div>`);
    const run = () => {
      const n = +$('w7n').value, hi = +$('w7t').value, on = SEG[n];
      $('w7svg').innerHTML = `<svg viewBox="0 0 60 100" width="110">${Object.entries(R).map(([k, r]) => `<rect x="${r[0]}" y="${r[1]}" width="${r[2]}" height="${r[3]}" rx="3" fill="${on.includes(k) ? '#22d3ee' : '#1e293b'}"/>`).join('')}</svg>`;
      $('w7tab').innerHTML = tbl([...'abcdefg'].map(k => k), [[...'abcdefg'].map(k => on.includes(k) ? (hi ? 1 : 0) : (hi ? 0 : 1))]) +
        `<p style="margin-top:.5rem">Segmen menyala: <b>${[...on].join(', ')}</b>. Nilai di tabel = logika pin keluaran decoder.</p>`;
    };
    $('w7n').onchange = $('w7t').onchange = run; run();
  }

  /* ---------- Teori per minggu (ringkasan slide) ---------- */
  const L = { // hukum Boolean
    r: [['Identitas', "A + 0 = A &nbsp; | &nbsp; A · 1 = A"], ['Dominasi', 'A + 1 = 1 &nbsp; | &nbsp; A · 0 = 0'], ['Idempoten', 'A + A = A &nbsp; | &nbsp; A · A = A'], ['Komplemen', "A + A' = 1 &nbsp; | &nbsp; A · A' = 0"], ['Involusi', "(A')' = A"], ['Komutatif', 'A + B = B + A &nbsp; | &nbsp; AB = BA'], ['Distributif', 'A(B + C) = AB + AC &nbsp; | &nbsp; A + BC = (A+B)(A+C)'], ['De Morgan', "(A+B)' = A'B' &nbsp; | &nbsp; (AB)' = A' + B'"], ['Absorpsi', 'A + AB = A &nbsp; | &nbsp; A(A+B) = A'], ['Konsensus', "AB + A'C + BC = AB + A'C"]]
  };
  const THEORY = {
    3: () => card('📖 Gerbang Logika', tbl(['Gerbang', 'Ekspresi', 'Keluaran = 1 jika...'], [['AND', 'A·B', 'semua input 1'], ['OR', 'A+B', 'minimal satu input 1'], ['NOT', "A'", 'input 0'], ['NAND', "(A·B)'", 'bukan semua input 1'], ['NOR', "(A+B)'", 'semua input 0'], ['XOR', 'A⊕B', 'jumlah input 1 ganjil'], ['XNOR', "(A⊕B)'", 'input sama']])) +
      card('📐 Hukum Aljabar Boolean', tbl(['Hukum', 'Bentuk'], L.r)) +
      card('🧮 Prioritas Operator & Bentuk Standar', `<p>Urutan: <b>tanda kurung → NOT → AND → OR</b>.</p>
        <p><b>SOP (Sum of Products / Minterm)</b>: tiap suku perkalian semua variabel, lalu dijumlahkan. Variabel tanpa komplemen = 1, dengan komplemen = 0. Contoh <code>G = x'yz + xyz + x'y'z'</code>. Dibangun dari baris output = 1.</p>
        <p><b>POS (Product of Sums / Maxterm)</b>: tiap suku penjumlahan semua variabel, lalu dikalikan. Variabel tanpa komplemen = 0, dengan komplemen = 1. Contoh <code>f = (x'+y)(x+y')</code>.</p>`) +
      card('🎯 Latihan (dari slide)', "Latihan 4: Gerbang AND menghasilkan C, gerbang OR menghasilkan D, lalu C dan D masuk gerbang XOR menghasilkan Q. Buat rangkaian, tabel kebenaran, dan persamaan Booleannya. <i>Coba di tab Simulator dengan: <code>(AB) ^ (A+B)</code></i>"),
    4: () => card('📖 Konsep K-Map', `<p>K-Map menyederhanakan fungsi Boolean secara visual, lebih intuitif daripada manipulasi aljabar. Susunan baris/kolom memakai <b>kode Gray</b> (00, 01, 11, 10) sehingga sel bertetangga hanya berbeda <b>1 variabel</b>.</p>
      <p><b>Aturan pengelompokan:</b> kelompok berisi 1 berukuran 1, 2, 4, 8, atau 16 sel (pangkat 2), berbentuk persegi/persegi panjang, boleh wrap-around tepi, dan dibuat sebesar mungkin. Variabel yang berubah dalam kelompok dieliminasi.</p>`) +
      card('✏️ Contoh dari Slide', tbl(['Soal', 'Hasil'], [["K-Map 2 var: Q = AB + A'B + AB'", 'Q = A + B'], ["K-Map 3 var: Q = ABC' + AB'C' + AB'C + ABC", 'Q = A'], ["K-Map 4 var: Q = A'BC'D + ABC'D + A'BCD + ABCD", 'Q = BD'], ['Alarm gedung (pintu·gerak, jendela·gerak, asap)', 'Q = D + AC + BC']])) +
      card("❓ Don't Care (X)", "Kondisi yang tidak mungkin terjadi atau tidak peduli. Sel X boleh dianggap 0 atau 1, mana yang membuat kelompok lebih besar. Gunakan simulator: klik sel dua kali untuk menandai X."),
    5: () => card('📖 Half & Full Adder', tbl(['Rangkaian', 'Persamaan'], [['Half Adder', 'S = A⊕B, C = A·B'], ['Full Adder', 'S = A⊕B⊕Cin, Cout = AB + Cin(A⊕B)'], ['Half Subtractor', "D = A⊕B, Bout = A'B"], ['Full Subtractor', "D = A⊕B⊕Bin, Bout = A'B + (A⊕B)'Bin"]])) +
      '<p style="font-size:.85rem;color:var(--text-muted);margin:-.5rem 0 1rem 0">Half Adder tidak punya input carry-in, sehingga tidak cukup untuk penjumlahan multi-bit. Full Adder (3 input) memecahkan masalah itu.</p>' +
      card('⛓️ RCA vs CLA', `<p>CLA memakai <b>Generate G = A·B</b> dan <b>Propagate P = A⊕B</b>: <code>C1 = G0 + P0C0</code>, <code>C2 = G1 + P1G0 + P1P0C0</code>.</p>` +
        tbl(['Aspek', 'RCA', 'CLA'], [['Desain', 'Sederhana (serial)', 'Kompleks (paralel)'], ['Delay', 'Tinggi (carry merambat)', 'Rendah (carry dihitung langsung)'], ['Hardware', 'Hemat gerbang', 'Lebih banyak gerbang'], ['Skala', 'Cocok untuk kecil', 'Cocok untuk besar']])) +
      card('🔁 Adder-Subtractor Terintegrasi', "Satu rangkaian Full Adder untuk keduanya: B di-XOR dengan M dan Cin awal = M. Mode M=0: A + B. Mode M=1: A + B' + 1 = A − B. Untuk pengurangan, Cout = 1 berarti tidak ada borrow."),
    6: () => card('📖 NAND & NOR sebagai Gerbang Universal', `<p>Semua fungsi logika dapat dibentuk hanya dari NAND atau hanya dari NOR.</p>` + tbl(['Fungsi', 'Hanya NAND', 'Hanya NOR'], [['NOT', 'NAND(A,A)', 'NOR(A,A)'], ['AND', "NAND lalu NOT", "NOR(A', B')"], ['OR', "NAND(A', B')", 'NOR lalu NOT']])) +
      card('🧩 Desain Multilevel', "<b>SOP → NAND-NAND</b> (dua level NAND). <b>POS → NOR-NOR</b>. Langkah: sederhanakan fungsi, tulis SOP/POS, ganti tiap gerbang dengan NAND/NOR, dan tambahkan inverter bila ada literal tunggal di level kedua.") +
      card('📖 Multiplexer (Data Selector)', tbl(['MUX', 'Persamaan'], [['2:1', "Y = S'D0 + S D1"], ['4:1', "Y = S1'S0'D0 + S1'S0 D1 + S1 S0' D2 + S1 S0 D3"], ['8:1', '3 jalur select, 8 input data']]) + "<p>Semakin banyak jalur select, semakin banyak input yang dapat dipilih. MUX dipakai di CPU, pemilihan memori, dan komunikasi data, dan dapat menggantikan gerbang logika untuk implementasi fungsi Boolean.</p>"),
    7: () => card('📖 Decoder', `<p>Decoder: input <b>n bit → 2ⁿ output</b>, hanya satu output aktif. Contoh 2-to-4: <code>Y0 = A'B', Y1 = A'B, Y2 = AB', Y3 = AB</code> (dengan Enable: tiap Y di-AND dengan E). IC umum: <b>74LS138</b> (3-to-8).</p>
      <p>Aplikasi: address decoder memori, pemilih saluran, kunci digital (input 101 → hanya Y5 aktif), dan pengaktif peripheral mikrokontroler.</p>`) +
      card('📖 Encoder', tbl(['Aspek', 'Decoder', 'Encoder'], [['Arah', 'Biner → aktivasi tunggal', 'Aktivasi tunggal → biner'], ['Input', 'n bit', '2ⁿ jalur'], ['Output', '2ⁿ jalur', 'n bit'], ['IC', '74LS138', '74LS148']]) + "<p>Encoder 4-to-2: <code>A1 = D2 + D3, A0 = D1 + D3</code>. <b>Priority encoder</b> memilih input aktif tertinggi bila lebih dari satu aktif. Aplikasi: keypad scanner.</p>") +
      card('📖 7-Segment', "Tampilan 7 LED (a–g) + dp. <b>Common Anode</b>: common ke Vcc, segmen menyala bila output <b>LOW</b>. <b>Common Cathode</b>: common ke GND, segmen menyala bila output <b>HIGH</b>. Decoder BCD-ke-7-segment mengubah 4 bit input menjadi 7 sinyal a–g."),
  };
  const LABS = { 3: labW3, 4: labW4, 5: labW5, 6: labW6, 7: labW7 };

  function render(week, submenu, id) {
    const el = $(id); if (!el) return;
    if (submenu === 'lab') { el.innerHTML = '<div id="wk-lab"></div>'; LABS[week]('wk-lab'); }
    else el.innerHTML = THEORY[week]();
  }
  return { render, parse, truth, kmap };
})();
if (typeof window !== 'undefined') window.Weeks37 = Weeks37;
if (typeof module !== 'undefined') module.exports = Weeks37;
