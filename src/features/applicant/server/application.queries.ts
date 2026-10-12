import { db } from "@/config/db";
import { employers, jobApplications, jobs, resumes, users } from "@/drizzle/schema";
import { getCurrentUser } from "@/features/auth/server/auth.queries";
import { and, desc, eq } from "drizzle-orm";

export type ApplicantResumeOption = {
  id: number;
  fileName: string;
};

export async function getApplyJobContext() {
  const user = await getCurrentUser();
  if (!user || user.role !== "applicant") {
    return { resumes: [] as ApplicantResumeOption[], appliedJobIds: [] as number[] };
  }

  const resumeRows = await db
    .select({
      id: resumes.id,
      fileName: resumes.fileName,
    })
    .from(resumes)
    .where(eq(resumes.applicantId, user.id))
    .orderBy(desc(resumes.isPrimary), desc(resumes.id));

  const appliedRows = await db
    .select({ jobId: jobApplications.jobId })
    .from(jobApplications)
    .where(eq(jobApplications.applicantId, user.id));

  return {
    resumes: resumeRows,
    appliedJobIds: appliedRows.map((row) => row.jobId),
  };
}

export async function getAppliedJobs() {
  const user = await getCurrentUser();
  if (!user || user.role !== "applicant") return [];

  return db
    .select({
      id: jobApplications.id,
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
      appliedAt: jobApplications.appliedAt,
    })
    .from(jobApplications)
    .innerJoin(jobs, eq(jobApplications.jobId, jobs.id))
    .innerJoin(employers, eq(jobs.employerId, employers.id))
    .innerJoin(users, eq(employers.id, users.id))
    .where(eq(jobApplications.applicantId, user.id))
    .orderBy(desc(jobApplications.appliedAt));
}

export async function hasAppliedToJob(jobId: number) {
  const user = await getCurrentUser();
  if (!user || user.role !== "applicant") return false;

  const [existing] = await db
    .select({ id: jobApplications.id })
    .from(jobApplications)
    .where(and(eq(jobApplications.jobId, jobId), eq(jobApplications.applicantId, user.id)))
    .limit(1);

  return Boolean(existing);
}
