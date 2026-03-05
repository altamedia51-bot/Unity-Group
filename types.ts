
import { ReactNode } from 'react';

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon?: ReactNode; // Icon dibuat optional karena sulit diserialize
  iconName?: string; // Untuk referensi icon di CMS
  details?: string[]; // Array string untuk rincian layanan (fitur Selengkapnya)
}

export interface FeatureItem {
  id: string;
  title: string;
  description: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  image: string;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface UserProfile {
    uid: string;
    displayName: string;
    email: string;
    role?: 'user' | 'admin';
    phoneNumber?: string;
    referralCode?: string;
}

export interface Order {
    id: string;
    serviceName: string;
    date: string;
    status: 'Pending' | 'Proses' | 'Selesai' | 'Batal';
    price: string;
    rawPrice?: number; 
    attachmentUrl?: string; // URL File Dokumen Pendukung
}

export interface ProjectStep {
    name: string;
    status: 'pending' | 'active' | 'completed';
    timestamp?: string;
}

export interface Project {
    id: string;
    userId: string;
    userName: string;
    projectName: string;
    currentStep: number;
    steps: ProjectStep[];
    lastUpdated: string;
}

// Tipe data untuk item Dokumentasi
export interface DocumentationItem {
    imageUrl: string;
    caption: string;
    category: 'handover' | 'partnership'; // Penyerahan Ijin atau Kemitraan
}

// Tipe data baru untuk Website Content
export interface WebsiteContent {
    // Global Settings
    logoUrl: string; // URL Logo Website
    footerBrandImage?: string; // Gambar pengganti teks "UNITY GROUP" di footer
    footerDescription: string; // Deskripsi singkat perusahaan di Footer

    hero: {
        tagline: string;
        headline: string;
        subheadline: string;
        description: string;
        bannerImage: string; 
    };
    seasonal: {
        isEnabled: boolean; 
        title: string; // Judul umum untuk section ini (misal: "Promo Terbaru")
        images: string[]; // Array string untuk menampung banyak URL foto
    };
    whyUs: {
        images: string[]; 
    };
    documentation: {
        title: string;
        subtitle: string;
        items: DocumentationItem[];
    };
    contact: {
        address: string;
        email: string;
        phone: string;
        contactImage?: string; // Foto Kantor / Gedung di Footer
        contactImage2?: string; // Foto Tambahan di Footer
    };
    testimonials: TestimonialItem[];
    // Update: Tambahan Social Media
    socialMedia: {
        instagram: string;
        facebook: string;
        linkedin: string;
        twitter: string;
        whatsapp: string; // Nomor WA untuk floating button
    };
    services: ServiceItem[];
}
