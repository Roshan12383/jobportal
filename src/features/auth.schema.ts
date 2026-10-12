import { email, z } from "zod"
export const registerUserSchema=z.object({
    name:z.string().trim()
    .min(2,"Name must be atleast 2 char long")
    .max(255,"Name must not exceed 255 characters"),

    userName:z.string().trim()
    .min(3,"UserName must be at least 3 characters long")
    .max(255,"UserName must not exceed 255 characters")
    .regex(
        /^[a-zA-Z0-9_-]+$/,
        "UserName can only contain letters, numbers, underscores, and hyphens"
    ),

    email:z.string().trim().email("Please enter a valid email address")
    .max(255,"Email must not exceed 255 characters")
    .toLowerCase(),

    password:z.string().min(8,"Password must be atleast 8 character long")
    .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contains at least one lowercase lette, one uppercase letter, and one number"
    ),

    role:z.enum(["applicant","employer"],{
        error:"Role must be an applicant or employer",
    }).default("applicant"),



})


export type RegisterUserData=z.infer<typeof registerUserSchema>


export const registerUserWithConfirmSchema=registerUserSchema.extend({
    confirmPassword:z.string()
})
.refine((data)=> data.password === data.confirmPassword,{
    message:"Passwords don't match",
    path:["confirmPassword"]
})


export type RegisterUserWithConfirmData=z.infer<typeof registerUserWithConfirmSchema>; 


export const loginUserSchema=z.object({
    email:z.string().trim().email("please Enter a valid email address")
    .max(255,"Email must not exceed 255 character")
    .toLowerCase(),

    password:z.string().min(8,"Password must be atleast 8 character long")
})

export type loginUserData=z.infer<typeof loginUserSchema>