import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function AuthModal() {
  const { 
    isAuthModalOpen, 
    authMode, 
    authPromptMessage,
    setAuthMode, 
    closeAuthModal, 
    login, 
    register, 
    loginWithGoogle,
    loginAsDemo 
  } = useAuth();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [regForm, setRegForm] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    craftInterests: 'Dokra Brass, Cheriyal Scrolls',
    password: ''
  });

  const [artisanForm, setArtisanForm] = useState({
    name: '',
    craft: 'Dokra Bell Metal Craft',
    village: 'Oushapur, Telangana',
    experience: '25+ Years',
    phone: ''
  });

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!identifier) {
      alert('Please enter your Email or Mobile Number');
      return;
    }
    login(identifier, password);
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!regForm.name || !regForm.email || !regForm.phone) {
      alert('Please fill in required fields: Name, Email, and Phone number');
      return;
    }
    register({
      name: regForm.name,
      email: regForm.email,
      phone: regForm.phone,
      city: regForm.city,
      craftInterests: regForm.craftInterests.split(',').map(s => s.trim())
    });
  };

  const handleArtisanSubmit = (e) => {
    e.preventDefault();
    if (!artisanForm.name || !artisanForm.phone) {
      alert('Please enter your Name and Mobile Number');
      return;
    }
    register({
      name: artisanForm.name,
      email: `${artisanForm.name.toLowerCase().replace(/\s+/g, '')}@artisan.kalaakshi.in`,
      phone: artisanForm.phone,
      city: artisanForm.village,
      role: 'master_artisan',
      craft: artisanForm.craft
    });
  };

  return (
    <div className="modal-backdrop" onClick={closeAuthModal}>
      <div className="modal-sheet auth-modal-sheet" onClick={e => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={closeAuthModal} aria-label="Close modal">×</button>

        <div className="auth-header">
          <div className="auth-brand-logo">
            <span className="logo-symbol">
              <span className="logo-dot"></span>
            </span>
            <span className="nav-logo-text">కళాక్షి ACCOUNT</span>
          </div>
          <p className="auth-header-sub">Access your event passes, artisan provenance certificates & orders</p>
        </div>

        {/* PROMPT BANNER FOR STRICT LOGIN */}
        {authPromptMessage && (
          <div className="auth-required-banner">
            <span className="banner-icon">🔐</span>
            <div className="banner-text">
              <strong>LOGIN REQUIRED:</strong>
              <p>{authPromptMessage}</p>
            </div>
          </div>
        )}

        {/* AUTH TABS */}
        <div className="auth-tabs-nav">
          <button 
            type="button"
            className={`auth-tab-btn ${authMode === 'login' ? 'active' : ''}`}
            onClick={() => setAuthMode('login')}
          >
            Sign In
          </button>
          <button 
            type="button"
            className={`auth-tab-btn ${authMode === 'register' ? 'active' : ''}`}
            onClick={() => setAuthMode('register')}
          >
            Create Account
          </button>
          <button 
            type="button"
            className={`auth-tab-btn ${authMode === 'artisan' ? 'active' : ''}`}
            onClick={() => setAuthMode('artisan')}
          >
            Artisan Portal 🎨
          </button>
        </div>

        {/* GOOGLE SIGN IN BUTTON (FOR PATRON / REGULAR SIGN IN) */}
        {authMode !== 'artisan' && (
          <div className="oauth-container">
            <button 
              type="button" 
              className="google-auth-btn"
              onClick={loginWithGoogle}
            >
              <svg className="google-icon" viewBox="0 0 24 24" width="20" height="20">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.26 21.36 7.33 24 12 24z"/>
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.99 0 12s.46 3.84 1.26 5.42l4.02-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="auth-or-divider">
              <span className="or-line"></span>
              <span className="or-text">or continue with email / mobile</span>
              <span className="or-line"></span>
            </div>
          </div>
        )}

        {/* 1-CLICK QUICK DEMO LOGINS */}
        <div className="demo-accounts-bar">
          <span className="demo-label">⚡ 1-Click Instant Login:</span>
          <div className="demo-btns-row">
            <button 
              type="button" 
              className="demo-badge-btn" 
              onClick={() => loginAsDemo('lover')}
              title="Instant login as Art Patron"
            >
              🏛️ Art Patron (Aravind)
            </button>
            <button 
              type="button" 
              className="demo-badge-btn" 
              onClick={() => loginAsDemo('artisan')}
              title="Instant login as Master Artisan"
            >
              🎨 Master Artisan (Vaikuntam)
            </button>
            <button 
              type="button" 
              className="demo-badge-btn admin-demo-badge" 
              onClick={() => loginAsDemo('admin')}
              title="Instant login as Super Admin"
            >
              👑 Admin Portal
            </button>
          </div>
        </div>

        {/* TAB 1: SIGN IN */}
        {authMode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="auth-form-content">
            <div className="form-group">
              <label htmlFor="auth-ident">Email Address or WhatsApp Mobile Number *</label>
              <input 
                id="auth-ident"
                type="text" 
                required 
                placeholder="name@email.com, +91 98765 43210 or 'admin'"
                value={identifier}
                onChange={e => setIdentifier(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="auth-pwd">Password or Secret PIN (kalaakshi2026 for Admin)</label>
              <input 
                id="auth-pwd"
                type="password" 
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="btn-primary auth-submit-btn">
              Sign In to Kalaakshi →
            </button>

            <div className="auth-switch-prompt">
              <span>Don't have an account yet? </span>
              <button 
                type="button" 
                className="auth-link-text"
                onClick={() => setAuthMode('register')}
              >
                Create a Free Account
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: CREATE ACCOUNT */}
        {authMode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="auth-form-content">
            <div className="auth-fields-grid">
              <div className="form-group">
                <label htmlFor="reg-name">Full Name *</label>
                <input 
                  id="reg-name"
                  type="text" 
                  required
                  placeholder="e.g. Ramesh Reddy"
                  value={regForm.name}
                  onChange={e => setRegForm(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div className="form-group">
                <label htmlFor="reg-email">Email Address *</label>
                <input 
                  id="reg-email"
                  type="email" 
                  required
                  placeholder="ramesh@gmail.com"
                  value={regForm.email}
                  onChange={e => setRegForm(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>

              <div className="form-group">
                <label htmlFor="reg-phone">WhatsApp / Mobile *</label>
                <input 
                  id="reg-phone"
                  type="tel" 
                  required
                  placeholder="+91 98765 43210"
                  value={regForm.phone}
                  onChange={e => setRegForm(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>

              <div className="form-group">
                <label htmlFor="reg-city">City / State</label>
                <input 
                  id="reg-city"
                  type="text" 
                  placeholder="Warangal / Hyderabad"
                  value={regForm.city}
                  onChange={e => setRegForm(prev => ({ ...prev, city: e.target.value }))}
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="reg-crafts">Art & Craft Interests</label>
                <input 
                  id="reg-crafts"
                  type="text" 
                  placeholder="Dokra Bell Metal, Cheriyal Scrolls, Classical Dance..."
                  value={regForm.craftInterests}
                  onChange={e => setRegForm(prev => ({ ...prev, craftInterests: e.target.value }))}
                />
              </div>
            </div>

            <button type="submit" className="btn-primary auth-submit-btn">
              Join Kalaakshi Heritage Community 🌿
            </button>

            <div className="auth-switch-prompt">
              <span>Already registered? </span>
              <button 
                type="button" 
                className="auth-link-text"
                onClick={() => setAuthMode('login')}
              >
                Sign In to existing account
              </button>
            </div>
          </form>
        )}

        {/* TAB 3: ARTISAN & FOLK ARTIST ONBOARDING */}
        {authMode === 'artisan' && (
          <form onSubmit={handleArtisanSubmit} className="auth-form-content">
            <div className="artisan-intro-box">
              <span className="artisan-intro-title">🌿 Kalakar Onboarding Program</span>
              <p>Direct market linkage, 80% proceeds, GI protection, and Certificate of Provenance serialization for indigenous Telangana crafts.</p>
            </div>

            <div className="auth-fields-grid">
              <div className="form-group">
                <label htmlFor="art-name">Master Artisan / Performer Name *</label>
                <input 
                  id="art-name"
                  type="text" 
                  required
                  placeholder="e.g. Komuraiah Goud"
                  value={artisanForm.name}
                  onChange={e => setArtisanForm(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div className="form-group">
                <label htmlFor="art-phone">Contact Phone / WhatsApp *</label>
                <input 
                  id="art-phone"
                  type="tel" 
                  required
                  placeholder="+91 94401 23456"
                  value={artisanForm.phone}
                  onChange={e => setArtisanForm(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>

              <div className="form-group">
                <label htmlFor="art-craft">Traditional Craft / Artform</label>
                <input 
                  id="art-craft"
                  type="text" 
                  placeholder="e.g. Cheriyal Scrolls / Dokra Brass"
                  value={artisanForm.craft}
                  onChange={e => setArtisanForm(prev => ({ ...prev, craft: e.target.value }))}
                />
              </div>

              <div className="form-group">
                <label htmlFor="art-village">Artisan Village / District</label>
                <input 
                  id="art-village"
                  type="text" 
                  placeholder="e.g. Pembarthi, Jangaon District"
                  value={artisanForm.village}
                  onChange={e => setArtisanForm(prev => ({ ...prev, village: e.target.value }))}
                />
              </div>
            </div>

            <button type="submit" className="btn-primary auth-submit-btn">
              Register as Kalaakshi Kalakar 🎨
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
