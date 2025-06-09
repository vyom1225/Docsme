"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = __importDefault(require("zod"));
const userSchemaValidator = zod_1.default.object({
    username: zod_1.default.string().min(3, "Username length must be greater than 3 characters"),
    password: zod_1.default.string().min(6, "Password length must be greater than 6 characters").max(25, "Password length must be smaller than 25 characters")
});
exports.default = userSchemaValidator;
