/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { IBoard, ITask, IUser } from '../types/kanban';
import { useToast } from './ToastProvider';
import { 
  fetchBoards, 
  fetchTasks, 
  fetchUsers, 
  updateTaskStatus,
  createTask,
  updateBoard
} from '../services/api';

interface KanbanContextType {
  boards: IBoard[];
  tasks: ITask[];
  users: IUser[];
  loading: boolean;
  error: string | null;
  currentBoard: IBoard | null;
  setCurrentBoard: (board: IBoard | null) => void;
  refreshData: () => Promise<void>;
  updateTask: (taskId: string, updates: Partial<ITask>) => Promise<void>;
  addTask: (taskData: Partial<ITask>) => Promise<ITask | null>;
  addColumn: (boardId: string, columnName: string) => Promise<void>;
  getTasksByStatus: (status: string) => ITask[];
  getUserById: (userId: string) => IUser | undefined;
}

const KanbanContext = createContext<KanbanContextType | undefined>(undefined);

export const KanbanProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [boards, setBoards] = useState<IBoard[]>([]);
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [users, setUsers] = useState<IUser[]>([]);
  const [currentBoard, setCurrentBoard] = useState<IBoard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { showToast: toast } = useToast();

  const refreshData = async () => {
    setLoading(true);
    setError(null);
    try {
      const boardId = currentBoard?._id?.toString() || currentBoard?.id?.toString();
      console.log("Current board ID for refresh:", boardId);
      
      // Fetch boards and users in parallel
      const [boardsData, usersData] = await Promise.all([
        fetchBoards(),
        fetchUsers(),
      ]);
      
      setBoards(boardsData);
      setUsers(usersData);
      
      // Only fetch tasks if we have a current board
      if (boardId) {
        console.log("Fetching tasks for board ID:", boardId);
        const tasksData = await fetchTasks(boardId);
        console.log("Received tasks:", tasksData);
        
        if (Array.isArray(tasksData)) {
          setTasks(tasksData);
        } else {
          console.error("Tasks data is not an array:", tasksData);
          setTasks([]);
        }
      } else {
        console.log("No current board ID, not fetching tasks");
        setTasks([]);
      }
    } catch (err) {
      console.error("Error in refreshData:", err);
      setError('Failed to fetch data');
      toast("Failed to fetch data. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentBoard) {
      console.log("Board changed, refreshing data for:", currentBoard.name);
      console.log("Board ID:", currentBoard._id || currentBoard.id);
    }
    refreshData();
  }, [currentBoard?._id, currentBoard?.id]);

  const updateTask = async (taskId: string, updates: Partial<ITask>) => {
    try {
      // Optimistic update
      setTasks(currentTasks => 
        currentTasks.map(task => 
          (task._id === taskId || task.id === taskId) ? { ...task, ...updates } : task
        )
      );
      
      // API call
      if (updates.status) {
        const updatedTask = await updateTaskStatus(taskId, updates.status);
        if (!updatedTask) {
          throw new Error('Failed to update task status');
        }
      }
      
      toast("Task updated successfully.", "success", "");

    } catch (err: any) {
      toast(`Failed to update task. ${err.message}`, "error");
      // Revert optimistic update
      refreshData();
    }
  };


  const addTask = async (taskData: Partial<ITask>): Promise<ITask | null> => {
    try {
      const newTask = await createTask(taskData);
      if (newTask) {
        setTasks(currentTasks => [...currentTasks, newTask]);

        toast(`Task created successfully`, "success", "Task added");

        return newTask;
      }
      throw new Error('Failed to create task');
    } catch (err: any) {
      toast(`Failed to create task. ${err.message}`, "error");
      return null;
    }
  };

  const addColumn = async (boardId: string, columnName: string) => {
    try {
      if (!currentBoard) return;
      
      // Optimistic update
      const updatedColumnNames = [...currentBoard.columnNames, columnName];
      setCurrentBoard(prev => prev ? { ...prev, columnNames: updatedColumnNames } : null);
      
      // API call
      const updatedBoard = await updateBoard(boardId, { columnNames: updatedColumnNames });
      
      if (!updatedBoard) {
        throw new Error('Failed to add column');
      }
      
      toast(`New column "${columnName}" has been added to the board`, "success", "Column added");

    } catch (err: any) {
      toast(`Failed to add column. ${err.message}`, "error");
      // Revert optimistic update
      refreshData();
    }
  };

  const getTasksByStatus = (status: string) => {
    const boardId = currentBoard?._id?.toString() || currentBoard?.id?.toString();
    console.log(`Filtering tasks for status: ${status}, board: ${boardId}`);
    console.log(`Total tasks: ${tasks.length}`);
    
    const filteredTasks = tasks.filter(task => {
      const taskBoardId = task.boardOriginalId?.toString();
      const matchesStatus = task.status === status;
      const matchesBoard = !boardId || taskBoardId === boardId;
      
      console.log(`Task: ${task.title}, Status: ${task.status}, BoardId: ${taskBoardId}`);
      console.log(`Matches: ${matchesStatus && matchesBoard}`);
      
      return matchesStatus && matchesBoard;
    });
    
    console.log(`Filtered tasks for ${status}:`, filteredTasks.length);
    return filteredTasks;
  };

  const getUserById = (userId: string) => {
    return users.find(user => user.userId === userId);
  };

  const value = {
    boards,
        tasks,
        users,
        loading,
        error,
        currentBoard,
        setCurrentBoard,
        refreshData,
        updateTask,
        addTask,
        addColumn,
        getTasksByStatus,
        getUserById,
  };

  return <KanbanContext.Provider value={value}>{children}</KanbanContext.Provider>;
};

export const useKanban = (): KanbanContextType => {
  const context = useContext(KanbanContext);
  if (context === undefined) {
    throw new Error('useKanban must be used within a KanbanProvider');
  }
  return context;
};
