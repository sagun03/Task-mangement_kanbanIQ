import { Request, Response } from "express";
import TaskService from "./tasks.service";
import { parseIdsFromQuery } from "../../utils/queryUtils";

class TaskController {
  // Private static instance property
  private static instance: TaskController;
  private taskService: TaskService;

  // Private constructor to prevent instantiation
  private constructor() {
    this.taskService = new TaskService();
  }

  // Get the Singleton instance of the controller
  public static getInstance(): TaskController {
    if (!TaskController.instance) {
      TaskController.instance = new TaskController();
    }
    return TaskController.instance;
  }

  /**
   * Get all tasks
   */
  public async getTasks(req: Request, res: Response) {
    try {
      const tasks = await this.taskService.getAllTasks();
      return res.status(200).json(tasks);
    } catch (error) {
      return res.status(500).json({ message: "Error fetching tasks" });
    }
  }

  /**
   * Get a task by ID
   */
  public async getTaskById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const task = await this.taskService.getTaskById(id);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      return res.status(200).json(task);
    } catch (error) {
      return res.status(500).json({ message: "Error fetching task by ID" });
    }
  }

  /**
   * Get tasks by an array of IDs
   */
  public async getTasksByIds(req: Request, res: Response) {
    const { ids } = req.query;

    // Use the utility function to parse task IDs from query string
    const idsArray = parseIdsFromQuery(ids);
  
    if (idsArray.length === 0) {
      return res.status(400).json({ message: "Invalid or missing 'ids' query parameter" });
    }
  
    try {
      const tasks = await this.taskService.getTasksByIds(idsArray);
      return res.status(200).json(tasks);
    } catch (error) {
      return res.status(500).json({ message: "Error fetching tasks" });
    }
  }

  /**
   * Create a new task
   */
  public async createTask(req: Request, res: Response) {
    const taskData = req.body;
    try {
      const newTask = await this.taskService.createNewTask(taskData);
      return res.status(201).json(newTask);
    } catch (error) {
      return res.status(400).json({ message: "Invalid request body" });
    }
  }

  /**
   * Update an existing task
   */
  public async updateTask(req: Request, res: Response) {
    const { id } = req.params;
    const updates = req.body;
    try {
      const updatedTask = await this.taskService.updateExistingTask(id, updates);
      if (!updatedTask) {
        return res.status(404).json({ message: "Task not found" });
      }
      return res.status(200).json(updatedTask);
    } catch (error) {
      return res.status(500).json({ message: "Error updating task" });
    }
  }

  /**
   * Delete a task by ID
   */
  public async deleteTask(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const deletedTask = await this.taskService.deleteTaskById(id);
      if (!deletedTask) {
        return res.status(404).json({ message: "Task not found" });
      }
      return res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Error deleting task" });
    }
  }

  /**
 * Partially update a task
 */
public async partialUpdateTask(req: Request, res: Response) {
  const { id } = req.params;
  const updates = req.body;
  try {
    const updatedTask = await this.taskService.updateTaskFields(id, updates);
    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    return res.status(200).json(updatedTask);
  } catch (error) {
    return res.status(500).json({ message: "Error updating task" });
  }
}

/**
 * Get tasks by board ID
 */
public async getTasksByBoardId(req: Request, res: Response) {
  const { boardId } = req.params;
  try {
    const tasks = await this.taskService.getTasksByBoardId(boardId);
    return res.status(200).json(tasks);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching tasks by board ID", error });
  }
}
}

export default TaskController;
