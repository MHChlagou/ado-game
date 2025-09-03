import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Challenge } from '../../types/game';

interface DragDropChallengeProps {
  challenge: Challenge;
  onComplete: (points: number) => void;
  onRetry: () => void;
  isCompleted: boolean;
}

interface DragItem {
  id: string;
  content: string;
  type: string;
}

interface DropZone {
  id: string;
  label: string;
  acceptedTypes: string[];
}

const DragDropChallenge: React.FC<DragDropChallengeProps> = ({ 
  challenge, 
  onComplete, 
  onRetry, 
  isCompleted 
}) => {
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [droppedItems, setDroppedItems] = useState<{ [zoneId: string]: string }>({});
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const dragRef = useRef<HTMLDivElement>(null);

  const dragDropData = challenge.data as {
    instruction: string;
    items: DragItem[];
    dropZones: DropZone[];
    correctMappings: { [itemId: string]: string };
  };

  const handleDragStart = (itemId: string) => {
    setDraggedItem(itemId);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, zoneId: string) => {
    e.preventDefault();
    if (draggedItem) {
      // Remove item from previous zone if it exists
      const newDroppedItems = { ...droppedItems };
      Object.keys(newDroppedItems).forEach(key => {
        if (newDroppedItems[key] === draggedItem) {
          delete newDroppedItems[key];
        }
      });
      
      // Add item to new zone
      newDroppedItems[zoneId] = draggedItem;
      setDroppedItems(newDroppedItems);
    }
    setDraggedItem(null);
  };

  const handleSubmit = () => {
    const correct = Object.keys(dragDropData.correctMappings).every(itemId => {
      const correctZone = dragDropData.correctMappings[itemId];
      const actualZone = Object.keys(droppedItems).find(zoneId => droppedItems[zoneId] === itemId);
      return actualZone === correctZone;
    });

    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      setTimeout(() => {
        onComplete(challenge.points);
      }, 2000);
    }
  };

  const handleRetry = () => {
    setDroppedItems({});
    setShowResult(false);
    setIsCorrect(false);
    onRetry();
  };

  const getAvailableItems = () => {
    const droppedItemIds = Object.values(droppedItems);
    return dragDropData.items.filter(item => !droppedItemIds.includes(item.id));
  };

  const getItemInZone = (zoneId: string) => {
    const itemId = droppedItems[zoneId];
    return itemId ? dragDropData.items.find(item => item.id === itemId) : null;
  };

  const canSubmit = () => {
    return Object.keys(droppedItems).length === dragDropData.items.length;
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
            key="dragdrop"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-white mb-4">
                {dragDropData.instruction}
              </h4>
            </div>

            {/* Available Items */}
            <div className="mb-8">
              <h5 className="text-white font-semibold mb-3">Available Items:</h5>
              <div className={`available-items-container ${getAvailableItems().length === 0 ? 'empty' : ''}`}>
                {getAvailableItems().length === 0 ? (
                  <span>All items have been placed</span>
                ) : (
                  getAvailableItems().map((item) => (
                    <motion.div
                      key={item.id}
                      draggable
                      onDragStart={() => handleDragStart(item.id)}
                      onDragEnd={handleDragEnd}
                      whileHover={{ scale: 1.05 }}
                      whileDrag={{ scale: 1.1, rotate: 5 }}
                      className={`drag-item ${draggedItem === item.id ? 'dragging' : ''}`}
                    >
                      {item.content}
                    </motion.div>
                  ))
                )}
              </div>
            </div>

            {/* Drop Zones */}
            <div className="mb-6">
              <h5 className="text-white font-semibold mb-3">Drop Zones:</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dragDropData.dropZones.map((zone) => {
                  const itemInZone = getItemInZone(zone.id);
                  return (
                    <div
                      key={zone.id}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, zone.id)}
                      className={`drop-zone ${
                        draggedItem ? 'drag-over' : ''
                      } ${itemInZone ? 'has-item' : ''}`}
                    >
                      <div className="text-white font-semibold mb-2">{zone.label}</div>
                      <div className="text-gray-400 text-sm mb-3">
                        Accepts: {zone.acceptedTypes.join(', ')}
                      </div>
                      
                      {itemInZone ? (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="drag-item"
                          style={{ background: '#107c10', margin: 0 }}
                        >
                          {itemInZone.content}
                        </motion.div>
                      ) : (
                        <div className="text-gray-400 text-sm italic">
                          Drop an item here
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleSubmit}
                disabled={!canSubmit()}
                className={`game-button ${
                  !canSubmit() 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'glow-effect'
                }`}
              >
                Check Solution
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
                {isCorrect ? 'Perfect Match!' : 'Not Quite Right'}
              </h4>
              
              {isCorrect && (
                <div className="badge-success mb-4">
                  +{challenge.points} points earned!
                </div>
              )}
            </div>

            {/* Show correct solution */}
            <div className="game-card bg-white/5 mb-6">
              <h5 className="text-white font-semibold mb-4">Correct Solution:</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dragDropData.dropZones.map((zone) => {
                  const correctItemId = Object.keys(dragDropData.correctMappings).find(
                    itemId => dragDropData.correctMappings[itemId] === zone.id
                  );
                  const correctItem = correctItemId 
                    ? dragDropData.items.find(item => item.id === correctItemId)
                    : null;
                  const userItemId = droppedItems[zone.id];
                  const isUserCorrect = userItemId === correctItemId;

                  return (
                    <div key={zone.id} className="p-3 bg-white/5 rounded-lg">
                      <div className="text-white font-semibold mb-2">{zone.label}</div>
                      {correctItem && (
                        <div className={`px-3 py-2 rounded-lg text-sm ${
                          isUserCorrect ? 'bg-success text-white' : 'bg-azure-blue text-white'
                        }`}>
                          {correctItem.content}
                          {isUserCorrect && <span className="ml-2">✓</span>}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {!isCorrect && (
              <div className="flex justify-center">
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

export default DragDropChallenge;
