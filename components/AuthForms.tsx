import React, { useState } from 'react';
import { Mail, Lock, User, Phone, ArrowRight, Shield } from 'lucide-react';
import { Button } from './Button';
import { Input } from './Input';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

interface AuthProps {
  onLoginSuccess: (role?: 'user' | 'admin') => void;
  onSwitchMode: (mode: 'login' | 'register' | 'landing') => void;
  mode: 'login' | 'register';
}

export const AuthForms: React.FC<AuthProps> = ({ onLoginSuccess, onSwitchMode, mode }) => {
  const [loading, setLoading] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
        // BYPASS LOGIC: 
        // Jika sedang mode Admin ATAU Firebase belum dikonfigurasi, 
        // kita anggap login sukses (Simulasi Demo)
        if (isAdminMode || !auth) {
            setTimeout(() => {
                onLoginSuccess(isAdminMode ? 'admin' : 'user');
                setLoading(false);
            }, 1000);
            return;
        }

        // Logika Login User Biasa (Hanya jalan jika Firebase sudah aktif)
        if (mode === 'login') {
            await signInWithEmailAndPassword(auth, formData.email, formData.password);
        } else {
            const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
            await updateProfile(userCredential.user, {
                displayName: formData.name
            });
        }
        
        onLoginSuccess('user');
    } catch (error: any) {
        // Jika error karena API Key invalid, kita fallback ke demo mode untuk user biasa juga
        if (error.code === 'auth/invalid-api-key' || error.message.includes('API key')) {
             setTimeout(() => {
                onLoginSuccess('user');
                setLoading(false);
            }, 1000);
            return;
        }
        
        alert("Terjadi kesalahan: " + error.message);
        setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-slate-950">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-yellow-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        <button 
            onClick={() => onSwitchMode('landing')}
            className="mb-6 text-slate-400 hover:text-white flex items-center gap-2 text-sm transition-colors"
        >
            &larr; Kembali ke Beranda
        </button>

        <div className={`glass-card p-8 md:p-10 rounded-3xl shadow-2xl shadow-black/50 transition-all duration-500 ${isAdminMode ? 'border-red-500/30' : ''}`}>
          <div className="text-center mb-8">
            <div 
                onClick={() => setIsAdminMode(!isAdminMode)}
                className={`cursor-pointer inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 font-bold text-slate-950 text-2xl transition-all duration-300 ${isAdminMode ? 'bg-gradient-to-br from-red-500 to-red-700 shadow-lg shadow-red-500/30' : 'bg-gradient-to-br from-yellow-400 to-amber-600'}`}
            >
              {isAdminMode ? <Shield size={24} className="text-white" /> : 'U'}
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {isAdminMode ? 'Admin Console' : (mode === 'login' ? 'Selamat Datang Kembali' : 'Bergabung Bersama Kami')}
            </h2>
            <p className="text-slate-400 text-sm">
              {isAdminMode 
                ? 'Authorized personnel only.'
                : (mode === 'login' 
                    ? 'Masuk untuk mengakses dashboard dan layanan.' 
                    : 'Buat akun untuk memulai perjalanan bisnis Anda.')}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {mode === 'register' && !isAdminMode && (
              <>
                <Input 
                  label="Nama Lengkap" 
                  name="name" 
                  placeholder="John Doe" 
                  icon={<User size={18} />}
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <Input 
                  label="Nomor WhatsApp" 
                  name="phone" 
                  placeholder="0812..." 
                  type="tel"
                  icon={<Phone size={18} />}
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </>
            )}
            
            <Input 
              label={isAdminMode ? "Admin ID / Email" : "Email Address"} 
              name="email" 
              type="email" 
              placeholder={isAdminMode ? "admin@unitygroup.id" : "nama@email.com"}
              icon={isAdminMode ? <Shield size={18} /> : <Mail size={18} />}
              value={formData.email}
              onChange={handleChange}
              required
            />
            
            <Input 
              label="Password" 
              name="password" 
              type="password" 
              placeholder="••••••••" 
              icon={<Lock size={18} />}
              value={formData.password}
              onChange={handleChange}
              required
            />

            <Button 
              type="submit" 
              variant="primary" 
              className={`w-full mt-6 shadow-lg ${isAdminMode ? 'from-red-600 via-red-500 to-red-700 hover:shadow-red-500/30 text-white border-none' : 'shadow-yellow-500/20'}`}
              disabled={loading}
            >
              {loading ? 'Memproses...' : (mode === 'login' ? 'Masuk Sekarang' : 'Daftar Sekarang')}
              {!loading && <ArrowRight size={18} />}
            </Button>
          </form>

          {!isAdminMode && (
            <div className="mt-6 text-center">
                <p className="text-slate-400 text-sm">
                {mode === 'login' ? 'Belum punya akun? ' : 'Sudah punya akun? '}
                <button 
                    onClick={() => onSwitchMode(mode === 'login' ? 'register' : 'login')}
                    className="text-yellow-400 font-semibold hover:text-yellow-300 transition-colors"
                >
                    {mode === 'login' ? 'Daftar di sini' : 'Masuk di sini'}
                </button>
                </p>
            </div>
          )}
          
          {isAdminMode && (
              <div className="mt-6 text-center">
                  <button 
                    onClick={() => setIsAdminMode(false)}
                    className="text-slate-500 hover:text-white text-xs"
                  >
                      Cancel Admin Access
                  </button>
              </div>
          )}
        </div>
      </div>
    </div>
  );
};