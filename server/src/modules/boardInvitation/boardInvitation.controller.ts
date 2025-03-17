import { Request, Response } from "express";
import BoardInvitationService from "./boardInvitation.service";

class BoardInvitationController {
  private static instance: BoardInvitationController;
  private boardInvitationService: BoardInvitationService;

  private constructor() {
    this.boardInvitationService = new BoardInvitationService();
  }

  public static getInstance(): BoardInvitationController {
    if (!BoardInvitationController.instance) {
      BoardInvitationController.instance = new BoardInvitationController();
    }
    return BoardInvitationController.instance;
  }

  private static handleError(
    res: Response,
    message: string,
    error: unknown,
    status = 400
  ): void {
    res.status(status).json({
      message,
      error: error instanceof Error ? error.message : error,
    });
  }

 public async acceptInvitation(req: Request, res: Response) {
    try {
      const { token, userId } = req.body;
      if (!token) {
        return res.status(400).json({ message: "Token is required" });
      }

      await this.boardInvitationService.acceptInvitation(token, userId);
      res.status(200).json({ message: "Board invitation accepted successfully" });
    } catch (error) {
      BoardInvitationController.handleError(
        res,
        "Error accepting board invitation",
        error,
        500
      );
    }
  }

  public async getUserInvitations(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
  
      const invitations = await this.boardInvitationService.getUserInvitations(userId);
      res.status(200).json(invitations);
    } catch (error) {
      BoardInvitationController.handleError(
        res,
        "Error fetching invitations",
        error,
        500
      );
    }
  }
}

export default BoardInvitationController;
