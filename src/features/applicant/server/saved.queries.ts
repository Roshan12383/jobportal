import { db } from "@/config/db";
import { employers, jobs, savedJobs, users } from "@/drizzle/schema";
import { getCurrentUser } from "@/features/auth/server/auth.queries";
import { desc, eq } from "drizzle-orm";

export async function getSavedJobIds() {
  const user = await getCurrentUser();
  if (!user || user.role !== "applicant") return [] as number[];

  const rows = await db
    .select({ jobId: savedJobs.jobId })
    .from(savedJobs)
    .where(eq(savedJobs.applicantId, user.id));

  return rows.map((row) => row.jobId);
}

export async function getSavedJobs() {
  const user = await getCurrentUser();
  if (!user || user.role !== "applicant") return [];

  return db
    .select({
      id: savedJobs.id,
      jobId: jobs.id,
      title: jobs.title,
      companyName: employers.name,
      companyLogo: users.avatarUrl,
      location: jobs.location,
      workType: jobs.workType,
      minSalary: jobs.minSalary,
      maxSalary: jobs.maxSalary,
      salaryCurrency: jobs.salaryCurrency,
      salaryPeriod: jobs.salaryPeriod,
      expiresAt: jobs.expiresAt,
      deletedAt: jobs.deletedAt,
      savedAt: savedJobs.savedAt,
    })
    .from(savedJobs)
    .innerJoin(jobs, eq(savedJobs.jobId, jobs.id))
    .innerJoin(employers, eq(jobs.employerId, employers.id))
    .innerJoin(users, eq(employers.id, users.id))
    .where(eq(savedJobs.applicantId, user.id))
    .orderBy(desc(savedJobs.savedAt));
}
