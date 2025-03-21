import { Request, Response, NextFunction } from "express";
import redisClient from "../config/redisClient";

// Middleware to check cache
export const cacheMiddleware = (cacheKey: string) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      console.log(`Serving from Redis cache: ${cacheKey}`);
       res.status(200).json(JSON.parse(cachedData));
       return;
    }
    next();
  } catch (error) {
    console.error("Redis Cache Error:", error);
    next(); // Continue even if Redis fails
  }
};

// Middleware to clear cache when data changes
export const clearCacheMiddleware= (cacheKey: string) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    await redisClient.del(cacheKey);
    console.log(`Cache cleared: ${cacheKey}`);
  } catch (error) {
    console.error("Error clearing cache:", error);
  }
  next();
};
