import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { WebsiteContent, Project, ProjectStep } from '../types';
import { SERVICES, TESTIMONIALS } from '../constants';
import { db } from '../firebase';
import { 
    doc, 
    onSnapshot, 
    updateDoc, 
    increment, 
    setDoc, 
    deleteDoc, 
    collection, 
    query, 
    where,
    getDocs
} from 'firebase/firestore';

const defaultContent: WebsiteContent = {
    logoUrl: "https://placehold.co/100x100/EAB308/000000?text=U&font=montserrat", 
    footerBrandImage: "", // Default kosong, akan menampilkan teks "UNITY GROUP"
    footerDescription: "Mitra terpercaya untuk solusi bisnis terintegrasi. Menghubungkan visi Anda dengan realitas kesuksesan melalui layanan profesional kelas dunia.",
    hero: {
        tagline: "🚀 Solusi Bisnis Terintegrasi No. 1",
        headline: "Mitra Strategis Masa Depan Bisnis Anda",
        subheadline: "Masa Depan Bisnis Anda",
        description: "Unity Group menghadirkan solusi terintegrasi: Legalitas, Properti, Travel, hingga Digital. Satu pintu untuk akselerasi pertumbuhan bisnis Anda.",
        bannerImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
    },
    seasonal: {
        isEnabled: true, 
        title: "Penawaran Spesial & Informasi Terkini",
        images: [
            "https://images.unsplash.com/photo-1613936361303-1cb0279a7384?q=80&w=1470&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1470&q=80"
        ]
    },
    whyUs: {
        images: [
            "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=400&q=80"
        ]
    },
    documentation: {
        title: "Bukti Nyata & Kemitraan",
        subtitle: "Dokumentasi penyerahan legalitas dan momen kebersamaan dengan mitra strategis kami.",
        items: [
            {
                imageUrl: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80",
                caption: "Penyerahan Dokumen PT. Maju Bersama",
                category: "handover"
            },
            {
                imageUrl: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=800&q=80",
                caption: "Meeting Kemitraan dengan Vendor Properti",
                category: "partnership"
            }
        ]
    },
    testimonials: TESTIMONIALS,
    contact: {
        address: "Jl. Jendral Sudirman Kav. 52-53, SCBD, Jakarta Selatan",
        email: "info@unitygroup.id",
        phone: "+62 21 5555 8888",
        contactImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
        contactImage2: "" 
    },
    socialMedia: {
        instagram: "https://instagram.com",
        facebook: "https://facebook.com",
        linkedin: "https://linkedin.com",
        twitter: "https://twitter.com",
        whatsapp: "6281234567890"
    },
    services: SERVICES.map(s => {
        const { icon, ...rest } = s;
        return { ...rest, iconName: 'default' };
    })
};

const INITIAL_PROJECTS: Project[] = [
    {
        id: 'PRJ-2023-001',
        userId: 'USR-123', 
        userName: 'John Doe',
        projectName: 'Pendirian PT Perorangan',
        currentStep: 2,
        lastUpdated: '2023-10-25 14:30',
        steps: [
            { name: 'Pemberkasan Dokumen', status: 'completed', timestamp: '20 Okt 10:00' },
            { name: 'Validasi Admin', status: 'completed', timestamp: '21 Okt 09:30' },
            { name: 'Proses Akta Notaris', status: 'active', timestamp: 'Sedang Berjalan' },
            { name: 'SK Kemenkumham Terbit', status: 'pending' },
            { name: 'Penyerahan Berkas', status: 'pending' },
        ]
    }
];

interface ContentContextType {
    content: WebsiteContent;
    updateContent: (newContent: WebsiteContent) => void;
    projects: Project[];
    updateProjectStep: (projectId: string, stepIndex: number) => void;
    isLoading: boolean;
    visitorCount: number;
    onlineCount: number; // Jumlah user online saat ini
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [content, setContent] = useState<WebsiteContent>(defaultContent);
    const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
    const [isLoading, setIsLoading] = useState(true);
    const [visitorCount, setVisitorCount] = useState(0);
    const [onlineCount, setOnlineCount] = useState(1); // Default minimal 1 (kita sendiri)

    // MENGAMBIL DATA DARI FIREBASE SAAT WEBSITE DIBUKA
    useEffect(() => {
        // Safety timeout: Hapus loader setelah 3 detik jika Firebase lambat/gagal
        const safetyTimeout = setTimeout(() => {
            console.warn("Firebase timeout: Forcing loader removal");
            setIsLoading(false);
            const loader = document.getElementById('initial-loader');
            if (loader) loader.style.display = 'none';
        }, 3000);

        // 1. Ambil Konten Website
        const unsubscribe = onSnapshot(doc(db, "settings", "content"), (docSnap) => {
            clearTimeout(safetyTimeout); // Clear timeout jika data berhasil dimuat
            if (docSnap.exists()) {
                const data = docSnap.data() as WebsiteContent;
                
                // --- MERGE LOGIC START ---
                // Pastikan layanan 'others' (LAIN-LAIN) tetap muncul meskipun database lama belum punya
                const hasOthers = data.services.some(s => s.id === 'others');
                if (!hasOthers) {
                    const othersService = SERVICES.find(s => s.id === 'others');
                    if (othersService) {
                        // Hapus icon object karena tidak bisa disimpan di Firestore, ganti dengan iconName
                        const { icon, ...rest } = othersService;
                        data.services.push({ ...rest, iconName: 'others' });
                    }
                }

                // Pastikan testimonials ada (untuk backward compatibility)
                if (!data.testimonials) {
                    data.testimonials = TESTIMONIALS;
                }
                // --- MERGE LOGIC END ---

                setContent(data);
            } else {
                console.log("Database kosong, menggunakan data default.");
            }
            setIsLoading(false);
            const loader = document.getElementById('initial-loader');
            if (loader) loader.style.display = 'none';
        }, (error) => {
            clearTimeout(safetyTimeout);
            console.error("Gagal mengambil data dari Firebase:", error);
            setIsLoading(false);
            const loader = document.getElementById('initial-loader');
            if (loader) loader.style.display = 'none';
        });

        // 2. Logika Total Visitor (Seumur Hidup)
        const statsRef = doc(db, "stats", "website");
        const unsubscribeStats = onSnapshot(statsRef, (snapshot) => {
            if (snapshot.exists()) {
                setVisitorCount(snapshot.data().visits || 0);
            }
        });

        const initCounter = async () => {
             const visited = sessionStorage.getItem("unity_visited");
             if (!visited) {
                 try {
                     await updateDoc(statsRef, { visits: increment(1) });
                     sessionStorage.setItem("unity_visited", "true");
                 } catch (e: any) {
                     if (e.code === 'not-found' || e.message.includes('No document to update')) {
                         await setDoc(statsRef, { visits: 1 });
                         sessionStorage.setItem("unity_visited", "true");
                     }
                 }
             }
        };
        initCounter();

        // 3. Logika Online Visitors (Real-time Heartbeat)
        // Kita membuat ID sesi acak untuk tab browser ini
        let sessionId = sessionStorage.getItem("unity_session_id");
        if (!sessionId) {
            sessionId = Math.random().toString(36).substring(2) + Date.now().toString(36);
            sessionStorage.setItem("unity_session_id", sessionId);
        }

        const onlineUserRef = doc(db, "active_sessions", sessionId);

        // Fungsi untuk mengirim sinyal "Saya Aktif"
        const sendHeartbeat = async () => {
            try {
                // Tulis timestamp saat ini
                await setDoc(onlineUserRef, { 
                    last_seen: Date.now(),
                    device: navigator.userAgent // Opsional: info device
                });
            } catch (err) {
                console.error("Heartbeat error", err);
            }
        };

        // Kirim heartbeat pertama kali
        sendHeartbeat();

        // Kirim heartbeat setiap 30 detik agar tetap dianggap online
        const heartbeatInterval = setInterval(sendHeartbeat, 30000);

        // Listener untuk menghitung berapa orang yang online
        // Kita ambil data sesi yang aktif dalam 2 menit terakhir
        // Catatan: Query 'where' timestamp membutuhkan waktu server sinkron, 
        // untuk simplifikasi di frontend kita ambil snapshot dan filter manual atau gunakan query.
        
        // Kita gunakan query sederhana. Jika error index muncul di console, 
        // klik link di console untuk membuat index di Firebase.
        const q = query(
            collection(db, "active_sessions"), 
            where("last_seen", ">", Date.now() - 120000) // 2 menit terakhir
        );

        const unsubscribeOnline = onSnapshot(collection(db, "active_sessions"), (snapshot) => {
            // Filter manual di sisi klien untuk akurasi tanpa index complex
            // Hitung dokumen yang last_seen-nya < 2 menit yang lalu
            const twoMinutesAgo = Date.now() - 120000; 
            const activeDocs = snapshot.docs.filter(doc => {
                const data = doc.data();
                return data.last_seen > twoMinutesAgo;
            });
            
            // Set jumlah online (Minimal 1 yaitu user sendiri)
            setOnlineCount(Math.max(1, activeDocs.length));
        });

        // Cleanup saat user menutup tab
        const handleUnload = () => {
             // Cobalah menghapus sesi (best effort)
             deleteDoc(onlineUserRef);
        };
        window.addEventListener("beforeunload", handleUnload);

        return () => {
            unsubscribe();
            unsubscribeStats();
            unsubscribeOnline();
            clearInterval(heartbeatInterval);
            window.removeEventListener("beforeunload", handleUnload);
            // Hapus sesi kita dari database saat komponen unmount/halaman tutup
            deleteDoc(onlineUserRef).catch(() => {});
        };
    }, []);

    const updateContent = (newContent: WebsiteContent) => {
        setContent(newContent);
    };

    const updateProjectStep = (projectId: string, stepIndex: number) => {
        setProjects(prevProjects => prevProjects.map(p => {
            if (p.id === projectId) {
                const newSteps = [...p.steps];
                const currentStatus = newSteps[stepIndex].status;
                
                let nextStatus: ProjectStep['status'] = 'pending';
                if (currentStatus === 'pending') nextStatus = 'active';
                else if (currentStatus === 'active') nextStatus = 'completed';
                
                newSteps[stepIndex] = {
                    ...newSteps[stepIndex],
                    status: nextStatus,
                    timestamp: nextStatus === 'completed' ? new Date().toLocaleString('id-ID', {day: '2-digit', month: 'short', hour:'2-digit', minute:'2-digit'}) : newSteps[stepIndex].timestamp
                };

                return { ...p, steps: newSteps, lastUpdated: new Date().toLocaleString() };
            }
            return p;
        }));
    };

    return (
        <ContentContext.Provider value={{ content, updateContent, projects, updateProjectStep, isLoading, visitorCount, onlineCount }}>
            {children}
        </ContentContext.Provider>
    );
};

export const useContent = () => {
    const context = useContext(ContentContext);
    if (!context) {
        throw new Error('useContent must be used within a ContentProvider');
    }
    return context;
};