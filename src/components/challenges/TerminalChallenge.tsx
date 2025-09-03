import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Challenge } from '../../types/game';

interface TerminalChallengeProps {
  challenge: Challenge;
  onComplete: (points: number) => void;
  onRetry: () => void;
  isCompleted: boolean;
}

interface TerminalLine {
  type: 'command' | 'output' | 'error';
  content: string;
  timestamp: number;
}

const TerminalChallenge: React.FC<TerminalChallengeProps> = ({ 
  challenge, 
  onComplete, 
  onRetry, 
  isCompleted 
}) => {
  const [currentInput, setCurrentInput] = useState('');
  const [terminalHistory, setTerminalHistory] = useState<TerminalLine[]>([]);
  const [currentCommandIndex, setCurrentCommandIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  const terminalData = challenge.data as {
    instruction: string;
    expectedCommands: string[];
    hints: string[];
    simulatedOutput: { [command: string]: string };
  };

  useEffect(() => {
    // Focus input when component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    // Scroll to bottom when terminal history updates
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalHistory]);

  const addToHistory = (type: TerminalLine['type'], content: string) => {
    setTerminalHistory(prev => [...prev, {
      type,
      content,
      timestamp: Date.now()
    }]);
  };

  const handleCommand = (command: string) => {
    const trimmedCommand = command.trim();
    
    // Add command to history
    addToHistory('command', `$ ${trimmedCommand}`);

    // Check if command matches expected command
    const expectedCommand = terminalData.expectedCommands[currentCommandIndex];
    const isCommandCorrect = trimmedCommand.toLowerCase() === expectedCommand.toLowerCase();

    if (isCommandCorrect) {
      // Show simulated output
      const output = terminalData.simulatedOutput[expectedCommand];
      if (output) {
        setTimeout(() => {
          addToHistory('output', output);
        }, 500);
      }

      // Move to next command
      const nextIndex = currentCommandIndex + 1;
      setCurrentCommandIndex(nextIndex);

      // Check if all commands completed
      if (nextIndex >= terminalData.expectedCommands.length) {
        setTimeout(() => {
          setIsCorrect(true);
          setShowResult(true);
          setTimeout(() => {
            onComplete(challenge.points);
          }, 2000);
        }, 1000);
      }
    } else {
      // Show error message
      setTimeout(() => {
        addToHistory('error', `Command not recognized or incorrect. Expected: ${expectedCommand}`);
      }, 300);
    }

    setCurrentInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCommand(currentInput);
    }
  };

  const handleRetry = () => {
    setTerminalHistory([]);
    setCurrentCommandIndex(0);
    setCurrentInput('');
    setShowResult(false);
    setIsCorrect(false);
    setShowHint(false);
    onRetry();
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const getPrompt = () => {
    if (currentCommandIndex < terminalData.expectedCommands.length) {
      return `Step ${currentCommandIndex + 1}/${terminalData.expectedCommands.length}`;
    }
    return 'Complete';
  };

  if (isCompleted) {
    return (
      <div className="game-card">
        <div className="text-center">
          <div className="text-4xl mb-4">✅</div>
          <h3 className="text-xl font-bold text-success mb-2">{challenge.title}</h3>
          <p className="text-gray-300 mb-4">Challenge completed!</p>
          <div className="badge-success">
            +{challenge.points} points earned
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="game-card">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">{challenge.title}</h3>
          <div className="badge-info">
            {challenge.points} points
          </div>
        </div>
        <p className="text-gray-300 mb-6">{challenge.description}</p>
      </div>

      <AnimatePresence mode="wait">
        {!showResult ? (
          <motion.div
            key="terminal"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-white mb-4">
                {terminalData.instruction}
              </h4>
              
              <div className="flex items-center justify-between mb-4">
                <div className="text-azure-light">
                  Progress: {getPrompt()}
                </div>
                <button
                  onClick={() => setShowHint(!showHint)}
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  {showHint ? 'Hide Hint' : 'Show Hint'} 💡
                </button>
              </div>

              {showHint && currentCommandIndex < terminalData.hints.length && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4 p-3 bg-warning/10 border border-warning/30 rounded-lg"
                >
                  <div className="text-warning text-sm">
                    💡 Hint: {terminalData.hints[currentCommandIndex]}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Terminal Window */}
            <div className="terminal mb-6">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-green-400/30">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="text-green-400 text-sm">Azure DevOps Terminal</div>
              </div>

              {/* Terminal History */}
              <div 
                ref={terminalRef}
                className="h-64 overflow-y-auto mb-4 space-y-1"
              >
                {terminalHistory.map((line, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`text-sm ${
                      line.type === 'command' 
                        ? 'text-azure-light font-semibold' 
                        : line.type === 'error'
                        ? 'text-error'
                        : 'text-green-400'
                    }`}
                  >
                    <pre className="whitespace-pre-wrap font-mono">{line.content}</pre>
                  </motion.div>
                ))}
              </div>

              {/* Command Input */}
              <div className="flex items-center">
                <span className="text-azure-light mr-2">$</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter command..."
                  className="flex-1 bg-transparent text-green-400 outline-none font-mono"
                  disabled={showResult}
                />
              </div>
            </div>

            {/* Expected Commands Progress */}
            <div className="mb-6">
              <h5 className="text-white font-semibold mb-3">Command Sequence:</h5>
              <div className="space-y-2">
                {terminalData.expectedCommands.map((cmd, index) => (
                  <div
                    key={index}
                    className={`flex items-center p-2 rounded-lg ${
                      index < currentCommandIndex
                        ? 'bg-success/20 text-success'
                        : index === currentCommandIndex
                        ? 'bg-azure-blue/20 text-azure-light border border-azure-blue/50'
                        : 'bg-gray-600/20 text-gray-400'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-3 ${
                      index < currentCommandIndex
                        ? 'bg-success text-white'
                        : index === currentCommandIndex
                        ? 'bg-azure-blue text-white'
                        : 'bg-gray-600 text-gray-300'
                    }`}>
                      {index < currentCommandIndex ? '✓' : index + 1}
                    </div>
                    <code className="font-mono text-sm">{cmd}</code>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
                className="text-6xl mb-4 text-success"
              >
                🎉
              </motion.div>
              
              <h4 className="text-2xl font-bold mb-2 text-success">
                Terminal Master!
              </h4>
              
              <div className="badge-success mb-4">
                +{challenge.points} points earned!
              </div>
              
              <p className="text-gray-300">
                You've successfully executed all commands in the correct sequence!
              </p>
            </div>

            <div className="game-card bg-white/5">
              <h5 className="text-white font-semibold mb-3">Commands Executed:</h5>
              <div className="space-y-2">
                {terminalData.expectedCommands.map((cmd, index) => (
                  <div key={index} className="flex items-center text-success text-sm">
                    <span className="mr-2">✓</span>
                    <code className="font-mono">{cmd}</code>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!showResult && !isCompleted && (
        <div className="flex justify-center mt-6">
          <button
            onClick={handleRetry}
            className="game-button-secondary"
          >
            Reset Terminal
          </button>
        </div>
      )}
    </div>
  );
};

export default TerminalChallenge;
