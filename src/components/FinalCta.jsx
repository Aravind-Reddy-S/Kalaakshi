import React from 'react';

export default function FinalCta() {
  return (
    <section id="final">
      <div className="final-inner">
        <p className="final-line1 reveal">కళాక్షి is not just about art —</p>
        <p className="final-line2 reveal rd1">it is about recognizing the Kala in every life.</p>
        <div className="final-divider reveal rd2">
          <div className="hdl"></div>
          <div className="hdd"></div>
          <div className="hdl r"></div>
        </div>
        <div className="final-cta reveal rd3">
          <a href="#why" className="btn-primary">Explore the Philosophy</a>
          <a href="mailto:info@kalaakshi.com" className="btn-secondary">Collaborate With Us</a>
        </div>
      </div>
    </section>
  );
}
