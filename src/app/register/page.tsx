"use client"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; 


import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label";
import { UserRound } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterUserWithConfirmData, registerUserWithConfirmSchema } from "@/features/auth.schema";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { registrationAction } from "@/features/auth/server/auth.action";

const Registration:React.FC=()=>{
   const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver:zodResolver(registerUserWithConfirmSchema),
    defaultValues:{
      role:"applicant"
    }
  })
  

  const router=useRouter();
const onSubmit=async(data:RegisterUserWithConfirmData)=>{
  const result=await registrationAction(data);

  if(result.status==="SUCCESS"){
    if(data.role==="employer"){
        router.push("/employer-dashboard")
    }else{
      router.push("/dashboard")
    }
  }
  if(result.status==="SUCCESS") toast.success(result.message)
  else toast.error(result.message);
}

    return (
        <div className="flex justify-center items-center p-4 min-h-screen bg-background">
           <div className="w-full max-w-lg rounded-xl border bg-white p-5 shadow-sm sm:p-8">  

            <div className="text-center mb-8">
              <div className="bg-blue-600 flex items-center h-16 w-16 rounded-full mx-auto mb-4 justify-center text-white ">
                  <UserRound/>
              </div>

              <h1 className="text-xl font-bold">
                Join Our Job Portal
              </h1>

              <p className="text-sm text-gray-500">
                Create your account to get started
              </p>
            </div>
             <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" >
               <div>
                  <div className="space-y-2">
                <Label htmlFor="name">FullName</Label>
                <Input id="name"  {...register("name")} placeholder="Enter Your Name"  className={`pl-4
                 ${
                  errors.name? "border-destructive":""
                 }`}
                 />
               </div> 
                {errors.name && (
                 <p className="text-sm text-destructive"> 
                  {errors.name.message}
                 </p>
                )}
               </div>
               
      
              <div>
                 <div className="space-y-2">
                 <Label htmlFor="username">UserName</Label>
                 <Input id="username" required  {...register("userName")} placeholder="Enter Your UserName"  className={`pl-4
                 ${
                  errors.userName? "border-destructive":""
                 }`}
                 />
               </div>
                {errors.userName && (
                 <p className="text-sm text-destructive"> 
                  {errors.userName.message}
                 </p>
                )}
              </div>

               <div>
                <div className="space-y-2">
                   <Label htmlFor="email">Email</Label>
                   <Input id="email" type="email" required {...register("email")} placeholder="Enter Your Email"  className={`pl-4
                 ${
                  errors.email? "border-destructive":""
                 }`}
                   />
               </div>
                 {errors.email && (
                 <p className="text-sm text-destructive"> 
                  {errors.email.message}
                 </p>
                )}
               </div>

                
              <div>
                 <div className="space-y-2 w-full" >
                   <Label >I am a</Label>
                   <Controller name="role" control={control} render={({field})=>(
                   <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select your role" />
                    </SelectTrigger>

                    <SelectContent>
                    <SelectItem value="applicant">Job Applicant</SelectItem>
                    <SelectItem value="employer">Employer</SelectItem>
                    </SelectContent>
                   </Select>  
                   )}>
                   </Controller>
               </div>
                 {errors.role && (
                 <p className="text-sm text-destructive"> 
                  {errors.role.message}
                 </p>
                )}
              </div>

               <div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password"  {...register("password")} required placeholder="Create a Strong Password" className={`pl-4
                 ${
                  errors.password? "border-destructive":""
                 }`}
                  />
               </div>
                 {errors.password && (
                 <p className="text-sm text-destructive"> 
                  {errors.password.message}
                 </p>
                )}
               </div>


               <div>
                <div className="space-y-2">
                 <Label htmlFor="confirmPassword">Confirm Password</Label>
                 <Input id="confirmPassword" type="password"  {...register("confirmPassword")} placeholder="Confirm Your Password"    className={`pl-4
                 ${
                  errors.confirmPassword? "border-destructive":""
                 }`}
                  />
               </div>
                 {errors.confirmPassword && (
                 <p className="text-sm text-destructive"> 
                  {errors.confirmPassword.message}
                 </p>
                )}
               </div>

              <button type="submit" className="font-semibold  hover:bg-gray-700 w-full text-center rounded-md bg-primary  p-2 text-white">
                 Create Account
              </button>
            </form>

            <p className="text-center text-gray-600 mt-2">Already have an account? {" "}
              <Link href="/login" className=" text-blue-600 hover:text-blue-700">
                 Sign in here
               </Link>
            </p>
           </div>
        </div>
    )
}

export default Registration