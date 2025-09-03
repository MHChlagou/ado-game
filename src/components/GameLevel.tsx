import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../context/GameContext';
import type { Level, Challenge } from '../types/game';
import QuizChallenge from './challenges/QuizChallenge';
import DragDropChallenge from './challenges/DragDropChallenge';
import TerminalChallenge from './challenges/TerminalChallenge';
import RoleAssignmentChallenge from './challenges/RoleAssignmentChallenge';

interface GameLevelProps {
  level: Level;
  onComplete: () => void;
  onBack: () => void;
}

const GameLevel: React.FC<GameLevelProps> = ({ level, onComplete, onBack }) => {
  const { completeChallenge, completeLevel, earnBadge } = useGame();
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [completedChallenges, setCompletedChallenges] = useState<string[]>([]);
  const [levelScore, setLevelScore] = useState(0);
  const [attempts, setAttempts] = useState(1);
  const [startTime] = useState(Date.now());
  const [showLevelComplete, setShowLevelComplete] = useState(false);

  const currentChallenge = level.challenges[currentChallengeIndex];
  const isLastChallenge = currentChallengeIndex === level.challenges.length - 1;
  const progress = ((currentChallengeIndex + (completedChallenges.includes(currentChallenge?.id) ? 1 : 0)) / level.challenges.length) * 100;

  useEffect(() => {
    // Reset state when level changes
    setCurrentChallengeIndex(0);
    setCompletedChallenges([]);
    setLevelScore(0);
    setAttempts(1);
    setShowLevelComplete(false);
  }, [level.id]);

  const handleChallengeComplete = (challengeId: string, points: number) => {
    if (!completedChallenges.includes(challengeId)) {
      setCompletedChallenges(prev => [...prev, challengeId]);
      setLevelScore(prev => prev + points);
      completeChallenge(points);

      if (isLastChallenge) {
        // Level completed
        setTimeout(() => {
          setShowLevelComplete(true);
        }, 1000);
      } else {
        // Move to next challenge
        setTimeout(() => {
          setCurrentChallengeIndex(prev => prev + 1);
        }, 1500);
      }
    }
  };

  const handleLevelComplete = () => {
    const timeSpent = Math.round((Date.now() - startTime) / 1000); // in seconds
    completeLevel(level.id, levelScore, attempts, timeSpent);
    
    // Award badge if available
    if (level.badge) {
      earnBadge(level.badge);
    }
    
    onComplete();
  };

  const handleRetry = () => {
    setAttempts(prev => prev + 1);
    // Don't reset completed challenges, just allow retry of current challenge
  };

  const renderChallenge = (challenge: Challenge) => {
    const isCompleted = completedChallenges.includes(challenge.id);
    
    switch (challenge.type) {
      case 'quiz':
        return (
          <QuizChallenge
            challenge={challenge}
            onComplete={(points) => handleChallengeComplete(challenge.id, points)}
            onRetry={handleRetry}
            isCompleted={isCompleted}
          />
        );
      case 'drag-drop':
        return (
          <DragDropChallenge
            challenge={challenge}
            onComplete={(points) => handleChallengeComplete(challenge.id, points)}
            onRetry={handleRetry}
            isCompleted={isCompleted}
          />
        );
      case 'terminal':
        return (
          <TerminalChallenge
            challenge={challenge}
            onComplete={(points) => handleChallengeComplete(challenge.id, points)}
            onRetry={handleRetry}
            isCompleted={isCompleted}
          />
        );
      case 'role-assignment':
        return (
          <RoleAssignmentChallenge
            challenge={challenge}
            onComplete={(points) => handleChallengeComplete(challenge.id, points)}
            onRetry={handleRetry}
            isCompleted={isCompleted}
          />
        );
      default:
        return <div className="text-white">Unknown challenge type</div>;
    }
  };

  if (showLevelComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="game-card max-w-2xl w-full text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
          >
            <div className="text-6xl mb-4">{level.badge?.icon || '🎉'}</div>
            <h1 className="text-3xl font-bold text-white mb-4">
              Level {level.id} Complete!
            </h1>
            <h2 className="text-xl text-azure-light mb-6">
              {level.title}
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mb-6"
          >
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-success">{levelScore}</div>
                <div className="text-gray-400 text-sm">Points Earned</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-azure-light">{completedChallenges.length}</div>
                <div className="text-gray-400 text-sm">Challenges</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-warning">{attempts}</div>
                <div className="text-gray-400 text-sm">Attempts</div>
              </div>
            </div>

            {level.badge && (
              <div className="game-card bg-gradient-to-r from-success/20 to-azure-blue/20 border-success/50 mb-6">
                <div className="flex items-center justify-center">
                  <span className="text-3xl mr-3">{level.badge.icon}</span>
                  <div>
                    <div className="text-white font-bold">Badge Earned!</div>
                    <div className="text-success text-sm">{level.badge.name}</div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <button
              onClick={handleLevelComplete}
              className="game-button text-lg px-8 py-4 glow-effect"
            >
              Continue Your Journey →
            </button>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={onBack}
              className="game-button-secondary"
            >
              ← Back
            </button>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-white">
                Level {level.id}: {level.title}
              </h1>
              <p className="text-azure-light">{level.description}</p>
            </div>
            <div className="text-right">
              <div className="text-white font-semibold">Score: {levelScore}</div>
              <div className="text-gray-400 text-sm">Attempt: {attempts}</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="game-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-semibold">Progress</span>
              <span className="text-azure-light">
                {currentChallengeIndex + (completedChallenges.includes(currentChallenge?.id) ? 1 : 0)} / {level.challenges.length}
              </span>
            </div>
            <div className="progress-bar">
              <motion.div 
                className="progress-fill"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </motion.div>

        {/* Challenge Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-6"
        >
          <div className="flex justify-center space-x-2">
            {level.challenges.map((challenge, index) => {
              const isCompleted = completedChallenges.includes(challenge.id);
              const isCurrent = index === currentChallengeIndex;
              const isAccessible = index <= currentChallengeIndex;

              return (
                <button
                  key={challenge.id}
                  onClick={() => isAccessible && setCurrentChallengeIndex(index)}
                  disabled={!isAccessible}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                    isCompleted
                      ? 'bg-success text-white'
                      : isCurrent
                      ? 'bg-azure-blue text-white animate-pulse'
                      : isAccessible
                      ? 'bg-azure-blue/30 text-azure-light hover:bg-azure-blue/50'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {isCompleted ? '✓' : index + 1}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Current Challenge */}
        <AnimatePresence mode="wait">
          {currentChallenge && (
            <motion.div
              key={currentChallenge.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderChallenge(currentChallenge)}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default GameLevel;
