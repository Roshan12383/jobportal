"use server"

import { db } from "@/config/db";
import { applicants, resumes, users } from "@/drizzle/schema";
import { getCurrentUser } from "@/features/auth/server/auth.queries";
import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { ApplicantSettingsSchema, applicantSettingsSchema } from "../jobs/jobs.schema";

const GENDERS = ["male", "female", "other"] as const;
const MARITAL_STATUSES = ["single", "married", "divorced"] as const;
const EDUCATIONS = ["none", "high school", "undergraduate", "masters", "phd"] as const;

function pickOption<T extends string>(value: string | null | undefined, options: readonly T[]) {
  if (value && options.includes(value as T)) return value as T;
  return undefined;
}

function toDateInput(value: Date | string | null | undefined) {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

export const getApplicantSettings = async () => {
  const user = await getCurrentUser();
  if (!user || user.role !== "applicant") return null;

  const [applicant] = await db
    .select()
    .from(applicants)
    .where(eq(applicants.id, user.id))
    .limit(1);

  const [resume] = await db
    .select()
    .from(resumes)
    .where(eq(resumes.applicantId, user.id))
    .orderBy(desc(resumes.isPrimary), desc(resumes.id))
    .limit(1);

  return {
    name: user.name ?? "",
    email: user.email ?? "",
    phoneNumber: user.phoneNumber ?? "",
    avatarUrl: user.avatarUrl ?? "",
    location: applicant?.location ?? "",
    dateOfBirth: toDateInput(applicant?.dateOfBirth),
    nationality: applicant?.nationality ?? "",
    gender: pickOption(applicant?.gender, GENDERS),
    maritalStatus: pickOption(applicant?.maritalStatus, MARITAL_STATUSES),
    education: pickOption(applicant?.education, EDUCATIONS),
    experience: applicant?.experience ?? "",
    websiteUrl: applicant?.websiteUrl ?? "",
    biography: applicant?.biography ?? "",
    resumeUrl: resume?.fileUrl ?? "",
    resumeName: resume?.fileName ?? "",
    resumeSize: resume?.fileSize ?? undefined,
  };
};

export const saveApplicantResume = async (file: {
  fileUrl: string;
  fileName: string;
  fileSize: number;
}) => {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "applicant") {
      return { status: "ERROR" as const, message: "Unauthorized" };
    }

    if (!file.fileUrl) {
      return { status: "ERROR" as const, message: "Resume URL is missing" };
    }

    const fileName = file.fileName.slice(0, 255);
    const [existing] = await db
      .select({ id: resumes.id })
      .from(resumes)
      .where(eq(resumes.applicantId, user.id))
      .orderBy(desc(resumes.isPrimary), desc(resumes.id))
      .limit(1);

    const resumeFile = {
      fileUrl: file.fileUrl,
      fileName,
      fileSize: file.fileSize,
      isPrimary: true,
    };

    let resumeId = existing?.id;
    if (existing) {
      await db.update(resumes).set(resumeFile).where(eq(resumes.id, existing.id));
    } else {
      const [inserted] = await db.insert(resumes).values({
        applicantId: user.id,
        ...resumeFile,
      });
      resumeId = inserted.insertId;
    }

    if (!resumeId) {
      return { status: "ERROR" as const, message: "Could not save resume" };
    }

    revalidatePath("/dashboard/settings");
    revalidatePath("/dashboard/jobs");

    return {
      status: "SUCCESS" as const,
      message: existing ? "Resume updated" : "Resume saved",
      resume: { id: resumeId, fileName },
    };
  } catch (error) {
    console.error("SAVE RESUME ERROR:", error);
    return { status: "ERROR" as const, message: "Could not save resume" };
  }
};

export const createApplicantProfile = async (data: ApplicantSettingsSchema) => {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "applicant") {
      return {
        status: "ERROR" as const,
        message: "Unauthorized",
      };
    }

    const result = applicantSettingsSchema.safeParse(data);

    if (!result.success) {
      return {
        status: "ERROR" as const,
        message: result.error.issues[0].message,
      };
    }

    const {
      name,
      phoneNumber,
      avatarUrl,
      biography,
      dateOfBirth,
      nationality,
      maritalStatus,
      gender,
      education,
      experience,
      websiteUrl,
      location,
      resumeUrl,
      resumeName,
      resumeSize,
    } = result.data;

    await db.transaction(async (tx) => {
      await tx
        .update(users)
        .set({
          name,
          phoneNumber,
          avatarUrl: avatarUrl || null,
        })
        .where(eq(users.id, user.id));

      const [existingApplicant] = await tx
        .select({ id: applicants.id })
        .from(applicants)
        .where(eq(applicants.id, user.id))
        .limit(1);

      const applicantProfile = {
        location,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        nationality,
        gender,
        maritalStatus,
        education,
        experience,
        websiteUrl: websiteUrl || null,
        biography: biography || null,
      };

      if (existingApplicant) {
        await tx.update(applicants).set(applicantProfile).where(eq(applicants.id, user.id));
      } else {
        await tx.insert(applicants).values({
          id: user.id,
          ...applicantProfile,
        });
      }

      if (resumeUrl) {
        const [existingResume] = await tx
          .select({ id: resumes.id })
          .from(resumes)
          .where(eq(resumes.applicantId, user.id))
          .limit(1);

        const resumeFile = {
          fileUrl: resumeUrl,
          fileName: (resumeName || "resume.pdf").slice(0, 255),
          fileSize: resumeSize ?? null,
          isPrimary: true,
        };

        if (existingResume) {
          await tx.update(resumes).set(resumeFile).where(eq(resumes.id, existingResume.id));
        } else {
          await tx.insert(resumes).values({
            applicantId: user.id,
            ...resumeFile,
          });
        }
      }
    });

    return {
      status: "SUCCESS" as const,
      message: "Profile created successfully!",
    };
  } catch (error) {
    console.error("CREATE PROFILE ERROR:", error);

    return {
      status: "ERROR" as const,
      message: "Failed to create Profile.",
    };
  }
};
