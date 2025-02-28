import Task, { ITask } from "./tasks.model";

class TaskService {

  /**
   
Create a new task in the database*/
public async createNewTask(taskData: Partial<ITask>): Promise<ITask> {
  try {
    const task = new Task(taskData);
    return await task.save();} catch (error: any) {
    throw new Error("Error creating task: " + error.message);}}
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
}

export default TaskService;