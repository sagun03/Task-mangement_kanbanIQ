import { UserService } from "../user/user.service";
import EmailService from "../email/email.service";
import crypto from "crypto";
import BoardInvitation from "./boardInvitation.model";
import BoardService from "../boards/boards.service";
import { wss } from "../../app";
import redisClient from "../../config/redisClient";

class BoardInvitationService {
  private userService: UserService;
  private emailService: EmailService;
  private board: BoardService;

  constructor() {
    this.userService = new UserService();
    this.emailService = new EmailService();
    this.board = new BoardService();
  }

  /**
   * ✅ Create a board invitation and send the invitation email with a link
   */
  public async createInvitation(
    boardId: string,
    invitedUserId: string
  ): Promise<void> {
    try {
      // Generate a unique token for the invitation link
      const token = crypto.randomBytes(16).toString("hex");

      // Create a new invitation
      const invitation = new BoardInvitation({
        boardId,
        invitedUserId,
        token,
        status: "pending",
      });

      await invitation.save();

      // Send the invitation link to the user
      const board = await this.board.getBoardById(boardId);
      const user = await this.userService.getUserById(invitedUserId);

      if (user && user.email && board) {
        const invitationLink = `${
          process.env.FRONTEND_URL || "http://localhost:3000"
        }/accept-invitation/${token}`;
        const emailHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Board Invitation</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 20px;
    }
    .container {
      max-width: 600px;
      background: #ffffff;
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
      background-color: #0056b3;
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
    <div class="header">You're Invited to Join a Board!</div>
    <div class="content">
      <p>You have been invited to join the board: <strong>"${
        board.name
      }"</strong>.</p>
      <p>Click the button below to accept the invitation:</p>
      <a href="${
        process.env.FRONTEND_URL || "http://localhost:3000"
      }/accept-invitation/${token}" class="button">Accept Invitation</a>
    </div>
    <div class="footer">
      <p>Need help? Contact us at <a href="mailto:kanbaniq@gmail.com">support@kanbaniq.com</a></p>
  <p>© 2025 KanbanIQ. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`;
        await this.emailService.sendEmail(
          user.email,
          "You've been invited to join a board",
          `You have been invited to join the board: "${board.name}". Please click the link to accept the invitation: ${invitationLink}`,
          emailHtml
        );
        wss.clients.forEach((client) => {
          client.send(
            JSON.stringify({ event: "boardInvitationSent", data: invitation })
          );
        });
        await redisClient.del("boards:all");
      }
    } catch (error: any) {
      throw new Error("Error creating invitation: " + error.message);
    }
  }

  /**
   * ✅ Accept an invitation using the token
   */
  public async acceptInvitation(token: string, userId: string) {
    try {
      // Find the invitation by token
      const invitation = await BoardInvitation.findOne({
        token,
        status: "pending",
        invitedUserId: userId,
      });
      if (!invitation) {
        throw new Error("Invalid or expired invitation.");
      }

      // Update the invitation status to "accepted"
      invitation.status = "accepted";
      await invitation.save();

      // Add the user to the board
      const board = await this.board.getBoardById(invitation.boardId);
      if (board) {
        // Assuming the board model has an acceptedUserIds array to store accepted users
        board.acceptedUserIds?.push(invitation.invitedUserId);
        board.invitedUserIds = board.invitedUserIds.filter(
          (id) => id !== invitation.invitedUserId
        );
        await board.save();
      }

      // Optionally, add the user to the board in the UserService
      await this.userService.addBoardToUser(
        invitation.invitedUserId,
        invitation.boardId
      );
      return { success: true, message: "Successfully joined the board!" };
    } catch (error: any) {
      throw new Error("Error accepting invitation: " + error.message);
    }
  }

  /**
   * ✅ Decline an invitation and remove the invite
   */
  public async declineInvitation(token: string): Promise<void> {
    try {
      // Find and remove the invitation by token
      const invitation = await BoardInvitation.findOneAndDelete({ token });
      if (!invitation) {
        throw new Error("Invitation not found.");
      }

      // Optionally, notify the user that they declined the invitation
      const user = await this.userService.getUserById(invitation.invitedUserId);
      if (user) {
        await this.emailService.sendEmail(
          user.email,
          "Invitation Declined",
          `You have declined the invitation to join the board: "${invitation.boardId}".`
        );
      }
    } catch (error: any) {
      throw new Error("Error declining invitation: " + error.message);
    }
  }

  /**
   * ✅ Get invitation status by token
   */
  public async getInvitationStatus(token: string): Promise<string | null> {
    try {
      const invitation = await BoardInvitation.findOne({ token });
      if (invitation) {
        return invitation.status;
      }
      return null;
    } catch (error: any) {
      throw new Error("Error fetching invitation status: " + error.message);
    }
  }

  public async getUserInvitations(userId: string) {
    try {
      const invitations = await BoardInvitation.find({
        invitedUserId: userId,
        status: "pending",
      });
      return invitations;
    } catch (error: any) {
      throw new Error("Error fetching invitations: " + error.message);
    }
  }
}

export default BoardInvitationService;
