import type { Dictionary } from "./en";

// Bahasa Indonesia. Typed as Dictionary so any key missing here (or renamed in
// en.ts) is a compile error.
const id: Dictionary = {
  brand: {
    name: "Compound",
    logoAlt: "Logo Compound",
  },
  nav: {
    roadmaps: "Roadmap",
    searchPlaceholder: "Cari roadmap…",
    searchLabel: "Cari roadmap",
    clearSearch: "Hapus pencarian",
    noMatch: (q: string) => `Tidak ada roadmap yang cocok dengan “${q}”.`,
    resultCount: (n: number) => `${n} hasil`,
    planned: "Direncanakan",
    streakTitle: (n: number) => `Rentetan belajar ${n} hari`,
    streakLabel: (n: number) => `Rentetan ${n} hari`,
  },
  home: {
    eyebrow: "Belajar mandiri · progres tersimpan di perangkat ini",
    titleLead: "Kuasai satu keterampilan tahan lama setiap kali, dan biarkan ia",
    titleEmphasis: "berlipat ganda",
    subtitle:
      "Roadmap terstruktur yang mengingat di mana Anda berhenti. Centang sebuah tugas, lihat jalurnya terisi, dan raih setiap tonggak. Tanpa login, tanpa akun — perjalanan Anda tersimpan di peramban.",
    statRoadmaps: "Roadmap tersedia",
    statTasks: "Tugas terlacak",
    statPlanned: "Sedang disiapkan",
    footerNote:
      "Compound — pelacak belajar terbuka. Hanya untuk edukasi, bukan nasihat keuangan.",
    footerStorage: "Progres tersimpan di localStorage",
  },
  dashboard: {
    all: "Semua",
    showing: (n: number) => `Menampilkan ${n} roadmap`,
    emptyTitle: "Belum ada roadmap di sini",
    emptyBody: "Kategori ini kosong. Atur ulang untuk melihat semua roadmap.",
    showAll: "Tampilkan semua roadmap",
    live: (n: number) => `${n} tersedia`,
  },
  card: {
    planned: "Direncanakan",
    notPublished: "Belum dipublikasikan",
    completed: "Selesai",
    inProgress: "Sedang berjalan",
    startHere: "Mulai di sini",
    continue: "Lanjutkan",
    begin: "Mulai roadmap",
    stages: (n: number) => `${n} tahap`,
  },
  momentum: {
    streakHeading: (n: number) => `🔥 Rentetan ${n} hari`,
    streakFirst: "Anda kembali — pertahankan lagi besok.",
    streakBest: (n: number) => `Terbaik sejauh ini: ${n} hari. Teruskan.`,
    streakRecord: "Ini rentetan terbaik Anda. Jangan sampai putus.",
    pickUp: "Lanjutkan dari tempat Anda berhenti",
    stageLabel: (n: string, title: string) => `Tahap ${n}: ${title}`,
  },
  roadmap: {
    back: "Semua roadmap",
    yourProgress: "Progres Anda",
    tasksOf: (done: number, total: number) => `${done} / ${total} tugas`,
    tasksTotal: (total: number) => `${total} tugas`,
    reset: "Atur ulang",
    resetConfirm:
      "Atur ulang semua progres untuk roadmap ini? Tindakan ini menghapus centang tersimpan di perangkat ini.",
    progressReset: "Progres diatur ulang",
    complete: "Roadmap selesai — Anda telah membangun keterampilan utuh.",
    stageTasks: (done: number, total: number) => `${done}/${total}`,
    stageTasksTotal: (total: number) => `${total} tugas`,
    objectives: "Yang akan Anda kuasai",
    mistakes: "Kesalahan yang harus dihindari",
    caseStudies: "Studi kasus",
    stageComplete: (title: string) => `Tahap selesai — ${title}`,
    roadmapCompleteTitle: "Roadmap selesai",
    roadmapCompleteMessage: (title: string, outcome: string) =>
      `Anda menyelesaikan ${title}. ${outcome}`,
    markDone: (title: string) => `Tandai "${title}" selesai`,
    markNotDone: (title: string) => `Tandai "${title}" belum selesai`,
  },
  taskTypes: {
    reading: "Bacaan",
    exercise: "Latihan",
    project: "Tonggak",
    concept: "Konsep",
  },
  taskSheet: {
    whatYouGain: "Yang Anda dapatkan",
    whatToDo: "Yang harus dilakukan",
    checklist: "Daftar periksa",
    resources: "Sumber daya",
    markComplete: "Tandai selesai",
    markNotDone: "Tandai belum selesai",
  },
  celebration: {
    keepGoing: "Lanjutkan",
    close: "Tutup",
  },
  notFound: {
    title: "Roadmap ini belum ada di sini",
    body: "Roadmap yang Anda cari belum dipublikasikan. Jelajahi roadmap yang sudah siap dimulai.",
    back: "Kembali ke semua roadmap",
  },
  offline: {
    title: "Anda sedang luring",
    body: "Halaman ini belum disimpan untuk penggunaan luring. Sambungkan kembali untuk memuatnya, atau kembali ke roadmap yang sudah pernah Anda buka.",
    back: "Kembali ke semua roadmap",
  },
  languageSwitcher: {
    label: "Ganti bahasa",
  },
  catalog: {
    categories: {
      Finance: {
        name: "Keuangan",
        blurb: "Uang, pasar, dan permainan panjang penggandaan.",
      },
      Programming: {
        name: "Pemrograman",
        blurb: "Algoritma, struktur data, dan seni memecahkan masalah.",
      },
      Development: {
        name: "Pengembangan",
        blurb: "Bangun perangkat lunak yang tahan lama, dari dasar.",
      },
      Design: {
        name: "Desain",
        blurb: "Ciptakan hal yang dipahami dan ingin digunakan orang.",
      },
    },
    planned: {
      "value-investing": {
        title: "Dasar-Dasar Value Investing",
        tagline:
          "Margin keamanan, nilai intrinsik, dan temperamen kontrarian.",
      },
      "frontend-engineering": {
        title: "Rekayasa Frontend",
        tagline:
          "HTML, CSS, JavaScript, dan framework modern dari prinsip dasar.",
      },
      "backend-engineering": {
        title: "Rekayasa Backend",
        tagline: "API, basis data, dan sistem yang tetap andal di bawah beban.",
      },
      "product-design": {
        title: "Desain Produk",
        tagline: "Riset, interaksi, dan kerajinan visual untuk produk nyata.",
      },
    },
  },
};

export default id;
