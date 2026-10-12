import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Job } from "@/features/employers/jobs/types/jobs.type";
import { format } from "date-fns";
import { ArrowRight, Briefcase, CircleCheck, CircleX, MapPin } from "lucide-react";
import Link from "next/link";

function dateKey(value: Date | string) {
  if (typeof value === "string") return value.slice(0, 10);
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${value.getFullYear()}-${month}-${day}`;
}

function jobStatus(job: Pick<Job, "expiresAt" | "deletedAt">) {
  if (job.deletedAt) return "Expired";
  if (!job.expiresAt) return "Active";
  return dateKey(job.expiresAt) < dateKey(new Date()) ? "Expired" : "Active";
}

function formatSalary(job: Job) {
  const currency = job.salaryCurrency || "INR";
  const period =
    job.salaryPeriod === "monthly" ? "/mo" : job.salaryPeriod === "yearly" ? "/yr" : job.salaryPeriod === "hourly" ? "/hr" : "";
  const amount = (value: number) => value.toLocaleString("en-IN");

  if (job.minSalary != null && job.maxSalary != null) {
    return `${currency} ${amount(job.minSalary)}-${amount(job.maxSalary)}${period}`;
  }
  if (job.minSalary != null) return `${currency} ${amount(job.minSalary)}+${period}`;
  if (job.maxSalary != null) return `Up to ${currency} ${amount(job.maxSalary)}${period}`;
  return "Not Disclosed";
}

export function EmployerLatestJobs({ jobs }: { jobs: Job[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 p-6">
        <h2 className="font-semibold text-gray-900">My Jobs</h2>
        <Link
          href="/employer-dashboard/jobs"
          className="flex items-center gap-1 text-sm font-medium text-gray-500 transition-colors hover:text-blue-600"
        >
          View all
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {jobs.length > 0 ? (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                <TableHead className="w-[40%] pl-6">Job</TableHead>
                <TableHead>Date Posted</TableHead>
                <TableHead className="pr-6">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobs.map((job) => {
                const status = jobStatus(job);
                const label = job.title.trim() || "Job";

                return (
                  <TableRow key={job.id}>
                    <TableCell className="py-4 pl-6">
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-xs font-bold text-gray-500">
                          {label.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0 space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-medium text-gray-900">{label}</p>
                            {job.workType && (
                              <Badge
                                variant="secondary"
                                className="bg-blue-50 text-blue-600 hover:bg-blue-50"
                              >
                                {job.workType
                                  .replace(/-/g, " ")
                                  .replace(/\b\w/g, (char) => char.toUpperCase())}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-500">
                            <MapPin className="mr-1 inline h-3 w-3" />
                            {job.location || "Remote"}
                            <span className="mx-1">·</span>
                            {formatSalary(job)}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(job.createdAt), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="pr-6">
                      {status === "Expired" ? (
                        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-red-500">
                          <CircleX className="h-4 w-4" />
                          Expired
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600">
                          <CircleCheck className="h-4 w-4" />
                          Active
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-3 px-6 py-12 text-center">
          <div className="rounded-full bg-gray-100 p-4">
            <Briefcase className="h-7 w-7 text-gray-400" />
          </div>
          <h3 className="font-semibold text-gray-900">No jobs posted yet</h3>
          <p className="max-w-sm text-sm text-gray-500">
            Jobs you post will show up here, one on each row.
          </p>
          <Link
            href="/employer-dashboard/jobs/create"
            className="mt-1 inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Post a Job
          </Link>
        </div>
      )}
    </div>
  );
}
