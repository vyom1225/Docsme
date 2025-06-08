import mongoose from "mongoose"
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema({
    username : {
        type : String,
        required : true,
    },
    password : {
        type : String,
        required : true,
    }
})

userSchema.pre("save", async function() {
    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
})


const User = mongoose.model("users" , userSchema);
export default User;