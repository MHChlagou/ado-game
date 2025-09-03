import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';

interface WelcomeScreenProps {
  onStart: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  const { startGame } = useGame();
  const [playerName, setPlayerName] = useState('');
  const [isStarting, setIsStarting] = useState(false);

  const handleStart = async () => {
    if (playerName.trim()) {
      setIsStarting(true);
      startGame(playerName.trim());
      
      setTimeout(() => {
        onStart();
      }, 800);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleStart();
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Enhanced Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-blue-500/10 to-cyan-500/10"></div>
        {/* Animated background elements */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl"
        />
      </div>
      
      <div className="relative z-10 min-h-screen grid lg:grid-cols-2 gap-0">
        {/* Left Column - Content */}
        <div className="flex items-center justify-center p-8 lg:p-16">
          <div className="max-w-xl w-full">
            {/* Logo with enhanced styling */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                duration: 1,
                type: "spring",
                stiffness: 200,
                damping: 20
              }}
              className="mb-12"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl shadow-2xl shadow-blue-500/25">
                <span className="text-3xl">🏗️</span>
              </div>
            </motion.div>

            {/* Enhanced Title */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="mb-8"
            >
              <h1 className="text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                Azure DevOps
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                  Server
                </span>
              </h1>
              <h2 className="text-xl lg:text-2xl text-blue-300 font-medium">
                Interactive Learning Experience
              </h2>
            </motion.div>

            {/* Enhanced Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-gray-300 mb-10 text-lg leading-relaxed"
            >
              Master installation, configuration, and permissions through hands-on challenges and real-world scenarios.
            </motion.p>

            {/* Enhanced Features Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="grid grid-cols-2 gap-4 mb-10"
            >
              <div className="flex items-center p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center mr-3">
                  <span className="text-blue-400">📚</span>
                </div>
                <div>
                  <div className="text-white font-semibold">5 Levels</div>
                  <div className="text-gray-400 text-sm">Progressive</div>
                </div>
              </div>
              <div className="flex items-center p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center mr-3">
                  <span className="text-cyan-400">🎯</span>
                </div>
                <div>
                  <div className="text-white font-semibold">Hands-on</div>
                  <div className="text-gray-400 text-sm">Challenges</div>
                </div>
              </div>
              <div className="flex items-center p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center mr-3">
                  <span className="text-purple-400">🌟</span>
                </div>
                <div>
                  <div className="text-white font-semibold">Real-world</div>
                  <div className="text-gray-400 text-sm">Scenarios</div>
                </div>
              </div>
              <div className="flex items-center p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center mr-3">
                  <span className="text-green-400">🏆</span>
                </div>
                <div>
                  <div className="text-white font-semibold">Achievements</div>
                  <div className="text-gray-400 text-sm">System</div>
                </div>
              </div>
            </motion.div>

            {/* Enhanced Game Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              className="flex items-center gap-6 text-sm text-gray-400"
            >
              <div className="flex items-center">
                <span className="mr-2">⏱️</span>
                <span>~2 hours</span>
              </div>
              <div className="flex items-center">
                <span className="mr-2">🎯</span>
                <span>Beginner friendly</span>
              </div>
              <div className="flex items-center">
                <span className="mr-2">🏅</span>
                <span>Earn badges</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Right Column - Enhanced Game Start */}
        <div className="flex items-center justify-center p-8 lg:p-16 relative">
          {/* Glass morphism background */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border-l border-white/20"></div>
          
          <div className="relative max-w-md w-full">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-center"
            >
              {/* Enhanced header */}
              <div className="mb-8">
                <motion.div
                  animate={{ 
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="inline-block mb-4"
                >
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-2xl shadow-blue-500/25">
                    <span className="text-2xl">🚀</span>
                  </div>
                </motion.div>
                <h3 className="text-3xl font-bold text-white mb-3">Ready to Begin?</h3>
                <p className="text-gray-300 text-lg">
                  Start your Azure DevOps Server mastery journey
                </p>
              </div>
              
              {/* Enhanced Input Field */}
              <div className="mb-8">
                <div className="relative">
                  <input
                    id="playerName"
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter your name"
                    className="w-full px-6 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-center text-lg font-medium transition-all duration-300 backdrop-blur-sm"
                    disabled={isStarting}
                  />
                  <motion.div
                    className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20 -z-10"
                    animate={{
                      opacity: playerName.trim() ? 1 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>

              {/* Enhanced Start Button */}
              <motion.button
                onClick={handleStart}
                disabled={!playerName.trim() || isStarting}
                whileHover={{ scale: !playerName.trim() || isStarting ? 1 : 1.05 }}
                whileTap={{ scale: !playerName.trim() || isStarting ? 1 : 0.95 }}
                className={`w-full px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${
                  !playerName.trim() || isStarting
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-2xl shadow-blue-500/25 hover:shadow-blue-500/40'
                }`}
              >
                {isStarting ? (
                  <span className="flex items-center justify-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-6 h-6 border-2 border-white border-t-transparent rounded-full mr-3"
                    />
                    Launching Adventure...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    Start Your Journey
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="ml-2"
                    >
                      🚀
                    </motion.span>
                  </span>
                )}
              </motion.button>

              {/* Additional info */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1, duration: 0.8 }}
                className="mt-8 text-sm text-gray-400"
              >
                <p>Your progress will be automatically saved</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
