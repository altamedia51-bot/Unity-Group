
import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Activity, 
  LogOut, 
  Plus,
  Layout,
  Save,
  Monitor,
  Image as ImageIcon,
  CheckCircle2,
  Clock,
  Circle,
  Briefcase,
  Calendar,
  Camera,
  Trash2,
  Share2,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  MessageCircle,
  Globe,
  MapPin,
  Mail,
  Phone,
  Search,
  MoreVertical,
  Shield,
  User as UserIcon,
  Filter,
  ShoppingCart,
  AlertCircle,
  Edit,
  FileText,
  Download,
  Eye,
  X,
  CreditCard,
  RefreshCw,
  Building,
  Landmark
} from 'lucide-react';
import { Button } from './Button';
import { useContent } from '../contexts/ContentContext';
import { TestimonialItem } from '../types';
import { SERVICES, TESTIMONIALS } from '../constants';
import { db } from '../firebase';
import { doc, setDoc, collection, getDocs, updateDoc, deleteDoc, query, orderBy, onSnapshot, addDoc, serverTimestamp, where } from 'firebase/firestore';

interface AdminDashboardProps {
    onLogout: () => void;
}

interface FirestoreUser {
    id: string;
    uid: string;
    displayName: string;
    email: string;
    role: 'user' | 'admin';
    phoneNumber?: string;
    createdAt?: any;
    // Extended Fields
    company?: string;
    address?: string;
    jobTitle?: string;
    bankName?: string;
    bankNumber?: string;
    bankHolder?: string;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
    // AMBIL isLoading DARI CONTEXT UNTUK MENCEGAH RENDER SEBELUM DATA SIAP
    const { content, updateContent, projects, updateProjectStep, isLoading } = useContent();
    
    const [activeTab, setActiveTab] = useState<'users' | 'projects' | 'cms' | 'orders'>('orders');
    
    const [editorState, setEditorState] = useState(content);
    const [isSaving, setIsSaving] = useState(false);

    // --- USER MANAGEMENT STATES ---
    const [usersList, setUsersList] = useState<FirestoreUser[]>([]);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'user'>('all');
    const [selectedUser, setSelectedUser] = useState<FirestoreUser | null>(null); // For Role Edit
    const [viewUserDetail, setViewUserDetail] = useState<FirestoreUser | null>(null); // For Full Profile View

    // --- ORDER MANAGEMENT STATES ---
    const [ordersList, setOrdersList] = useState<any[]>([]);
    const [loadingOrders, setLoadingOrders] = useState(false);
    const [processingOrderId, setProcessingOrderId] = useState<string | null>(null);
    const [viewOrder, setViewOrder] = useState<any | null>(null); 
    
    // Optimistic UI state
    const [localStatusOverrides, setLocalStatusOverrides] = useState<Record<string, string>>({});

    const [zoomedImage, setZoomedImage] = useState<string | null>(null);

    // --- PROJECT MANAGEMENT STATES ---
    const [realtimeProjects, setRealtimeProjects] = useState<any[]>([]);

    // --- PERBAIKAN PENTING: SYNC EDITOR DENGAN DATABASE ---
    // Hanya update state jika content sudah siap (tidak loading)
    useEffect(() => {
        if (!isLoading && content) {
            setEditorState(content);
        }
    }, [content, isLoading]);

    // --- HELPER FUNCTION UNTUK DETEKSI LINK RUSAK ---
    const isCorruptLink = (url: string) => {
        if (!url) return true;
        if (url.includes('WhatsApp')) return false;
        return url.includes('placeholder.com') || url.includes('via.placeholder');
    };

    // --- EFFECT: FETCH DATA WHEN TAB CHANGES ---
    useEffect(() => {
        let unsubscribeOrders = () => {};
        let unsubscribeProjects = () => {};

        if (activeTab === 'users') {
            fetchUsers();
        } else if (activeTab === 'orders') {
            setLoadingOrders(true);
            const ordersRef = collection(db, "orders");
            
            try {
                const q = query(ordersRef); 
                
                unsubscribeOrders = onSnapshot(q, (snapshot) => {
                    const fetched: any[] = [];
                    snapshot.forEach((doc) => {
                        fetched.push({ id: doc.id, ...doc.data() });
                    });
                    
                    fetched.sort((a, b) => {
                         const dateA = a.createdAt?.seconds || 0;
                         const dateB = b.createdAt?.seconds || 0;
                         return dateB - dateA;
                    });
                    
                    setOrdersList(fetched);
                    setLoadingOrders(false);
                }, (error) => {
                    console.warn("Realtime updates failed:", error);
                    setLoadingOrders(false);
                });
            } catch (err) {
                console.error("Query error", err);
                setLoadingOrders(false);
            }
        } else if (activeTab === 'projects') {
            const projectsRef = collection(db, "projects");
            unsubscribeProjects = onSnapshot(query(projectsRef), (snapshot) => {
                const fetched: any[] = [];
                snapshot.forEach((doc) => {
                    fetched.push({ id: doc.id, ...doc.data() });
                });
                setRealtimeProjects(fetched);
            });
        }
        
        return () => {
            unsubscribeOrders();
            unsubscribeProjects();
        };
    }, [activeTab]);

    const fetchUsers = async (isManualRefresh = false) => {
        setLoadingUsers(true);
        try {
            const usersRef = collection(db, "users");
            const querySnapshot = await getDocs(usersRef);
            
            const fetchedUsers: FirestoreUser[] = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                fetchedUsers.push({ id: doc.id, ...data } as FirestoreUser);
            });

            // Manual Sort
            fetchedUsers.sort((a, b) => {
                const tA = a.createdAt?.seconds || 0;
                const tB = b.createdAt?.seconds || 0;
                return tB - tA; // Descending
            });

            setUsersList(fetchedUsers);
            
            if (isManualRefresh) {
                alert(`Berhasil mengambil data. Total: ${fetchedUsers.length} user.`);
            }

        } catch (error: any) {
            console.error("Error fetching users:", error);
            if (error.code === 'permission-denied') {
                alert("Gagal: Izin Ditolak. Pastikan Anda Login sebagai Admin.");
            } else {
                alert(`Gagal mengambil data user: ${error.message}`);
            }
        } finally {
            setLoadingUsers(false);
        }
    };

    // ... (Fungsi handleUpdateOrderStatus, handleUpdateProjectStepRealtime, dll SAMA SEPERTI SEBELUMNYA)
    const handleUpdateOrderStatus = async (orderId: string, newStatus: string, orderData?: any) => {
        const actionName = newStatus === 'Proses' ? 'memproses' : 'menyelesaikan';
        if (!window.confirm(`Konfirmasi Admin:\nUbah status menjadi '${newStatus}'?`)) {
            return;
        }
        
        setProcessingOrderId(orderId);
        setLocalStatusOverrides(prev => ({ ...prev, [orderId]: newStatus }));

        try {
            const orderRef = doc(db, "orders", orderId);
            await updateDoc(orderRef, { status: newStatus });

            if (newStatus === 'Proses' && orderData) {
                const projectsRef = collection(db, "projects");
                const q = query(projectsRef, where("orderId", "==", orderId));
                const existingProject = await getDocs(q);

                if (existingProject.empty) {
                    await addDoc(collection(db, "projects"), {
                        userId: orderData.userId,
                        userName: orderData.userName,
                        orderId: orderId,
                        projectName: orderData.serviceName || "Layanan Unity Group",
                        currentStep: 0,
                        lastUpdated: new Date().toISOString(),
                        steps: [
                            { name: 'Verifikasi Berkas', status: 'completed', timestamp: new Date().toLocaleString() },
                            { name: 'Proses Pengerjaan', status: 'active', timestamp: 'Sedang Berjalan' },
                            { name: 'Finishing / Penyerahan', status: 'pending', timestamp: '' },
                            { name: 'Selesai', status: 'pending', timestamp: '' }
                        ]
                    });
                    alert("✅ Status diubah ke 'Proses'.\n\nProject Tracker otomatis dibuat untuk User ini.");
                }
            }
            setViewOrder(null);
        } catch (error: any) {
            console.error("Firestore update failed:", error);
            alert(`Gagal update database: ${error.message}`);
             setLocalStatusOverrides(prev => {
                const newState = { ...prev };
                delete newState[orderId];
                return newState;
            });
        } finally {
            setProcessingOrderId(null);
        }
    };

    const handleUpdateProjectStepRealtime = async (projectId: string, stepIndex: number, currentSteps: any[]) => {
        try {
            const newSteps = [...currentSteps];
            const currentStatus = newSteps[stepIndex].status;
            
            let nextStatus = 'pending';
            if (currentStatus === 'pending') nextStatus = 'active';
            else if (currentStatus === 'active') nextStatus = 'completed';
            else nextStatus = 'pending'; 

            const existingTimestamp = newSteps[stepIndex].timestamp || '';

            newSteps[stepIndex] = {
                ...newSteps[stepIndex],
                status: nextStatus,
                timestamp: nextStatus === 'completed' ? new Date().toLocaleString() : existingTimestamp
            };

            const projectRef = doc(db, "projects", projectId);
            await updateDoc(projectRef, {
                steps: newSteps,
                currentStep: stepIndex,
                lastUpdated: new Date().toISOString()
            });

        } catch (error: any) {
            console.error("Gagal update step:", error);
            alert(`Gagal update step project: ${error.message}`);
        }
    };

    const handleEditPrice = async (orderId: string, currentPrice: string) => {
        const newPrice = prompt("Masukkan Harga Deal / Kesepakatan:\n(Contoh: Rp 3.500.000)", currentPrice === 'Menunggu Estimasi' ? '' : currentPrice);
        if (newPrice && newPrice !== currentPrice) {
             setOrdersList(prev => prev.map(o => { if (o.id === orderId) return { ...o, price: newPrice }; return o; }));
             try {
                const orderRef = doc(db, "orders", orderId);
                await updateDoc(orderRef, { price: newPrice });
            } catch (error) { console.error(error); alert("Gagal update harga."); }
        }
    };

    const handleDeleteOrder = async (orderId: string) => {
        if (!window.confirm("PERINGATAN: Apakah Anda yakin ingin menghapus pesanan ini secara permanen? Data yang dihapus tidak dapat dikembalikan.")) {
            return;
        }

        try {
            await deleteDoc(doc(db, "orders", orderId));
            alert("Pesanan berhasil dihapus.");
        } catch (error: any) {
            console.error("Error deleting order:", error);
            alert(`Gagal menghapus pesanan: ${error.message}`);
        }
    };

    const handleUpdateUserRole = async (userId: string, newRole: 'user' | 'admin') => {
        if (!window.confirm(`Apakah Anda yakin mengubah role user ini menjadi ${newRole}?`)) return;
        try {
            const userRef = doc(db, "users", userId);
            await updateDoc(userRef, { role: newRole });
            setUsersList(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
            alert("Role berhasil diperbarui!");
            setSelectedUser(null);
        } catch (error) { console.error(error); alert("Gagal memperbarui role."); }
    };

    const handleDeleteUser = async (userId: string) => {
        if (!window.confirm("PERINGATAN: Tindakan ini akan menghapus data user dari database. Lanjutkan?")) return;
        try {
            await deleteDoc(doc(db, "users", userId));
            setUsersList(prev => prev.filter(u => u.id !== userId));
            alert("User berhasil dihapus.");
        } catch (error) { console.error(error); alert("Gagal menghapus user."); }
    };

    const filteredUsers = usersList.filter(user => {
        const matchesSearch = (user.displayName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
                              (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === 'all' ? true : user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    const handleDownload = (url: string, filename: string) => {
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const cleanContent = {
                ...editorState,
                services: editorState.services.map(s => { const { icon, ...rest } = s; return rest; })
            };
            await setDoc(doc(db, "settings", "content"), cleanContent);
            updateContent(editorState);
            alert("🚀 Sukses! Perubahan telah dipublikasikan.");
        } catch (error: any) {
            console.error("Gagal menyimpan:", error);
            alert(`Gagal menyimpan ke database online:\n${error.message}`);
        } finally {
            setIsSaving(false);
        }
    };

    // CMS Handlers
    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => setEditorState({ ...editorState, logoUrl: e.target.value });
    const handleHeroChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setEditorState({...editorState, hero: { ...editorState.hero, [e.target.name]: e.target.value }});
    const toggleSeasonal = (e: React.ChangeEvent<HTMLInputElement>) => setEditorState({...editorState, seasonal: { ...editorState.seasonal, isEnabled: e.target.checked }});
    const changeSeasonalTitle = (e: React.ChangeEvent<HTMLInputElement>) => setEditorState({...editorState, seasonal: { ...editorState.seasonal, title: e.target.value }});
    const handleSeasonalImageChange = (index: number, value: string) => { const newImages = [...editorState.seasonal.images]; newImages[index] = value; setEditorState({...editorState, seasonal: { ...editorState.seasonal, images: newImages }}); };
    const addSeasonalImage = () => setEditorState({...editorState, seasonal: { ...editorState.seasonal, images: [...editorState.seasonal.images, 'https://via.placeholder.com/1200x400'] }});
    const removeSeasonalImage = (index: number) => { const newImages = editorState.seasonal.images.filter((_, i) => i !== index); setEditorState({...editorState, seasonal: { ...editorState.seasonal, images: newImages }}); };
    const handleWhyUsImageChange = (index: number, value: string) => { const newImages = [...editorState.whyUs.images]; newImages[index] = value; setEditorState({...editorState, whyUs: { ...editorState.whyUs, images: newImages }}); };
    const handleServiceChange = (index: number, field: string, value: any) => { const newServices = [...editorState.services]; newServices[index] = { ...newServices[index], [field]: value }; setEditorState({ ...editorState, services: newServices }); };
    const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => setEditorState({...editorState, contact: { ...editorState.contact, [e.target.name]: e.target.value }});
    const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => setEditorState({...editorState, socialMedia: { ...editorState.socialMedia, [e.target.name]: e.target.value }});
    const handleDocChange = (index: number, field: keyof DocumentationItem, value: string) => { const newItems = [...editorState.documentation.items]; newItems[index] = { ...newItems[index], [field]: value }; setEditorState({...editorState, documentation: { ...editorState.documentation, items: newItems }}); };
    const addDocItem = () => { const newItem: DocumentationItem = { imageUrl: 'https://via.placeholder.com/400x300', caption: 'Foto Baru', category: 'handover' }; setEditorState({...editorState, documentation: { ...editorState.documentation, items: [...editorState.documentation.items, newItem] }}); };
    const removeDocItem = (index: number) => { const newItems = editorState.documentation.items.filter((_, i) => i !== index); setEditorState({...editorState, documentation: { ...editorState.documentation, items: newItems }}); };

    const handleTestimonialChange = (index: number, field: keyof TestimonialItem, value: any) => {
        const newItems = [...(editorState.testimonials || TESTIMONIALS)];
        newItems[index] = { ...newItems[index], [field]: value };
        setEditorState({ ...editorState, testimonials: newItems });
    };
    const addTestimonial = () => {
        const newItem: TestimonialItem = {
            id: `t${Date.now()}`,
            name: 'Nama Klien',
            role: 'Jabatan / Perusahaan',
            content: 'Isi testimoni di sini...',
            rating: 5,
            image: 'https://via.placeholder.com/150'
        };
        setEditorState({ ...editorState, testimonials: [...(editorState.testimonials || TESTIMONIALS), newItem] });
    };
    const removeTestimonial = (index: number) => {
        const newItems = (editorState.testimonials || TESTIMONIALS).filter((_, i) => i !== index);
        setEditorState({ ...editorState, testimonials: newItems });
    };

    const getStepIcon = (status: string) => {
        switch(status) {
            case 'completed': return <CheckCircle2 size={18} className="text-green-500" />;
            case 'active': return <Clock size={18} className="text-yellow-500 animate-pulse" />;
            default: return <Circle size={18} className="text-slate-600" />;
        }
    };

    // --- PROTEKSI LAYAR LOADING ---
    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center text-yellow-500 flex-col gap-4">
                 <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
                 <p className="animate-pulse tracking-widest uppercase text-sm">Menghubungkan ke Database...</p>
                 <p className="text-xs text-slate-500">Mohon tunggu, sedang sinkronisasi data.</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#050505] text-slate-300 font-sans flex">
            {/* ... Sidebar Code ... */}
             <aside className="w-20 md:w-64 border-r border-white/10 flex flex-col bg-[#0a0a0a]">
                <div className="h-20 flex items-center justify-center md:justify-start md:px-6 border-b border-white/10">
                    <img src={content.logoUrl} alt="Logo" className="h-8 md:h-10 w-auto object-contain" />
                </div>
                <div className="flex-1 py-6 space-y-2">
                    <button onClick={() => setActiveTab('orders')} className={`w-full flex items-center p-4 md:px-6 transition-all border-l-2 ${activeTab === 'orders' ? 'border-red-500 bg-white/5 text-white' : 'border-transparent hover:bg-white/5'}`}>
                        <ShoppingCart size={20} className={activeTab === 'orders' ? 'text-red-500' : ''} />
                        <span className="hidden md:block ml-4 text-sm font-medium">Incoming Orders</span>
                    </button>
                    <button onClick={() => setActiveTab('cms')} className={`w-full flex items-center p-4 md:px-6 transition-all border-l-2 ${activeTab === 'cms' ? 'border-red-500 bg-white/5 text-white' : 'border-transparent hover:bg-white/5'}`}>
                        <Layout size={20} className={activeTab === 'cms' ? 'text-red-500' : ''} />
                        <span className="hidden md:block ml-4 text-sm font-medium">Website Editor</span>
                    </button>
                    <button onClick={() => setActiveTab('projects')} className={`w-full flex items-center p-4 md:px-6 transition-all border-l-2 ${activeTab === 'projects' ? 'border-red-500 bg-white/5 text-white' : 'border-transparent hover:bg-white/5'}`}>
                        <Activity size={20} className={activeTab === 'projects' ? 'text-red-500' : ''} />
                        <span className="hidden md:block ml-4 text-sm font-medium">Project Tracker</span>
                    </button>
                    <button onClick={() => setActiveTab('users')} className={`w-full flex items-center p-4 md:px-6 transition-all border-l-2 ${activeTab === 'users' ? 'border-red-500 bg-white/5 text-white' : 'border-transparent hover:bg-white/5'}`}>
                        <Users size={20} className={activeTab === 'users' ? 'text-red-500' : ''} />
                        <span className="hidden md:block ml-4 text-sm font-medium">User Database</span>
                    </button>
                </div>
                <div className="p-4 border-t border-white/10">
                    <button onClick={onLogout} className="flex items-center justify-center md:justify-start w-full text-slate-500 hover:text-red-400 transition-colors">
                        <LogOut size={20} />
                        <span className="hidden md:block ml-3 text-sm">Logout</span>
                    </button>
                </div>
            </aside>

            <main className="flex-1 overflow-hidden flex flex-col relative bg-[#050505]">
                <header className="h-20 border-b border-white/10 flex items-center justify-between px-8 bg-[#0a0a0a]/50 backdrop-blur-md">
                    <div className="flex items-center gap-4">
                        <h1 className="text-xl font-bold text-white tracking-wide uppercase">
                            {activeTab === 'orders' ? 'Incoming Orders Management' : activeTab === 'cms' ? 'CMS / Website Editor' : activeTab === 'projects' ? 'Project Operations' : 'User Database'}
                        </h1>
                    </div>
                    <div className="flex items-center gap-4">
                        {activeTab === 'cms' && (
                            <Button onClick={handleSave} disabled={isSaving} className={`px-6 py-2 h-10 text-sm flex items-center gap-2 ${isSaving ? 'opacity-70' : ''}`}>
                                <Save size={16} />
                                {isSaving ? 'Menyimpan ke Cloud...' : 'Simpan Perubahan'}
                            </Button>
                        )}
                        <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center">
                            <UserIcon size={14} />
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-8">
                     {/* --- TAB: ORDERS --- */}
                    {activeTab === 'orders' && (
                         <div className="max-w-6xl mx-auto pb-20 space-y-6">
                             {/* ... (ORDERS CONTENT SAMA) ... */}
                            <div className="glass-card rounded-xl border border-white/10 overflow-hidden">
                                {loadingOrders ? (
                                    <div className="p-12 flex justify-center items-center text-slate-500 gap-3">
                                        <div className="w-6 h-6 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
                                        Memuat data pesanan...
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead className="bg-white/5 text-slate-400 text-xs uppercase tracking-wider">
                                                <tr>
                                                    <th className="px-6 py-4 font-medium">User / Klien</th>
                                                    <th className="px-6 py-4 font-medium">Detail Layanan</th>
                                                    <th className="px-6 py-4 font-medium">Harga</th>
                                                    <th className="px-6 py-4 font-medium">Status</th>
                                                    <th className="px-6 py-4 font-medium text-right">Aksi</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5 text-sm">
                                                {ordersList.length === 0 ? (
                                                    <tr>
                                                        <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                                            Belum ada pesanan masuk.
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    ordersList.map((order) => {
                                                        const displayStatus = localStatusOverrides[order.id] || order.status;
                                                        return (
                                                            <tr key={order.id} className="hover:bg-white/5 transition-colors group">
                                                                <td className="px-6 py-4">
                                                                    <div className="font-bold text-white">{order.userName || 'Unknown'}</div>
                                                                    <div className="text-xs text-slate-500">{order.date}</div>
                                                                </td>
                                                                <td className="px-6 py-4">
                                                                    <div className="text-yellow-500 font-medium">{order.serviceName}</div>
                                                                    <div className="flex gap-2 mt-1">
                                                                        {order.ktpUrl && !isCorruptLink(order.ktpUrl) && !order.ktpUrl.includes('WhatsApp') && <span className="text-[10px] px-1.5 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded">KTP</span>}
                                                                        {order.npwpUrl && !isCorruptLink(order.npwpUrl) && !order.npwpUrl.includes('WhatsApp') && <span className="text-[10px] px-1.5 py-0.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded">NPWP</span>}
                                                                        {(order.ktpUrl?.includes('WhatsApp') || order.npwpUrl?.includes('WhatsApp')) && (
                                                                             <span className="text-[10px] px-1.5 py-0.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded flex items-center gap-1">
                                                                                 <MessageCircle size={8} /> Manual WA
                                                                             </span>
                                                                        )}
                                                                        {(isCorruptLink(order.ktpUrl) || isCorruptLink(order.npwpUrl)) && (
                                                                             <span className="text-[10px] px-1.5 py-0.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded flex items-center gap-1">
                                                                                 <AlertCircle size={8} /> Corrupt File
                                                                             </span>
                                                                        )}
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4">
                                                                    <div className="flex items-center gap-2">
                                                                        <span className={`font-mono ${order.price && order.price.toLowerCase().includes('menunggu') ? 'text-red-400 font-bold' : 'text-slate-300'}`}>
                                                                            {order.price}
                                                                        </span>
                                                                        <button 
                                                                            onClick={() => handleEditPrice(order.id, order.price)}
                                                                            className="p-1.5 hover:bg-white/10 rounded text-slate-500 hover:text-yellow-400 transition-colors"
                                                                            title="Edit Harga"
                                                                        >
                                                                            <Edit size={12} />
                                                                        </button>
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4">
                                                                    <span className={`
                                                                        px-2 py-1 rounded text-xs font-bold uppercase
                                                                        ${displayStatus === 'Pending' ? 'bg-yellow-500/10 text-yellow-500' : ''}
                                                                        ${displayStatus === 'Proses' ? 'bg-blue-500/10 text-blue-500' : ''}
                                                                        ${displayStatus === 'Selesai' ? 'bg-green-500/10 text-green-500' : ''}
                                                                    `}>
                                                                        {displayStatus}
                                                                    </span>
                                                                </td>
                                                                <td className="px-6 py-4 text-right">
                                                                    <div className="flex justify-end gap-2">
                                                                        <button 
                                                                            onClick={() => handleDeleteOrder(order.id)}
                                                                            className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 text-xs rounded border border-red-500/20 transition-all flex items-center gap-2"
                                                                            title="Hapus Pesanan"
                                                                        >
                                                                            <Trash2 size={14} />
                                                                        </button>
                                                                        <button 
                                                                            onClick={() => setViewOrder(order)}
                                                                            className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs rounded border border-white/10 transition-all flex items-center gap-2"
                                                                        >
                                                                            <Eye size={14} /> Lihat Detail
                                                                        </button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                         </div>
                    )}
                    
                    {/* --- TAB: USERS --- */}
                    {activeTab === 'users' && (
                        <div className="max-w-6xl mx-auto pb-20 space-y-6">
                            {/* Controls */}
                            <div className="glass-card p-4 rounded-xl border border-white/10 flex flex-col md:flex-row gap-4 justify-between items-center">
                                <div className="relative w-full md:w-96">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                    <input 
                                        type="text" 
                                        placeholder="Cari user berdasarkan nama atau email..." 
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full bg-slate-950/50 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white text-sm focus:border-yellow-500/50 outline-none"
                                    />
                                </div>
                                <div className="flex items-center gap-3 w-full md:w-auto">
                                    <Filter size={16} className="text-slate-500" />
                                    <select 
                                        value={roleFilter} 
                                        onChange={(e) => setRoleFilter(e.target.value as any)}
                                        className="bg-slate-950/50 border border-white/10 rounded-lg px-4 py-2.5 text-slate-300 text-sm focus:border-yellow-500/50 outline-none"
                                    >
                                        <option value="all">Semua Role</option>
                                        <option value="admin">Admin</option>
                                        <option value="user">User</option>
                                    </select>
                                    <Button onClick={() => fetchUsers(true)} variant="outline" className="py-2.5 px-4 gap-2">
                                        <RefreshCw size={14} /> Paksa Refresh
                                    </Button>
                                </div>
                            </div>

                            {/* Users Table */}
                            <div className="glass-card rounded-xl border border-white/10 overflow-hidden">
                                {loadingUsers ? (
                                    <div className="p-12 flex justify-center items-center text-slate-500 gap-3">
                                        <div className="w-6 h-6 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
                                        Memuat data user...
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead className="bg-white/5 text-slate-400 text-xs uppercase tracking-wider">
                                                <tr>
                                                    <th className="px-6 py-4 font-medium">User Profile</th>
                                                    <th className="px-6 py-4 font-medium">Kontak</th>
                                                    <th className="px-6 py-4 font-medium">Role</th>
                                                    <th className="px-6 py-4 font-medium">Bergabung</th>
                                                    <th className="px-6 py-4 font-medium text-right">Aksi</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5 text-sm">
                                                {filteredUsers.length === 0 ? (
                                                    <tr>
                                                        <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                                            <div className="flex flex-col items-center gap-2">
                                                                <span className="text-lg font-medium text-slate-400">Database User Kosong</span>
                                                                <span className="text-xs">Data akan muncul setelah user melakukan Sign Up.</span>
                                                                <Button onClick={() => fetchUsers(true)} variant="outline" className="mt-4 text-xs">
                                                                    Coba Refresh Database
                                                                </Button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    filteredUsers.map((user) => (
                                                        <tr key={user.id} className="hover:bg-white/5 transition-colors group">
                                                            <td className="px-6 py-4">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-lg font-bold text-yellow-500 border border-white/10 overflow-hidden">
                                                                        {user.displayName ? user.displayName.charAt(0).toUpperCase() : '?'}
                                                                    </div>
                                                                    <div>
                                                                        <div className="text-white font-medium">{user.displayName || 'Tanpa Nama'}</div>
                                                                        <div className="text-slate-500 text-xs font-mono">ID: {user.uid.substring(0, 8)}...</div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <div className="text-slate-300">{user.email}</div>
                                                                {user.phoneNumber && <div className="text-slate-500 text-xs mt-0.5">{user.phoneNumber}</div>}
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                {user.role === 'admin' ? (
                                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                                                                        <Shield size={12} /> Admin
                                                                    </span>
                                                                ) : (
                                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                                                        <UserIcon size={12} /> User
                                                                    </span>
                                                                )}
                                                            </td>
                                                            <td className="px-6 py-4 text-slate-400">
                                                                {user.createdAt ? new Date(user.createdAt?.seconds * 1000).toLocaleDateString() : '-'}
                                                            </td>
                                                            <td className="px-6 py-4 text-right">
                                                                <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                                                    <button 
                                                                        onClick={() => setViewUserDetail(user)}
                                                                        className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-yellow-400 transition-colors"
                                                                        title="Lihat Profil Lengkap"
                                                                    >
                                                                        <Eye size={16} />
                                                                    </button>
                                                                    <button 
                                                                        onClick={() => setSelectedUser(user)}
                                                                        className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors"
                                                                        title="Edit Role"
                                                                    >
                                                                        <MoreVertical size={16} />
                                                                    </button>
                                                                    <button 
                                                                        onClick={() => handleDeleteUser(user.id)}
                                                                        className="p-2 hover:bg-red-500/10 rounded-lg text-slate-400 hover:text-red-400 transition-colors"
                                                                        title="Hapus User"
                                                                    >
                                                                        <Trash2 size={16} />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'cms' && (
                       // ... (CMS CONTENT SAMA) ...
                       <div className="max-w-4xl mx-auto space-y-10 pb-20">
                            {/* INFO BOX */}
                            <div className="flex items-start gap-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                                <Monitor className="text-blue-400 mt-1" />
                                <div>
                                    <h4 className="text-blue-400 font-bold mb-1">Global Editor (Firebase Firestore)</h4>
                                    <p className="text-slate-400 text-sm">
                                        Perubahan yang Anda simpan di sini akan langsung terupdate di seluruh dunia (Real-time).
                                    </p>
                                </div>
                            </div>
                            
                            {/* LOGO EDITOR */}
                            <div className="glass-card p-8 rounded-xl border border-white/10">
                                <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4 flex items-center gap-2">
                                    <Globe size={20} className="text-yellow-500" /> Pengaturan Umum (Logo)
                                </h3>
                                <div className="space-y-6">
                                    <div className="flex flex-col md:flex-row gap-6 items-start">
                                        <div className="flex-1 w-full">
                                            <label className="block text-slate-400 text-sm font-medium mb-2 flex items-center gap-2">
                                                <ImageIcon size={14} /> URL Gambar Logo Website
                                            </label>
                                            <input value={editorState.logoUrl || ''} onChange={handleLogoChange} className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-yellow-500/50 outline-none font-mono text-xs text-blue-300" />
                                        </div>
                                        <div className="shrink-0 p-4 bg-white/5 border border-white/10 rounded-lg text-center">
                                            <p className="text-xs text-slate-500 mb-2">Preview</p>
                                            <img src={editorState.logoUrl} alt="Logo" className="h-10 w-auto object-contain mx-auto" />
                                        </div>
                                    </div>

                                    {/* Footer Description */}
                                    <div>
                                        <label className="block text-slate-400 text-sm font-medium mb-2 flex items-center gap-2">
                                            <FileText size={14} /> Deskripsi Footer
                                        </label>
                                        <textarea 
                                            value={editorState.footerDescription || ''} 
                                            onChange={(e) => setEditorState({ ...editorState, footerDescription: e.target.value })}
                                            className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-yellow-500/50 outline-none text-sm h-24 resize-none"
                                            placeholder="Masukkan deskripsi singkat perusahaan..."
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* SEASONAL SLIDER */}
                             <div className="glass-card p-8 rounded-xl border border-yellow-500/20 bg-yellow-500/5">
                                <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={20} className="text-yellow-400" /> Seasonal Slider
                                    </div>
                                    <Button onClick={addSeasonalImage} className="text-xs py-1.5 h-8">
                                        <Plus size={14} /> Tambah Slide
                                    </Button>
                                </h3>
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <input type="checkbox" id="seasonalEnabled" checked={editorState.seasonal.isEnabled} onChange={toggleSeasonal} className="w-5 h-5 rounded border-gray-600 text-yellow-500 focus:ring-yellow-500" />
                                            <label htmlFor="seasonalEnabled" className="text-white font-medium cursor-pointer">Aktifkan Slider Promo</label>
                                        </div>
                                    </div>
                                    {editorState.seasonal.isEnabled && (
                                        <div className="space-y-4 animate-fade-in-up">
                                             <div className="mb-4">
                                                <label className="block text-slate-400 text-xs font-medium mb-1">Judul Promo (Kecil)</label>
                                                <input value={editorState.seasonal.title} onChange={changeSeasonalTitle} className="w-full bg-slate-950 border border-white/10 rounded px-3 py-2 text-white text-sm" />
                                            </div>
                                            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                                {editorState.seasonal.images.map((img, idx) => (
                                                    <div key={idx} className="flex gap-4 items-center">
                                                        <span className="text-slate-500 text-xs font-mono w-6 text-center">{idx + 1}.</span>
                                                        <input value={img} onChange={(e) => handleSeasonalImageChange(idx, e.target.value)} className="flex-1 bg-slate-950 border border-white/10 rounded px-3 py-2 text-blue-300 font-mono text-xs focus:border-yellow-500/50 outline-none" />
                                                        <button onClick={() => removeSeasonalImage(idx)} className="text-slate-600 hover:text-red-400" disabled={editorState.seasonal.images.length <= 1}>
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                             {/* TESTIMONIALS EDITOR */}
                            <div className="glass-card p-8 rounded-xl border border-white/10">
                                <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <MessageCircle size={20} className="text-yellow-500" /> Testimoni Customer
                                    </div>
                                    <Button onClick={addTestimonial} className="text-xs py-1.5 h-8">
                                        <Plus size={14} /> Tambah Testimoni
                                    </Button>
                                </h3>
                                <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                                    {(editorState.testimonials || TESTIMONIALS).map((item, idx) => (
                                        <div key={item.id} className="p-4 bg-white/5 rounded-lg border border-white/5 relative group">
                                            <button 
                                                onClick={() => removeTestimonial(idx)}
                                                className="absolute top-4 right-4 p-2 bg-red-500/10 text-red-400 rounded hover:bg-red-500 hover:text-white transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 pr-12">
                                                <div>
                                                    <label className="block text-slate-400 text-xs font-medium mb-1">Nama Klien</label>
                                                    <input 
                                                        value={item.name} 
                                                        onChange={(e) => handleTestimonialChange(idx, 'name', e.target.value)} 
                                                        className="w-full bg-slate-950 border border-white/10 rounded px-3 py-2 text-white text-sm focus:border-yellow-500/50 outline-none" 
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-slate-400 text-xs font-medium mb-1">Jabatan / Perusahaan</label>
                                                    <input 
                                                        value={item.role} 
                                                        onChange={(e) => handleTestimonialChange(idx, 'role', e.target.value)} 
                                                        className="w-full bg-slate-950 border border-white/10 rounded px-3 py-2 text-white text-sm focus:border-yellow-500/50 outline-none" 
                                                    />
                                                </div>
                                            </div>

                                            <div className="mb-4">
                                                <label className="block text-slate-400 text-xs font-medium mb-1">Isi Testimoni</label>
                                                <textarea 
                                                    rows={3}
                                                    value={item.content} 
                                                    onChange={(e) => handleTestimonialChange(idx, 'content', e.target.value)} 
                                                    className="w-full bg-slate-950 border border-white/10 rounded px-3 py-2 text-slate-300 text-sm focus:border-yellow-500/50 outline-none" 
                                                />
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-slate-400 text-xs font-medium mb-1">Rating (1-5)</label>
                                                    <select 
                                                        value={item.rating} 
                                                        onChange={(e) => handleTestimonialChange(idx, 'rating', parseInt(e.target.value))}
                                                        className="w-full bg-slate-950 border border-white/10 rounded px-3 py-2 text-white text-sm focus:border-yellow-500/50 outline-none"
                                                    >
                                                        {[1, 2, 3, 4, 5].map(num => (
                                                            <option key={num} value={num}>{num} Bintang</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-slate-400 text-xs font-medium mb-1">URL Foto Profil</label>
                                                    <div className="flex gap-2">
                                                        <input 
                                                            value={item.image} 
                                                            onChange={(e) => handleTestimonialChange(idx, 'image', e.target.value)} 
                                                            className="flex-1 bg-slate-950 border border-white/10 rounded px-3 py-2 text-blue-300 font-mono text-xs focus:border-yellow-500/50 outline-none" 
                                                        />
                                                        <img src={item.image} alt="Preview" className="w-9 h-9 rounded-full object-cover border border-white/10 bg-slate-800" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* HERO SECTION */}
                             <div className="glass-card p-8 rounded-xl border border-white/10">
                                <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4 flex items-center gap-2">
                                    <Layout size={20} className="text-yellow-500" /> Hero Section
                                </h3>
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-slate-400 text-sm font-medium mb-2 flex items-center gap-2">
                                            <ImageIcon size={14} /> URL Background Hero
                                        </label>
                                        <input name="bannerImage" value={editorState.hero.bannerImage || ''} onChange={handleHeroChange} className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-yellow-500/50 font-mono text-xs text-blue-300" />
                                    </div>
                                    <div>
                                        <label className="block text-slate-400 text-sm font-medium mb-2">Headline</label>
                                        <textarea name="headline" rows={2} value={editorState.hero.headline} onChange={handleHeroChange} className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-3 text-white font-bold text-lg" />
                                    </div>
                                    <div>
                                        <label className="block text-slate-400 text-sm font-medium mb-2">Deskripsi</label>
                                        <textarea name="description" rows={3} value={editorState.hero.description} onChange={handleHeroChange} className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-3 text-white" />
                                    </div>
                                </div>
                            </div>

                            {/* SERVICES EDITOR */}
                            <div className="glass-card p-8 rounded-xl border border-white/10">
                                <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4 flex items-center gap-2">
                                    <Briefcase size={20} className="text-yellow-500" /> Layanan (Services)
                                </h3>
                                <div className="space-y-8">
                                    {editorState.services.map((service, idx) => (
                                        <div key={idx} className="p-4 bg-white/5 rounded-lg border border-white/5">
                                            <div className="mb-4">
                                                <label className="block text-slate-400 text-xs font-medium mb-1">Judul Layanan</label>
                                                <input 
                                                    value={service.title} 
                                                    onChange={(e) => handleServiceChange(idx, 'title', e.target.value)} 
                                                    className="w-full bg-slate-950 border border-white/10 rounded px-3 py-2 text-white text-sm focus:border-yellow-500/50 outline-none" 
                                                />
                                            </div>
                                            <div className="mb-4">
                                                <label className="block text-slate-400 text-xs font-medium mb-1">Deskripsi Singkat</label>
                                                <textarea 
                                                    rows={2}
                                                    value={service.description} 
                                                    onChange={(e) => handleServiceChange(idx, 'description', e.target.value)} 
                                                    className="w-full bg-slate-950 border border-white/10 rounded px-3 py-2 text-slate-300 text-sm focus:border-yellow-500/50 outline-none" 
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-slate-400 text-xs font-medium mb-1">
                                                    Rincian / Fitur (Satu baris per item, untuk tombol "Selengkapnya")
                                                </label>
                                                <textarea 
                                                    rows={4}
                                                    value={service.details ? service.details.join('\n') : (SERVICES.find(s => s.id === service.id)?.details?.join('\n') || '')}
                                                    onChange={(e) => handleServiceChange(idx, 'details', e.target.value.split('\n'))}
                                                    className="w-full bg-slate-950 border border-white/10 rounded px-3 py-2 text-blue-200 font-mono text-xs focus:border-yellow-500/50 outline-none"
                                                    placeholder="Contoh:&#10;Pendirian PT&#10;Izin Usaha&#10;NIB" 
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                             {/* WHY US IMAGES */}
                             <div className="glass-card p-8 rounded-xl border border-white/10">
                                <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4 flex items-center gap-2">
                                    <CheckCircle2 size={20} className="text-yellow-500" /> Keunggulan (Why Us Images)
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {editorState.whyUs.images.map((img, idx) => (
                                        <div key={idx} className="space-y-2">
                                            <label className="block text-slate-400 text-xs font-medium">Image URL {idx + 1}</label>
                                            <input 
                                                value={img} 
                                                onChange={(e) => handleWhyUsImageChange(idx, e.target.value)} 
                                                className="w-full bg-slate-950 border border-white/10 rounded px-3 py-2 text-blue-300 font-mono text-xs focus:border-yellow-500/50 outline-none" 
                                            />
                                            <img src={img} alt="Preview" className="h-24 w-full object-cover rounded border border-white/10 opacity-50" />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* DOCUMENTATION */}
                            <div className="glass-card p-8 rounded-xl border border-white/10">
                                <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
                                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                        <Camera size={20} className="text-yellow-500" /> Dokumentasi
                                    </h3>
                                    <Button onClick={addDocItem} className="text-xs py-1.5 h-8">
                                        <Plus size={14} /> Tambah Foto
                                    </Button>
                                </div>
                                
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                         <div className="col-span-full mb-2">
                                            <label className="block text-slate-400 text-xs font-medium mb-1">Judul Section</label>
                                            <input 
                                                value={editorState.documentation.title} 
                                                onChange={(e) => setEditorState({...editorState, documentation: {...editorState.documentation, title: e.target.value}})}
                                                className="w-full bg-slate-950 border border-white/10 rounded px-3 py-2 text-white text-sm" 
                                            />
                                        </div>
                                         <div className="col-span-full mb-4">
                                            <label className="block text-slate-400 text-xs font-medium mb-1">Sub-judul Section</label>
                                            <input 
                                                value={editorState.documentation.subtitle} 
                                                onChange={(e) => setEditorState({...editorState, documentation: {...editorState.documentation, subtitle: e.target.value}})}
                                                className="w-full bg-slate-950 border border-white/10 rounded px-3 py-2 text-white text-sm" 
                                            />
                                        </div>
                                    </div>

                                    <div className="max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                                            {editorState.documentation.items.map((item, idx) => (
                                                <div key={idx} className="flex gap-4 items-start p-4 bg-white/5 rounded-lg border border-white/5 relative group">
                                                <img 
                                                    src={item.imageUrl} 
                                                    alt="" 
                                                    className="w-20 h-20 object-cover rounded bg-black cursor-zoom-in hover:opacity-80 transition-opacity"
                                                    onClick={() => setZoomedImage(item.imageUrl)}
                                                />
                                                <div className="flex-1 space-y-3">
                                                    <input 
                                                        value={item.imageUrl} 
                                                        onChange={(e) => handleDocChange(idx, 'imageUrl', e.target.value)} 
                                                        placeholder="Image URL"
                                                        className="w-full bg-slate-950 border border-white/10 rounded px-3 py-2 text-blue-300 font-mono text-xs" 
                                                    />
                                                    <input 
                                                        value={item.caption} 
                                                        onChange={(e) => handleDocChange(idx, 'caption', e.target.value)} 
                                                        placeholder="Caption / Keterangan"
                                                        className="w-full bg-slate-950 border border-white/10 rounded px-3 py-2 text-white text-sm" 
                                                    />
                                                </div>
                                                <button onClick={() => removeDocItem(idx)} className="text-slate-600 hover:text-red-400 p-2">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* CONTACT & SOCIAL */}
                            <div className="glass-card p-8 rounded-xl border border-white/10">
                                <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4 flex items-center gap-2">
                                    <Share2 size={20} className="text-yellow-500" /> Kontak & Social Media
                                </h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <h4 className="text-white font-medium mb-2 border-b border-white/5 pb-2">Info Kontak</h4>
                                        <div>
                                            <label className="block text-slate-400 text-xs font-medium mb-1">Alamat Kantor</label>
                                            <div className="flex items-center gap-2">
                                                 <MapPin size={14} className="text-slate-500" />
                                                 <input name="address" value={editorState.contact.address} onChange={handleContactChange} className="w-full bg-slate-950 border border-white/10 rounded px-3 py-2 text-white text-sm" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-slate-400 text-xs font-medium mb-1">Email</label>
                                            <div className="flex items-center gap-2">
                                                 <Mail size={14} className="text-slate-500" />
                                                 <input name="email" value={editorState.contact.email} onChange={handleContactChange} className="w-full bg-slate-950 border border-white/10 rounded px-3 py-2 text-white text-sm" />
                                            </div>
                                        </div>
                                         <div>
                                            <label className="block text-slate-400 text-xs font-medium mb-1">Telepon</label>
                                            <div className="flex items-center gap-2">
                                                 <Phone size={14} className="text-slate-500" />
                                                 <input name="phone" value={editorState.contact.phone} onChange={handleContactChange} className="w-full bg-slate-950 border border-white/10 rounded px-3 py-2 text-white text-sm" />
                                            </div>
                                        </div>
                                         <div>
                                            <label className="block text-slate-400 text-xs font-medium mb-1">Foto Kantor (Footer)</label>
                                            <div className="flex items-center gap-2">
                                                 <ImageIcon size={14} className="text-slate-500" />
                                                 <input name="contactImage" value={editorState.contact.contactImage || ''} onChange={handleContactChange} placeholder="URL Foto Gedung / Kantor" className="w-full bg-slate-950 border border-white/10 rounded px-3 py-2 text-white text-sm" />
                                            </div>
                                            {editorState.contact.contactImage && (
                                                <img src={editorState.contact.contactImage} alt="Preview" className="mt-2 h-24 w-full object-cover rounded border border-white/10 opacity-50" />
                                            )}
                                        </div>
                                         <div>
                                            <label className="block text-slate-400 text-xs font-medium mb-1">Foto Tambahan (Footer)</label>
                                            <div className="flex items-center gap-2">
                                                 <ImageIcon size={14} className="text-slate-500" />
                                                 <input name="contactImage2" value={editorState.contact.contactImage2 || ''} onChange={handleContactChange} placeholder="URL Foto Tambahan / Sertifikat" className="w-full bg-slate-950 border border-white/10 rounded px-3 py-2 text-white text-sm" />
                                            </div>
                                            {editorState.contact.contactImage2 && (
                                                <img src={editorState.contact.contactImage2} alt="Preview" className="mt-2 h-24 w-full object-contain rounded border border-white/10 opacity-50 bg-white/5" />
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h4 className="text-white font-medium mb-2 border-b border-white/5 pb-2">Social Media Links</h4>
                                         <div className="flex items-center gap-3">
                                            <Facebook size={16} className="text-blue-500" />
                                            <input name="facebook" value={editorState.socialMedia.facebook} onChange={handleSocialChange} placeholder="Facebook URL" className="flex-1 bg-slate-950 border border-white/10 rounded px-3 py-2 text-blue-300 font-mono text-xs" />
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Instagram size={16} className="text-pink-500" />
                                            <input name="instagram" value={editorState.socialMedia.instagram} onChange={handleSocialChange} placeholder="Instagram URL" className="flex-1 bg-slate-950 border border-white/10 rounded px-3 py-2 text-blue-300 font-mono text-xs" />
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Linkedin size={16} className="text-blue-400" />
                                            <input name="linkedin" value={editorState.socialMedia.linkedin} onChange={handleSocialChange} placeholder="LinkedIn URL" className="flex-1 bg-slate-950 border border-white/10 rounded px-3 py-2 text-blue-300 font-mono text-xs" />
                                        </div>
                                         <div className="flex items-center gap-3">
                                            <Twitter size={16} className="text-sky-500" />
                                            <input name="twitter" value={editorState.socialMedia.twitter} onChange={handleSocialChange} placeholder="Twitter URL" className="flex-1 bg-slate-950 border border-white/10 rounded px-3 py-2 text-blue-300 font-mono text-xs" />
                                        </div>
                                         <div className="flex items-center gap-3">
                                            <MessageCircle size={16} className="text-green-500" />
                                            <input name="whatsapp" value={editorState.socialMedia.whatsapp} onChange={handleSocialChange} placeholder="WhatsApp Number (62...)" className="flex-1 bg-slate-950 border border-white/10 rounded px-3 py-2 text-blue-300 font-mono text-xs" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'projects' && (
                        <div className="max-w-6xl mx-auto space-y-6 pb-20">
                             {/* ... (Project content) */}
                             <div className="grid gap-6">
                                {realtimeProjects.map((project) => (
                                    <div key={project.id} className="glass-card p-6 rounded-xl border border-white/10">
                                         <h4 className="text-lg font-bold text-white">{project.projectName}</h4>
                                         <p className="text-sm text-slate-400">User: <span className="text-yellow-500">{project.userName}</span></p>
                                         <p className="text-xs text-slate-500 mt-1 mb-6">Last Update: {new Date(project.lastUpdated).toLocaleString()}</p>
                                         
                                         {/* Progress Steps */}
                                            <div className="flex flex-col md:flex-row justify-between gap-6 relative z-10">
                                            {project.steps.map((step: any, idx: number) => (
                                                <div key={idx} className="flex md:flex-col gap-4 md:gap-2 items-center md:text-center w-full md:w-1/5 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => handleUpdateProjectStepRealtime(project.id, idx, project.steps)}>
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 bg-[#050505] ${step.status === 'completed' ? 'border-green-500' : step.status === 'active' ? 'border-yellow-500' : 'border-slate-700'}`}>
                                                        {getStepIcon(step.status)}
                                                    </div>
                                                    <p className={`text-sm font-medium ${step.status === 'completed' ? 'text-green-400' : step.status === 'active' ? 'text-yellow-400' : 'text-slate-500'}`}>{step.name}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                
                {/* --- MODAL DETAIL ORDER (NEW VIEW) --- */}
                {viewOrder && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={() => setViewOrder(null)}></div>
                        <div className="relative bg-[#0a0a0a] border border-white/10 rounded-2xl w-full max-w-2xl p-0 animate-blob hover:animate-none shadow-2xl flex flex-col max-h-[90vh]">
                             {/* Modal Header */}
                             <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5 rounded-t-2xl">
                                <div>
                                    <h3 className="text-xl font-bold text-white">Detail Pesanan</h3>
                                    <p className="text-slate-400 text-xs mt-1">ID: {viewOrder.id}</p>
                                </div>
                                <button onClick={() => setViewOrder(null)} className="text-slate-400 hover:text-white"><X size={24} /></button>
                             </div>

                             {/* Modal Body */}
                             <div className="p-6 overflow-y-auto space-y-6">
                                {/* ... (ISI MODAL ORDER SAMA) ... */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-slate-900/50 p-4 rounded-xl border border-white/5">
                                        <h4 className="text-yellow-500 font-bold mb-3 flex items-center gap-2"><UserIcon size={16} /> Data Klien</h4>
                                        <div className="space-y-3 text-sm">
                                            <div>
                                                <span className="block text-slate-500 text-xs">Nama Lengkap</span>
                                                <span className="text-white font-medium">{viewOrder.userName}</span>
                                            </div>
                                            <div>
                                                <span className="block text-slate-500 text-xs">Email</span>
                                                <a href={`mailto:${viewOrder.userEmail}`} className="text-blue-400 hover:underline">{viewOrder.userEmail}</a>
                                            </div>
                                            <div>
                                                <span className="block text-slate-500 text-xs">WhatsApp / HP</span>
                                                <span className="text-white">{viewOrder.userPhone}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-slate-900/50 p-4 rounded-xl border border-white/5">
                                        <h4 className="text-yellow-500 font-bold mb-3 flex items-center gap-2"><Briefcase size={16} /> Layanan</h4>
                                        <div className="space-y-3 text-sm">
                                            <div>
                                                <span className="block text-slate-500 text-xs">Nama Layanan</span>
                                                <span className="text-white font-medium">{viewOrder.serviceName}</span>
                                            </div>
                                            <div>
                                                <span className="block text-slate-500 text-xs">Harga</span>
                                                <span className="text-white font-mono font-bold">{viewOrder.price}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Section 2: Dokumen (KTP / NPWP) - WITH ERROR CHECK */}
                                <div>
                                    <h4 className="text-white font-bold mb-3 border-b border-white/5 pb-2">Kelengkapan Dokumen</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* KTP */}
                                        <div className={`p-4 rounded-xl border border-dashed flex items-center justify-between ${viewOrder.ktpUrl && !viewOrder.ktpUrl.includes('WhatsApp') ? 'border-yellow-500/30 bg-yellow-500/5' : viewOrder.ktpUrl?.includes('WhatsApp') ? 'border-green-500/30 bg-green-500/5' : 'border-slate-700 bg-slate-900/30'}`}>
                                            <div className="flex items-center gap-3">
                                                <CreditCard className={viewOrder.ktpUrl ? "text-yellow-500" : "text-slate-600"} />
                                                <div>
                                                    <div className="text-sm font-medium text-white">File KTP</div>
                                                    <div className="text-xs text-slate-500">
                                                        {viewOrder.ktpUrl 
                                                            ? (isCorruptLink(viewOrder.ktpUrl) ? 'File Corrupt' : viewOrder.ktpUrl.includes('WhatsApp') ? 'Manual via WhatsApp' : 'Tersedia') 
                                                            : 'Belum upload'}
                                                    </div>
                                                </div>
                                            </div>
                                            {viewOrder.ktpUrl && !isCorruptLink(viewOrder.ktpUrl) && !viewOrder.ktpUrl.includes('WhatsApp') && (
                                                <div className="flex gap-2">
                                                    <a href={viewOrder.ktpUrl} target="_blank" rel="noreferrer" className="px-3 py-1.5 bg-yellow-500/10 hover:bg-yellow-500 text-yellow-500 hover:text-slate-900 text-xs rounded-lg transition-colors font-medium flex items-center gap-1">
                                                        <Eye size={12} /> Lihat
                                                    </a>
                                                    <button onClick={() => handleDownload(viewOrder.ktpUrl, `KTP-${viewOrder.userName}.jpg`)} className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white text-xs rounded-lg transition-colors font-medium flex items-center gap-1">
                                                        <Download size={12} /> Unduh
                                                    </button>
                                                </div>
                                            )}
                                             {viewOrder.ktpUrl && viewOrder.ktpUrl.includes('WhatsApp') && (
                                                 <span className="text-xs text-green-500 font-bold flex items-center gap-1">
                                                     <MessageCircle size={10} /> Cek WA Admin
                                                 </span>
                                            )}
                                            {isCorruptLink(viewOrder.ktpUrl) && (
                                                <span className="text-xs text-red-500 font-bold italic">Gagal Upload</span>
                                            )}
                                        </div>

                                        {/* NPWP */}
                                        <div className={`p-4 rounded-xl border border-dashed flex items-center justify-between ${viewOrder.npwpUrl && !viewOrder.npwpUrl.includes('WhatsApp') ? 'border-blue-500/30 bg-blue-500/5' : viewOrder.npwpUrl?.includes('WhatsApp') ? 'border-green-500/30 bg-green-500/5' : 'border-slate-700 bg-slate-900/30'}`}>
                                            <div className="flex items-center gap-3">
                                                <FileText className={viewOrder.npwpUrl ? "text-blue-500" : "text-slate-600"} />
                                                <div>
                                                    <div className="text-sm font-medium text-white">File NPWP</div>
                                                    <div className="text-xs text-slate-500">
                                                        {viewOrder.npwpUrl 
                                                            ? (isCorruptLink(viewOrder.npwpUrl) ? 'File Corrupt' : viewOrder.npwpUrl.includes('WhatsApp') ? 'Manual via WhatsApp' : 'Tersedia') 
                                                            : 'Belum upload'}
                                                    </div>
                                                </div>
                                            </div>
                                            {viewOrder.npwpUrl && !isCorruptLink(viewOrder.npwpUrl) && !viewOrder.npwpUrl.includes('WhatsApp') && (
                                                <div className="flex gap-2">
                                                    <a href={viewOrder.npwpUrl} target="_blank" rel="noreferrer" className="px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500 text-blue-500 hover:text-white text-xs rounded-lg transition-colors font-medium flex items-center gap-1">
                                                        <Eye size={12} /> Lihat
                                                    </a>
                                                    <button onClick={() => handleDownload(viewOrder.npwpUrl, `NPWP-${viewOrder.userName}.jpg`)} className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white text-xs rounded-lg transition-colors font-medium flex items-center gap-1">
                                                        <Download size={12} /> Unduh
                                                    </button>
                                                </div>
                                            )}
                                             {viewOrder.npwpUrl && viewOrder.npwpUrl.includes('WhatsApp') && (
                                                 <span className="text-xs text-green-500 font-bold flex items-center gap-1">
                                                     <MessageCircle size={10} /> Cek WA Admin
                                                 </span>
                                            )}
                                            {isCorruptLink(viewOrder.npwpUrl) && (
                                                <span className="text-xs text-red-500 font-bold italic">Gagal Upload</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Section 3: Catatan User */}
                                {viewOrder.notes && (
                                    <div className="bg-slate-900/30 p-4 rounded-xl border border-white/5">
                                        <h4 className="text-slate-400 text-xs font-bold uppercase mb-2">Catatan Tambahan User</h4>
                                        <p className="text-slate-300 text-sm italic">"{viewOrder.notes}"</p>
                                    </div>
                                )}
                             </div>

                             {/* Modal Footer Actions */}
                             <div className="p-6 border-t border-white/10 bg-white/5 rounded-b-2xl flex justify-end gap-3">
                                {viewOrder.status === 'Pending' && (
                                    <>
                                        <Button variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10 px-6" onClick={() => handleUpdateOrderStatus(viewOrder.id, 'Batal')}>
                                            Tolak
                                        </Button>
                                        <Button className="px-6" onClick={() => handleUpdateOrderStatus(viewOrder.id, 'Proses', viewOrder)}>
                                            <CheckCircle2 size={16} className="mr-2" /> Terima & Proses
                                        </Button>
                                    </>
                                )}
                                {viewOrder.status === 'Proses' && (
                                    <Button className="bg-green-600 hover:bg-green-500 text-white px-6" onClick={() => handleUpdateOrderStatus(viewOrder.id, 'Selesai', viewOrder)}>
                                        <CheckCircle2 size={16} className="mr-2" /> Tandai Selesai
                                    </Button>
                                )}
                                {viewOrder.status === 'Selesai' && (
                                    <span className="text-green-500 font-bold flex items-center gap-2 text-sm"><CheckCircle2 size={16}/> Pesanan Selesai</span>
                                )}
                             </div>
                        </div>
                    </div>
                )}
                
                {/* --- MODAL EDIT ROLE USER --- */}
                {selectedUser && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedUser(null)}></div>
                        <div className="relative bg-[#0a0a0a] border border-white/10 rounded-2xl w-full max-w-md p-6 animate-blob hover:animate-none shadow-2xl">
                             <h3 className="text-xl font-bold text-white mb-4">Edit Role User</h3>
                             <div className="flex items-center gap-4 mb-6 p-4 bg-white/5 rounded-xl">
                                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-lg font-bold text-yellow-500 border border-white/10 overflow-hidden">
                                    {selectedUser.displayName ? selectedUser.displayName.charAt(0).toUpperCase() : '?'}
                                </div>
                                <div>
                                    <div className="font-bold text-white">{selectedUser.displayName}</div>
                                    <div className="text-xs text-slate-500">{selectedUser.email}</div>
                                </div>
                             </div>

                             <div className="space-y-3">
                                 <button 
                                    onClick={() => handleUpdateUserRole(selectedUser.id, 'admin')}
                                    className={`w-full p-4 rounded-xl border flex items-center justify-between transition-all ${selectedUser.role === 'admin' ? 'bg-red-500/10 border-red-500/50 text-red-400' : 'bg-transparent border-white/10 text-slate-400 hover:bg-white/5'}`}
                                 >
                                    <div className="flex items-center gap-3">
                                        <Shield size={20} />
                                        <div className="text-left">
                                            <div className="font-bold">Administrator</div>
                                            <div className="text-xs opacity-70">Akses penuh ke CMS & User Database</div>
                                        </div>
                                    </div>
                                    {selectedUser.role === 'admin' && <CheckCircle2 size={20} />}
                                 </button>

                                 <button 
                                    onClick={() => handleUpdateUserRole(selectedUser.id, 'user')}
                                    className={`w-full p-4 rounded-xl border flex items-center justify-between transition-all ${selectedUser.role === 'user' ? 'bg-blue-500/10 border-blue-500/50 text-blue-400' : 'bg-transparent border-white/10 text-slate-400 hover:bg-white/5'}`}
                                 >
                                    <div className="flex items-center gap-3">
                                        <UserIcon size={20} />
                                        <div className="text-left">
                                            <div className="font-bold">Regular User</div>
                                            <div className="text-xs opacity-70">Akses hanya ke dashboard klien</div>
                                        </div>
                                    </div>
                                    {selectedUser.role === 'user' && <CheckCircle2 size={20} />}
                                 </button>
                             </div>

                             <div className="mt-6 flex justify-end">
                                 <Button variant="outline" onClick={() => setSelectedUser(null)}>Batal</Button>
                             </div>
                        </div>
                    </div>
                )}

                {/* --- MODAL VIEW FULL USER PROFILE (NEW FEATURE) --- */}
                {viewUserDetail && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={() => setViewUserDetail(null)}></div>
                        <div className="relative bg-[#0a0a0a] border border-white/10 rounded-2xl w-full max-w-2xl p-0 animate-blob hover:animate-none shadow-2xl flex flex-col max-h-[90vh]">
                             {/* Modal Header */}
                             <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5 rounded-t-2xl">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-lg font-bold text-yellow-500 border border-white/10 overflow-hidden">
                                        {viewUserDetail.displayName ? viewUserDetail.displayName.charAt(0).toUpperCase() : '?'}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white">{viewUserDetail.displayName}</h3>
                                        <p className="text-slate-400 text-xs">UID: {viewUserDetail.uid}</p>
                                    </div>
                                </div>
                                <button onClick={() => setViewUserDetail(null)} className="text-slate-400 hover:text-white"><X size={24} /></button>
                             </div>

                             {/* Modal Body */}
                             <div className="p-6 overflow-y-auto space-y-6">
                                {/* Section 1: Data Identitas */}
                                <div className="space-y-4">
                                    <h4 className="text-white font-bold text-sm border-b border-white/5 pb-2 flex items-center gap-2">
                                        <UserIcon size={14} className="text-yellow-500" /> Identitas Personal
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="p-3 bg-white/5 rounded-lg">
                                            <p className="text-slate-500 text-xs mb-1">Email</p>
                                            <p className="text-white text-sm">{viewUserDetail.email}</p>
                                        </div>
                                        <div className="p-3 bg-white/5 rounded-lg">
                                            <p className="text-slate-500 text-xs mb-1">Nomor Telepon / WA</p>
                                            <p className="text-white text-sm">{viewUserDetail.phoneNumber || '-'}</p>
                                        </div>
                                        <div className="p-3 bg-white/5 rounded-lg">
                                            <p className="text-slate-500 text-xs mb-1">Jabatan / Role</p>
                                            <p className="text-white text-sm">{viewUserDetail.jobTitle || '-'}</p>
                                        </div>
                                        <div className="p-3 bg-white/5 rounded-lg">
                                            <p className="text-slate-500 text-xs mb-1">Bergabung Sejak</p>
                                            <p className="text-white text-sm">
                                                {viewUserDetail.createdAt ? new Date(viewUserDetail.createdAt.seconds * 1000).toLocaleDateString() : '-'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Section 2: Data Perusahaan */}
                                <div className="space-y-4">
                                    <h4 className="text-white font-bold text-sm border-b border-white/5 pb-2 flex items-center gap-2">
                                        <Building size={14} className="text-yellow-500" /> Data Perusahaan & Alamat
                                    </h4>
                                    <div className="space-y-4">
                                        <div className="p-3 bg-white/5 rounded-lg">
                                            <p className="text-slate-500 text-xs mb-1">Nama Perusahaan</p>
                                            <p className="text-white text-sm font-medium">{viewUserDetail.company || '-'}</p>
                                        </div>
                                        <div className="p-3 bg-white/5 rounded-lg">
                                            <p className="text-slate-500 text-xs mb-1">Alamat Lengkap</p>
                                            <p className="text-white text-sm leading-relaxed">{viewUserDetail.address || '-'}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Section 3: Informasi Bank (PENTING UNTUK AFFILIATE) */}
                                <div className="space-y-4">
                                    <h4 className="text-white font-bold text-sm border-b border-white/5 pb-2 flex items-center gap-2">
                                        <Landmark size={14} className="text-yellow-500" /> Informasi Keuangan (Afiliasi)
                                    </h4>
                                    {viewUserDetail.bankName || viewUserDetail.bankNumber ? (
                                        <div className="p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-xl grid grid-cols-1 md:grid-cols-2 gap-4">
                                             <div>
                                                <p className="text-slate-400 text-xs mb-1">Nama Bank</p>
                                                <p className="text-white font-bold">{viewUserDetail.bankName}</p>
                                             </div>
                                             <div>
                                                <p className="text-slate-400 text-xs mb-1">Nomor Rekening</p>
                                                <p className="text-white font-bold font-mono text-lg">{viewUserDetail.bankNumber}</p>
                                             </div>
                                             <div className="md:col-span-2">
                                                <p className="text-slate-400 text-xs mb-1">Atas Nama</p>
                                                <p className="text-white font-medium">{viewUserDetail.bankHolder}</p>
                                             </div>
                                        </div>
                                    ) : (
                                        <div className="p-4 bg-white/5 rounded-xl text-center text-slate-500 text-xs">
                                            User belum melengkapi data rekening bank.
                                        </div>
                                    )}
                                </div>
                             </div>

                             {/* Modal Footer */}
                             <div className="p-6 border-t border-white/10 bg-white/5 rounded-b-2xl flex justify-end">
                                <Button onClick={() => setViewUserDetail(null)}>Tutup</Button>
                             </div>
                        </div>
                    </div>
                )}

                {/* ZOOM IMAGE MODAL */}
                {zoomedImage && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm" onClick={() => setZoomedImage(null)}>
                        <div className="relative max-w-4xl max-h-[90vh]">
                            <button 
                                onClick={() => setZoomedImage(null)}
                                className="absolute -top-10 right-0 text-white hover:text-red-500 transition-colors"
                            >
                                <X size={24} />
                            </button>
                            <img 
                                src={zoomedImage} 
                                alt="Zoomed Preview" 
                                className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl border border-white/10"
                            />
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};
