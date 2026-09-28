import React, { useState, useEffect, useRef } from 'react';

/**
 * HeritageAudioPlayer provides an ambient classical Indian music experience (Tanpura & Flute drone harmonics).
 * Built with Web Audio API for zero-latency, offline-safe, pristine resonance.
 */
export default function HeritageAudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  const audioCtxRef = useRef(null);
  const gainNodeRef = useRef(null);
  const oscillatorsRef = useRef([]);

  // Initialize Web Audio synthesizers for authentic Tanpura harmonics (Sa: 136.1Hz, Pa: 204.1Hz, High Sa: 272.2Hz)
  const startHarmonics = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;

      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContext();
      }

      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }

      const ctx = audioCtxRef.current;
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(isMuted ? 0 : volume * 0.15, ctx.currentTime);
      masterGain.connect(ctx.destination);
      gainNodeRef.current = masterGain;

      // Sacred Tanpura chord: Sa (C#3: 138.59 Hz), Pa (G#3: 207.65 Hz), Sa' (C#4: 277.18 Hz), Ni/Ga overtone
      const freqs = [138.59, 207.65, 277.18, 554.37];
      const oscList = [];

      freqs.forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();
        
        // Use soft sine / warm triangle wave
        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(f, ctx.currentTime);

        // LFO subtle shimmer for traditional acoustic string vibrato
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.setValueAtTime(0.2 + idx * 0.15, ctx.currentTime);
        lfoGain.gain.setValueAtTime(0.8, ctx.currentTime);
        lfo.connect(osc.frequency);
        lfo.start();

        // Slow rhythmic strum envelop
        oscGain.gain.setValueAtTime(0.08 / (idx + 1), ctx.currentTime);
        osc.connect(oscGain);
        oscGain.connect(masterGain);
        osc.start();

        oscList.push(osc, lfo);
      });

      oscillatorsRef.current = oscList;
      setIsPlaying(true);
    } catch (e) {
      console.error('Audio synthesizer error', e);
    }
  };

  const stopHarmonics = () => {
    try {
      oscillatorsRef.current.forEach(node => {
        try { node.stop(); } catch {}
      });
      oscillatorsRef.current = [];
      setIsPlaying(false);
    } catch (e) {
      console.error(e);
    }
  };

  const togglePlayback = () => {
    if (isPlaying) {
      stopHarmonics();
    } else {
      startHarmonics();
    }
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setValueAtTime(isMuted ? 0 : val * 0.15, audioCtxRef.current.currentTime);
    }
  };

  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setValueAtTime(newMuted ? 0 : volume * 0.15, audioCtxRef.current.currentTime);
    }
  };

  useEffect(() => {
    return () => {
      stopHarmonics();
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  return (
    <div className="heritage-audio-widget" aria-label="Heritage Classical Music Player">
      <div 
        className={`audio-pill-wrap ${isPlaying ? 'playing' : ''}`}
        onMouseEnter={() => setShowVolumeSlider(true)}
        onMouseLeave={() => setShowVolumeSlider(false)}
      >
        <button 
          type="button"
          className="audio-play-toggle-btn"
          onClick={togglePlayback}
          title={isPlaying ? "Pause Traditional Raga" : "Play Traditional Raga Drone"}
        >
          {isPlaying ? (
            <span className="audio-icon-pause">⏸</span>
          ) : (
            <span className="audio-icon-play">🎵</span>
          )}
        </button>

        <div className="audio-info-label" onClick={togglePlayback}>
          <span className="audio-title">కళాక్షి ధ్వని</span>
          <span className="audio-sub">{isPlaying ? 'Raga Bhairav' : 'Ambient Heritage'}</span>
        </div>

        {/* SOUNDWAVE VISUALIZER */}
        <div className={`audio-soundwaves ${isPlaying ? 'active' : ''}`} onClick={togglePlayback}>
          <span className="wave-bar w1"></span>
          <span className="wave-bar w2"></span>
          <span className="wave-bar w3"></span>
          <span className="wave-bar w4"></span>
        </div>

        {/* VOLUME CONTROLLER (SLIDER) */}
        {showVolumeSlider && (
          <div className="audio-volume-panel">
            <button 
              type="button" 
              className="mute-btn" 
              onClick={toggleMute}
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted || volume === 0 ? '🔇' : '🔊'}
            </button>
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.05" 
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="volume-slider"
            />
          </div>
        )}
      </div>
    </div>
  );
}
