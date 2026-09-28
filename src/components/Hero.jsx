import React from 'react';

export default function Hero() {
  return (
    <section id="hero">
      <div className="hero-bg"></div>
      <div className="hero-texture"></div>
      <div className="hero-ring hr1"></div>
      <div className="hero-ring hr2"></div>
      <div className="hero-ring hr3"></div>
      <div className="hero-ring hr4"></div>

      <div className="corner c-tl">
        <svg viewBox="0 0 80 80">
          <path d="M5 5 Q5 42 42 42"/>
          <path d="M5 5 Q42 5 42 42"/>
          <circle cx="5" cy="5" r="2.5"/>
          <path d="M16 5 Q16 16 5 16"/>
          <path d="M5 20 Q5 58 38 58"/>
          <path d="M20 5 Q58 5 58 38"/>
        </svg>
      </div>
      <div className="corner c-tr">
        <svg viewBox="0 0 80 80">
          <path d="M5 5 Q5 42 42 42"/>
          <path d="M5 5 Q42 5 42 42"/>
          <circle cx="5" cy="5" r="2.5"/>
          <path d="M16 5 Q16 16 5 16"/>
          <path d="M5 20 Q5 58 38 58"/>
          <path d="M20 5 Q58 5 58 38"/>
        </svg>
      </div>
      <div className="corner c-bl">
        <svg viewBox="0 0 80 80">
          <path d="M5 5 Q5 42 42 42"/>
          <path d="M5 5 Q42 5 42 42"/>
          <circle cx="5" cy="5" r="2.5"/>
          <path d="M16 5 Q16 16 5 16"/>
          <path d="M5 20 Q5 58 38 58"/>
          <path d="M20 5 Q58 5 58 38"/>
        </svg>
      </div>
      <div className="corner c-br">
        <svg viewBox="0 0 80 80">
          <path d="M5 5 Q5 42 42 42"/>
          <path d="M5 5 Q42 5 42 42"/>
          <circle cx="5" cy="5" r="2.5"/>
          <path d="M16 5 Q16 16 5 16"/>
          <path d="M5 20 Q5 58 38 58"/>
          <path d="M20 5 Q58 5 58 38"/>
        </svg>
      </div>

      <div className="hero-inner">
        <span className="hero-eyebrow">Originated from Warangal · Rooted in Cultural Heritage</span>
        <span className="hero-title">KALAAKSHI</span>
        <span className="hero-subtitle">A Vision Rooted in Heritage</span>
        <span className="hero-core">Every Expression is a Kala</span>
        <div className="hero-divider">
          <div className="hdl"></div>
          <div className="hdd"></div>
          <div className="hdl r"></div>
        </div>
        <p className="hero-desc">
          A place to explore and experience every expression of our creative cultural heritage — from the stage to the soil, from the loom to the ladle.
        </p>
        <div className="hero-actions">
          <a href="#why" className="btn-primary">Explore the Vision</a>
          <a href="#events" className="btn-secondary">Upcoming Events</a>
        </div>
      </div>

      <div className="scroll-hint">
        <span>Scroll</span>
        <div className="scroll-line"></div>
      </div>
    </section>
  );
}
