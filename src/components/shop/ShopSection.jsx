import React, { useState, useMemo } from 'react';
import { craftCategories } from '../../data/productsData';
import { useData } from '../../context/DataContext';
import ProductCard from './ProductCard';

export default function ShopSection() {
  const { products } = useData();
  const [selectedCategory, setSelectedCategory] = useState('All Crafts');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');

  const filteredProducts = useMemo(() => {
    let result = products.filter(product => {
      const matchesCategory = selectedCategory === 'All Crafts' || product.category === selectedCategory;
      const matchesSearch = searchQuery.trim() === '' || 
        (product.name && product.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (product.teluguName && product.teluguName.includes(searchQuery)) ||
        (product.artisan && product.artisan.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (product.region && product.region.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesSearch;
    });

    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => (b.rating || 5) - (a.rating || 5));
    }

    return result;
  }, [products, selectedCategory, searchQuery, sortBy]);

  return (
    <section id="bazaar" className="shop-section">
      <div className="section-header">
        <span className="section-label reveal" style={{ color: 'var(--gold)' }}>
          Authentic Heritage Store
        </span>
        <h2 className="section-title reveal rd1">
          Kala Bazaar — <em>Artisans' Marketplace</em>
        </h2>
        <p className="shop-intro-desc reveal rd2">
          Own a piece of living heritage. Every artifact is made by traditional master Kalakars using natural minerals, handloom silk, bell metal, and centuries-old heirloom techniques.
        </p>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="shop-filter-bar reveal rd2">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input 
            type="text" 
            placeholder="Search Cheriyal masks, Kalamkari, Bidriware, Ikat, Artisans..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="clear-search" onClick={() => setSearchQuery('')}>×</button>
          )}
        </div>

        <div className="category-pills-row">
          {craftCategories.map((cat) => (
            <button 
              key={cat}
              className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="sort-box">
          <label htmlFor="shop-sort">Sort:</label>
          <select 
            id="shop-sort"
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-dropdown"
          >
            <option value="featured">Featured Artisans</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      {/* PRODUCTS GRID */}
      {filteredProducts.length === 0 ? (
        <div className="no-products-found reveal">
          <span className="no-prod-icon">🏺</span>
          <h3>No Handcrafts Found</h3>
          <p>Try searching for other craft terms like "Cheriyal", "Dokra", "Brass", or reset filters.</p>
          <button 
            type="button" 
            className="btn-primary" 
            onClick={() => { setSelectedCategory('All Crafts'); setSearchQuery(''); }}
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="products-grid reveal">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* 3-POINT HERITAGE COMMITMENT */}
      <div className="heritage-promise-bar reveal">
        <div className="promise-item">
          <div className="promise-icon">📜</div>
          <div>
            <strong>Certificate of Provenance</strong>
            <p>Every piece is serialized and authenticated with the master artisan's name, village, and GI heritage lineage.</p>
          </div>
        </div>

        <div className="promise-item">
          <div className="promise-icon">🤝</div>
          <div>
            <strong>80% Direct Artisan Proceeds</strong>
            <p>Direct fair-trade market linkage without exploitative middlemen, empowering traditional artisan families.</p>
          </div>
        </div>

        <div className="promise-item">
          <div className="promise-icon">📦</div>
          <div>
            <strong>Heritage-Safe Delivery</strong>
            <p>Eco-friendly, shockproof cushioned transit ensuring delicate brassware, scrolls, and terracotta arrive intact.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
