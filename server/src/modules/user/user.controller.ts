import { Request, Response } from "express";
import { ZodError } from "zod";
import { UserService } from "./user.service";
import { IUser } from "./user.model";

class UserController {
  private static instance: UserController;

  private constructor() {}

  public static getInstance(): UserController {
    if (!UserController.instance) {
      UserController.instance = new UserController();
    }
    return UserController.instance;
  }

  private static handleError(
    res: Response,
    message: string,
    error: unknown,
    status = 400
  ): void {
    if (error instanceof ZodError) {
      const formattedErrors = error.issues.map((issue) => ({
        code: issue.code,
        message: issue.message,
        path: issue.path.join("."),
      }));
      res.status(status).json({
        message,
        errors: formattedErrors,
      });
    } else {
      res.status(status).json({
        message,
        error: error instanceof Error ? error.message : error,
      });
    }
  }

  // Fetch user by firebaseUserId
  public async getUserByFirebaseId(req: Request, res: Response): Promise<Response<any> | void> {
    const { firebaseUserId } = req.params;

    try {
      const user = await UserService.getUserByFirebaseId(firebaseUserId);
      return res.status(200).json(user);
    } catch (error) {
      UserController.handleError(res, "Failed to fetch user", error, 500);
      // Ensure that there's no code after this
    }
  }

  public async getOtherUsers(req: Request, res: Response) {
    try {
      const { id } = req.params; // Requesting user’s ID
      const users = await UserService.getOtherUsers(id);
      return res.status(200).json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      UserController.handleError(res, "Failed to fetch users", error, 500);    }
  }

  public async getAllUsers(): Promise<IUser[]> {
    try {
      return await UserService.getAllUsers(); 
    } catch (error) {
      console.error("Error fetching users:", error);
      throw new Error("Internal Server Error"); 
    }
  }
}

export default UserController;
