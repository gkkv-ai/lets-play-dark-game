import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Settings, Sparkles, ChevronRight, BookHeart } from 'lucide-react';
import { useApp } from '../context/AppContext';
import SettingsModal from './SettingsModal';
import CustomDareManager from './CustomDareManager';
import './LandingPage.scss';

const FloatingPetal: React.FC<{ index: number }> = ({ index }) => {
  const startX = 5 + (index * 11) % 90;
  const duration = 8 + (index * 1.3) % 6;
  const delay = (index * 0.9) % 5;

  return (
    <motion.div
      className="petal"
      style={{ left: `${startX}%` }}
      initial={{ y: -30, opacity: 0, rotate: 0 }}
      animate={{
        y: ['0vh', '110vh'],
        rotate: [0, 180, 360],
        opacity: [0, 0.5, 0.5, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'linear',
      }}
    />
  );
};

const LandingPage: React.FC = () => {
  const { setView, settings } = useApp();
  const [showSettings, setShowSettings] = useState(false);
  const [showCustom, setShowCustom] = useState(false);

  const handleStart = () => {
    if (settings.consent.confirmed) {
      setView('levels');
    } else {
      setView('consent');
    }
  };

  return (
    <div className="landing-page">
      {/* Floating petals */}
      {[...Array(14)].map((_, i) => (
        <FloatingPetal key={i} index={i} />
      ))}

      {/* Top bar */}
      <div className="top-bar">
        <div className="app-logo">
          <Heart size={16} />
          <span>AFTER DARK</span>
        </div>
        <button className="settings-btn" onClick={() => setShowSettings(true)}>
          <Settings size={20} />
        </button>
      </div>

      {/* Hero section */}
      <div className="hero">
        <motion.div
          className="hero-badge"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Sparkles size={14} />
          <span>Private · Intimate · Exclusive</span>
        </motion.div>

        <motion.h1
          className="hero-title"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          AFTER
          <br />
          <span className="gold">DARK</span>
        </motion.h1>

        <motion.p
          className="hero-tagline"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          A Private Game for Two
        </motion.p>

        <motion.p
          className="hero-desc"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65 }}
        >
          Explore intimacy, ignite passion, and deepen your connection through
          mystery dare cards designed exclusively for consenting adults in a relationship.
        </motion.p>

        <motion.button
          className="btn-start"
          onClick={handleStart}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.75 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.96 }}
        >
          <Heart size={18} />
          Begin Tonight
          <ChevronRight size={18} />
        </motion.button>
      </div>

      {/* Level preview cards */}
      <motion.div
        className="level-preview"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        {[
          { level: '01', title: 'Romantic & Sensual', desc: 'Playful, teasing, intimate', color: '#8b1a4a' },
          { level: '02', title: 'Passion & Intimacy', desc: 'Adventurous, sensual, bold', color: '#6b0f2e' },
          { level: '03', title: 'Extreme Intimacy', desc: 'Intense, roleplay, wild', color: '#3d0a1e' },
        ].map((l, i) => (
          <motion.div
            key={l.level}
            className="preview-card"
            style={{ borderColor: `${l.color}80` }}
            whileHover={{ scale: 1.03, y: -4 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="preview-num" style={{ color: l.color }}>
              Level {l.level}
            </div>
            <div className="preview-title">{l.title}</div>
            <div className="preview-desc">{l.desc}</div>
            <div className="preview-dots">
              {[...Array(i + 1)].map((_, j) => (
                <div key={j} className="dot" style={{ background: l.color }} />
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Custom dares */}
      <motion.div
        className="bottom-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}
      >
        <button className="btn-custom" onClick={() => setShowCustom(true)}>
          <BookHeart size={16} />
          Manage My Dares
        </button>

        <p className="consent-note">
          <Heart size={11} />
          This game is for consenting adults. Every dare is optional. Either
          partner can skip or stop at any time.
        </p>
      </motion.div>

      {/* Modals */}
      <AnimatePresence>
        {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
      </AnimatePresence>
      <AnimatePresence>
        {showCustom && <CustomDareManager onClose={() => setShowCustom(false)} />}
      </AnimatePresence>
    </div>
  );
};

export default LandingPage;

