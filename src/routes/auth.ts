import {Router} from "express";
import { loginController, logoutController, refreshTokenController, signupController } from "../controllers/AuthController";
import authenticateUser from "../Middlewares/authenticateUser.middleware";
const AuthRouter = Router();

AuthRouter.post("/login" , loginController);
AuthRouter.post("/signup", signupController);
AuthRouter.post("/refresh", refreshTokenController)
AuthRouter.post("/logout", authenticateUser , logoutController);

export default AuthRouter;

