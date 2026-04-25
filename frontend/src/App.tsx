import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Music, Play, Sparkles, Wand2 } from 'lucide-react';

const PIANO_KEYS = [
  { note: 'C4', type: 'white' }, { note: 'C#4', type: 'black' },
  { note: 'D4', type: 'white' }, { note: 'D#4', type: 'black' },
  { note: 'E4', type: 'white' }, { note: 'F4', type: 'white' },
  { note: 'F#4', type: 'black' }, { note: 'G4', type: 'white' },
  { note: 'G#4', type: 'black' }, { note: 'A4', type: 'white' },
  { note: 'A#4', type: 'black' }, { note: 'B4', type: 'white' },
  { note: 'C5', type: 'white' }, { note: 'C#5', type: 'black' },
  { note: 'D5', type: 'white' }, { note: 'D#5', type: 'black' },
  { note: 'E5', type: 'white' },
];

function App() {
  const isPlaying = window.location.hash === '#playing';
  const prompt = isPlaying ? "A melancholic jazz progression for a rainy day..." : "A melancholic jazz progression for a rainy day...";
  
  const chords = isPlaying ? [
    { chord: 'Dm9', notes: ['D4', 'F4', 'A4', 'C5', 'E5'] },
    { chord: 'G13', notes: ['G4', 'B4', 'D5', 'F5', 'E5'] },
    { chord: 'Cmaj9', notes: ['C4', 'E4', 'G4', 'B4', 'D5'] },
    { chord: 'A7alt', notes: ['A4', 'C#5', 'E5', 'G5', 'Bb5'] },
  ] : [];

  const activeNotes = new Set(isPlaying ? ['D4', 'F4', 'A4', 'C5', 'E5'] : []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <header style={{ padding: '2rem', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <Music color="#3b82f6" size={32} />
          <h1 style={{ margin: 0, fontSize: '2.5rem', fontWeight: 800, background: 'linear-gradient(to right, #3b82f6, #10b981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Piano Vision Hub
          </h1>
        </div>
        <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>AI-Powered Chord Progression Generator</p>
      </header>

      <main style={{ flex: 1, padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
        <div className="glass-panel" style={{ width: '100%', maxWidth: '800px', padding: '2rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <label style={{ fontWeight: 600, color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Wand2 size={18} /> Describe your mood or genre
            </label>
            <textarea
              className="input-area custom-scrollbar"
              rows={3}
              value={prompt}
              readOnly
            />
            <button className="btn-primary" style={{ alignSelf: 'flex-start' }}>
              <Sparkles size={20} />
              Generate Chords
            </button>
          </div>
        </div>

        {chords.length > 0 && (
          <div className="glass-panel" style={{ width: '100%', maxWidth: '800px', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#e2e8f0' }}>Generated Progression</h2>
              <button className="btn-primary">
                <Play size={20} /> Play
              </button>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '1rem' }}>
              {chords.map((chord, i) => (
                <div key={i} style={{ background: i === 0 ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.05)', border: i === 0 ? '1px solid #3b82f6' : '1px solid transparent', padding: '1rem', borderRadius: '0.5rem', minWidth: '120px', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#3b82f6' }}>{chord.chord}</div>
                  <div style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '0.5rem' }}>{chord.notes.join(', ')}</div>
                </div>
              ))}
            </div>

            <div className="piano-container">
              {PIANO_KEYS.map((key, i) => (
                <div
                  key={key.note}
                  className={`key-${key.type} ${activeNotes.has(key.note) ? 'active' : ''}`}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      <footer style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
        <p style={{ margin: 0 }}>Built with React, Express, Tone.js & Gemini API 🎹</p>
        <p style={{ margin: 0, fontSize: '0.9rem' }}>Designed by Inshrah Waseem</p>
      </footer>
    </div>
  );
}

export default App;
