/**
 * Binary Central Hub Converter Engine
 * Sistem Digital - Media Ajar Interaktif HTML5
 * 
 * Filosofi: Semua sistem bilangan (Desimal, Oktal, Heksadesimal)
 * dikonversi terlebih dahulu ke BINER sebagai poros pusat,
 * kemudian dari BINER dikelompokkan:
 * - 4 bit (nibble) -> Heksadesimal
 * - 3 bit -> Oktal
 * - Penjumlahan bobot posisi (2^n) -> Desimal
 */

const BinaryHub = (() => {
  const HEX_TO_BIN = {
    '0': '0000', '1': '0001', '2': '0010', '3': '0011',
    '4': '0100', '5': '0101', '6': '0110', '7': '0111',
    '8': '1000', '9': '1001', 'A': '1010', 'B': '1011',
    'C': '1100', 'D': '1101', 'E': '1110', 'F': '1111'
  };

  const BIN_TO_HEX = {
    '0000': '0', '0001': '1', '0010': '2', '0011': '3',
    '0100': '4', '0101': '5', '0110': '6', '0111': '7',
    '1000': '8', '1001': '9', '1010': 'A', '1011': 'B',
    '1100': 'C', '1101': 'D', '1110': 'E', '1111': 'F'
  };

  const OCT_TO_BIN = {
    '0': '000', '1': '001', '2': '010', '3': '011',
    '4': '100', '5': '101', '6': '110', '7': '111'
  };

  const BIN_TO_OCT = {
    '000': '0', '001': '1', '010': '2', '011': '3',
    '100': '4', '101': '5', '110': '6', '111': '7'
  };

  function validateInput(value, base) {
    const clean = (value || '').toString().trim().toUpperCase();
    if (!clean) return { valid: false, error: 'Input tidak boleh kosong.' };

    const parts = clean.split('.');
    if (parts.length > 2) {
      return { valid: false, error: 'Format angka salah: hanya boleh memiliki maksimal 1 tanda titik koma (.)' };
    }

    const [intPart, fracPart = ''] = parts;
    if (intPart === '' && fracPart === '') {
      return { valid: false, error: 'Masukkan angka yang valid.' };
    }

    let regex;
    switch (base) {
      case 'bin':
        regex = /^[01]*$/;
        break;
      case 'oct':
        regex = /^[0-7]*$/;
        break;
      case 'dec':
        regex = /^[0-9]*$/;
        break;
      case 'hex':
        regex = /^[0-9A-F]*$/;
        break;
      default:
        return { valid: false, error: 'Basis tidak dikenal.' };
    }

    if ((intPart && !regex.test(intPart)) || (fracPart && !regex.test(fracPart))) {
      const allowed = {
        bin: 'hanya digit 0 dan 1',
        oct: 'digit 0 sampai 7',
        dec: 'digit 0 sampai 9',
        hex: 'digit 0-9 dan huruf A-F'
      };
      return { valid: false, error: `Karakter tidak valid untuk basis ${base.toUpperCase()} (${allowed[base]}).` };
    }

    return { valid: true, cleanValue: clean, intPart: intPart || '0', fracPart };
  }

  function convertToCentralBinary(inputVal, base) {
    const valObj = validateInput(inputVal, base);
    if (!valObj.valid) return { success: false, error: valObj.error };

    const { intPart, fracPart } = valObj;
    const steps = [];
    let binInt = '0';
    let binFrac = '';

    if (base === 'bin') {
      binInt = intPart.replace(/^0+/, '') || '0';
      binFrac = fracPart;
      steps.push({
        type: 'already_bin',
        title: 'Input sudah dalam bentuk BINER',
        desc: 'Bilangan sudah berupa basis 2 murni dan langsung siap menjadi poros sentral pengelompokan.'
      });
    } else if (base === 'dec') {
      const decIntNum = parseInt(intPart || '0', 10);
      const divisionSteps = [];
      if (decIntNum === 0) {
        binInt = '0';
        divisionSteps.push({ n: 0, div: 2, q: 0, r: 0 });
      } else {
        let temp = decIntNum;
        const remainders = [];
        while (temp > 0) {
          const q = Math.floor(temp / 2);
          const r = temp % 2;
          divisionSteps.push({ n: temp, div: 2, q, r });
          remainders.push(r);
          temp = q;
        }
        binInt = remainders.reverse().join('');
      }

      steps.push({
        type: 'dec_int',
        title: 'Langkah 1A: Desimal Bulat ke Biner (Pembagian Berulang 2)',
        desc: `Bagi ${intPart} berulang kali dengan 2, catat sisa bagi (remainder) dari bawah (MSB) ke atas (LSB):`,
        divisionTable: divisionSteps,
        resultInt: binInt
      });

      if (fracPart && fracPart.length > 0) {
        let fracNum = parseFloat('0.' + fracPart);
        const multSteps = [];
        const bits = [];
        let limit = 8;
        let current = fracNum;

        while (current > 0 && limit > 0) {
          const multiplied = current * 2;
          const bit = Math.floor(multiplied);
          const nextFrac = Number((multiplied - bit).toFixed(8));
          multSteps.push({
            input: current.toString(),
            multiplied: multiplied.toFixed(4),
            bit,
            nextFrac: nextFrac.toString()
          });
          bits.push(bit);
          current = nextFrac;
          limit--;
        }
        binFrac = bits.join('');

        steps.push({
          type: 'dec_frac',
          title: 'Langkah 1B: Desimal Pecahan ke Biner (Perkalian Berulang 2)',
          desc: `Kalikan nilai 0.${fracPart} berturut-turut dengan 2, ambil bagian bulat (0 atau 1) dari atas ke bawah:`,
          multTable: multSteps,
          resultFrac: binFrac
        });
      }
    } else if (base === 'oct') {
      const octIntDigits = (intPart || '0').split('');
      const octIntExpansions = octIntDigits.map(d => ({
        digit: d,
        bits: OCT_TO_BIN[d] || '000'
      }));
      binInt = octIntExpansions.map(e => e.bits).join('').replace(/^0+/, '') || '0';

      let octFracExpansions = [];
      if (fracPart) {
        octFracExpansions = fracPart.split('').map(d => ({
          digit: d,
          bits: OCT_TO_BIN[d] || '000'
        }));
        binFrac = octFracExpansions.map(e => e.bits).join('');
      }

      steps.push({
        type: 'oct_expansion',
        title: 'Langkah 1: Oktal ke Biner (Ekspansi 3-Bit per Digit)',
        desc: 'Setiap 1 digit Oktal (0-7) digantikan langsung dengan bentuk 3-bit binernya (2³ = 8):',
        intExpansions: octIntExpansions,
        fracExpansions: octFracExpansions,
        resultInt: binInt,
        resultFrac: binFrac
      });
    } else if (base === 'hex') {
      const hexIntDigits = (intPart || '0').split('');
      const hexIntExpansions = hexIntDigits.map(d => ({
        digit: d,
        bits: HEX_TO_BIN[d] || '0000'
      }));
      binInt = hexIntExpansions.map(e => e.bits).join('').replace(/^0+/, '') || '0';

      let hexFracExpansions = [];
      if (fracPart) {
        hexFracExpansions = fracPart.split('').map(d => ({
          digit: d,
          bits: HEX_TO_BIN[d] || '0000'
        }));
        binFrac = hexFracExpansions.map(e => e.bits).join('');
      }

      steps.push({
        type: 'hex_expansion',
        title: 'Langkah 1: Heksadesimal ke Biner (Ekspansi 4-Bit / Nibble per Digit)',
        desc: 'Setiap 1 digit Heksadesimal (0-F) digantikan langsung dengan bentuk 4-bit binernya (2⁴ = 16):',
        intExpansions: hexIntExpansions,
        fracExpansions: hexFracExpansions,
        resultInt: binInt,
        resultFrac: binFrac
      });
    }

    const fullBinary = binFrac ? `${binInt}.${binFrac}` : binInt;

    return {
      success: true,
      base,
      originalInput: inputVal,
      binInt,
      binFrac,
      fullBinary,
      steps
    };
  }

  function convertBinaryToHex(binInt, binFrac) {
    let rawInt = binInt || '0';
    let paddedInt = rawInt;
    const intPadCount = (4 - (paddedInt.length % 4)) % 4;
    paddedInt = '0'.repeat(intPadCount) + paddedInt;

    const intGroups = [];
    for (let i = 0; i < paddedInt.length; i += 4) {
      const chunk = paddedInt.slice(i, i + 4);
      const isPadded = (i === 0 && intPadCount > 0);
      const hexDigit = BIN_TO_HEX[chunk] || '?';
      const decVal = parseInt(chunk, 2);
      intGroups.push({
        chunk,
        hexDigit,
        decVal,
        isPadded,
        padAdded: isPadded ? intPadCount : 0,
        originalBits: isPadded ? chunk.slice(intPadCount) : chunk
      });
    }

    let fracGroups = [];
    let paddedFrac = binFrac || '';
    let fracPadCount = 0;
    if (paddedFrac.length > 0) {
      fracPadCount = (4 - (paddedFrac.length % 4)) % 4;
      paddedFrac = paddedFrac + '0'.repeat(fracPadCount);

      for (let i = 0; i < paddedFrac.length; i += 4) {
        const chunk = paddedFrac.slice(i, i + 4);
        const isPadded = (i + 4 === paddedFrac.length && fracPadCount > 0);
        const hexDigit = BIN_TO_HEX[chunk] || '?';
        const decVal = parseInt(chunk, 2);
        fracGroups.push({
          chunk,
          hexDigit,
          decVal,
          isPadded,
          padAdded: isPadded ? fracPadCount : 0,
          originalBits: isPadded ? chunk.slice(0, 4 - fracPadCount) : chunk
        });
      }
    }

    const hexIntResult = intGroups.map(g => g.hexDigit).join('').replace(/^0+/, '') || '0';
    const hexFracResult = fracGroups.map(g => g.hexDigit).join('');
    const fullHex = hexFracResult ? `${hexIntResult}.${hexFracResult}` : hexIntResult;

    return {
      name: 'Heksadesimal (Basis 16)',
      groupSize: 4,
      groupLabel: 'Nibble (4 Bit)',
      intPadCount,
      fracPadCount,
      paddedInt,
      paddedFrac,
      intGroups,
      fracGroups,
      hexIntResult,
      hexFracResult,
      fullHex
    };
  }

  function convertBinaryToOctal(binInt, binFrac) {
    let rawInt = binInt || '0';
    let paddedInt = rawInt;
    const intPadCount = (3 - (paddedInt.length % 3)) % 3;
    paddedInt = '0'.repeat(intPadCount) + paddedInt;

    const intGroups = [];
    for (let i = 0; i < paddedInt.length; i += 3) {
      const chunk = paddedInt.slice(i, i + 3);
      const isPadded = (i === 0 && intPadCount > 0);
      const octDigit = BIN_TO_OCT[chunk] || '?';
      const decVal = parseInt(chunk, 2);
      intGroups.push({
        chunk,
        octDigit,
        decVal,
        isPadded,
        padAdded: isPadded ? intPadCount : 0,
        originalBits: isPadded ? chunk.slice(intPadCount) : chunk
      });
    }

    let fracGroups = [];
    let paddedFrac = binFrac || '';
    let fracPadCount = 0;
    if (paddedFrac.length > 0) {
      fracPadCount = (3 - (paddedFrac.length % 3)) % 3;
      paddedFrac = paddedFrac + '0'.repeat(fracPadCount);

      for (let i = 0; i < paddedFrac.length; i += 3) {
        const chunk = paddedFrac.slice(i, i + 3);
        const isPadded = (i + 3 === paddedFrac.length && fracPadCount > 0);
        const octDigit = BIN_TO_OCT[chunk] || '?';
        const decVal = parseInt(chunk, 2);
        fracGroups.push({
          chunk,
          octDigit,
          decVal,
          isPadded,
          padAdded: isPadded ? fracPadCount : 0,
          originalBits: isPadded ? chunk.slice(0, 3 - fracPadCount) : chunk
        });
      }
    }

    const octIntResult = intGroups.map(g => g.octDigit).join('').replace(/^0+/, '') || '0';
    const octFracResult = fracGroups.map(g => g.octDigit).join('');
    const fullOct = octFracResult ? `${octIntResult}.${octFracResult}` : octIntResult;

    return {
      name: 'Oktal (Basis 8)',
      groupSize: 3,
      groupLabel: 'Kelompok 3-Bit',
      intPadCount,
      fracPadCount,
      paddedInt,
      paddedFrac,
      intGroups,
      fracGroups,
      octIntResult,
      octFracResult,
      fullOct
    };
  }

  function convertBinaryToDecimal(binInt, binFrac) {
    const rawInt = binInt || '0';
    const rawFrac = binFrac || '';

    const intWeights = [];
    let totalInt = 0;
    const len = rawInt.length;

    for (let i = 0; i < len; i++) {
      const bit = parseInt(rawInt[i], 10);
      const power = len - 1 - i;
      const weight = Math.pow(2, power);
      const contribution = bit * weight;
      totalInt += contribution;
      intWeights.push({
        bit,
        power,
        weight,
        contribution,
        formula: `${bit} × 2^${power} = ${contribution}`
      });
    }

    const fracWeights = [];
    let totalFrac = 0;
    for (let i = 0; i < rawFrac.length; i++) {
      const bit = parseInt(rawFrac[i], 10);
      const power = -(i + 1);
      const weight = Math.pow(2, power);
      const contribution = bit * weight;
      totalFrac += contribution;
      fracWeights.push({
        bit,
        power,
        weight: Number(weight.toFixed(6)),
        contribution: Number(contribution.toFixed(6)),
        formula: `${bit} × 2^(${power}) = ${contribution.toFixed(4)}`
      });
    }

    const totalDec = Number((totalInt + totalFrac).toFixed(6));

    return {
      name: 'Desimal (Basis 10)',
      method: 'Penjumlahan Bobot Posisi Positif & Negatif (Σ bi × 2^i)',
      intWeights,
      fracWeights,
      totalInt,
      totalFrac,
      totalDec,
      activeIntBits: intWeights.filter(w => w.bit === 1),
      activeFracBits: fracWeights.filter(w => w.bit === 1)
    };
  }

  function processFullConversion(inputVal, base) {
    const central = convertToCentralBinary(inputVal, base);
    if (!central.success) return central;

    const toHex = convertBinaryToHex(central.binInt, central.binFrac);
    const toOct = convertBinaryToOctal(central.binInt, central.binFrac);
    const toDec = convertBinaryToDecimal(central.binInt, central.binFrac);

    return {
      success: true,
      central,
      toHex,
      toOct,
      toDec
    };
  }

  return {
    validateInput,
    convertToCentralBinary,
    convertBinaryToHex,
    convertBinaryToOctal,
    convertBinaryToDecimal,
    processFullConversion,
    HEX_TO_BIN,
    BIN_TO_HEX,
    OCT_TO_BIN,
    BIN_TO_OCT
  };
})();

if (typeof window !== 'undefined') {
  window.BinaryHub = BinaryHub;
}
