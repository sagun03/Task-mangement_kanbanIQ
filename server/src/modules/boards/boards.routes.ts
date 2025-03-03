import express from "express";
import BoardController from "./boards.controller";

const router = express.Router();
const boardController = BoardController.getInstance();

// Get all boards
/**
 * @swagger
 * /boards:
 *   get:
 *     summary: Get all boards
 *     tags: [Boards]
 *     description: Fetches all boards from the database
 *     responses:
 *       200:
 *         description: List of boards
 *       500:
 *         description: Internal server error
 */
router.get("/", async (req, res) => {
  await boardController.getBoards(req, res);
});

// Get a board by ID
/**
 * @swagger
 * /boards/{id}:
 *   get:
 *     summary: Get a board by ID
 *     tags: [Boards]
 *     description: Fetches a board by its unique ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Board ID
 *     responses:
 *       200:
 *         description: Board found
 *       404:
 *         description: Board not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", async (req, res) => {
  await boardController.getBoardById(req, res);
});

// Create a new board
/**
 * @swagger
 * /boards:
 *   post:
 *     summary: Create a new board
 *     tags: [Boards]
 *     description: Adds a new board with relevant details
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Project Board"
 *               adminId:
 *                 type: string
 *                 example: "userId123"
 *               invitedUserIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "userId456"
 *               columnNames:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "To Do"
 *     responses:
 *       201:
 *         description: Board created successfully
 *       400:
 *         description: Invalid request body
 *       500:
 *         description: Internal server error
 */
router.post("/", async (req, res) => {
  await boardController.createBoard(req, res);
});

// Update an existing board
/**
 * @swagger
 * /boards/{id}:
 *   put:
 *     summary: Update an existing board
 *     tags: [Boards]
 *     description: Modifies an existing board
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Board ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Updated Project Board"
 *               columnNames:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "In Progress"
 *     responses:
 *       200:
 *         description: Board updated successfully
 *       404:
 *         description: Board not found
 *       500:
 *         description: Internal server error
 */
router.put("/:id", async (req, res) => {
  await boardController.updateBoard(req, res);
});

// Delete a board
/**
 * @swagger
 * /boards/{id}:
 *   delete:
 *     summary: Delete a board
 *     tags: [Boards]
 *     description: Removes a board from the database
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Board ID
 *     responses:
 *       200:
 *         description: Board deleted successfully
 *       404:
 *         description: Board not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", async (req, res) => {
  await boardController.deleteBoard(req, res);
});

/**
 * @swagger
 * /boards/fetchByIds:
 *   get:
 *     summary: Fetch boards based on an array of IDs
 *     tags: [Boards]
 *     description: Fetches boards whose IDs match any of the provided IDs
 *     parameters:
 *       - in: query
 *         name: ids
 *         required: true
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *           example: ["boardId123", "boardId456", "boardId789"]
 *     responses:
 *       200:
 *         description: List of boards found
 *       400:
 *         description: Invalid request query
 *       404:
 *         description: Boards not found
 *       500:
 *         description: Internal server error
 */
router.get("/fetchByIds", async (req, res) => {
  await boardController.getBoardsByIds(req, res);
});

export default router;
