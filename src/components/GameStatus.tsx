import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { GameLevel } from '../types/game';

interface GameStatusProps {
  currentLevel: GameLevel;
  score: number;
  health: number;
  xp: number;
  waterUsed: number;
  waterLimit: number;
}

const StatusContainer = styled.div`
  background: rgba(0, 0, 0, 0.3);
  border-radius: 20px;
  padding: 25px;
  margin: 20px auto;
  max-width: 1200px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
`;

const LevelInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
`;

const LevelName = styled.h2`
  margin: 0;
  color: #4CAF50;
  font-size: 1.8rem;
`;

const LevelNumber = styled.div`
  background: #4CAF50;
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: bold;
  font-size: 1.2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 12px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  margin: 20px 0;
  overflow: hidden;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const Progress = styled(motion.div)<{ width: number; color?: string }>`
  height: 100%;
  background: ${props => props.color || 'linear-gradient(90deg, #4CAF50, #8BC34A)'};
  width: ${props => props.width}%;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  padding: 15px;
  border-radius: 15px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.1);

  h3 {
    margin: 0 0 10px 0;
    color: #4CAF50;
    font-size: 1.2rem;
  }

  p {
    margin: 0;
    font-size: 1.5rem;
    font-weight: bold;
  }
`;

const NextLevelInfo = styled.div`
  text-align: center;
  margin-top: 15px;
  color: #8BC34A;
  font-size: 0.9rem;
`;

const Label = styled.div`
  font-size: 1.2rem;
  margin-bottom: 10px;
`;

const SmallText = styled.div`
  font-size: 0.9rem;
  color: #ccc;
`;

const PLANT_TYPES = {
  // assuming this object is defined elsewhere
};

const GameStatus: React.FC<GameStatusProps> = ({
  currentLevel,
  score,
  health,
  xp,
  waterUsed,
  waterLimit,
}) => {
  const progressToNextLevel = Math.min((score / currentLevel.scoreToNextLevel) * 100, 100);
  const pointsToNextLevel = Math.max(0, currentLevel.scoreToNextLevel - score);

  return (
    <StatusContainer>
      <LevelInfo>
        <LevelName>Virtual Garden</LevelName>
        <LevelNumber>Level {currentLevel.id}</LevelNumber>
      </LevelInfo>

      <div>
        <Label>Level Progress</Label>
        <ProgressBar>
          <Progress width={progressToNextLevel} />
        </ProgressBar>
        <SmallText>{pointsToNextLevel} points to next level</SmallText>
      </div>
      <div>
        <Label>Water Usage</Label>
        <ProgressBar>
          <Progress width={(waterUsed / waterLimit) * 100} color="#4A90E2" />
        </ProgressBar>
        <SmallText>{waterUsed}/{waterLimit} water used today</SmallText>
      </div>

      <StatsGrid>
        <StatCard>
          <h3>Score</h3>
          <p>{score}</p>
        </StatCard>
        <StatCard>
          <h3>Plants Available</h3>
          <p>{currentLevel.maxPlants}</p>
        </StatCard>
        <StatCard>
          <h3>Plant Types</h3>
          <p>{Object.keys(PLANT_TYPES).length}</p>
        </StatCard>
      </StatsGrid>

      <NextLevelInfo>
        {pointsToNextLevel > 0 ? (
          `${pointsToNextLevel} points needed for next level`
        ) : (
          'Maximum level reached!'
        )}
      </NextLevelInfo>
    </StatusContainer>
  );
};

export default GameStatus;
