
import React from 'react';
import { 
  Scale, 
  Plane, 
  Building2, 
  Utensils, 
  Laptop, 
  CheckCircle2,
  Briefcase,
  Award,
  Globe,
  MoreHorizontal
} from 'lucide-react';
import { ServiceItem, FeatureItem, NavItem } from './types';

// =================================================================
// DATA HARGA & LAYANAN UNTUK FORM ORDER (SESUAI GAMBAR)
// =================================================================
export const ORDER_PRICING_LIST = [
  {
    category: "Pendirian Perusahaan",
    items: [
      { name: "Pendirian Yayasan", price: "4.000.000" },
      { name: "Pendirian PT", price: "6.900.000" },
      { name: "Pendirian PT. Perorangan", price: "850.000" },
      { name: "Pendirian CV", price: "3.500.000" },
      { name: "Pendirian PMA", price: "8.500.000" },
      { name: "Pendirian Koperasi", price: "5.500.000" },
      { name: "Pendirian Perkumpulan", price: "4.500.000" },
      { name: "Update / Pengurusan NIB", price: "1.000.000" }
    ]
  },
  {
    category: "Legalitas Khusus (Izin & Sertifikasi)",
    items: [
      { name: "Perizinan Umrah (PPIU)", price: "95.000.000" },
      { name: "Perizinan Haji Khusus (PIHK)", price: "110.000.000" },
      { name: "Perizinan Biro Perjalanan Wisata (BPW)", price: "5.000.000" },
      { name: "Sertifikat ISO (International Organization for Standardization)", price: "17.500.000" },
      { name: "Sertifikat IATA (International Air Transport Association)", price: "75.000.000" },
      { name: "HAKI (Hak Atas Kekayaan Intelektual)", price: "5.500.000" },
      { name: "Bank Garansi (BG)", price: "18.900.000" },
      { name: "Audit Laporan Keuangan KAP", price: "17.500.000" },
      { name: "Provider Visa", price: "27.000.000" },
      { name: "Sertifikat Asosiasi Lainnya", price: "4.000.000" },
      { name: "Sertifikasi Tour Leader (TL) & Tour Guide (TG)", price: "2.800.000" },
      { name: "Akreditasi / Sertifikasi", price: "17.900.000" },
      { name: "Konsultasi / Jasa Perpajakan", price: "Menyesuaikan" },
      { name: "Pengurusan Visa", price: "Menyesuaikan" },
      { name: "Pengurusan Paspor", price: "Menyesuaikan" }
    ]
  },
  {
    category: "Legalitas Produk & Lainnya",
    items: [
      { name: "Sertifikat SNI", price: "15.000.000" },
      { name: "Perizinan BPOM", price: "5.000.000" },
      { name: "Sertifikat Halal", price: "2.500.000" },
      { name: "Desain Kemasan / Packing Merek", price: "350.000" },
      { name: "Perizinan Catering", price: "4.500.000" },
      { name: "SIPA (Izin Pemanfaatan Air)", price: "Menyesuaikan" },
      { name: "Perizinan Export Import", price: "Menyesuaikan" }
    ]
  }
];

// =================================================================
// AREA EDIT: MENU NAVIGASI
// =================================================================
export const NAV_LINKS: NavItem[] = [
  { label: 'Beranda', href: '#hero' },
  { label: 'Layanan', href: '#services' },
  { label: 'Keunggulan', href: '#why-us' },
  { label: 'Kontak', href: '#footer' },
];

// =================================================================
// AREA EDIT: DAFTAR LAYANAN (LANDING PAGE)
// =================================================================
export const SERVICES: ServiceItem[] = [
  {
    id: 'legal',
    title: 'Legalitas & Perizinan',
    description: 'Pendirian PT, CV, Yayasan, ISO, hingga KAN-SNI. Proses cepat, transparan, dan sesuai regulasi terkini.',
    icon: <Scale className="w-8 h-8 text-yellow-400" />,
    details: [
        "Pendirian PT, CV, & Yayasan",
        "Pengurusan NIB & OSS RBA",
        "Pendaftaran HAKI (Merek & Paten)",
        "Izin Lingkungan (AMDAL/UKL-UPL)",
        "Sertifikasi ISO & KAN-SNI"
    ]
  },
  {
    id: 'travel',
    title: 'Travel Haji & Umroh',
    description: 'Perjalanan ibadah yang amanah dengan fasilitas premium dan pembimbing berpengalaman.',
    icon: <Plane className="w-8 h-8 text-yellow-400" />,
    details: [
        "Paket Umroh Reguler & VIP",
        "Haji Furoda (Tanpa Antri)",
        "Wisata Halal Internasional",
        "Handling Bandara & Visa",
        "Perlengkapan Ibadah Premium"
    ]
  },
  {
    id: 'property',
    title: 'Properti & Konstruksi',
    description: 'Jasa kontraktor, desain arsitektur, hingga jual beli aset properti residensial dan komersial.',
    icon: <Building2 className="w-8 h-8 text-yellow-400" />,
    details: [
        "Jasa Kontraktor Bangun Baru",
        "Renovasi Rumah & Kantor",
        "Desain Arsitektur & Interior",
        "Jual Beli Aset Properti",
        "Pengurusan IMB / PBG"
    ]
  },
  {
    id: 'fnb',
    title: 'Food & Beverage',
    description: 'Konsultasi bisnis kuliner, pengurusan Izin Edar BPOM, Halal MUI, dan manajemen franchise.',
    icon: <Utensils className="w-8 h-8 text-yellow-400" />,
    details: [
        "Konsultasi Bisnis Kuliner",
        "Pengurusan Izin Edar BPOM",
        "Sertifikasi Halal MUI",
        "Manajemen Franchise",
        "Supply Chain Bahan Baku"
    ]
  },
  {
    id: 'digital',
    title: 'Digital Agency',
    description: 'Pembuatan Website, Aplikasi Mobile, SEO, dan Digital Marketing untuk akselerasi bisnis era 4.0.',
    icon: <Laptop className="w-8 h-8 text-yellow-400" />,
    details: [
        "Pembuatan Website Company Profile",
        "Aplikasi Android & iOS",
        "SEO & Digital Marketing",
        "Social Media Management",
        "Branding & Logo Design"
    ]
  },
  {
    id: 'others',
    title: 'LAIN-LAIN',
    description: 'Layanan pendukung bisnis lainnya yang fleksibel dan dapat disesuaikan dengan kebutuhan spesifik Anda.',
    icon: <MoreHorizontal className="w-8 h-8 text-yellow-400" />,
    details: [
        "Konsultasi Umum",
        "Pengurusan Dokumen Lainnya",
        "Layanan Kustom",
        "Kerjasama Strategis",
        "Bantuan Teknis"
    ]
  },
];

// =================================================================
// AREA EDIT: DAFTAR KEUNGGULAN (WHY US)
// =================================================================
export const FEATURES: FeatureItem[] = [
  {
    id: 'f1',
    title: 'Terintegrasi Penuh',
    description: 'Satu ekosistem untuk menyelesaikan berbagai masalah bisnis tanpa perlu berpindah vendor.'
  },
  {
    id: 'f2',
    title: 'Profesional & Berpengalaman',
    description: 'Didukung oleh tim ahli tersertifikasi di bidang hukum, properti, dan teknologi.'
  },
  {
    id: 'f3',
    title: 'Layanan Prioritas',
    description: 'Kami menempatkan kepuasan klien sebagai prioritas utama dengan layanan responsif 24/7.'
  }
];

// =================================================================
// AREA EDIT: TESTIMONI CUSTOMER
// =================================================================
export const TESTIMONIALS = [
  {
    id: 't1',
    name: "Budi Santoso",
    role: "CEO PT. Maju Jaya Abadi",
    content: "Pelayanan sangat profesional dan cepat. Pengurusan legalitas perusahaan kami selesai tepat waktu tanpa kendala. Sangat direkomendasikan untuk pengusaha baru.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80"
  },
  {
    id: 't2',
    name: "Siti Aminah",
    role: "Owner Catering Berkah",
    content: "Sangat terbantu dengan jasa pengurusan sertifikat halal dan BPOM. Tim Unity Group sangat responsif dan edukatif dalam membimbing kami.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80"
  },
  {
    id: 't3',
    name: "Andi Pratama",
    role: "Founder Tech Startups",
    content: "Solusi one-stop service yang luar biasa. Mulai dari pendirian PT hingga pembuatan website company profile, semuanya ditangani dengan sangat baik.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80"
  },
  {
    id: 't4',
    name: "Dewi Lestari",
    role: "Travel Enthusiast",
    content: "Perjalanan umroh bersama Unity Group sangat berkesan. Fasilitas premium dan pembimbing yang sangat mengayomi jamaah. Insya Allah berangkat lagi tahun depan.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80"
  },
  {
    id: 't5',
    name: "Rahmat Hidayat",
    role: "Direktur CV. Bangun Persada",
    content: "Proses perizinan konstruksi dan SBU berjalan lancar berkat bantuan tim legal Unity Group. Hemat waktu dan biaya.",
    rating: 4,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
  }
];
