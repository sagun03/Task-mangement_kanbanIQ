import express, { Request, Response } from "express";
import { verifyFirebaseToken } from "../../middlewares/validateToken.middleware";
import AuthController from "./auth.controller";
import { clearCacheMiddleware } from "../../middlewares/cacheMiddleware";

const router = express.Router();
const authController = AuthController.getInstance();

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     description: Registers a new user after verifying the Firebase ID token and storing user details.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "firebase-uid"
 *               username:
 *                 type: string
 *                 example: "john_doe"
 *               email:
 *                 type: string
 *                 example: "john.doe@example.com"
 *               originalBoardIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["board-id-1", "board-id-2"]
 *               originalTasksId:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["task-id-1", "task-id-2"]
 *     responses:
 *       200:
 *         description: User registered successfully
 *       400:
 *         description: Invalid request body
 *       401:
 *         description: Unauthorized, invalid Firebase token
 */
router.post(
  "/register",
  verifyFirebaseToken,
  clearCacheMiddleware("users:all"),
  async (req: Request, res: Response): Promise<void> => {
    try {
      await authController.registerUser(req, res);
    } catch (error) {
      // Handle any potential error that might occur within the registerUser method
      console.error(error);
      res.status(500).json({ error: "An error occurred during registration" });
    }
  }
);

export default router;
