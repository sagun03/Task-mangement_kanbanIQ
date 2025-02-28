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
   
Create a new task*/
public async createTask(req: Request, res: Response) {
  const taskData = req.body;
  try {
    const newTask = await this.taskService.createNewTask(taskData);
    return res.status(201).json(newTask);} catch (error) {
    return res.status(400).json({ message: "Invalid request body" });}}
}

export default TaskController;