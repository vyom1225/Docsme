import z from "zod";

const userSchemaValidator = z.object({
    username : z.string().min(3 , "Username length must be greater than 3 characters"),
    password : z.string().min(6 , "Password length must be greater than 6 characters").max(25 , "Password length must be smaller than 25 characters")
});

export default userSchemaValidator;

