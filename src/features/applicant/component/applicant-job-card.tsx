import { Banknote, Briefcase, Clock, MapPin, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { JobCardType } from "../server/job.queries";
import { ApplyJobButton } from "./apply-job-button";
import { SaveJobButton } from "./save-job-button";
import { ApplicantResumeOption } from "../server/application.queries";

interface JobCardProps {
  job: JobCardType;
  resumes: ApplicantResumeOption[];
  alreadyApplied: boolean;
  saved: boolean;
  returnTo: string;
}

function formatSalary(job: JobCardType) {
  const currency = job.salaryCurrency || "INR";
  const period = job.salaryPeriod ? ` / ${job.salaryPeriod}` : "";
  const amount = (value: number) => value.toLocaleString("en-IN");

  if (job.minSalary != null && job.maxSalary != null) {
    return `${currency} ${amount(job.minSalary)} - ${amount(job.maxSalary)}${period}`;
  }
  if (job.minSalary != null) return `${currency} ${amount(job.minSalary)}+${period}`;
  if (job.maxSalary != null) return `Up to ${currency} ${amount(job.maxSalary)}${period}`;
  return "Not Disclosed";
}

export const JobCard = ({ job, resumes, alreadyApplied, saved, returnTo }: JobCardProps) => {
  const company = job.companyName?.trim() || "Company";

  return (
    <div className="group relative rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-sm transition-all hover:border-blue-500/30 hover:shadow-md">
      <div className="mb-3 flex flex-wrap items-center justify-end gap-2 sm:absolute sm:top-3 sm:right-4 sm:z-10 sm:mb-0">
        <SaveJobButton jobId={job.id} saved={saved} />
        <ApplyJobButton
          jobId={job.id}
          jobTitle={job.title}
          resumes={resumes}
          alreadyApplied={alreadyApplied}
        />
      </div>
      <Link href={`/dashboard/jobs/${job.id}?from=${encodeURIComponent(returnTo)}`} className="block">
        <div className="flex items-center gap-3 sm:pr-56">
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-gray-100 bg-gray-50">
            {job.companyLogo ? (
              <Image
                src={job.companyLogo}
                alt={`${company} logo`}
                fill
                sizes="40px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs font-bold text-gray-500">
                {company.slice(0, 2).toUpperCase()}
              </div>
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="truncate font-semibold text-gray-900 group-hover:text-blue-600">
                {job.title}
              </h3>
              {job.isFeatured && (
                <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-600">
                  <Sparkles className="h-3 w-3" />
                  Featured
                </span>
              )}
            </div>
            <p className="truncate text-xs text-gray-500">{company}</p>
          </div>
        </div>

        <div className="mt-2.5 flex flex-wrap gap-1.5 text-xs font-medium text-gray-600">
          <div className="flex items-center gap-1 rounded-md border border-gray-100 bg-gray-50 px-2 py-0.5">
            <MapPin className="h-3 w-3 text-gray-400" />
            <span>{job.location || job.companyLocation || "Remote"}</span>
          </div>
          <div className="flex items-center gap-1 rounded-md border border-gray-100 bg-gray-50 px-2 py-0.5">
            <Briefcase className="h-3 w-3 text-gray-400" />
            <span>{job.workType?.replace("-", " ").toUpperCase() || "FULL TIME"}</span>
          </div>
          {job.jobType && (
            <div className="rounded-md border border-gray-100 bg-gray-50 px-2 py-0.5">
              {job.jobType.replace("-", " ").toUpperCase()}
            </div>
          )}
          <div className="flex items-center gap-1 rounded-md border border-gray-100 bg-gray-50 px-2 py-0.5">
            <Banknote className="h-3 w-3 text-gray-400" />
            <span>{formatSalary(job)}</span>
          </div>
        </div>

        <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 text-gray-400" />
            Posted{" "}
            {job.createdAt
              ? formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })
              : "recently"}
          </span>
          <span className="font-medium text-blue-600 group-hover:underline">View Details &rarr;</span>
        </div>
      </Link>
    </div>
  );
};
