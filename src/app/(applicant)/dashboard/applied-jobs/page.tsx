import { getAppliedJobs } from "@/features/applicant/server/application.queries";
import { formatDistanceToNow } from "date-fns";
import { Banknote, Briefcase, CircleCheck, Clock, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const dynamic = "force-dynamic";

function formatSalary(job: {
  minSalary: number | null;
  maxSalary: number | null;
  salaryCurrency: string | null;
  salaryPeriod: string | null;
}) {
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

export default async function AppliedJobsPage() {
  const applications = await getAppliedJobs();
  const count = applications.length;
  const jobLabel = count === 1 ? "job" : "jobs";

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Applied Jobs</h1>
        <p className="mt-1 text-sm text-gray-500">
          You have applied for {count} {jobLabel}.
        </p>
      </div>

      {count > 0 ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,320px))] gap-6">
          {applications.map((application) => {
            const company = application.companyName?.trim() || "Unknown Company";
            const place = application.location?.trim() || "Remote";

            return (
              <article
                key={application.id}
                className="flex flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="relative h-10 w-10 overflow-hidden rounded-lg border border-gray-100 bg-gray-50">
                    {application.companyLogo ? (
                      <Image
                        src={application.companyLogo}
                        alt={`${company} logo`}
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-gray-400">
                        <Briefcase className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600">
                    <CircleCheck className="h-3.5 w-3.5" />
                    Applied
                  </span>
                </div>

                <h2 className="mt-4 truncate font-semibold text-gray-900">{application.title}</h2>
                <p className="mt-1 truncate text-sm text-blue-600">{company}</p>

                <div className="mt-4 space-y-2 text-sm text-gray-500">
                  <p className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 shrink-0 text-gray-400" />
                    <span className="truncate uppercase">{place}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Banknote className="h-4 w-4 shrink-0 text-gray-400" />
                    <span className="truncate">{formatSalary(application)}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock className="h-4 w-4 shrink-0 text-gray-400" />
                    <span>
                      Applied {formatDistanceToNow(new Date(application.appliedAt), { addSuffix: true })}
                    </span>
                  </p>
                </div>

                <Link
                  href={`/dashboard/jobs/${application.jobId}?from=${encodeURIComponent("/dashboard/applied-jobs")}`}
                  className="mt-5 inline-flex h-9 items-center justify-center rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  View Job Details
                </Link>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="flex h-64 max-w-xl flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50 text-center">
          <h2 className="text-base font-semibold text-gray-900">No applications yet</h2>
          <p className="mt-1 text-sm text-gray-500">Jobs you apply to will show up here.</p>
        </div>
      )}
    </div>
  );
}
