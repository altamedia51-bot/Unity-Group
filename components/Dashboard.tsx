
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  Settings, 
  LogOut, 
  Copy, 
  Wallet,
  Briefcase,
  CheckCircle2,
  Clock,
  Menu,
  CreditCard,
  Circle,
  Activity,
  Plus,
  ChevronRight,
  Save,
  User,
  Phone,
  Mail,
  Search,
  AlertCircle,
  DollarSign,
  UploadCloud,
  FileText,
  X,
  MessageCircle, // Icon WA
  CreditCard as IdCardIcon, // Icon untuk KTP
  MapPin,
  Building,
  Landmark,
  ShieldCheck,
  Key
} from 'lucide-react';
import { Button } from './Button';
import { Input } from './Input'; 
import { Order } from '../types';
import { useContent } from '../contexts/ContentContext';
import { SERVICES, ORDER_PRICING_LIST } from '../constants'; 
import { auth, db, storage } from '../firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs, orderBy, onSnapshot, updateDoc, doc, getDoc, getCountFromServer } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

interface DashboardProps {
    user: any;
    onLogout: () => void;
    onCheckout: (order: Order) => void;
}

type TabView = 'dashboard' | 'orders' | 'referral' | 'settings' | 'create-order';

export const Dashboard: React.FC<DashboardProps> = ({ user, onLogout, onCheckout }) => {
    const { content } = useContent(); 
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<TabView>('dashboard');
    
    // State Data Lokal (Real from Firestore)
    const [myOrders, setMyOrders] = useState<Order[]>([]);
    const [myProjects, setMyProjects] = useState<any[]>([]); 
    
    // State Profile Extended
    const [profileData, setProfileData] = useState({
        name: user?.displayName || '',
        email: user?.email || '',
        phone: user?.phoneNumber || '',
        company: '',
        address: '',
        jobTitle: '',
        bankName: '',
        bankNumber: '',
        bankHolder: ''
    });

    // Stats State
    const [affiliateCount, setAffiliateCount] = useState(0);
    const [walletBalance, setWalletBalance] = useState(0);

    // State untuk Form Order Baru
    const [selectedCategoryIdx, setSelectedCategoryIdx] = useState<number | string>("");
    const [selectedItemIdx, setSelectedItemIdx] = useState<number | string>("");
    const [orderNotes, setOrderNotes] = useState('');
    const [estimatedPrice, setEstimatedPrice] = useState('');
    
    // Upload & Contact States
    const [fileKTP, setFileKTP] = useState<File | null>(null);
    const [fileNPWP, setFileNPWP] = useState<File | null>(null);
    const [contactEmail, setContactEmail] = useState(user?.email || '');
    const [contactPhone, setContactPhone] = useState(user?.phoneNumber || '');
    
    // --- FITUR BARU: MANUAL UPLOAD FALLBACK ---
    const [useManualUpload, setUseManualUpload] = useState(false);

    // UI State
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0); 
    const [statusText, setStatusText] = useState(''); 

    // Referral Logic
    const [copied, setCopied] = useState(false);
    const referralLink = `https://unitygroup.id/ref/${user?.uid || 'guest'}`;

    // --- FETCH DATA REALTIME ---
    useEffect(() => {
        let unsubscribeOrders = () => {};
        let unsubscribeProjects = () => {};

        const setupRealtimeData = async () => {
            if (!user?.uid) return;
            try {
                // 0. Fetch User Profile Data from Firestore (to get saved address, bank, etc)
                const userDocRef = doc(db, "users", user.uid);
                const userSnapshot = await getDoc(userDocRef);
                if (userSnapshot.exists()) {
                    const data = userSnapshot.data();
                    setProfileData(prev => ({
                        ...prev,
                        name: data.displayName || prev.name,
                        phone: data.phoneNumber || prev.phone,
                        company: data.company || '',
                        address: data.address || '',
                        jobTitle: data.jobTitle || '',
                        bankName: data.bankName || '',
                        bankNumber: data.bankNumber || '',
                        bankHolder: data.bankHolder || ''
                    }));
                    // Mock Wallet Balance if exists, else 0
                    setWalletBalance(data.walletBalance || 0);
                }

                // 1. Fetch Orders
                const qOrders = query(collection(db, "orders"), where("userId", "==", user.uid));
                unsubscribeOrders = onSnapshot(qOrders, (snapshot) => {
                    const fetchedOrders: Order[] = [];
                    snapshot.forEach((doc) => {
                        const data = doc.data();
                        fetchedOrders.push({
                            id: doc.id,
                            serviceName: data.serviceName,
                            date: data.date,
                            status: data.status,
                            price: data.price,
                            attachmentUrl: data.ktpUrl || data.attachmentUrl
                        });
                    });
                    fetchedOrders.sort((a, b) => b.id.localeCompare(a.id)); 
                    setMyOrders(fetchedOrders);
                });

                // 2. Fetch Projects
                const qProjects = query(collection(db, "projects"), where("userId", "==", user.uid));
                unsubscribeProjects = onSnapshot(qProjects, (snapshot) => {
                    const fetchedProjects: any[] = [];
                    snapshot.forEach((doc) => {
                        fetchedProjects.push({
                            id: doc.id,
                            ...doc.data()
                        });
                    });
                    fetchedProjects.sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());
                    setMyProjects(fetchedProjects);
                });

                // 3. Count Affiliates (Users referred by this user)
                // Note: This requires the 'referredBy' field to exist in users.
                // We'll try to fetch, if it fails due to index or permission, we default to 0.
                try {
                    const qAffiliates = query(collection(db, "users"), where("referredBy", "==", user.uid));
                    const snapshotAff = await getCountFromServer(qAffiliates);
                    setAffiliateCount(snapshotAff.data().count);
                } catch (e) {
                    // Ignore error if index not built yet or field missing
                    console.log("Affiliate count info unavailable");
                }

            } catch (error) {
                 console.error("Setup failed", error);
            }
        };

        setupRealtimeData();
        return () => {
            unsubscribeOrders();
            unsubscribeProjects();
        };
    }, [user]);

    useEffect(() => {
        if (selectedCategoryIdx !== "" && selectedItemIdx !== "") {
            const catIdx = Number(selectedCategoryIdx);
            const itemIdx = Number(selectedItemIdx);
            const price = ORDER_PRICING_LIST[catIdx].items[itemIdx].price;
            
            if (price === "Menyesuaikan") {
                setEstimatedPrice("Menunggu Estimasi (Hubungi Admin)");
            } else {
                setEstimatedPrice(`Rp ${price}`);
            }
        } else {
            setEstimatedPrice("");
        }
    }, [selectedCategoryIdx, selectedItemIdx]);

    useEffect(() => {
        if (user) {
            setContactEmail(user.email || '');
            setContactPhone(user.phoneNumber || '');
        }
    }, [user]);

    const copyReferral = () => {
        navigator.clipboard.writeText(referralLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleFileKTPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.size > 5 * 1024 * 1024) {
                alert("Ukuran file KTP terlalu besar (Maksimal 5MB)");
                return;
            }
            setFileKTP(file);
        }
    };

    const handleFileNPWPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.size > 5 * 1024 * 1024) {
                alert("Ukuran file NPWP terlalu besar (Maksimal 5MB)");
                return;
            }
            setFileNPWP(file);
        }
    };

    const uploadFileStrict = async (file: File, path: string): Promise<string> => {
        try {
            const storageRef = ref(storage, path);
            const snapshot = await uploadBytes(storageRef, file);
            return await getDownloadURL(snapshot.ref);
        } catch (error: any) {
            console.error("Upload Failed:", error);
            throw error; // Rethrow to be caught in main handler
        }
    };

    const handleCreateOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (selectedCategoryIdx === "" || selectedItemIdx === "") {
            alert("Mohon pilih layanan terlebih dahulu.");
            return;
        }

        if (!contactEmail || !contactPhone) {
            alert("Mohon lengkapi Email dan Nomor HP.");
            return;
        }

        // Validasi Upload (Kecuali jika pakai Manual Fallback)
        if (!useManualUpload && (!fileKTP || !fileNPWP)) {
            alert("Mohon upload KTP dan NPWP, atau centang opsi 'Kirim Manual via WhatsApp' jika mengalami kendala upload.");
            return;
        }

        setIsSubmitting(true);
        setUploadProgress(0);
        setStatusText('Memulai proses...');

        try {
            const catIdx = Number(selectedCategoryIdx);
            const itemIdx = Number(selectedItemIdx);
            const selectedItem = ORDER_PRICING_LIST[catIdx].items[itemIdx];
            const categoryName = ORDER_PRICING_LIST[catIdx].category;
            
            let ktpUrl = "";
            let npwpUrl = "";

            if (useManualUpload) {
                // BYPASS UPLOAD
                setStatusText('Menyiapkan pesanan manual...');
                setUploadProgress(50);
                ktpUrl = "Menyusul via WhatsApp";
                npwpUrl = "Menyusul via WhatsApp";
                // Delay buatan agar terasa diproses
                await new Promise(resolve => setTimeout(resolve, 1000));
            } else {
                // NORMAL UPLOAD
                // UPLOAD KTP
                if (fileKTP) {
                    setStatusText('Mengupload KTP ke Server...');
                    setUploadProgress(20); 
                    ktpUrl = await uploadFileStrict(fileKTP, `documents/${user.uid}/KTP_${Date.now()}_${fileKTP.name}`);
                    setUploadProgress(50);
                }

                // UPLOAD NPWP
                if (fileNPWP) {
                    setStatusText('Mengupload NPWP ke Server...');
                    setUploadProgress(70);
                    npwpUrl = await uploadFileStrict(fileNPWP, `documents/${user.uid}/NPWP_${Date.now()}_${fileNPWP.name}`);
                    setUploadProgress(90);
                }
            }

            setStatusText('Menyimpan data pesanan...');

            const orderPayload = {
                userId: user.uid,
                userName: user.displayName || 'User',
                userEmail: contactEmail, 
                userPhone: contactPhone, 
                serviceId: `${catIdx}-${itemIdx}`, 
                serviceName: selectedItem.name, 
                category: categoryName,
                notes: orderNotes + (useManualUpload ? " [DOKUMEN DIKIRIM MANUAL VIA WA]" : ""),
                date: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
                status: 'Pending',
                price: estimatedPrice.includes("Menunggu") ? "Menunggu Estimasi" : estimatedPrice, 
                ktpUrl: ktpUrl,
                npwpUrl: npwpUrl,
                createdAt: serverTimestamp()
            };

            await addDoc(collection(db, "orders"), orderPayload);

            setIsSubmitting(false);
            setUploadProgress(100);
            setStatusText('Selesai!');
            
            // Reset Form
            setSelectedCategoryIdx("");
            setSelectedItemIdx("");
            setOrderNotes("");
            setEstimatedPrice("");
            setFileKTP(null);
            setFileNPWP(null);
            setUseManualUpload(false);
            
            setTimeout(() => {
                setUploadProgress(0);
                setActiveTab('orders'); 
            }, 1000);
            
            if (useManualUpload) {
                alert("Pesanan berhasil dibuat! \n\nSilakan segera kirim foto KTP & NPWP Anda ke WhatsApp Admin kami agar pesanan dapat diproses.");
                // Redirect ke WA otomatis jika perlu (opsional)
                const waNum = content.socialMedia?.whatsapp?.replace(/[^0-9]/g, '') || '';
                if(waNum) {
                    window.open(`https://wa.me/${waNum}?text=Halo Admin, saya baru membuat pesanan ${selectedItem.name}. Ini dokumen KTP dan NPWP saya.`, '_blank');
                }
            } else {
                alert("Pesanan berhasil dibuat! Dokumen telah tersimpan dengan aman.");
            }

        } catch (error: any) {
            console.error("Gagal membuat pesanan:", error);
            setIsSubmitting(false);
            setUploadProgress(0);
            setStatusText('');
            
            // Suggest Manual Upload on Error
            if (!useManualUpload && (error.message.includes('upload') || error.code === 'storage/unauthorized' || error.message.includes('network'))) {
                const switchManual = window.confirm(`GAGAL UPLOAD DOKUMEN.\n\nSepertinya koneksi ke server penyimpanan sedang sibuk. \n\nApakah Anda ingin melanjutkan pesanan dan mengirim dokumen MANUAL via WhatsApp saja?`);
                if (switchManual) {
                    setUseManualUpload(true);
                }
            } else {
                alert(`GAGAL MEMBUAT PESANAN:\n${error.message}`);
            }
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, {
                displayName: profileData.name,
                phoneNumber: profileData.phone,
                company: profileData.company,
                address: profileData.address,
                jobTitle: profileData.jobTitle,
                bankName: profileData.bankName,
                bankNumber: profileData.bankNumber,
                bankHolder: profileData.bankHolder,
                lastUpdated: serverTimestamp()
            });
            
            // Update Auth Profile (Nama saja)
            if (auth.currentUser) {
                // await updateProfile(auth.currentUser, { displayName: profileData.name });
                // Note: Compat SDK handles this automatically on reload mostly, but explicit update is good practice if using Modular SDK.
            }

            alert("Data Profil berhasil disimpan!");
        } catch (error: any) {
            console.error("Error updating profile:", error);
            alert("Gagal menyimpan data profil.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- HELPER UI ---

    const getStatusBadge = (status: string) => {
        switch(status) {
            case 'Selesai': 
                return <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20 flex items-center w-fit gap-1"><CheckCircle2 size={12}/> Selesai</span>;
            case 'Proses': 
                return <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center w-fit gap-1"><Clock size={12}/> Proses</span>;
            default: 
                return <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 flex items-center w-fit gap-1"><Clock size={12}/> Pending</span>;
        }
    };

    const getStepIcon = (status: string) => {
        switch(status) {
            case 'completed': return <CheckCircle2 size={18} className="text-green-500" />;
            case 'active': return <Clock size={18} className="text-yellow-500 animate-pulse" />;
            default: return <Circle size={18} className="text-slate-600" />;
        }
    };

    const renderContent = () => {
        switch (activeTab) {
            // ... (Other cases same as before)
            
            case 'create-order':
                return (
                    <div className="max-w-3xl mx-auto animate-fade-in-up">
                        <button onClick={() => setActiveTab('dashboard')} className="flex items-center gap-2 text-slate-400 mb-6 hover:text-white">
                            <ChevronRight className="rotate-180" size={16}/> Kembali ke Dashboard
                        </button>
                        <div className="glass-card p-8 rounded-2xl border border-white/10">
                            <h2 className="text-2xl font-bold text-white mb-2">Buat Pesanan Baru</h2>
                            <p className="text-slate-400 mb-8">Silakan lengkapi formulir dan dokumen persyaratan di bawah ini.</p>
                            
                            <form onSubmit={handleCreateOrder} className="space-y-6">
                                {/* KATEGORI & LAYANAN */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-slate-400 text-sm font-medium mb-2 ml-1">Kategori Layanan</label>
                                        <div className="relative">
                                            <select 
                                                required
                                                value={selectedCategoryIdx}
                                                onChange={(e) => {
                                                    setSelectedCategoryIdx(e.target.value);
                                                    setSelectedItemIdx(""); 
                                                }}
                                                className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-white appearance-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 outline-none"
                                            >
                                                <option value="" disabled>-- Pilih Kategori --</option>
                                                {ORDER_PRICING_LIST.map((cat, idx) => (
                                                    <option key={idx} value={idx}>{cat.category}</option>
                                                ))}
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                                                <ChevronRight className="rotate-90" size={16} />
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-slate-400 text-sm font-medium mb-2 ml-1">Jenis Jasa</label>
                                        <div className="relative">
                                            <select 
                                                required
                                                value={selectedItemIdx}
                                                onChange={(e) => setSelectedItemIdx(e.target.value)}
                                                disabled={selectedCategoryIdx === ""}
                                                className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-white appearance-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <option value="" disabled>
                                                    {selectedCategoryIdx === "" ? "-- Pilih Kategori --" : "-- Pilih Layanan --"}
                                                </option>
                                                {selectedCategoryIdx !== "" && ORDER_PRICING_LIST[Number(selectedCategoryIdx)].items.map((item, idx) => (
                                                    <option key={idx} value={idx}>{item.name}</option>
                                                ))}
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                                                <ChevronRight className="rotate-90" size={16} />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* UPLOAD DOKUMEN SECTION - UPDATED WITH FALLBACK */}
                                <div>
                                    <h4 className="text-white font-medium mb-4 flex items-center justify-between border-b border-white/5 pb-2">
                                        <div className="flex items-center gap-2">
                                            <UploadCloud size={18} className="text-yellow-500"/> Upload Dokumen
                                        </div>
                                    </h4>
                                    
                                    {/* MANUAL UPLOAD TOGGLE */}
                                    <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                                        <label className="flex items-start gap-3 cursor-pointer">
                                            <input 
                                                type="checkbox" 
                                                checked={useManualUpload}
                                                onChange={(e) => setUseManualUpload(e.target.checked)}
                                                className="mt-1 w-5 h-5 rounded border-slate-600 bg-slate-900 text-yellow-500 focus:ring-yellow-500 focus:ring-offset-slate-900"
                                            />
                                            <div>
                                                <span className="block text-white font-bold text-sm">Kesulitan Upload? Kirim Manual via WhatsApp</span>
                                                <span className="block text-slate-400 text-xs mt-1">
                                                    Centang opsi ini jika upload macet/gagal. Pesanan akan tetap dibuat, dan Anda bisa mengirim foto KTP/NPWP langsung ke WhatsApp Admin kami.
                                                </span>
                                            </div>
                                        </label>
                                    </div>

                                    {!useManualUpload && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
                                            {/* UPLOAD KTP */}
                                            <div>
                                                <label className="block text-slate-400 text-xs font-medium mb-2 ml-1">Upload KTP (Wajib)</label>
                                                <div className={`relative border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center transition-colors h-40 ${fileKTP ? 'border-yellow-500/50 bg-yellow-500/5' : 'border-white/10 hover:border-white/20 hover:bg-white/5'}`}>
                                                    <input 
                                                        type="file" 
                                                        onChange={handleFileKTPChange}
                                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                        accept=".jpg,.jpeg,.png,.pdf"
                                                    />
                                                    {fileKTP ? (
                                                        <div className="text-center">
                                                            <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center mx-auto mb-2 text-yellow-500">
                                                                <IdCardIcon size={20} />
                                                            </div>
                                                            <p className="text-white font-medium text-xs truncate max-w-[120px]">{fileKTP.name}</p>
                                                            <p className="text-slate-500 text-[10px] mt-1">Klik untuk ganti</p>
                                                        </div>
                                                    ) : (
                                                        <div className="text-center">
                                                            <IdCardIcon className="mx-auto text-slate-500 mb-2" size={24} />
                                                            <p className="text-slate-300 text-xs font-medium">Upload KTP</p>
                                                            <p className="text-slate-600 text-[10px] mt-1">JPG/PNG/PDF (Max 5MB)</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* UPLOAD NPWP */}
                                            <div>
                                                <label className="block text-slate-400 text-xs font-medium mb-2 ml-1">Upload NPWP (Wajib)</label>
                                                <div className={`relative border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center transition-colors h-40 ${fileNPWP ? 'border-yellow-500/50 bg-yellow-500/5' : 'border-white/10 hover:border-white/20 hover:bg-white/5'}`}>
                                                    <input 
                                                        type="file" 
                                                        onChange={handleFileNPWPChange}
                                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                        accept=".jpg,.jpeg,.png,.pdf"
                                                    />
                                                    {fileNPWP ? (
                                                        <div className="text-center">
                                                            <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center mx-auto mb-2 text-yellow-500">
                                                                <FileText size={20} />
                                                            </div>
                                                            <p className="text-white font-medium text-xs truncate max-w-[120px]">{fileNPWP.name}</p>
                                                            <p className="text-slate-500 text-[10px] mt-1">Klik untuk ganti</p>
                                                        </div>
                                                    ) : (
                                                        <div className="text-center">
                                                            <FileText className="mx-auto text-slate-500 mb-2" size={24} />
                                                            <p className="text-slate-300 text-xs font-medium">Upload NPWP</p>
                                                            <p className="text-slate-600 text-[10px] mt-1">JPG/PNG/PDF (Max 5MB)</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {useManualUpload && (
                                        <div className="p-4 rounded-xl border border-dashed border-green-500/30 bg-green-500/5 flex items-center gap-4 animate-fade-in">
                                            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 shrink-0">
                                                <MessageCircle size={24} />
                                            </div>
                                            <div>
                                                <p className="text-white font-bold text-sm">Mode Kirim Manual Aktif</p>
                                                <p className="text-slate-400 text-xs">
                                                    Anda tidak perlu mengupload file di sini. Setelah klik tombol di bawah, Anda akan diarahkan ke WhatsApp untuk mengirim dokumen.
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* KONTAK INFO */}
                                <div>
                                    <h4 className="text-white font-medium mb-4 flex items-center gap-2 border-b border-white/5 pb-2">
                                        <User size={18} className="text-yellow-500"/> Informasi Kontak
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <Input 
                                            label="Email Konfirmasi" 
                                            value={contactEmail} 
                                            onChange={(e) => setContactEmail(e.target.value)} 
                                            placeholder="contoh@email.com"
                                            icon={<Mail size={18} />} 
                                            required
                                        />
                                        <Input 
                                            label="Nomor WhatsApp / HP" 
                                            value={contactPhone} 
                                            onChange={(e) => setContactPhone(e.target.value)} 
                                            placeholder="08123456789"
                                            icon={<Phone size={18} />} 
                                            required
                                        />
                                    </div>
                                </div>

                                {/* ESTIMASI HARGA */}
                                {estimatedPrice && (
                                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 flex items-center gap-3 animate-fade-in">
                                        <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-500 shrink-0">
                                            <DollarSign size={20} />
                                        </div>
                                        <div>
                                            <p className="text-yellow-500/70 text-xs font-bold uppercase tracking-wider">Biaya Jasa Mulai Dari</p>
                                            <p className="text-xl font-bold text-white">{estimatedPrice}</p>
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-slate-400 text-sm font-medium mb-2 ml-1">Catatan Tambahan (Opsional)</label>
                                    <textarea 
                                        rows={3}
                                        value={orderNotes}
                                        onChange={(e) => setOrderNotes(e.target.value)}
                                        className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50"
                                        placeholder="Jelaskan detail kebutuhan spesifik Anda..."
                                    />
                                </div>

                                <div className="pt-2">
                                    {isSubmitting ? (
                                        <div className="w-full bg-yellow-500 rounded-full py-3 px-6 flex items-center justify-center gap-3 text-slate-950 font-bold transition-all">
                                            {uploadProgress > 0 && uploadProgress < 100 ? (
                                                <div className="flex-1 w-full h-full flex flex-col justify-center">
                                                    <div className="flex justify-between text-xs font-bold text-slate-900 mb-1 px-1">
                                                        <span>{statusText}</span>
                                                        <span>{Math.round(uploadProgress)}%</span>
                                                    </div>
                                                    <div className="w-full bg-black/20 rounded-full h-2 overflow-hidden">
                                                        <div 
                                                            className="bg-slate-900 h-full transition-all duration-300 ease-out" 
                                                            style={{ width: `${uploadProgress}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin shrink-0"></div>
                                                    <span className="truncate">{statusText || 'Memproses...'}</span>
                                                </>
                                            )}
                                        </div>
                                    ) : (
                                        <Button type="submit" className="w-full">
                                            {useManualUpload ? 'Buat Pesanan & Kirim Dokumen via WA' : 'Buat Pesanan Sekarang'}
                                        </Button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>
                );
            case 'orders':
                return (
                    <div className="space-y-6 animate-fade-in-up">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-bold text-white">Pesanan Saya</h2>
                                <p className="text-slate-400 text-sm">Riwayat transaksi dan status layanan Anda.</p>
                            </div>
                            <div className="relative hidden md:block">
                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input type="text" placeholder="Cari pesanan..." className="bg-white/5 border border-white/10 rounded-full pl-9 pr-4 py-1.5 text-sm text-white outline-none focus:border-yellow-500/50" />
                            </div>
                        </div>

                        <div className="glass-card rounded-2xl overflow-hidden border border-white/10">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-white/5 text-slate-400 text-xs uppercase tracking-wider">
                                        <tr>
                                            <th className="px-6 py-4 font-medium">ID Order</th>
                                            <th className="px-6 py-4 font-medium">Layanan & Dokumen</th>
                                            <th className="px-6 py-4 font-medium">Tanggal</th>
                                            <th className="px-6 py-4 font-medium">Harga</th>
                                            <th className="px-6 py-4 font-medium">Status</th>
                                            <th className="px-6 py-4 font-medium">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5 text-sm">
                                        {myOrders.length === 0 ? (
                                            <tr>
                                                <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                                                    Belum ada pesanan. Silakan buat pesanan baru.
                                                </td>
                                            </tr>
                                        ) : (
                                            myOrders.map((order: any) => (
                                                <tr key={order.id} className="hover:bg-white/5 transition-colors">
                                                    <td className="px-6 py-4 text-slate-300 font-mono">{order.id.substring(0, 8)}...</td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-white font-medium">{order.serviceName}</div>
                                                        <div className="flex gap-2 mt-1">
                                                            {order.ktpUrl && !order.ktpUrl.includes('WhatsApp') && (
                                                                <a href={order.ktpUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded text-yellow-500 flex items-center gap-1">
                                                                    <IdCardIcon size={10} /> KTP
                                                                </a>
                                                            )}
                                                            {order.ktpUrl && order.ktpUrl.includes('WhatsApp') && (
                                                                <span className="text-[10px] bg-green-500/10 text-green-500 px-2 py-0.5 rounded flex items-center gap-1">
                                                                     <MessageCircle size={10} /> Manual WA
                                                                </span>
                                                            )}
                                                            {order.npwpUrl && !order.npwpUrl.includes('WhatsApp') && (
                                                                <a href={order.npwpUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded text-blue-400 flex items-center gap-1">
                                                                    <FileText size={10} /> NPWP
                                                                </a>
                                                            )}
                                                            {/* Fallback for old data */}
                                                            {order.attachmentUrl && !order.ktpUrl && (
                                                                <a href={order.attachmentUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded text-slate-400 flex items-center gap-1">
                                                                    <FileText size={10} /> Dokumen
                                                                </a>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-slate-400">{order.date}</td>
                                                    <td className="px-6 py-4 text-slate-300 font-bold text-yellow-500">{order.price}</td>
                                                    <td className="px-6 py-4">{getStatusBadge(order.status)}</td>
                                                    <td className="px-6 py-4">
                                                        {/* LOGIKA TOMBOL AKSI */}
                                                        {order.status === 'Pending' && (
                                                            order.price === 'Menunggu Estimasi' ? (
                                                                <span className="text-xs text-slate-500 italic flex items-center gap-1">
                                                                    <AlertCircle size={12}/> Menunggu Admin
                                                                </span>
                                                            ) : (
                                                                <div className="flex items-center gap-2">
                                                                    <button 
                                                                        onClick={() => onCheckout(order)}
                                                                        className="flex items-center gap-1 text-xs bg-yellow-500/10 hover:bg-yellow-500 text-yellow-400 hover:text-slate-950 px-3 py-1.5 rounded-full border border-yellow-500/20 transition-all font-semibold"
                                                                    >
                                                                        <CreditCard size={12} /> Bayar
                                                                    </button>
                                                                </div>
                                                            )
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                );
            
            case 'referral':
                return (
                    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-white mb-2">Program Partner Unity</h2>
                            <p className="text-slate-400">Dapatkan penghasilan pasif dengan merekomendasikan layanan kami.</p>
                        </div>
                         <div className="glass-card p-8 rounded-3xl border border-yellow-500/20 relative overflow-hidden text-center">
                             <h3 className="text-xl font-bold text-white mb-6">Link Referral Unik Anda</h3>
                            <div className="max-w-xl mx-auto bg-slate-950 border border-dashed border-yellow-500/30 rounded-xl p-2 flex items-center shadow-lg relative z-10">
                                <div className="flex-1 px-4 text-sm md:text-base text-yellow-100 font-mono truncate">
                                    {referralLink}
                                </div>
                                <button onClick={copyReferral} className="bg-yellow-500 hover:bg-yellow-400 text-slate-950 px-6 py-3 rounded-lg font-bold transition-colors flex items-center gap-2">
                                    {copied ? <CheckCircle2 size={18} /> : <Copy size={18} />}
                                    {copied ? 'Disalin!' : 'Salin'}
                                </button>
                            </div>
                        </div>
                    </div>
                );
            
            case 'settings':
                return (
                     <div className="max-w-6xl mx-auto animate-fade-in-up pb-20">
                         {/* Header Section */}
                         <div className="flex flex-col md:flex-row gap-8 mb-8">
                             {/* Profile Card & Stats */}
                             <div className="w-full md:w-1/3 space-y-6">
                                 <div className="glass-card p-6 rounded-2xl border border-white/10 text-center relative overflow-hidden">
                                     <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-yellow-500/20 to-amber-600/20 z-0"></div>
                                     <div className="relative z-10">
                                         <div className="w-24 h-24 rounded-full bg-slate-900 border-4 border-slate-950 shadow-xl mx-auto mb-4 flex items-center justify-center text-3xl font-bold text-yellow-500">
                                             {profileData.name ? profileData.name.charAt(0).toUpperCase() : <User size={40} />}
                                         </div>
                                         <h3 className="text-xl font-bold text-white">{profileData.name || 'User'}</h3>
                                         <p className="text-slate-400 text-sm mb-4">{profileData.email}</p>
                                         <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-500/10 text-yellow-500 rounded-full text-xs font-bold uppercase tracking-wider border border-yellow-500/20">
                                             <ShieldCheck size={12} /> Partner Terverifikasi
                                         </div>
                                     </div>
                                 </div>

                                 {/* Stats Cards */}
                                 <div className="grid grid-cols-1 gap-4">
                                     <div className="glass-card p-4 rounded-xl flex items-center justify-between">
                                         <div>
                                             <p className="text-slate-400 text-xs">Total Order</p>
                                             <p className="text-2xl font-bold text-white">{myOrders.length}</p>
                                         </div>
                                         <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                                             <Package size={20} />
                                         </div>
                                     </div>
                                     <div className="glass-card p-4 rounded-xl flex items-center justify-between">
                                         <div>
                                             <p className="text-slate-400 text-xs">Total Afiliasi</p>
                                             <p className="text-2xl font-bold text-white">{affiliateCount}</p>
                                         </div>
                                         <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400">
                                             <Users size={20} />
                                         </div>
                                     </div>
                                     <div className="glass-card p-4 rounded-xl flex items-center justify-between border border-yellow-500/20 bg-yellow-500/5">
                                         <div>
                                             <p className="text-yellow-500/70 text-xs font-bold">Saldo Komisi</p>
                                             <p className="text-2xl font-bold text-white">Rp {walletBalance.toLocaleString()}</p>
                                         </div>
                                         <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                                             <Wallet size={20} />
                                         </div>
                                     </div>
                                 </div>
                             </div>

                             {/* Forms Section */}
                             <div className="w-full md:w-2/3 space-y-6">
                                <h2 className="text-2xl font-bold text-white mb-2">Pengaturan Lengkap</h2>
                                <p className="text-slate-400 text-sm mb-6">Kelola informasi pribadi dan detail pembayaran Anda.</p>

                                <form onSubmit={handleUpdateProfile} className="space-y-8">
                                    {/* PERSONAL INFO */}
                                    <div className="glass-card p-6 rounded-2xl border border-white/10">
                                        <h4 className="text-white font-bold mb-4 flex items-center gap-2 border-b border-white/5 pb-2">
                                            <User size={18} className="text-yellow-500"/> Data Pribadi & Perusahaan
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <Input label="Nama Lengkap" value={profileData.name} onChange={(e) => setProfileData({...profileData, name: e.target.value})} icon={<User size={18} />} />
                                            <Input label="Email" value={profileData.email} disabled className="opacity-50 cursor-not-allowed" icon={<Mail size={18} />} />
                                            <Input label="Nomor Telepon / WA" value={profileData.phone} onChange={(e) => setProfileData({...profileData, phone: e.target.value})} icon={<Phone size={18} />} />
                                            <Input label="Jabatan / Role" value={profileData.jobTitle} onChange={(e) => setProfileData({...profileData, jobTitle: e.target.value})} icon={<Briefcase size={18} />} placeholder="CEO / Founder / Staff" />
                                            <div className="md:col-span-2">
                                                <Input label="Nama Perusahaan (Opsional)" value={profileData.company} onChange={(e) => setProfileData({...profileData, company: e.target.value})} icon={<Building size={18} />} placeholder="PT Unity Group Indonesia" />
                                            </div>
                                            <div className="md:col-span-2">
                                                <Input label="Alamat Lengkap" value={profileData.address} onChange={(e) => setProfileData({...profileData, address: e.target.value})} icon={<MapPin size={18} />} placeholder="Jl. Sudirman No. 1..." />
                                            </div>
                                        </div>
                                    </div>

                                    {/* BANK ACCOUNT (For Affiliate) */}
                                    <div className="glass-card p-6 rounded-2xl border border-white/10">
                                        <h4 className="text-white font-bold mb-4 flex items-center gap-2 border-b border-white/5 pb-2">
                                            <Landmark size={18} className="text-yellow-500"/> Informasi Rekening (Untuk Pencairan Komisi)
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <Input label="Nama Bank" value={profileData.bankName} onChange={(e) => setProfileData({...profileData, bankName: e.target.value})} icon={<Building size={18} />} placeholder="BCA / Mandiri / BNI" />
                                            <Input label="Nomor Rekening" value={profileData.bankNumber} onChange={(e) => setProfileData({...profileData, bankNumber: e.target.value})} icon={<CreditCard size={18} />} placeholder="1234567890" />
                                            <div className="md:col-span-2">
                                                <Input label="Nama Pemilik Rekening" value={profileData.bankHolder} onChange={(e) => setProfileData({...profileData, bankHolder: e.target.value})} icon={<User size={18} />} placeholder="Sesuai Buku Tabungan" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* SECURITY MOCKUP */}
                                    <div className="glass-card p-6 rounded-2xl border border-white/10 opacity-70">
                                        <h4 className="text-white font-bold mb-4 flex items-center gap-2 border-b border-white/5 pb-2">
                                            <Key size={18} className="text-yellow-500"/> Keamanan Akun
                                        </h4>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-white">Password</p>
                                                <p className="text-xs text-slate-400">Terakhir diubah: 30 hari yang lalu</p>
                                            </div>
                                            <Button type="button" variant="outline" className="text-xs py-2 h-auto" onClick={() => alert("Fitur Reset Password akan dikirimkan ke email Anda.")}>
                                                Ubah Password
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="flex justify-end pt-4">
                                        <Button type="submit" disabled={isSubmitting} className="px-8 w-full md:w-auto">
                                            {isSubmitting ? 'Menyimpan...' : 'Simpan Semua Perubahan'}
                                        </Button>
                                    </div>
                                </form>
                             </div>
                         </div>
                     </div>
                );

            case 'dashboard':
            default:
                return (
                    <div className="space-y-8 animate-fade-in-up">
                        {/* (SAMA SEPERTI SEBELUMNYA) */}
                         <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-bold text-white mb-1">
                                    Halo, <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 to-amber-500">{profileData.name}</span> 👋
                                </h1>
                                <p className="text-slate-400">Selamat datang kembali di ekosistem bisnis Anda.</p>
                            </div>
                            <Button variant="primary" className="text-sm shadow-none" onClick={() => setActiveTab('create-order')}>
                                <Plus size={18} /> Buat Pesanan Baru
                            </Button>
                        </header>
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="glass-card p-6 rounded-2xl">
                                <div className="text-slate-400 text-sm font-medium mb-2">Total Pesanan</div>
                                <div className="text-4xl font-bold text-white mb-1">{myOrders.length}</div>
                            </div>
                            <div className="glass-card p-6 rounded-2xl">
                                <div className="text-slate-400 text-sm font-medium mb-2">Project Aktif</div>
                                <div className="text-4xl font-bold text-white mb-1">{myProjects.length}</div>
                            </div>
                         </div>

                         {myProjects.length > 0 && (
                            <div className="mt-8 animate-fade-in">
                                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                    <Activity className="text-yellow-500" /> Project Tracker
                                </h3>
                                <div className="space-y-6">
                                    {myProjects.map((project, index) => (
                                        <div key={index} className="glass-card p-6 rounded-xl border border-white/10">
                                            <div className="flex justify-between items-start mb-6">
                                                <div>
                                                    <h4 className="text-lg font-bold text-white">{project.projectName}</h4>
                                                    <p className="text-slate-400 text-sm">Update Terakhir: {new Date(project.lastUpdated).toLocaleString()}</p>
                                                </div>
                                                <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs font-bold border border-blue-500/20">
                                                    Sedang Berjalan
                                                </span>
                                            </div>

                                            <div className="relative flex justify-between items-center">
                                                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-800 -z-10"></div>
                                                
                                                {project.steps && project.steps.map((step: any, idx: number) => (
                                                    <div key={idx} className="flex flex-col items-center gap-2 bg-slate-950 px-2 z-10">
                                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${step.status === 'completed' ? 'border-green-500 bg-green-500/10 text-green-500' : step.status === 'active' ? 'border-yellow-500 bg-yellow-500/10 text-yellow-500 animate-pulse' : 'border-slate-700 bg-slate-900 text-slate-600'}`}>
                                                            {getStepIcon(step.status)}
                                                        </div>
                                                        <p className={`text-xs font-medium text-center max-w-[80px] ${step.status === 'completed' ? 'text-green-400' : step.status === 'active' ? 'text-yellow-400' : 'text-slate-600'}`}>
                                                            {step.name}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                         )}
                    </div>
                );
        }
    };
    
    // ... (Sidebar dan Return Structure)
    return (
        <div className="min-h-screen bg-slate-950 flex relative overflow-hidden">
             {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <aside className={`
                fixed md:static inset-y-0 left-0 z-50 w-64 bg-slate-950/90 backdrop-blur-xl border-r border-white/5 
                transform transition-transform duration-300 ease-in-out
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                <div className="h-full flex flex-col">
                    <div className="h-20 flex items-center px-6 border-b border-white/5">
                        <img src={content.logoUrl} alt="Logo" className="h-10 w-auto object-contain" />
                    </div>

                    <div className="flex-1 py-6 px-4 space-y-2">
                        <button onClick={() => { setActiveTab('dashboard'); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'dashboard' ? 'bg-white/5 text-yellow-400 border border-yellow-500/20' : 'text-slate-400 hover:text-white'}`}>
                            <LayoutDashboard size={20} /> Dashboard
                        </button>
                        <button onClick={() => { setActiveTab('orders'); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'orders' ? 'bg-white/5 text-yellow-400 border border-yellow-500/20' : 'text-slate-400 hover:text-white'}`}>
                            <Package size={20} /> Pesanan Saya
                        </button>
                        
                        <button onClick={() => { setActiveTab('referral'); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'referral' ? 'bg-white/5 text-yellow-400 border border-yellow-500/20' : 'text-slate-400 hover:text-white'}`}>
                            <Users size={20} /> Affiliate Partner
                        </button>
                        
                        <button onClick={() => { setActiveTab('settings'); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'settings' ? 'bg-white/5 text-yellow-400 border border-yellow-500/20' : 'text-slate-400 hover:text-white'}`}>
                            <Settings size={20} /> Pengaturan Akun
                        </button>
                    </div>
                    <div className="p-4 border-t border-white/5">
                        <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all">
                            <LogOut size={20} /> Keluar
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto h-screen relative">
                 <div className="md:hidden h-16 border-b border-white/5 flex items-center justify-between px-4 sticky top-0 bg-slate-950/80 backdrop-blur-md z-30">
                    <button onClick={() => setIsSidebarOpen(true)} className="text-white"><Menu /></button>
                </div>
                <div className="p-6 md:p-10 max-w-7xl mx-auto pb-20">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};
