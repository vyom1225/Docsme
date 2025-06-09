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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../models/user.model"));
const authenticateUser = function (request, response, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            console.log("hello");
            const token = (_a = request.get('Authorization')) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
            if (!token) {
                response.status(401).json({
                    Message: "Access Token Unavailable"
                });
                return;
            }
            const decodedToken = jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY);
            const userId = decodedToken.userId;
            const user = yield user_model_1.default.findById(userId);
            if (!user) {
                response.status(401).json({
                    Message: "Access Token is invalid , Try Refresing it"
                });
                return;
            }
            request.userId = userId;
            console.log(request.userId);
            next();
        }
        catch (error) {
            response.status(401).json({
                Message: "Invalid token"
            });
        }
    });
};
exports.default = authenticateUser;
