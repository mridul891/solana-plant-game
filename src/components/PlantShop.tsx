import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { PlantType, PLANT_TYPES, GameLevel } from '../types/game';

interface PlantShopProps {
  isOpen: boolean;
  onClose: () => void;
  onBuyPlant: (type: PlantType) => void;
  onBuyPesticide: () => void;
  onBuyWater: () => void;
  currentLevel: GameLevel;
  canBuyPlant: boolean;
  canBuyPesticide: boolean;
  canBuyWater: boolean;
  nextPlantTime: number;
  pesticidesNeeded: boolean;
  solBalance: number;
}

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
`;

const ShopContainer = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 30px;
  max-width: 900px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.1);
  position: relative;
`;

const Title = styled.h2`
  color: #4CAF50;
  text-align: center;
  margin-bottom: 30px;
`;

const ShopSection = styled.div`
  margin-bottom: 40px;
`;

const SectionTitle = styled.h3`
  color: #8BC34A;
  margin-bottom: 20px;
  font-size: 1.4em;
`;

const ResourceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin: 20px 0;
`;

const ResourceCard = styled.div`
  background: rgba(0, 0, 0, 0.2);
  border-radius: 15px;
  padding: 25px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    border-color: rgba(255, 255, 255, 0.2);
  }
`;

const ResourceIcon = styled.div`
  font-size: 2.5em;
  margin-bottom: 10px;
`;

const ResourceTitle = styled.h3`
  color: #4CAF50;
  margin: 0;
  font-size: 1.3em;
`;

const ResourceDescription = styled.p`
  color: #ccc;
  text-align: center;
  margin: 5px 0;
  font-size: 0.9em;
  line-height: 1.4;
`;

const ResourcePrice = styled.div`
  color: #FFD700;
  font-weight: bold;
  margin: 5px 0;
  font-size: 1.2em;
`;

const BuyButton = styled.button<{ $highlight?: boolean }>`
  background: ${props => props.$highlight ? '#ff4444' : '#4CAF50'};
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 1em;
  font-weight: 600;
  width: 100%;
  
  &:hover:not(:disabled) {
    transform: scale(1.05);
    background: ${props => props.$highlight ? '#ff6666' : '#45a049'};
  }
  
  &:disabled {
    background: #666;
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

const CloseButton = styled(motion.button)`
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  color: #fff;
  font-size: 1.5em;
  cursor: pointer;
  padding: 5px;
  
  &:hover {
    color: #ff4444;
  }
`;

const Balance = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  color: #FFD700;
  font-weight: bold;
  font-size: 1.1em;
`;

const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const PlantShop: React.FC<PlantShopProps> = ({
  isOpen,
  onClose,
  onBuyPlant,
  onBuyPesticide,
  onBuyWater,
  currentLevel,
  canBuyPlant,
  canBuyPesticide,
  canBuyWater,
  nextPlantTime,
  pesticidesNeeded,
  solBalance
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <Overlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <ShopContainer
            onClick={e => e.stopPropagation()}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            <Balance>Balance: {solBalance.toFixed(2)} SOL</Balance>
            <CloseButton onClick={onClose}>✕</CloseButton>
            <Title>Virtual Garden Shop</Title>

            <ShopSection>
              <SectionTitle>Resources</SectionTitle>
              <ResourceGrid>
                <ResourceCard>
                  <ResourceIcon>💧</ResourceIcon>
                  <ResourceTitle>Water</ResourceTitle>
                  <ResourceDescription>
                    Essential for plant growth and health maintenance.
                    Daily limit increases with level progression.
                  </ResourceDescription>
                  <ResourcePrice>0.1 SOL</ResourcePrice>
                  <BuyButton
                    onClick={onBuyWater}
                    disabled={!canBuyWater}
                  >
                    {canBuyWater ? 'Buy Water (+5)' : 'Daily Limit Reached'}
                  </BuyButton>
                </ResourceCard>

                {currentLevel.pesticideUnlocked && (
                  <ResourceCard>
                    <ResourceIcon>🧪</ResourceIcon>
                    <ResourceTitle>Pesticide</ResourceTitle>
                    <ResourceDescription>
                      Protect your plants from diseases and maintain their health.
                      Required when plant health drops below 50%.
                    </ResourceDescription>
                    <ResourcePrice>0.1 SOL</ResourcePrice>
                    <BuyButton
                      onClick={onBuyPesticide}
                      disabled={!canBuyPesticide}
                      $highlight={pesticidesNeeded}
                    >
                      {pesticidesNeeded ? 'Buy Now (Needed!)' : 'Buy Pesticide'}
                    </BuyButton>
                  </ResourceCard>
                )}
              </ResourceGrid>
            </ShopSection>

            <ShopSection>
              <SectionTitle>Plants</SectionTitle>
              <ResourceGrid>
                {Object.entries(PLANT_TYPES).map(([typeKey, typeData]) => {
                  const type = typeKey as PlantType;
                  return (
                    <ResourceCard key={type}>
                      <ResourceIcon>🌱</ResourceIcon>
                      <ResourceTitle>{typeData.name}</ResourceTitle>
                      <ResourceDescription>
                        {typeData.description}
                        <br />
                        Growth Rate: {typeData.growthTimeMultiplier}x
                        <br />
                        Score Multiplier: {typeData.scoreMultiplier}x
                      </ResourceDescription>
                      <ResourcePrice>Free</ResourcePrice>
                      <BuyButton
                        onClick={() => onBuyPlant(type)}
                        disabled={!canBuyPlant}
                      >
                        {canBuyPlant ? 'Plant' : 'Wait...'}
                      </BuyButton>
                    </ResourceCard>
                  );
                })}
              </ResourceGrid>
            </ShopSection>
          </ShopContainer>
        </Overlay>
      )}
    </AnimatePresence>
  );
};

export default PlantShop;
