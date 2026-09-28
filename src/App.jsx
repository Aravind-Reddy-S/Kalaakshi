import React from 'react';
import { useScrollReveal } from './hooks/useScrollReveal';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { CartProvider } from './context/CartContext';
import { BookingProvider } from './context/BookingContext';

import CustomCursor from './components/CustomCursor';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Philosophy from './components/Philosophy';
import About from './components/About';
import Ornament from './components/Ornament';
import Offerings from './components/Offerings';
import Founder from './components/Founder';
import ShopSection from './components/shop/ShopSection';
import Gallery from './components/Gallery';
import Events from './components/Events';
import Vision from './components/Vision';
import FinalCta from './components/FinalCta';
import Footer from './components/Footer';

import CartDrawer from './components/shop/CartDrawer';
import CheckoutModal from './components/shop/CheckoutModal';
import ProductQuickView from './components/shop/ProductQuickView';
import EventBookingModal from './components/events/EventBookingModal';
import MyBookingsModal from './components/events/MyBookingsModal';
import AuthModal from './components/auth/AuthModal';
import AdminPortalModal from './components/admin/AdminPortalModal';
import HeritageAudioPlayer from './components/common/HeritageAudioPlayer';

function MainAppContent() {
  useScrollReveal();

  return (
    <>
      <CustomCursor />
      <Navbar />
      <main>
        <Hero />
        <Philosophy />
        <About />
        <Ornament />
        <Offerings />
        <Founder />
        <ShopSection />
        <Gallery />
        <Events />
        <Vision />
        <FinalCta />
      </main>
      <Footer />

      {/* AMBIENT HERITAGE AUDIO DTM */}
      <HeritageAudioPlayer />

      {/* MODALS, DRAWERS, AUTH & ADMIN */}
      <CartDrawer />
      <CheckoutModal />
      <ProductQuickView />
      <EventBookingModal />
      <MyBookingsModal />
      <AuthModal />
      <AdminPortalModal />
    </>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <DataProvider>
        <AuthProvider>
          <BookingProvider>
            <CartProvider>
              <MainAppContent />
            </CartProvider>
          </BookingProvider>
        </AuthProvider>
      </DataProvider>
    </ToastProvider>
  );
}
