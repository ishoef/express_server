import { Router } from "express";
import { authController } from "./auth.controller";
import auth from "../../middleware/auth";

const router = Router();

// http://localhost:5000/auth/login
router.post("/login", auth, authController.loginUser);

export const authRouter = router;
