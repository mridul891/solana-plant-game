import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import PlantCard from './PlantCard';
import { Plant, GameLevel } from '../types/game';

interface GardenProps {
  plants: Plant[];
  currentLevel: GameLevel;
  onWater: (plantId: string) => void;
  onUsePesticide: (plantId: string) => void;
  canWater: boolean;
  canUsePesticide: boolean;
}

const GardenContainer = styled.div`
  padding: 20px;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
`;

const PlantsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin: 20px 0;
`;

const EmptySlot = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  padding: 20px;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #666;
  border: 2px dashed rgba(255, 255, 255, 0.1);
  cursor: not-allowed;
`;

const Garden: React.FC<GardenProps> = ({
  plants,
  currentLevel,
  onWater,
  onUsePesticide,
  canWater,
  canUsePesticide,
}) => {
  const emptySlots = Math.max(0, currentLevel.maxPlants - plants.length);

  return (
    <GardenContainer>
      <PlantsGrid>
        {plants.map(plant => (
          <PlantCard
            key={plant.id}
            plant={plant}
            onWater={() => onWater(plant.id)}
            onUsePesticide={() => onUsePesticide(plant.id)}
            canWater={canWater}
            canUsePesticide={canUsePesticide}
          />
        ))}
        {[...Array(emptySlots)].map((_, index) => (
          <EmptySlot
            key={`empty-${index}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <div>
              <span style={{ fontSize: '2rem', marginBottom: '10px', display: 'block' }}>🌱</span>
              <p>Empty Plant Slot</p>
              <p style={{ fontSize: '0.8rem' }}>Visit the shop to buy a new plant!</p>
            </div>
          </EmptySlot>
        ))}
      </PlantsGrid>
    </GardenContainer>
  );
};

export default Garden;
