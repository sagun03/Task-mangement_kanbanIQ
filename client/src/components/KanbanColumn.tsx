
import React from 'react';
import { ITask, IUser } from '../types/kanban';
import { 
  Column, 
  ColumnHeader, 
  TaskList 
} from './styled/KanbanElemnets';
import TaskCard from './TaskCard';
import { Droppable } from 'react-beautiful-dnd';
import { Plus, MoreHorizontal } from 'lucide-react';
import { useKanban } from '../context/KanbanContext';
import { IconButton, Typography, Chip } from '@mui/material';
import styled from 'styled-components';

const TaskCount = styled(Chip)`
  &.MuiChip-root {
    height: 20px;
    font-size: 0.7rem;
    background-color: #f8f9fa;
    color: #6c757d;
    margin-left: 8px;
  }
`;

const ColumnTitle = styled(Typography)`
  font-weight: 600;
  font-size: 0.9rem;
  color: #495057;
  display: flex;
  align-items: center;
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
`;

const StyledIconButton = styled(IconButton)`
  &.MuiIconButton-root {
    padding: 4px;
    color: #adb5bd;
    
    &:hover {
      background-color: #f8f9fa;
      color: #6c757d;
    }
  }
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 24px 0;
  color: #adb5bd;
  font-size: 0.875rem;
`;

interface KanbanColumnProps {
  title: string;
  tasks: ITask[];
  users: IUser[];
  boardId: string;
  onAddTask?: (status?: string) => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ 
  title, 
  tasks, 
  users, 
  boardId,
  onAddTask 
}) => {
  const { getUserById } = useKanban();
  
  const handleAddTask = () => {
    // Pass the column title as the status when adding a task
    if (onAddTask) {
      onAddTask(title);
    }
  };
  
  return (
    <Column $columnType={title}>
      <ColumnHeader>
        <div className="flex items-center justify-between w-full">
          <ColumnTitle>
            {title}
            <TaskCount label={tasks.length} size="small" />
          </ColumnTitle>
          
          <HeaderActions>
            <StyledIconButton size="small" onClick={handleAddTask}>
              <Plus size={16} />
            </StyledIconButton>
            <StyledIconButton size="small">
              <MoreHorizontal size={16} />
            </StyledIconButton>
          </HeaderActions>
        </div>
      </ColumnHeader>
      
      <Droppable droppableId={title}>
        {(provided) => (
          <TaskList
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {tasks.length > 0 ? (
              tasks.map((task, index) => {
                const taskId = task._id?.toString() || task.id?.toString() || index.toString();
                return (
                  <TaskCard 
                    key={taskId} 
                    task={task} 
                    index={index}
                    assignedUser={getUserById?.(task.assignedTo) || users.find(u => u.userId === task.assignedTo)}
                  />
                );
              })
            ) : (
              <EmptyMessage>
                No tasks in this column
              </EmptyMessage>
            )}
            {provided.placeholder}
          </TaskList>
        )}
      </Droppable>
    </Column>
  );
};

export default KanbanColumn;
