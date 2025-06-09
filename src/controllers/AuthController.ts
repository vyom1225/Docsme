import {Request , Response} from "express";
import User from "../models/user.model";
import userSchemaValidator from "../validations/userValidation";
import jwt, { JwtPayload } from "jsonwebtoken";

const cookieOptions = {
    httpOnly : true,
    secure : true
}

interface AuthenticatedRequest extends Request {
    userId : string;
}

export const loginController = async (request : Request , response : Response) => {
    const {username , password} = request.body;

    const userValidation = userSchemaValidator.safeParse(request.body);
    
    if(userValidation.success === false){
        response.status(400).json({
          Message : userValidation.error.errors[0].message
        })
        return;
    }
    
    const user = await User.findOne({
        username
    })

    if(!user){
        response.status(401).json({
            Message : "No User with such UserName exists"
        })
        return;
    }
   
    const isPasswordValid = await user.comparePassword(password);
    
    if(!isPasswordValid){
        response.status(401).json({
            Message : "Password is incorrect"
        })
        return;
    }

    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    await User.findByIdAndUpdate(user._id , {
        refreshToken
    })

    response.cookie( "refresh-token",
        refreshToken,
        {
            ...cookieOptions,
            path : "/api/auth/refresh"
        }
    )
    console.log(request.headers);
    response.status(200).json({
        Message : "You were logged in Successfully",
        userId : user._id,
        accessToken,
    })
}

export const signupController = async (request : Request , response : Response) => {
    const {username , password} = request.body;

    const userValidation = userSchemaValidator.safeParse(request.body);
    if(userValidation.success === false){
        response.status(400).json({
          Message : userValidation.error.errors[0].message
        })
        return;
    }

    const existingUser = await User.findOne({
        username
    })

    if(existingUser){
        response.status(409).json({
            Message : `A user with username ${username} already exists`
        })
        return;
    }

    const user = await User.create({
        username,
        password,
    })

    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    await User.findByIdAndUpdate(user._id , {
        refreshToken
    })

    response.cookie( "refresh-token",
        refreshToken,
        {
            ...cookieOptions,
            path : "/api/auth/refresh"
        }
    )

    response.status(200).json({
        Message : "User was registered Successfully",
        userId : user._id,
        accessToken
    })
}

export const logoutController = async (request: Request, response: Response) => {
     const userId = request.userId;
     await User.findByIdAndUpdate(userId, { refreshToken: "" });
    
    response.clearCookie("refresh-token", {
        ...cookieOptions,
        path: "/api/auth/refresh"
    });
    
    response.status(200).json({
        Message: "User LogOut Successfully"
    });
}

export const refreshTokenController = async (request: Request, response: Response) => {
    const oldToken = request.get('refresh-token');

    if(!oldToken){
        response.status(403).json({
            Message : "Refresh Token is not present"
        })
        return;
    }

    const decodedToken = jwt.verify(oldToken , process.env.REFRESH_TOKEN_SECRET_KEY as string) as JwtPayload;

    if(!decodedToken){
        response.status(403).json({
            Message : "Refresh Token is Invalid"
        })
        return;
    }

    const userId = decodedToken.userId;
    const user = await User.findById(userId);

    if(!user){
        response.status(400).json({
            Message : "Refresh Token is Invalid"
        })
        return;
    }

    if(user.refreshToken !== oldToken) {
        response.status(403).json({
            Message: "Refresh Token has been revoked"
        });
        return;
    }

    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    await User.findByIdAndUpdate(user._id , {
        refreshToken
    });

    response.cookie('refresh-token' ,
        refreshToken , 
        {
            ...cookieOptions,
            path : "/api/auth/refresh"
        }
    )

    response.status(200).json({
        Message : "Refresh Token generated Successfully",
        accessToken
    })
}
