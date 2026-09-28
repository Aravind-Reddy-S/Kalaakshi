import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { initializeCashfreePayment } from '../../services/cashfreeService';
import { apiService } from '../../services/apiService';

export default function CheckoutModal() {
  const { isCheckoutOpen, setIsCheckoutOpen, cart, cartSubtotal, clearCart } = useCart();
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const { addToast } = useToast();

  const [step, setStep] = useState(1); // 1: Shipping Address, 2: Cashfree Payment, 3: Order Receipt
  const [isProcessing, setIsProcessing] = useState(false);
  const [shippingData, setShippingData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: 'Telangana',
    pincode: '',
    giftNote: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [placedOrder, setPlacedOrder] = useState(null);

  // Pre-fill user data
  useEffect(() => {
    if (user) {
      setShippingData(prev => ({
        ...prev,
        fullName: user.name || prev.fullName,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
        city: user.city || prev.city
      }));
    }
  }, [user]);

  if (!isCheckoutOpen) return null;

  const shippingCost = cartSubtotal >= 2000 ? 0 : 150;
  const grandTotal = cartSubtotal + shippingCost;
  const artisanDirectFund = Math.round(cartSubtotal * 0.80); // 80% direct to artisan
  const rawMaterialFund = Math.round(cartSubtotal * 0.10); // 10% natural dyes/materials

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingData(prev => ({ ...prev, [name]: value }));
  };

  const handleProceedToPayment = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      openAuthModal('login', 'Please sign in to proceed with your Kala Bazaar checkout.');
      return;
    }
    if (!shippingData.fullName || !shippingData.phone || !shippingData.address || !shippingData.pincode) {
      alert('Please fill out all required shipping fields.');
      return;
    }
    setStep(2);
  };

  const handleProcessPayment = async () => {
    if (!isAuthenticated) {
      openAuthModal('login', 'Please sign in to complete your purchase.');
      return;
    }

    setIsProcessing(true);
    try {
      // 1. Process via Cashfree PG Gateway
      const paymentResult = await initializeCashfreePayment({
        orderId: 'ORD-' + Date.now(),
        orderAmount: grandTotal,
        customerDetails: {
          name: shippingData.fullName,
          phone: shippingData.phone,
          email: shippingData.email
        },
        paymentMethod
      });

      // 2. Register Order via API Service
      const order = await apiService.createOrder({
        items: [...cart],
        shipping: { ...shippingData },
        paymentMethod,
        paymentDetails: paymentResult,
        subtotal: cartSubtotal,
        shippingCost,
        grandTotal,
        artisanFund: artisanDirectFund,
        userId: user?.id || null
      });

      setPlacedOrder(order);
      clearCart();
      setStep(3);
      addToast(`Order placed successfully via Cashfree! #${order.orderId} 📦`, 'success');
    } catch (err) {
      console.error(err);
      addToast('Payment processing failed. Please retry.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setStep(1);
    setPlacedOrder(null);
  };

  return (
    <div className="modal-backdrop" onClick={handleClose}>
      <div className="modal-sheet checkout-modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={handleClose} aria-label="Close checkout">×</button>

        {/* STRICT LOGIN GUARD */}
        {!isAuthenticated && step !== 3 && (
          <div className="modal-login-required-card">
            <div className="lock-icon-circle">🔐</div>
            <span className="modal-eyebrow">Authentication Required</span>
            <h3 className="modal-title">Sign In to Complete Purchase</h3>
            <p className="modal-subtitle">
              Every handcrafted piece comes with a serialized Certificate of Provenance linked directly to your authenticated profile.
            </p>
            <div className="login-req-actions">
              <button 
                type="button" 
                className="btn-primary"
                onClick={() => openAuthModal('login', 'Sign in to complete your checkout and receive your provenance certificate.')}
              >
                Sign In to Kalaakshi →
              </button>
              <button 
                type="button" 
                className="btn-secondary"
                onClick={() => openAuthModal('register', 'Create an account to track your orders and craft certificates.')}
              >
                Create Account (Free) ✨
              </button>
            </div>
          </div>
        )}

        {/* STEP 1: SHIPPING DETAILS */}
        {isAuthenticated && step === 1 && (
          <form onSubmit={handleProceedToPayment} className="checkout-step">
            <div className="booking-header">
              <span className="modal-eyebrow">Step 1 of 2 · Secure Delivery</span>
              <h2 className="modal-title">Artisan Shipping Details</h2>
              <p className="modal-subtitle">Direct dispatch from master craft studios in Telangana & Andhra Pradesh.</p>
            </div>

            <div className="checkout-form-grid">
              <div className="form-group">
                <label htmlFor="c-name">Full Name *</label>
                <input 
                  id="c-name"
                  type="text" 
                  name="fullName" 
                  required
                  placeholder="e.g. Aravind Reddy"
                  value={shippingData.fullName}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="c-phone">Phone / WhatsApp Number *</label>
                <input 
                  id="c-phone"
                  type="tel" 
                  name="phone" 
                  required
                  placeholder="+91 99636 60461"
                  value={shippingData.phone}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="c-email">Email Address (for Order Updates & Tracking) *</label>
                <input 
                  id="c-email"
                  type="email" 
                  name="email" 
                  required
                  placeholder="yourname@gmail.com"
                  value={shippingData.email}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="c-addr">Delivery Address (House/Flat No, Street, Landmark) *</label>
                <textarea 
                  id="c-addr"
                  name="address" 
                  rows="2"
                  required
                  placeholder="Flat 402, Kakatiya Heritage Enclave, Hanamkonda..."
                  value={shippingData.address}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="c-city">City / District *</label>
                <input 
                  id="c-city"
                  type="text" 
                  name="city" 
                  required
                  placeholder="Warangal"
                  value={shippingData.city}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="c-state">State</label>
                <select id="c-state" name="state" value={shippingData.state} onChange={handleInputChange}>
                  <option value="Telangana">Telangana</option>
                  <option value="Andhra Pradesh">Andhra Pradesh</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Other State">Other Indian State</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="c-pincode">Pincode *</label>
                <input 
                  id="c-pincode"
                  type="text" 
                  name="pincode" 
                  required
                  maxLength="6"
                  placeholder="506001"
                  value={shippingData.pincode}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="c-gift">Gift Note (Optional)</label>
                <input 
                  id="c-gift"
                  type="text" 
                  name="giftNote" 
                  placeholder="Add a personalized handwritten note..."
                  value={shippingData.giftNote}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="checkout-summary-bar">
              <div className="total-preview">
                <span>Items: {cart.length} · Total:</span>
                <strong>₹{grandTotal.toLocaleString('en-IN')}</strong>
              </div>
              <button type="submit" className="btn-primary modal-action-btn">
                Continue to Cashfree Payment →
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: CASHFREE PAYMENT METHOD SELECTION */}
        {isAuthenticated && step === 2 && (
          <div className="checkout-step">
            <div className="booking-header">
              <span className="modal-eyebrow">Step 2 of 2 · Cashfree Payments Engine</span>
              <h2 className="modal-title">Secure Cashfree Checkout</h2>
              <p className="modal-subtitle">Instant UPI, Cards & NetBanking with 0% extra convenience fee.</p>
            </div>

            <div className="cashfree-badge-banner">
              <div className="cf-logo-tag">
                <span>⚡ Powered by</span>
                <strong>Cashfree Payments</strong>
              </div>
              <div className="cf-security-tag">
                🔒 256-Bit Bank Grade Encryption
              </div>
            </div>

            <div className="payment-options-grid">
              <label 
                className={`payment-method-card ${paymentMethod === 'upi' ? 'selected' : ''}`}
                onClick={() => setPaymentMethod('upi')}
              >
                <div className="pay-radio"></div>
                <div className="pay-content">
                  <div className="pay-title">
                    📱 Instant UPI (Google Pay, PhonePe, Paytm, CRED, BHIM)
                  </div>
                  <p className="pay-desc">Pay directly via your favorite UPI app with zero transaction charges.</p>
                  <div className="upi-apps-icons">
                    <span className="app-tag">GPay</span>
                    <span className="app-tag">PhonePe</span>
                    <span className="app-tag">Paytm</span>
                    <span className="app-tag">CRED UPI</span>
                  </div>
                </div>
              </label>

              <label 
                className={`payment-method-card ${paymentMethod === 'card' ? 'selected' : ''}`}
                onClick={() => setPaymentMethod('card')}
              >
                <div className="pay-radio"></div>
                <div className="pay-content">
                  <div className="pay-title">💳 Credit / Debit Card & NetBanking</div>
                  <p className="pay-desc">Visa, MasterCard, RuPay, SBI, HDFC, ICICI, Axis and 50+ banks.</p>
                </div>
              </label>

              <label 
                className={`payment-method-card ${paymentMethod === 'cod' ? 'selected' : ''}`}
                onClick={() => setPaymentMethod('cod')}
              >
                <div className="pay-radio"></div>
                <div className="pay-content">
                  <div className="pay-title">📦 Cash on Delivery / Pay on Inspection</div>
                  <p className="pay-desc">Inspect your genuine handcrafted piece upon delivery and pay cash or UPI to courier.</p>
                </div>
              </label>
            </div>

            {/* ARTISAN DIRECT FUND BREAKDOWN */}
            <div className="transparency-pill-box">
              <div className="tp-header">🌿 Transparent Kalakar Contribution</div>
              <div className="tp-body">
                <div><span>Direct Artisan Earnings:</span> <strong>₹{artisanDirectFund.toLocaleString('en-IN')} (80%)</strong></div>
                <div><span>Natural Materials & Dyes Fund:</span> <strong>₹{rawMaterialFund.toLocaleString('en-IN')} (10%)</strong></div>
                <div><span>Heritage Preservation Ops:</span> <strong>₹{(cartSubtotal - artisanDirectFund - rawMaterialFund).toLocaleString('en-IN')} (10%)</strong></div>
              </div>
            </div>

            <div className="booking-footer">
              <button 
                type="button" 
                className="btn-secondary"
                onClick={() => setStep(1)}
                disabled={isProcessing}
              >
                ← Edit Address
              </button>
              <button 
                type="button" 
                className="btn-primary modal-action-btn"
                onClick={handleProcessPayment}
                disabled={isProcessing}
              >
                {isProcessing ? 'Connecting Cashfree...' : `Pay ₹${grandTotal.toLocaleString('en-IN')} via Cashfree ⚡`}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: ORDER SUCCESS RECEIPT & CERTIFICATE */}
        {step === 3 && placedOrder && (
          <div className="checkout-step order-success-step">
            <div className="success-badge">✦ Order Confirmed & Paid ✦</div>
            <h2 className="modal-title">ధన్యవాదాలు! (Thank You!)</h2>
            <p className="modal-subtitle">Your authentic heritage piece is reserved. Preparing artisan dispatch.</p>

            <div className="receipt-card">
              <div className="receipt-header">
                <div>
                  <span className="receipt-tag">Kalaakshi Heritage Order</span>
                  <h4 className="receipt-id">#{placedOrder.orderId}</h4>
                </div>
                <div className="receipt-amount">₹{placedOrder.grandTotal.toLocaleString('en-IN')}</div>
              </div>

              <div className="receipt-body">
                <div className="artisan-certificate-banner">
                  <div className="cert-seal">✦ KALAAKSHI GENUINE HERITAGE ✦</div>
                  <div className="cert-serial">Certificate of Provenance: <strong>{placedOrder.certificateSerial}</strong></div>
                  <p className="cert-desc">This document guarantees this craft was handmade by recognized Telangana & Indian Kalakars using traditional non-mechanized methods.</p>
                </div>

                <div className="receipt-section">
                  <strong>📍 Shipping Address:</strong>
                  <p>{placedOrder.shipping.fullName}, {placedOrder.shipping.address}, {placedOrder.shipping.city}, {placedOrder.shipping.state} - {placedOrder.shipping.pincode}</p>
                  <p>Contact: {placedOrder.shipping.phone} · {placedOrder.shipping.email}</p>
                </div>

                <div className="receipt-section">
                  <strong>🎨 Ordered Crafts:</strong>
                  <ul className="receipt-items-list">
                    {placedOrder.items.map(item => (
                      <li key={item.id}>
                        {item.name} (Qty: {item.quantity}) — ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="receipt-guarantee">
                  🚚 <strong>Estimated Delivery:</strong> {placedOrder.estimatedDelivery} via Tracked Heritage Express
                </div>
              </div>
            </div>

            <div className="ticket-actions-row">
              <a 
                href={`https://wa.me/919963660461?text=${encodeURIComponent(`Hi Kalaakshi Team, I placed Order #${placedOrder.orderId} (Certificate #${placedOrder.certificateSerial}) for ₹${placedOrder.grandTotal}. Please confirm dispatch timeline!`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                Track via WhatsApp Support 📲
              </a>
              <button 
                type="button" 
                className="btn-primary"
                onClick={handleClose}
              >
                Back to Kalaakshi ✓
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
