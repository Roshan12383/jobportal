import { getCurrentUser } from "@/features/auth/server/auth.queries";
import { EmployerLatestJobs } from "@/features/employers/components/employer-latest-jobs";
import { Job } from "@/features/employers/jobs/types/jobs.type";
import { getEmployerDashboardCounts, getEmployerLatestJobs } from "@/features/server/employer-queries";
import EmployerProfileCompleteStatus from "@/features/employers/components/employer-profile-status";
import StatsCards from "@/features/employers/components/employer-stats";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

const EmployerDashboard=async()=>{
 const user=await getCurrentUser();
 if(!user) return redirect("/login");
 const [counts, latestJobs] = await Promise.all([
   getEmployerDashboardCounts(user.id),
   getEmployerLatestJobs(user.id),
 ]);

    return(
        <div className="space-y-6">
           <div className="space-y-2">
              <h1 className="text-2xl font-semibold text-foreground">
                 Hello, <span className="capitalize">{user?.name.toLowerCase()}</span>
              </h1>

              <p className="text-muted-foreground">
                Here is your daily activities and application
              </p>
           </div>

           <StatsCards savedCandidates={counts.savedCandidates} openJobs={counts.openJobs} />
           <EmployerProfileCompleteStatus/>
           <EmployerLatestJobs jobs={latestJobs as Job[]} />
        </div>
    )
};

export default EmployerDashboard