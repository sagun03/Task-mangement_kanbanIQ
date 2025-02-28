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
      return await Board.findById(id);
    } catch (error: any) {
      throw new Error("Error fetching board by ID: " + error.message);
    }
  }

  /**
   * ✅ Create a new board and assign the admin and invited users
   */
  public async createNewBoard(boardData: Partial<IBoard>): Promise<IBoard> {
    try {
      const board = new Board(boardData);
      const savedBoard = await board.save();

      // 🔥 Call UserService to assign the board to the admin and invited users
      await this.userService.addBoardToUser(savedBoard.adminId, savedBoard.id);
      
      for (const userId of savedBoard.invitedUserIds) {
        await this.userService.addBoardToUser(userId, savedBoard.id);
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
      return await Board.find({ 'id': { $in: ids } });
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
      }

      return deletedBoard;
    } catch (error: any) {
      throw new Error("Error deleting board: " + error.message);
    }
  }
}

export default BoardService;
