import React, { createContext, useContext, useState, useEffect } from 'react';
import { eventsData as initialEvents } from '../data/eventsData';
import { productsData as initialProducts } from '../data/productsData';
import { galleryItems as initialGallery } from '../data/galleryData';
import { useToast } from './ToastContext';
import { firestoreService } from '../services/firestoreService';
import { isFirebaseConfigured } from '../services/firebase';

const DataContext = createContext();

export function DataProvider({ children }) {
  const { addToast } = useToast();

  // 1. Events State
  const [events, setEvents] = useState(() => {
    try {
      const saved = localStorage.getItem('kalaakshi_events');
      return saved ? JSON.parse(saved) : initialEvents;
    } catch {
      return initialEvents;
    }
  });

  // 2. Products State
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('kalaakshi_products');
      return saved ? JSON.parse(saved) : initialProducts;
    } catch {
      return initialProducts;
    }
  });

  // 3. Gallery State
  const [galleryItems, setGalleryItems] = useState(() => {
    try {
      const saved = localStorage.getItem('kalaakshi_gallery');
      return saved ? JSON.parse(saved) : initialGallery;
    } catch {
      return initialGallery;
    }
  });

  // Real-time Firestore synchronization if configured
  useEffect(() => {
    if (!isFirebaseConfigured) return;

    const unsubEvents = firestoreService.subscribeToEvents((remoteEvents) => {
      if (remoteEvents && remoteEvents.length > 0) {
        setEvents(remoteEvents);
      }
    });

    const unsubProducts = firestoreService.subscribeToProducts((remoteProducts) => {
      if (remoteProducts && remoteProducts.length > 0) {
        setProducts(remoteProducts);
      }
    });

    return () => {
      unsubEvents();
      unsubProducts();
    };
  }, []);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('kalaakshi_events', JSON.stringify(events));
    } catch (err) {
      console.error('Failed to sync events', err);
    }
  }, [events]);

  useEffect(() => {
    try {
      localStorage.setItem('kalaakshi_products', JSON.stringify(products));
    } catch (err) {
      console.error('Failed to sync products', err);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('kalaakshi_gallery', JSON.stringify(galleryItems));
    } catch (err) {
      console.error('Failed to sync gallery', err);
    }
  }, [galleryItems]);

  // ===== EVENTS MUTATIONS =====
  const addEvent = async (newEvent) => {
    const event = {
      id: 'EVT-' + Date.now(),
      dateLabel: newEvent.dateLabel || 'LIVE',
      passes: newEvent.passes || [
        { id: 'free-pass', name: 'General Heritage Entry', price: 0, desc: 'Full access to all performance areas' },
        { id: 'vip-pass', name: 'VIP Kalakar Experience', price: 499, desc: 'Front-row seating & artisan meet & greet' }
      ],
      whatsappText: `Hi Kalaakshi team, I am interested in attending ${newEvent.name}!`,
      ...newEvent
    };

    setEvents(prev => [event, ...prev]);
    firestoreService.addEvent(event);
    addToast(`Cultural Event "${event.name}" published live! 🎟️`, 'success');
    return event;
  };

  const deleteEvent = async (eventId) => {
    setEvents(prev => prev.filter(e => e.id !== eventId));
    firestoreService.deleteEvent(eventId);
    addToast('Event removed from platform schedule.', 'info');
  };

  // ===== PRODUCTS MUTATIONS =====
  const addProduct = async (newProd) => {
    const product = {
      id: 'prod-' + Date.now(),
      rating: 5.0,
      reviewsCount: 1,
      inStock: true,
      giTag: newProd.giTag !== undefined ? newProd.giTag : true,
      authenticityCertificate: true,
      image: newProd.image || 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80',
      specs: newProd.specs || {
        "Origin": "Telangana Craft Cluster",
        "Material": "Natural & Traditional",
        "Craft Time": "10-15 Days Handwork"
      },
      ...newProd
    };

    setProducts(prev => [product, ...prev]);
    firestoreService.addProduct(product);
    addToast(`Craft "${product.name}" added to Kala Bazaar! 🏺`, 'success');
    return product;
  };

  const deleteProduct = async (prodId) => {
    setProducts(prev => prev.filter(p => p.id !== prodId));
    firestoreService.deleteProduct(prodId);
    addToast('Product removed from Kala Bazaar catalog.', 'info');
  };

  // ===== GALLERY MUTATIONS =====
  const addGalleryItem = (newItem) => {
    const item = {
      id: 'img-' + Date.now(),
      className: 'img' + ((galleryItems.length % 4) + 1),
      image: newItem.image || 'https://images.unsplash.com/photo-1514533450685-4493e01d1fdc?auto=format&fit=crop&w=800&q=80',
      alt: `${newItem.title} ${newItem.subtitle || ''}`,
      ...newItem
    };

    setGalleryItems(prev => [...prev, item]);
    addToast(`New photo added to Gallery visual legacy! 🖼️`, 'success');
    return item;
  };

  const deleteGalleryItem = (itemId) => {
    setGalleryItems(prev => prev.filter(g => g.id !== itemId));
    addToast('Photo removed from Gallery.', 'info');
  };

  // Reset to seed dataset
  const resetToDefaultData = () => {
    setEvents(initialEvents);
    setProducts(initialProducts);
    setGalleryItems(initialGallery);
    localStorage.removeItem('kalaakshi_events');
    localStorage.removeItem('kalaakshi_products');
    localStorage.removeItem('kalaakshi_gallery');
    addToast('All data reset to curated seed defaults.', 'info');
  };

  return (
    <DataContext.Provider value={{
      events,
      products,
      galleryItems,
      isFirebaseConfigured,
      addEvent,
      deleteEvent,
      addProduct,
      deleteProduct,
      addGalleryItem,
      deleteGalleryItem,
      resetToDefaultData
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
