import React from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { LEVELS } from '../data/levels';

interface LevelSelectorProps {
  onSelectLevel: (levelId: number) => void;
  onBack: () => void;
}

const LevelSelector: React.FC<LevelSelectorProps> = ({ onSelectLevel, onBack }) => {
  const { state } = useGame();

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

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-success border-success/30 bg-success/10';
      case 'medium': return 'text-warning border-warning/30 bg-warning/10';
      case 'hard': return 'text-error border-error/30 bg-error/10';
      default: return 'text-gray-400 border-gray-400/30 bg-gray-400/10';
    }
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <button
            onClick={onBack}
            className="absolute left-4 top-4 game-button-secondary"
          >
            ← Back to Dashboard
          </button>
          
          <h1 className="text-4xl font-bold text-white mb-2 text-shadow">
            Select Level
          </h1>
          <p className="text-azure-light text-xl">
            Choose your Azure DevOps Server learning path
          </p>
        </motion.div>

        {/* Level Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {LEVELS.map((level, index) => {
            const progress = getLevelProgress(level.id);
            const isUnlocked = isLevelUnlocked(level.id);
            const isCompleted = progress?.isCompleted || false;
            const isCurrent = state.currentLevel === level.id;

            return (
              <motion.div
                key={level.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className={`level-card relative ${
                  !isUnlocked ? 'opacity-50 cursor-not-allowed' : ''
                } ${
                  isCurrent ? 'ring-2 ring-azure-blue glow-effect' : ''
                }`}
                onClick={() => isUnlocked && onSelectLevel(level.id)}
              >
                {/* Lock Overlay */}
                {!isUnlocked && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl">
                    <div className="text-center">
                      <div className="text-4xl mb-2">🔒</div>
                      <div className="text-white font-semibold">Locked</div>
                      <div className="text-gray-400 text-sm">
                        Complete previous levels
                      </div>
                    </div>
                  </div>
                )}

                {/* Completion Badge */}
                {isCompleted && (
                  <div className="absolute -top-2 -right-2 bg-success text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                    ✓
                  </div>
                )}

                {/* Current Level Badge */}
                {isCurrent && !isCompleted && (
                  <div className="absolute -top-2 -right-2 bg-azure-blue text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold animate-pulse">
                    →
                  </div>
                )}

                {/* Level Content */}
                <div className="text-center mb-4">
                  <div className="text-4xl mb-3">{level.icon}</div>
                  <h3 className="text-white text-xl font-bold mb-2">
                    Level {level.id}: {level.title}
                  </h3>
                  <p className="text-gray-300 text-sm mb-4">
                    {level.description}
                  </p>
                </div>

                {/* Level Stats */}
                <div className="space-y-3">
                  {/* Difficulty */}
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Difficulty:</span>
                    <span className={`badge ${getDifficultyColor(level.difficulty)}`}>
                      {level.difficulty.charAt(0).toUpperCase() + level.difficulty.slice(1)}
                    </span>
                  </div>

                  {/* Estimated Time */}
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Time:</span>
                    <span className="text-azure-light text-sm">
                      ~{level.estimatedTime} min
                    </span>
                  </div>

                  {/* Challenges Count */}
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Challenges:</span>
                    <span className="text-azure-light text-sm">
                      {level.challenges.length} tasks
                    </span>
                  </div>

                  {/* Progress Score */}
                  {progress && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Best Score:</span>
                      <span className="text-success text-sm font-semibold">
                        {progress.score} pts
                      </span>
                    </div>
                  )}

                  {/* Badge Preview */}
                  {level.badge && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Badge:</span>
                      <div className="flex items-center">
                        <span className="mr-1">{level.badge.icon}</span>
                        <span className={`text-sm ${
                          state.badges.find(b => b.id === level.badge?.id)?.earned 
                            ? 'text-success' 
                            : 'text-gray-400'
                        }`}>
                          {level.badge.name}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Prerequisites */}
                {level.prerequisites.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="text-gray-400 text-xs mb-2">Prerequisites:</div>
                    <div className="flex flex-wrap gap-1">
                      {level.prerequisites.map(prereqId => {
                        const prereqLevel = LEVELS.find(l => l.id === prereqId);
                        const prereqCompleted = getLevelProgress(prereqId)?.isCompleted;
                        return (
                          <span
                            key={prereqId}
                            className={`text-xs px-2 py-1 rounded ${
                              prereqCompleted 
                                ? 'bg-success/20 text-success' 
                                : 'bg-gray-600/20 text-gray-400'
                            }`}
                          >
                            Level {prereqId}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Action Button */}
                {isUnlocked && (
                  <div className="mt-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectLevel(level.id);
                      }}
                      className={`w-full py-2 px-4 rounded-lg font-semibold transition-all duration-300 ${
                        isCompleted
                          ? 'bg-success/20 text-success border border-success/30 hover:bg-success/30'
                          : isCurrent
                          ? 'game-button'
                          : 'bg-azure-blue/20 text-azure-blue border border-azure-blue/30 hover:bg-azure-blue/30'
                      }`}
                    >
                      {isCompleted ? 'Replay Level' : isCurrent ? 'Continue' : 'Start Level'}
                    </button>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Progress Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-8"
        >
          <div className="game-card text-center">
            <h3 className="text-white text-lg font-semibold mb-4">Learning Path Progress</h3>
            <div className="flex justify-center items-center space-x-4">
              {LEVELS.map((level, index) => {
                const isCompleted = getLevelProgress(level.id)?.isCompleted;
                const isUnlocked = isLevelUnlocked(level.id);
                const isCurrent = state.currentLevel === level.id;

                return (
                  <React.Fragment key={level.id}>
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                        isCompleted
                          ? 'bg-success text-white'
                          : isCurrent
                          ? 'bg-azure-blue text-white animate-pulse'
                          : isUnlocked
                          ? 'bg-azure-blue/30 text-azure-light'
                          : 'bg-gray-600 text-gray-400'
                      }`}
                    >
                      {isCompleted ? '✓' : level.id}
                    </div>
                    {index < LEVELS.length - 1 && (
                      <div
                        className={`w-8 h-0.5 ${
                          isCompleted ? 'bg-success' : 'bg-gray-600'
                        }`}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
            <div className="mt-4 text-gray-400 text-sm">
              {state.progress.filter(p => p.isCompleted).length} of {LEVELS.length} levels completed
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LevelSelector;
