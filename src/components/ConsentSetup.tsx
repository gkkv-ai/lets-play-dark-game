import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, Flame, Wine, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import './ConsentSetup.scss';

const funVibes = [
  '🔥 Anything goes tonight',
  '🚫 Tickling is strictly illegal',
  '🕯️ Dim lights & romantic music',
  '🍷 Sips of wine between dares',
  '👑 Loser owes a 15-min massage',
  '🤫 Shh... neighbors are sleeping',
  '🫦 Clothes are merely suggestions',
  '🍕 Post-game midnight snacks required',
];

const ConsentSetup: React.FC = () => {
  const { settings, updateSettings, setView } = useApp();
  const [selectedVibes, setSelectedVibes] = useState<string[]>(
    settings.consent.boundaries.length > 0
      ? settings.consent.boundaries
      : ['🔥 Anything goes tonight', '🫦 Clothes are merely suggestions']
  );
  const [agreed, setAgreed] = useState(true); // default checked for low friction

  const toggleVibe = (vibe: string) => {
    setSelectedVibes((prev) =>
      prev.includes(vibe) ? prev.filter((x) => x !== vibe) : [...prev, vibe]
    );
  };

  const handleStart = () => {
    updateSettings({
      consent: {
        confirmed: true,
        skipAllowed: true,
        pauseAllowed: true,
        boundaries: selectedVibes,
        customBoundaries: [],
      },
    });
    setView('levels');
  };

  return (
    <div className="consent-setup">
      {/* Floating petals */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="petal"
          initial={{ y: -20, x: Math.random() * window.innerWidth, opacity: 0 }}
          animate={{
            y: window.innerHeight + 50,
            rotate: 360,
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: 6 + Math.random() * 4,
            repeat: Infinity,
            delay: i * 1.2,
          }}
        />
      ))}

      <motion.div
        className="consent-card glass"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="consent-header">
          <motion.div
            className="flame-badge"
            animate={{ scale: [1, 1.15, 1], rotate: [-4, 4, -4] }}
            transition={{ duration: 2.2, repeat: Infinity }}
          >
            <Flame size={32} className="flame-icon" />
          </motion.div>
          <h2>The Lovers' Pact 😈🥂</h2>
          <p className="subtitle">
            No boring legal terms here — just pure intimacy, playfulness, and zero judgment between partners.
          </p>
        </div>

        <div className="consent-body">
          {/* Playful couple rules */}
          <div className="playful-rules">
            <div className="rule-item">
              <span className="rule-emoji">💋</span>
              <div className="rule-text">
                <strong>All Kisses & Mischief Accepted</strong>
                <p>Spontaneity is the goal. Blushing, teasing, and messy hair are highly encouraged.</p>
              </div>
            </div>

            <div className="rule-item">
              <span className="rule-emoji">🤣</span>
              <div className="rule-text">
                <strong>The Giggle Immunity Clause</strong>
                <p>If either of us trips, gets tangled, or makes a weird noise, we laugh it off together!</p>
              </div>
            </div>

            <div className="rule-item">
              <span className="rule-emoji">🤫</span>
              <div className="rule-text">
                <strong>Midnight Secrecy</strong>
                <p>What happens After Dark stays strictly between the two of us (unless we brag later 😉).</p>
              </div>
            </div>

            <div className="rule-item">
              <span className="rule-emoji">🍷</span>
              <div className="rule-text">
                <strong>Comfort Above All</strong>
                <p>No pressure, ever. Skip, pause, or take a breather whenever either of you wants.</p>
              </div>
            </div>
          </div>

          {/* Tonight's vibe tags */}
          <div className="vibes-section">
            <div className="vibes-title">
              <Sparkles size={14} />
              <span>Tonight's Ground Rules & Vibes (Tap to toggle):</span>
            </div>
            <div className="vibes-grid">
              {funVibes.map((vibe) => (
                <button
                  key={vibe}
                  type="button"
                  className={`vibe-chip ${selectedVibes.includes(vibe) ? 'active' : ''}`}
                  onClick={() => toggleVibe(vibe)}
                >
                  {vibe}
                </button>
              ))}
            </div>
          </div>

          {/* Sassy checkbox */}
          <label className="agree-check">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            <span className="check-text">
              We solemnly swear we are up to no good, fully consenting, and ready to accept each other's wild dares tonight! 🫦🔥
            </span>
          </label>
        </div>

        <div className="consent-actions">
          <motion.button
            className="btn-primary"
            onClick={handleStart}
            disabled={!agreed}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <span>Let's Get Naughty</span>
            <ChevronRight size={18} />
          </motion.button>

          <button className="btn-ghost" onClick={handleStart}>
            Fast Track (Skip & Dive In 🚀)
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ConsentSetup;
