import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken"
import User from "../models/user.model";

const authenticateUser = async function(request: Request, response: Response, next: NextFunction) {
    try {
        
        const token = request.get('Authorization')?.split(' ')[1];
        if(!token){
            response.status(401).json({
                Message : "Access Token Unavailable"
            })
            return;
        }
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY as string) as JwtPayload;
        const userId = decodedToken.userId;

        const user = await User.findById(userId);

        if(!user){
            response.status(401).json({
                Message : "Access Token is invalid , Try Refresing it"
            })
            return;
        }
        request.userId = userId;
        next();
    } catch (error) {
        response.status(401).json({
            Message: "Invalid token"
        });
    }
}

export default authenticateUser;