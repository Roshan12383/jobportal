"use server";

import { db } from "@/config/db";
import { jobs, savedJobs } from "@/drizzle/schema";
import { getCurrentUser } from "@/features/auth/server/auth.queries";
import { and, eq, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function toggleSavedJobAction(jobId: number) {
  const user = await getCurrentUser();
  if (!user || user.role !== "applicant") {
    return { status: "ERROR" as const, message: "Unauthorized", saved: false };
  }

  if (!Number.isInteger(jobId) || jobId <= 0) {
    return { status: "ERROR" as const, message: "Invalid job", saved: false };
  }

  const [existing] = await db
    .select({ id: savedJobs.id })
    .from(savedJobs)
    .where(and(eq(savedJobs.jobId, jobId), eq(savedJobs.applicantId, user.id)))
    .limit(1);

  if (existing) {
    await db.delete(savedJobs).where(eq(savedJobs.id, existing.id));
    revalidateSavedPaths(jobId);
    return { status: "SUCCESS" as const, message: "Removed from saved jobs", saved: false };
  }

  const [job] = await db
    .select({ id: jobs.id })
    .from(jobs)
    .where(and(eq(jobs.id, jobId), isNull(jobs.deletedAt)))
    .limit(1);

  if (!job) {
    return { status: "ERROR" as const, message: "This job is no longer available", saved: false };
  }

  await db.insert(savedJobs).values({
    jobId,
    applicantId: user.id,
  });

  revalidateSavedPaths(jobId);
  return { status: "SUCCESS" as const, message: "Job saved", saved: true };
}

function revalidateSavedPaths(jobId: number) {
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/jobs");
  revalidatePath("/dashboard/saved-jobs");
  revalidatePath(`/dashboard/jobs/${jobId}`);
}
