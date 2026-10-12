import { JobsPagination, jobsPageHref } from "@/components/jobs-pagination";
import { JobFilters } from "@/features/applicant/component/job-filters";
import { PublicJobCard } from "@/features/public/public-job-card";
import { getJobsPage } from "@/features/applicant/server/job.queries";

export const dynamic = "force-dynamic";

type JobsPageProps = {
  searchParams: Promise<{
    search?: string;
    jobType?: string;
    jobLevel?: string;
    workType?: string;
    page?: string;
  }>;
};

export default async function PublicJobsPage({ searchParams }: JobsPageProps) {
  const params = await searchParams;
  const search = params.search?.trim() ?? "";
  const jobType = params.jobType ?? "";
  const jobLevel = params.jobLevel ?? "";
  const workType = params.workType ?? "";
  const requestedPage = Number(params.page);
  const result = await getJobsPage({
    search,
    jobType: jobType || undefined,
    jobLevel: jobLevel || undefined,
    workType: workType || undefined,
    page: Number.isInteger(requestedPage) ? requestedPage : 1,
  });
  const query: Record<string, string> = {};
  if (search) query.search = search;
  if (jobType) query.jobType = jobType;
  if (jobLevel) query.jobLevel = jobLevel;
  if (workType) query.workType = workType;
  const returnTo = jobsPageHref("/jobs", query, result.page);

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Find your Next Dream Job</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Browse latest job openings from top companies.
        </p>
      </div>
      <JobFilters search={search} jobType={jobType} jobLevel={jobLevel} workType={workType} />
      {result.jobs.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {result.jobs.map((job) => (
            <PublicJobCard key={job.id} job={job} mode="login" returnTo={returnTo} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border py-16 text-center text-sm text-muted-foreground">
          No jobs found. Try another search.
        </div>
      )}
      <JobsPagination
        page={result.page}
        totalPages={result.totalPages}
        hrefFor={(next) => jobsPageHref("/jobs", query, next)}
      />
    </div>
  );
}
