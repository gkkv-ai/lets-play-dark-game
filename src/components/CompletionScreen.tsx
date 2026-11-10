import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, RotateCcw, ArrowLeft, Star, Heart } from 'lucide-react';
import { useApp } from '../context/AppContext';
import ConfirmDialog from './ConfirmDialog';
import './CompletionScreen.scss';

interface CompletionScreenProps {
  levelId: number;
  totalDares: number;
}

const CompletionScreen: React.FC<CompletionScreenProps> = ({ levelId, totalDares }) => {
  const { progress, resetLevel, setView, setActiveLevel } = useApp();
  const lp = progress.levels[levelId];
  const completed = lp?.dareProgress.filter((d) => d.completed).length ?? 0;
  const pct = totalDares > 0 ? Math.round((completed / totalDares) * 100) : 0;
  const [confirmReset, setConfirmReset] = useState(false);

  const handleReset = () => {
    resetLevel(levelId);
    setConfirmReset(false);
    setView('dare-grid');
  };

  return (
    <div className="completion-screen">
      {/* Confetti-like particles */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="confetti-dot"
          initial={{
            y: 0,
            x: `${10 + i * 7}%`,
            scale: 0,
            opacity: 0,
          }}
          animate={{
            y: [0, -120 - Math.random() * 80, 200],
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
            rotate: [0, Math.random() * 360],
          }}
          transition={{
            duration: 2.5,
            delay: i * 0.15,
            repeat: Infinity,
            repeatDelay: 3,
          }}
          style={{ background: i % 2 === 0 ? '#d4af37' : '#8b1a4a' }}
        />
      ))}

      <motion.div
        className="completion-card glass"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      >
        <motion.div
          className="trophy-wrap"
          animate={{ rotate: [-5, 5, -5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Trophy size={56} className="trophy-icon" />
        </motion.div>

        <h2>Level Complete!</h2>
        <p className="subtitle">You've explored this level together.</p>

        <div className="stats-row">
          <div className="stat-block">
            <Heart size={20} />
            <span className="val">{completed}</span>
            <span className="label">Dares Done</span>
          </div>
          <div className="stat-block accent">
            <Star size={20} />
            <span className="val">{pct}%</span>
            <span className="label">Completion</span>
          </div>
          <div className="stat-block">
            <span className="val">{totalDares}</span>
            <span className="label">Total Dares</span>
          </div>
        </div>

        <div className="completion-actions">
          <motion.button
            className="btn-restart"
            onClick={() => setConfirmReset(true)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <RotateCcw size={16} />
            Restart Level
          </motion.button>

          <motion.button
            className="btn-levels"
            onClick={() => {
              setActiveLevel(null);
              setView('levels');
            }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <ArrowLeft size={16} />
            Choose Another Level
          </motion.button>
        </div>
      </motion.div>

      <AnimatePresence>
        {confirmReset && (
          <ConfirmDialog
            title="Restart Level?"
            message="This will clear all completed dares for this level. Are you sure?"
            onConfirm={handleReset}
            onCancel={() => setConfirmReset(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default CompletionScreen;

