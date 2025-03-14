import { UserService } from "../user/user.service";
import Task, { ITask } from "./tasks.model";
import EmailService from "../email/email.service";
import BoardService from "../boards/boards.service";

class TaskService {
  private userService: UserService;
  private boardService: BoardService;
  private emailService: EmailService;

  constructor() {
    this.userService = new UserService();
    this.boardService = new BoardService();
    this.emailService = new EmailService();
  }

  public async getAllTasks(): Promise<ITask[]> {
    try {
      return await Task.find();
    } catch (error: any) {
      throw new Error("Error fetching tasks: " + error.message);
    }
  }

  public async getTaskById(id: string): Promise<ITask | null> {
    try {
      return await Task.findById(id);
    } catch (error: any) {
      throw new Error("Error fetching task by ID: " + error.message);
    }
  }

  public async getTasksByIds(ids: string[]): Promise<ITask[]> {
    try {
      return await Task.find({ id: { $in: ids } });
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

      const assignedUser = await this.userService.getUserById(task.assignedTo);
      const assignedByUser = await this.userService.getUserById(
        task.assignedBy
      );

      // Fetch the admin for the board
      const adminId = await this.boardService.getAdminIdByBoardId(
        task.boardOriginalId
      );
      const adminUser = adminId
        ? await this.userService.getUserById(adminId)
        : null;

      // Send email to the assigned user
      if (assignedUser) {
        await this.emailService.sendEmail(
          assignedUser.email,
          "You have been assigned a new task",
          `You have been assigned a new task: ${task.title}.`
        );
      }

      // Send email to the admin (if found)
      if (adminUser && adminId !== task.assignedBy) {
        await this.emailService.sendEmail(
          adminUser.email,
          "Task assigned to a new user",
          `You have assigned a new task: ${task.title} to ${assignedUser?.email}.`
        );
      }

      // Send email to the assignedBy user (if different from assignedTo)
      if (assignedByUser && task.assignedBy !== task.assignedTo) {
        await this.emailService.sendEmail(
          assignedByUser.email,
          "Task assigned to a new user",
          `You have assigned a new task: ${task.title} to ${assignedUser?.email}.`
        );
      }

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
      const updatedTask = await Task.findByIdAndUpdate(id, updates, {
        new: true,
      });

      if (updatedTask) {
        const assignedUser = await this.userService.getUserById(
          updatedTask.assignedTo
        );
        const assignedByUser = await this.userService.getUserById(
          updatedTask.assignedBy
        );

        // Send email to the assigned user
        if (assignedUser) {
          await this.emailService.sendEmail(
            assignedUser.email,
            "Your task has been updated",
            `Your task "${updatedTask.title}" has been updated.`
          );
        }
        // Send email to the user who assigned the task (if assignedBy is not admin)
        if (
          assignedByUser &&
          updatedTask.assignedBy !== updatedTask.assignedTo
        ) {
          await this.emailService.sendEmail(
            assignedByUser.email,
            "Task updated",
            `You updated the task "${updatedTask.title}" assigned to ${updatedTask.assignedTo}.`
          );
        }

        // Fetch the admin for the board and notify
        const adminId = await this.boardService.getAdminIdByBoardId(
          updatedTask.boardOriginalId
        );

        if (adminId && adminId !== updatedTask.assignedBy) {
          const adminUser = await this.userService.getUserById(adminId);
          if (adminUser) {
            await this.emailService.sendEmail(
              adminUser.email,
              "Task updated",
              `You have updated the task "${updatedTask.title}" assigned to ${updatedTask.assignedTo}.`
            );
          }
        }
      }

      return updatedTask;
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

        // Fetch user details (email) for assignedTo and assignedBy
        const assignedUser = await this.userService.getUserById(
          deletedTask.assignedTo
        );
        const assignedByUser = await this.userService.getUserById(
          deletedTask.assignedBy
        );

        // Send email to the assigned user
        if (assignedUser) {
          await this.emailService.sendEmail(
            assignedUser.email,
            "Task has been deleted",
            `The task "${deletedTask.title}" has been deleted.`
          );
        }

        // Send email to the admin (if assignedBy is not admin)
        if (
          assignedByUser &&
          deletedTask.assignedBy !== deletedTask.assignedTo
        ) {
          await this.emailService.sendEmail(
            assignedByUser.email,
            "Task deleted",
            `You deleted the task "${deletedTask.title}" assigned to ${assignedUser?.email}.`
          );
        }

        // Fetch the admin for the board and notify
        const adminId = await this.boardService.getAdminIdByBoardId(
          deletedTask.boardOriginalId
        );
        if (adminId) {
          const adminUser = await this.userService.getUserById(adminId);

          if (adminUser && adminId !== deletedTask.assignedBy) {
            await this.emailService.sendEmail(
              adminUser.email,
              "Task deleted",
              `The task "${deletedTask.title}" assigned to ${deletedTask.assignedTo} has been deleted.`
            );
          }
        }
      }

      return deletedTask;
    } catch (error: any) {
      throw new Error("Error deleting task: " + error.message);
    }
  }

  /**
   * Send deadline reminder
   */
  public async sendDeadlineReminder(taskId: string): Promise<void> {
    try {
      const task = await Task.findById(taskId);

      if (task) {
        // Send email to the assigned user
        const assignedUser = await this.userService.getUserById(
          task.assignedTo
        );
        if (assignedUser) {
          await this.emailService.sendEmail(
            assignedUser.email,
            "Task Deadline Reminder",
            `Reminder: Your task "${task.title}" is due soon.`
          );
        }
      }
    } catch (error: any) {
      throw new Error("Error sending deadline reminder: " + error.message);
    }
  }

  /**
   * Partially updates task fields
   */
  public async updateTaskFields(
    id: string,
    updates: Partial<ITask>
  ): Promise<ITask | null> {
    try {
      return await Task.findByIdAndUpdate(id, updates, { new: true });
    } catch (error: any) {
      throw new Error("Error updating task fields: " + error.message);
    }
  }

  /**
   * Get tasks by board ID
   */
  public async getTasksByBoardId(boardId: string): Promise<ITask[]> {
    try {
      return await Task.find({ boardOriginalId: boardId });
    } catch (error: any) {
      throw new Error("Error fetching tasks by board ID: " + error.message);
    }
  }
}

export default TaskService;
