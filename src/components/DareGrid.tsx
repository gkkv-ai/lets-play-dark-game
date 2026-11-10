import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Shuffle,
  BookHeart,
  RotateCcw,
  Pause,
  Square,
} from 'lucide-react';
import type { Dare } from '../types';
import { useApp } from '../context/AppContext';
import { gameLevels } from '../data/dares';
import DareCard from './DareCard';
import DareRevealModal from './DareRevealModal';
import GameProgress from './GameProgress';
import CompletionScreen from './CompletionScreen';
import CustomDareManager from './CustomDareManager';
import ConfirmDialog from './ConfirmDialog';
import './DareGrid.scss';

const DareGrid: React.FC = () => {
  const {
    activeLevel,
    setView,
    setActiveLevel,
    getDaresForLevel,
    completeDare,
    skipDare,
    nextRandomDare,
    resetLevel,
    progress,
  } = useApp();

  const [activeDare, setActiveDare] = useState<Dare | null>(null);
  const [justCompleted, setJustCompleted] = useState(false);
  const [showCustom, setShowCustom] = useState(false);
  const [confirmResetLevel, setConfirmResetLevel] = useState(false);
  const [showStopConfirm, setShowStopConfirm] = useState(false);
  const [paused, setPaused] = useState(false);

  if (!activeLevel) return null;

  const level = gameLevels.find((l) => l.id === activeLevel);
  const dares = getDaresForLevel(activeLevel);
  const lp = progress.levels[activeLevel];
  const completedCount = lp?.dareProgress.filter((d) => d.completed).length ?? 0;
  const isAllDone = completedCount >= dares.length && dares.length > 0;

  if (isAllDone) {
    return <CompletionScreen levelId={activeLevel} totalDares={dares.length} />;
  }

  const handleDareClick = (dare: Dare) => {
    if (paused) return;
    setJustCompleted(false);
    setActiveDare(dare);
  };

  const handleCompleted = () => {
    if (!activeDare) return;
    completeDare(activeLevel, activeDare.id);
    setJustCompleted(true);
  };

  const handleSkip = () => {
    if (!activeDare) return;
    skipDare(activeLevel, activeDare.id);
    setActiveDare(null);
  };

  const handleClose = () => {
    setActiveDare(null);
    setJustCompleted(false);
  };

  const handleNextRandom = () => {
    const next = nextRandomDare(activeLevel, activeDare?.id);
    if (next) {
      setJustCompleted(false);
      setActiveDare(next);
    } else {
      // All done
      setActiveDare(null);
    }
  };

  const handleRandomDirect = () => {
    const next = nextRandomDare(activeLevel);
    if (next) {
      setJustCompleted(false);
      setActiveDare(next);
    }
  };

  const handleReset = () => {
    resetLevel(activeLevel);
    setConfirmResetLevel(false);
    setActiveDare(null);
  };

  const handleStop = () => {
    setActiveLevel(null);
    setView('levels');
    setShowStopConfirm(false);
  };

  return (
    <div className="dare-grid-page">
      {/* Header */}
      <div className="dare-header">
        <button className="back-btn" onClick={() => setView('levels')}>
          <ArrowLeft size={18} />
        </button>
        <div className="header-info">
          <span className="level-label">{level?.subtitle}</span>
          <span className="level-name">{level?.title}</span>
        </div>
        <div className="header-actions">
          <button
            className={`pause-btn ${paused ? 'paused' : ''}`}
            onClick={() => setPaused((p) => !p)}
            title={paused ? 'Resume' : 'Pause'}
          >
            {paused ? <Square size={16} /> : <Pause size={16} />}
          </button>
        </div>
      </div>

      {/* Paused banner */}
      <AnimatePresence>
        {paused && (
          <motion.div
            className="paused-banner"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            Game Paused — tap the button to resume
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress */}
      <div className="progress-wrap">
        <GameProgress levelId={activeLevel} totalDares={dares.length} />
      </div>

      {/* Action bar */}
      <div className="action-bar">
        <motion.button
          className="btn-random"
          onClick={handleRandomDirect}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          disabled={paused}
        >
          <Shuffle size={15} />
          Random Dare
        </motion.button>
        <button
          className="btn-manage"
          onClick={() => setShowCustom(true)}
          disabled={paused}
        >
          <BookHeart size={15} />
          My Dares
        </button>
        <button className="btn-reset-lvl" onClick={() => setConfirmResetLevel(true)}>
          <RotateCcw size={14} />
        </button>
      </div>

      {/* Dare grid */}
      <div className="dare-grid">
        {dares.map((dare, i) => (
          <DareCard
            key={dare.id}
            dare={dare}
            index={i}
            onClick={handleDareClick}
          />
        ))}
      </div>

      {/* Stop game link */}
      <button className="stop-game-btn" onClick={() => setShowStopConfirm(true)}>
        Stop Game
      </button>

      {/* Dare modal */}
      <AnimatePresence>
        {activeDare && (
          <DareRevealModal
            dare={activeDare}
            levelId={activeLevel}
            onClose={handleClose}
            onCompleted={handleCompleted}
            onSkip={handleSkip}
            onNextRandom={handleNextRandom}
            justCompleted={justCompleted}
          />
        )}
      </AnimatePresence>

      {/* Custom dare manager */}
      <AnimatePresence>
        {showCustom && <CustomDareManager onClose={() => setShowCustom(false)} />}
      </AnimatePresence>

      {/* Confirm reset level */}
      <AnimatePresence>
        {confirmResetLevel && (
          <ConfirmDialog
            title="Reset Level?"
            message="All completed dares in this level will be reset. Are you sure?"
            onConfirm={handleReset}
            onCancel={() => setConfirmResetLevel(false)}
          />
        )}
      </AnimatePresence>

      {/* Confirm stop */}
      <AnimatePresence>
        {showStopConfirm && (
          <ConfirmDialog
            title="Stop Game?"
            message="Return to the level selection screen? Progress is saved."
            confirmLabel="Stop Game"
            onConfirm={handleStop}
            onCancel={() => setShowStopConfirm(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default DareGrid;

