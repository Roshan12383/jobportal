
"use client";

import Link from "next/link";
import {
    ArrowRight,
    MapPin,
    Briefcase,
    CircleCheck,
    CircleX,
} from "lucide-react";
import { format } from "date-fns";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";

export interface Application {
    id: number;
    jobId: number;
    title: string;
    companyName: string;
    location: string | null;
    workType: string;
    salary: string;
    status: string;
    appliedAt: Date | string;
}

interface RecentApplicationsProps {
    applications: Application[];
}

export function RecentApplications({
    applications,
}: RecentApplicationsProps) {
    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 p-6">
                <h2 className="font-semibold text-gray-900">
                    Recently Applied
                </h2>

                <Link
                    href="/dashboard/applied-jobs"
                    className="flex items-center gap-1 text-sm font-medium text-gray-500 transition-colors hover:text-blue-600"
                >
                    View all
                    <ArrowRight className="h-4 w-4" />
                </Link>
            </div>

            {/* Applications Table */}
            {applications.length > 0 ? (
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                                <TableHead className="w-[40%] pl-6">
                                    Job
                                </TableHead>

                                <TableHead>Date Applied</TableHead>

                                <TableHead>Status</TableHead>

                                <TableHead className="pr-6 text-right">
                                    Action
                                </TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {applications.slice(0, 4).map((application) => (
                                <TableRow key={application.id}>
                                    {/* Job Information */}
                                    <TableCell className="py-4 pl-6">
                                        <div className="flex items-start gap-4">
                                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-xs font-bold text-gray-500">
                                                {application.companyName
                                                    .slice(0, 2)
                                                    .toUpperCase()}
                                            </div>

                                            <div className="min-w-0 space-y-1">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <p className="font-medium text-gray-900">
                                                        {application.title}
                                                    </p>

                                                    <Badge
                                                        variant="secondary"
                                                        className="bg-blue-50 text-blue-600 hover:bg-blue-50"
                                                    >
                                                        {application.workType
                                                            .replace(/-/g, " ")
                                                            .replace(/\b\w/g, (char) =>
                                                                char.toUpperCase()
                                                            )}
                                                    </Badge>
                                                </div>

                                                <p className="text-sm text-gray-500">
                                                    <MapPin className="mr-1 inline h-3 w-3" />
                                                    {application.location || "Remote"}
                                                    <span className="mx-2">·</span>
                                                    {application.salary}
                                                </p>
                                            </div>
                                        </div>
                                    </TableCell>

                                    {/* Date Applied */}
                                    <TableCell className="whitespace-nowrap text-sm text-gray-500">
                                        {format(
                                            new Date(application.appliedAt),
                                            "MMM d, yyyy HH:mm"
                                        )}
                                    </TableCell>

                                    {/* Status */}
                                    <TableCell>
                                        {application.status.toLowerCase() === "expired" ? (
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

                                    {/* Action */}
                                    <TableCell className="pr-6 text-right">
                                        <Link
                                            href={`/dashboard/jobs/${application.jobId}?from=${encodeURIComponent("/dashboard")}`}
                                            className="inline-flex h-9 items-center justify-center whitespace-nowrap rounded-md border border-gray-200 bg-white px-3 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50 hover:text-blue-700"
                                        >
                                            View Details
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            ) : (
                /* Empty State */
                <div className="flex flex-col items-center justify-center gap-3 px-6 py-12 text-center">
                    <div className="rounded-full bg-gray-100 p-4">
                        <Briefcase className="h-7 w-7 text-gray-400" />
                    </div>

                    <h3 className="font-semibold text-gray-900">
                        No applications yet
                    </h3>

                    <p className="max-w-sm text-sm text-gray-500">
                        You haven't applied to any jobs yet.
                        Explore available jobs and submit your first application.
                    </p>

                    <Link
                        href="/dashboard/jobs"
                        className="mt-1 inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                        Explore Jobs
                    </Link>
                </div>
            )}
        </div>
    );
}
