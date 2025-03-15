
import { IBoard, ITask, IUser } from '../types/kanban';

const API_URL = 'http://localhost:8080/api';

export const fetchBoards = async (): Promise<IBoard[]> => {
  try {
    const response = await fetch(`${API_URL}/boards`);
    if (!response.ok) {
      throw new Error('Failed to fetch boards');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching boards:', error);
    return [];
  }
};

export const fetchBoardById = async (boardId: string): Promise<IBoard | null> => {
  try {
    const response = await fetch(`${API_URL}/boards/${boardId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch board');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching board ${boardId}:`, error);
    return null;
  }
};

export const fetchTasks = async (boardId?: string): Promise<ITask[]> => {
  try {
    if (boardId) {
      // Use the dedicated endpoint for fetching tasks by board ID
      const url = `${API_URL}/tasks/fetchByBoardId/${boardId}`;
      console.log("Fetching tasks with URL:", url);
      
      const response = await fetch(url);
      if (!response.ok) {
        console.error(`Failed to fetch tasks for board. Status: ${response.status}`);
        throw new Error('Failed to fetch tasks for board');
      }
      
      const tasks = await response.json();
      console.log("API returned tasks for board:", tasks);
      return tasks;
    } else {
      // Fetch all tasks if no boardId is provided
      const response = await fetch(`${API_URL}/tasks`);
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      
      return await response.json();
    }
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return [];
  }
};

export const fetchUsers = async (): Promise<IUser[]> => {
  try {
    const response = await fetch(`${API_URL}/users`);
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
};

export const updateTaskStatus = async (taskId: string, status: string): Promise<ITask | null> => {
  try {
    const response = await fetch(`${API_URL}/tasks/${taskId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) {
      throw new Error('Failed to update task status');
    }
    return await response.json();
  } catch (error) {
    console.error('Error updating task status:', error);
    return null;
  }
};

export const createTask = async (taskData: Partial<ITask>): Promise<ITask | null> => {
  try {
    const response = await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    });
    if (!response.ok) {
      throw new Error('Failed to create task');
    }
    return await response.json();
  } catch (error) {
    console.error('Error creating task:', error);
    return null;
  }
};

export const updateBoard = async (boardId: string, data: Partial<IBoard>): Promise<IBoard | null> => {
  try {
    const response = await fetch(`${API_URL}/boards/${boardId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to update board');
    }
    return await response.json();
  } catch (error) {
    console.error('Error updating board:', error);
    return null;
  }
};

