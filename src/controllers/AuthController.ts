import {Request , Response} from "express";
import User from "../models/user.model";
import userSchemaValidator from "../validations/userValidation";
import bcrypt from "bcrypt";

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
   
    const comparedPasswordResult = await bcrypt.compare(password , user.password);
    
    if(!comparedPasswordResult){
        response.status(401).json({
            Message : "Password is incorrect"
        })
        return;
    }

    response.status(200).json({
        Message : "You were logged in Successfully",
        userId : username._id
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
        password
    })

    response.status(200).json({
        Message : "User was registered Successfully",
        userId : user._id
    })
}

