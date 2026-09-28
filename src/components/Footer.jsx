import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer>
      <div className="footer-top">
        <div>
          <span className="footer-brand">కళాక్షి</span>
          <p className="footer-tagline-text">
            A Place to Explore and Experience<br />
            the Legacy of Creative Cultural Heritage
          </p>
          <div className="footer-social">
            <a 
              href="https://www.instagram.com/kalaakshi_official" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="social-btn"
            >
              INSTAGRAM
            </a>
            <a 
              href="https://www.youtube.com/@KALAAKSHI" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="social-btn"
            >
              YOUTUBE
            </a>
            <a 
              href="https://wa.me/919963660461" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="social-btn"
            >
              WHATSAPP
            </a>
            <a 
              href="https://www.facebook.com/share/1EHfm5HVxw/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="social-btn"
            >
              FACEBOOK
            </a>
          </div>
        </div>

        <div>
          <span className="footer-heading">Explore</span>
          <ul className="footer-links">
            <li><a href="#why">The Kala Philosophy</a></li>
            <li><a href="#about">About కళాక్షి</a></li>
            <li><a href="#offerings">What We Do</a></li>
            <li><a href="#founder">Founder's Vision</a></li>
            <li><a href="#gallery">Gallery</a></li>
            <li><a href="#events">Upcoming Events</a></li>
          </ul>
        </div>

        <div>
          <span className="footer-heading">CONNECT</span>
          <ul className="footer-links">
            <li><a href="mailto:info@kalaakshi.com?subject=Collaborate%20With%20Kalaakshi">Collaborate With Us</a></li>
            <li><a href="mailto:info@kalaakshi.com?subject=For%20Kalakars%20%26%20Craftspeople">For Kalakars & Craftspeople</a></li>
            <li><a href="mailto:info@kalaakshi.com?subject=Sponsorship%20Inquiry">For Sponsors</a></li>
            <li><a href="mailto:hr@kalaakshi.com?subject=Careers%20%26%20Opportunities">Careers & Opportunities</a></li>
            <li>
              <a href="mailto:info@kalaakshi.com">📧 info@kalaakshi.com</a>
            </li>
            <li>
              <a href="tel:+919963660461">📞 +91 99636 60461</a>
            </li>
            <li>
              <a href="https://maps.google.com?q=Warangal, Telangana" target="_blank" rel="noopener noreferrer">
                📍 Warangal, Telangana
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <span className="footer-copy">© {currentYear} కళాక్షి. All rights reserved.</span>
        <span className="footer-credit">A Vision Rooted in Heritage ✦</span>
      </div>
    </footer>
  );
}
