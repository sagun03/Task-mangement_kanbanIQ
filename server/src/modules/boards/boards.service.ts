import tasksModel from "../tasks/tasks.model";
import { UserService } from "../user/user.service";
import Board, { IBoard } from "./boards.model";

class BoardService {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  /**
   * Get all boards from the database
   */
  public async getAllBoards(): Promise<IBoard[]> {
    try {
      return await Board.find();
    } catch (error: any) {
      throw new Error("Error fetching boards: " + error.message);
    }
  }

  /**
   * Get a board by ID
   */
  public async getBoardById(id: string): Promise<IBoard | null> {
    try {
      const board = await Board.findById(id);
      if (!board) {
        throw new Error("Board not found");
      }
      return board;
    } catch (error: any) {
      throw new Error("Error fetching board by ID: " + error.message);
    }
  }

  /**
   * ✅ Create a new board and send invitations to the users
   */
  public async createNewBoard(boardData: Partial<IBoard>): Promise<IBoard> {
    try {
      const board = new Board(boardData);
      const savedBoard = await board.save();

      // 🔥 Call UserService to assign the board to the admin
      await this.userService.addBoardToUser(savedBoard.adminId, savedBoard.id);

      // Lazy load BoardInvitationService
      const { default: BoardInvitationService } = await import(
        "../boardInvitation/boardInvitation.service"
      );
      const boardInvitationService = new BoardInvitationService();
      // Send invitations to invited users
      for (const userId of savedBoard.invitedUserIds) {
        // Delegate invitation logic to BoardInvitationService
        await boardInvitationService.createInvitation(savedBoard.id, userId);
      }

      return savedBoard;
    } catch (error: any) {
      throw new Error("Error creating board: " + error.message);
    }
  }

  /**
   * Update an existing board
   */
  public async updateExistingBoard(
    id: string,
    updates: Partial<IBoard>
  ): Promise<IBoard | null> {
    try {
      return await Board.findByIdAndUpdate(id, updates, { new: true });
    } catch (error: any) {
      throw new Error("Error updating board: " + error.message);
    }
  }

  /**
   * Get boards by an array of IDs
   */
  public async getBoardsByIds(ids: string[]): Promise<IBoard[]> {
    try {
      return await Board.find({ _id: { $in: ids } });
    } catch (error: any) {
      throw new Error("Error fetching boards by IDs: " + error.message);
    }
  }

  /**
   * ✅ Delete a board and remove users' associations
   */
  public async deleteBoardById(id: string): Promise<IBoard | null> {
    try {
      const deletedBoard = await Board.findByIdAndDelete(id);

      if (deletedBoard) {
        // 🔥 Call UserService to remove the board ID from the admin and invited users
        await this.userService.removeBoardFromUser(deletedBoard.adminId, id);

        for (const userId of deletedBoard.invitedUserIds) {
          await this.userService.removeBoardFromUser(userId, id);
        }

        await tasksModel.deleteMany({ boardOriginalId: deletedBoard.id });
      }

      return deletedBoard;
    } catch (error: any) {
      throw new Error("Error deleting board: " + error.message);
    }
  }

  /**
   * Get the admin ID of a board by its ID
   */
  public async getAdminIdByBoardId(boardId: string): Promise<string | null> {
    try {
      const board = await Board.findOne({ _id: boardId });
      if (board) {
        return board.adminId;
      }
      return null;
    } catch (error: any) {
      throw new Error("Error fetching admin ID: " + error.message);
    }
  }

  async partialUpdateBoard(id: string, updateData: Partial<IBoard>) {
    try {
      const updatedBoard = await Board.findByIdAndUpdate(id, updateData, {
        new: true,
      });
      if (
        updatedBoard &&
        updateData.invitedUserIds &&
        updateData.invitedUserIds.length > 0
      ) {
        // Lazy load BoardInvitationService
        const { default: BoardInvitationService } = await import(
          "../boardInvitation/boardInvitation.service"
        );
        const boardInvitationService = new BoardInvitationService();
        // Send invitations to invited users
        for (const userId of updatedBoard.invitedUserIds) {
          // Delegate invitation logic to BoardInvitationService
          await boardInvitationService.createInvitation(
            updatedBoard.id,
            userId
          );
        }
      }
      if (!updatedBoard) {
        return null;
      }

      return updatedBoard;
    } catch (error: any) {
      throw new Error("Error updating board: " + error.message);
    }
  }
}

export default BoardService;
