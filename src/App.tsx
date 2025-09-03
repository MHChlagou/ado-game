import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameProvider, useGame } from './context/GameContext';
import { LEVELS } from './data/levels';
import WelcomeScreen from './components/WelcomeScreen';
import LevelSelector from './components/LevelSelector';
import GameLevel from './components/GameLevel';
import ProgressDashboard from './components/ProgressDashboard';
import CompletionScreen from './components/CompletionScreen';

type GameScreen = 'welcome' | 'dashboard' | 'level-selector' | 'level' | 'completion';

function GameApp() {
  const { state } = useGame();
  const [currentScreen, setCurrentScreen] = useState<GameScreen>(
    state.playerName ? 'dashboard' : 'welcome'
  );
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);

  const handleStartGame = () => {
    setCurrentScreen('dashboard');
  };

  const handleSelectLevel = (levelId: number) => {
    setSelectedLevel(levelId);
    setCurrentScreen('level');
  };

  const handleLevelComplete = () => {
    if (state.isGameCompleted) {
      setCurrentScreen('completion');
    } else {
      setCurrentScreen('dashboard');
    }
    setSelectedLevel(null);
  };

  const handleBackToDashboard = () => {
    setCurrentScreen('dashboard');
    setSelectedLevel(null);
  };

  const handleShowLevelSelector = () => {
    setCurrentScreen('level-selector');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'welcome':
        return <WelcomeScreen onStart={handleStartGame} />;
      
      case 'dashboard':
        return (
          <ProgressDashboard
            onSelectLevel={handleSelectLevel}
            onShowLevelSelector={handleShowLevelSelector}
          />
        );
      
      case 'level-selector':
        return (
          <LevelSelector
            onSelectLevel={handleSelectLevel}
            onBack={handleBackToDashboard}
          />
        );
      
      case 'level':
        if (selectedLevel === null) {
          setCurrentScreen('dashboard');
          return null;
        }
        const level = LEVELS.find(l => l.id === selectedLevel);
        if (!level) {
          setCurrentScreen('dashboard');
          return null;
        }
        return (
          <GameLevel
            level={level}
            onComplete={handleLevelComplete}
            onBack={handleBackToDashboard}
          />
        );
      
      case 'completion':
        return (
          <CompletionScreen
            onPlayAgain={() => setCurrentScreen('dashboard')}
            onBackToDashboard={handleBackToDashboard}
          />
        );
      
      default:
        return <WelcomeScreen onStart={handleStartGame} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScreen}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="min-h-screen"
        >
          {renderScreen()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function App() {
  return (
    <GameProvider>
      <GameApp />
    </GameProvider>
  );
}

export default App;
