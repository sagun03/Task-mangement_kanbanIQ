import { UserService } from "../user/user.service";
import Task, { ITask } from "./tasks.model";
import EmailService from "../email/email.service";
import BoardService from "../boards/boards.service";
import { sendMessage } from "../kafka/kafkaProducer";

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

  public generateEmailTemplate = (
    recipientName: string,
    subject: string,
    message: string,
    taskUrl?: string,
    boardUrl?: string
  ) => `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>${subject}</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #F9FAFB;
        margin: 0;
        padding: 20px;
      }
      .container {
        max-width: 600px;
        background: #F9FAFB;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        text-align: center;
        margin: auto;
      }
      .header {
        font-size: 24px;
        color: #333;
        margin-bottom: 20px;
      }
      .content {
        font-size: 16px;
        color: #555;
        margin-bottom: 20px;
      }
      .button {
        display: inline-block;
        padding: 12px 20px;
        background-color: black;
        color: white !important;
        text-decoration: none;
        border-radius: 5px;
        font-size: 16px;
        font-weight: bold;
      }
      .button:hover {
        background-color: #222;
      }
      .footer {
        font-size: 12px;
        color: #777;
        margin-top: 20px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">${subject}</div>
      <div class="content">
        <p>Hi <strong>${recipientName}</strong>,</p>
        <p>${message}</p>
        <p>Click the button below to ${
          taskUrl ? "view the task" : "view the board"
        }:</p>
        <a href="${taskUrl || boardUrl}" class="button">View Task</a>
      </div>
      <div class="footer">
        <p>Need help? Contact us at <a href="mailto:kanbaniq@gmail.com">support@kanbaniq.com</a></p>
        <p>© 2025 KanbanIQ. All rights reserved.</p>
      </div>
    </div>
  </body>
  </html>`;

  public async getTaskById(id: string): Promise<ITask | null> {
    try {
      const task = await Task.findById(id).lean();
      if (!task) {
        return null;
      }
      const assignedToUser = task.assignedTo
        ? await this.userService.getUserById(task.assignedTo)
        : null;
      const assignedByUser = task.assignedBy
        ? await this.userService.getUserById(task.assignedBy)
        : null;
      const createdByUser = task.createdBy
        ? await this.userService.getUserById(task.createdBy)
        : null;

      const updatedTask = {
        ...task,
        assignedToEmail: assignedToUser?.email ?? undefined, // Ensure undefined instead of null
        assignedByEmail: assignedByUser?.email ?? undefined,
        createdByEmail: createdByUser?.email ?? undefined,
      } as ITask;
      return updatedTask;
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
      const taskUrl = `${process.env.FRONTEND_URL}/kanban-board/tasks/${savedTask.id}`;

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
        const emailContent = this.generateEmailTemplate(
          assignedUser?.name || assignedUser?.email,
          "You have been assigned a new task",
          `You have been assigned a new task: <strong>"${task.title}"</strong>.`,
          taskUrl
        );
        await this.emailService.sendEmail(
          assignedUser?.email,
          "You have been assigned a new task",
          `You have been assigned a new task: ${task.title}.`,
          emailContent
        );
      }

      // Send email to the admin (if found)
      if (adminUser && adminId !== task.assignedBy) {
        const emailContent = this.generateEmailTemplate(
          adminUser?.name || adminUser.email,
          "Task assigned to a new user",
          `A new task: <strong>"${
            task.title
          }"</strong> has been assigned to <strong>${
            assignedUser?.name || assignedUser?.email
          }</strong>.`,
          taskUrl
        );
        await this.emailService.sendEmail(
          adminUser.email,
          "Task assigned to a new user",
          `You have assigned a new task: ${task.title} to ${assignedUser?.email}.`,
          emailContent
        );
      }

      // Send email to the assignedBy user (if different from assignedTo)
      if (assignedByUser && task.assignedBy !== task.assignedTo) {
        const emailContent = this.generateEmailTemplate(
          assignedByUser?.name || assignedByUser.email,
          "Task assigned to a new user",
          `You have assigned a new task: <strong>"${
            task.title
          }"</strong> to <strong>${
            assignedUser?.name || assignedUser?.email
          }</strong>.`,
          taskUrl
        );
        await this.emailService.sendEmail(
          assignedByUser.email,
          "Task assigned to a new user",
          `You have assigned a new task: ${task.title} to ${assignedUser?.email}.`,
          emailContent
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

        const taskUrl = `${process.env.FRONTEND_URL}/kanban-board/tasks/${updatedTask.id}`;

        // Send email to the assigned user
        if (assignedUser) {
          const assignedEmailContent = this.generateEmailTemplate(
            assignedUser?.name || assignedUser.email,
            "Your task has been updated",
            `Your task "<strong>${updatedTask.title}</strong>" has been updated.`,
            taskUrl
          );
          await this.emailService.sendEmail(
            assignedUser.email,
            "Your task has been updated",
            `Your task "${updatedTask.title}" has been updated.`,
            assignedEmailContent
          );
        }
        // Send email to the user who assigned the task (if assignedBy is not admin)
        if (
          assignedByUser &&
          updatedTask.assignedBy !== updatedTask.assignedTo
        ) {
          const assignedByEmailContent = this.generateEmailTemplate(
            assignedByUser?.name || assignedByUser.email,
            "Task updated",
            `You updated the task "<strong>${
              updatedTask.title
            }</strong>" assigned to ${
              assignedUser?.name || assignedUser?.email
            }.`,
            taskUrl
          );
          await this.emailService.sendEmail(
            assignedByUser.email,
            "Task updated",
            `You updated the task "${updatedTask.title}" assigned to ${updatedTask.assignedTo}.`,
            assignedByEmailContent
          );
        }

        // Fetch the admin for the board and notify
        const adminId = await this.boardService.getAdminIdByBoardId(
          updatedTask.boardOriginalId
        );

        if (adminId && adminId !== updatedTask.assignedBy) {
          const adminUser = await this.userService.getUserById(adminId);
          if (adminUser) {
            const adminEmailContent = this.generateEmailTemplate(
              adminUser?.name || adminUser.email,
              "Task updated",
              `The task "<strong>${updatedTask.title}</strong>" assigned to ${
                assignedUser?.name || assignedUser?.email
              } has been updated.`,
              taskUrl
            );
            await this.emailService.sendEmail(
              adminUser.email,
              "Task updated",
              `You have updated the task "${updatedTask.title}" assigned to ${updatedTask.assignedTo}.`,
              adminEmailContent
            );
          }
        }
      }

      return updatedTask;
    } catch (error: any) {
      console.log("Error updating task: ", error);
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
        const boardUrl = `${process.env.FRONTEND_URL}/kanban-board/${deletedTask.boardOriginalId}`;

        // Fetch user details (email) for assignedTo and assignedBy
        const assignedUser = await this.userService.getUserById(
          deletedTask.assignedTo
        );
        const assignedByUser = await this.userService.getUserById(
          deletedTask.assignedBy
        );

        // Send email to the assigned user
        if (assignedUser) {
          const emailContent = this.generateEmailTemplate(
            assignedUser?.name || assignedUser.email,
            "Task has been deleted",
            `The task <strong>"${deletedTask.title}"</strong> has been deleted.`,
            undefined,
            boardUrl
          );
          await this.emailService.sendEmail(
            assignedUser.email,
            "Task has been deleted",
            `The task "${deletedTask.title}" has been deleted.`,
            emailContent
          );
        }

        // Send email to the admin (if assignedBy is not admin)
        if (
          assignedByUser &&
          deletedTask.assignedBy !== deletedTask.assignedTo
        ) {
          const emailContent = this.generateEmailTemplate(
            assignedByUser?.name || assignedByUser.email,
            "Task deleted",
            `You deleted the task <strong>"${
              deletedTask.title
            }"</strong> assigned to <strong>${
              assignedUser?.name || assignedUser?.email
            }</strong>.`,
            undefined,
            boardUrl
          );
          await this.emailService.sendEmail(
            assignedByUser.email,
            "Task deleted",
            `You deleted the task "${deletedTask.title}" assigned to ${assignedUser?.email}.`,
            emailContent
          );
        }

        // Fetch the admin for the board and notify
        const adminId = await this.boardService.getAdminIdByBoardId(
          deletedTask.boardOriginalId
        );
        if (adminId) {
          const adminUser = await this.userService.getUserById(adminId);

          if (adminUser && adminId !== deletedTask.assignedBy) {
            const emailContent = this.generateEmailTemplate(
              adminUser?.name || adminUser.email,
              "Task deleted",
              `The task <strong>"${
                deletedTask.title
              }"</strong> assigned to <strong>${
                assignedUser?.name || assignedUser?.email
              }</strong> has been deleted.`,
              undefined,
              boardUrl
            );
            await this.emailService.sendEmail(
              adminUser.email,
              "Task deleted",
              `The task "${deletedTask.title}" assigned to ${deletedTask.assignedTo} has been deleted.`,
              emailContent
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
   * ✅ Partially updates task fields and notifies users
   */
  public async updateTaskFields(
    id: string,
    updates: Partial<ITask>
  ): Promise<ITask | null> {
    try {
      const updatedTask = await Task.findByIdAndUpdate(id, updates, {
        new: true,
      });

      if (updatedTask) {
        // Fetch user details
        const assignedUser = await this.userService.getUserById(
          updatedTask.assignedTo
        );
        const assignedByUser = await this.userService.getUserById(
          updatedTask.assignedBy
        );

        // Task URL for reference
        const taskUrl = `${process.env.FRONTEND_URL}/kanban-board/tasks/${id}`;

        const emailEvents = [];

        // Notify assigned user
        if (assignedUser) {
          const emailContent = this.generateEmailTemplate(
            assignedUser.name || assignedUser.email,
            "Task updated",
            `The task <strong>"${updatedTask.title}"</strong> has been updated.`,
            taskUrl
          );

          // await this.emailService.sendEmail(
          //   assignedUser.email,
          //   "Task updated",
          //   "",
          //   emailContent
          // );
          emailEvents.push({
            to: assignedUser.email,
            subject: "Task updated",
            text: "",
            html: emailContent,
          });
        }

        // Notify assignedBy user (if different from assignedTo)
        if (
          assignedByUser &&
          updatedTask.assignedBy !== updatedTask.assignedTo
        ) {
          const emailContent = this.generateEmailTemplate(
            assignedByUser.name || assignedByUser.email,
            "Task updated",
            `You made updates to the task <strong>"${
              updatedTask.title
            }"</strong> assigned to <strong>${
              assignedUser?.name || assignedUser?.email
            }</strong>.`,
            taskUrl
          );

          // await this.emailService.sendEmail(
          //   assignedByUser.email,
          //   "Task updated",
          //   "",
          //   emailContent
          // );
          emailEvents.push({
            to: assignedByUser.email,
            subject: "Task updated",
            text: "",
            html: emailContent,
          });
        }

        // Notify board admin (if applicable)
        const adminId = await this.boardService.getAdminIdByBoardId(
          updatedTask.boardOriginalId
        );
        if (adminId) {
          const adminUser = await this.userService.getUserById(adminId);

          if (adminUser && adminId !== updatedTask.assignedBy) {
            const emailContent = this.generateEmailTemplate(
              adminUser.name || adminUser.email,
              "Task updated",
              `The task <strong>"${updatedTask.title}"</strong> has been updated.`,
              taskUrl
            );

            // await this.emailService.sendEmail(
            //   adminUser.email,
            //   "Task updated",
            //   "",
            //   emailContent
            // );
            emailEvents.push({
              to: adminUser.email,
              subject: "Task updated",
              text: "",
              html: emailContent,
            });
          }
        }
        for (const email of emailEvents) {
          await sendMessage(email);
        }
      }

      return updatedTask;
    } catch (error: any) {
      throw new Error("Error updating task fields: " + error.message);
    }
  }

  /**
   * Get tasks by board ID
   */
  public async getTasksByBoardId(boardId: string): Promise<ITask[]> {
    try {
      const tasks = await Task.find({ boardOriginalId: boardId }).lean(); // Converts documents to plain objects
      console.log("Tasks: ", tasks);
      const updatedTasks: ITask[] = await Promise.all(
        tasks.map(async (task) => {
          const assignedToUser = task.assignedTo
            ? await this.userService.getUserById(task.assignedTo)
            : null;
          const assignedByUser = task.assignedBy
            ? await this.userService.getUserById(task.assignedBy)
            : null;
          const createdByUser = task.createdBy
            ? await this.userService.getUserById(task.createdBy)
            : null;

          return {
            ...task,
            assignedToEmail: assignedToUser?.email ?? undefined, // Ensure undefined instead of null
            assignedByEmail: assignedByUser?.email ?? undefined,
            createdByEmail: createdByUser?.email ?? undefined,
          };
        })
      );

      return updatedTasks;
    } catch (error: any) {
      throw new Error("Error fetching tasks by board ID: " + error.message);
    }
  }
}

export default TaskService;
