import React from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function CartDrawer() {
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    updateQuantity, 
    removeFromCart, 
    cartSubtotal, 
    cartCount,
    setIsCheckoutOpen 
  } = useCart();
  const { isAuthenticated, openAuthModal } = useAuth();
  const { addToast } = useToast();

  if (!isCartOpen) return null;

  const handleProceedToCheckout = () => {
    if (!isAuthenticated) {
      addToast('Please Sign In or Register to checkout 🏺', 'info');
      openAuthModal(
        'login', 
        'Please sign in or create an account to complete your Kala Bazaar craft purchase and receive your Certificate of Provenance.',
        () => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }
      );
      return;
    }

    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const shippingCost = cartSubtotal >= 2000 || cartSubtotal === 0 ? 0 : 150;
  const artisanFundContribution = Math.round(cartSubtotal * 0.15); // 15% directly to artisan preservation fund

  return (
    <div className="cart-backdrop" onClick={() => setIsCartOpen(false)}>
      <div className="cart-drawer" onClick={e => e.stopPropagation()}>
        <div className="cart-drawer-header">
          <div className="cart-title-wrap">
            <span className="cart-header-icon">🏺</span>
            <div>
              <h3 className="cart-drawer-title">Your Kala Basket</h3>
              <span className="cart-drawer-count">{cartCount} {cartCount === 1 ? 'Handcrafted Item' : 'Handcrafted Items'}</span>
            </div>
          </div>
          <button 
            className="cart-close-btn" 
            onClick={() => setIsCartOpen(false)}
            aria-label="Close basket"
          >
            ×
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="cart-empty-state">
            <span className="empty-basket-icon">🌾</span>
            <h4>Your Basket is Empty</h4>
            <p>Discover rare handmade paintings, metalcraft, and textiles created by Telangana and Indian Kalakars.</p>
            <a 
              href="#bazaar" 
              className="btn-primary"
              onClick={() => setIsCartOpen(false)}
            >
              Explore Kala Bazaar
            </a>
          </div>
        ) : (
          <>
            <div className="cart-items-list">
              {cart.map((item) => (
                <div key={item.id} className="cart-item-row">
                  <img src={item.image} alt={item.name} className="cart-item-thumb" />
                  
                  <div className="cart-item-info">
                    <h4 className="cart-item-name">{item.name}</h4>
                    <span className="cart-item-artisan">By {item.artisan}</span>
                    <div className="cart-item-price">₹{item.price.toLocaleString('en-IN')}</div>
                    
                    <div className="cart-qty-row">
                      <div className="mini-qty-control">
                        <button 
                          type="button" 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button 
                          type="button" 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>

                      <button 
                        type="button" 
                        className="cart-remove-btn"
                        onClick={() => removeFromCart(item.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="artisan-impact-banner">
              <span className="impact-icon">🌿</span>
              <span>
                <strong>100% Direct Artisan Support:</strong> ₹{artisanFundContribution.toLocaleString('en-IN')} from this order goes directly into sustaining traditional Kalakar livelihoods.
              </span>
            </div>

            <div className="cart-summary-footer">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{cartSubtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="summary-row">
                <span>Heritage Safe Shipping</span>
                <span>{shippingCost === 0 ? <strong style={{ color: 'var(--gold)' }}>FREE</strong> : `₹${shippingCost}`}</span>
              </div>
              {shippingCost > 0 && (
                <small className="free-shipping-hint">
                  Add ₹{(2000 - cartSubtotal).toLocaleString('en-IN')} more for Free Shipping!
                </small>
              )}
              <div className="summary-row total-row">
                <span>Grand Total</span>
                <span className="total-amount">₹{(cartSubtotal + shippingCost).toLocaleString('en-IN')}</span>
              </div>

              <button 
                type="button" 
                className="btn-primary checkout-btn"
                onClick={handleProceedToCheckout}
              >
                Proceed to Secure Checkout →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
