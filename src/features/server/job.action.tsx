"use server";


import { db } from "@/config/db";
import { getCurrentUser } from "../auth/server/auth.queries";
import { JobFormData, jobsSchema } from "../employers/jobs/jobs.schema";
import { jobs } from "@/drizzle/schema";
import { Job } from "../employers/jobs/types/jobs.type";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const createJobAction=async(data:JobFormData)=>{
  try {
    const {success,data:result,error}=jobsSchema.safeParse(data);
    if(!success){
        console.log("Zod Error",error.flatten()),
        console.log("Received data",data);

        return{
            status:"ERROR",
            message:error.issues[0].message
        }
    }

    const currentUser=await getCurrentUser();
    if(!currentUser || currentUser.role !== "employer"){
        return {
            status:"ERROR",
            message:"Unauthorized"
        }
    }

    await db.insert(jobs).values({...result,employerId:currentUser.id})
    revalidatePath("/employer-dashboard");
     return {
        status:"SUCCESS",
        message:"Job posted successfully"
     }
  } catch (error) {
    return{
        status:"ERROR",
        message:"Something went wrong, Please try again",
    }
  }
};


export const deleteJobAction=async(jobId:number)=>{
   try {
    const currentUser=await getCurrentUser();
    if(!currentUser || currentUser.role!=="employer"){
        return {
            status:"ERROR",
            message:"Unauthorized",
        }
    }

    await db.delete(jobs).where(and(eq(jobs.employerId,currentUser.id),eq(jobs.id,jobId)));
    revalidatePath("/employer-dashboard");
    return {
        status:"SUCCESS",
        message:"Job Deleted Successfully"
    }
   } catch (error) {
    console.error("DELETE_JOB_ERROR",error);
     return {
            status:"ERROR",
            message:"Something went wrong while deleting",
        }
   }
}



export const getEmployerJobsAction = async (): Promise<{
  status: "SUCCESS" | "ERROR";
  data?: Job[];
  message?: string;
}> => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== "employer") {
      return {
        status: "ERROR",
        message: "Unauthorized: Employer not logged in",
        data: [],
      };
    }

    const result = await db
      .select()
      .from(jobs)
      .where(eq(jobs.employerId, currentUser.id))
      .orderBy(jobs.createdAt);

    console.log("Fetched jobs:", result);
    console.log("Fetched jobs count:", result.length);

    return {
      status: "SUCCESS",
      data: result as Job[],
    };
  } catch (error) {
    console.error("GET_EMPLOYER_JOBS_ERROR:", error);

    return {
      status: "ERROR",
      message: "Failed to fetch employer jobs",
      data: [],
    };
  }
};



export const getJobByIdAction=async(jobId:number)=>{
try {
    const currentUser=await getCurrentUser();
    if(!currentUser) return {status:"ERROR",message:"Unauthorized"}

    const [job]=await db.select().from(jobs).where(and(eq(jobs.id,jobId),eq(jobs.employerId,currentUser.id))).limit(1);
    if(!job) return{status:"ERROR",message:"Job not found"};
    return {
        status:"SUCCESS",
        data:job
    }
} catch (error) {
     console.error("getJobByIdAction Error",error)
    return{status:"ERROR",message:"Failed to fetch job details"};
}

}


export const updateJobAction=async(jobId:number,values:JobFormData)=>{
  try {
    const {success,data:result,error}=jobsSchema.safeParse(values);
    if(!success){
        return {
            status:"ERROR",
            message:error.issues[0].message
        }
    }

    const currentUser=await getCurrentUser();
    if(!currentUser || currentUser.role!=="employer"){
        return {
            status:"ERROR",
            message:"Unauthorized"
        }
    }

    await db.update(jobs).set({...result,updatedAt:new Date()}).where(and(eq(jobs.id,jobId),eq(jobs.employerId,currentUser.id)));
    revalidatePath("/employer-dashboard");

    return {
            status:"SUCCESS",
            message:"JOB UPDATED SUCCESSFULLY"
        }
  } catch (error) {
    return {
            status:"ERROR",
            message:"FAILED TO UPDATE JOB"
        }
  }
}