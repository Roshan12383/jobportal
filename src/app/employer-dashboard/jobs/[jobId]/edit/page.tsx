import JobForm from "@/features/employers/components/employer-jobs-form";
import { getJobByIdAction } from "@/features/server/job.action";
import { redirect } from "next/navigation";

interface EditJobPageProps {
  params: Promise<{ jobId: string }>;
}

function toDateInput(value: Date | string | null | undefined) {
  if (!value) return "";
  if (typeof value === "string") return value.slice(0, 10);
  return value.toISOString().slice(0, 10);
}

export default async function EditJobPage({ params }: EditJobPageProps) {
  const { jobId: jobIdParam } = await params;
  const jobId = Number(jobIdParam);

  if (Number.isNaN(jobId)) redirect("/employer-dashboard/jobs");

  const { status, data: job } = await getJobByIdAction(jobId);

  if (status === "ERROR" || !job) {
    redirect("/employer-dashboard/jobs");
  }

  return (
    <div>
      <h1 className="mb-5 text-2xl font-semibold">Edit Job</h1>
      <JobForm
        isEditMode
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
