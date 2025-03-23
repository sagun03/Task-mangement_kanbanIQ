/* eslint-disable @typescript-eslint/no-explicit-any */

import { IBoard, ITask, IUser } from "../types/kanban";

const API_URL = "http://localhost:8080/api";

export const fetchBoards = async (): Promise<IBoard[]> => {
  try {
    const response = await fetch(`${API_URL}/boards`);
    if (!response.ok) {
      throw new Error("Failed to fetch boards");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching boards:", error);

    throw new Error("Failed to fetch boards");
  }
};

export const fetchBoardById = async (
  boardId: string
): Promise<IBoard | null> => {
  try {
    const response = await fetch(`${API_URL}/boards/${boardId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch board");
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching board ${boardId}:`, error);
    throw new Error("Failed to fetch board");
  }
};

export const fetchAllTasks = async (): Promise<ITask[]> => {
  try {
    const response = await fetch(`${API_URL}/tasks`);
    if (!response.ok) {
      throw new Error("Failed to fetch board");
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching tasks:`, error);
    throw new Error("Failed to fetch tasks");
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
        console.error(
          `Failed to fetch tasks for board. Status: ${response.status}`
        );
        throw new Error("Failed to fetch tasks for board");
      }

      const tasks = await response.json();
      console.log("API returned tasks for board:", tasks);
      return tasks;
    } else {
      // Fetch all tasks if no boardId is provided
      const response = await fetch(`${API_URL}/tasks`);
      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }

      return await response.json();
    }
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw new Error("Failed to fetch tasks");
  }
};

export const fetchTaskById = async (taskId?: string): Promise<ITask | null> => {
  try {
    if (taskId) {
      // Use the dedicated endpoint for fetching tasks by board ID
      const url = `${API_URL}/tasks/${taskId}`;
      console.log("Fetching tasks with URL:", url);

      const response = await fetch(url);
      if (!response.ok) {
        console.error(`Failed to fetch task. Status: ${response.status}`);
        throw new Error("Failed to fetch tasks for board");
      }

      const task = await response.json();
      console.log("API returned task", task);
      return task;
    } else {
      // Fetch all tasks if no boardId is provided
      const response = await fetch(`${API_URL}/tasks`);
      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }

      return await response.json();
    }
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw new Error("Failed to fetch task details");
  }
};

export const fetchUsers = async (): Promise<IUser[]> => {
  try {
    const response = await fetch(`${API_URL}/users`);
    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Failed to fetch users");
  }
};

export const updateTaskDetails = async (
  taskId: string,
  data: Partial<ITask>,
  userId: string
): Promise<ITask | null> => {
  try {
    const response = await fetch(`${API_URL}/tasks/${taskId}/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Failed to update task status");
    }
    return await response.json();
  } catch (error) {
    console.error("Error updating task status:", error);
    throw new Error("Failed to update task details");
  }
};

export const createTask = async (
  taskData: Partial<ITask>
): Promise<ITask | null> => {
  try {
    const response = await fetch(`${API_URL}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(taskData),
    });
    if (!response.ok) {
      throw new Error("Failed to create task");
    }
    return await response.json();
  } catch (error) {
    console.error("Error creating task:", error);
    throw new Error("Failed to create task");
  }
};

export const updateBoard = async (
  boardId: string,
  data: Partial<IBoard>
): Promise<IBoard | null> => {
  try {
    const response = await fetch(`${API_URL}/boards/${boardId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Failed to update board");
    }
    return await response.json();
  } catch (error) {
    console.error("Error updating board:", error);
    throw new Error("Failed to update board");
  }
};

export const removeTask = async (taskId: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/tasks/${taskId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete task");
    }

    return true;
  } catch (error) {
    console.error("Error deleting task:", error);
    throw new Error("Failed to delete task");
  }
};

export const acceptInvitation = async (
  token: string,
  userId: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch(`${API_URL}/boardInvitation/accept`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, userId }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to accept invitation");
    }

    return { success: true, message: data.message };
  } catch (error: any) {
    console.error("Error accepting invitation:", error);
    return {
      success: false,
      message: error.message || "Something went wrong.",
    };
  }
};

export const fetchInvitations = async (
  userId: string
): Promise<{ success: boolean; invitations?: any[]; message?: string }> => {
  try {
    const response = await fetch(
      `${API_URL}/boardInvitation/requests/${userId}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    const data = await response.json();
    console.log("Invitations data:", data);
    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch invitations");
    }

    return { success: true, invitations: data };
  } catch (error: any) {
    console.error("Error fetching invitations:", error);
    return {
      success: false,
      message: error.message || "Something went wrong.",
    };
  }
};
