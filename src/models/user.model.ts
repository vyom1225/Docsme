import mongoose from "mongoose"
import bcrypt from "bcrypt"
import jwt, { SignOptions } from "jsonwebtoken"

interface userInterface extends Document{
    username : string;
    password : string;
    refreshToken : string;
    comparePassword(password : String) : Promise<boolean>;
    generateAccessToken() : Promise<string>;
    generateRefreshToken() : Promise<string>;
}

const userSchema = new mongoose.Schema({
    username : {
        type : String,
        required : true,
    },
    password : {
        type : String,
        required : true,
    },
    refreshToken : {
        type : String
    }
})

userSchema.pre("save", async function() {
    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
})

userSchema.methods.comparePassword = async function (password : string){
    return await bcrypt.compare(password , this.password)
}

userSchema.methods.generateAccessToken = async function() {
    return jwt.sign({
        userId : this._id
    }, 
    process.env.ACCESS_TOKEN_SECRET_KEY as string,
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY as string
    } as SignOptions)
}

userSchema.methods.generateRefreshToken = async function() {
    return jwt.sign({
        userId : this._id
    }, 
    process.env.REFRESH_TOKEN_SECRET_KEY as string,
    {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY as string
    } as SignOptions)
}

const User = mongoose.model<userInterface>("users" , userSchema);
export default User;