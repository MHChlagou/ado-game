import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Challenge } from '../../types/game';

interface QuizChallengeProps {
  challenge: Challenge;
  onComplete: (points: number) => void;
  onRetry: () => void;
  isCompleted: boolean;
}

const QuizChallenge: React.FC<QuizChallengeProps> = ({ 
  challenge, 
  onComplete, 
  onRetry, 
  isCompleted 
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const quizData = challenge.data as {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) return;

    const correct = selectedAnswer === quizData.correctAnswer;
    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      setTimeout(() => {
        onComplete(challenge.points);
      }, 2000);
    }
  };

  const handleRetry = () => {
    setSelectedAnswer(null);
    setShowResult(false);
    setIsCorrect(false);
    onRetry();
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
            key="question"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-white mb-4">
                {quizData.question}
              </h4>
              
              <div className="space-y-3">
                {quizData.options.map((option, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedAnswer(index)}
                    className={`quiz-option ${selectedAnswer === index ? 'selected' : ''}`}
                  >
                    <div className="quiz-option-radio">
                      {selectedAnswer === index && (
                        <div className="quiz-option-radio-dot" />
                      )}
                    </div>
                    <span>{option}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleSubmit}
                disabled={selectedAnswer === null}
                className={`game-button ${
                  selectedAnswer === null 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'glow-effect'
                }`}
              >
                Submit Answer
              </button>
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
                className={`text-6xl mb-4 ${isCorrect ? 'text-success' : 'text-error'}`}
              >
                {isCorrect ? '🎉' : '❌'}
              </motion.div>
              
              <h4 className={`text-2xl font-bold mb-2 ${
                isCorrect ? 'text-success' : 'text-error'
              }`}>
                {isCorrect ? 'Correct!' : 'Incorrect'}
              </h4>
              
              {isCorrect && (
                <div className="badge-success mb-4">
                  +{challenge.points} points earned!
                </div>
              )}
            </div>

            <div className="game-card bg-white/5 mb-6">
              <h5 className="text-white font-semibold mb-2">Explanation:</h5>
              <p className="text-gray-300">{quizData.explanation}</p>
            </div>

            <div className="space-y-3">
              <div className="text-sm text-gray-400">
                <strong>Your answer:</strong> {quizData.options[selectedAnswer!]}
              </div>
              <div className="text-sm text-gray-400">
                <strong>Correct answer:</strong> {quizData.options[quizData.correctAnswer]}
              </div>
            </div>

            {!isCorrect && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={handleRetry}
                  className="game-button-secondary"
                >
                  Try Again
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuizChallenge;
