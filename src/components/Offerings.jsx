import React from 'react';
import { offeringsData } from '../data/offeringsData';

export default function Offerings() {
  return (
    <section id="offerings">
      <div className="section-header">
        <span className="section-label reveal">What We Do</span>
        <h2 className="section-title reveal rd1">
          Four Ways We<br /><em>Carry Heritage Forward</em>
        </h2>
      </div>

      <div className="offerings-grid">
        {offeringsData.map((item, idx) => (
          <div key={idx} className={`offering-card reveal ${item.delay}`}>
            <span className="offering-num">{item.num}</span>
            <div className="offering-icon">
              {item.icon}
            </div>
            <h3 className="offering-title">{item.title}</h3>
            <p className="offering-text">{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
