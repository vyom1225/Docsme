import {Router} from "express";
import { loginController, signupController } from "../controllers/AuthController";

const AuthRouter = Router();

AuthRouter.post("/login" , loginController);
AuthRouter.post("/signup" , signupController);
export default AuthRouter;

