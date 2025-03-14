import React from 'react';
import { format } from 'date-fns';
import { ITask, IUser } from '../types/kanban';
import { Draggable } from 'react-beautiful-dnd';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Calendar, MoreHorizontal } from 'lucide-react';
import styled from 'styled-components';
import { Typography, IconButton, Chip } from '@mui/material';

interface TaskCardProps {
  task: ITask;
  index: number;
  assignedUser?: IUser;
}

const CardContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  border: 1px solid #f1f5f9;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  transition: all 0.2s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.08);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
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

const TaskTitle = styled(Typography)`
  font-weight: 500;
  margin-top: 12px;
  color: #1e293b;
`;

const TaskDescription = styled(Typography)`
  color: #64748b;
  font-size: 0.875rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
`;

const MetaInfoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const MetaInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  color: #94a3b8;
  font-size: 0.75rem;
`;

const PriorityChip = styled(Chip)<{ priority: string }>`
  &.MuiChip-root {
    height: 24px;
    font-size: 0.7rem;
    font-weight: 500;
    
    ${({ priority }) => {
      switch(priority) {
        case 'high':
          return `
            background-color: #fee2e2;
            color: #ef4444;
            border: 1px solid #fecaca;
          `;
        case 'medium':
          return `
            background-color: #fef3c7;
            color: #f59e0b;
            border: 1px solid #fde68a;
          `;
        case 'low':
          return `
            background-color: #dcfce7;
            color: #22c55e;
            border: 1px solid #bbf7d0;
          `;
        default:
          return `
            background-color: #f1f5f9;
            color: #64748b;
            border: 1px solid #e2e8f0;
          `;
      }
    }}
  }
`;

const UserAvatar = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #fff;
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
`;

const TaskCard: React.FC<TaskCardProps> = ({ task, index, assignedUser }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/task/${task._id || task.id}`);
  };

  const dueDate = task.dueDate ? new Date(task.dueDate) : null;
  const formattedDate = dueDate ? format(dueDate, 'MMM d') : '';
  
  const getPriorityText = () => {
    return `${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}`;
  };

  const commentsCount = task.comments?.length || 0;
  const taskId = task._id?.toString() || task.id?.toString() || index.toString();
  
  return (
    <Draggable draggableId={taskId} index={index}>
      {(provided) => (
        <CardContainer
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={handleClick}
        >
          <CardHeader>
            <PriorityChip 
              priority={task.priority}
              label={getPriorityText()}
              size="small"
            />
            
            <StyledIconButton size="small">
              <MoreHorizontal size={16} />
            </StyledIconButton>
          </CardHeader>
          
          <TaskTitle variant="subtitle1">
            {task.title}
          </TaskTitle>
          
          {task.description && (
            <TaskDescription variant="body2">
              {task.description}
            </TaskDescription>
          )}
          
          <CardFooter>
            <MetaInfoContainer>
              {dueDate && (
                <MetaInfo>
                  <Calendar size={14} />
                  <span>Due {formattedDate}</span>
                </MetaInfo>
              )}
              
              {commentsCount > 0 && (
                <MetaInfo>
                  <MessageSquare size={14} />
                  <span>{commentsCount}</span>
                </MetaInfo>
              )}
            </MetaInfoContainer>
            
            {assignedUser && (
              <UserAvatar 
                src={assignedUser.avatar || `/lovable-uploads/41308400-5b71-42bd-947a-46c5acc6e0ec.png`}
                alt={assignedUser.name || 'User'} 
              />
            )}
          </CardFooter>
        </CardContainer>
      )}
    </Draggable>
  );
};

export default TaskCard;
