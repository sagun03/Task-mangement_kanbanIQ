import { UserService } from "../user/user.service";
import EmailService from "../email/email.service";
import crypto from "crypto"; 
import BoardInvitation from "./boardInvitation.model";
import BoardService from "../boards/boards.service";

class BoardInvitationService {
  private userService: UserService;
  private emailService: EmailService;
  private board: BoardService;

  constructor(
  ) {
    this.userService = new UserService;
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
        const invitationLink = `${process.env.FRONTEND_URL || 'http://localhost'}/accept-invitation/${token}`;

        await this.emailService.sendEmail(
          user.email,
          "You've been invited to join a board",
          `You have been invited to join the board: "${board.name}". Please click the link to accept the invitation: ${invitationLink}`
        );
      }
    } catch (error: any) {
      throw new Error("Error creating invitation: " + error.message);
    }
  }

  /**
   * ✅ Accept an invitation using the token
   */
  public async acceptInvitation(token: string): Promise<void> {
    try {
      // Find the invitation by token
      const invitation = await BoardInvitation.findOne({ token, status: "pending" });
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
        await board.save();
      }

      // Optionally, add the user to the board in the UserService
      await this.userService.addBoardToUser(invitation.invitedUserId, invitation.boardId);
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
}

export default BoardInvitationService;
