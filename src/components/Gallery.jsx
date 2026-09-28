import React from 'react';
import { useData } from '../context/DataContext';

export default function Gallery() {
  const { galleryItems } = useData();

  return (
    <section id="gallery" className="gallery-section">
      <div className="section-header">
        <span className="section-label">Visual Legacy</span>
        <h2 className="section-title">GALLERY</h2>
      </div>

      <div className="gallery-grid">
        {galleryItems.map((item, idx) => (
          <div 
            key={item.id || idx} 
            className={`gallery-item ${item.className || `img${(idx % 4) + 1}`}`} 
            role="img" 
            aria-label={item.alt || item.title}
          >
            <div 
              className="gallery-img" 
              style={{ backgroundImage: `url('${item.image}')` }}
            ></div>
            <div className="gallery-overlay">
              <span className="item-category">{item.category}</span>
              <h4 className="item-title">
                {item.title}
                {item.subtitle && <span>{item.subtitle}</span>}
              </h4>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
