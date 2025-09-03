import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { GameState, GameAction, Badge, LevelProgress } from '../types/game';
import { GAME_ACTIONS } from '../types/game';

const initialState: GameState = {
  currentLevel: 0,
  score: 0,
  badges: [],
  progress: [],
  playerName: '',
  isGameCompleted: false,
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case GAME_ACTIONS.START_GAME:
      return {
        ...state,
        currentLevel: 1,
        playerName: action.payload.playerName,
      };

    case GAME_ACTIONS.SET_PLAYER_NAME:
      return {
        ...state,
        playerName: action.payload,
      };

    case GAME_ACTIONS.START_LEVEL:
      return {
        ...state,
        currentLevel: action.payload,
      };

    case GAME_ACTIONS.COMPLETE_CHALLENGE:
      return {
        ...state,
        score: state.score + action.payload.points,
      };

    case GAME_ACTIONS.COMPLETE_LEVEL:
      const levelProgress: LevelProgress = {
        levelId: action.payload.levelId,
        isCompleted: true,
        score: action.payload.score,
        attempts: action.payload.attempts,
        timeSpent: action.payload.timeSpent,
        completedAt: new Date(),
      };

      const updatedProgress = state.progress.filter(p => p.levelId !== action.payload.levelId);
      updatedProgress.push(levelProgress);

      return {
        ...state,
        progress: updatedProgress,
        currentLevel: action.payload.levelId < 5 ? action.payload.levelId + 1 : state.currentLevel,
        isGameCompleted: action.payload.levelId === 5,
      };

    case GAME_ACTIONS.EARN_BADGE:
      const newBadge: Badge = {
        ...action.payload,
        earned: true,
        earnedAt: new Date(),
      };

      const updatedBadges = state.badges.filter(b => b.id !== newBadge.id);
      updatedBadges.push(newBadge);

      return {
        ...state,
        badges: updatedBadges,
      };

    case GAME_ACTIONS.UPDATE_SCORE:
      return {
        ...state,
        score: state.score + action.payload,
      };

    case GAME_ACTIONS.RESET_GAME:
      return initialState;

    case GAME_ACTIONS.LOAD_PROGRESS:
      return {
        ...state,
        ...action.payload,
      };

    default:
      return state;
  }
}

interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  startGame: (playerName: string) => void;
  completeChallenge: (points: number) => void;
  completeLevel: (levelId: number, score: number, attempts: number, timeSpent: number) => void;
  earnBadge: (badge: Omit<Badge, 'earned' | 'earnedAt'>) => void;
  resetGame: () => void;
  saveProgress: () => void;
  loadProgress: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // Load progress from localStorage on mount
  useEffect(() => {
    loadProgress();
  }, []);

  // Save progress to localStorage whenever state changes
  useEffect(() => {
    if (state.playerName) {
      localStorage.setItem('ado-game-progress', JSON.stringify(state));
    }
  }, [state]);

  const startGame = (playerName: string) => {
    dispatch({
      type: GAME_ACTIONS.START_GAME,
      payload: { playerName },
    });
  };

  const completeChallenge = (points: number) => {
    dispatch({
      type: GAME_ACTIONS.COMPLETE_CHALLENGE,
      payload: { points },
    });
  };

  const completeLevel = (levelId: number, score: number, attempts: number, timeSpent: number) => {
    dispatch({
      type: GAME_ACTIONS.COMPLETE_LEVEL,
      payload: { levelId, score, attempts, timeSpent },
    });
  };

  const earnBadge = (badge: Omit<Badge, 'earned' | 'earnedAt'>) => {
    dispatch({
      type: GAME_ACTIONS.EARN_BADGE,
      payload: badge,
    });
  };

  const resetGame = () => {
    localStorage.removeItem('ado-game-progress');
    dispatch({ type: GAME_ACTIONS.RESET_GAME });
  };

  const saveProgress = () => {
    localStorage.setItem('ado-game-progress', JSON.stringify(state));
  };

  const loadProgress = () => {
    const savedProgress = localStorage.getItem('ado-game-progress');
    if (savedProgress) {
      try {
        const parsedProgress = JSON.parse(savedProgress);
        dispatch({
          type: GAME_ACTIONS.LOAD_PROGRESS,
          payload: parsedProgress,
        });
      } catch (error) {
        console.error('Failed to load saved progress:', error);
      }
    }
  };

  const value: GameContextType = {
    state,
    dispatch,
    startGame,
    completeChallenge,
    completeLevel,
    earnBadge,
    resetGame,
    saveProgress,
    loadProgress,
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
