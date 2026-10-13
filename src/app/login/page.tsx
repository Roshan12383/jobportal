"use client"

import { FormEvent, useState } from "react";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { UserRound } from "lucide-react";
// import loginAction from "./login.action";
import { toast } from "sonner";
import { error } from "console";
import { useForm } from "react-hook-form";
import { loginUserData, loginUserSchema, RegisterUserWithConfirmData, registerUserWithConfirmSchema } from "@/features/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {loginAction} from "@/features/auth/server/auth.action";
import { useRouter } from "next/navigation";



const Login:React.FC=()=>{
const router = useRouter();
const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver:zodResolver(loginUserSchema)
  })

const onSubmit=async(data:loginUserData)=>{
const result=await loginAction(data);
 if(result.status==="SUCCESS") {
  toast.success(result.message);
  router.push(result.role === "employer" ? "/employer-dashboard" : "/dashboard");
  router.refresh();
 }
  else toast.error(result.message);

}

  return(
    <div className="flex justify-center items-center p-4 min-h-screen">
        <div className="w-full max-w-lg rounded-sm border bg-white p-5 shadow-sm sm:p-8">
            <div className="text-center mb-8">
              <div className="bg-primary flex items-center h-16 w-16 rounded-full mx-auto mb-4 justify-center text-white ">
                  <UserRound/>
              </div>

              <h1 className="text-xl font-bold">
                 Welcome Back
              </h1>

              <p className="text-sm text-gray-500">
                 Sign in to your account
              </p>
            </div>
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}> 
                <div>
                    <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="Enter Your Email" required  {...register("email")} className={`pl-4
                   ${
                     errors.email? "border-destructive":""
                   }`}/>
                </div>
                  {errors.email && (
                    <p className="text-sm text-destructive"> 
                      {errors.email.message}
                    </p>
                  )}
                </div> 


           <div>
                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password"  type="password" placeholder="Enter Your Password" required  {...register("password")} className={`pl-4
                    ${
                      errors.password? "border-destructive":""
                    }`}/>
                </div>  
                 {errors.password && (
                 <p className="text-sm text-destructive"> 
                  {errors.password.message}
                 </p>
                )}
           </div>

            <button type="submit" className="bg-primary text-white rounded-sm p-2 hover:bg-gray-700 w-full text-center ">Login</button>
            </form>

             <p className="text-center text-gray-600 mt-2">Don't have an account? {" "}
              <Link href="/register" className=" text-blue-600 hover:text-blue-700">
                  Register here
               </Link>
            </p>
        </div>
    </div>
  )
}

export default Login;