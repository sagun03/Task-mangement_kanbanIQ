import express from "express";
import TaskController from "./tasks.controller";

const router = express.Router();
const taskController = TaskController.getInstance();

// Get all tasks
/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Get all tasks
 *     description: Fetches all tasks from the database
 *     tags: [Tasks]
 *     responses:
 *       200:
 *         description: List of tasks
 *       500:
 *         description: Internal server error
 */
router.get("/", async (req, res) => {
  await taskController.getTasks(req, res);
});

// Get a task by ID
/**
 * @swagger
 * /tasks/{id}:
 *   get:
 *     summary: Get a task by ID
 *     description: Fetches a task by its unique ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     responses:
 *       200:
 *         description: Task found
 *       404:
 *         description: Task not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", async (req, res) => {
  await taskController.getTaskById(req, res);
});

// Create a new task
/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create a new task
 *     description: Adds a new task with relevant details
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "New Task"
 *               description:
 *                 type: string
 *                 example: "Task description here"
 *               priority:
 *                 type: string
 *                 enum: [high, medium, low]
 *                 example: "high"
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-02-28T12:00:00Z"
 *               assignedTo:
 *                 type: string
 *                 example: "userId123"
 *               assignedBy:
 *                 type: string
 *                 example: "userId456"
 *               status:
 *                 type: string
 *                 enum: [To Do, In Progress, Done]
 *                 example: "To Do"
 *               createdBy:
 *                 type: string
 *                 example: "adminId789"
 *               boardOriginalId:
 *                 type: string
 *                 example: "board123"
 *     responses:
 *       201:
 *         description: Task created successfully
 *       400:
 *         description: Invalid request body
 *       500:
 *         description: Internal server error
 */
router.post("/", async (req, res) => {
  await taskController.createTask(req, res);
});

// Update an existing task
/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     summary: Update an existing task
 *     description: Modifies an existing task
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Updated Task"
 *               description:
 *                 type: string
 *                 example: "Updated description"
 *               priority:
 *                 type: string
 *                 enum: [high, medium, low]
 *                 example: "medium"
 *               status:
 *                 type: string
 *                 enum: [To Do, In Progress, Done]
 *                 example: "In Progress"
 *               assignedTo:
 *                 type: string
 *                 example: "userId999"
 *               assignedBy:
 *                 type: string
 *                 example: "userId888"
 *               createdBy:
 *                 type: string
 *                 example: "adminId789"
 *               boardOriginalId:
 *                 type: string
 *                 example: "board123"
 *     responses:
 *       200:
 *         description: Task updated successfully
 *       404:
 *         description: Task not found
 *       500:
 *         description: Internal server error
 */
router.put("/:id", async (req, res) => {
  await taskController.updateTask(req, res);
});

// Delete a task
/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Delete a task
 *     description: Removes a task from the database
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *       404:
 *         description: Task not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", async (req, res) => {
  await taskController.deleteTask(req, res);
});

// Fetch tasks based on an array of task IDs
/**
 * @swagger
 * /tasks/fetchByIds:
 *   post:
 *     summary: Fetch tasks based on an array of IDs
 *     description: Fetches tasks whose IDs match any of the provided IDs
 *     tags: [Tasks]
 *     parameters:
 *       - in: query
 *         name: ids
 *         required: true
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *           example: ["taskId123", "taskId456", "taskId789"]
 *     responses:
 *       200:
 *         description: List of tasks found
 *       400:
 *         description: Invalid request query
 *       404:
 *         description: Tasks not found
 *       500:
 *         description: Internal server error
 */
router.post("/fetchByIds", async (req, res) => {
  await taskController.getTasksByIds(req, res);
});

export default router;
