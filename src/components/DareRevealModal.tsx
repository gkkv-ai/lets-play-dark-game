import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, SkipForward, Heart, Tag, Shuffle, Sparkles, Flame, Eye } from 'lucide-react';
import type { Dare } from '../types';
import { useApp } from '../context/AppContext';
import DareTimer from './DareTimer';
import './DareRevealModal.scss';

interface DareRevealModalProps {
  dare: Dare;
  levelId: number;
  onClose: () => void;
  onCompleted: () => void;
  onSkip: () => void;
  onNextRandom: () => void;
  justCompleted?: boolean;
}

const DareRevealModal: React.FC<DareRevealModalProps> = ({
  dare,
  levelId,
  onClose,
  onCompleted,
  onSkip,
  onNextRandom,
  justCompleted = false,
}) => {
  const [revealed, setRevealed] = useState(false);
  const { progress } = useApp();

  const lp = progress.levels[levelId];
  const dp = lp?.dareProgress.find((d) => d.dareId === dare.id);
  const isAlreadyCompleted = dp?.completed ?? false;

  const isClear = revealed || isAlreadyCompleted;

  return (
    <AnimatePresence>
      <motion.div
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          className="dare-modal glass"
          initial={{ opacity: 0, scale: 0.85, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 50 }}
          transition={{ type: 'spring', stiffness: 260, damping: 25 }}
        >
          {/* Close button */}
          <button className="modal-close" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>

          {/* Header */}
          <div className="modal-header">
            <div className="dare-num">
              Dare #{dare.id.replace(/\D/g, '').padStart(2, '0')}
            </div>
            <div className="dare-category">
              <Tag size={12} />
              <span>{isClear ? dare.category : 'Mystery Category'}</span>
            </div>
          </div>

          {/* Mystery Dare Card with interactive blur */}
          <div className="dare-card-stage">
            <motion.div
              className={`dare-blur-container ${isClear ? 'unblurred' : 'blurred'}`}
              onClick={() => !isClear && setRevealed(true)}
              whileTap={!isClear ? { scale: 0.98 } : {}}
            >
              {/* Actual dare content that gets unblurred */}
              <motion.div
                className="dare-inner-content"
                animate={{
                  filter: isClear ? 'blur(0px)' : 'blur(16px)',
                  opacity: isClear ? 1 : 0.35,
                }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              >
                <h2 className="dare-title">{dare.title}</h2>
                <p className="dare-description">{dare.description}</p>

                {isClear && dare.duration && (
                  <motion.div
                    className="timer-wrapper"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <DareTimer duration={dare.duration} />
                  </motion.div>
                )}
              </motion.div>

              {/* Tap to Unblur Overlay if hidden */}
              {!isClear && (
                <motion.div
                  className="tap-to-unblur-overlay"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.div
                    className="unblur-pulse-icon"
                    animate={{ scale: [1, 1.15, 1], rotate: [-5, 5, -5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Flame size={38} className="flame-glow" />
                  </motion.div>
                  <span className="unblur-title">Tap Card to Unblur</span>
                  <p className="unblur-subtitle">Reveal what your partner has in store for you 🔥</p>
                  <div className="tap-badge">
                    <Eye size={14} />
                    <span>Click to Reveal</span>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Celebration on just completed */}
          <AnimatePresence>
            {justCompleted && (
              <motion.div
                className="celebration"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
              >
                <span>✨ Dare Completed! You both nailed it! ✨</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Actions */}
          <div className="modal-actions">
            {!isAlreadyCompleted && (
              <>
                <motion.button
                  className="btn-complete"
                  onClick={() => {
                    if (!isClear) setRevealed(true);
                    onCompleted();
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <CheckCircle size={18} />
                  <span>Mark Completed</span>
                </motion.button>

                <motion.button
                  className="btn-next"
                  onClick={onNextRandom}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Shuffle size={16} />
                  <span>Next Random Dare</span>
                </motion.button>

                <motion.button
                  className="btn-skip"
                  onClick={onSkip}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <SkipForward size={16} />
                  <span>Skip Dare</span>
                </motion.button>
              </>
            )}

            {isAlreadyCompleted && (
              <>
                <div className="already-done">
                  <CheckCircle size={16} /> Dare Completed
                </div>
                <motion.button
                  className="btn-next"
                  onClick={onNextRandom}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Shuffle size={16} />
                  <span>Next Random Dare</span>
                </motion.button>
              </>
            )}
          </div>

          <p className="safety-note">
            Your comfort comes first. Either partner can pause, laugh, or skip at any time.
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DareRevealModal;
