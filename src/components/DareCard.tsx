import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, Sparkles, Lock, Flame } from 'lucide-react';
import type { Dare } from '../types';
import { useApp } from '../context/AppContext';
import './DareCard.scss';

interface DareCardProps {
  dare: Dare;
  index: number;
  onClick: (dare: Dare) => void;
}

const DareCard: React.FC<DareCardProps> = ({ dare, index, onClick }) => {
  const { progress } = useApp();
  const lp = progress.levels[dare.level];
  const dp = lp?.dareProgress.find((d) => d.dareId === dare.id);
  const isCompleted = dp?.completed ?? false;
  const isSkipped = dp?.skipped ?? false;

  const cardNum = dare.id.replace(/\D/g, '').padStart(2, '0');

  return (
    <motion.div
      className={`dare-card ${isCompleted ? 'completed' : ''} ${isSkipped ? 'skipped' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.35 }}
      whileHover={{ scale: 1.03, y: -4 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => onClick(dare)}
    >
      <div className="card-inner">
        <div className="card-top-row">
          <span className="card-number">Dare #{cardNum}</span>
          {dare.isCustom && <span className="custom-badge">Custom</span>}
        </div>

        {/* Center icon / status */}
        <div className="card-icon-wrap">
          {isCompleted ? (
            <CheckCircle size={28} className="done-icon" />
          ) : isSkipped ? (
            <AlertCircle size={28} className="skip-icon" />
          ) : (
            <motion.div
              className="mystery-lock-glow"
              animate={{ scale: [1, 1.12, 1] }}
              transition={{ duration: 2.4, repeat: Infinity, delay: index * 0.2 }}
            >
              <Flame size={26} className="mystery-flame-icon" />
            </motion.div>
          )}
        </div>

        {/* Center content: BLURRED if not completed so user CANNOT read it */}
        {isCompleted ? (
          <div className="revealed-content">
            <span className="completed-tag">Completed</span>
            <div className="revealed-title">{dare.title}</div>
          </div>
        ) : isSkipped ? (
          <div className="skipped-content">
            <span className="skipped-tag">Skipped</span>
            <div className="card-hint">Tap to retry</div>
          </div>
        ) : (
          <div className="mystery-blur-box">
            {/* Real dare text heavily blurred to keep it totally secret */}
            <div className="secret-text-blur" aria-hidden="true">
              {dare.title} {dare.category}
            </div>

            {/* Overlaid mystery label */}
            <div className="mystery-badge-overlay">
              <Lock size={12} />
              <span>Tap to Reveal</span>
            </div>
          </div>
        )}

        {!isCompleted && !isSkipped && (
          <div className="card-tap-cue">
            <Sparkles size={11} />
            <span>Mystery Dare</span>
          </div>
        )}
      </div>

      <div className="card-glow" />
    </motion.div>
  );
};

export default DareCard;
