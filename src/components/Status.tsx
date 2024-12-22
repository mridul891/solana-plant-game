import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { GameLevel } from '../types/game';

interface StatusProps {
  level: GameLevel;
  score: number;
  pesticides: number;
  water: number;
  solBalance: number;
  onBuyPesticide: () => void;
  onBuyWater: () => void;
}

const StatusContainer = styled.div`
  background: rgba(0, 0, 0, 0.2);
  border-radius: 15px;
  padding: 20px;
  margin: 20px auto;
  max-width: 1200px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const StatusItem = styled.div`
  text-align: center;
  color: #fff;
  padding: 10px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.05);
`;

const ResourceButton = styled(motion.button)<{ color: string }>`
  background: ${props => props.color};
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  margin-top: 10px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.2s;

  &:hover {
    background: ${props => props.color}dd;
  }

  &:disabled {
    background: #666;
    cursor: not-allowed;
  }
`;

const ResourceIcon = styled.span`
  font-size: 1.5rem;
  margin-right: 8px;
`;

const LevelProgress = styled.div`
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  margin-top: 8px;
  overflow: hidden;
`;

const Progress = styled(motion.div)<{ width: number }>`
  height: 100%;
  background: linear-gradient(90deg, #4CAF50, #8BC34A);
  width: ${props => props.width}%;
`;

const Status: React.FC<StatusProps> = ({
  level,
  score,
  pesticides,
  water,
  solBalance,
  onBuyPesticide,
  onBuyWater,
}) => {
  const progressToNextLevel = Math.min(100, (score / level.scoreToNextLevel) * 100);

  return (
    <StatusContainer>
      <StatusItem>
        <h3>Level {level.id}</h3>
        <p>Score: {score} / {level.scoreToNextLevel}</p>
        <LevelProgress>
          <Progress
            width={progressToNextLevel}
            initial={{ width: 0 }}
            animate={{ width: progressToNextLevel }}
            transition={{ duration: 1 }}
          />
        </LevelProgress>
      </StatusItem>

      <StatusItem>
        <h3>Resources</h3>
        <div>
          <ResourceIcon>💧</ResourceIcon>
          Water: {water}
          <ResourceButton
            color="#2196F3"
            onClick={onBuyWater}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Buy Water (0.1 SOL)
          </ResourceButton>
        </div>
      </StatusItem>

      <StatusItem>
        <div>
          <ResourceIcon>🧪</ResourceIcon>
          Pesticides: {pesticides}
          <ResourceButton
            color="#9C27B0"
            onClick={onBuyPesticide}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Buy Pesticide (0.2 SOL)
          </ResourceButton>
        </div>
      </StatusItem>

      <StatusItem>
        <h3>Wallet</h3>
        <p>
          <ResourceIcon>💰</ResourceIcon>
          {solBalance.toFixed(2)} SOL
        </p>
      </StatusItem>
    </StatusContainer>
  );
};

export default Status;
