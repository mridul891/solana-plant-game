import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { UserProfile as UserProfileType } from '../types/user';
import { ACHIEVEMENTS } from '../types/user';

interface UserProfileProps {
  user: UserProfileType;
  onClose: () => void;
}

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ProfileCard = styled(motion.div)`
  background: #2d2d2d;
  border-radius: 20px;
  padding: 30px;
  width: 90%;
  max-width: 500px;
  color: white;
  position: relative;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 5px;
  
  &:hover {
    color: #4CAF50;
  }
`;

const Username = styled.h2`
  font-size: 2rem;
  margin: 0 0 20px 0;
  color: #4CAF50;
`;

const Stats = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  margin-bottom: 30px;
`;

const Stat = styled.div`
  background: rgba(0, 0, 0, 0.2);
  padding: 15px;
  border-radius: 10px;
  text-align: center;

  h3 {
    margin: 0;
    color: #4CAF50;
    font-size: 0.9rem;
  }

  p {
    margin: 5px 0 0;
    font-size: 1.2rem;
  }
`;

const AchievementsSection = styled.div`
  h3 {
    margin: 0 0 15px 0;
    color: #4CAF50;
  }
`;

const AchievementGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
`;

const Achievement = styled.div<{ unlocked: boolean }>`
  background: ${props => props.unlocked ? 'rgba(76, 175, 80, 0.2)' : 'rgba(0, 0, 0, 0.2)'};
  padding: 15px;
  border-radius: 10px;
  opacity: ${props => props.unlocked ? 1 : 0.5};
  
  h4 {
    margin: 0;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  p {
    margin: 5px 0 0;
    font-size: 0.9rem;
    color: #a0a0a0;
  }
`;

const UserProfile: React.FC<UserProfileProps> = ({ user, onClose }) => {
  return (
    <AnimatePresence>
      <Overlay
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <ProfileCard
          onClick={e => e.stopPropagation()}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
        >
          <CloseButton onClick={onClose}>×</CloseButton>
          
          <Username>{user.username}'s Garden</Username>
          
          <Stats>
            <Stat>
              <h3>Total Plants</h3>
              <p>{user.gameStats.totalPlants}</p>
            </Stat>
            <Stat>
              <h3>Highest Level</h3>
              <p>{user.gameStats.highestLevel}</p>
            </Stat>
            <Stat>
              <h3>Total Score</h3>
              <p>{user.gameStats.totalScore}</p>
            </Stat>
            <Stat>
              <h3>Achievements</h3>
              <p>{user.gameStats.achievements.length}</p>
            </Stat>
          </Stats>

          <AchievementsSection>
            <h3>Achievements</h3>
            <AchievementGrid>
              {ACHIEVEMENTS.map(achievement => (
                <Achievement
                  key={achievement.id}
                  unlocked={user.gameStats.achievements.includes(achievement.id)}
                >
                  <h4>
                    {achievement.icon} {achievement.name}
                  </h4>
                  <p>{achievement.description}</p>
                </Achievement>
              ))}
            </AchievementGrid>
          </AchievementsSection>
        </ProfileCard>
      </Overlay>
    </AnimatePresence>
  );
};

export default UserProfile;
