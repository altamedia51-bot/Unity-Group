import { ReactNode } from 'react';

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: ReactNode;
}

export interface FeatureItem {
  id: string;
  title: string;
  description: string;
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
    // Helper property to store numeric value for calculation
    rawPrice?: number; 
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