import React from 'react';
import { kalaCards } from '../data/kalaPhilosophy';

export default function Philosophy() {
  return (
    <section id="why">
      <div className="why-intro">
        <span className="why-label reveal">The Kala Philosophy</span>
        <h2 className="why-title reveal rd1">
          Not just Art —<br />Every Expression of Life is a Kala
        </h2>
        <p className="why-desc reveal rd2">
          కళాక్షి exists to recognize, celebrate, and elevate every Kala, ensuring no form of cultural expression is overlooked or forgotten. Because heritage lives not only in galleries — it lives in every act of human creation.
        </p>
      </div>

      <div className="kala-grid">
        {kalaCards.map((card, idx) => (
          <div key={idx} className={`kala-card reveal ${card.delay}`}>
            <span className="kala-emoji">{card.emoji}</span>
            <span className="kala-name">{card.name}</span>
            <h3 className="kala-title">{card.title}</h3>
            <p className="kala-text">{card.text}</p>
          </div>
        ))}
      </div>

      <div className="why-banner reveal">
        <p className="why-banner-text">
          "కళాక్షి is not just about art —<br />
          it is about recognizing the <em style={{ color: 'var(--gold-light)' }}>Kala</em> in every life."
        </p>
        <span className="why-banner-sub">Our founding belief</span>
      </div>
    </section>
  );
}
