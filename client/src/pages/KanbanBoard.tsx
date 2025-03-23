/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { useParams, useNavigate } from "react-router-dom";
import { Search, Plus, Filter } from "lucide-react";
import KanbanColumn from "../components/KanbanColumn";
import { useKanban } from "../context/KanbanContext";
import {
  BoardContainer,
  ColumnsContainer,
} from "../components/styled/KanbanElemnets";
import { fetchBoardById, updateBoard } from "../services/api";
import AddColumnDialog from "../components/AddColumnDialog";

import {
  Button as MuiButton,
  TextField,
  InputAdornment,
  Menu,
  Avatar,
  Box,
} from "@mui/material";
import {
  PageContainer,
  ContentContainer,
  BoardHeader,
  BoardTitle,
  HeaderContent,
  MemberAvatarGroup,
  MemberCount,
  ActionButtons,
  SearchFilterContainer,
  SearchContainer,
  CircularProgress,
  LoadingContainer,
  ErrorContainer,
  ErrorMessage,
  FilterMenuPaper,
  FilterMenuItem,
} from "../components/styled/BoardDetailElements";
import styled from "styled-components";
import { useToast } from "../context/ToastProvider";
import AddTaskDialog from "../components/AddTaskDialog";
import InviteUserDialog from "../components/InviteUserDialog";
import { useAuth } from "../context/AuthContext";
import { ITask } from "../types/kanban";
import SomethingWentWrong from "../components/Error";
import { th } from "date-fns/locale";

export const ActionButton = styled(MuiButton)`
  &.MuiButton-root {
    background-color: black;
    color: white;
    text-transform: none;
    border-radius: 8px;
    font-weight: 500;
    font-size: 0.875rem;
    padding: 6px 12px;

    .MuiButton-startIcon {
      margin-right: 4px;
    }
  }
`;

const StyledTextField = styled(TextField)`
  .MuiOutlinedInput-root {
    border-radius: 8px;
    background-color: white;
    padding-left: 4px;

    .MuiOutlinedInput-input {
      padding: 10px 14px 10px 8px;
      font-size: 0.875rem;
    }

    &:hover .MuiOutlinedInput-notchedOutline {
      border-color: black;
    }

    &.Mui-focused .MuiOutlinedInput-notchedOutline {
      border-color: black;
      border-width: 1.2px;
    }
  }

  .MuiInputLabel-root {
    &.Mui-focused {
      color: black;
    }
  }
`;

const lightColorsThatGoWellWithWhite = [
  "#FAD02E", // Light Yellow
  "#FF6F61", // Light Coral
  "#E2A7FF", // Light Purple
  "#A3D9B1", // Light Green
  "#9FE2BF", // Light Turquoise
];

// Function to generate a consistent color based on userId
const getUserColor = (userId: string) => {
  // Create a hash from the userId (or you can use other unique user attributes like email)
  const hash = Array.from(userId).reduce(
    (acc, char) => acc + char.charCodeAt(0),
    0
  );

  // Get a color index from the hash
  const colorIndex = hash % lightColorsThatGoWellWithWhite.length;

  return lightColorsThatGoWellWithWhite[colorIndex];
};

export const UserAvatar = styled(Avatar)<{ userId: string }>`
  border: 1px solid #fff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  background-color: ${({ userId }) => getUserColor(userId)} !important;
`;

const BoardDetail: React.FC = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    tasks,
    users,
    error,
    currentBoard,
    setCurrentBoard,
    updateTask,
    addTask,
    addColumn,
    getTasksByStatus,
  } = useKanban();
  const { showToast: toast } = useToast();

  const [initialLoading, setInitialLoading] = useState(true);
  const [isAddTaskDialogOpen, setIsAddTaskDialogOpen] = useState(false);
  const [isAddColumnDialogOpen, setIsAddColumnDialogOpen] = useState(false);
  const [isInviteUserDialogOpen, setIsInviteUserDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("To Do");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const loadBoard = async () => {
    if (!boardId) {
      navigate("/");
      return;
    }

    try {
      const board = await fetchBoardById(boardId);
      if (board) {
        if (board.adminId !== user.id && !board.acceptedUserIds?.includes(user.id)) {
          navigate("/dashboard");
          toast("You are not authorized to view this board.", "error");
          return;
        }
        setCurrentBoard(board);
      } else {
        navigate("/dashboard");
        toast("Board not found. Please try again.", "error");
      }
    } catch (err) {
      console.error("Error loading board:", err);
      navigate("/dashboard");
      toast("Failed to load board. Please try again.", "error");
    } finally {
      setInitialLoading(false);
    }
  };
  useEffect(() => {
    loadBoard();

    // Cleanup
    return () => {
      setCurrentBoard(null);
    };
  }, [boardId, navigate, setCurrentBoard]);

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // Dropped outside the list
    if (!destination) {
      return;
    }

    // Dropped in the same place
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Update the task status
    const task = tasks.find(
      (t) => (t._id?.toString() || t.id?.toString()) === draggableId
    );
    if (task) {
      await updateTask(draggableId, {
        status: destination.droppableId as "To Do" | "In Progress" | "Done",
      });
    }
  };

  const handleOpenAddTaskDialog = (status?: string) => {
    setSelectedStatus(status || currentBoard?.columns?.[0]?.name || "To Do");
    setIsAddTaskDialogOpen(true);
  };

  const handleAddTask = async (taskData: any) => {
    const newTask = await addTask(taskData);
    if (newTask) {
      setIsAddTaskDialogOpen(false);
    }
  };

  const handleAddColumn = async (columnName: string) => {
    if (!boardId) return;
    await addColumn(boardId, columnName);
    setIsAddColumnDialogOpen(false);
  };

  const handleInviteUsers = async (selectedUsers: any) => {
    if (!currentBoard) return;

    try {
      await updateBoard(currentBoard?.id || currentBoard._id, {
        invitedUserIds: [
          ...currentBoard.invitedUserIds,
          ...selectedUsers.map((user: any) => user.id),
        ],
      });
      loadBoard();
      toast("Users invited successfully!", "success");
    } catch (error) {
      console.error("Error inviting users:", error);
      toast("Failed to invite users. Please try again.", "error");
      throw new Error("Failed to invite users");
    }
  };

  const getFilteredTasksByStatus = (status: string, tasks: ITask[]) => {
    let filteredTasks = getTasksByStatus(status, tasks);

    // Apply search filter
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filteredTasks = filteredTasks.filter(
        (task) =>
          task.title.toLowerCase().includes(query) ||
          (task.description && task.description.toLowerCase().includes(query))
      );
    }

    // Apply priority filter
    if (priorityFilter) {
      filteredTasks = filteredTasks.filter(
        (task) => task.priority === priorityFilter
      );
    }

    return filteredTasks;
  };

  const getBoardMembers = () => {
    if (!currentBoard) return [];

    // Combine invited and accepted users
    const memberIds = [
      ...(currentBoard.acceptedUserIds || []),
      currentBoard.adminId,
    ];
    // Remove duplicates
    const uniqueMemberIds = [...new Set(memberIds)];
    return users.filter((user) =>
      uniqueMemberIds.includes(user.id || user.userId)
    );
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterByPriority = (priority: string | null) => {
    setPriorityFilter(priority);
  };

  if (initialLoading) {
    return (
      <PageContainer>
        {/* <Header /> */}
        <LoadingContainer>
          <CircularProgress sx={{ color: "black" }} />
        </LoadingContainer>
      </PageContainer>
    );
  }

  if (error || !currentBoard) {
    return (
      <PageContainer>
        {/* <Header /> */}
        <ErrorContainer>
          <SomethingWentWrong />
          <ActionButton
            variant="contained"
            onClick={() => navigate("/dashboard")}
            sx={{
              marginTop: "10px",
              bgcolor: "black",
              "&:hover": { bgcolor: "black" },
            }}
          >
            Back to Dashboard
          </ActionButton>
        </ErrorContainer>
      </PageContainer>
    );
  }

  return (
    <BoardContainer>
      <ContentContainer>
        <BoardHeader>
          <HeaderContent>
            <Box sx={{ gap: "20px", display: "flex", alignItems: "center" }}>
              <BoardTitle variant="h5">{currentBoard.name}</BoardTitle>
              <MemberAvatarGroup>
                {getBoardMembers()
                  .slice(0, 3)
                  .map((user) => (
                    <UserAvatar
                      userId={user.id || user.userId}
                      key={user.userId}
                      src={user.name || user.email}
                      alt={user.name || user.email}
                    />
                  ))}
                {getBoardMembers().length > 3 && (
                  <MemberCount>+{getBoardMembers().length - 3}</MemberCount>
                )}
              </MemberAvatarGroup>
            </Box>

            <div className="flex items-center gap-3">
              <ActionButtons>
                <ActionButton
                  variant="outlined"
                  startIcon={<Plus size={16} />}
                  onClick={() => handleOpenAddTaskDialog()}
                >
                  Add Task
                </ActionButton>

                <ActionButton
                  variant="outlined"
                  startIcon={<Plus size={16} />}
                  onClick={() => setIsAddColumnDialogOpen(true)}
                >
                  Add Column
                </ActionButton>
                {user.id === currentBoard.adminId && (
                  <ActionButton
                    variant="outlined"
                    startIcon={<Plus size={16} />}
                    onClick={() => setIsInviteUserDialogOpen(true)}
                  >
                    Invite User
                  </ActionButton>
                )}
              </ActionButtons>
            </div>
          </HeaderContent>

          <SearchFilterContainer>
            <SearchContainer>
              <StyledTextField
                fullWidth
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={handleSearchChange}
                variant="outlined"
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{ marginLeft: "5px" }}>
                      <Search size={18} color="#adb5bd" />
                    </InputAdornment>
                  ),
                }}
              />
            </SearchContainer>

            <ActionButton
              variant="outlined"
              startIcon={<Filter size={16} />}
              onClick={handleClick}
            >
              Filters
            </ActionButton>

            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              PaperProps={{ component: FilterMenuPaper }}
            >
              <FilterMenuItem
                $selected={priorityFilter === "high"}
                onClick={() =>
                  handleFilterByPriority(
                    priorityFilter === "high" ? null : "high"
                  )
                }
              >
                High Priority
              </FilterMenuItem>
              <FilterMenuItem
                $selected={priorityFilter === "medium"}
                onClick={() =>
                  handleFilterByPriority(
                    priorityFilter === "medium" ? null : "medium"
                  )
                }
              >
                Medium Priority
              </FilterMenuItem>
              <FilterMenuItem
                $selected={priorityFilter === "low"}
                onClick={() =>
                  handleFilterByPriority(
                    priorityFilter === "low" ? null : "low"
                  )
                }
              >
                Low Priority
              </FilterMenuItem>
              {priorityFilter && (
                <FilterMenuItem onClick={() => handleFilterByPriority(null)}>
                  Clear Filter
                </FilterMenuItem>
              )}
            </Menu>

            {/* <ActionButton
              variant="outlined"
              startIcon={<SortDesc size={16} />}
              onClick={() => refreshData()}
            >
              Sort
            </ActionButton> */}
          </SearchFilterContainer>

          {/* {showFilters && (
            <FilterContainer>
              <FilterTitle>Filter by Priority</FilterTitle>
              <div className="flex gap-2">
                <PriorityFilterChip
                  label="High"
                  $priority="high"
                  $selected={priorityFilter === "high"}
                  onClick={() =>
                    handleFilterByPriority(
                      priorityFilter === "high" ? null : "high"
                    )
                  }
                  clickable
                />
                <PriorityFilterChip
                  label="Medium"
                  $priority="medium"
                  $selected={priorityFilter === "medium"}
                  onClick={() =>
                    handleFilterByPriority(
                      priorityFilter === "medium" ? null : "medium"
                    )
                  }
                  clickable
                />
                <PriorityFilterChip
                  label="Low"
                  $priority="low"
                  $selected={priorityFilter === "low"}
                  onClick={() =>
                    handleFilterByPriority(
                      priorityFilter === "low" ? null : "low"
                    )
                  }
                  clickable
                />
                {priorityFilter && (
                  <FilterChip
                    label="Clear"
                    variant="outlined"
                    onClick={() => handleFilterByPriority(null)}
                    clickable
                  />
                )}
              </div>
            </FilterContainer>
          )} */}
        </BoardHeader>

        <DragDropContext onDragEnd={handleDragEnd}>
          <ColumnsContainer>
            {currentBoard.columns &&
              currentBoard.columns.length > 0 &&
              currentBoard.columns.map((column) => (
                <KanbanColumn
                  key={column.id} // Use column ID as the key
                  title={column.name} // Use column name
                  columnId={column.id}
                  tasks={getFilteredTasksByStatus(column.name, tasks)}
                  users={users}
                  boardId={boardId || ""}
                  onAddTask={handleOpenAddTaskDialog}
                />
              ))}
          </ColumnsContainer>
        </DragDropContext>
      </ContentContainer>

      {isAddTaskDialogOpen && (
        <AddTaskDialog
          open={isAddTaskDialogOpen}
          onClose={() => setIsAddTaskDialogOpen(false)}
          onAddTask={handleAddTask}
          users={users}
          board={currentBoard}
          boardId={boardId || ""}
          defaultStatus={selectedStatus}
        />
      )}

      {isAddColumnDialogOpen && (
        <AddColumnDialog
          open={isAddColumnDialogOpen}
          onClose={() => setIsAddColumnDialogOpen(false)}
          onAddColumn={handleAddColumn}
        />
      )}

      {isInviteUserDialogOpen && (
        <InviteUserDialog
          open={isInviteUserDialogOpen}
          onInviteUsers={handleInviteUsers}
          onClose={() => setIsInviteUserDialogOpen(false)}
          board={currentBoard}
          users={users}
          userId={user.id}
        />
      )}
    </BoardContainer>
  );
};

export default BoardDetail;
