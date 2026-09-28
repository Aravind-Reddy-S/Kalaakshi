import React from 'react';
import { useData } from '../context/DataContext';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Events() {
  const { events } = useData();
  const { openBookingForEvent } = useBooking();
  const { isAuthenticated, openAuthModal } = useAuth();
  const { addToast } = useToast();

  const handleBookPassClick = (event) => {
    if (!isAuthenticated) {
      addToast('Please Sign In or Register to book event passes 🎟️', 'info');
      openAuthModal(
        'login', 
        `Please sign in to reserve your digital gate passes for "${event.name}".`,
        () => openBookingForEvent(event)
      );
      return;
    }
    openBookingForEvent(event);
  };

  return (
    <section id="events">
      <div className="section-header">
        <span className="section-label reveal" style={{ color: 'var(--terracotta)' }}>
          Experience కళాక్షి
        </span>
        <h2 className="section-title reveal rd1" style={{ color: 'var(--maroon)' }}>
          Upcoming <em style={{ color: 'var(--gold)' }}>Cultural Events</em>
        </h2>
        <p className="events-subtitle reveal rd2">
          Reserve your heritage pass to immerse in live artisan masterclasses, classical performances, and regional cultural celebrations.
        </p>
      </div>

      <div className="events-list reveal">
        {events.map((event, idx) => (
          <div key={event.id || idx} className="event-row">
            <div className="event-date-block">
              <span className="event-month">{event.date.split(' ')[0]}</span>
              <span className="event-day coming-soon">{event.dateLabel || 'LIVE'}</span>
            </div>

            <div className="event-info-col">
              <div className="event-meta-top">
                <span className="event-type">{event.type}</span>
                {event.badge && <span className="event-badge-pill">{event.badge}</span>}
              </div>
              <h3 className="event-name">{event.name}</h3>
              {event.englishName && <div className="event-english-name">{event.englishName}</div>}
              <div className="event-loc-line">
                <span className="loc-icon">📍</span> {event.location}
                <span className="time-icon"> · 🕒 {event.time}</span>
              </div>
              <p className="event-desc-snippet">{event.description}</p>
            </div>

            <div className="event-action-group">
              <button 
                className="event-book-btn"
                onClick={() => handleBookPassClick(event)}
              >
                🎟️ Book Passes
              </button>
              <a 
                href={`https://wa.me/919963660461?text=${encodeURIComponent(event.whatsappText || `Hi Kalaakshi team, I want to enquire about ${event.name}`)}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="event-whatsapp-link"
                title="Enquire on WhatsApp"
              >
                WhatsApp Enquiry →
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
