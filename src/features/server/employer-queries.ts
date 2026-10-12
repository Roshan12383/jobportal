import { getCurrentUser } from "../auth/server/auth.queries"
import { db } from "@/config/db";
import { employers, jobs } from "@/drizzle/schema";
import { employerProfileSchema } from "../employers/employer.schema";
import { and, count, desc, eq, gte, isNull, or } from "drizzle-orm";

function localDateKey(date = new Date()) {
   const month = String(date.getMonth() + 1).padStart(2, "0");
   const day = String(date.getDate()).padStart(2, "0");
   return `${date.getFullYear()}-${month}-${day}`;
}

export async function getEmployerDashboardCounts(employerId: number) {
   const [openRow] = await db
      .select({ total: count() })
      .from(jobs)
      .where(and(
         eq(jobs.employerId, employerId),
         isNull(jobs.deletedAt),
         or(isNull(jobs.expiresAt), gte(jobs.expiresAt, localDateKey())),
      ));

   return {
      openJobs: Number(openRow?.total ?? 0),
      savedCandidates: 0,
   };
}

export async function getEmployerLatestJobs(employerId: number) {
   return db
      .select()
      .from(jobs)
      .where(eq(jobs.employerId, employerId))
      .orderBy(desc(jobs.createdAt), desc(jobs.id))
      .limit(3);
}

const getCurrentEmployerDetails=async()=>{
   const currentUser=await getCurrentUser();
   if(!currentUser) return null;

   if(currentUser.role !== "employer") return null;

   const [employer]= await db.select().from(employers).where(eq(employers.id,currentUser.id))

   const isProfileCompleted = employerProfileSchema.safeParse({
      name: employer?.name ?? "",
      description: employer?.description ?? "",
      organizationType: employer?.organizationType ?? "",
      teamSize: employer?.teamSize ?? "",
      yearOfEstablishment: employer?.yearOfEstablishment?.toString() ?? "",
      location: employer?.location ?? "",
      websiteUrl: employer?.websiteUrl ?? "",
      avatarUrl: currentUser.avatarUrl ?? "",
      bannerImageUrl: employer?.bannerImageUrl ?? "",
   }).success;

   return {...currentUser,employerDetails:employer,isProfileCompleted};
}

export default getCurrentEmployerDetails