import { IconButton } from '@mui/material';
import { styled } from 'styled-components';
import { Bot } from 'lucide-react';

const FloatingButton = styled(IconButton)`
  position: fixed !important;   
  bottom: 34px !important;
  right: 64px !important;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  background: #1976d2 !important;
  
  color: white !important;
  transition: box-shadow 0.3s ease-in-out;
  animation: pulse 1.5s infinite;
  
  &:hover {
    box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.2);
    animation: none;
  }

  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
  }
`;

export function RagChatButton({ onClick }: { onClick: () => void }) {
  
  return (
    <>
      <FloatingButton onClick={onClick}>
        <Bot size={24} />
      </FloatingButton>
        </>
  );
}
