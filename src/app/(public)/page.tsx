import { PublicJobCard } from "@/features/public/public-job-card";
import { getAllJobs } from "@/features/applicant/server/job.queries";
import { Search } from "lucide-react";

export const dynamic = "force-dynamic";

type HomePageProps = {
  searchParams: Promise<{ search?: string }>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const search = params.search?.trim() ?? "";
  const jobs = await getAllJobs(search ? { search } : {});
  const featured = (jobs.some((job) => job.isFeatured) ? jobs.filter((job) => job.isFeatured) : jobs).slice(0, 6);
  const visibleJobs = search ? jobs : featured;
  const returnTo = search ? `/?search=${encodeURIComponent(search)}` : "/";

  return (
    <div>
      <section className="px-4 py-20 text-center">
        <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          Find a job that suits your interest & skills.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground">
          Discover job openings from top companies. Your next career move starts right here.
        </p>
        <form action="/" className="mx-auto mt-8 flex max-w-2xl items-center gap-2 rounded-full border border-border bg-card p-2 shadow-sm">
          <label className="relative flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              name="search"
              defaultValue={search}
              placeholder="Job title, keyword..."
              className="h-11 w-full bg-transparent pr-3 pl-10 text-sm outline-none"
            />
          </label>
          <button type="submit" className="h-11 rounded-full bg-foreground px-5 text-sm font-medium text-background">
            Search Jobs
          </button>
        </form>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-8">
        <h2 className="text-2xl font-bold text-foreground">
          {search ? `Results for “${search}”` : "Featured Jobs"}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {search
            ? `${jobs.length} open ${jobs.length === 1 ? "job" : "jobs"} matched your search.`
            : "Know your worth and find the job that qualifies your life"}
        </p>
        {visibleJobs.length > 0 ? (
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visibleJobs.map((job) => (
              <PublicJobCard key={job.id} job={job} mode="login" returnTo={returnTo} />
            ))}
          </div>
        ) : (
          <p className="mt-6 text-sm text-muted-foreground">
            {search ? "No jobs found. Try another search." : "No open jobs right now."}
          </p>
        )}
      </section>
    </div>
  );
}
