"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthController_1 = require("../controllers/AuthController");
const authenticateUser_middleware_1 = __importDefault(require("../Middlewares/authenticateUser.middleware"));
const AuthRouter = (0, express_1.Router)();
AuthRouter.post("/login", AuthController_1.loginController);
AuthRouter.post("/signup", AuthController_1.signupController);
AuthRouter.post("/refresh", AuthController_1.refreshTokenController);
AuthRouter.post("/logout", authenticateUser_middleware_1.default, AuthController_1.logoutController);
exports.default = AuthRouter;
