import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Challenge } from '../../types/game';

interface RoleAssignmentChallengeProps {
  challenge: Challenge;
  onComplete: (points: number) => void;
  onRetry: () => void;
  isCompleted: boolean;
}

interface Character {
  id: string;
  name: string;
  role: string;
  avatar: string;
  description: string;
}

interface Permission {
  id: string;
  name: string;
  description: string;
  category: 'server' | 'collection' | 'project' | 'object';
  service: 'boards' | 'repos' | 'pipelines' | 'test-plans' | 'artifacts' | 'global';
}

const RoleAssignmentChallenge: React.FC<RoleAssignmentChallengeProps> = ({ 
  challenge, 
  onComplete, 
  onRetry, 
  isCompleted 
}) => {
  const [assignments, setAssignments] = useState<{ [characterId: string]: string[] }>({});
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);

  const roleData = challenge.data as {
    instruction: string;
    characters: Character[];
    permissions: Permission[];
    correctAssignments: { [characterId: string]: string[] };
  };

  const handlePermissionToggle = (characterId: string, permissionId: string) => {
    setAssignments(prev => {
      const currentPermissions = prev[characterId] || [];
      const hasPermission = currentPermissions.includes(permissionId);
      
      if (hasPermission) {
        // Remove permission
        return {
          ...prev,
          [characterId]: currentPermissions.filter(id => id !== permissionId)
        };
      } else {
        // Add permission
        return {
          ...prev,
          [characterId]: [...currentPermissions, permissionId]
        };
      }
    });
  };

  const handleSubmit = () => {
    // Check if assignments match correct assignments
    const correct = roleData.characters.every(character => {
      const userPermissions = assignments[character.id] || [];
      const correctPermissions = roleData.correctAssignments[character.id] || [];
      
      return userPermissions.length === correctPermissions.length &&
             userPermissions.every(perm => correctPermissions.includes(perm));
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
    setAssignments({});
    setShowResult(false);
    setIsCorrect(false);
    setSelectedCharacter(null);
    onRetry();
  };

  const getPermissionsByService = () => {
    const grouped: { [service: string]: Permission[] } = {};
    roleData.permissions.forEach(permission => {
      if (!grouped[permission.service]) {
        grouped[permission.service] = [];
      }
      grouped[permission.service].push(permission);
    });
    return grouped;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'server': return 'text-error border-error/30 bg-error/10';
      case 'collection': return 'text-warning border-warning/30 bg-warning/10';
      case 'project': return 'text-azure-blue border-azure-blue/30 bg-azure-blue/10';
      case 'object': return 'text-success border-success/30 bg-success/10';
      default: return 'text-gray-400 border-gray-400/30 bg-gray-400/10';
    }
  };

  const canSubmit = () => {
    return roleData.characters.every(character => 
      assignments[character.id] && assignments[character.id].length > 0
    );
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
            key="assignment"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-white mb-4">
                {roleData.instruction}
              </h4>
            </div>

            {/* Characters */}
            <div className="mb-8">
              <h5 className="text-white font-semibold mb-4">Team Members:</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {roleData.characters.map((character) => {
                  const characterPermissions = assignments[character.id] || [];
                  const isSelected = selectedCharacter === character.id;
                  
                  return (
                    <motion.div
                      key={character.id}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setSelectedCharacter(isSelected ? null : character.id)}
                      className={`p-4 rounded-lg border cursor-pointer transition-all duration-300 ${
                        isSelected
                          ? 'bg-azure-blue/20 border-azure-blue'
                          : 'bg-white/5 border-white/20 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center mb-3">
                        <div className="text-3xl mr-3">{character.avatar}</div>
                        <div>
                          <div className="text-white font-semibold">{character.name}</div>
                          <div className="text-azure-light text-sm">{character.role}</div>
                        </div>
                      </div>
                      <p className="text-gray-300 text-sm mb-3">{character.description}</p>
                      
                      {/* Assigned Permissions Count */}
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-400">
                          Permissions: {characterPermissions.length}
                        </div>
                        <div className={`text-xs px-2 py-1 rounded ${
                          isSelected ? 'bg-azure-blue text-white' : 'bg-gray-600 text-gray-300'
                        }`}>
                          {isSelected ? 'Selected' : 'Click to select'}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Permissions Assignment */}
            {selectedCharacter && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-8"
              >
                <div className="game-card bg-azure-blue/10 border-azure-blue/30">
                  <h5 className="text-white font-semibold mb-4">
                    Assign Permissions to {roleData.characters.find(c => c.id === selectedCharacter)?.name}
                  </h5>
                  
                  {Object.entries(getPermissionsByService()).map(([service, permissions]) => (
                    <div key={service} className="mb-6">
                      <h6 className="text-azure-light font-semibold mb-3 capitalize">
                        {service.replace('-', ' ')} Service
                      </h6>
                      <div className="grid grid-cols-1 gap-3">
                        {permissions.map((permission) => {
                          const isAssigned = assignments[selectedCharacter]?.includes(permission.id) || false;
                          
                          return (
                            <motion.div
                              key={permission.id}
                              whileHover={{ scale: 1.01 }}
                              onClick={() => handlePermissionToggle(selectedCharacter, permission.id)}
                              className={`p-3 rounded-lg border cursor-pointer transition-all duration-300 ${
                                isAssigned
                                  ? 'bg-success/20 border-success'
                                  : 'bg-white/5 border-white/20 hover:bg-white/10'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center mb-1">
                                    <div className={`w-4 h-4 rounded border-2 mr-3 flex items-center justify-center ${
                                      isAssigned
                                        ? 'border-success bg-success'
                                        : 'border-gray-400'
                                    }`}>
                                      {isAssigned && (
                                        <div className="w-2 h-2 bg-white rounded-full" />
                                      )}
                                    </div>
                                    <span className="text-white font-semibold">{permission.name}</span>
                                  </div>
                                  <p className="text-gray-300 text-sm ml-7">{permission.description}</p>
                                </div>
                                <div className={`badge ${getCategoryColor(permission.category)} ml-3`}>
                                  {permission.category}
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Assignment Summary */}
            <div className="mb-6">
              <h5 className="text-white font-semibold mb-4">Assignment Summary:</h5>
              <div className="space-y-3">
                {roleData.characters.map((character) => {
                  const characterPermissions = assignments[character.id] || [];
                  
                  return (
                    <div key={character.id} className="game-card bg-white/5">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <span className="text-2xl mr-2">{character.avatar}</span>
                          <span className="text-white font-semibold">{character.name}</span>
                        </div>
                        <div className="text-azure-light text-sm">
                          {characterPermissions.length} permissions
                        </div>
                      </div>
                      
                      {characterPermissions.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {characterPermissions.map(permId => {
                            const permission = roleData.permissions.find(p => p.id === permId);
                            return permission ? (
                              <span
                                key={permId}
                                className={`badge ${getCategoryColor(permission.category)}`}
                              >
                                {permission.name}
                              </span>
                            ) : null;
                          })}
                        </div>
                      ) : (
                        <div className="text-gray-400 text-sm italic">
                          No permissions assigned
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
                Submit Assignments
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
                {isCorrect ? 'Perfect Security Setup!' : 'Security Issues Detected'}
              </h4>
              
              {isCorrect && (
                <div className="badge-success mb-4">
                  +{challenge.points} points earned!
                </div>
              )}
            </div>

            {/* Show correct assignments */}
            <div className="game-card bg-white/5 mb-6">
              <h5 className="text-white font-semibold mb-4">Correct Permission Assignments:</h5>
              <div className="space-y-4">
                {roleData.characters.map((character) => {
                  const correctPermissions = roleData.correctAssignments[character.id] || [];
                  const userPermissions = assignments[character.id] || [];
                  const isCharacterCorrect = correctPermissions.length === userPermissions.length &&
                    correctPermissions.every(perm => userPermissions.includes(perm));

                  return (
                    <div key={character.id} className={`p-3 rounded-lg ${
                      isCharacterCorrect ? 'bg-success/20' : 'bg-error/20'
                    }`}>
                      <div className="flex items-center mb-2">
                        <span className="text-2xl mr-2">{character.avatar}</span>
                        <span className="text-white font-semibold">{character.name}</span>
                        {isCharacterCorrect && <span className="ml-2 text-success">✓</span>}
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {correctPermissions.map(permId => {
                          const permission = roleData.permissions.find(p => p.id === permId);
                          const wasAssignedCorrectly = userPermissions.includes(permId);
                          
                          return permission ? (
                            <span
                              key={permId}
                              className={`badge ${
                                wasAssignedCorrectly 
                                  ? getCategoryColor(permission.category)
                                  : 'text-gray-400 border-gray-400/30 bg-gray-400/10'
                              }`}
                            >
                              {permission.name}
                              {wasAssignedCorrectly && <span className="ml-1">✓</span>}
                            </span>
                          ) : null;
                        })}
                      </div>
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

export default RoleAssignmentChallenge;
