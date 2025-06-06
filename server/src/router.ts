import { Request, Response, Router } from "express";
import { tasksRoutes } from "./modules/tasks";
import { authRoutes } from "./modules/auth";
import { userRoutes } from "./modules/user";
import { boardsRoutes } from "./modules/boards";
import { boardInvitationRoutes } from "./modules/boardInvitation";

const router = Router();

router.get("/health-check", (req: Request, res: Response) => {
    console.log("Server is running");
    res.send("Server is running");
  });

router.use('/tasks', tasksRoutes);
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/boards', boardsRoutes);
router.use('/boardInvitation', boardInvitationRoutes);

export default router;
