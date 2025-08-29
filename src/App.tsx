import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Destinations from './components/Destinations';
import VRExperience from './components/VRExperience';
import FeaturedVideo from './components/FeaturedVideo';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import AdminLogin from './components/AdminLogin';
import AdminPanel from './components/AdminPanel';
import AuthModal from './components/AuthModal';
import UserProfile from './components/UserProfile';
import VrTours from './pages/VrTours';
import AboutIndia from './pages/AboutIndia';
import Contact from './pages/Contact';
import type { Destination } from './components/Destinations';
import { useAuth } from './context/AuthContext';
import { signOutUser } from './api/auth';
import { useTranslation } from './context/TranslationContext';

function App() {
  console.log('App: component rendered');
  const { currentLanguage, setLanguage, t } = useTranslation();
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [isVRModalOpen, setIsVRModalOpen] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);

  const { currentUser, isAdmin, loading } = useAuth();
  console.log('App: auth context values', { currentUser, isAdmin, loading });

  const handleUserLogout = async () => {
    await signOutUser();
  };

  // Handle keyboard shortcut for admin access (Ctrl+Shift+A)
  React.useEffect(() => {
    console.log('App: useEffect for keyboard shortcut triggered', { isAdmin });
    const handleKeyPress = (e: KeyboardEvent) => {
      console.log('App: handleKeyPress triggered', { key: e.key, ctrlKey: e.ctrlKey, shiftKey: e.shiftKey });
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        console.log('App: Ctrl+Shift+A pressed', { isAdmin });
        if (isAdmin) {
          setShowAdminPanel(true);
        } else {
          setShowAdminLogin(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      console.log('App: cleaning up keyboard event listener');
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [isAdmin, setShowAdminPanel, setShowAdminLogin]);

  const handleVRExperience = (destination: Destination) => {
    setSelectedDestination(destination);
    setIsVRModalOpen(true);
  };

  const handleCloseVR = () => {
    setIsVRModalOpen(false);
    setSelectedDestination(null);
  };

  const handleAdminLoginSuccess = () => {
    setShowAdminLogin(false);
    setShowAdminPanel(true);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation
        currentLanguage={currentLanguage}
        onLanguageChange={setLanguage}
        isUserAuthenticated={!!currentUser}
        currentUser={currentUser}
        onShowAuth={() => setShowAuthModal(true)}
        onUserLogout={handleUserLogout}
        onShowProfile={() => setShowUserProfile(true)}
      />
      <div className="pb-nav md:pb-0"> {/* Remove top padding to allow transparent navbar */}
        <Routes>
          <Route path="/" element={
            <>
              <Hero />
              <Destinations onVRExperience={handleVRExperience} />
              <FeaturedVideo />
              <Testimonials />
            </>
          } />
          <Route path="/vr-tours" element={<VrTours />} />
          <Route path="/about-india" element={<AboutIndia />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>

      <Footer />

      <VRExperience
        destination={selectedDestination}
        isOpen={isVRModalOpen}
        onClose={handleCloseVR}
      />

      {/* Admin Login Modal */}
      {showAdminLogin && (
        <AdminLogin onLoginSuccess={handleAdminLoginSuccess} />
      )}

      {/* User Auth Modal */}
      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onAuthSuccess={() => setShowAuthModal(false)}
        />
      )}

      {/* User Profile */}
      {currentUser && (
        <UserProfile
          isOpen={showUserProfile}
          onClose={() => setShowUserProfile(false)}
        />
      )}

      {/* Admin Panel */}
      {isAdmin && (
        <AdminPanel
          isOpen={showAdminPanel}
          onClose={() => setShowAdminPanel(false)}
        />
      )}

      {/* Admin Access Button (only show when authenticated as admin) */}
      {isAdmin && !showAdminPanel && (
        <button
          onClick={() => setShowAdminPanel(true)}
          className="fixed bottom-4 right-4 bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-full shadow-lg transition-all z-40"
          title="Open Admin Panel (Ctrl+Shift+A)"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.06 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 01.06-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      )}
    </div>
  );
}

export default App;