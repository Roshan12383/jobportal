"use server";

import { db } from "@/config/db";
import { jobApplications, resumes } from "@/drizzle/schema";
import { getCurrentUser } from "@/features/auth/server/auth.queries";
import { applyJobSchema, ApplyJobSchema } from "@/features/applicant/jobs/apply.job.schema";
import { getJobById } from "@/features/applicant/server/job.queries";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const applyJobAction = async (data: ApplyJobSchema) => {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "applicant") {
      return { status: "ERROR" as const, message: "Unauthorized" };
    }

    const parsed = applyJobSchema.safeParse(data);
    if (!parsed.success) {
      return {
        status: "ERROR" as const,
        message: parsed.error.issues[0]?.message ?? "Invalid application",
      };
    }

    const { jobId, resumeId, coverLetter } = parsed.data;
    const job = await getJobById(jobId);
    if (!job) {
      return { status: "ERROR" as const, message: "This job is no longer open" };
    }

    const [resume] = await db
      .select({ id: resumes.id })
      .from(resumes)
      .where(and(eq(resumes.id, resumeId), eq(resumes.applicantId, user.id)))
      .limit(1);

    if (!resume) {
      return { status: "ERROR" as const, message: "Please select a resume" };
    }

    const [existing] = await db
      .select({ id: jobApplications.id })
      .from(jobApplications)
      .where(and(eq(jobApplications.jobId, jobId), eq(jobApplications.applicantId, user.id)))
      .limit(1);

    if (existing) {
      return { status: "ERROR" as const, message: "You have already applied for this job" };
    }

    await db.insert(jobApplications).values({
      jobId,
      applicantId: user.id,
      resumeId,
      coverLetter: coverLetter?.trim() ? coverLetter.trim() : null,
    });

    revalidatePath("/dashboard/jobs");
    revalidatePath(`/dashboard/jobs/${jobId}`);

    return { status: "SUCCESS" as const, message: "Application submitted" };
  } catch (error) {
    console.error("APPLY JOB ERROR:", error);
    return { status: "ERROR" as const, message: "Could not apply for this job" };
  }
};
