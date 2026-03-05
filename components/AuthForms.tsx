
import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, AlertCircle, User, Briefcase } from 'lucide-react';
import { Button } from './Button';
import { Input } from './Input';
import { auth, db } from '../firebase';
// Removed modular imports as we are using compat auth instance methods
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { useContent } from '../contexts/ContentContext';

interface AuthProps {
  onLoginSuccess: (role?: 'user' | 'admin', userData?: { uid: string; name: string; email: string; phone?: string }) => void;
  onCancel: () => void;
}

export const AuthForms: React.FC<AuthProps> = ({ onLoginSuccess, onCancel }) => {
  const { content } = useContent(); 
  const [isLogin, setIsLogin] = useState(true); // Toggle Login/Register
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  });

  const syncUserToFirestore = async (user: any, name: string, role: 'user' | 'admin') => {
      try {
          const userRef = doc(db, "users", user.uid);
          // Kita gunakan setDoc dengan merge: true agar data tidak tertimpa total jika sudah ada
          // PENTING: Jika email mengandung 'admin', paksa role jadi admin di database
          const finalRole = user.email && user.email.toLowerCase().includes('admin') ? 'admin' : role;

          await setDoc(userRef, {
              uid: user.uid,
              displayName: name || user.displayName || 'User',
              email: user.email,
              role: finalRole,
              createdAt: serverTimestamp(),
              phoneNumber: formData.phone || user.phoneNumber || '',
              photoURL: user.photoURL || `https://ui-avatars.com/api/?name=${name || 'User'}&background=random`
          }, { merge: true });
          
          return finalRole;
      } catch (err) {
          console.error("Failed to sync user to firestore", err);
          return role;
      }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    // --- DETEKSI API KEY PLACEHOLDER ---
    const apiKey = (auth?.app?.options as any)?.apiKey;
    const isPlaceholderKey = !auth || apiKey === "API_KEY_ANDA_DISINI" || apiKey.includes("DEMO_KEY");

    if (isPlaceholderKey) {
         await new Promise(resolve => setTimeout(resolve, 1000));
         const isAdmin = formData.email.toLowerCase().includes('admin');
         onLoginSuccess(isAdmin ? 'admin' : 'user', {
             uid: isLogin ? 'USER-DEMO' : `NEW-${Date.now()}`,
             name: formData.name || (isAdmin ? 'Administrator' : 'Pengguna Baru'),
             email: formData.email,
             phone: formData.phone
         });
         return;
    }

    try {
        let user;
        let role: 'user' | 'admin' = 'user';

        if (isLogin) {
            // LOGIN
            const userCredential = await auth.signInWithEmailAndPassword(formData.email, formData.password);
            user = userCredential.user;
            
            if (!user) throw new Error("Login failed");

            // Cek Role dari Database Firestore (LEBIH AKURAT)
            const userRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userRef);
            
            if (userSnap.exists()) {
                const userData = userSnap.data();
                role = userData.role || 'user';
            } else {
                // Jika tidak ada di DB, cek email
                const isAdmin = user.email?.toLowerCase().includes('admin');
                role = isAdmin ? 'admin' : 'user';
                // Sync user lama yang belum ada di DB
                await syncUserToFirestore(user, user.displayName || 'User', role);
            }

        } else {
            // REGISTER
            const userCredential = await auth.createUserWithEmailAndPassword(formData.email, formData.password);
            user = userCredential.user;

            if (!user) throw new Error("Registration failed");
            
            // Compat style updateProfile
            if (formData.name) await user.updateProfile({ displayName: formData.name });

            // LOGIKA PENTING: Jika email mengandung kata 'admin', otomatis jadi ADMIN
            const isAdmin = formData.email.toLowerCase().includes('admin');
            role = isAdmin ? 'admin' : 'user';

            // Simpan ke Firestore
            const confirmedRole = await syncUserToFirestore(user, formData.name, role);
            role = confirmedRole;
        }
        
        onLoginSuccess(role, {
            uid: user.uid,
            name: user.displayName || formData.name || 'User',
            email: user.email || '',
        });

    } catch (error: any) {
        console.error("Auth Error:", error);
        
        // --- ERROR MESSAGES ---
        let message = "Terjadi kesalahan pada sistem autentikasi.";
        
        if (error.code === 'auth/invalid-credential' || error.message.includes('invalid-credential')) {
             message = "Email atau password salah. Pastikan Anda memasukkan data dengan benar.";
        } else if (error.code === 'auth/user-not-found') {
            message = "Akun tidak ditemukan. Silakan daftar terlebih dahulu.";
        } else if (error.code === 'auth/wrong-password') {
            message = "Password salah. Silakan coba lagi.";
        } else if (error.code === 'auth/email-already-in-use') {
            message = "Email ini sudah terdaftar. Silakan login.";
        } else if (error.code === 'auth/weak-password') {
            message = "Password terlalu lemah (min. 6 karakter).";
        } else if (error.code === 'auth/network-request-failed') {
            message = "Gangguan koneksi internet. Silakan coba lagi.";
        } else if (error.code === 'auth/operation-not-allowed') {
             message = "Login Email/Password belum diaktifkan di Firebase Console.";
        } else if (error.code === 'auth/too-many-requests') {
             message = "Terlalu banyak percobaan gagal. Silakan tunggu beberapa saat.";
        }

        setErrorMsg(message);
        setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errorMsg) setErrorMsg(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-slate-950">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-yellow-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        <button 
            onClick={onCancel}
            className="mb-6 text-slate-400 hover:text-white flex items-center gap-2 text-sm transition-colors"
        >
            &larr; Kembali ke Website
        </button>

        <div className="glass-card p-8 md:p-10 rounded-3xl shadow-2xl border-white/10">
          <div className="text-center mb-8">
            <div className="mb-4 flex justify-center">
                 <img 
                    src={content.logoUrl} 
                    alt="Logo" 
                    className="h-16 w-auto object-contain" 
                />
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-2">
               {isLogin ? 'Selamat Datang' : 'Buat Akun Baru'}
            </h2>
            <p className="text-slate-400 text-sm">
              {isLogin ? 'Masuk untuk mengelola pesanan Anda.' : 'Bergabunglah menjadi mitra Unity Group.'}
            </p>
          </div>

          {errorMsg && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 text-red-400 text-sm animate-fade-in">
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {!isLogin && (
                <Input 
                  label="Nama Lengkap" 
                  name="name" 
                  type="text" 
                  placeholder="John Doe"
                  icon={<User size={18} />}
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
            )}

            <Input 
              label="Email" 
              name="email" 
              type="email" 
              placeholder={!isLogin ? "Gunakan 'admin' di email untuk jadi Admin" : "nama@email.com"}
              icon={<Mail size={18} />}
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

            {!isLogin && (
                <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-xs text-yellow-500">
                    💡 Tips: Daftarkan email dengan kata <b>"admin"</b> (contoh: admin_saya@gmail.com) untuk otomatis mendapatkan akses <b>Administrator</b>.
                </div>
            )}

            <Button 
              type="submit" 
              variant="primary" 
              className="w-full mt-2"
              disabled={loading}
            >
              {loading ? 'Memproses...' : (isLogin ? 'Masuk Sekarang' : 'Daftar Akun')}
              {!loading && <ArrowRight size={18} />}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10 text-center">
              <p className="text-slate-400 text-sm">
                  {isLogin ? 'Belum punya akun? ' : 'Sudah punya akun? '}
                  <button 
                    onClick={() => { setIsLogin(!isLogin); setErrorMsg(null); }}
                    className="text-yellow-400 hover:text-yellow-300 font-semibold transition-colors"
                  >
                      {isLogin ? 'Daftar di sini' : 'Masuk di sini'}
                  </button>
              </p>
          </div>
        </div>
      </div>
    </div>
  );
};
