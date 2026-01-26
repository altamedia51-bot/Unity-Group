import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  CreditCard, 
  ArrowLeft, 
  CheckCircle, 
  AlertCircle, 
  FileText,
  Lock
} from 'lucide-react';
import { Button } from './Button';
import { Order } from '../types';

interface CheckoutProps {
    order: Order;
    onBack: () => void;
    onPaymentSuccess: () => void;
}

// Extend Window interface for Midtrans Snap
declare global {
    interface Window {
        snap: any;
    }
}

export const Checkout: React.FC<CheckoutProps> = ({ order, onBack, onPaymentSuccess }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState<'idle' | 'success' | 'failed'>('idle');

    // Simulate getting Snap Token from Backend
    const handlePayment = async () => {
        setIsLoading(true);

        try {
            // NOTE: In production, fetch this token from your backend (Cloud Functions/Node.js)
            // const response = await fetch('/api/create-transaction', { method: 'POST', body: ... });
            // const { token } = await response.json();
            
            // For Demo: We'll simulate a token delay
            console.log("Requesting Snap Token for Order:", order.id);
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Mock interaction since we don't have a real backend token here
            // If you have a real token, uncomment below:
            /*
            window.snap.pay('YOUR_SNAP_TOKEN_HERE', {
                onSuccess: function(result: any){
                    setPaymentStatus('success');
                    onPaymentSuccess();
                },
                onPending: function(result: any){ console.log('pending'); },
                onError: function(result: any){ setPaymentStatus('failed'); },
                onClose: function(){ setIsLoading(false); }
            });
            */
            
            // Simulating Success for UI Demo
            const confirm = window.confirm("Simulasi Midtrans Popup: \nApakah Anda ingin menyelesaikan pembayaran?");
            if (confirm) {
                setPaymentStatus('success');
                setTimeout(() => {
                    onPaymentSuccess();
                }, 2000);
            } else {
                setIsLoading(false);
            }

        } catch (error) {
            console.error("Payment Error:", error);
            setPaymentStatus('failed');
            setIsLoading(false);
        }
    };

    if (paymentStatus === 'success') {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
                <div className="glass-card p-10 rounded-3xl max-w-md w-full text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-green-500/10 z-0"></div>
                    <div className="relative z-10">
                        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle size={40} className="text-green-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Pembayaran Berhasil!</h2>
                        <p className="text-slate-400 mb-8">Terima kasih. Pesanan Anda sedang diproses oleh tim kami.</p>
                        <Button onClick={onBack} variant="primary" className="w-full">
                            Kembali ke Dashboard
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#020617] text-white p-6 md:p-12 font-sans relative overflow-hidden">
            {/* Background Atmosphere */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-yellow-600/5 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-900/5 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="max-w-6xl mx-auto relative z-10">
                <button 
                    onClick={onBack}
                    className="flex items-center gap-2 text-slate-400 hover:text-yellow-400 transition-colors mb-8 group"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    Kembali ke Dashboard
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* LEFT COLUMN: Order Details */}
                    <div className="lg:col-span-7 space-y-6">
                        <div className="mb-4">
                            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Checkout</h1>
                            <p className="text-slate-400">Selesaikan pembayaran untuk mengaktifkan layanan.</p>
                        </div>

                        {/* Order Card */}
                        <div className="glass-card p-6 md:p-8 rounded-3xl border border-white/10">
                            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                                <FileText className="text-yellow-500" size={20} />
                                Rincian Pesanan
                            </h3>

                            <div className="space-y-6">
                                <div className="flex justify-between items-start pb-6 border-b border-white/5">
                                    <div>
                                        <p className="text-slate-400 text-sm mb-1">ID Transaksi</p>
                                        <p className="font-mono text-white">{order.id}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-slate-400 text-sm mb-1">Tanggal</p>
                                        <p className="text-white">{order.date}</p>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-slate-400 text-sm mb-2">Layanan</p>
                                    <h4 className="text-xl font-bold text-white">{order.serviceName}</h4>
                                    <p className="text-slate-500 text-sm mt-1">Paket lengkap termasuk konsultasi & pemberkasan.</p>
                                </div>

                                <div className="bg-white/5 rounded-xl p-4 flex items-start gap-3">
                                    <AlertCircle className="text-blue-400 shrink-0 mt-0.5" size={18} />
                                    <p className="text-sm text-slate-300">
                                        Pastikan data yang Anda masukkan sebelumnya sudah benar. Revisi setelah pembayaran mungkin dikenakan biaya tambahan.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Security Badge */}
                        <div className="flex items-center gap-4 text-slate-500 text-sm px-4">
                            <Lock size={16} />
                            <span>Pembayaran dienkripsi dengan standar keamanan 256-bit SSL.</span>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Payment Summary */}
                    <div className="lg:col-span-5">
                        <div className="glass-card p-6 md:p-8 rounded-3xl border border-yellow-500/20 sticky top-10 shadow-[0_0_50px_-20px_rgba(234,179,8,0.1)]">
                            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                                <CreditCard className="text-yellow-500" size={20} />
                                Ringkasan Pembayaran
                            </h3>

                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-slate-400">
                                    <span>Subtotal</span>
                                    <span>{order.price}</span>
                                </div>
                                <div className="flex justify-between text-slate-400">
                                    <span>Biaya Admin</span>
                                    <span>Rp 5.000</span>
                                </div>
                                <div className="flex justify-between text-slate-400">
                                    <span>Pajak (PPN 11%)</span>
                                    <span>Termasuk</span>
                                </div>
                                
                                <div className="h-px bg-white/10 my-4"></div>

                                <div className="flex justify-between items-center">
                                    <span className="font-semibold text-white">Total Tagihan</span>
                                    <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-amber-500 to-yellow-600 text-glow">
                                        {order.price}
                                    </span>
                                </div>
                            </div>

                            <Button 
                                onClick={handlePayment} 
                                disabled={isLoading}
                                className={`w-full py-4 text-lg shadow-[0_0_30px_rgba(234,179,8,0.3)] ${!isLoading ? 'animate-pulse-glow' : ''}`}
                            >
                                {isLoading ? (
                                    <span className="flex items-center gap-2">
                                        <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                                        Memproses...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2 justify-center">
                                        <ShieldCheck size={20} />
                                        Bayar Sekarang
                                    </span>
                                )}
                            </Button>
                            
                            <div className="mt-6 flex justify-center gap-4 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                                {/* Payment Logos Mockup */}
                                <div className="h-6 w-10 bg-white rounded"></div>
                                <div className="h-6 w-10 bg-white rounded"></div>
                                <div className="h-6 w-10 bg-white rounded"></div>
                                <div className="h-6 w-10 bg-white rounded"></div>
                            </div>
                            <p className="text-center text-xs text-slate-600 mt-4">Powered by Midtrans Payment Gateway</p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};