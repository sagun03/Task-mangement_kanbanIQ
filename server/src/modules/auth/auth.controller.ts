import { Request, Response } from "express";
import { ZodError } from "zod";
import { AuthService } from "./auth.service";

class AuthController {
  // Singleton pattern for controller
  private static instance: AuthController;

  private constructor() {}

  public static getInstance(): AuthController {
    if (!AuthController.instance) {
      AuthController.instance = new AuthController();
    }
    return AuthController.instance;
  }

  // Common error handler
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

  // Register user
  public async registerUser(req: Request, res: Response): Promise<void> {
    const { userId, username, email, originalBoardIds = [], originalTasksId = [] } = req.body;

    try {
      const newUser = await AuthService.registerUser({
        userId,
        username,
        email,
        originalBoardIds,
        originalTasksId,
      });

      res.status(201).json({ message: "User registered successfully", newUser });
    } catch (error) {
      AuthController.handleError(res, "Failed to register user", error);
    }
  }
}

export default AuthController;