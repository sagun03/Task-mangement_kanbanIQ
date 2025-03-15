import styled from 'styled-components';

export const BoardContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: calc(100vh - 64px);
  padding: 16px;
  background-color: #F9FAFB;
`;

export const ColumnsContainer = styled.div`
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  gap: 16px;
  padding: 8px 0;
  height: calc(100vh - 180px);

  &::-webkit-scrollbar {
    height: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background-color: #f1f1f1;
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: #ddd;
    border-radius: 10px;
  }
`;

export const Column = styled.div<{ $columnType?: string }>`
  min-width: 300px;
  width: 300px;
  display: flex;
  flex-direction: column;
  max-height: 100%;
  overflow-y: hidden;
    background-color: #f3f4f6;

  border-radius: 12px;
  border: 1px solid #f1f5f9;
`;

export const ColumnHeader = styled.div`
  padding: 16px;
  margin-bottom: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f1f5f9;
`;

export const TaskList = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  padding: 8px 16px;
  
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background-color: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: #cbd5e1;
    border-radius: 10px;
  }
`;

export const TaskCard = styled.div`
  background: white;
  border-radius: 8px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid #f1f5f9;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }
`;

export const TaskTitle = styled.h6`
  font-weight: 600;
  margin-bottom: 4px;
  font-size: 0.95rem;
`;

export const TaskDescription = styled.p`
  color: #666;
  font-size: 0.825rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const TaskMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const TaskDate = styled.div`
  font-size: 0.75rem;
  color: #666;
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const PriorityChip = styled.div<{ $priority?: 'high' | 'medium' | 'low' }>`
  font-size: 0.7rem;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 8px;
  border-radius: 4px;
  background-color: ${({ $priority }) => {
    switch ($priority) {
      case 'high':
        return '#ffebee';
      case 'medium':
        return '#fff8e1';
      case 'low':
        return '#e8f5e9';
      default:
        return '#f5f5f5';
    }
  }};
  color: ${({ $priority }) => {
    switch ($priority) {
      case 'high':
        return '#d32f2f';
      case 'medium':
        return '#ff8f00';
      case 'low':
        return '#2e7d32';
      default:
        return '#616161';
    }
  }};
  border: 1px solid ${({ $priority }) => {
    switch ($priority) {
      case 'high':
        return '#ffcdd2';
      case 'medium':
        return '#ffe082';
      case 'low':
        return '#c8e6c9';
      default:
        return '#e0e0e0';
    }
  }};
`;

export const PriorityChipWithLabel = styled(PriorityChip)`
  &::before {
    content: attr(data-label);
  }
`;

export const UserAvatar = styled.div`
  width: 24px;
  height: 24px;
  font-size: 0.75rem;
  border-radius: 50%;
  overflow: hidden;
`;

export const BoardsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
  padding: 16px 0;
`;

export const BoardCard = styled.div`
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  height: 200px;
  display: flex;
  flex-direction: column;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 12px rgba(0,0,0,0.15);
  }
`;

export const BoardCardContent = styled.div`
  padding: 16px;
  flex-grow: 1;
`;

export const BoardTitle = styled.h3`
  font-weight: 600;
  margin-bottom: 8px;
`;

export const BoardDescription = styled.p`
  color: #666;
  font-size: 0.875rem;
  flex-grow: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const BoardMeta = styled.div`
  padding: 8px 16px;
  background-color: #f5f5f5;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
  color: #666;
`;

export const UsersCircle = styled.div`
  display: flex;
  align-items: center;
`;
