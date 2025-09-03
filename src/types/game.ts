export interface GameState {
  currentLevel: number;
  score: number;
  badges: Badge[];
  progress: LevelProgress[];
  playerName: string;
  isGameCompleted: boolean;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedAt?: Date;
}

export interface LevelProgress {
  levelId: number;
  isCompleted: boolean;
  score: number;
  attempts: number;
  timeSpent: number;
  completedAt?: Date;
}

export interface Level {
  id: number;
  title: string;
  description: string;
  icon: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: number; // in minutes
  prerequisites: number[]; // level IDs that must be completed first
  badge?: Badge;
  challenges: Challenge[];
}

export interface Challenge {
  id: string;
  type: 'quiz' | 'drag-drop' | 'terminal' | 'puzzle' | 'role-assignment';
  title: string;
  description: string;
  points: number;
  data: any; // Challenge-specific data
}

export interface QuizChallenge extends Challenge {
  type: 'quiz';
  data: {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  };
}

export interface DragDropChallenge extends Challenge {
  type: 'drag-drop';
  data: {
    instruction: string;
    items: DragDropItem[];
    dropZones: DropZone[];
    correctMappings: { [itemId: string]: string }; // itemId -> dropZoneId
  };
}

export interface DragDropItem {
  id: string;
  content: string;
  type: string;
}

export interface DropZone {
  id: string;
  label: string;
  acceptedTypes: string[];
}

export interface TerminalChallenge extends Challenge {
  type: 'terminal';
  data: {
    instruction: string;
    expectedCommands: string[];
    hints: string[];
    simulatedOutput: { [command: string]: string };
  };
}

export interface RoleAssignmentChallenge extends Challenge {
  type: 'role-assignment';
  data: {
    instruction: string;
    characters: Character[];
    permissions: Permission[];
    correctAssignments: { [characterId: string]: string[] }; // characterId -> permissionIds
  };
}

export interface Character {
  id: string;
  name: string;
  role: string;
  avatar: string;
  description: string;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  category: 'server' | 'collection' | 'project' | 'object';
  service: 'boards' | 'repos' | 'pipelines' | 'test-plans' | 'artifacts' | 'global';
}

export interface GameAction {
  type: string;
  payload?: any;
}

// Game Actions
export const GAME_ACTIONS = {
  START_GAME: 'START_GAME',
  SET_PLAYER_NAME: 'SET_PLAYER_NAME',
  START_LEVEL: 'START_LEVEL',
  COMPLETE_CHALLENGE: 'COMPLETE_CHALLENGE',
  COMPLETE_LEVEL: 'COMPLETE_LEVEL',
  EARN_BADGE: 'EARN_BADGE',
  UPDATE_SCORE: 'UPDATE_SCORE',
  RESET_GAME: 'RESET_GAME',
  SAVE_PROGRESS: 'SAVE_PROGRESS',
  LOAD_PROGRESS: 'LOAD_PROGRESS',
} as const;
