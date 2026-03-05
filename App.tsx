
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import WhyUs from './components/WhyUs';
import Footer from './components/Footer';
import { AuthForms } from './components/AuthForms';
import { AdminDashboard } from './components/AdminDashboard';
import { Dashboard } from './components/Dashboard'; // Client Dashboard
import { UserProfile, Order } from './types';
import { ContentProvider } from './contexts/ContentContext';
import { SeasonalBanner } from './components/SeasonalBanner'; 
import { Documentation } from './components/Documentation';
import { Testimonials } from './components/Testimonials';
import { FloatingContacts } from './components/FloatingContacts';
import { Checkout } from './components/Checkout';

type ViewState = 'landing' | 'login' | 'admin' | 'client' | 'checkout';

function App() {
  const [currentView, setCurrentView] = useState<ViewState>('landing');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [checkoutOrder, setCheckoutOrder] = useState<Order | null>(null);

  const handleLoginSuccess = (role: 'user' | 'admin' = 'user', userData?: { uid: string; name: string; email: string; phone?: string }) => {
    const uid = userData?.uid || 'USR-UNKNOWN';
    
    setCurrentUser({
        uid: uid,
        displayName: userData?.name || (role === 'admin' ? 'Administrator' : 'User'),
        email: userData?.email || '',
        role: role,
        phoneNumber: userData?.phone
    });

    // Arahkan sesuai Role
    if (role === 'admin') {
        setCurrentView('admin');
    } else {
        setCurrentView('client');
    }
  };

  const handleLogout = () => {
      import('./firebase').then(({ auth }) => {
          if(auth) auth.signOut();
      });
      setCurrentUser(null);
      setCurrentView('landing');
  };

  const handleCheckout = (order: Order) => {
      setCheckoutOrder(order);
      setCurrentView('checkout');
  };

  const renderContent = () => {
    switch(currentView) {
        case 'admin':
            return <AdminDashboard onLogout={handleLogout} />;

        case 'client':
            return <Dashboard user={currentUser} onLogout={handleLogout} onCheckout={handleCheckout} />;

        case 'checkout':
            if (!checkoutOrder) return <Dashboard user={currentUser} onLogout={handleLogout} onCheckout={handleCheckout} />;
            return (
                <Checkout 
                    order={checkoutOrder} 
                    onBack={() => setCurrentView('client')}
                    onPaymentSuccess={() => {
                        // Refresh logic could go here
                    }}
                />
            );

        case 'login':
            return <AuthForms onLoginSuccess={handleLoginSuccess} onCancel={() => setCurrentView('landing')} />;
        
        case 'landing':
        default:
            return (
                <>
                    <Navbar onNavigate={(view) => setCurrentView(view as any)} />
                    <main>
                        <SeasonalBanner /> 
                        <Hero />
                        <Services />
                        <WhyUs />
                        <Documentation />
                        <Testimonials />
                        <FloatingContacts />
                    </main>
                    <Footer onNavigate={(view) => setCurrentView(view as any)} />
                </>
            );
    }
  };

  return (
    <ContentProvider>
        <div className="bg-slate-950 min-h-screen text-white font-sans selection:bg-yellow-500/30 selection:text-yellow-200">
        {renderContent()}
        </div>
    </ContentProvider>
  );
}

export default App;
