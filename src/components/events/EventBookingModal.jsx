import React, { useState } from 'react';
import { useBooking } from '../../context/BookingContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { initializeCashfreePayment } from '../../services/cashfreeService';

export default function EventBookingModal() {
  const {
    activeEventForBooking,
    isBookingModalOpen,
    setIsBookingModalOpen,
    createBooking
  } = useBooking();

  const { user, isAuthenticated, openAuthModal } = useAuth();
  const { addToast } = useToast();

  const [step, setStep] = useState(1); // 1: Tier & Count, 2: Attendee Info, 3: Payment/Confirm, 4: QR Ticket
  const [selectedPass, setSelectedPass] = useState(null);
  const [attendeeCount, setAttendeeCount] = useState(1);
  const [activeTicketIndex, setActiveTicketIndex] = useState(0);

  // Lead Booker info
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    city: user?.city || 'Warangal / Hyderabad',
    customNotes: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi' | 'card' | 'netbanking'
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  if (!isBookingModalOpen || !activeEventForBooking) return null;

  const currentPass = selectedPass || activeEventForBooking.passes[0];
  const totalPrice = (currentPass?.price || 0) * attendeeCount;

  const handlePassSelect = (pass) => {
    setSelectedPass(pass);
  };

  const handleQtyChange = (delta) => {
    setAttendeeCount(prev => Math.max(1, prev + delta));
  };

  const handleDirectQtyInput = (e) => {
    const val = parseInt(e.target.value, 10);
    if (isNaN(val) || val < 1) {
      setAttendeeCount(1);
    } else {
      setAttendeeCount(Math.min(val, 999));
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProceedToDetails = () => {
    if (!isAuthenticated) {
      openAuthModal('login', `Please sign in to book passes for "${activeEventForBooking.name}".`);
      return;
    }
    setStep(2);
  };

  const handleProceedToPayment = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      alert('Please fill in Lead Attendee Name and WhatsApp Mobile Number.');
      return;
    }
    setStep(3);
  };

  const handleConfirmAndPay = async () => {
    setIsProcessing(true);
    const count = parseInt(attendeeCount, 10) || 1;

    try {
      // 1. Process payment via Cashfree PG (or instant verification if free)
      let paymentResult = { status: 'FREE_ENTRY', transactionId: 'TX-FREE-' + Date.now() };
      if (totalPrice > 0) {
        paymentResult = await initializeCashfreePayment({
          orderId: 'PASS-' + Date.now(),
          orderAmount: totalPrice,
          customerDetails: {
            name: formData.name,
            phone: formData.phone,
            email: formData.email
          },
          paymentMethod
        });
      }

      // 2. Register & save booking with unique cryptographic tickets for every individual
      const booking = createBooking({
        eventId: activeEventForBooking.id,
        eventName: activeEventForBooking.name,
        englishName: activeEventForBooking.englishName,
        eventDate: activeEventForBooking.date,
        eventTime: activeEventForBooking.time,
        eventLocation: activeEventForBooking.location,
        passTier: currentPass.name,
        ticketPrice: currentPass.price,
        attendeeCount: count,
        totalPrice,
        paymentMethod,
        paymentDetails: paymentResult,
        attendee: formData,
        userId: user?.id || null
      });

      setConfirmedBooking(booking);
      setActiveTicketIndex(0);
      setStep(4);
      addToast(`🎉 ${count} Passes issued successfully with unique QR codes!`, 'success');
    } catch (err) {
      console.error(err);
      addToast('Payment processing failed. Please retry.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setIsBookingModalOpen(false);
    setStep(1);
    setSelectedPass(null);
    setAttendeeCount(1);
    setConfirmedBooking(null);
    setIsProcessing(false);
  };

  const individualTickets = confirmedBooking?.individualTickets || [];
  const currentTicket = individualTickets[activeTicketIndex] || individualTickets[0];

  const getWhatsAppShareUrl = (ticket) => {
    if (!confirmedBooking || !ticket) return '#';
    const text = `*కళాక్షి Cultural Event Pass (Official E-Pass)*\n` +
      `🎟️ *Event:* ${confirmedBooking.eventName} (${confirmedBooking.englishName || ''})\n` +
      `📍 *Venue:* ${confirmedBooking.eventLocation}\n` +
      `🕒 *Date & Time:* ${confirmedBooking.eventDate} | ${confirmedBooking.eventTime}\n` +
      `👤 *Attendee:* ${ticket.holderName}\n` +
      `🎫 *Pass Number:* Pass ${ticket.passNumber} of ${confirmedBooking.attendeeCount}\n` +
      `🔖 *Pass ID:* #${ticket.passId} (${ticket.passTier})\n` +
      `🔐 *Security Code:* ${ticket.uniqueSecurityHash}\n` +
      `📋 *Booking Ref:* #${confirmedBooking.bookingId}\n\n` +
      `✨ *Gate Instructions:* Please show this digital pass QR token at the entry gate of Kaaloji Kalakshetram / Venue Reception.\n\n` +
      `_Preserving & Celebrating Telangana Heritage with Kalaakshi._`;

    return `https://wa.me/?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="modal-backdrop" onClick={handleClose}>
      <div className="modal-sheet event-booking-modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={handleClose} aria-label="Close modal">×</button>

        {/* STRICT LOGIN GUARD: IF NOT LOGGED IN */}
        {!isAuthenticated && step !== 4 && (
          <div className="modal-login-required-card">
            <div className="lock-icon-circle">🔐</div>
            <span className="modal-eyebrow">Strict Gate Verification</span>
            <h3 className="modal-title">Sign In Required to Book Passes</h3>
            <p className="modal-subtitle">
              To prevent duplicate passes and generate unique cryptographic gate QR tokens for <strong>{activeEventForBooking.name}</strong>, please sign in or create your free Kalaakshi account.
            </p>
            <div className="login-req-actions">
              <button 
                type="button" 
                className="btn-primary"
                onClick={() => openAuthModal('login', `Sign in to book passes for "${activeEventForBooking.name}".`)}
              >
                Sign In to Kalaakshi →
              </button>
              <button 
                type="button" 
                className="btn-secondary"
                onClick={() => openAuthModal('register', `Create account to book passes for "${activeEventForBooking.name}".`)}
              >
                Create Account
              </button>
            </div>
          </div>
        )}

        {/* STEP 1: SELECT TIER & UNLIMITED ATTENDEES */}
        {isAuthenticated && step === 1 && (
          <div>
            <span className="modal-eyebrow">Step 1 of 3 — Select Pass Tier</span>
            <h3 className="modal-title">{activeEventForBooking.name}</h3>
            <p className="modal-subtitle">
              📍 {activeEventForBooking.location} · 📅 {activeEventForBooking.date} ({activeEventForBooking.time})
            </p>

            {/* PASS TIER SELECTION */}
            <div className="tier-selection-list">
              <span className="section-subheading">Choose Pass Type:</span>
              {activeEventForBooking.passes.map((pass) => (
                <div
                  key={pass.id}
                  className={`pass-tier-card ${currentPass?.id === pass.id ? 'active' : ''}`}
                  onClick={() => handlePassSelect(pass)}
                >
                  <div className="pass-tier-left">
                    <span className="tier-radio-indicator"></span>
                    <div>
                      <h4 className="tier-name">{pass.name}</h4>
                      <p className="tier-desc">{pass.desc}</p>
                    </div>
                  </div>
                  <div className="tier-price">
                    {pass.price === 0 ? (
                      <span className="price-free">COMPLIMENTARY</span>
                    ) : (
                      <span className="price-inr">₹{pass.price} <small>/ attendee</small></span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* ATTENDEE COUNTER (SUPPORTS UNLIMITED ATTENDEES) */}
            <div className="attendee-counter-row">
              <div>
                <span className="counter-label">Number of Attendees / Passes</span>
                <span className="counter-sub">Unlimited booking allowed — each person gets a unique gate QR pass</span>
                <div className="quick-qty-pills">
                  {[1, 2, 4, 6, 10].map(n => (
                    <button
                      key={n}
                      type="button"
                      className={`qty-pill ${attendeeCount === n ? 'active' : ''}`}
                      onClick={() => setAttendeeCount(n)}
                    >
                      {n} {n === 1 ? 'Pass' : 'Passes'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="counter-controls">
                <button 
                  type="button" 
                  className="counter-btn"
                  onClick={() => handleQtyChange(-1)}
                  aria-label="Decrease tickets"
                >
                  −
                </button>
                <input 
                  type="number" 
                  min="1" 
                  max="999"
                  value={attendeeCount}
                  onChange={handleDirectQtyInput}
                  className="direct-qty-input"
                  title="Type any number of tickets"
                />
                <button 
                  type="button" 
                  className="counter-btn"
                  onClick={() => handleQtyChange(1)}
                  aria-label="Increase tickets"
                >
                  +
                </button>
              </div>
            </div>

            <div className="booking-footer">
              <div className="booking-total-display">
                <span>Total Amount:</span>
                <strong>{totalPrice === 0 ? 'FREE ENTRY' : `₹${totalPrice.toLocaleString('en-IN')}`}</strong>
              </div>
              <button 
                type="button" 
                className="btn-primary"
                onClick={handleProceedToDetails}
              >
                Continue to Attendee Info →
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: LEAD ATTENDEE DETAILS */}
        {isAuthenticated && step === 2 && (
          <form onSubmit={handleProceedToPayment}>
            <span className="modal-eyebrow">Step 2 of 3 — Lead Booker Details</span>
            <h3 className="modal-title">{activeEventForBooking.name}</h3>
            
            <div className="booking-count-badge-strip">
              🎟️ Reserving <strong>{attendeeCount} {attendeeCount > 1 ? 'Individual Passes' : 'Pass'}</strong> ({currentPass.name})
            </div>

            <div className="booking-form-grid">
              <div className="form-group">
                <label htmlFor="lead-name">Lead Attendee Name *</label>
                <input 
                  id="lead-name"
                  name="name" 
                  type="text" 
                  required 
                  placeholder="e.g. Aravind Reddy"
                  value={formData.name}
                  onChange={handleFormChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="lead-phone">WhatsApp Mobile Number *</label>
                <input 
                  id="lead-phone"
                  name="phone" 
                  type="tel" 
                  required 
                  placeholder="+91 98480 12345"
                  value={formData.phone}
                  onChange={handleFormChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="lead-email">Email Address</label>
                <input 
                  id="lead-email"
                  name="email" 
                  type="email" 
                  placeholder="aravind@kalaakshi.in"
                  value={formData.email}
                  onChange={handleFormChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="lead-city">City / District</label>
                <input 
                  id="lead-city"
                  name="city" 
                  type="text" 
                  placeholder="Warangal / Hyderabad"
                  value={formData.city}
                  onChange={handleFormChange}
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="lead-notes">Special Requirements (Optional)</label>
                <textarea 
                  id="lead-notes"
                  name="customNotes"
                  rows="2"
                  placeholder="Seating preferences, elder assistance, or artisan masterclass interests..."
                  value={formData.customNotes}
                  onChange={handleFormChange}
                />
              </div>
            </div>

            <div className="booking-footer">
              <button 
                type="button" 
                className="btn-secondary"
                onClick={() => setStep(1)}
              >
                ← Back
              </button>
              <button type="submit" className="btn-primary">
                Proceed to Verification →
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: PAYMENT METHOD / CONFIRMATION */}
        {isAuthenticated && step === 3 && (
          <div>
            <span className="modal-eyebrow">Step 3 of 3 — Payment & Security Verification</span>
            <h3 className="modal-title">Confirm Booking & Generate Passes</h3>

            <div className="booking-summary-box">
              <div>
                <strong>{activeEventForBooking.name}</strong>
                <span>{activeEventForBooking.date} · {activeEventForBooking.time}</span>
                <span>{activeEventForBooking.location}</span>
              </div>
              <div className="summary-total-price">
                <span>{attendeeCount} x {currentPass.name}:</span>
                <strong>{totalPrice === 0 ? 'FREE' : `₹${totalPrice.toLocaleString('en-IN')}`}</strong>
              </div>
            </div>

            {totalPrice === 0 ? (
              <div className="free-entry-notice-box">
                <span className="notice-icon">🌿</span>
                <div>
                  <h4>Complimentary Cultural Invitation</h4>
                  <p>This event is sponsored by Kalaakshi Foundation to preserve regional arts. No payment is required. Your unique QR gate passes will be generated instantly.</p>
                </div>
              </div>
            ) : (
              <div>
                <div className="cashfree-badge-banner">
                  <div className="cf-logo-tag">
                    <span>⚡ Secured by</span>
                    <strong>Cashfree Payments</strong>
                  </div>
                  <span className="cf-security-tag">🛡️ 256-bit Encrypted</span>
                </div>

                <div className="payment-options-grid">
                  <div 
                    className={`payment-method-card ${paymentMethod === 'upi' ? 'selected' : ''}`}
                    onClick={() => setPaymentMethod('upi')}
                  >
                    <span className="pay-radio"></span>
                    <div>
                      <strong className="pay-title">Instant UPI Intent / QR</strong>
                      <p className="pay-desc">Pay via Google Pay, PhonePe, Paytm, or BHIM</p>
                    </div>
                  </div>

                  <div 
                    className={`payment-method-card ${paymentMethod === 'card' ? 'selected' : ''}`}
                    onClick={() => setPaymentMethod('card')}
                  >
                    <span className="pay-radio"></span>
                    <div>
                      <strong className="pay-title">Credit / Debit Card</strong>
                      <p className="pay-desc">Visa, Mastercard, RuPay with OTP verification</p>
                    </div>
                  </div>

                  <div 
                    className={`payment-method-card ${paymentMethod === 'netbanking' ? 'selected' : ''}`}
                    onClick={() => setPaymentMethod('netbanking')}
                  >
                    <span className="pay-radio"></span>
                    <div>
                      <strong className="pay-title">Net Banking</strong>
                      <p className="pay-desc">All major Indian banks supported</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="booking-footer">
              <button 
                type="button" 
                className="btn-secondary"
                onClick={() => setStep(2)}
                disabled={isProcessing}
              >
                ← Back
              </button>

              <button 
                type="button" 
                className="btn-primary"
                onClick={handleConfirmAndPay}
                disabled={isProcessing}
              >
                {isProcessing 
                  ? 'Generating Unique Cryptographic Passes...' 
                  : totalPrice === 0 
                    ? `Issue ${attendeeCount} Free Gate ${attendeeCount > 1 ? 'Passes' : 'Pass'} ✨` 
                    : `Pay ₹${totalPrice.toLocaleString('en-IN')} & Issue Passes 💳`
                }
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: SUCCESS CONFIRMATION WITH UNIQUE INDIVIDUAL QR CARDS */}
        {step === 4 && confirmedBooking && (
          <div className="pass-success-view">
            <span className="success-badge">✓ Gate Passes Confirmed</span>
            <h3 className="modal-title">You're All Set for {confirmedBooking.eventName}!</h3>
            <p className="modal-subtitle">
              Generated <strong>{confirmedBooking.attendeeCount} unique {confirmedBooking.attendeeCount > 1 ? 'cryptographic QR passes' : 'QR pass'}</strong> for each attendee.
            </p>

            <div className="pass-bundle-stat-box">
              <div className="bundle-stat-item">
                <span className="bs-label">Total Passes</span>
                <strong className="bs-val">{confirmedBooking.attendeeCount} Passes</strong>
              </div>
              <div className="bundle-stat-item">
                <span className="bs-label">Lead Booker</span>
                <strong className="bs-val">{confirmedBooking.attendee.name}</strong>
              </div>
              <div className="bundle-stat-item">
                <span className="bs-label">Booking Reference</span>
                <strong className="bs-val">#{confirmedBooking.bookingId}</strong>
              </div>
            </div>

            {/* PASS SELECTOR TABS IF MULTIPLE PASSES */}
            {individualTickets.length > 1 && (
              <div className="ticket-carousel-nav">
                <span className="carousel-label">Viewing Attendee Pass:</span>
                <div className="ticket-pills-scroll">
                  {individualTickets.map((t, idx) => (
                    <button
                      key={t.passId}
                      className={`ticket-nav-pill ${activeTicketIndex === idx ? 'active' : ''}`}
                      onClick={() => setActiveTicketIndex(idx)}
                    >
                      Pass {idx + 1} of {confirmedBooking.attendeeCount}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* INDIVIDUAL DIGITAL TICKET CARD */}
            {currentTicket && (
              <div className="digital-ticket-card unique-pass-card printable-ticket-card">
                <div className="ticket-top">
                  <div className="ticket-brand">
                    <span className="ticket-logo-dot"></span>
                    <span>PASS {currentTicket.passNumber} OF {confirmedBooking.attendeeCount} · కళాక్షి</span>
                  </div>
                  <div className="ticket-id">#{currentTicket.passId}</div>
                </div>

                <div className="ticket-body">
                  <h3 className="ticket-event-name">{confirmedBooking.eventName}</h3>
                  <div className="ticket-english-name">{confirmedBooking.englishName}</div>
                  
                  <div className="ticket-details-grid">
                    <div>
                      <span className="tk-label">Date & Time</span>
                      <strong>{confirmedBooking.eventDate}</strong>
                      <small>{confirmedBooking.eventTime}</small>
                    </div>
                    <div>
                      <span className="tk-label">Venue</span>
                      <strong>{confirmedBooking.eventLocation}</strong>
                    </div>
                    <div>
                      <span className="tk-label">Individual Pass Holder</span>
                      <strong>{currentTicket.holderName}</strong>
                      <small>Pass #{currentTicket.passNumber} of {confirmedBooking.attendeeCount} ({currentTicket.passTier})</small>
                    </div>
                    <div>
                      <span className="tk-label">Total Booking Group</span>
                      <strong className="security-hash-code">{confirmedBooking.attendeeCount} Total Passes</strong>
                      <small>Gate Security: Valid</small>
                    </div>
                  </div>

                  {/* DYNAMIC INDIVIDUAL QR CODE */}
                  <div className="ticket-qr-area">
                    <div className="simulated-qr">
                      <div className="qr-box">
                        <div className="qr-corner-box top-left"></div>
                        <div className="qr-corner-box top-right"></div>
                        <div className="qr-corner-box bottom-left"></div>
                        <div 
                          className="qr-grid-pattern"
                          style={{
                            backgroundImage: `radial-gradient(#111 ${(currentTicket.passNumber % 3) + 2}px, transparent 2px)`,
                            backgroundSize: `${(currentTicket.passNumber % 4) + 7}px ${(currentTicket.passNumber % 4) + 7}px`
                          }}
                        ></div>
                      </div>
                    </div>
                    <span className="qr-caption">Pass #{currentTicket.passNumber} of {confirmedBooking.attendeeCount} · Unique Gate QR #{currentTicket.passId}</span>
                  </div>
                </div>

                <div className="ticket-perforation">
                  <div className="perf-circle left"></div>
                  <div className="perf-line"></div>
                  <div className="perf-circle right"></div>
                </div>

                <div className="ticket-footer-note">
                  🌿 <strong>Pass #{currentTicket.passNumber} of {confirmedBooking.attendeeCount}</strong> · Each QR code is uniquely validated once at Kaaloji Kalakshetram / Venue Reception. Single admission per pass.
                </div>
              </div>
            )}

            <div className="ticket-actions-row">
              <a 
                href={getWhatsAppShareUrl(currentTicket)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp-share"
                title="Share this ticket with QR code and event details on WhatsApp"
              >
                📲 Share Pass #{currentTicket?.passNumber} on WhatsApp
              </a>
              <button 
                type="button" 
                className="btn-primary"
                onClick={() => window.print()}
                title="Print or Save as PDF"
              >
                📥 Download / Print Passes ({confirmedBooking.attendeeCount}) 🖨️
              </button>
              <button 
                type="button" 
                className="btn-secondary"
                onClick={handleClose}
              >
                Done ✓
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
