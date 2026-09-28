/**
 * Kalaakshi Core API Service Layer
 * 
 * Abstracted client interface for future backend connection (Express / Next.js / Supabase).
 */

import { eventsData } from '../data/eventsData';
import { productsData } from '../data/productsData';

export const apiService = {
  // --- EVENTS ---
  async getEvents() {
    return Promise.resolve(eventsData);
  },

  async getEventById(id) {
    const event = eventsData.find(e => e.id === id);
    return Promise.resolve(event || null);
  },

  async bookEventPass(bookingPayload) {
    const bookingId = 'KLK-' + Math.floor(100000 + Math.random() * 900000);
    const newBooking = {
      ...bookingPayload,
      bookingId,
      status: 'CONFIRMED',
      qrCodeToken: `KALAAKSHI-GATE-${bookingId}-${Date.now()}`,
      bookedAt: new Date().toISOString()
    };
    return Promise.resolve(newBooking);
  },

  // --- PRODUCTS & BAZAAR ---
  async getProducts() {
    return Promise.resolve(productsData);
  },

  async getProductById(id) {
    const product = productsData.find(p => p.id === id);
    return Promise.resolve(product || null);
  },

  // --- ORDERS & CHECKOUT ---
  async createOrder(orderPayload) {
    const orderId = 'ORD-KLK-' + Math.floor(100000 + Math.random() * 900000);
    const certificateSerial = 'CERT-KALAKAR-' + Math.floor(10000 + Math.random() * 90000);
    
    const newOrder = {
      ...orderPayload,
      orderId,
      certificateSerial,
      status: orderPayload.paymentMethod === 'cod' ? 'PLACED_COD' : 'PAID_CASHFREE',
      estimatedDelivery: '3 - 5 Business Days',
      placedAt: new Date().toISOString()
    };
    return Promise.resolve(newOrder);
  }
};
