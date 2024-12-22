export enum PlantType {
  SUNFLOWER = 'SUNFLOWER',
  ROSE = 'ROSE',
  CACTUS = 'CACTUS',
  BONSAI = 'BONSAI',
  ORCHID = 'ORCHID'
}

export interface Plant {
  id: string;
  type: PlantType;
  health: number;
  growth: number;
  lastWatered: number;
  lastPesticide: number;
  needsPesticide: boolean;
  diseaseLevel: number;
  waterCount: number;
  diseased: boolean;
}

export interface GameLevel {
  id: number;
  name: string;
  maxPlants: number;
  scoreToNextLevel: number;
  dailyWaterLimit: number;
  waterCooldown: number;
  pesticideUnlocked: boolean;
  diseaseThreshold: number;
}

export const PLANT_TYPES: Record<PlantType, {
  name: string;
  growthTimeMultiplier: number;
  scoreMultiplier: number;
  description: string;
}> = {
  [PlantType.SUNFLOWER]: {
    name: 'Sunflower',
    growthTimeMultiplier: 1.0,
    scoreMultiplier: 1.0,
    description: 'A classic garden favorite, grows at a steady pace'
  },
  [PlantType.ROSE]: {
    name: 'Rose',
    growthTimeMultiplier: 0.8,
    scoreMultiplier: 1.2,
    description: 'Slower growing but yields more points'
  },
  [PlantType.CACTUS]: {
    name: 'Cactus',
    growthTimeMultiplier: 0.5,
    scoreMultiplier: 1.5,
    description: 'Very slow growing but highly rewarding'
  },
  [PlantType.BONSAI]: {
    name: 'Bonsai',
    growthTimeMultiplier: 0.7,
    scoreMultiplier: 1.3,
    description: 'Requires patience but offers good rewards'
  },
  [PlantType.ORCHID]: {
    name: 'Orchid',
    growthTimeMultiplier: 0.9,
    scoreMultiplier: 1.1,
    description: 'Moderately fast growing with slight score bonus'
  }
};

export const GAME_LEVELS: GameLevel[] = [
  {
    id: 1,
    name: 'Beginner Garden',
    maxPlants: 2,
    scoreToNextLevel: 100,
    dailyWaterLimit: 10,
    waterCooldown: 300000, // 5 minutes
    pesticideUnlocked: false,
    diseaseThreshold: 50
  },
  {
    id: 2,
    name: 'Amateur Garden',
    maxPlants: 4,
    scoreToNextLevel: 300,
    dailyWaterLimit: 20,
    waterCooldown: 240000, // 4 minutes
    pesticideUnlocked: true,
    diseaseThreshold: 60
  },
  {
    id: 3,
    name: 'Professional Garden',
    maxPlants: 6,
    scoreToNextLevel: 600,
    dailyWaterLimit: 30,
    waterCooldown: 180000, // 3 minutes
    pesticideUnlocked: true,
    diseaseThreshold: 70
  },
  {
    id: 4,
    name: 'Expert Garden',
    maxPlants: 8,
    scoreToNextLevel: 1000,
    dailyWaterLimit: 40,
    waterCooldown: 120000, // 2 minutes
    pesticideUnlocked: true,
    diseaseThreshold: 80
  },
  {
    id: 5,
    name: 'Master Garden',
    maxPlants: 10,
    scoreToNextLevel: Infinity,
    dailyWaterLimit: 50,
    waterCooldown: 60000, // 1 minute
    pesticideUnlocked: true,
    diseaseThreshold: 90
  }
];

export interface GameState {
  level: number;
  score: number;
  experience: number;
  plants: Plant[];
  availablePlantSlots: number;
  nextPlantAvailableAt: number;
}
