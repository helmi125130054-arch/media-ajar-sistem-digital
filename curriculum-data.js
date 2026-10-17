/**
 * Curriculum Data & Syllabus Structure (Minggu 1 - 14)
 * MK Sistem Digital (3 SKS)
 */

const DigitalCurriculum = {
  weeks: [
    {
      id: 1,
      title: 'Sistem Bilangan & Biner Sentral',
      subtitle: 'Konversi Bilangan Bulat & Pecahan dengan Poros Biner Sentral',
      status: 'ready',
      cpmk: 'CPMK-1: Mampu memahami prinsip sistem digital dan melakukan konversi antar sistem bilangan.',
      submenus: [
        { id: 'theory', name: 'Materi & Konsep', icon: '📖' },
        { id: 'central-hub', name: 'Metode Biner Sentral', icon: '⚡' },
        { id: 'bit-lab', name: 'Lab Sakelar Bit', icon: '🎛️' },
        { id: 'quiz', name: 'Latihan Terstruktur & Kuis', icon: '🎯' }
      ]
    },
    {
      id: 2,
      title: 'Bilangan Negatif & Aritmatika C2',
      subtitle: 'Sign-Magnitude, 1s & 2s Complement, Pengurangan & Overflow',
      status: 'ready',
      cpmk: 'CPMK-2: Mampu merepresentasikan bilangan negatif dan menghitung operasi aritmatika biner.',
      submenus: [
        { id: 'w2-interactive', name: 'Lab 2s Complement & Aritmatika', icon: '🧪' },
        { id: 'w2-theory', name: 'Teori & Catatan Slide', icon: '📚' }
      ]
    },
    {
      id: 3,
      title: 'Gerbang Logika & Aljabar Boolean',
      subtitle: "Hukum Boolean, Tabel Kebenaran, Bentuk SOP & POS",
      status: 'ready',
      cpmk: 'CPMK-3: Mampu menjelaskan dan memodelkan aljabar Boolean untuk menyederhanakan rangkaian logika kombinasi.',
      submenus: [
        { id: 'theory', name: 'Teori & Konsep', icon: '📚' },
        { id: 'lab', name: 'Simulator Interaktif', icon: '🧪' }
      ]
    },
    {
      id: 4,
      title: 'Penyederhanaan dengan Karnaugh Map',
      subtitle: "K-Map 2, 3, 4 Variabel & Don't Care",
      status: 'ready',
      cpmk: 'CPMK-3: Mampu menyederhanakan fungsi logika Boolean dengan K-Map.',
      submenus: [
        { id: 'theory', name: 'Teori & Konsep', icon: '📚' },
        { id: 'lab', name: 'Simulator Interaktif', icon: '🧪' }
      ]
    },
    {
      id: 5,
      title: 'Rangkaian Aritmatika Kombinasional',
      subtitle: "Half/Full Adder, RCA, CLA, Subtractor & Adder-Subtractor",
      status: 'ready',
      cpmk: 'CPMK-4: Mampu memahami dan merancang rangkaian adder dan subtractor.',
      submenus: [
        { id: 'theory', name: 'Teori & Konsep', icon: '📚' },
        { id: 'lab', name: 'Simulator Interaktif', icon: '🧪' }
      ]
    },
    {
      id: 6,
      title: 'Multilevel NAND/NOR & Multiplexer',
      subtitle: "Gerbang Universal, Implementasi SOP/POS, MUX 2:1, 4:1, 8:1",
      status: 'ready',
      cpmk: 'CPMK-4: Mampu mengimplementasikan rangkaian multilevel NAND/NOR dan memakai MUX.',
      submenus: [
        { id: 'theory', name: 'Teori & Konsep', icon: '📚' },
        { id: 'lab', name: 'Simulator Interaktif', icon: '🧪' }
      ]
    },
    {
      id: 7,
      title: 'Decoder, Encoder & BCD ke 7-Segment',
      subtitle: "Decoder 2:4 / 3:8, Encoder, Priority Encoder, Display 7-Segment",
      status: 'ready',
      cpmk: 'CPMK-4: Mampu merancang decoder, encoder, dan rangkaian BCD ke 7-segment.',
      submenus: [
        { id: 'theory', name: 'Teori & Konsep', icon: '📚' },
        { id: 'lab', name: 'Simulator Interaktif', icon: '🧪' }
      ]
    },
    {
      id: 8,
      title: 'Ujian Tengah Semester (UTS)',
      subtitle: 'Evaluasi Pembelajaran Paruh Pertama (Minggu 1 - 7)',
      status: 'upcoming',
      cpmk: 'Evaluasi Ketercapaian CPMK 1 s.d. CPMK 4.',
      submenus: [
        { id: 'preview', name: 'Informasi UTS & Kisi-Kisi', icon: '📝' }
      ]
    },
    {
      id: 9,
      title: 'Elemen Penyimpan: Latches & Flip-Flop',
      subtitle: 'SR Latch, D Flip-Flop, JK Flip-Flop, T Flip-Flop, Clock & Triggering',
      status: 'upcoming',
      cpmk: 'CPMK-5: Mampu memahami konsep memori bistabil dan elemen sekuensial.',
      submenus: [
        { id: 'preview', name: 'Silabus & Ringkasan Materi', icon: '📋' }
      ]
    },
    {
      id: 10,
      title: 'Register & Shift Registers',
      subtitle: 'Serial-In/Serial-Out (SISO), SIPO, PISO, PIPO & Universal Shift Register',
      status: 'upcoming',
      cpmk: 'CPMK-5: Mampu menganalisis dan merancang register penyimpanan data.',
      submenus: [
        { id: 'preview', name: 'Silabus & Ringkasan Materi', icon: '📋' }
      ]
    },
    {
      id: 11,
      title: 'Pencacah Digital (Counters)',
      subtitle: 'Asynchronous Ripple Counter, Synchronous Up/Down Counter, Modulo-N',
      status: 'upcoming',
      cpmk: 'CPMK-6: Mampu merancang counter digital sinkron dan asinkron.',
      submenus: [
        { id: 'preview', name: 'Silabus & Ringkasan Materi', icon: '📋' }
      ]
    },
    {
      id: 12,
      title: 'Finite State Machine (FSM)',
      subtitle: 'Model Mealy vs Moore, State Diagram, State Table & State Assignment',
      status: 'upcoming',
      cpmk: 'CPMK-6: Mampu merancang pengendali digital sekuensial berbasis FSM.',
      submenus: [
        { id: 'preview', name: 'Silabus & Ringkasan Materi', icon: '📋' }
      ]
    },
    {
      id: 13,
      title: 'Memori Digital & FPGA/CPLD',
      subtitle: 'SRAM, DRAM, ROM, Flash Memory, Arsitektur PLD, CPLD, dan FPGA',
      status: 'upcoming',
      cpmk: 'CPMK-7: Mampu mengidentifikasi hierarki memori dan teknologi logic terprogram.',
      submenus: [
        { id: 'preview', name: 'Silabus & Ringkasan Materi', icon: '📋' }
      ]
    },
    {
      id: 14,
      title: 'Hardware Description Language & Review UAS',
      subtitle: 'Pengenalan VHDL & Verilog, Sintesis Sirkuit, dan Review Akhir Semester',
      status: 'upcoming',
      cpmk: 'CPMK-7: Mampu memahami dasar pemodelan perangkat keras dengan HDL.',
      submenus: [
        { id: 'preview', name: 'Silabus & Ringkasan Materi', icon: '📋' }
      ]
    }
  ]
};

if (typeof window !== 'undefined') {
  window.DigitalCurriculum = DigitalCurriculum;
}
