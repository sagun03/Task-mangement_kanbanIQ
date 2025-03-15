import React, { useState } from "react";
import { ITask, IUser } from "../types/kanban";
import { Column, ColumnHeader, TaskList } from "./styled/KanbanElemnets";
import TaskCard from "./TaskCard";
import { Droppable } from "react-beautiful-dnd";
import { Plus, MoreHorizontal } from "lucide-react";
// import { useKanban } from '../context/KanbanContext';
import {
  IconButton,
  Typography,
  Chip,
  Box,
  TextField,
  Menu,
  MenuItem,
} from "@mui/material";
import styled from "styled-components";
import { useKanban } from "../context/KanbanContext";
import { Close, MoreVert } from "@mui/icons-material";

const TaskCount = styled(Chip)`
  &.MuiChip-root {
    height: 20px;
    font-size: 0.7rem;
    background-color: #E4E7EB;
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

const EditContainer = styled(Box)`
  display: flex;
  gap: 4px;
  width: 100%;
`;

interface KanbanColumnProps {
  title: string;
  tasks: ITask[];
  users: IUser[];
  boardId: string;
  columnId: string;
  onAddTask?: (status?: string) => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({
  title,
  tasks,
  boardId,
  columnId,
}) => {
  const { updateColumnName, deleteColumn } = useKanban();
  const [isEditing, setIsEditing] = useState(false);
  const [columnTitle, setTitle] = useState(title);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(menuAnchorEl);

  const handleSaveTitle = () => {
    if (title.trim()) {
      updateColumnName(boardId, columnId, title);
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSaveTitle();
    } else if (e.key === "Escape") {
      setTitle(title);
      setIsEditing(false);
    }
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleRenameClick = () => {
    setIsEditing(true);
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    deleteColumn(boardId, columnId);
    handleMenuClose();
  };
  return (
    <Column $columnType={columnTitle}>
      <ColumnHeader>
        {isEditing ? (
          <EditContainer>
            <TextField
              value={columnTitle}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleSaveTitle}
              onKeyDown={handleKeyDown}
              autoFocus
              size="small"
              fullWidth
              variant="outlined"
              inputProps={{
                style: {
                  height: "16px",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  padding: "8px 12px",
                },
              }}
            />
            <IconButton
              size="small"
              onClick={() => {
                // setTitle(column.title);
                setIsEditing(false);
              }}
            >
              <Close fontSize="small" />
            </IconButton>
          </EditContainer>
        ) : (
          <>
            <ColumnTitle variant="subtitle2">
              {columnTitle}
              <TaskCount variant="filled" label={(tasks?.length ?? 0).toString()} />
              </ColumnTitle>

            {/* Material UI Menu replaces shadcn Dropdown */}
            <div>
              <IconButton
                size="small"
                onClick={handleMenuClick}
                aria-controls={menuOpen ? "column-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={menuOpen ? "true" : undefined}
              >
                <MoreVert fontSize="small" />
              </IconButton>
              <Menu
                id="column-menu"
                anchorEl={menuAnchorEl}
                open={menuOpen}
                onClose={handleMenuClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                {/* <MenuItem onClick={handleRenameClick}>Rename Column</MenuItem> */}
                <MenuItem
                  onClick={handleDeleteClick}
                  sx={{ color: "error.main" }}
                >
                  Delete Column
                </MenuItem>
              </Menu>
            </div>
          </>
        )}
      </ColumnHeader>

      <Droppable droppableId={title}>
        {(provided) => (
          <TaskList ref={provided.innerRef} {...provided.droppableProps}>
            {tasks.length > 0 ? (
              tasks.map((task, index) => {
                const taskId =
                  task._id?.toString() ||
                  task.id?.toString() ||
                  index.toString();
                return <TaskCard key={taskId} task={task} index={index} />;
              })
            ) : (
              <EmptyMessage>No tasks in this column</EmptyMessage>
            )}
            {provided.placeholder}
          </TaskList>
        )}
      </Droppable>
    </Column>
  );
};

export default KanbanColumn;
