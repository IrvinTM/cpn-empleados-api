import { Router, Request, Response } from "express";
import { UserController } from "../controllers/user.controller";

const router: Router = Router();
const userController = new UserController();

router.get("/empleados", (req: Request, res: Response) => {
  userController.getAllUsers(req, res);
});

router.get("/empleados/:id", (req: Request, res: Response) => {
  userController.getUserById(req, res);
});

router.post("/empleados", (req: Request, res: Response) => {
  userController.createUser(req, res);
});

router.put("/empleados/:id", (req: Request, res: Response) => {
  userController.updateUser(req, res);
});

router.delete("/empleados/:id", (req: Request, res: Response) => {
  userController.deleteUser(req, res);
});

export default router;