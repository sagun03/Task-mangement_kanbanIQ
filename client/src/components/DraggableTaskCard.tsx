
import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';
import { Task } from '../types/kanban';
import styled from 'styled-components';
import { Box } from '@mui/material';

interface DraggableTaskCardProps {
  task: Task;
  index: number | string;
}

const DraggableContainer = styled(Box)<{ isDragging: boolean}>`
  margin-bottom: 12px;
  user-select: none !important;
  z-index: ${props => props.isDragging ? '9999999 !important' : '1'};
  position: ${({ isDragging }) => (isDragging ? "absolute !important" : "auto")};
`;


const DraggableTaskCard: React.FC<DraggableTaskCardProps> = ({ task, index }) => {
    console.log("index", index);
  return (
    <Draggable draggableId={task.id} index={index as number}>
      {(provided, snapshot) => (
        <DraggableContainer
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          isDragging={snapshot.isDragging}
        >
          <TaskCard task={task} isDragging={snapshot.isDragging} />
        </DraggableContainer>
      )}
    </Draggable>
  );
};

export default DraggableTaskCard;