import { Request, Response } from "express";
import { ZodError } from "zod";
import { UserService } from "./user.service";

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
}

export default UserController;
