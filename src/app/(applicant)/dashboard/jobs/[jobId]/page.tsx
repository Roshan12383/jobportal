import { ApplyJobButton } from "@/features/applicant/component/apply-job-button";
import { SaveJobButton } from "@/features/applicant/component/save-job-button";
import { getApplyJobContext } from "@/features/applicant/server/application.queries";
import { getJobById } from "@/features/applicant/server/job.queries";
import { getSavedJobIds } from "@/features/applicant/server/saved.queries";
import { formatDistanceToNow } from "date-fns";
import { Banknote, Briefcase, Clock, GraduationCap, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type JobPageProps = {
  params: Promise<{ jobId: string }>;
  searchParams: Promise<{ from?: string }>;
};

function backHref(from?: string) {
  if (!from || !from.startsWith("/dashboard") || from.startsWith("//") || from.includes("://")) {
    return "/dashboard/jobs";
  }
  return from;
}

export default async function ApplicantJobPage({ params, searchParams }: JobPageProps) {
  const { jobId: jobIdParam } = await params;
  const { from } = await searchParams;
  const jobId = Number(jobIdParam);
  const [job, applyContext, savedJobIds] = await Promise.all([
    Number.isInteger(jobId) ? getJobById(jobId) : Promise.resolve(null),
    getApplyJobContext(),
    getSavedJobIds(),
  ]);

  if (!job) notFound();

  const company = job.companyName?.trim() || "Company";
  const place = [job.location, job.companyLocation].filter(Boolean).join(" / ") || "Remote";
  const tags = (job.tags ?? "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
  const currency = job.salaryCurrency || "INR";
  const period = job.salaryPeriod ? ` / ${job.salaryPeriod}` : "";
  const salary =
    job.minSalary != null && job.maxSalary != null
      ? `${currency} ${job.minSalary.toLocaleString("en-IN")} - ${job.maxSalary.toLocaleString("en-IN")}${period}`
      : job.minSalary != null
        ? `${currency} ${job.minSalary.toLocaleString("en-IN")}+${period}`
        : job.maxSalary != null
          ? `Up to ${currency} ${job.maxSalary.toLocaleString("en-IN")}${period}`
          : "Not Disclosed";

  return (
    <div className="space-y-4 px-6 pt-1 pb-6">
      <Link href={backHref(from)} className="-ml-4 inline-flex text-sm text-gray-500 hover:text-gray-900">
        ← Back
      </Link>

      <div className="grid max-w-5xl items-start gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
      <header className="flex items-start gap-4 border-b border-gray-100 pb-6 lg:col-span-2">
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
          {job.companyLogo ? (
            <Image
              src={job.companyLogo}
              alt={`${company} logo`}
              fill
              sizes="56px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm font-bold text-gray-500">
              {company.slice(0, 2).toUpperCase()}
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">{job.title}</h1>
          <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500">
            <span className="inline-flex items-center gap-1">
              <Briefcase className="h-3.5 w-3.5" />
              {company}
            </span>
            <span>·</span>
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {place}
            </span>
            <span>·</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              Posted {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
            </span>
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <SaveJobButton jobId={job.id} saved={savedJobIds.includes(job.id)} />
          <ApplyJobButton
            jobId={job.id}
            jobTitle={job.title}
            resumes={applyContext.resumes}
            alreadyApplied={applyContext.appliedJobIds.includes(job.id)}
          />
        </div>
      </header>

      <div className="-ml-4 space-y-8">
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900">About the Job</h2>
        <div
          className="prose prose-gray max-w-none text-gray-600 prose-headings:text-gray-900 prose-li:my-1"
          dangerouslySetInnerHTML={{ __html: sanitizeJobHtml(job.description) }}
        />
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-bold text-gray-900">How to Apply</h2>
        <p className="text-gray-600">
          Send your CV + portfolio/GitHub with your expected salary.
        </p>
      </section>

      {tags.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xs font-semibold tracking-wide text-gray-900 uppercase">
            Skills & Technologies
          </h2>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600"
              >
                {tag}
              </span>
            ))}
          </div>
        </section>
      )}
      </div>

      <aside className="sticky top-6 h-fit space-y-3 self-start rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-gray-900">Role snapshot</h2>
        <Snapshot icon={Banknote} label="Salary" value={salary} />
        <Snapshot icon={MapPin} label="Location" value={place} />
        <Snapshot icon={Briefcase} label="Work type" value={job.workType?.replaceAll("-", " ") || "Not listed"} />
        <Snapshot icon={Briefcase} label="Job type" value={job.jobType?.replaceAll("-", " ") || "Not listed"} />
        <Snapshot icon={Clock} label="Experience" value={job.experience || "Not listed"} />
        <Snapshot icon={GraduationCap} label="Education" value={job.minEducation || "Not listed"} />
      </aside>
      </div>
    </div>
  );
}

function Snapshot({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof MapPin;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 px-3 py-2">
      <p className="flex items-center gap-1 text-[11px] text-gray-400">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </p>
      <p className="mt-1 text-sm font-medium text-gray-800 capitalize">{value}</p>
    </div>
  );
}

function sanitizeJobHtml(html: string) {
  return html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/javascript:/gi, "");
}
