import React, { useState } from 'react';
import { useBooking } from '../../context/BookingContext';

export default function MyBookingsModal() {
  const { bookings, isMyBookingsOpen, setIsMyBookingsOpen, cancelBooking } = useBooking();
  const [selectedBookingForPasses, setSelectedBookingForPasses] = useState(null);

  if (!isMyBookingsOpen) return null;

  const getWhatsAppShareUrl = (booking, ticket) => {
    if (!booking || !ticket) return '#';
    const text = `*కళాక్షి Cultural Event Pass (Official E-Pass)*\n` +
      `🎟️ *Event:* ${booking.eventName} (${booking.englishName || ''})\n` +
      `📍 *Venue:* ${booking.eventLocation}\n` +
      `🕒 *Date & Time:* ${booking.eventDate} | ${booking.eventTime}\n` +
      `👤 *Attendee:* ${ticket.holderName}\n` +
      `🎫 *Pass Number:* Pass ${ticket.passNumber} of ${booking.attendeeCount}\n` +
      `🔖 *Pass ID:* #${ticket.passId} (${ticket.passTier})\n` +
      `🔐 *Security Code:* ${ticket.uniqueSecurityHash}\n` +
      `📋 *Booking Ref:* #${booking.bookingId}\n\n` +
      `✨ *Gate Instructions:* Present this QR token at the venue entrance.\n\n` +
      `_Preserving & Celebrating Telangana Heritage with Kalaakshi._`;

    return `https://wa.me/?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="modal-backdrop" onClick={() => setIsMyBookingsOpen(false)}>
      <div className="modal-sheet my-bookings-modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={() => setIsMyBookingsOpen(false)} aria-label="Close modal">×</button>

        <div className="booking-header">
          <span className="modal-eyebrow">🎟️ Your Cultural Passes</span>
          <h2 className="modal-title">My Kalaakshi Bookings</h2>
          <p className="modal-subtitle">Stored safely with unique individual QR codes for each attendee</p>
        </div>

        {bookings.length === 0 ? (
          <div className="empty-bookings-state">
            <span className="empty-icon">🎭</span>
            <h3>No Passes Booked Yet</h3>
            <p>Explore our upcoming events and reserve your complimentary heritage passes today.</p>
            <a 
              href="#events" 
              className="btn-primary" 
              onClick={() => setIsMyBookingsOpen(false)}
            >
              Explore Events
            </a>
          </div>
        ) : selectedBookingForPasses ? (
          /* DETAILED VIEW FOR ALL INDIVIDUAL PASSES IN A SPECIFIC BOOKING */
          <div className="individual-passes-view">
            <div className="view-header-row">
              <button 
                className="btn-secondary small-btn"
                onClick={() => setSelectedBookingForPasses(null)}
              >
                ← Back to All Bookings
              </button>
              <button 
                className="btn-primary small-btn"
                onClick={() => window.print()}
                title="Print or Save as PDF"
              >
                📥 Download / Print Passes 🖨️
              </button>
            </div>

            <div className="booking-summary-banner">
              <h3>{selectedBookingForPasses.eventName}</h3>
              <p>{selectedBookingForPasses.eventLocation} · {selectedBookingForPasses.eventDate} ({selectedBookingForPasses.eventTime})</p>
              <span className="bundle-ref">Booking Ref: #{selectedBookingForPasses.bookingId} ({selectedBookingForPasses.attendeeCount} Passes)</span>
            </div>

            <div className="all-individual-passes-list">
              {(selectedBookingForPasses.individualTickets || []).map((ticket) => (
                <div key={ticket.passId} className="digital-ticket-card mini-pass-card printable-ticket-card">
                  <div className="ticket-top">
                    <span className="ticket-brand">కళాక్షి PASS #{ticket.passNumber}</span>
                    <span className="ticket-id">#{ticket.passId}</span>
                  </div>
                  <div className="ticket-body">
                    <div className="mini-ticket-meta">
                      <div>
                        <strong>{ticket.holderName}</strong>
                        <small>{ticket.passTier}</small>
                        <div className="ticket-share-btn-wrap" style={{ marginTop: '6px' }}>
                          <a 
                            href={getWhatsAppShareUrl(selectedBookingForPasses, ticket)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mini-whatsapp-link"
                          >
                            📲 Share on WhatsApp
                          </a>
                        </div>
                      </div>
                      <div className="mini-qr-wrap">
                        <div className="qr-box mini">
                          <div className="qr-corner-box top-left"></div>
                          <div className="qr-corner-box top-right"></div>
                          <div className="qr-corner-box bottom-left"></div>
                          <div 
                            className="qr-grid-pattern"
                            style={{
                              backgroundImage: `radial-gradient(#111 ${(ticket.passNumber % 3) + 2}px, transparent 2px)`,
                              backgroundSize: `${(ticket.passNumber % 4) + 7}px ${(ticket.passNumber % 4) + 7}px`
                            }}
                          ></div>
                        </div>
                        <span className="mini-security">Code: {ticket.uniqueSecurityHash}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* LIST OF ALL BOOKINGS */
          <div className="saved-passes-list">
            {bookings.map((booking) => (
              <div key={booking.bookingId} className="saved-pass-card">
                <div className="saved-pass-header">
                  <div>
                    <span className="pass-ref">Booking Ref #{booking.bookingId}</span>
                    <h4 className="pass-event-title">{booking.eventName}</h4>
                    <span className="pass-tier-badge">
                      {booking.passTier} · {booking.attendeeCount} {booking.attendeeCount > 1 ? 'Individual Passes' : 'Pass'}
                    </span>
                  </div>
                  <div className="saved-pass-price">
                    {booking.totalPrice === 0 ? 'FREE' : `₹${booking.totalPrice.toLocaleString('en-IN')}`}
                  </div>
                </div>

                <div className="saved-pass-meta">
                  <div><strong>📅 Date:</strong> {booking.eventDate} ({booking.eventTime})</div>
                  <div><strong>📍 Venue:</strong> {booking.eventLocation}</div>
                  <div><strong>👤 Lead Attendee:</strong> {booking.attendee.name} ({booking.attendee.phone})</div>
                </div>

                <div className="saved-pass-actions">
                  <button 
                    className="btn-primary small-btn"
                    onClick={() => setSelectedBookingForPasses(booking)}
                  >
                    View & Scan {booking.attendeeCount} Unique QR {booking.attendeeCount > 1 ? 'Passes' : 'Pass'} 🎟️
                  </button>
                  <button 
                    className="btn-cancel-booking"
                    onClick={() => cancelBooking(booking.bookingId)}
                  >
                    Cancel Booking
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
