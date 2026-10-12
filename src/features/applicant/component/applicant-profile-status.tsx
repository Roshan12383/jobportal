import { Button } from "@/components/ui/button";
import { getApplicantSettings } from "@/features/applicant/server/settings";
import { ArrowRight, UserCircle } from "lucide-react";
import Link from "next/link";

export async function ApplicantprofileStatus(){
    const profileData = await getApplicantSettings();

const isCompleted = !!(
  profileData?.location &&
  profileData?.biography &&
  profileData?.experience &&
  profileData?.resumeUrl
);

if (isCompleted) {
  return null;
}
   return (
    <div className="relative overflow-hidden rounded-xl bg-red-500 p-6 text-white shadow-md">
        {/* Decorative Circles */}
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
        <div className="absolute right-20 -bottom-[50px] h-24 w-24 rounded-full bg-white/10" />

        <div className="relative flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-red-400">
                    <UserCircle className="h-10 w-10 text-white" />
                </div>

                <div>
                    <h3 className="text-lg font-semibold">
                        Your profile editing is not completed.
                    </h3>

                    <p className="mt-1 text-sm text-red-100">
                        Complete your profile editing &amp; build your custom
                        Resume to get better job recommendations.
                    </p>
                </div>
            </div>


            <Link href="/dashboard/settings">
            <Button variant="secondary" className="whitespace-nowrap bg-white text-red-600 hover:bg-gray-100 font-semibold">
                    Edit Profile
            <ArrowRight className="ml-2 h-4 w-4"/>
            </Button>
            </Link>
        </div>
    </div>
);
}