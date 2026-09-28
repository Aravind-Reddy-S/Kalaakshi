import React from 'react';
import { useCart } from '../../context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart, setActiveProductForQuickView } = useCart();

  return (
    <div className="product-card">
      <div className="product-media" onClick={() => setActiveProductForQuickView(product)}>
        <img 
          src={product.image} 
          alt={product.name} 
          loading="lazy" 
          className="product-img" 
        />
        {product.badge && <span className="product-badge">{product.badge}</span>}
        <button 
          className="quick-view-overlay-btn"
          onClick={(e) => {
            e.stopPropagation();
            setActiveProductForQuickView(product);
          }}
        >
          Story & Details 🔍
        </button>
      </div>

      <div className="product-body">
        <div className="product-category-row">
          <span className="product-cat">{product.category}</span>
          <span className="product-rating">★ {product.rating} <small>({product.reviewsCount})</small></span>
        </div>

        <h3 className="product-name" onClick={() => setActiveProductForQuickView(product)}>
          {product.name}
        </h3>
        <span className="product-telugu-name">{product.teluguName}</span>

        <div className="artisan-tag">
          <span className="artisan-icon">🎨</span>
          <span className="artisan-text">By <strong>{product.artisan}</strong></span>
        </div>

        <div className="product-price-row">
          <div className="price-group">
            <span className="current-price">₹{product.price.toLocaleString('en-IN')}</span>
            {product.originalPrice && (
              <span className="orig-price">₹{product.originalPrice.toLocaleString('en-IN')}</span>
            )}
          </div>
          <button 
            className="add-to-cart-btn"
            onClick={() => addToCart(product, 1)}
            aria-label={`Add ${product.name} to basket`}
          >
            + Add to Basket
          </button>
        </div>
      </div>
    </div>
  );
}
