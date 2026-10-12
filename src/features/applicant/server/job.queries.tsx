import { JOB_LEVEL, JOB_TYPE, WORK_TYPE } from "@/config/constant";
import { db } from "@/config/db";
import { employers, jobs, users } from "@/drizzle/schema";
import { and, count, desc, eq, isNull, like, or, sql, SQL } from "drizzle-orm";

export type JobFilters = {
  search?: string;
  jobType?: string;
  jobLevel?: string;
  workType?: string;
};

function pickEnum<T extends string>(value: string | undefined, options: readonly T[]) {
  if (!value) return undefined;
  return options.includes(value as T) ? (value as T) : undefined;
}

function localDateKey(date = new Date()) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function openJobConditions(filters: JobFilters = {}) {
  const today = localDateKey();

  const conditions: SQL[] = [
    isNull(jobs.deletedAt),
    isNull(employers.deletedAt),
    or(isNull(jobs.expiresAt), sql`${jobs.expiresAt} >= ${today}`)!,
  ];

  const term = filters.search?.replace(/[%_]/g, "").trim();
  if (term) {
    const pattern = `%${term}%`;
    const search = or(
      like(jobs.title, pattern),
      like(jobs.tags, pattern),
      like(jobs.location, pattern),
      like(employers.name, pattern),
    );
    if (search) conditions.push(search);
  }

  const jobType = pickEnum(filters.jobType, JOB_TYPE);
  const jobLevel = pickEnum(filters.jobLevel, JOB_LEVEL);
  const workType = pickEnum(filters.workType, WORK_TYPE);
  if (jobType) conditions.push(eq(jobs.jobType, jobType));
  if (jobLevel) conditions.push(eq(jobs.jobLevel, jobLevel));
  if (workType) conditions.push(eq(jobs.workType, workType));

  return and(...conditions);
}

const jobColumns = {
  id: jobs.id,
  title: jobs.title,
  description: jobs.description,
  tags: jobs.tags,
  minSalary: jobs.minSalary,
  maxSalary: jobs.maxSalary,
  salaryCurrency: jobs.salaryCurrency,
  salaryPeriod: jobs.salaryPeriod,
  location: jobs.location,
  jobType: jobs.jobType,
  workType: jobs.workType,
  jobLevel: jobs.jobLevel,
  experience: jobs.experience,
  minEducation: jobs.minEducation,
  isFeatured: jobs.isFeatured,
  createdAt: jobs.createdAt,
  companyName: employers.name,
  companyLogo: users.avatarUrl,
  companyLocation: employers.location,
};

const PAGE_SIZE = 10;

function jobsQuery(filters: JobFilters = {}) {
  return db
    .select(jobColumns)
    .from(jobs)
    .innerJoin(employers, eq(jobs.employerId, employers.id))
    .innerJoin(users, eq(employers.id, users.id))
    .where(openJobConditions(filters))
    .orderBy(desc(jobs.isFeatured), desc(jobs.createdAt));
}

export async function getAllJobs(filters: JobFilters = {}) {
  return jobsQuery(filters);
}

export async function getJobsPage(filters: JobFilters & { page?: number } = {}) {
  const where = openJobConditions(filters);
  const [totalRow] = await db
    .select({ total: count() })
    .from(jobs)
    .innerJoin(employers, eq(jobs.employerId, employers.id))
    .innerJoin(users, eq(employers.id, users.id))
    .where(where);

  const total = Number(totalRow?.total ?? 0);
  const totalPages = total === 0 ? 0 : Math.ceil(total / PAGE_SIZE);
  const requested = Number.isInteger(filters.page) && (filters.page ?? 0) > 0 ? filters.page! : 1;
  const page = totalPages === 0 ? 1 : Math.min(requested, totalPages);

  const rows = await jobsQuery(filters)
    .limit(PAGE_SIZE)
    .offset((page - 1) * PAGE_SIZE);

  return { jobs: rows, total, page, pageSize: PAGE_SIZE, totalPages };
}

export async function getJobById(jobId: number) {
  if (!Number.isInteger(jobId) || jobId <= 0) return null;

  const [job] = await db
    .select(jobColumns)
    .from(jobs)
    .innerJoin(employers, eq(jobs.employerId, employers.id))
    .innerJoin(users, eq(employers.id, users.id))
    .where(and(eq(jobs.id, jobId), openJobConditions()))
    .limit(1);

  return job ?? null;
}

export type JobCardType = Awaited<ReturnType<typeof getAllJobs>>[number];
