import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Settings, ChevronRight, RotateCcw, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import ConfirmDialog from './ConfirmDialog';
import './SettingsModal.scss';

interface SettingsModalProps {
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
  const { settings, updateSettings, resetAll, progress } = useApp();
  const [confirmResetAll, setConfirmResetAll] = useState(false);

  const handleResetAll = () => {
    resetAll();
    setConfirmResetAll(false);
  };

  const totalCompleted = Object.values(progress.levels).reduce(
    (acc, lp) => acc + lp.dareProgress.filter((d) => d.completed).length,
    0
  );

  return (
    <AnimatePresence>
      <motion.div
        className="settings-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          className="settings-panel glass"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', stiffness: 280, damping: 30 }}
        >
          <div className="settings-header">
            <div className="settings-title">
              <Settings size={18} />
              <h3>Settings</h3>
            </div>
            <button className="close-btn" onClick={onClose}>
              <X size={20} />
            </button>
          </div>

          <div className="settings-body">
            {/* Stats */}
            <div className="settings-section">
              <h4>Your Progress</h4>
              <div className="stats-row">
                <div className="stat">
                  <span className="val">{totalCompleted}</span>
                  <span className="label">Completed</span>
                </div>
                {[1, 2, 3].map((lvl) => {
                  const lp = progress.levels[lvl];
                  const c = lp?.dareProgress.filter((d) => d.completed).length ?? 0;
                  return (
                    <div className="stat" key={lvl}>
                      <span className="val">{c}</span>
                      <span className="label">Lv {lvl}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Game Options */}
            <div className="settings-section">
              <h4>Game Options</h4>

              <label className="toggle-row">
                <div>
                  <span className="toggle-title">Sequential Level Unlock</span>
                  <span className="toggle-desc">
                    Complete Level 1 before accessing Level 2, etc.
                  </span>
                </div>
                <div
                  className={`toggle ${settings.sequentialUnlock ? 'on' : ''}`}
                  onClick={() =>
                    updateSettings({ sequentialUnlock: !settings.sequentialUnlock })
                  }
                >
                  <div className="thumb" />
                </div>
              </label>

              <label className="toggle-row">
                <div>
                  <span className="toggle-title">Allow Skip</span>
                  <span className="toggle-desc">
                    Either partner can skip a dare at any time.
                  </span>
                </div>
                <div
                  className={`toggle ${settings.consent.skipAllowed ? 'on' : ''}`}
                  onClick={() =>
                    updateSettings({
                      consent: {
                        ...settings.consent,
                        skipAllowed: !settings.consent.skipAllowed,
                      },
                    })
                  }
                >
                  <div className="thumb" />
                </div>
              </label>
            </div>

            {/* Danger Zone */}
            <div className="settings-section danger-zone">
              <h4>Reset</h4>
              <button
                className="danger-btn"
                onClick={() => setConfirmResetAll(true)}
              >
                <Trash2 size={16} />
                Reset All Progress
                <ChevronRight size={14} className="chevron" />
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {confirmResetAll && (
          <ConfirmDialog
            title="Reset All Progress?"
            message="This will clear all your completed dares and progress across all levels. This cannot be undone."
            confirmLabel="Reset Everything"
            onConfirm={handleResetAll}
            onCancel={() => setConfirmResetAll(false)}
          />
        )}
      </AnimatePresence>
    </AnimatePresence>
  );
};

export default SettingsModal;

