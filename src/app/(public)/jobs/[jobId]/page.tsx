import { getJobById } from "@/features/applicant/server/job.queries";
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
  if (!from || !from.startsWith("/") || from.startsWith("//") || from.includes("://")) return "/jobs";
  return from;
}

export default async function PublicJobPage({ params, searchParams }: JobPageProps) {
  const { jobId: jobIdParam } = await params;
  const { from } = await searchParams;
  const jobId = Number(jobIdParam);
  const job = Number.isInteger(jobId) ? await getJobById(jobId) : null;

  if (!job) notFound();
  const company = job.companyName?.trim() || "Company";
  const place = [job.location, job.companyLocation].filter(Boolean).join(" / ") || "Remote";
  const tags = (job.tags ?? "").split(",").map((tag) => tag.trim()).filter(Boolean);
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
    <div className="mx-auto max-w-5xl space-y-4 px-4 py-8">
      <Link href={backHref(from)} className="inline-flex text-sm text-muted-foreground hover:text-foreground">
        ← Back
      </Link>
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
        <header className="flex flex-col items-start gap-4 border-b border-border pb-6 sm:flex-row lg:col-span-2">
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-border bg-muted">
            {job.companyLogo ? (
              <Image src={job.companyLogo} alt="" fill sizes="56px" className="object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm font-bold text-muted-foreground">
                {company.slice(0, 2).toUpperCase()}
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold text-foreground">{job.title}</h1>
            <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1"><Briefcase className="h-3.5 w-3.5" />{company}</span>
              <span>·</span>
              <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{place}</span>
              <span>·</span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                Posted {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
              </span>
            </p>
          </div>
          <Link
            href="/login"
            className="inline-flex h-9 shrink-0 items-center rounded-lg bg-foreground px-4 text-sm font-medium text-background"
          >
            Login to apply
          </Link>
        </header>

        <div className="space-y-8">
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-foreground">About the Job</h2>
            <div
              className="prose prose-gray max-w-none text-muted-foreground prose-headings:text-foreground"
              dangerouslySetInnerHTML={{ __html: sanitizeJobHtml(job.description) }}
            />
          </section>
          {tags.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-xs font-semibold tracking-wide text-foreground uppercase">Skills & Technologies</h2>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground">{tag}</span>
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className="sticky top-24 h-fit space-y-3 self-start rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h2 className="font-semibold text-foreground">Role snapshot</h2>
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

function Snapshot({ icon: Icon, label, value }: { icon: typeof MapPin; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-muted px-3 py-2">
      <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </p>
      <p className="mt-1 text-sm font-medium capitalize text-foreground">{value}</p>
    </div>
  );
}

function sanitizeJobHtml(html: string) {
  return html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/javascript:/gi, "");
}
