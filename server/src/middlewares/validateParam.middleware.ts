import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

/**
 * Middleware to validate request parameters (params) against the provided Zod schema.
 * @param schema - Zod schema to validate the request parameters
 * @returns Express middleware function
 */
export const validateParam = (schema: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const params = req.params;
      schema.parse(params);
      next(); 
    } catch (err: unknown) {
      if (err instanceof ZodError) {
        res.status(400).json({
          success: false,
          message: 'Invalid parameters',
          errors: err.errors,
        });
      } else {
        if (err instanceof Error) {
          res.status(500).json({
            success: false,
            message: 'Something went wrong during parameter validation',
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
