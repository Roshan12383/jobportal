"use server"

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import crypto from "crypto";
import { invalidateSession } from "./session";
import { db } from "@/config/db";
import { applicants, employers, users } from "@/drizzle/schema";
import { loginUserSchema } from "@/features/auth.schema";
import { createSessionAndSetCookies } from "@/features/auth/server/session";
import argon2 from "argon2";
import { RegisterUserData, registerUserSchema } from "@/features/auth.schema";
import { eq, or } from "drizzle-orm";


 
export const registrationAction=async(data:RegisterUserData)=>{
  try {

    const {data:validateData,error}=registerUserSchema.safeParse(data);
    if(error) return {status:"ERROR", message:error.issues[0].message}
    const{name,userName,email,role,password}=validateData;

    const [user] =await db.select().from(users).where(or(eq(users.email,email),eq(users.userName,userName)))
   
    if(user){
      if(user.email === email){
         return {
          status:"Error",
          message:"Email Already Exits"
         }
      }else{
         return {
          status:"Error",
          message:"UserName Already Exits"
         }
      }
    }
    const hashPassword=await argon2.hash(password)

    await db.transaction(async(tx)=>{
        const [result]= await tx.insert(users).values({name,userName,email,password:hashPassword,role });
  
       if(role==="applicant"){
          await tx.insert(applicants).values({id:result.insertId})
       }else{
          await tx.insert(employers).values({id:result.insertId})
       }
        await createSessionAndSetCookies(result.insertId,tx);

    })
    return{
      status:"SUCCESS",
      message:"Registration Completed Successfully"
    }
  } catch (error) {
    console.log("Registration Action Error",error)
      return{
      status:"ERROR",
      message:"Unkonwn Error Occurred! Please Try Again Later"
    }
  }
}





interface loginData{
    email:string,
    password:string
}

export const loginAction=async(data:loginData)=>{
    try {
        const {data:validateData,error}=loginUserSchema.safeParse(data);
        if(error) return {status:"ERROR", message:error.issues[0].message};

        const{email,password}=validateData;
        const [user]=await db.select().from(users).where(eq(users.email,email))
        
        if(!user){
          return{
            status:"ERROR",
            message:"Invalid Email or Password"
          }
        }

        const isValidPassword=await argon2.verify(user.password,password);
        if(!isValidPassword){
        return{
            status:"ERROR",
            message:"Invalid Email or Password"
          }
        }

        await createSessionAndSetCookies(user.id);
       return {
            status:"SUCCESS",
            message:"Login Successfully",
            role: user.role,
        } 
    } catch (error) {
        console.log("Login Action Error",error)
        return {
            status:"ERROR",
            message:"Unkonwn Error Occurred! Please Try Again Later"
        }
    }
}






export const logoutUserAction=async()=>{
  const cookieStore=await cookies();
  const session=cookieStore.get("session")?.value;

  if(!session) return redirect("/");

  const hashToken=crypto.createHash("sha-256").update(session).digest("hex");

  await invalidateSession(hashToken);

  cookieStore.delete("session");

  return redirect("/");
}