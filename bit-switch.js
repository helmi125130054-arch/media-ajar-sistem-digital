/**
 * Bit Switch Interactive Lab
 * Sistem Digital - Media Ajar Interaktif HTML5
 */

const BitSwitchLab = (() => {
  let bitCount = 8;
  let bits = new Array(bitCount).fill(0);

  function init(containerId = 'switch-board-container') {
    render(containerId);
  }

  function setBitCount(count, containerId = 'switch-board-container') {
    bitCount = count;
    bits = new Array(bitCount).fill(0);
    render(containerId);
  }

  function toggleBit(index, containerId = 'switch-board-container') {
    if (index >= 0 && index < bits.length) {
      bits[index] = bits[index] === 1 ? 0 : 1;
      render(containerId);
    }
  }

  function setAll(val, containerId = 'switch-board-container') {
    bits = new Array(bitCount).fill(val);
    render(containerId);
  }

  function invertAll(containerId = 'switch-board-container') {
    bits = bits.map(b => (b === 1 ? 0 : 1));
    render(containerId);
  }

  function setRandom(containerId = 'switch-board-container') {
    bits = bits.map(() => (Math.random() > 0.5 ? 1 : 0));
    render(containerId);
  }

  function render(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;

    const binString = bits.join('');
    const decVal = parseInt(binString, 2);

    // Hitung Oktal & Heksa melalui BinaryHub
    const hexData = BinaryHub.convertBinaryToHex(binString, '');
    const octData = BinaryHub.convertBinaryToOctal(binString, '');

    let html = `
      <div class="switch-board">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.25rem;">
          <div>
            <h3 style="font-size: 1.1rem; color: #fff; font-weight: 700; display: flex; align-items: center; gap: 0.5rem;">
              <span>🎛️</span> Lab Sakelar Bit Interaktif
            </h3>
            <p style="font-size: 0.8rem; color: var(--text-muted);">
              Klik tuas sakelar untuk mengubah bit (0 atau 1) dan amati perubahan otomatis kelompok 4-bit (Hex), 3-bit (Oct), dan bobot Desimal.
            </p>
          </div>
          <div style="display: flex; gap: 0.5rem; align-items: center;">
            <button class="preset-pill ${bitCount === 8 ? 'active' : ''}" style="${bitCount === 8 ? 'background: var(--accent-cyan); color: #000; font-weight: bold;' : ''}" onclick="BitSwitchLab.setBitCount(8)">8 Bit (Byte)</button>
            <button class="preset-pill ${bitCount === 12 ? 'active' : ''}" style="${bitCount === 12 ? 'background: var(--accent-cyan); color: #000; font-weight: bold;' : ''}" onclick="BitSwitchLab.setBitCount(12)">12 Bit</button>
            <button class="preset-pill ${bitCount === 16 ? 'active' : ''}" style="${bitCount === 16 ? 'background: var(--accent-cyan); color: #000; font-weight: bold;' : ''}" onclick="BitSwitchLab.setBitCount(16)">16 Bit (Word)</button>
          </div>
        </div>

        <!-- Sakelar Fisik Grid -->
        <div class="switch-grid">
    `;

    for (let i = 0; i < bitCount; i++) {
      const bitVal = bits[i];
      const power = bitCount - 1 - i;
      const weight = Math.pow(2, power);
      const isMSB = i === 0;
      const isLSB = i === bitCount - 1;

      html += `
        <div class="bit-switch-unit" onclick="BitSwitchLab.toggleBit(${i})">
          <div style="font-size: 0.65rem; color: ${isMSB ? 'var(--accent-rose)' : (isLSB ? 'var(--accent-emerald)' : 'var(--text-dim)')}; font-weight: 700;">
            ${isMSB ? 'MSB' : (isLSB ? 'LSB' : `b${power}`)}
          </div>
          <div class="switch-weight-tag">2^${power}<br><span style="color: #64748b; font-size: 0.65rem;">(${weight})</span></div>
          <div class="switch-lever ${bitVal === 1 ? 'active' : ''}"></div>
          <div class="switch-led"></div>
          <div style="font-family: var(--font-mono); font-weight: 800; font-size: 1.1rem; color: ${bitVal === 1 ? 'var(--accent-emerald)' : 'var(--text-muted)'};">
            ${bitVal}
          </div>
        </div>
      `;
    }

    html += `
        </div>

        <!-- Quick Control Buttons -->
        <div style="display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap; margin-bottom: 1.5rem;">
          <button class="preset-pill" onclick="BitSwitchLab.setAll(0)">Reset (Semua 0)</button>
          <button class="preset-pill" onclick="BitSwitchLab.setAll(1)">Set (Semua 1)</button>
          <button class="preset-pill" onclick="BitSwitchLab.invertAll()">Inversi (NOT Semua Bit)</button>
          <button class="preset-pill" onclick="BitSwitchLab.setRandom()">Pola Acak (Random)</button>
        </div>

        <!-- Live Conversion Dashboard -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1rem;">
          
          <!-- Biner Card -->
          <div class="card" style="margin-bottom: 0; background: rgba(14, 165, 233, 0.08); border-color: rgba(14, 165, 233, 0.3);">
            <div style="font-size: 0.75rem; color: var(--accent-cyan); font-weight: 700; text-transform: uppercase;">1. Biner Poros Sentral (Basis 2)</div>
            <div style="font-family: var(--font-mono); font-size: 1.2rem; font-weight: 800; color: #fff; margin: 0.5rem 0; word-break: break-all;">
              ${binString}₂
            </div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">
              Total bit aktif: <strong style="color: var(--accent-emerald);">${bits.filter(b => b === 1).length}</strong> dari ${bitCount} bit
            </div>
          </div>

          <!-- Hex Card (Group 4) -->
          <div class="card" style="margin-bottom: 0; background: var(--group-hex-bg); border-color: var(--group-hex-border);">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 0.75rem; color: var(--group-hex); font-weight: 700; text-transform: uppercase;">2. Heksadesimal (Basis 16)</span>
              <span class="group-pill hex">Grup 4 Bit (Nibble)</span>
            </div>
            <div style="font-family: var(--font-mono); font-size: 1.35rem; font-weight: 800; color: #fff; margin: 0.5rem 0;">
              0x${hexData.fullHex}₁₆
            </div>
            <div style="font-size: 0.75rem; color: var(--text-muted); display: flex; gap: 0.4rem; flex-wrap: wrap;">
              ${hexData.intGroups.map(g => `<span style="background: rgba(0,0,0,0.3); padding: 0.1rem 0.4rem; border-radius: 4px; font-family: var(--font-mono);">${g.chunk}₂ &rarr; <strong>${g.hexDigit}</strong></span>`).join(' ')}
            </div>
          </div>

          <!-- Octal Card (Group 3) -->
          <div class="card" style="margin-bottom: 0; background: var(--group-oct-bg); border-color: var(--group-oct-border);">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 0.75rem; color: var(--group-oct); font-weight: 700; text-transform: uppercase;">3. Oktal (Basis 8)</span>
              <span class="group-pill oct">Grup 3 Bit</span>
            </div>
            <div style="font-family: var(--font-mono); font-size: 1.35rem; font-weight: 800; color: #fff; margin: 0.5rem 0;">
              ${octData.fullOct}₈
            </div>
            <div style="font-size: 0.75rem; color: var(--text-muted); display: flex; gap: 0.4rem; flex-wrap: wrap;">
              ${octData.intGroups.map(g => `<span style="background: rgba(0,0,0,0.3); padding: 0.1rem 0.4rem; border-radius: 4px; font-family: var(--font-mono);">${g.chunk}₂ &rarr; <strong>${g.octDigit}</strong></span>`).join(' ')}
            </div>
          </div>

          <!-- Decimal Card (Sum Weights) -->
          <div class="card" style="margin-bottom: 0; background: var(--group-dec-bg); border-color: var(--group-dec-border);">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 0.75rem; color: var(--group-dec); font-weight: 700; text-transform: uppercase;">4. Desimal (Basis 10)</span>
              <span style="font-size: 0.7rem; color: var(--accent-amber); font-weight: 600;">Σ (Bit × 2ⁿ)</span>
            </div>
            <div style="font-family: var(--font-mono); font-size: 1.35rem; font-weight: 800; color: #fff; margin: 0.5rem 0;">
              ${decVal}₁₀
            </div>
            <div style="font-size: 0.72rem; color: var(--text-muted); font-family: var(--font-mono); word-break: break-all;">
              ${bits.map((b, idx) => b === 1 ? Math.pow(2, bitCount - 1 - idx) : null).filter(v => v !== null).join(' + ') || '0'} = ${decVal}
            </div>
          </div>

        </div>
      </div>
    `;

    el.innerHTML = html;
  }

  return {
    init,
    setBitCount,
    toggleBit,
    setAll,
    invertAll,
    setRandom
  };
})();

if (typeof window !== 'undefined') {
  window.BitSwitchLab = BitSwitchLab;
}
