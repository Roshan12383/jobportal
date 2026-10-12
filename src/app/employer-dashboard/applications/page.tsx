import { buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getCurrentUser } from "@/features/auth/server/auth.queries";
import { ApplicationRoleFilter } from "@/features/employers/components/application-role-filter";
import { CoverLetterButton } from "@/features/employers/components/cover-letter-button";
import { getEmployerApplication } from "@/features/server/employer.application";
import { formatDistanceToNowStrict } from "date-fns";
import { cn } from "@/lib/utils";
import { Download, User } from "lucide-react";
import Image from "next/image";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

type ApplicationsPageProps = {
  searchParams: Promise<{ role?: string }>;
};

export default async function EmployerApplicationsPage({ searchParams }: ApplicationsPageProps) {
  const user = await getCurrentUser();
  if (!user || user.role !== "employer") return redirect("/login");

  const { role: roleParam } = await searchParams;
  const applications = await getEmployerApplication(user.id);
  const role = roleParam?.trim() ?? "";
  const visibleApplications = role
    ? applications.filter((application) =>
        application.jobTitle.toLowerCase().includes(role.toLowerCase()),
      )
    : applications;

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold text-foreground">Received Applications</h1>
          <ApplicationRoleFilter query={role} />
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Review and manage candidates who applied to your job postings.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50">
              <TableHead className="pl-6">Candidate</TableHead>
              <TableHead>Applied Role</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="pr-6 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visibleApplications.length > 0 ? (
              visibleApplications.map((application) => {
                const name = application.applicantName?.trim() || "Applicant";
                const workType = application.workType?.replaceAll("-", " ") || "not listed";

                return (
                  <TableRow key={application.id}>
                    <TableCell className="py-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-gray-100 bg-gray-50">
                          {application.applicantAvatar ? (
                            <Image
                              src={application.applicantAvatar}
                              alt={name}
                              fill
                              sizes="40px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-gray-400">
                              <User className="h-4 w-4" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold uppercase text-gray-900">
                            {name}
                          </p>
                          <p className="truncate text-xs text-gray-500">
                            {application.applicantEmail || "No email"}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium text-gray-900">{application.jobTitle}</p>
                      <span className="mt-1 inline-flex rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
                        {workType}
                      </span>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-sm text-gray-500">
                      {formatDistanceToNowStrict(new Date(application.appliedAt), { addSuffix: true })}
                    </TableCell>
                    <TableCell className="pr-6">
                      <div className="flex items-center justify-end gap-2">
                        <CoverLetterButton name={name} letter={application.coverLetter} />
                        <a
                          href={application.resumeUrl}
                          target="_blank"
                          rel="noreferrer"
                          className={cn(
                            buttonVariants(),
                            "bg-blue-600 text-white hover:bg-blue-700",
                          )}
                        >
                          <Download className="h-4 w-4" />
                          Resume
                        </a>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="py-12 text-center text-sm text-gray-500">
                  {role
                    ? `No applications found for “${role}”.`
                    : "No applications yet. Candidates who apply to your jobs will show up here."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
