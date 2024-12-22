import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

interface ControlsProps {
  onWater: () => void;
  onBuyPesticide: () => void;
  waterLevel: number;
  needsPesticide: boolean;
  isWalletConnected: boolean;
}

const ControlsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  backdrop-filter: blur(10px);
  margin-top: 20px;
`;

const Button = styled(motion.button)`
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  background: #4CAF50;
  color: white;
  transition: all 0.3s ease;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
`;

const WaterLevel = styled.div`
  width: 100%;
  height: 20px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  overflow: hidden;
`;

const WaterFill = styled.div<{ level: number }>`
  width: ${props => props.level}%;
  height: 100%;
  background: linear-gradient(90deg, #2196F3, #03A9F4);
  transition: width 0.3s ease;
`;

const Controls: React.FC<ControlsProps> = ({
  onWater,
  onBuyPesticide,
  waterLevel,
  needsPesticide,
  isWalletConnected,
}) => {
  return (
    <ControlsContainer>
      <WaterLevel>
        <WaterFill level={waterLevel} />
      </WaterLevel>
      
      <Button
        onClick={onWater}
        whileTap={{ scale: 0.95 }}
      >
        Water Plant 💧
      </Button>

      {needsPesticide && (
        <Button
          onClick={onBuyPesticide}
          disabled={!isWalletConnected}
          whileTap={{ scale: 0.95 }}
          style={{ background: '#FF5722' }}
        >
          Buy Pesticide 🧪
        </Button>
      )}

      <WalletMultiButton />
    </ControlsContainer>
  );
};

export default Controls;
