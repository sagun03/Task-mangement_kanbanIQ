import React, { useState } from "react";
import { Droppable } from "@hello-pangea/dnd";
import styled from "styled-components";
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { Column } from "../types/kanban";
import { useKanban } from "../context/KanbanContext";
import { Add, Close, MoreVert } from "@mui/icons-material";
import DraggableTaskCard from "./DraggableTaskCard";

interface DroppableColumnProps {
  column: Column;
  index: number;
  onAddTask: () => void;
}

const ColumnHeader = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const ColumnTitle = styled(Typography)`
  font-weight: 600;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
`;

const TaskCount = styled(Typography)`
  margin-left: 8px;
  font-size: 0.75rem;
  font-weight: normal;
  color: #666;
`;
const EditContainer = styled(Box)`
  display: flex;
  gap: 4px;
  width: 100%;
`;

const ColumnContainer = styled(Paper)`
  display: flex;
  flex-direction: column;
  min-width: 280px;
  max-width: 400px;
  background: #f8fafa;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 8px;
  flex: 1;

  .kanban-column {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  h3 {
    margin: 0;
    padding: 8px 0;
    font-size: 14px;
  }

  /* Add animation classes */
  .animate-fade-in {
    animation: fadeIn 0.4s ease-in-out forwards;
    opacity: 0;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const ColumnContainer2 = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const TasksContainer = styled(Box)<{ isDraggingOver: boolean }>`
  flex: 1;
  z-index: 1 !important;
  transition: background-color 0.2s ease;
  min-height: 200px;
  border-radius: 4px;
  padding: 4px 0;
  background-color: ${(props) =>
    props.isDraggingOver ? "#f0f0f0" : "transparent"};
`;

const AddTaskButton = styled(Box)`
  display: flex;
  align-items: center;
  margin-top: 16px;
  color: #666;
  cursor: pointer;
  font-size: 0.875rem;
  padding: 6px;
  border-radius: 4px;
  transition: background-color 0.2s ease, color 0.2s ease;

  &:hover {
    background-color: #f0f0f0; /* Light hover effect */
    color: #000; /* Darker text on hover */
  }
`;

const DroppableColumn: React.FC<DroppableColumnProps> = ({
  column,
  index,
  onAddTask,
}) => {
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const { deleteColumn, updateColumn, getTasksByColumn, getFilteredTasks } =
    useKanban();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(column.title);
  const menuOpen = Boolean(menuAnchorEl);

  const handleSaveTitle = () => {
    if (title.trim()) {
      updateColumn(column.id, title);
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSaveTitle();
    } else if (e.key === "Escape") {
      setTitle(column.title);
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
    deleteColumn(column.id);
    handleMenuClose();
  };

  const tasks = getTasksByColumn(column.id);
  console.log("tasks>>>>>", tasks);
  const filteredTasksObj = getFilteredTasks();

  // Filter tasks based on the search and filters
  const filteredTasks = tasks.filter((task) => filteredTasksObj[task.id]);

  return (
    <ColumnContainer>
      <ColumnContainer2
        className="animate-fade-in"
        style={{ animationDelay: `${index * 100}ms` }}
      >
        <ColumnHeader>
          {isEditing ? (
            <EditContainer>
              <TextField
                value={title}
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
                  setTitle(column.title);
                  setIsEditing(false);
                }}
              >
                <Close fontSize="small" />
              </IconButton>
            </EditContainer>
          ) : (
            <>
              <ColumnTitle variant="subtitle2">
                {column.title}
                <TaskCount variant="caption">{filteredTasks.length}</TaskCount>
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
                  <MenuItem onClick={handleRenameClick}>Rename Column</MenuItem>
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
        <Droppable droppableId={column.id}>
          {(provided, snapshot) => (
            <TasksContainer
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={snapshot.isDraggingOver ? "isDraggingOver" : ""}
              isDraggingOver={snapshot.isDraggingOver}
            >
              {filteredTasks.map((task, index) => (
                <DraggableTaskCard index={index} key={index} task={task} />
              ))}
              {provided.placeholder}
            </TasksContainer>
          )}
        </Droppable>

        <AddTaskButton onClick={onAddTask}>
          <Add fontSize="small" sx={{ marginRight: 1 }} />
          Add a task
        </AddTaskButton>
      </ColumnContainer2>
    </ColumnContainer>
  );
};

export default DroppableColumn;
