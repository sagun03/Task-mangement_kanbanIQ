import { Request, Response, NextFunction } from "express";
import { auth } from "../config/firebase";

// Middleware to verify Firebase ID token
const verifyFirebaseToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const token = req.headers.authorization?.split("Bearer ")[1];

  if (!token) {
    res.status(401).json({ error: "Unauthorized, token not provided" });
    return; // Stop further processing if no token is provided
  }

  try {
    // Verify the Firebase token
    const decodedToken = await auth.verifyIdToken(token);
    
    // Attach user info to the request object for downstream use
    (req as any).user = decodedToken;
    
    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    res.status(401).json({ error: "Unauthorized, invalid token" });
  }
};

export { verifyFirebaseToken };
