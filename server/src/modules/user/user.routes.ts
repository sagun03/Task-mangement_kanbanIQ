import express from "express";
import UserController from "./user.controller";

const router = express.Router();
const userController = UserController.getInstance();

/**
 * @swagger
 * /users/{firebaseUserId}:
 *   get:
 *     summary: Get user by Firebase User ID
 *     tags: [Users]
 *     description: Fetches a user from MongoDB using their Firebase User ID.
 *     parameters:
 *       - in: path
 *         name: firebaseUserId
 *         required: true
 *         schema:
 *           type: string
 *         description: The Firebase User ID of the user.
 *     responses:
 *       200:
 *         description: User retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 userId:
 *                   type: string
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *                 originalBoardIds:
 *                   type: array
 *                   items:
 *                     type: string
 *                 originalTasksId:
 *                   type: array
 *                   items:
 *                     type: string
 *                 dateOfJoining:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal Server Error.
 */
router.get("/:firebaseUserId", async (req, res) => {
  await userController.getUserByFirebaseId(req, res);
});

export default router;
