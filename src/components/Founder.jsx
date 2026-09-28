import React from 'react';

export default function Founder() {
  return (
    <section id="founder">
      <div className="section-header">
        <span className="section-label reveal">Words From the Founder</span>
        <h2 className="section-title reveal rd1">
          The Vision Behind<br /><em>KALAAKSHI</em>
        </h2>
      </div>

      <div className="founder-wrap">
        {/* LEFT: IMAGE */}
        <div className="founder-image reveal">
          <div className="founder-img-box">
            <img 
              src="/images/founder-image.jpg" 
              alt="Kalaakshi Founder" 
              className="founder-img" 
              loading="lazy" 
            />
          </div>
        </div>

        {/* RIGHT: TEXT */}
        <div className="founder-content">
          <p className="founder-quote reveal">
            Why are the hands that create our culture struggling to survive?
          </p>
          <p className="founder-text reveal rd0">
            That question stayed with me. Growing up, I saw the beauty of our traditions—performances, crafts, stories, and celebrations. But behind every stage and every creation, there were Kalakars whose stories were unheard and whose value was often overlooked.
          </p>

          <p className="founder-text reveal rd1">
            I realized the problem was not talent—it was visibility. The stories were not reaching people. The reality behind culture was missing. At the same time, today’s children are growing up disconnected—from culture, from real skills, and from meaningful experiences beyond screens. That’s where Kalaakshi began—not as a business, but as a way to bring these stories and experiences back into people’s lives.
          </p>

          <p className="founder-text reveal rd2">
            Through Kalaakshi carnivals, expos, untold stories, real talks, and cultural heritage documentaries, we create spaces where people—especially the next generation—don’t just see culture, but experience it, learn from it, and connect with the people behind it.
          </p>

          <p className="founder-text reveal rd3">
            “People understand the story and choose to support and adapt not just preserve it in museums.” Kalaakshi is built on this belief — giving Kalakars a voice, a stage, and creating a future where culture lives, evolves, and is carried forward to the next generations.
          </p>

          <div className="founder-sign reveal rd4">
            <span className="founder-name">— Founder, Kalaakshi</span>
          </div>
        </div>
      </div>
    </section>
  );
}
