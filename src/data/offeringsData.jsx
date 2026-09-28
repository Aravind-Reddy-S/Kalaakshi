import React from 'react';

export const offeringsData = [
  {
    num: '01',
    title: 'Cultural Carnivals',
    text: 'Immersive celebrations of art, performance, culture, and community. Where the pulse of heritage is felt in every corner — through music, dance, craft, and the stories we tell each other.',
    delay: '',
    icon: (
      <svg viewBox="0 0 48 48">
        <circle cx="24" cy="24" r="18"/>
        <path d="M24 6 Q36 18 24 30 Q12 18 24 6Z"/>
        <circle cx="24" cy="24" r="4"/>
        <path d="M6 24h4M38 24h4M24 6v4M24 38v4"/>
      </svg>
    )
  },
  {
    num: '02',
    title: 'Heritage Expos',
    text: 'Curated showcases of traditional crafts, handmade works, and cultural excellence. A dedicated space where master artisans and their millennia-old crafts are seen, valued, and honoured.',
    delay: 'rd1',
    icon: (
      <svg viewBox="0 0 48 48">
        <rect x="6" y="8" width="36" height="32" rx="1"/>
        <path d="M14 18h20M14 24h14M14 30h8"/>
        <circle cx="36" cy="30" r="6"/>
        <path d="M33 30h6M36 27v6"/>
      </svg>
    )
  },
  {
    num: '03',
    title: 'Podcasts & Conversations',
    text: 'Thoughtful discussions with artists, craftsmen, and creative minds. Unfiltered voices carrying the wisdom, struggle, and beauty of a lifetime devoted to craft and cultural expression.',
    delay: 'rd2',
    icon: (
      <svg viewBox="0 0 48 48">
        <path d="M12 24 Q12 10 24 10 Q36 10 36 24 Q36 36 24 40 L16 44 L18 36 Q12 34 12 24Z"/>
        <path d="M18 22h12M18 28h8"/>
      </svg>
    )
  },
  {
    num: '04',
    title: 'Visual Documentary',
    text: 'Cinematic storytelling that captures the soul of heritage through film. Documenting artisans, traditions, and cultural narratives in their most authentic form — preserving stories not just as memory, but as living visual legacies for generations to come.',
    delay: 'rd3',
    icon: (
      <svg viewBox="0 0 48 48">
        <rect x="6" y="10" width="36" height="28" rx="2"/>
        <circle cx="18" cy="24" r="6"/>
        <path d="M28 18l8 6-8 6z"/>
      </svg>
    )
  }
];
