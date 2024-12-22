import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

interface NotificationProps {
  message: string;
  type: 'success' | 'error' | 'info';
  isVisible: boolean;
  onClose: () => void;
}

const NotificationContainer = styled(motion.div)<{ type: string }>`
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 15px 25px;
  border-radius: 8px;
  background: ${props => {
    switch (props.type) {
      case 'success':
        return 'rgba(76, 175, 80, 0.9)';
      case 'error':
        return 'rgba(244, 67, 54, 0.9)';
      default:
        return 'rgba(33, 150, 243, 0.9)';
    }
  }};
  color: white;
  backdrop-filter: blur(5px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 10px;
  z-index: 1000;
  cursor: pointer;
`;

const Icon = styled.span`
  font-size: 1.2em;
`;

const Message = styled.p`
  margin: 0;
  font-size: 1rem;
`;

const Notification: React.FC<NotificationProps> = ({
  message,
  type,
  isVisible,
  onClose
}) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      default:
        return 'ℹ️';
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <NotificationContainer
          type={type}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          onClick={onClose}
        >
          <Icon>{getIcon()}</Icon>
          <Message>{message}</Message>
        </NotificationContainer>
      )}
    </AnimatePresence>
  );
};

export default Notification;
