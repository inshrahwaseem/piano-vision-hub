import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Music, Play, Sparkles, Wand2 } from 'lucide-react';
import * as Tone from 'tone';

interface ChordData {
  chord: string;
  notes: string[];
  duration: string;
}

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
  const [prompt, setPrompt] = useState('');
  const [chords, setChords] = useState<ChordData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeNotes, setActiveNotes] = useState<Set<string>>(new Set());
  const synth = useRef<Tone.PolySynth | null>(null);

  useEffect(() => {
    // Initialize synth
    synth.current = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'sine' },
      envelope: { attack: 0.05, decay: 0.1, sustain: 0.3, release: 1 }
    }).toDestination();

    return () => {
      synth.current?.dispose();
    };
  }, []);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_URL}/api/generate-chords`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) throw new Error('Failed to generate');
      
      const data = await response.json();
      setChords(data.chords || []);
    } catch (error) {
      console.error(error);
      alert('Failed to generate chords. Make sure backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  const playProgression = async () => {
    if (chords.length === 0 || !synth.current) return;
    
    await Tone.start();
    setIsPlaying(true);
    
    const now = Tone.now();
    let timeOffset = 0;

    chords.forEach((chordData, index) => {
      const duration = Tone.Time(chordData.duration).toSeconds();
      
      // Schedule visual update
      Tone.Draw.schedule(() => {
        setActiveNotes(new Set(chordData.notes));
      }, now + timeOffset);

      // Schedule notes
      synth.current?.triggerAttackRelease(chordData.notes, duration - 0.1, now + timeOffset);
      
      timeOffset += duration;

      // Clear visual update
      Tone.Draw.schedule(() => {
        setActiveNotes(new Set());
        if (index === chords.length - 1) setIsPlaying(false);
      }, now + timeOffset);
    });
  };

  const playNote = async (note: string) => {
    await Tone.start();
    synth.current?.triggerAttackRelease(note, "8n");
    setActiveNotes(new Set([note]));
    setTimeout(() => setActiveNotes(new Set()), 200);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <header style={{ padding: '2rem', textAlign: 'center' }}>
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <Music color="#3b82f6" size={32} />
          <h1 style={{ margin: 0, fontSize: '2.5rem', fontWeight: 800, background: 'linear-gradient(to right, #3b82f6, #10b981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Piano Vision Hub
          </h1>
        </motion.div>
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
              placeholder="e.g., A melancholic jazz progression for a rainy day..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <button className="btn-primary" onClick={handleGenerate} disabled={isLoading || !prompt.trim()} style={{ alignSelf: 'flex-start' }}>
              {isLoading ? <div className="loading-indicator"/> : <Sparkles size={20} />}
              Generate Chords
            </button>
          </div>
        </div>

        {chords.length > 0 && (
          <div className="glass-panel" style={{ width: '100%', maxWidth: '800px', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#e2e8f0' }}>Generated Progression</h2>
              <button className="btn-primary" onClick={playProgression} disabled={isPlaying}>
                <Play size={20} /> Play
              </button>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '1rem' }}>
              {chords.map((chord, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '0.5rem', minWidth: '120px', textAlign: 'center' }}>
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
                  onClick={() => playNote(key.note)}
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
