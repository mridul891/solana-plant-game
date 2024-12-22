import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

interface PlantProps {
  waterLevel: number;
  health: number;
  needsPesticide: boolean;
}

const PlantContainer = styled(motion.div)`
  width: 200px;
  height: 300px;
  position: relative;
  margin: 0 auto;
`;

const PlantStem = styled(motion.div)<{ health: number }>`
  width: 20px;
  height: ${props => props.health * 2}px;
  background-color: #4CAF50;
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 10px;
`;

const PlantLeaf = styled(motion.div)<{ health: number }>`
  width: 60px;
  height: 80px;
  background-color: ${props => props.health > 50 ? '#4CAF50' : '#8BC34A'};
  border-radius: 50% 0;
  position: absolute;
  transform-origin: bottom center;
`;

const Plant: React.FC<PlantProps> = ({ waterLevel, health, needsPesticide }) => {
  const [growth, setGrowth] = useState(0);

  useEffect(() => {
    setGrowth(Math.min(100, waterLevel * 0.8));
  }, [waterLevel]);

  return (
    <PlantContainer>
      <PlantStem 
        health={health}
        animate={{ height: [0, growth * 2] }}
        transition={{ duration: 1 }}
      >
        {[...Array(3)].map((_, index) => (
          <PlantLeaf
            key={index}
            health={health}
            style={{
              bottom: 50 + index * 50,
              transform: `rotate(${index % 2 === 0 ? -45 : 45}deg)`,
              left: index % 2 === 0 ? -30 : 10,
            }}
            animate={{
              scale: needsPesticide ? [1, 0.9, 1] : 1,
            }}
            transition={{
              repeat: needsPesticide ? Infinity : 0,
              duration: 1,
            }}
          />
        ))}
      </PlantStem>
    </PlantContainer>
  );
};

export default Plant;
