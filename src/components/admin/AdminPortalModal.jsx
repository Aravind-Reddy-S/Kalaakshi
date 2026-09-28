import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useBooking } from '../../context/BookingContext';
import { useToast } from '../../context/ToastContext';

export default function AdminPortalModal() {
  const { isAdminPortalOpen, closeAdminPortal, isAdmin, user } = useAuth();
  const { 
    events, 
    products, 
    galleryItems, 
    addEvent, 
    deleteEvent, 
    addProduct, 
    deleteProduct, 
    addGalleryItem, 
    deleteGalleryItem,
    resetToDefaultData
  } = useData();
  const { bookings } = useBooking();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'events' | 'products' | 'gallery' | 'ledger'

  // Forms state
  const [newEvent, setNewEvent] = useState({
    name: '',
    englishName: '',
    date: 'OCT 2026',
    dateLabel: 'LIVE',
    time: '5:30 PM - 9:30 PM',
    location: 'Kaaloji Kalakshetram, Hanamkonda',
    type: 'Cultural Celebration',
    badge: 'Kalaakshi Special',
    description: '',
    generalPrice: 0,
    vipPrice: 499
  });

  const [newProduct, setNewProduct] = useState({
    name: '',
    teluguName: '',
    artisan: 'Master Artisan, Telangana',
    category: 'Scroll Paintings',
    price: 3499,
    originalPrice: 4800,
    badge: 'GI Registered Craft',
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80',
    description: '100% handmade authentic heritage piece with natural mineral dyes.'
  });

  const [newGallery, setNewGallery] = useState({
    category: 'With Honourable',
    title: 'Cultural Dignitary Meeting',
    subtitle: 'Promoting Telangana Heritage',
    image: 'https://images.unsplash.com/photo-1514533450685-4493e01d1fdc?auto=format&fit=crop&w=800&q=80'
  });

  if (!isAdminPortalOpen) return null;

  // Overview metrics
  const totalPassesBooked = bookings.reduce((sum, b) => sum + (b.attendeeCount || 1), 0);
  const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0) + 12450; // include seed orders
  const totalProducts = products.length;
  const totalEvents = events.length;

  const handleCreateEvent = (e) => {
    e.preventDefault();
    if (!newEvent.name || !newEvent.date || !newEvent.location) {
      alert('Please fill in Event Name, Date, and Location');
      return;
    }

    addEvent({
      name: newEvent.name,
      englishName: newEvent.englishName || newEvent.name,
      date: newEvent.date,
      dateLabel: newEvent.dateLabel || 'LIVE',
      time: newEvent.time,
      location: newEvent.location,
      type: newEvent.type,
      badge: newEvent.badge,
      description: newEvent.description || 'Cultural gathering organized by Kalaakshi.',
      passes: [
        { 
          id: 'gen-pass-' + Date.now(), 
          name: 'General Admission', 
          price: parseInt(newEvent.generalPrice, 10) || 0, 
          desc: 'Full festival and exhibition ground entry' 
        },
        { 
          id: 'vip-pass-' + Date.now(), 
          name: 'VIP Heritage Patron Pass', 
          price: parseInt(newEvent.vipPrice, 10) || 499, 
          desc: 'Front row seats, artisan kit & backstage Kalakar meet' 
        }
      ]
    });

    setNewEvent({
      name: '',
      englishName: '',
      date: 'OCT 2026',
      dateLabel: 'LIVE',
      time: '5:30 PM - 9:30 PM',
      location: 'Kaaloji Kalakshetram, Hanamkonda',
      type: 'Cultural Celebration',
      badge: 'Kalaakshi Special',
      description: '',
      generalPrice: 0,
      vipPrice: 499
    });
  };

  const handleCreateProduct = (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.artisan || !newProduct.price) {
      alert('Please enter Craft Name, Artisan, and Price');
      return;
    }

    addProduct({
      name: newProduct.name,
      teluguName: newProduct.teluguName || newProduct.name,
      artisan: newProduct.artisan,
      category: newProduct.category,
      price: parseInt(newProduct.price, 10),
      originalPrice: parseInt(newProduct.originalPrice, 10) || Math.round(newProduct.price * 1.3),
      badge: newProduct.badge,
      image: newProduct.image,
      description: newProduct.description
    });

    setNewProduct({
      name: '',
      teluguName: '',
      artisan: 'Master Artisan, Telangana',
      category: 'Scroll Paintings',
      price: 3499,
      originalPrice: 4800,
      badge: 'GI Registered Craft',
      image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80',
      description: '100% handmade authentic heritage piece with natural mineral dyes.'
    });
  };

  const handleCreateGallery = (e) => {
    e.preventDefault();
    if (!newGallery.title || !newGallery.image) {
      alert('Please enter photo title and image URL');
      return;
    }

    addGalleryItem({
      category: newGallery.category,
      title: newGallery.title,
      subtitle: newGallery.subtitle,
      image: newGallery.image
    });

    setNewGallery({
      category: 'With Honourable',
      title: 'Cultural Dignitary Meeting',
      subtitle: 'Promoting Telangana Heritage',
      image: 'https://images.unsplash.com/photo-1514533450685-4493e01d1fdc?auto=format&fit=crop&w=800&q=80'
    });
  };

  return (
    <div className="modal-backdrop" onClick={closeAdminPortal}>
      <div className="modal-sheet admin-portal-modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={closeAdminPortal} aria-label="Close admin">×</button>

        {/* ADMIN PORTAL HEADER */}
        <div className="admin-header-row">
          <div className="admin-title-wrap">
            <div className="admin-crown-badge">👑 Super Admin</div>
            <div>
              <h2 className="admin-main-title">కళాక్షి Control Center</h2>
              <span className="admin-sub">Platform Management, Events Publisher, Kala Bazaar Catalog & Gallery</span>
            </div>
          </div>

          <div className="admin-actions-top">
            <button 
              type="button" 
              className="admin-reset-btn"
              onClick={resetToDefaultData}
              title="Reset all events, products, and gallery items to seed state"
            >
              🔄 Reset Demo Data
            </button>
          </div>
        </div>

        {/* ADMIN NAVIGATION TABS */}
        <div className="admin-tabs-bar">
          <button 
            type="button" 
            className={`admin-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            📊 Analytics & Overview
          </button>
          <button 
            type="button" 
            className={`admin-tab-btn ${activeTab === 'events' ? 'active' : ''}`}
            onClick={() => setActiveTab('events')}
          >
            🎟️ Events Manager ({events.length})
          </button>
          <button 
            type="button" 
            className={`admin-tab-btn ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            🏺 Kala Bazaar ({products.length})
          </button>
          <button 
            type="button" 
            className={`admin-tab-btn ${activeTab === 'gallery' ? 'active' : ''}`}
            onClick={() => setActiveTab('gallery')}
          >
            🖼️ Gallery Media ({galleryItems.length})
          </button>
          <button 
            type="button" 
            className={`admin-tab-btn ${activeTab === 'ledger' ? 'active' : ''}`}
            onClick={() => setActiveTab('ledger')}
          >
            📋 Passes & Orders Ledger
          </button>
        </div>

        {/* TAB 1: ANALYTICS & OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="admin-tab-pane">
            <div className="admin-metrics-grid">
              <div className="metric-card">
                <span className="metric-icon">💰</span>
                <span className="metric-label">Total Revenue (PG + Cash)</span>
                <strong className="metric-val">₹{totalRevenue.toLocaleString('en-IN')}</strong>
                <small className="metric-sub">⚡ Powered by Cashfree</small>
              </div>

              <div className="metric-card">
                <span className="metric-icon">🎟️</span>
                <span className="metric-label">Passes Issued</span>
                <strong className="metric-val">{totalPassesBooked} Attendees</strong>
                <small className="metric-sub">{bookings.length} Registered Bookings</small>
              </div>

              <div className="metric-card">
                <span className="metric-icon">🏺</span>
                <span className="metric-label">Craft Catalog Items</span>
                <strong className="metric-val">{totalProducts} Products</strong>
                <small className="metric-sub">80% Direct to Kalakars</small>
              </div>

              <div className="metric-card">
                <span className="metric-icon">🎪</span>
                <span className="metric-label">Active Events</span>
                <strong className="metric-val">{totalEvents} Gatherings</strong>
                <small className="metric-sub">Warangal & Hyderabad</small>
              </div>
            </div>

            <div className="admin-quick-summary-box">
              <div className="qs-header">
                <h3>⚡ Quick Actions</h3>
              </div>
              <div className="qs-buttons-row">
                <button 
                  type="button" 
                  className="btn-primary" 
                  onClick={() => setActiveTab('events')}
                >
                  + Add New Cultural Event 🎟️
                </button>
                <button 
                  type="button" 
                  className="btn-secondary" 
                  onClick={() => setActiveTab('products')}
                >
                  + Add New Craft Piece 🏺
                </button>
                <button 
                  type="button" 
                  className="btn-secondary" 
                  onClick={() => setActiveTab('gallery')}
                >
                  + Add Photo to Gallery 🖼️
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: EVENTS MANAGER */}
        {activeTab === 'events' && (
          <div className="admin-tab-pane">
            <div className="admin-split-layout">
              {/* FORM: ADD EVENT */}
              <form onSubmit={handleCreateEvent} className="admin-card-form">
                <h3 className="form-pane-title">🎟️ Publish New Event</h3>
                
                <div className="auth-fields-grid">
                  <div className="form-group full-width">
                    <label>Event Name (Telugu / Display Title) *</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="e.g. కాకతీయ కళా రాత్రి - నాట్య సమాగమం"
                      value={newEvent.name}
                      onChange={e => setNewEvent(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>English Subtitle / Translation</label>
                    <input 
                      type="text" 
                      placeholder="Kakatiya Cultural Fusion & Classical Dance Night"
                      value={newEvent.englishName}
                      onChange={e => setNewEvent(prev => ({ ...prev, englishName: e.target.value }))}
                    />
                  </div>

                  <div className="form-group">
                    <label>Date *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. NOV 14, 2026"
                      value={newEvent.date}
                      onChange={e => setNewEvent(prev => ({ ...prev, date: e.target.value }))}
                    />
                  </div>

                  <div className="form-group">
                    <label>Time & Duration</label>
                    <input 
                      type="text" 
                      placeholder="5:30 PM - 9:30 PM"
                      value={newEvent.time}
                      onChange={e => setNewEvent(prev => ({ ...prev, time: e.target.value }))}
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>Venue / Location *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Kaaloji Kalakshetram, Balasamudram, Hanamkonda"
                      value={newEvent.location}
                      onChange={e => setNewEvent(prev => ({ ...prev, location: e.target.value }))}
                    />
                  </div>

                  <div className="form-group">
                    <label>General Pass Price (₹) [0 for Free]</label>
                    <input 
                      type="number" 
                      min="0"
                      value={newEvent.generalPrice}
                      onChange={e => setNewEvent(prev => ({ ...prev, generalPrice: e.target.value }))}
                    />
                  </div>

                  <div className="form-group">
                    <label>VIP Patron Pass Price (₹)</label>
                    <input 
                      type="number" 
                      min="0"
                      value={newEvent.vipPrice}
                      onChange={e => setNewEvent(prev => ({ ...prev, vipPrice: e.target.value }))}
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>Event Description & Highlights</label>
                    <textarea 
                      rows="2"
                      placeholder="Describe performances, masterclasses, and artisan stalls..."
                      value={newEvent.description}
                      onChange={e => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>
                </div>

                <button type="submit" className="btn-primary admin-submit-btn">
                  Publish Event to Website 🎟️
                </button>
              </form>

              {/* LIST: ACTIVE EVENTS */}
              <div className="admin-items-list-pane">
                <h3 className="form-pane-title">Active Events Schedule ({events.length})</h3>
                <div className="admin-entity-scroll">
                  {events.map((evt) => (
                    <div key={evt.id} className="admin-entity-card">
                      <div className="entity-header">
                        <div>
                          <span className="entity-badge">{evt.dateLabel || 'EVENT'}</span>
                          <h4 className="entity-title">{evt.name}</h4>
                          <small className="entity-sub">{evt.location} · {evt.date}</small>
                        </div>
                        <button 
                          type="button" 
                          className="entity-delete-btn"
                          onClick={() => deleteEvent(evt.id)}
                          title="Delete Event"
                        >
                          🗑️
                        </button>
                      </div>
                      <div className="entity-meta-row">
                        <span>🕒 {evt.time}</span>
                        <span>🎟️ {evt.passes?.length || 2} Pass Tiers</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: KALA BAZAAR PRODUCTS */}
        {activeTab === 'products' && (
          <div className="admin-tab-pane">
            <div className="admin-split-layout">
              {/* FORM: ADD PRODUCT */}
              <form onSubmit={handleCreateProduct} className="admin-card-form">
                <h3 className="form-pane-title">🏺 Add Handcraft to Kala Bazaar</h3>
                
                <div className="auth-fields-grid">
                  <div className="form-group full-width">
                    <label>Craft Name (English) *</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="e.g. Cheriyal Folk Storyteller Mask"
                      value={newProduct.name}
                      onChange={e => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>

                  <div className="form-group">
                    <label>Telugu Name</label>
                    <input 
                      type="text" 
                      placeholder="చేరియాల ముఖచిత్రం"
                      value={newProduct.teluguName}
                      onChange={e => setNewProduct(prev => ({ ...prev, teluguName: e.target.value }))}
                    />
                  </div>

                  <div className="form-group">
                    <label>Master Artisan *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="D. Vaikuntam (Cheriyal, Siddipet)"
                      value={newProduct.artisan}
                      onChange={e => setNewProduct(prev => ({ ...prev, artisan: e.target.value }))}
                    />
                  </div>

                  <div className="form-group">
                    <label>Category</label>
                    <select 
                      value={newProduct.category}
                      onChange={e => setNewProduct(prev => ({ ...prev, category: e.target.value }))}
                    >
                      <option value="Scroll Paintings">Scroll Paintings (Cheriyal)</option>
                      <option value="Metalcraft">Metalcraft (Dokra & Pembarthi)</option>
                      <option value="Handlooms">Handlooms & Textiles (Ikat / Kalamkari)</option>
                      <option value="Terracotta">Terracotta & Clay Artifacts</option>
                      <option value="Woodcraft">Wooden Toys & Lacquerware</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Selling Price (₹) *</label>
                    <input 
                      type="number" 
                      required 
                      min="1"
                      value={newProduct.price}
                      onChange={e => setNewProduct(prev => ({ ...prev, price: e.target.value }))}
                    />
                  </div>

                  <div className="form-group">
                    <label>Original Price (₹)</label>
                    <input 
                      type="number" 
                      min="1"
                      value={newProduct.originalPrice}
                      onChange={e => setNewProduct(prev => ({ ...prev, originalPrice: e.target.value }))}
                    />
                  </div>

                  <div className="form-group">
                    <label>Heritage Status Badge</label>
                    <input 
                      type="text" 
                      placeholder="GI Registered Craft / State Awardee"
                      value={newProduct.badge}
                      onChange={e => setNewProduct(prev => ({ ...prev, badge: e.target.value }))}
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>Image URL (or Unsplash URL)</label>
                    <input 
                      type="text" 
                      value={newProduct.image}
                      onChange={e => setNewProduct(prev => ({ ...prev, image: e.target.value }))}
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>Artisan Story & Craftsmanship Note</label>
                    <textarea 
                      rows="2"
                      value={newProduct.description}
                      onChange={e => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>
                </div>

                <button type="submit" className="btn-primary admin-submit-btn">
                  Publish Craft to Kala Bazaar 🏺
                </button>
              </form>

              {/* LIST: ACTIVE PRODUCTS */}
              <div className="admin-items-list-pane">
                <h3 className="form-pane-title">Kala Bazaar Catalog ({products.length})</h3>
                <div className="admin-entity-scroll">
                  {products.map((prod) => (
                    <div key={prod.id} className="admin-entity-card prod-preview-card">
                      <img src={prod.image} alt={prod.name} className="entity-thumb" />
                      <div className="entity-body">
                        <div className="entity-header">
                          <div>
                            <span className="entity-badge">{prod.category}</span>
                            <h4 className="entity-title">{prod.name}</h4>
                            <small className="entity-sub">By {prod.artisan}</small>
                          </div>
                          <button 
                            type="button" 
                            className="entity-delete-btn"
                            onClick={() => deleteProduct(prod.id)}
                            title="Delete Product"
                          >
                            🗑️
                          </button>
                        </div>
                        <div className="entity-meta-row">
                          <strong className="entity-price">₹{prod.price.toLocaleString('en-IN')}</strong>
                          <span className="entity-status">In Stock ✓</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: GALLERY MEDIA */}
        {activeTab === 'gallery' && (
          <div className="admin-tab-pane">
            <div className="admin-split-layout">
              {/* FORM: ADD PHOTO */}
              <form onSubmit={handleCreateGallery} className="admin-card-form">
                <h3 className="form-pane-title">🖼️ Add Photo to Legacy Gallery</h3>
                
                <div className="auth-fields-grid">
                  <div className="form-group">
                    <label>Category *</label>
                    <select 
                      value={newGallery.category}
                      onChange={e => setNewGallery(prev => ({ ...prev, category: e.target.value }))}
                    >
                      <option value="With Honourable">With Honourable Dignitaries</option>
                      <option value="With Kalakaars">With Traditional Kalakaars</option>
                      <option value="Heritage Masterclass">Heritage Masterclass</option>
                      <option value="Cultural Gathering">Cultural Gathering</option>
                      <option value="With Cute Littles">Young Performers & Next Gen</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Title (Dignitary / Event) *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Sangeetha Nataka Academy"
                      value={newGallery.title}
                      onChange={e => setNewGallery(prev => ({ ...prev, title: e.target.value }))}
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>Subtitle / Person's Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Dr. Alekhya Punjala Garu"
                      value={newGallery.subtitle}
                      onChange={e => setNewGallery(prev => ({ ...prev, subtitle: e.target.value }))}
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>Photo URL (Public Image Link or /images/...) *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="https://... or /images/image1.jpeg"
                      value={newGallery.image}
                      onChange={e => setNewGallery(prev => ({ ...prev, image: e.target.value }))}
                    />
                  </div>
                </div>

                <button type="submit" className="btn-primary admin-submit-btn">
                  Add to Gallery Grid 🖼️
                </button>
              </form>

              {/* LIST: GALLERY ITEMS */}
              <div className="admin-items-list-pane">
                <h3 className="form-pane-title">Gallery Photos ({galleryItems.length})</h3>
                <div className="admin-gallery-grid-preview">
                  {galleryItems.map((g) => (
                    <div key={g.id} className="admin-gallery-preview-card">
                      <img src={g.image} alt={g.title} className="gallery-preview-thumb" />
                      <div className="gallery-preview-info">
                        <small className="gallery-cat">{g.category}</small>
                        <strong>{g.title}</strong>
                        <span>{g.subtitle}</span>
                      </div>
                      <button 
                        type="button" 
                        className="entity-delete-btn"
                        onClick={() => deleteGalleryItem(g.id)}
                        title="Delete Photo"
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: LEDGER OF PASSES & ORDERS */}
        {activeTab === 'ledger' && (
          <div className="admin-tab-pane">
            <div className="admin-ledger-wrap">
              <h3 className="form-pane-title">Live Attendee Passes & Orders Ledger</h3>
              
              {bookings.length === 0 ? (
                <div className="empty-bookings-state">
                  <span className="empty-icon">📜</span>
                  <h3>No passes issued yet today</h3>
                  <p>Bookings made on the website will be reconciled here in real-time with attendee lists and Cashfree transaction IDs.</p>
                </div>
              ) : (
                <div className="admin-table-wrap">
                  <table className="admin-ledger-table">
                    <thead>
                      <tr>
                        <th>Ref ID</th>
                        <th>Event / Craft</th>
                        <th>Lead Booker</th>
                        <th>Contact</th>
                        <th>Attendees</th>
                        <th>Amount</th>
                        <th>Payment</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((b) => (
                        <tr key={b.bookingId}>
                          <td className="table-code">#{b.bookingId}</td>
                          <td><strong>{b.eventName}</strong> ({b.passTier})</td>
                          <td>{b.attendee?.name}</td>
                          <td>{b.attendee?.phone}</td>
                          <td><span className="badge-pill-count">{b.attendeeCount} Passes</span></td>
                          <td><strong>₹{b.totalPrice.toLocaleString('en-IN')}</strong></td>
                          <td>
                            <span className="status-badge-paid">
                              ✓ {b.paymentMethod?.toUpperCase() || 'PAID'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
