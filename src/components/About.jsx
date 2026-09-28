import React from 'react';

export default function About() {
  return (
    <section id="about">
      <div>
        <span className="about-label reveal">The Name & Its Meaning</span>
        <h2 className="about-title reveal rd1">
          A Vision <em>Born</em><br />from Cultural Roots
        </h2>
        <p className="about-text reveal rd2">
          కళాక్షి was born from the desire to give heritage a visible, meaningful, and inspiring space in the modern world — where tradition is not a museum piece, but a living, breathing force in everyday life.
        </p>
        <p className="about-text reveal rd3">
          We are a platform rooted in Warangal, extending outward to celebrate every Kalakar — every creator, craftsperson, and keeper of cultural wisdom — across India and the world.
        </p>
        <div className="name-breakdown reveal rd4">
          <div className="name-part">
            <span className="np-script">కళా</span>
            <div className="np-meaning">
              <strong>Kalaa</strong>
              Art, creativity, the beauty of human expression — shaped through centuries of devotion, practice, and inheritance.
            </div>
          </div>
          <div className="name-part">
            <span className="np-script">అక్షి</span>
            <div className="np-meaning">
              <strong>Akshi</strong>
              Vision, the seeing eye — that perceives, values, and gives meaning to all it beholds. The gaze that honors.
            </div>
          </div>
        </div>
      </div>

      <div className="reveal rd2">
        <div className="about-card">
          <blockquote>
            "To create a platform where heritage is not only preserved, but experienced, shared, and reimagined for future generations."
          </blockquote>
          <cite>— Our Mission</cite>
        </div>
        <div className="chip-row">
          <span className="chip">Preserving Roots</span>
          <span className="chip">Empowering Kalakars</span>
          <span className="chip">Celebrating Creativity</span>
          <span className="chip">Connecting Cultures</span>
        </div>
      </div>
    </section>
  );
}
