import { db } from "@/config/db";
import { jobApplications, jobs, resumes, users } from "@/drizzle/schema";
import { desc, eq } from "drizzle-orm";

export async function getEmployerApplication(employerId: number) {
  const rows = await db
    .select({
      id: jobApplications.id,
      applicantName: users.name,
      applicantEmail: users.email,
      applicantAvatar: users.avatarUrl,
      jobTitle: jobs.title,
      workType: jobs.workType,
      appliedAt: jobApplications.appliedAt,
      coverLetter: jobApplications.coverLetter,
      resumeUrl: resumes.fileUrl,
      resumeName: resumes.fileName,
    })
    .from(jobApplications)
    .innerJoin(jobs, eq(jobApplications.jobId, jobs.id))
    .innerJoin(users, eq(jobApplications.applicantId, users.id))
    .innerJoin(resumes, eq(jobApplications.resumeId, resumes.id))
    .where(eq(jobs.employerId, employerId))
    .orderBy(desc(jobApplications.appliedAt));

  return rows.map((row) => ({
    ...row,
    appliedAt: new Date(row.appliedAt).toISOString(),
  }));
}
