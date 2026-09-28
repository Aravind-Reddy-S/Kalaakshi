import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const { cartCount, setIsCartOpen } = useCart();
  const { bookings, setIsMyBookingsOpen } = useBooking();
  const { user, isAuthenticated, isAdmin, openAuthModal, openAdminPortal, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('no-scroll', isMenuOpen);
  }, [isMenuOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (isMenuOpen) setIsMenuOpen(false);
        if (isUserMenuOpen) setIsUserMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen, isUserMenuOpen]);

  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
  };
  const toggleMenu = () => setIsMenuOpen(prev => !prev);

  return (
    <nav id="navbar" className={isScrolled ? 'scrolled' : ''}>
      <a href="#hero" className="nav-logo" onClick={closeMenu}>
        <span className="logo-symbol">
          <span className="logo-dot"></span>
        </span>
        <span className="nav-logo-text">కళాక్షి</span>
      </a>

      <ul className={`nav-links ${isMenuOpen ? 'open' : ''}`} id="navLinks">
        <li><a href="#why" onClick={closeMenu}>Philosophy</a></li>
        <li><a href="#about" onClick={closeMenu}>About</a></li>
        <li><a href="#offerings" onClick={closeMenu}>What We Do</a></li>
        <li><a href="#bazaar" onClick={closeMenu} className="nav-highlight">Kala Bazaar 🏺</a></li>
        <li><a href="#gallery" onClick={closeMenu}>Gallery</a></li>
        <li><a href="#events" onClick={closeMenu}>Events</a></li>
      </ul>

      <div className="nav-actions">
        {/* Admin Portal Direct Button (if admin) */}
        {isAdmin && (
          <button 
            type="button"
            className="nav-admin-btn"
            onClick={() => { closeMenu(); openAdminPortal(); }}
            title="Open Kalaakshi Control Center"
          >
            👑 Admin
          </button>
        )}

        {/* Booked Passes Badge */}
        {bookings.length > 0 && (
          <button 
            className="nav-bookings-btn" 
            onClick={() => { closeMenu(); setIsMyBookingsOpen(true); }}
            title="View your booked event passes"
          >
            🎟️ Passes ({bookings.length})
          </button>
        )}

        {/* Shopping Basket Button */}
        <button 
          className="nav-cart-btn" 
          onClick={() => { closeMenu(); setIsCartOpen(true); }}
          aria-label="View Shopping Basket"
          title="View Shopping Basket"
        >
          <svg className="nav-cart-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </button>

        {/* User Account / Sign In */}
        {isAuthenticated ? (
          <div className="nav-user-dropdown-wrap">
            <button 
              className="nav-user-btn"
              onClick={() => setIsUserMenuOpen(prev => !prev)}
              aria-label="User account menu"
            >
              <span className="user-avatar-initial">{user.name ? user.name[0].toUpperCase() : 'U'}</span>
              <span className="user-nav-name">{user.name.split(' ')[0]}</span>
              <span className="dropdown-caret">▾</span>
            </button>

            {isUserMenuOpen && (
              <div className="user-dropdown-menu">
                <div className="dropdown-user-header">
                  <strong>{user.name}</strong>
                  <small>{user.email || user.phone}</small>
                  <span className="user-role-tag">{user.tier || 'Heritage Patron'}</span>
                </div>
                <div className="dropdown-divider"></div>
                {isAdmin && (
                  <>
                    <button 
                      className="dropdown-item-btn admin-highlight-item"
                      onClick={() => { setIsUserMenuOpen(false); openAdminPortal(); }}
                    >
                      👑 Admin Control Panel ⚡
                    </button>
                    <div className="dropdown-divider"></div>
                  </>
                )}
                <button 
                  className="dropdown-item-btn"
                  onClick={() => { setIsUserMenuOpen(false); setIsMyBookingsOpen(true); }}
                >
                  🎟️ My Event Passes ({bookings.length})
                </button>
                <button 
                  className="dropdown-item-btn"
                  onClick={() => { setIsUserMenuOpen(false); setIsCartOpen(true); }}
                >
                  🏺 Shopping Basket ({cartCount})
                </button>
                <div className="dropdown-divider"></div>
                <button 
                  className="dropdown-item-btn logout-item"
                  onClick={() => { setIsUserMenuOpen(false); logout(); }}
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <button 
            className="nav-auth-btn"
            onClick={() => { closeMenu(); openAuthModal('login'); }}
          >
            Sign In
          </button>
        )}

        <button 
          className={`nav-toggle ${isMenuOpen ? 'active' : ''}`} 
          id="navToggle" 
          aria-label="Toggle Navigation"
          onClick={toggleMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
}
