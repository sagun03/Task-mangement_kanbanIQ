import Task, { ITask } from "./tasks.model";

class TaskService {

  /**
   
Create a new task in the database*/
public async createNewTask(taskData: Partial<ITask>): Promise<ITask> {
  try {
    const task = new Task(taskData);
    return await task.save();} catch (error: any) {
    throw new Error("Error creating task: " + error.message);}}
}

export default TaskService;