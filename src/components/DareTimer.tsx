import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Clock } from 'lucide-react';
import './DareTimer.scss';

interface DareTimerProps {
  duration: number; // seconds
}

const DareTimer: React.FC<DareTimerProps> = ({ duration }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            setRunning(false);
            setFinished(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  const reset = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setTimeLeft(duration);
    setRunning(false);
    setFinished(false);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = ((duration - timeLeft) / duration) * 100;

  return (
    <div className="dare-timer">
      <div className="timer-header">
        <Clock size={14} />
        <span>Timer</span>
      </div>

      <div className="timer-ring">
        <svg viewBox="0 0 80 80" className="ring-svg">
          <circle cx="40" cy="40" r="34" className="ring-bg" />
          <motion.circle
            cx="40"
            cy="40"
            r="34"
            className="ring-progress"
            style={{
              strokeDasharray: 213.6,
              strokeDashoffset: 213.6 - (213.6 * progress) / 100,
              stroke: finished ? '#d4af37' : '#8b1a4a',
            }}
            transition={{ duration: 0.5 }}
          />
        </svg>
        <div className="timer-display">
          {finished ? (
            <motion.span
              className="done-text"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              Done!
            </motion.span>
          ) : (
            <span className="time-text">
              {String(minutes).padStart(2, '0')}:
              {String(seconds).padStart(2, '0')}
            </span>
          )}
        </div>
      </div>

      <div className="timer-controls">
        <motion.button
          className="timer-btn"
          onClick={() => setRunning((r) => !r)}
          disabled={finished}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {running ? <Pause size={16} /> : <Play size={16} />}
        </motion.button>
        <motion.button
          className="timer-btn reset"
          onClick={reset}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <RotateCcw size={14} />
        </motion.button>
      </div>

      <AnimatePresence>
        {finished && (
          <motion.p
            className="timer-done-msg"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            ✨ Time's up! Well done.
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DareTimer;

