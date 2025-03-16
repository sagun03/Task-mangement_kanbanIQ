import React from "react";
import { format } from "date-fns";
import { ITask, IUser } from "../types/kanban";
import { Draggable } from "react-beautiful-dnd";
import { useNavigate } from "react-router-dom";
import { MessageSquare, Calendar } from "lucide-react";
import styled from "styled-components";
import { Typography, Chip, Tooltip } from "@mui/material";
import { UserAvatar } from "../pages/KanbanBoard";

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
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
  cursor: pointer;
  align-items: left;
  text-align: left;
  justify-content: left;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const PriorityChip = styled(Chip)<{ priority: string }>`
  &.MuiChip-root {
    height: 24px;
    font-size: 0.7rem;
    font-weight: 500;
    margin-right: 8px;

    ${({ priority }) => {
      switch (priority) {
        case "high":
          return `
            background-color: #fee2e2;
            color: #ef4444;
            border: 1px solid #fecaca;
          `;
        case "medium":
          return `
            background-color: #fef3c7;
            color: #f59e0b;
            border: 1px solid #fde68a;
          `;
        case "low":
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

const TaskTitle = styled(Typography)`
  font-weight: bold;
  font-size: 1rem;
  margin-top: 8px;
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
  gap: 8px;
`;

const MetaInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  color: #94a3b8;
  font-size: 0.75rem;
`;

const TaskCard: React.FC<TaskCardProps> = ({ task, index }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/kanban-board/tasks/${task._id || task.id}`);
  };

  const dueDate = task.dueDate ? new Date(task.dueDate) : null;
  const formattedDate = dueDate ? format(dueDate, "MMM d") : "";

  const getPriorityText = () => {
    return `${
      task.priority.charAt(0).toUpperCase() + task.priority.slice(1)
    } Priority`;
  };

  const commentsCount = task.comments?.length || 0;
  const taskId =
    task._id?.toString() || task.id?.toString() || index.toString();
  const assignedUser = task.assignedByEmail?.toUpperCase();

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
            {/* <StyledIconButton onClick={} size="small">
              <MoreHorizontal size={16} />
            </StyledIconButton> */}
          </CardHeader>

          <TaskTitle variant="h6">{task.title}</TaskTitle>

          {task.description && (
            <TaskDescription variant="body2">
              {task.description}
            </TaskDescription>
          )}

          <CardFooter>
            <MetaInfoContainer>
              {assignedUser && (
                <Tooltip
                  title={assignedUser.toLowerCase()}
                  arrow
                  sx={{ backgroundColor: "white" }}
                >
                  <UserAvatar
                    userId={task.assignedTo}
                    sx={{
                      width: 30,
                      height: 30,
                      cursor: "pointer",
                    }}
                    src={assignedUser || "/default-avatar.png"}
                    alt={assignedUser || "User"}
                  />
                </Tooltip>
              )}
              {dueDate && (
                <MetaInfo>
                  <Calendar size={14} />
                  <span>Due {formattedDate}</span>
                </MetaInfo>
              )}
            </MetaInfoContainer>
            {commentsCount > 0 && (
              <MetaInfo>
                <MessageSquare size={14} />
                <span>{commentsCount}</span>
              </MetaInfo>
            )}
          </CardFooter>
        </CardContainer>
      )}
    </Draggable>
  );
};

export default TaskCard;
