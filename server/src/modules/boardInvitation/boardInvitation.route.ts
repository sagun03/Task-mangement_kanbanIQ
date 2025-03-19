import { Router } from "express";
import BoardInvitationController from "./boardInvitation.controller";
import { clearCacheMiddleware } from "../../middlewares/cacheMiddleware";

const router = Router();
const invitationController = BoardInvitationController.getInstance();

/**
 * @swagger
 * tags:
 *   name: Invitations
 *   description: API endpoints for handling board invitations
 */

/**
 * @swagger
 * /boardInvitation/accept:
 *   post:
 *     summary: Accept an invitation using a token
 *     description: Accepts an invitation and adds the user to the board.
 *     tags:
 *       - Board Invitations
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 example: "some-invitation-token"
 *     responses:
 *       200:
 *         description: Invitation accepted successfully
 *       400:
 *         description: Invalid or expired invitation
 *       500:
 *         description: Internal server error
 */
router.post("/accept", clearCacheMiddleware("boards:all"), async (req, res) => {
  try {
    await invitationController.acceptInvitation(req, res);
  } catch (error) {
    console.error("Error accepting Invitation", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/**
 * @swagger
 * /boardInvitation/user/{userId}:
 *   get:
 *     summary: Get all board invitations for a user
 *     description: Retrieves all pending board invitations for a given user.
 *     tags:
 *       - Board Invitations
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user
 *     responses:
 *       200:
 *         description: Successfully retrieved invitations
 *       400:
 *         description: Invalid user ID
 *       500:
 *         description: Internal server error
 */
router.get("/requests/:userId", async (req, res) => {
  try {
    await invitationController.getUserInvitations(req, res);
  } catch (error) {
    console.error("Error fetching invitations", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;