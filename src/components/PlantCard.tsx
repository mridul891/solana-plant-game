import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Plant } from '../types/game';

interface PlantCardProps {
  plant: Plant;
  onWater: () => void;
  onUsePesticide: () => void;
  canWater: boolean;
  canUsePesticide: boolean;
}

const Card = styled(motion.div)`
  background: rgba(0, 0, 0, 0.2);
  border-radius: 15px;
  padding: 20px;
  width: 250px;
  display: flex;
  flex-direction: column;
  align-items: center;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const PlantImage = styled(motion.div)<{ needsAttention: boolean }>`
  font-size: 4rem;
  margin: 10px 0;
  position: relative;
  opacity: ${props => props.needsAttention ? 0.7 : 1};
  
  ${props => props.needsAttention && `
    &::after {
      content: '⚠️';
      position: absolute;
      top: -10px;
      right: -10px;
      font-size: 1.5rem;
    }
  `}
`;

const StatusText = styled.p`
  margin: 5px 0;
  font-size: 0.9rem;
  color: #a0a0a0;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  margin: 5px 0;
  overflow: hidden;
`;

const Progress = styled(motion.div)<{ value: number; color: string }>`
  height: 100%;
  background: ${props => props.color};
  width: ${props => props.value}%;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 15px;
`;

const Button = styled.button<{ disabled?: boolean }>`
  background: ${props => props.disabled ? '#666' : '#4CAF50'};
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.5 : 1};
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 5px;

  &:hover {
    background: ${props => props.disabled ? '#666' : '#45a049'};
  }
`;

const getPlantEmoji = (growth: number): string => {
  if (growth < 25) return '🌱';
  if (growth < 50) return '🪴';
  if (growth < 75) return '🌿';
  return '🌳';
};

const PlantCard: React.FC<PlantCardProps> = ({
  plant,
  onWater,
  onUsePesticide,
  canWater,
  canUsePesticide,
}) => {
  const needsAttention = plant.needsPesticide || plant.health < 50;

  return (
    <Card>
      <PlantImage 
        needsAttention={needsAttention}
        animate={{ scale: needsAttention ? [1, 0.95, 1] : 1 }}
        transition={{ repeat: needsAttention ? Infinity : 0, duration: 1 }}
      >
        {getPlantEmoji(plant.growth)}
      </PlantImage>

      <StatusText>Health</StatusText>
      <ProgressBar>
        <Progress
          value={plant.health}
          color={plant.health > 50 ? '#4CAF50' : '#f44336'}
          initial={{ width: 0 }}
          animate={{ width: `${plant.health}%` }}
        />
      </ProgressBar>

      <StatusText>Growth</StatusText>
      <ProgressBar>
        <Progress
          value={plant.growth}
          color="#FF9800"
          initial={{ width: 0 }}
          animate={{ width: `${plant.growth}%` }}
        />
      </ProgressBar>

      {plant.needsPesticide && (
        <StatusText style={{ color: '#f44336' }}>
          🐛 Plant needs pesticide!
        </StatusText>
      )}

      <ButtonGroup>
        <Button
          onClick={onWater}
          disabled={!canWater}
        >
          Water 💧
        </Button>
        {plant.needsPesticide && (
          <Button
            onClick={onUsePesticide}
            disabled={!canUsePesticide}
          >
            Pesticide 🧪
          </Button>
        )}
      </ButtonGroup>
    </Card>
  );
};

export default PlantCard;
