import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import './GameProgress.scss';

interface GameProgressProps {
  levelId: number;
  totalDares: number;
}

const GameProgress: React.FC<GameProgressProps> = ({ levelId, totalDares }) => {
  const { progress } = useApp();
  const lp = progress.levels[levelId];
  const completed = lp?.dareProgress.filter((d) => d.completed).length ?? 0;
  const skipped = lp?.dareProgress.filter((d) => d.skipped && !d.completed).length ?? 0;
  const remaining = totalDares - completed;
  const pct = totalDares > 0 ? Math.round((completed / totalDares) * 100) : 0;

  return (
    <div className="game-progress">
      <div className="progress-stats">
        <div className="stat">
          <span className="stat-val">{totalDares}</span>
          <span className="stat-label">Total</span>
        </div>
        <div className="stat accent">
          <span className="stat-val">{completed}</span>
          <span className="stat-label">Done</span>
        </div>
        <div className="stat">
          <span className="stat-val">{remaining}</span>
          <span className="stat-label">Left</span>
        </div>
        <div className="stat muted">
          <span className="stat-val">{skipped}</span>
          <span className="stat-label">Skipped</span>
        </div>
      </div>

      <div className="progress-bar-wrap">
        <div className="progress-bar-track">
          <motion.div
            className="progress-bar-fill"
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
        <span className="progress-pct">{pct}%</span>
      </div>
    </div>
  );
};

export default GameProgress;

