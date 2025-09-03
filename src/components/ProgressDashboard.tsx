import React from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { LEVELS } from '../data/levels';

interface ProgressDashboardProps {
  onSelectLevel: (levelId: number) => void;
  onShowLevelSelector: () => void;
}

const ProgressDashboard: React.FC<ProgressDashboardProps> = ({ 
  onSelectLevel, 
  onShowLevelSelector 
}) => {
  const { state, resetGame } = useGame();

  const getNextAvailableLevel = () => {
    if (state.currentLevel === 0) return 1;
    return Math.min(state.currentLevel, 5);
  };

  const getLevelProgress = (levelId: number) => {
    return state.progress.find(p => p.levelId === levelId);
  };

  const isLevelUnlocked = (levelId: number) => {
    if (levelId === 1) return true;
    const level = LEVELS.find(l => l.id === levelId);
    if (!level) return false;
    
    return level.prerequisites.every(prereqId => {
      const prereqProgress = getLevelProgress(prereqId);
      return prereqProgress?.isCompleted;
    });
  };

  const nextLevel = getNextAvailableLevel();
  const completedLevels = state.progress.filter(p => p.isCompleted).length;
  const totalScore = state.score;
  const earnedBadges = state.badges.filter(b => b.earned).length;

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2 text-shadow">
            Welcome back, {state.playerName}! 👋
          </h1>
          <p className="text-azure-light text-xl">
            Continue your Azure DevOps Server mastery journey
          </p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
        >
          <div className="game-card text-center">
            <div className="text-3xl mb-2">📊</div>
            <div className="text-2xl font-bold text-white">{totalScore}</div>
            <div className="text-gray-400">Total Score</div>
          </div>
          <div className="game-card text-center">
            <div className="text-3xl mb-2">✅</div>
            <div className="text-2xl font-bold text-white">{completedLevels}/5</div>
            <div className="text-gray-400">Levels Complete</div>
          </div>
          <div className="game-card text-center">
            <div className="text-3xl mb-2">🏆</div>
            <div className="text-2xl font-bold text-white">{earnedBadges}/5</div>
            <div className="text-gray-400">Badges Earned</div>
          </div>
          <div className="game-card text-center">
            <div className="text-3xl mb-2">🎯</div>
            <div className="text-2xl font-bold text-white">{Math.round((completedLevels / 5) * 100)}%</div>
            <div className="text-gray-400">Progress</div>
          </div>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mb-8"
        >
          <div className="game-card">
            <h3 className="text-white text-lg font-semibold mb-4">Overall Progress</h3>
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${(completedLevels / 5) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-sm text-gray-400 mt-2">
              <span>Start</span>
              <span>{completedLevels}/5 Levels</span>
              <span>DevOps Master</span>
            </div>
          </div>
        </motion.div>

        {/* Next Level CTA */}
        {!state.isGameCompleted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mb-8"
          >
            <div className="game-card bg-gradient-to-r from-azure-blue/20 to-azure-light/20 border-azure-blue/50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white text-xl font-bold mb-2">
                    Continue Your Journey
                  </h3>
                  <p className="text-gray-300 mb-4">
                    {nextLevel <= 5 ? `Ready for Level ${nextLevel}: ${LEVELS[nextLevel - 1]?.title}` : 'All levels completed!'}
                  </p>
                  {nextLevel <= 5 && (
                    <div className="flex items-center text-azure-light text-sm">
                      <span className="mr-2">🕒</span>
                      <span>Estimated time: {LEVELS[nextLevel - 1]?.estimatedTime} minutes</span>
                    </div>
                  )}
                </div>
                <div>
                  {nextLevel <= 5 && (
                    <button
                      onClick={() => onSelectLevel(nextLevel)}
                      className="game-button glow-effect"
                    >
                      Continue Level {nextLevel} →
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Earned Badges */}
        {earnedBadges > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="mb-8"
          >
            <div className="game-card">
              <h3 className="text-white text-xl font-bold mb-4">Your Achievements 🏆</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {state.badges.filter(b => b.earned).map((badge, index) => (
                  <motion.div
                    key={badge.id}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1 + index * 0.1, duration: 0.3 }}
                    className="text-center p-4 bg-white/5 rounded-lg border border-success/30"
                  >
                    <div className="text-3xl mb-2">{badge.icon}</div>
                    <div className="text-white font-semibold text-sm">{badge.name}</div>
                    <div className="text-gray-400 text-xs mt-1">{badge.description}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <button
            onClick={onShowLevelSelector}
            className="game-button-secondary"
          >
            📋 View All Levels
          </button>
          
          {state.isGameCompleted && (
            <button
              onClick={resetGame}
              className="game-button"
            >
              🔄 Play Again
            </button>
          )}
          
          <button
            onClick={resetGame}
            className="px-6 py-3 text-gray-400 hover:text-white transition-colors duration-300"
          >
            Reset Progress
          </button>
        </motion.div>

        {/* Completion Message */}
        {state.isGameCompleted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            className="mt-8 text-center"
          >
            <div className="game-card bg-gradient-to-r from-success/20 to-azure-light/20 border-success/50">
              <div className="text-4xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Congratulations, DevOps Master!
              </h2>
              <p className="text-gray-300">
                You've successfully completed all levels and mastered Azure DevOps Server!
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ProgressDashboard;
