import { ApplyJobButton } from "@/features/applicant/component/apply-job-button";
import { ApplicantResumeOption } from "@/features/applicant/server/application.queries";
import { JobCardType } from "@/features/applicant/server/job.queries";
import { formatDistanceToNow } from "date-fns";
import { Briefcase, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type PublicJobCardProps = {
  job: JobCardType;
  mode: "login" | "apply" | "hidden";
  resumes?: ApplicantResumeOption[];
  alreadyApplied?: boolean;
  returnTo?: string;
};

function detailsHref(jobId: number, returnTo?: string) {
  if (!returnTo) return `/jobs/${jobId}`;
  return `/jobs/${jobId}?from=${encodeURIComponent(returnTo)}`;
}

export function PublicJobCard({
  job,
  mode,
  resumes = [],
  alreadyApplied = false,
  returnTo,
}: PublicJobCardProps) {
  const detailsUrl = detailsHref(job.id, returnTo);
  const company = job.companyName?.trim() || "Company";
  const place = job.location || job.companyLocation || "Remote";

  return (
    <article className="flex h-full flex-col rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
          {job.companyLogo ? (
            <Image src={job.companyLogo} alt="" fill sizes="40px" className="object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs font-bold text-muted-foreground">
              {company.slice(0, 1).toUpperCase()}
            </div>
          )}
        </div>
        <div className="min-w-0">
          <Link href={detailsUrl} className="block truncate font-semibold text-blue-600 hover:underline">
            {job.title}
          </Link>
          <p className="mt-1 text-xs text-muted-foreground">
            {job.workType?.replaceAll("-", " ") || "remote"}
            {" · "}
            {job.createdAt
              ? formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })
              : "recently"}
          </p>
        </div>
      </div>

      <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
        <MapPin className="h-4 w-4" />
        <span className="truncate">{place}</span>
      </p>
      <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
        <Briefcase className="h-4 w-4" />
        <span className="truncate">{company}</span>
      </p>

      <div className="mt-4">
        {mode === "apply" ? (
          <ApplyJobButton
            jobId={job.id}
            jobTitle={job.title}
            resumes={resumes}
            alreadyApplied={alreadyApplied}
          />
        ) : mode === "login" ? (
          <Link
            href="/login"
            className="inline-flex h-9 w-full items-center justify-center rounded-lg bg-blue-50 text-sm font-medium text-blue-600 hover:bg-blue-100"
          >
            Login to apply
          </Link>
        ) : null}
        <Link href={detailsUrl} className="mt-2 block text-center text-xs text-muted-foreground hover:text-foreground">
          View details
        </Link>
      </div>
    </article>
  );
}
