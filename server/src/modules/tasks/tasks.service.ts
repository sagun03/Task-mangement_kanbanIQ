import { UserService } from "../user/user.service";
import Task, { ITask } from "./tasks.model";

class TaskService {
  /**
   * Get all tasks from the database
   */
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  public async getAllTasks(): Promise<ITask[]> {
    try {
      return await Task.find();
    } catch (error: any) {
      throw new Error("Error fetching tasks: " + error.message);
    }
  }

  /**
   * Get a task by ID
   */
  public async getTaskById(id: string): Promise<ITask | null> {
    try {
      return await Task.findById(id);
    } catch (error: any) {
      throw new Error("Error fetching task by ID: " + error.message);
    }
  }

  /**
   * Get tasks by an array of IDs
   */
  public async getTasksByIds(ids: string[]): Promise<ITask[]> {
    try {
      return await Task.find({ 'id': { $in: ids } });
    } catch (error: any) {
      throw new Error("Error fetching tasks by IDs: " + error.message);
    }
  }

/**
   * ✅ Create a new task and update the user's task list
   */
public async createNewTask(taskData: Partial<ITask>): Promise<ITask> {
  try {
    const task = new Task(taskData);
    const savedTask = await task.save();

    // 🔥 Call UserService to add the task ID to the assigned user
    await this.userService.addTaskToUser(task.assignedTo, savedTask.id);

    return savedTask;
  } catch (error: any) {
    throw new Error("Error creating task: " + error.message);
  }
}

  /**
   * Update an existing task
   */
  public async updateExistingTask(
    id: string,
    updates: Partial<ITask>
  ): Promise<ITask | null> {
    try {
      return await Task.findByIdAndUpdate(id, updates, { new: true });
    } catch (error: any) {
      throw new Error("Error updating task: " + error.message);
    }
  }

   /**
   * ✅ Delete a task and update the user's task list
   */
   public async deleteTaskById(id: string): Promise<ITask | null> {
    try {
      const deletedTask = await Task.findByIdAndDelete(id);

      if (deletedTask) {
        // 🔥 Call UserService to remove the task ID from the user
        await this.userService.removeTaskFromUser(deletedTask.assignedTo, id);
      }

      return deletedTask;
    } catch (error: any) {
      throw new Error("Error deleting task: " + error.message);
    }
  }
}

export default TaskService;
