/**
 * Firestore Service Layer for Kalaakshi
 * Handles real-time synchronization and CRUD for Events, Products, Bookings & Orders.
 */

import {
  db,
  isFirebaseConfigured,
  collection,
  doc,
  getDocs,
  setDoc,
  addDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp
} from './firebase';

// ===== 1. EVENTS =====
export const firestoreService = {
  subscribeToEvents(onSuccess, onError) {
    if (!isFirebaseConfigured || !db) return () => {};
    try {
      const q = query(collection(db, 'events'));
      return onSnapshot(q, (snapshot) => {
        const events = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        onSuccess(events);
      }, (err) => {
        if (onError) onError(err);
      });
    } catch (e) {
      console.warn('Firestore events listener unavailable', e);
      return () => {};
    }
  },

  async addEvent(eventData) {
    if (!isFirebaseConfigured || !db) return eventData;
    try {
      const docRef = await addDoc(collection(db, 'events'), {
        ...eventData,
        createdAt: serverTimestamp()
      });
      return { id: docRef.id, ...eventData };
    } catch (err) {
      console.error('Error adding event to Firestore:', err);
      return eventData;
    }
  },

  async deleteEvent(eventId) {
    if (!isFirebaseConfigured || !db) return true;
    try {
      await deleteDoc(doc(db, 'events', eventId));
      return true;
    } catch (err) {
      console.error('Error deleting event from Firestore:', err);
      return false;
    }
  },

  // ===== 2. PRODUCTS (KALA BAZAAR) =====
  subscribeToProducts(onSuccess, onError) {
    if (!isFirebaseConfigured || !db) return () => {};
    try {
      const q = query(collection(db, 'products'));
      return onSnapshot(q, (snapshot) => {
        const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        onSuccess(products);
      }, (err) => {
        if (onError) onError(err);
      });
    } catch (e) {
      console.warn('Firestore products listener unavailable', e);
      return () => {};
    }
  },

  async addProduct(productData) {
    if (!isFirebaseConfigured || !db) return productData;
    try {
      const docRef = await addDoc(collection(db, 'products'), {
        ...productData,
        createdAt: serverTimestamp()
      });
      return { id: docRef.id, ...productData };
    } catch (err) {
      console.error('Error adding product to Firestore:', err);
      return productData;
    }
  },

  async deleteProduct(productId) {
    if (!isFirebaseConfigured || !db) return true;
    try {
      await deleteDoc(doc(db, 'products', productId));
      return true;
    } catch (err) {
      console.error('Error deleting product from Firestore:', err);
      return false;
    }
  },

  // ===== 3. BOOKINGS & PASSES =====
  async saveBooking(bookingData) {
    if (!isFirebaseConfigured || !db) return bookingData;
    try {
      const bookingId = bookingData.bookingId || `KLK-${Date.now()}`;
      await setDoc(doc(db, 'bookings', bookingId), {
        ...bookingData,
        createdAt: serverTimestamp()
      });
      return { ...bookingData, bookingId };
    } catch (err) {
      console.error('Error saving booking to Firestore:', err);
      return bookingData;
    }
  },

  // ===== 4. ORDERS & CRAFT PURCHASES =====
  async saveOrder(orderData) {
    if (!isFirebaseConfigured || !db) return orderData;
    try {
      const orderId = orderData.orderId || `ORD-${Date.now()}`;
      await setDoc(doc(db, 'orders', orderId), {
        ...orderData,
        createdAt: serverTimestamp()
      });
      return { ...orderData, orderId };
    } catch (err) {
      console.error('Error saving order to Firestore:', err);
      return orderData;
    }
  },

  // ===== 5. USER PROFILE SYNC =====
  async syncUserProfile(user) {
    if (!isFirebaseConfigured || !db || !user?.id) return;
    try {
      await setDoc(doc(db, 'users', user.id), {
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        role: user.role || 'patron',
        tier: user.tier || 'Heritage Patron',
        city: user.city || 'Warangal',
        lastActive: serverTimestamp()
      }, { merge: true });
    } catch (err) {
      console.error('Error syncing user profile:', err);
    }
  }
};
