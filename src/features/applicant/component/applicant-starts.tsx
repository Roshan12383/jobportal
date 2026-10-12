import { Card, CardContent } from "@/components/ui/card";
import { Bell, Bookmark, Briefcase } from "lucide-react";

export const ApplicantStats = ({
    appliedJobs,
    favoriteJobs,
    jobAlerts,
}: {
    appliedJobs: number;
    favoriteJobs: number;
    jobAlerts: number;
}) => {
    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Card 1: Applied Jobs (Blue) */}
            <Card className="border-blue-100 bg-blue-50 shadow-sm">
                <CardContent className="flex items-center justify-between p-6">
                    <div>
                        <p className="text-3xl font-semibold text-gray-900">
                            {appliedJobs}
                        </p>

                        <p className="text-sm font-medium text-gray-500">
                            Applied Jobs
                        </p>
                    </div>

                    <div className="rounded-lg bg-white p-3 shadow-sm">
                        <Briefcase className="h-6 w-6 text-blue-600" />
                    </div>
                </CardContent>
            </Card>



            <Card className="border-orange-100 bg-orange-50 shadow-sm">
                <CardContent className="flex items-center justify-between p-6">
                    <div>
                        <p className="text-3xl font-semibold text-gray-900">
                            {favoriteJobs}
                        </p>

                        <p className="text-sm font-medium text-gray-500">
                            Favorite Jobs
                        </p>
                    </div>

                    <div className="rounded-lg bg-white p-3 shadow-sm">
                        <Bookmark className="h-6 w-6 text-blue-600" />
                    </div>
                </CardContent>
            </Card>



            <Card className="border-green-100 bg-green-50 shadow-sm">
                <CardContent className="flex items-center justify-between p-6">
                    <div>
                        <p className="text-3xl font-semibold text-gray-900">
                            {jobAlerts}
                        </p>

                        <p className="text-sm font-medium text-gray-500">
                            Jobs Alert
                        </p>
                    </div>

                    <div className="rounded-lg bg-white p-3 shadow-sm">
                        <Bell className="h-6 w-6 text-blue-600" />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};