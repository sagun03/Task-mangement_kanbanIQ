import { Request, Response } from "express";
import TaskService from "./tasks.service";

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
   
Create a new task*/
public async createTask(req: Request, res: Response) {
  const taskData = req.body;
  try {
    const newTask = await this.taskService.createNewTask(taskData);
    return res.status(201).json(newTask);} catch (error) {
    return res.status(400).json({ message: "Invalid request body" });}}
}

export default TaskController;