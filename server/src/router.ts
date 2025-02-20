import { Request, Response, Router } from "express";
import { tasksRoutes } from "./modules/tasks";

const router = Router();

router.get("/health-check", (req: Request, res: Response) => {
    console.log("Server is running");
    res.send("Server is running");
  });

router.use('/tasks', tasksRoutes);

export default router;
