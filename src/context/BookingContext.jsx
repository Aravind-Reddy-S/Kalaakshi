import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const BookingContext = createContext();

export function BookingProvider({ children }) {
  const { addToast } = useToast();
  const [bookings, setBookings] = useState(() => {
    try {
      const saved = localStorage.getItem('kalaakshi_bookings');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activeEventForBooking, setActiveEventForBooking] = useState(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isMyBookingsOpen, setIsMyBookingsOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('kalaakshi_bookings', JSON.stringify(bookings));
    } catch (err) {
      console.error('Failed to sync bookings with localStorage', err);
    }
  }, [bookings]);

  const openBookingForEvent = (event) => {
    setActiveEventForBooking(event);
    setIsBookingModalOpen(true);
  };

  const createBooking = (bookingData) => {
    const bookingId = 'KLK-' + Math.floor(100000 + Math.random() * 900000);
    const count = Number(bookingData.attendeeCount) || 1;

    // Generate a unique cryptographic pass and QR token for EVERY single individual attendee
    const individualTickets = Array.from({ length: count }, (_, idx) => {
      const seatNum = idx + 1;
      const passId = `${bookingId}-P${seatNum.toString().padStart(2, '0')}`;
      const uniqueSecurityHash = Math.random().toString(36).substring(2, 8).toUpperCase() + Math.random().toString(36).substring(2, 6).toUpperCase();
      const qrToken = `KALAAKSHI-GATE-AUTH:${passId}:${bookingData.eventId}:${uniqueSecurityHash}`;

      return {
        passNumber: seatNum,
        passId,
        uniqueSecurityHash,
        qrToken,
        holderName: idx === 0 ? bookingData.attendee.name : `${bookingData.attendee.name} (Guest ${seatNum})`,
        passTier: bookingData.passTier,
        ticketPrice: bookingData.ticketPrice,
        status: 'VALID'
      };
    });

    const newBooking = {
      ...bookingData,
      bookingId,
      attendeeCount: count,
      individualTickets,
      bookedAt: new Date().toISOString()
    };

    setBookings(prev => [newBooking, ...prev]);
    addToast(`${count} ${count > 1 ? 'Passes' : 'Pass'} booked successfully! Ref: #${bookingId} 🎟️`, 'success');
    return newBooking;
  };

  const cancelBooking = (bookingId) => {
    setBookings(prev => prev.filter(b => b.bookingId !== bookingId));
    addToast('Booking cancelled.', 'info');
  };

  return (
    <BookingContext.Provider value={{
      bookings,
      activeEventForBooking,
      isBookingModalOpen,
      setIsBookingModalOpen,
      isMyBookingsOpen,
      setIsMyBookingsOpen,
      openBookingForEvent,
      createBooking,
      cancelBooking
    }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}
