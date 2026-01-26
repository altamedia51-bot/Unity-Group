import React, { useState } from 'react';
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
  XCircle,
  Menu,
  X,
  CreditCard
} from 'lucide-react';
import { Button } from './Button';
import { Order } from '../types';

interface DashboardProps {
    user: any;
    onLogout: () => void;
    onCheckout: (order: Order) => void;
}

const MOCK_ORDERS: Order[] = [
    { id: 'ORD-001', serviceName: 'Pendirian PT Perorangan', date: '20 Okt 2023', status: 'Selesai', price: 'Rp 2.500.000' },
    { id: 'ORD-002', serviceName: 'Paket Umroh Premium', date: '25 Okt 2023', status: 'Proses', price: 'Rp 35.000.000' },
    { id: 'ORD-003', serviceName: 'Desain Arsitektur Rumah', date: '01 Nov 2023', status: 'Pending', price: 'Rp 15.000.000' },
];

export const Dashboard: React.FC<DashboardProps> = ({ user, onLogout, onCheckout }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const referralLink = "https://unitygroup.id/ref/john-doe";

    const copyReferral = () => {
        navigator.clipboard.writeText(referralLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

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
                        <div className="w-8 h-8 rounded bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center font-bold text-slate-950 text-sm mr-2">U</div>
                        <span className="font-bold text-white text-lg tracking-wide">UNITY MEMBER</span>
                    </div>

                    <div className="flex-1 py-6 px-4 space-y-2">
                        <button className="w-full flex items-center gap-3 px-4 py-3 bg-white/5 text-yellow-400 rounded-xl font-medium border border-yellow-500/20 shadow-[0_0_15px_rgba(234,179,8,0.1)]">
                            <LayoutDashboard size={20} />
                            Dashboard
                        </button>
                        <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                            <Package size={20} />
                            Pesanan Saya
                        </button>
                        <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                            <Users size={20} />
                            Referral
                        </button>
                        <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                            <Settings size={20} />
                            Pengaturan
                        </button>
                    </div>

                    <div className="p-4 border-t border-white/5">
                        <button 
                            onClick={onLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                        >
                            <LogOut size={20} />
                            Keluar
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto h-screen relative">
                 {/* Topbar Mobile */}
                 <div className="md:hidden h-16 border-b border-white/5 flex items-center justify-between px-4 sticky top-0 bg-slate-950/80 backdrop-blur-md z-30">
                    <button onClick={() => setIsSidebarOpen(true)} className="text-white">
                        <Menu />
                    </button>
                    <span className="font-bold text-white">Dashboard</span>
                    <div className="w-8"></div>
                </div>

                <div className="p-6 md:p-10 max-w-7xl mx-auto pb-20">
                    {/* Header */}
                    <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-1">
                                Halo, <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 to-amber-500">{user?.displayName || 'Partner'}</span> 👋
                            </h1>
                            <p className="text-slate-400">Selamat datang kembali di ekosistem bisnis Anda.</p>
                        </div>
                        <Button variant="primary" className="text-sm shadow-none">
                            + Buat Pesanan Baru
                        </Button>
                    </header>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                        <div className="glass-card p-6 rounded-2xl relative overflow-hidden group">
                            <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Briefcase size={80} className="text-yellow-500" />
                            </div>
                            <div className="relative z-10">
                                <div className="text-slate-400 text-sm font-medium mb-2">Total Pesanan</div>
                                <div className="text-4xl font-bold text-white mb-1">12</div>
                                <div className="text-green-400 text-xs flex items-center gap-1">
                                    <CheckCircle2 size={12} /> 2 Selesai bulan ini
                                </div>
                            </div>
                        </div>

                        <div className="glass-card p-6 rounded-2xl relative overflow-hidden group">
                            <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Clock size={80} className="text-blue-500" />
                            </div>
                            <div className="relative z-10">
                                <div className="text-slate-400 text-sm font-medium mb-2">Project Aktif</div>
                                <div className="text-4xl font-bold text-white mb-1">3</div>
                                <div className="text-blue-400 text-xs">Sedang dikerjakan</div>
                            </div>
                        </div>

                        <div className="glass-card p-6 rounded-2xl relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent"></div>
                            <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Wallet size={80} className="text-yellow-400" />
                            </div>
                            <div className="relative z-10">
                                <div className="text-yellow-500/80 text-sm font-medium mb-2">Komisi Referral</div>
                                <div className="text-4xl font-bold text-yellow-400 text-glow mb-1">Rp 2.5jt</div>
                                <div className="text-slate-400 text-xs">Siap dicairkan</div>
                            </div>
                        </div>
                    </div>

                    {/* Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        
                        {/* Left Column: Recent Orders */}
                        <div className="lg:col-span-2">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-white">Pesanan Terakhir</h3>
                                <button className="text-sm text-yellow-400 hover:text-yellow-300">Lihat Semua</button>
                            </div>
                            <div className="glass-card rounded-3xl overflow-hidden border border-white/5">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead className="bg-white/5 text-slate-400 text-xs uppercase tracking-wider">
                                            <tr>
                                                <th className="px-6 py-4 font-medium">ID Order</th>
                                                <th className="px-6 py-4 font-medium">Layanan</th>
                                                <th className="px-6 py-4 font-medium">Tanggal</th>
                                                <th className="px-6 py-4 font-medium">Harga</th>
                                                <th className="px-6 py-4 font-medium">Status</th>
                                                <th className="px-6 py-4 font-medium">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5 text-sm">
                                            {MOCK_ORDERS.map((order) => (
                                                <tr key={order.id} className="hover:bg-white/5 transition-colors">
                                                    <td className="px-6 py-4 text-slate-300 font-mono">{order.id}</td>
                                                    <td className="px-6 py-4 text-white font-medium">{order.serviceName}</td>
                                                    <td className="px-6 py-4 text-slate-400">{order.date}</td>
                                                    <td className="px-6 py-4 text-slate-300">{order.price}</td>
                                                    <td className="px-6 py-4">
                                                        {getStatusBadge(order.status)}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {order.status === 'Pending' && (
                                                            <button 
                                                                onClick={() => onCheckout(order)}
                                                                className="flex items-center gap-1 text-xs bg-yellow-500/10 hover:bg-yellow-500 text-yellow-400 hover:text-slate-950 px-3 py-1.5 rounded-full border border-yellow-500/20 transition-all font-semibold"
                                                            >
                                                                <CreditCard size={12} />
                                                                Bayar
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Referral & Profile */}
                        <div className="space-y-8">
                            {/* Referral Box */}
                            <div className="glass-card p-6 rounded-3xl border border-yellow-500/20 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-2xl"></div>
                                
                                <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                                    <Users size={18} className="text-yellow-500" /> Program Referral
                                </h3>
                                <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                                    Bagikan link ini kepada rekan bisnis Anda dan dapatkan komisi hingga 10% untuk setiap transaksi sukses.
                                </p>

                                <div className="bg-slate-950/50 border border-dashed border-yellow-500/30 rounded-xl p-1 flex items-center">
                                    <div className="flex-1 px-3 text-xs md:text-sm text-slate-300 truncate font-mono">
                                        {referralLink}
                                    </div>
                                    <button 
                                        onClick={copyReferral}
                                        className="bg-yellow-500 hover:bg-yellow-400 text-slate-950 p-2 rounded-lg transition-colors"
                                    >
                                        {copied ? <CheckCircle2 size={18} /> : <Copy size={18} />}
                                    </button>
                                </div>
                            </div>

                            {/* Help Box */}
                            <div className="glass-card p-6 rounded-3xl text-center">
                                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                                    ?
                                </div>
                                <h3 className="text-white font-bold mb-2">Butuh Bantuan?</h3>
                                <p className="text-slate-400 text-sm mb-4">
                                    Tim konsultan kami siap membantu Anda 24/7 via WhatsApp.
                                </p>
                                <Button variant="outline" className="w-full text-sm py-2">
                                    Chat Support
                                </Button>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
};