import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Flame, Heart, Lock, ChevronRight, Settings } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { gameLevels } from '../data/dares';
import SettingsModal from './SettingsModal';
import './LevelSelection.scss';

const intensityDots = (n: number) =>
  [...Array(5)].map((_, i) => (
    <span key={i} className={`idot ${i < n ? 'active' : ''}`} />
  ));

const LevelSelection: React.FC = () => {
  const { setView, setActiveLevel, progress, settings, getDaresForLevel } = useApp();
  const [showSettings, setShowSettings] = useState(false);

  const isUnlocked = (levelId: number): boolean => {
    if (!settings.sequentialUnlock) return true;
    if (levelId === 1) return true;
    const prev = progress.levels[levelId - 1];
    if (!prev) return false;
    const prevDares = getDaresForLevel(levelId - 1);
    const completed = prev.dareProgress.filter((d) => d.completed).length;
    return completed >= Math.ceil(prevDares.length * 0.5);
  };

  const handleSelectLevel = (levelId: number) => {
    if (!isUnlocked(levelId)) return;
    setActiveLevel(levelId);
    setView('dare-grid');
  };

  return (
    <div className="level-selection">
      {/* Ambient bg petals */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="bg-petal"
          style={{ left: `${10 + i * 11}%`, top: `${5 + (i * 13) % 80}%` }}
          animate={{ scale: [1, 1.4, 1], opacity: [0.03, 0.08, 0.03] }}
          transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.6 }}
        />
      ))}

      <div className="page-header">
        <button className="back-btn" onClick={() => setView('landing')}>
          <ArrowLeft size={18} />
        </button>
        <div className="header-title">
          <Heart size={14} />
          <span>Choose Your Level</span>
        </div>
        <button className="settings-btn" onClick={() => setShowSettings(true)}>
          <Settings size={18} />
        </button>
      </div>

      <div className="level-cards">
        {gameLevels.map((level, index) => {
          const unlocked = isUnlocked(level.id);
          const lp = progress.levels[level.id];
          const dares = getDaresForLevel(level.id);
          const completed = lp?.dareProgress.filter((d) => d.completed).length ?? 0;
          const pct = dares.length > 0 ? Math.round((completed / dares.length) * 100) : 0;

          return (
            <motion.div
              key={level.id}
              className={`level-card ${!unlocked ? 'locked' : ''}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15 }}
              whileHover={unlocked ? { scale: 1.02, y: -4 } : {}}
              onClick={() => handleSelectLevel(level.id)}
            >
              <div className="level-bg" style={{ background: `radial-gradient(ellipse at top left, ${level.color}50, transparent 70%)` }} />

              <div className="level-top">
                <div className="level-num-badge">
                  <span>{level.subtitle}</span>
                </div>
                {!unlocked && (
                  <div className="lock-badge">
                    <Lock size={14} />
                    <span>Locked</span>
                  </div>
                )}
                {level.intensity > 2 && unlocked && (
                  <div className="intensity-badge">
                    <Flame size={12} />
                    <span>Intensity</span>
                    <div className="dots">{intensityDots(level.intensity)}</div>
                  </div>
                )}
              </div>

              <div className="level-body">
                <h2 className="level-title">{level.title}</h2>
                <p className="level-desc">{level.description}</p>
              </div>

              <div className="level-footer">
                <div className="dare-count">
                  <span className="count-num">{dares.length}</span>
                  <span className="count-label">Dares</span>
                </div>

                {completed > 0 && (
                  <div className="level-progress">
                    <div className="mini-bar">
                      <motion.div
                        className="mini-fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8 }}
                        style={{ background: level.accentColor }}
                      />
                    </div>
                    <span className="mini-pct" style={{ color: level.accentColor }}>
                      {pct}%
                    </span>
                  </div>
                )}

                {unlocked ? (
                  <motion.div
                    className="start-btn"
                    style={{ background: `${level.color}80`, borderColor: `${level.accentColor}60` }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {completed > 0 ? 'Continue' : 'Start Level'}
                    <ChevronRight size={16} />
                  </motion.div>
                ) : (
                  <div className="locked-msg">Complete previous level to unlock</div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </div>
  );
};

export default LevelSelection;

