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
  Globe
} from 'lucide-react';
import { ServiceItem, FeatureItem, NavItem } from './types';

export const NAV_LINKS: NavItem[] = [
  { label: 'Beranda', href: '#hero' },
  { label: 'Layanan', href: '#services' },
  { label: 'Keunggulan', href: '#why-us' },
  { label: 'Kontak', href: '#footer' },
];

export const SERVICES: ServiceItem[] = [
  {
    id: 'legal',
    title: 'Legalitas & Perizinan',
    description: 'Pendirian PT, CV, Yayasan, ISO, hingga KAN-SNI. Proses cepat, transparan, dan sesuai regulasi terkini.',
    icon: <Scale className="w-8 h-8 text-yellow-400" />
  },
  {
    id: 'travel',
    title: 'Travel Haji & Umroh',
    description: 'Perjalanan ibadah yang amanah dengan fasilitas premium dan pembimbing berpengalaman.',
    icon: <Plane className="w-8 h-8 text-yellow-400" />
  },
  {
    id: 'property',
    title: 'Properti & Konstruksi',
    description: 'Jasa kontraktor, desain arsitektur, hingga jual beli aset properti residensial dan komersial.',
    icon: <Building2 className="w-8 h-8 text-yellow-400" />
  },
  {
    id: 'fnb',
    title: 'Food & Beverage',
    description: 'Konsultasi bisnis kuliner, pengurusan Izin Edar BPOM, Halal MUI, dan manajemen franchise.',
    icon: <Utensils className="w-8 h-8 text-yellow-400" />
  },
  {
    id: 'digital',
    title: 'Digital Agency',
    description: 'Pembuatan Website, Aplikasi Mobile, SEO, dan Digital Marketing untuk akselerasi bisnis era 4.0.',
    icon: <Laptop className="w-8 h-8 text-yellow-400" />
  },
];

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