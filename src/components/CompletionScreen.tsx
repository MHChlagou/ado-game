import React from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';

interface CompletionScreenProps {
  onPlayAgain: () => void;
  onBackToDashboard: () => void;
}

const CompletionScreen: React.FC<CompletionScreenProps> = ({ 
  onPlayAgain, 
  onBackToDashboard 
}) => {
  const { state, resetGame } = useGame();

  const totalScore = state.score;
  const earnedBadges = state.badges.filter(b => b.earned);
  const completedLevels = state.progress.filter(p => p.isCompleted).length;
  const totalTime = state.progress.reduce((acc, p) => acc + p.timeSpent, 0);

  const handlePlayAgain = () => {
    resetGame();
    onPlayAgain();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="game-card max-w-4xl w-full text-center"
      >
        {/* Celebration Animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
          className="mb-8"
        >
          <div className="text-8xl mb-4">🎉</div>
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-5xl font-bold text-white mb-4 text-shadow"
          >
            Congratulations!
          </motion.h1>
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="text-3xl text-azure-light mb-6"
          >
            You are now an Azure DevOps Server Master! 🏆
          </motion.h2>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="text-gray-300 text-xl max-w-2xl mx-auto"
          >
            You've successfully completed all levels and mastered the installation, 
            configuration, and permission management of Azure DevOps Server. 
            Well done, {state.playerName}!
          </motion.p>
        </motion.div>

        {/* Achievement Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="game-card bg-gradient-to-br from-success/20 to-success/10 border-success/30">
            <div className="text-4xl mb-2">📊</div>
            <div className="text-3xl font-bold text-white">{totalScore}</div>
            <div className="text-success">Total Score</div>
          </div>
          <div className="game-card bg-gradient-to-br from-azure-blue/20 to-azure-blue/10 border-azure-blue/30">
            <div className="text-4xl mb-2">✅</div>
            <div className="text-3xl font-bold text-white">{completedLevels}/5</div>
            <div className="text-azure-light">Levels Completed</div>
          </div>
          <div className="game-card bg-gradient-to-br from-warning/20 to-warning/10 border-warning/30">
            <div className="text-4xl mb-2">🏆</div>
            <div className="text-3xl font-bold text-white">{earnedBadges.length}/5</div>
            <div className="text-warning">Badges Earned</div>
          </div>
          <div className="game-card bg-gradient-to-br from-purple-500/20 to-purple-500/10 border-purple-500/30">
            <div className="text-4xl mb-2">⏱️</div>
            <div className="text-3xl font-bold text-white">{Math.round(totalTime / 60)}</div>
            <div className="text-purple-400">Minutes Played</div>
          </div>
        </motion.div>

        {/* All Badges Display */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="mb-8"
        >
          <h3 className="text-2xl font-bold text-white mb-6">Your Master Badges Collection</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {earnedBadges.map((badge, index) => (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, scale: 0, rotate: -180 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ 
                  delay: 1.4 + index * 0.2, 
                  duration: 0.6,
                  type: "spring",
                  stiffness: 200
                }}
                className="game-card bg-gradient-to-br from-success/20 to-azure-blue/20 border-success/50 text-center"
              >
                <div className="text-5xl mb-3">{badge.icon}</div>
                <div className="text-white font-bold text-lg mb-2">{badge.name}</div>
                <div className="text-gray-300 text-sm">{badge.description}</div>
                <div className="mt-3 text-xs text-success">
                  ✓ Earned {badge.earnedAt ? new Date(badge.earnedAt).toLocaleDateString() : 'Today'}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Skills Mastered */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.5 }}
          className="mb-8"
        >
          <h3 className="text-2xl font-bold text-white mb-6">Skills You've Mastered</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div className="game-card">
              <h4 className="text-azure-light font-semibold mb-3 flex items-center">
                <span className="text-2xl mr-2">🗄️</span>
                Database Management
              </h4>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• MySQL server installation and configuration</li>
                <li>• Database creation for Azure DevOps Server</li>
                <li>• Connection string management</li>
                <li>• Database security best practices</li>
              </ul>
            </div>
            <div className="game-card">
              <h4 className="text-azure-light font-semibold mb-3 flex items-center">
                <span className="text-2xl mr-2">🏗️</span>
                Server Installation
              </h4>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Azure DevOps Server prerequisites</li>
                <li>• IIS and .NET Framework configuration</li>
                <li>• TFSConfig command-line operations</li>
                <li>• Service account management</li>
              </ul>
            </div>
            <div className="game-card">
              <h4 className="text-azure-light font-semibold mb-3 flex items-center">
                <span className="text-2xl mr-2">🛡️</span>
                Security & Permissions
              </h4>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Permission hierarchy understanding</li>
                <li>• Global security configuration</li>
                <li>• Role-based access control</li>
                <li>• Security best practices</li>
              </ul>
            </div>
            <div className="game-card">
              <h4 className="text-azure-light font-semibold mb-3 flex items-center">
                <span className="text-2xl mr-2">⚙️</span>
                Service Configuration
              </h4>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Azure Boards permissions</li>
                <li>• Azure Repos Git security</li>
                <li>• Azure Pipelines access control</li>
                <li>• Test Plans and Artifacts management</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.5, duration: 0.5 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <button
            onClick={onBackToDashboard}
            className="game-button-secondary text-lg px-8 py-4"
          >
            📊 View Dashboard
          </button>
          <button
            onClick={handlePlayAgain}
            className="game-button text-lg px-8 py-4 glow-effect"
          >
            🔄 Play Again
          </button>
        </motion.div>

        {/* Footer Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3, duration: 0.5 }}
          className="mt-8 text-center"
        >
          <div className="game-card bg-gradient-to-r from-azure-blue/10 to-azure-light/10 border-azure-blue/30">
            <p className="text-gray-300 text-lg">
              🎓 You're now ready to implement Azure DevOps Server in real-world scenarios!
            </p>
            <p className="text-azure-light text-sm mt-2">
              Share your achievement and continue your DevOps journey
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default CompletionScreen;
