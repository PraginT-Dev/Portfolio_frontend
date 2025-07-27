import React, { useState } from 'react';
import ProjectDetails from '../pages/ProjectDetails';
import Skills from '../pages/Skills';
import Achievements from '../pages/Achievements';
import ConnectUs from '../pages/Connect';
import ParallaxBackground from '../components_front/ParallaxBackground';
import { AnimatePresence, motion } from 'framer-motion';
import Homepage from '../pages/Homepage';

const MainPage: React.FC = () => {
  const [view, setView] = useState<'home' | 'projects' | 'skills' | 'achievements' | 'connect'>('home');

  const handleBack = () => setView('home');
  const handleReturnToHome = () => setView('home');

  return (
    <div className="main-container" style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}>
      <ParallaxBackground />

      <AnimatePresence mode="wait">
        {view === 'home' && (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'auto',
            }}
          >
            <Homepage
              onEnterProjects={() => setView('projects')}
              onEnterSkills={() => setView('skills')}
              onEnterAchievements={() => setView('achievements')}
              onEnterConnect={() => setView('connect')}
            />
          </motion.div>
        )}

        {view === 'projects' && (
          <motion.div key="projects" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
          >
            <ProjectDetails onBack={handleBack} />
          </motion.div>
        )}

        {view === 'skills' && (
          <motion.div key="skills" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
          >
            <Skills onBack={handleBack} />
          </motion.div>
        )}

        {view === 'achievements' && (
          <motion.div key="achievements" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
          >
            <Achievements onBack={handleBack} />
          </motion.div>
        )}

        {view === 'connect' && (
          <motion.div key="connect" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
          >
            <ConnectUs onBack={handleBack} onReturnHome={handleReturnToHome} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MainPage;
