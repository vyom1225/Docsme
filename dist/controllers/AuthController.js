"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshTokenController = exports.logoutController = exports.signupController = exports.loginController = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const userValidation_1 = __importDefault(require("../validations/userValidation"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cookieOptions = {
    httpOnly: true,
    secure: true
};
const loginController = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = request.body;
    const userValidation = userValidation_1.default.safeParse(request.body);
    if (userValidation.success === false) {
        response.status(400).json({
            Message: userValidation.error.errors[0].message
        });
        return;
    }
    const user = yield user_model_1.default.findOne({
        username
    });
    if (!user) {
        response.status(401).json({
            Message: "No User with such UserName exists"
        });
        return;
    }
    const isPasswordValid = yield user.comparePassword(password);
    if (!isPasswordValid) {
        response.status(401).json({
            Message: "Password is incorrect"
        });
        return;
    }
    const accessToken = yield user.generateAccessToken();
    const refreshToken = yield user.generateRefreshToken();
    yield user_model_1.default.findByIdAndUpdate(user._id, {
        refreshToken
    });
    response.cookie("refresh-token", refreshToken, Object.assign(Object.assign({}, cookieOptions), { path: "/api/auth/refresh" }));
    console.log(request.headers);
    response.status(200).json({
        Message: "You were logged in Successfully",
        userId: user._id,
        accessToken,
    });
});
exports.loginController = loginController;
const signupController = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = request.body;
    const userValidation = userValidation_1.default.safeParse(request.body);
    if (userValidation.success === false) {
        response.status(400).json({
            Message: userValidation.error.errors[0].message
        });
        return;
    }
    const existingUser = yield user_model_1.default.findOne({
        username
    });
    if (existingUser) {
        response.status(409).json({
            Message: `A user with username ${username} already exists`
        });
        return;
    }
    const user = yield user_model_1.default.create({
        username,
        password,
    });
    const accessToken = yield user.generateAccessToken();
    const refreshToken = yield user.generateRefreshToken();
    yield user_model_1.default.findByIdAndUpdate(user._id, {
        refreshToken
    });
    response.cookie("refresh-token", refreshToken, Object.assign(Object.assign({}, cookieOptions), { path: "/api/auth/refresh" }));
    response.status(200).json({
        Message: "User was registered Successfully",
        userId: user._id,
        accessToken
    });
});
exports.signupController = signupController;
const logoutController = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    // const userId = request.userId;
    // await User.findByIdAndUpdate(userId, { refreshToken: "" });
    response.clearCookie("refresh-token", Object.assign(Object.assign({}, cookieOptions), { path: "/api/auth/refresh" }));
    response.status(200).json({
        Message: "User LogOut Successfully"
    });
});
exports.logoutController = logoutController;
const refreshTokenController = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const oldToken = request.get('refresh-token');
    if (!oldToken) {
        response.status(403).json({
            Message: "Refresh Token is not present"
        });
        return;
    }
    const decodedToken = jsonwebtoken_1.default.verify(oldToken, process.env.REFRESH_TOKEN_SECRET_KEY);
    if (!decodedToken) {
        response.status(403).json({
            Message: "Refresh Token is Invalid"
        });
        return;
    }
    const userId = decodedToken.userId;
    const user = yield user_model_1.default.findById(userId);
    if (!user) {
        response.status(400).json({
            Message: "Refresh Token is Invalid"
        });
        return;
    }
    const accessToken = yield user.generateAccessToken();
    const refreshToken = yield user.generateRefreshToken();
    yield user_model_1.default.findByIdAndUpdate(user._id, {
        refreshToken
    });
    response.cookie('refresh-token', refreshToken, Object.assign(Object.assign({}, cookieOptions), { path: "/api/auth/refresh" }));
    response.status(200).json({
        Message: "Refresh Token generated Successfully",
        accessToken
    });
});
exports.refreshTokenController = refreshTokenController;
