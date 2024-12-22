export interface UserProfile {
  id: string;
  username: string;
  email: string;
  walletAddress: string;
  createdAt: number;
  lastLogin: number;
  gameStats: {
    totalPlants: number;
    highestLevel: number;
    totalScore: number;
    achievements: string[];
  };
}

export interface AuthState {
  isAuthenticated: boolean;
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: number;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_plant',
    name: 'Green Thumb',
    description: 'Grow your first plant',
    icon: '🌱'
  },
  {
    id: 'level_5',
    name: 'Master Gardener',
    description: 'Reach level 5',
    icon: '🏆'
  },
  {
    id: 'rare_plant',
    name: 'Rare Collector',
    description: 'Obtain a rare plant',
    icon: '✨'
  },
  {
    id: 'perfect_health',
    name: 'Plant Whisperer',
    description: 'Keep a plant at perfect health for 24 hours',
    icon: '💚'
  }
];
