
import React, { useEffect, useState } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { useParams, useNavigate } from 'react-router-dom';
import { Search, Plus, Filter, SortDesc } from 'lucide-react';
import KanbanColumn from '../components/KanbanColumn';
import { useKanban } from '../context/KanbanContext';
import { BoardContainer, ColumnsContainer } from '../components/styled/KanbanElemnets';
import { fetchBoardById } from '../services/api';
// import { toast } from '@/hooks/use-toast';
// import AddTaskDialog from '@/components/AddTaskDialog';
// import AddColumnDialog from '@/components/AddColumnDialog';
import { 
  Button as MuiButton,
  IconButton,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  PageContainer,
  ContentContainer,
  BoardHeader,
  BoardTitle,
  HeaderContent,
  MemberAvatarGroup,
  MemberAvatar,
  MemberCount,
  ActionButtons,
  SearchFilterContainer,
  SearchContainer,
  FilterChip,
  FilterContainer,
  FilterTitle,
  CircularProgress,
  LoadingContainer,
  ErrorContainer,
  ErrorMessage
} from '../components/styled/BoardDetailElements';
import styled from 'styled-components';
import { useToast } from '../context/ToastProvider';

const ActionButton = styled(MuiButton)`
  &.MuiButton-root {
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
      border-color: #9b87f5;
    }
    
    &.Mui-focused .MuiOutlinedInput-notchedOutline {
      border-color: #7E69AB;
      border-width: 2px;
    }
  }
  
  .MuiInputLabel-root {
    &.Mui-focused {
      color: #7E69AB;
    }
  }
`;

const PriorityFilterChip = styled(FilterChip)<{ $priority?: 'high' | 'medium' | 'low', $selected?: boolean }>`
  &.MuiChip-root {
    background-color: ${({ $priority, $selected }) => {
      if (!$selected) return '#f8f9fa';
      
      switch ($priority) {
        case 'high':
          return '#ffebee';
        case 'medium':
          return '#fff8e1';
        case 'low':
          return '#e8f5e9';
        default:
          return '#f8f9fa';
      }
    }};
    color: ${({ $priority, $selected }) => {
      if (!$selected) return '#6c757d';
      
      switch ($priority) {
        case 'high':
          return '#d32f2f';
        case 'medium':
          return '#ff8f00';
        case 'low':
          return '#2e7d32';
        default:
          return '#6c757d';
      }
    }};
    border: 1px solid ${({ $priority, $selected }) => {
      if (!$selected) return '#e9ecef';
      
      switch ($priority) {
        case 'high':
          return '#ffcdd2';
        case 'medium':
          return '#ffe082';
        case 'low':
          return '#c8e6c9';
        default:
          return '#e9ecef';
      }
    }};
  }
`;

const BoardDetail: React.FC = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const navigate = useNavigate();
  const { 
    tasks, 
    users, 
    loading, 
    error, 
    currentBoard, 
    setCurrentBoard, 
    updateTask, 
    addTask, 
    addColumn, 
    refreshData,
    getTasksByStatus 
  } = useKanban();
  const { showToast: toast } = useToast();
  
  const [initialLoading, setInitialLoading] = useState(true);
  const [isAddTaskDialogOpen, setIsAddTaskDialogOpen] = useState(false);
  const [isAddColumnDialogOpen, setIsAddColumnDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('To Do');

  useEffect(() => {
    const loadBoard = async () => {
      if (!boardId) {
        navigate('/');
        return;
      }

      try {
        console.log("Loading board with ID:", boardId);
        const board = await fetchBoardById(boardId);
        console.log("Fetched board:", board);
        
        if (board) {
          setCurrentBoard(board);
        } else {
          navigate('/');
          // toast({
          //   title: 'Error',
          //   description: 'Board not found',
          //   variant: 'destructive',
          // });
        }
      } catch (err) {
        console.error('Error loading board:', err);
        navigate('/');
        // toast({
        //   title: 'Error',
        //   description: 'Failed to load board',
        //   variant: 'destructive',
        // });
      } finally {
        setInitialLoading(false);
      }
    };

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
    const task = tasks.find(t => (t._id?.toString() || t.id?.toString()) === draggableId);
    if (task) {
      await updateTask(draggableId, { status: destination.droppableId as "To Do" | "In Progress" | "Done" });
      
      // toast({
      //   title: 'Task updated',
      //   description: `Task moved to ${destination.droppableId}`,
      // });
    }
  };

  const handleOpenAddTaskDialog = (status?: string) => {
    setSelectedStatus(status || (currentBoard?.columnNames?.[0] || 'To Do'));
    setIsAddTaskDialogOpen(true);
  };

  // const handleAddTask = async (taskData: any) => {
  //   const newTask = await addTask(taskData);
  //   if (newTask) {
  //     setIsAddTaskDialogOpen(false);
  //     toast({
  //       title: 'Success',
  //       description: 'Task created successfully',
  //     });
  //   }
  // };

  // const handleAddColumn = async (columnName: string) => {
  //   if (!boardId) return;
    
  //   await addColumn(boardId, columnName);
  //   setIsAddColumnDialogOpen(false);
    
  //   toast({
  //     title: 'Success',
  //     description: 'Column added successfully',
  //   });
  // };

  const getFilteredTasksByStatus = (status: string) => {
    let filteredTasks = getTasksByStatus(status);
    console.log(`Got ${filteredTasks.length} tasks for status ${status}`);
    
    // Apply search filter
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filteredTasks = filteredTasks.filter(task => 
        task.title.toLowerCase().includes(query) || 
        (task.description && task.description.toLowerCase().includes(query))
      );
    }
    
    // Apply priority filter
    if (priorityFilter) {
      filteredTasks = filteredTasks.filter(task => 
        task.priority === priorityFilter
      );
    }
    
    return filteredTasks;
  };

  const getBoardMembers = () => {
    if (!currentBoard) return [];
    
    // Combine invited and accepted users
    const memberIds = [
      ...(currentBoard.invitedUserIds || []),
      ...(currentBoard.acceptedUserIds || []),
      currentBoard.adminId
    ];
    
    // Remove duplicates
    const uniqueMemberIds = [...new Set(memberIds)];
    
    return users.filter(user => uniqueMemberIds.includes(user.userId));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleFilterByPriority = (priority: string | null) => {
    setPriorityFilter(priority);
  };

  if (initialLoading || loading) {
    return (
      <PageContainer>
        {/* <Header /> */}
        <LoadingContainer>
          <CircularProgress />
        </LoadingContainer>
      </PageContainer>
    );
  }

  if (error || !currentBoard) {
    return (
      <PageContainer>
        {/* <Header /> */}
        <ErrorContainer>
          <ErrorMessage>
            {error || 'Board not found'}
          </ErrorMessage>
          <ActionButton
            variant="contained"
            onClick={() => navigate('/')}
            sx={{ bgcolor: '#9b87f5', '&:hover': { bgcolor: '#7E69AB' } }}
          >
            Back to Dashboard
          </ActionButton>
        </ErrorContainer>
      </PageContainer>
    );
  }

  return (
    <BoardContainer>
      {/* <Header 
        title={currentBoard.name || 'KanbanIQ'}
      />
       */}
      <ContentContainer>
        <BoardHeader>
          <HeaderContent>
            <BoardTitle variant="h5">
              {currentBoard.name}
            </BoardTitle>
            
            <div className="flex items-center gap-3">
              <MemberAvatarGroup>
                {getBoardMembers().slice(0, 3).map((user) => (
                  <MemberAvatar
                    key={user.userId}
                    src={user.avatar || `/lovable-uploads/41308400-5b71-42bd-947a-46c5acc6e0ec.png`}
                    alt={user.name || user.email}
                  />
                ))}
                {getBoardMembers().length > 3 && (
                  <MemberCount>
                    +{getBoardMembers().length - 3}
                  </MemberCount>
                )}
              </MemberAvatarGroup>
              
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
                    <InputAdornment position="start">
                      <Search size={18} color="#adb5bd" />
                    </InputAdornment>
                  ),
                }}
              />
            </SearchContainer>
            
            <ActionButton 
              variant="outlined"
              startIcon={<Filter size={16} />}
              onClick={toggleFilters}
            >
              Filters
              {priorityFilter && (
                <FilterChip 
                  label={priorityFilter} 
                  size="small" 
                  sx={{ ml: 1 }}
                />
              )}
            </ActionButton>
            
            <ActionButton 
              variant="outlined"
              startIcon={<SortDesc size={16} />}
              onClick={() => refreshData()}
            >
              Sort
            </ActionButton>
          </SearchFilterContainer>
          
          {showFilters && (
            <FilterContainer>
              <FilterTitle>Filter by Priority</FilterTitle>
              <div className="flex gap-2">
                <PriorityFilterChip 
                  label="High" 
                  $priority="high"
                  $selected={priorityFilter === 'high'}
                  onClick={() => handleFilterByPriority(priorityFilter === 'high' ? null : 'high')}
                  clickable
                />
                <PriorityFilterChip 
                  label="Medium" 
                  $priority="medium"
                  $selected={priorityFilter === 'medium'}
                  onClick={() => handleFilterByPriority(priorityFilter === 'medium' ? null : 'medium')}
                  clickable
                />
                <PriorityFilterChip 
                  label="Low" 
                  $priority="low"
                  $selected={priorityFilter === 'low'}
                  onClick={() => handleFilterByPriority(priorityFilter === 'low' ? null : 'low')}
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
          )}
        </BoardHeader>
        
        <DragDropContext onDragEnd={handleDragEnd}>
          <ColumnsContainer>
            {currentBoard.columnNames && currentBoard.columnNames.length > 0 ? (
              currentBoard.columnNames.map((columnName) => (
                <KanbanColumn
                  key={columnName}
                  title={columnName}
                  tasks={getFilteredTasksByStatus(columnName)}
                  users={users}
                  boardId={boardId || ''}
                  onAddTask={handleOpenAddTaskDialog}
                />
              ))
            ) : (
              <>
                <KanbanColumn
                  title="To Do"
                  tasks={getFilteredTasksByStatus('To Do')}
                  users={users}
                  boardId={boardId || ''}
                  onAddTask={handleOpenAddTaskDialog}
                />
                <KanbanColumn
                  title="In Progress"
                  tasks={getFilteredTasksByStatus('In Progress')}
                  users={users}
                  boardId={boardId || ''}
                  onAddTask={handleOpenAddTaskDialog}
                />
                <KanbanColumn
                  title="Done"
                  tasks={getFilteredTasksByStatus('Done')}
                  users={users}
                  boardId={boardId || ''}
                  onAddTask={handleOpenAddTaskDialog}
                />
              </>
            )}
          </ColumnsContainer>
        </DragDropContext>
      </ContentContainer>
      
      {/* <AddTaskDialog
        open={isAddTaskDialogOpen}
        onClose={() => setIsAddTaskDialogOpen(false)}
        onAddTask={handleAddTask}
        users={users}
        boardId={boardId || ''}
        defaultStatus={selectedStatus}
      />
       */}
      {/* <AddColumnDialog
        open={isAddColumnDialogOpen}
        onClose={() => setIsAddColumnDialogOpen(false)}
        onAddColumn={handleAddColumn}
      /> */}
    </BoardContainer>
  );
};

export default BoardDetail;
