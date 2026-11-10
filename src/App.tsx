import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AppProvider, useApp } from './context/AppContext';
import LandingPage from './components/LandingPage';
import LevelSelection from './components/LevelSelection';
import DareGrid from './components/DareGrid';
import ConsentSetup from './components/ConsentSetup';
import './styles/global.scss';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  enter: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const AppInner: React.FC = () => {
  const { view } = useApp();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={view}
        variants={pageVariants}
        initial="initial"
        animate="enter"
        exit="exit"
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        style={{ minHeight: '100vh' }}
      >
        {view === 'landing' && <LandingPage />}
        {view === 'consent' && <ConsentSetup />}
        {view === 'levels' && <LevelSelection />}
        {view === 'dare-grid' && <DareGrid />}
      </motion.div>
    </AnimatePresence>
  );
};

const App: React.FC = () => (
  <AppProvider>
    <AppInner />
  </AppProvider>
);

export default App;

