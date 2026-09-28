import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';

export default function ProductQuickView() {
  const { activeProductForQuickView, setActiveProductForQuickView, addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  if (!activeProductForQuickView) return null;

  const product = activeProductForQuickView;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setActiveProductForQuickView(null);
    setQuantity(1);
  };

  return (
    <div className="modal-backdrop" onClick={() => setActiveProductForQuickView(null)}>
      <div className="modal-sheet product-quick-view-sheet" onClick={e => e.stopPropagation()}>
        <button 
          className="modal-close-btn" 
          onClick={() => setActiveProductForQuickView(null)}
          aria-label="Close craft details"
        >
          ×
        </button>

        <div className="quick-view-grid">
          {/* LEFT: IMAGE */}
          <div className="quick-view-image-wrap">
            <img src={product.image} alt={product.name} className="quick-view-img" />
            <div className="craft-badge-strip">
              <span>{product.badge}</span>
              <span>📍 {product.region}</span>
            </div>
          </div>

          {/* RIGHT: DETAILS */}
          <div className="quick-view-info">
            <span className="modal-eyebrow">{product.category}</span>
            <h2 className="quick-view-title">{product.name}</h2>
            <h4 className="quick-view-telugu">{product.teluguName}</h4>

            <div className="quick-view-price-bar">
              <span className="current-price-lg">₹{product.price.toLocaleString('en-IN')}</span>
              {product.originalPrice && (
                <span className="orig-price-lg">₹{product.originalPrice.toLocaleString('en-IN')}</span>
              )}
              <span className="stock-status">✓ Authentic Handcrafted Stock Available</span>
            </div>

            {/* ARTISAN STORY BOX */}
            <div className="artisan-story-box">
              <div className="artisan-head">
                <span className="artisan-avatar">🎨</span>
                <div>
                  <strong>Artisan: {product.artisan}</strong>
                  <small>Heritage Center: {product.region}</small>
                </div>
              </div>
              <p className="artisan-narrative">"{product.craftStory}"</p>
            </div>

            {/* CRAFT SPECS */}
            <div className="craft-specs-list">
              <div className="spec-item">
                <span className="spec-label">Materials:</span>
                <span className="spec-value">{product.materials}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Dimensions:</span>
                <span className="spec-value">{product.dimensions}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Packaging:</span>
                <span className="spec-value">Reinforced Eco-Friendly Heritage Wooden / Jute Box</span>
              </div>
            </div>

            {/* ADD TO BASKET CONTROLS */}
            <div className="quick-view-actions">
              <div className="quantity-selector">
                <button 
                  type="button"
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="qty-btn"
                >
                  -
                </button>
                <span className="qty-number">{quantity}</span>
                <button 
                  type="button"
                  onClick={() => setQuantity(q => Math.min(10, q + 1))}
                  className="qty-btn"
                >
                  +
                </button>
              </div>

              <button 
                type="button" 
                className="btn-primary add-to-basket-lg"
                onClick={handleAddToCart}
              >
                Add {quantity} to Basket · ₹{(product.price * quantity).toLocaleString('en-IN')} 🏺
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
