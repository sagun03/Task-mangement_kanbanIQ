import { Request, Response } from "express";
import BoardService from "./boards.service";
import { parseIdsFromQuery } from "../../utils/queryUtils";

class BoardController {
  private static instance: BoardController;
  private boardService: BoardService;

  private constructor() {
    this.boardService = new BoardService();
  }

  public static getInstance(): BoardController {
    if (!BoardController.instance) {
      BoardController.instance = new BoardController();
    }
    return BoardController.instance;
  }

  /**
   * Get all boards
   */
  public async getBoards(req: Request, res: Response) {
    try {
      const boards = await this.boardService.getAllBoards();
      return res.status(200).json(boards);
    } catch (error) {
      return res.status(500).json({ message: "Error fetching boards" });
    }
  }

  /**
   * Get a board by ID
   */
  public async getBoardById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const board = await this.boardService.getBoardById(id);
      if (!board) {
        return res.status(404).json({ message: "Board not found" });
      }
      return res.status(200).json(board);
    } catch (error) {
      return res.status(500).json({ message: "Error fetching board by ID" });
    }
  }

  /**
   * Get boards by an array of IDs
   */
  public async getBoardsByIds(req: Request, res: Response) {
    const { ids } = req.query;
  
    // Use the utility function to parse ids from query string
    const idsArray = parseIdsFromQuery(ids);
  
    // Check if the ids array is empty
    if (idsArray.length === 0) {
      return res.status(400).json({ message: "Invalid or missing 'ids' query parameter" });
    }
  
    try {
      const boards = await this.boardService.getBoardsByIds(idsArray);
      return res.status(200).json(boards);
    } catch (error) {
      return res.status(500).json({ message: "Error fetching boards" });
    }
  }

  /**
   * Create a new board
   */
  public async createBoard(req: Request, res: Response) {
    const boardData = req.body;
    try {
      const newBoard = await this.boardService.createNewBoard(boardData);
      return res.status(201).json(newBoard);
    } catch (error) {
      return res.status(400).json({ message: "Invalid request body" });
    }
  }

  /**
   * Update an existing board
   */
  public async updateBoard(req: Request, res: Response) {
    const { id } = req.params;
    const updates = req.body;
    try {
      const updatedBoard = await this.boardService.updateExistingBoard(id, updates);
      if (!updatedBoard) {
        return res.status(404).json({ message: "Board not found" });
      }
      return res.status(200).json(updatedBoard);
    } catch (error) {
      return res.status(500).json({ message: "Error updating board" });
    }
  }

  /**
   * Delete a board by ID
   */
  public async deleteBoard(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const deletedBoard = await this.boardService.deleteBoardById(id);
      if (!deletedBoard) {
        return res.status(404).json({ message: "Board not found" });
      }
      return res.status(200).json({ message: "Board deleted successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Error deleting board" });
    }
  }

  async partialUpdateBoard(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const updatedBoard = await this.boardService.partialUpdateBoard(id, updateData);

      if (!updatedBoard) {
        return res.status(404).json({ message: "Board not found" });
      }

      res.status(200).json(updatedBoard);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

export default BoardController;
