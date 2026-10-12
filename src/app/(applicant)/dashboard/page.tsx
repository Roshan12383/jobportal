
import { ApplicantprofileStatus } from "@/features/applicant/component/applicant-profile-status";
import { ApplicantStats } from "@/features/applicant/component/applicant-starts";
import { RecentApplications } from "@/features/applicant/component/recent-application";
import { getAppliedJobs } from "@/features/applicant/server/application.queries";
import { getSavedJobs } from "@/features/applicant/server/saved.queries";
import { getCurrentUser } from "@/features/auth/server/auth.queries";
import { redirect } from "next/navigation";

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

function dateKey(value: Date | string) {
    if (typeof value === "string") return value.slice(0, 10);
    const month = String(value.getMonth() + 1).padStart(2, "0");
    const day = String(value.getDate()).padStart(2, "0");
    return `${value.getFullYear()}-${month}-${day}`;
}

function applicationStatus(job: {
    expiresAt: Date | string | null;
    deletedAt: Date | string | null;
}) {
    if (job.deletedAt) return "Expired";
    if (!job.expiresAt) return "Active";

    return dateKey(job.expiresAt) < dateKey(new Date()) ? "Expired" : "Active";
}

export default async function ApplicantDashboard() {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/login");
    }

    const [appliedJobs, savedJobs] = await Promise.all([getAppliedJobs(), getSavedJobs()]);
    const applications = appliedJobs.slice(0, 4).map((job) => ({
        id: job.id,
        jobId: job.jobId,
        title: job.title,
        companyName: job.companyName?.trim() || "Unknown Company",
        location: job.location,
        workType: job.workType || "full-time",
        salary: formatSalary(job),
        status: applicationStatus(job),
        appliedAt: new Date(job.appliedAt).toISOString(),
    }));

    return (
        <div className="mx-auto max-w-7xl space-y-8 p-6">
            {/* Header */}
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
                    Hello,{" "}
                    <span className="capitalize">{user.name}</span>
                </h1>

                <p className="text-gray-500">
                    Here is your daily activities and job alerts
                </p>
            </div>

            {/* Statistics */}
            <ApplicantStats
                appliedJobs={appliedJobs.length}
                favoriteJobs={savedJobs.length}
                jobAlerts={0}
            />

            {/* Profile Completion */}
            <ApplicantprofileStatus />

            {/* Recently Applied Jobs */}
            <RecentApplications applications={applications} />
        </div>
    );
}
