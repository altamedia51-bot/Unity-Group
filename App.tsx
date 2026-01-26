import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import WhyUs from './components/WhyUs';
import Footer from './components/Footer';
import { AuthForms } from './components/AuthForms';
import { Dashboard } from './components/Dashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { Checkout } from './components/Checkout';
import { UserProfile, Order } from './types';

type ViewState = 'landing' | 'login' | 'register' | 'dashboard' | 'admin' | 'checkout';

function App() {
  const [currentView, setCurrentView] = useState<ViewState>('landing');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const handleLoginSuccess = (role: 'user' | 'admin' = 'user') => {
    setCurrentUser({
        uid: role === 'admin' ? 'ADM-001' : 'USR-123',
        displayName: role === 'admin' ? 'Admin Officer' : 'John Doe',
        email: role === 'admin' ? 'admin@unity.id' : 'john@example.com',
        role: role,
        referralCode: role === 'user' ? 'UNITY-JOHN' : undefined
    });

    if (role === 'admin') {
        setCurrentView('admin');
    } else {
        setCurrentView('dashboard');
    }
  };

  const handleLogout = () => {
      setCurrentUser(null);
      setCurrentView('landing');
  };

  const handleCheckout = (order: Order) => {
      setSelectedOrder(order);
      setCurrentView('checkout');
  };

  const renderContent = () => {
    switch(currentView) {
        case 'admin':
            return <AdminDashboard onLogout={handleLogout} />;

        case 'dashboard':
            return <Dashboard user={currentUser} onLogout={handleLogout} onCheckout={handleCheckout} />;
        
        case 'checkout':
            if (!selectedOrder) return <Dashboard user={currentUser} onLogout={handleLogout} onCheckout={handleCheckout} />;
            return (
                <Checkout 
                    order={selectedOrder} 
                    onBack={() => setCurrentView('dashboard')} 
                    onPaymentSuccess={() => setCurrentView('dashboard')}
                />
            );

        case 'login':
            return <AuthForms mode="login" onLoginSuccess={handleLoginSuccess} onSwitchMode={setCurrentView} />;
        
        case 'register':
            return <AuthForms mode="register" onLoginSuccess={handleLoginSuccess} onSwitchMode={setCurrentView} />;
        
        case 'landing':
        default:
            return (
                <>
                    <Navbar onNavigate={setCurrentView} />
                    <main>
                        <Hero />
                        <Services />
                        <WhyUs />
                    </main>
                    <Footer />
                </>
            );
    }
  };

  return (
    <div className="bg-slate-950 min-h-screen text-white font-sans selection:bg-yellow-500/30 selection:text-yellow-200">
      {renderContent()}
    </div>
  );
}

export default App;