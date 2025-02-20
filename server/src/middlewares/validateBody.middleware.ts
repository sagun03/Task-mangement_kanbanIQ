import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

/**
 * Middleware to validate request body against the provided Zod schema.
 * @param schema - Zod schema to validate the request body
 * @returns Express middleware function
 */
export const validateBody = (schema: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body); 
      next(); 
    } catch (err: unknown) {
      if (err instanceof ZodError) {
        res.status(400).json({
          success: false,
          message: 'Invalid request data',
          errors: err.errors, 
        });
      } else {
        if (err instanceof Error) {
          res.status(500).json({
            success: false,
            message: 'Something went wrong during validation',
            error: err.message,
          });
        } else {
          res.status(500).json({
            success: false,
            message: 'An unknown error occurred',
            error: 'Unknown error',
          });
        }
      }
    }
  };
};
