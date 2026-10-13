import JobForm from "@/features/employers/components/employer-jobs-form";
import { getJobByIdAction } from "@/features/server/job.action";
import Link from "next/link";
import { redirect } from "next/navigation";

interface EditJobPageProps {
  params: Promise<{ jobId: string }>;
  searchParams: Promise<{ from?: string }>;
}

function backHref(from?: string) {
  if (!from || !from.startsWith("/employer-dashboard") || from.startsWith("//") || from.includes("://")) {
    return "/employer-dashboard/jobs";
  }
  return from;
}

function toDateInput(value: Date | string | null | undefined) {
  if (!value) return "";
  if (typeof value === "string") return value.slice(0, 10);
  return value.toISOString().slice(0, 10);
}

export default async function EditJobPage({ params, searchParams }: EditJobPageProps) {
  const { jobId: jobIdParam } = await params;
  const { from } = await searchParams;
  const returnTo = backHref(from);
  const jobId = Number(jobIdParam);

  if (Number.isNaN(jobId)) redirect("/employer-dashboard/jobs");

  const { status, data: job } = await getJobByIdAction(jobId);

  if (status === "ERROR" || !job) {
    redirect("/employer-dashboard/jobs");
  }

  return (
    <div>
      <Link href={returnTo} className="mb-3 inline-flex text-sm text-gray-500 hover:text-gray-900">
        ← Back
      </Link>
      <h1 className="mb-5 text-2xl font-semibold">Edit Job</h1>
      <JobForm
        isEditMode
        returnTo={returnTo}
        initialData={{
          id: job.id,
          title: job.title,
          description: job.description ?? "",
          tags: job.tags ?? "",
          minSalary: job.minSalary ?? "",
          maxSalary: job.maxSalary ?? "",
          salaryCurrency: job.salaryCurrency ?? undefined,
          salaryPeriod: job.salaryPeriod ?? undefined,
          location: job.location ?? "",
          jobType: job.jobType ?? undefined,
          workType: job.workType ?? undefined,
          jobLevel: job.jobLevel ?? undefined,
          experience: job.experience ?? "",
          minEducation: job.minEducation ?? undefined,
          expiresAt: toDateInput(job.expiresAt),
        }}
      />
    </div>
  );
}
