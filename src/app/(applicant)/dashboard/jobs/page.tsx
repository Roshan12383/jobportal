import { JobsPagination, jobsPageHref } from "@/components/jobs-pagination";
import { JobCard } from "@/features/applicant/component/applicant-job-card";
import { JobFilters } from "@/features/applicant/component/job-filters";
import { getApplyJobContext } from "@/features/applicant/server/application.queries";
import { getJobsPage } from "@/features/applicant/server/job.queries";
import { getSavedJobIds } from "@/features/applicant/server/saved.queries";

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

export default async function JobsPage({ searchParams }: JobsPageProps) {
  const params = await searchParams;
  const search = params.search?.trim() ?? "";
  const jobType = params.jobType ?? "";
  const jobLevel = params.jobLevel ?? "";
  const workType = params.workType ?? "";
  const requestedPage = Number(params.page);
  const [result, applyContext, savedJobIds] = await Promise.all([
    getJobsPage({
      search,
      jobType: jobType || undefined,
      jobLevel: jobLevel || undefined,
      workType: workType || undefined,
      page: Number.isInteger(requestedPage) ? requestedPage : 1,
    }),
    getApplyJobContext(),
    getSavedJobIds(),
  ]);

  const query: Record<string, string> = {};
  if (search) query.search = search;
  if (jobType) query.jobType = jobType;
  if (jobLevel) query.jobLevel = jobLevel;
  if (workType) query.workType = workType;

  return (
    <div className="space-y-5 p-4 sm:p-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Find your Next Dream Job
        </h1>
        <p className="text-sm text-gray-500">
          Browse latest job openings from top companies.
        </p>
      </div>

      <JobFilters
        search={search}
        jobType={jobType}
        jobLevel={jobLevel}
        workType={workType}
      />

      {result.jobs.length > 0 ? (
        <div className="grid max-w-5xl grid-cols-1 gap-3">
          {result.jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              resumes={applyContext.resumes}
              alreadyApplied={applyContext.appliedJobIds.includes(job.id)}
              saved={savedJobIds.includes(job.id)}
              returnTo={jobsPageHref("/dashboard/jobs", query, result.page)}
            />
          ))}
        </div>
      ) : (
        <div className="flex h-[350px] max-w-5xl flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50 text-center">
          <h3 className="mt-2 text-base font-semibold text-gray-900">No Jobs Found</h3>
          <p className="text-sm text-gray-500">
            Try another search, or clear the filters to see every open role.
          </p>
        </div>
      )}

      <div className="max-w-5xl">
        <JobsPagination
          page={result.page}
          totalPages={result.totalPages}
          hrefFor={(next) => jobsPageHref("/dashboard/jobs", query, next)}
        />
      </div>
    </div>
  );
}
