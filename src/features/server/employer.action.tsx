"use server"

import { db } from "@/config/db";
import { getCurrentUser } from "../auth/server/auth.queries";
import { employers, users } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { EmployerProfileData } from "../employers/employer.schema";

// interface IFormInput{
//     name:string,
//     description:string,
//     yearOfEstablishment:string,
//     location:string,
//     websiteUrl:string,
//     organizationType:OrganizationType,
//     teamSize:TeamSize
// }



// const  organizationTypeOption=["development","business","design","android dev","cloud business"] as const;
// type  OrganizationType=(typeof organizationTypeOption)[number];

// const teamSizeOptions=["1-10","11-50","51-200","201-500","500-1K"] as const;
// type TeamSize=(typeof teamSizeOptions)[number];



export const updateEmployerProfileAction=async(data:EmployerProfileData)=>{
 try {
   const currentUser= await getCurrentUser();
   if(!currentUser || currentUser.role!=="employer"){
      return {status:"ERROR",message:"Unauthorized"};
   }

   const{name,description,yearOfEstablishment,location,websiteUrl,organizationType,teamSize,avatarUrl,bannerImageUrl}=data

   const updateEmployer=await db.update(employers).set({name,
    description,
    yearOfEstablishment:yearOfEstablishment?parseInt(yearOfEstablishment):null,
    location,
    websiteUrl,
    organizationType,
    bannerImageUrl,
    teamSize}).where(eq(employers.id,currentUser.id));

    await db.update(users).set({avatarUrl}).where(eq(users.id,currentUser.id));

    

    return {status:"SUCCESS", message:"Profile updated successfully"}

 } catch (error) {
    return {status:"ERROR", message:"Something went wrong, please try again"}
 }
}