import EmployerSettingForm from "@/features/employers/components/employer-setting-form";
import { EmployerProfileData } from "@/features/employers/employer.schema";
import getCurrentEmployerDetails from "@/features/server/employer-queries";
import { redirect } from "next/navigation";



const EmployerSetting=async()=>{
    const employer=await getCurrentEmployerDetails();
    if(!employer)  return redirect("/login");

    return(
        <div>
          <EmployerSettingForm initialData={{
            name:employer.employerDetails.name ?? "",
            description: employer.employerDetails.description ?? "",
            organizationType: employer.employerDetails.organizationType as EmployerProfileData["organizationType"],
            teamSize: employer.employerDetails.teamSize as EmployerProfileData["teamSize"],
            location: employer.employerDetails.location ?? "",
            websiteUrl: employer.employerDetails.websiteUrl ?? "",
            yearOfEstablishment:employer.employerDetails.yearOfEstablishment?.toString(),
            avatarUrl:employer.avatarUrl,
            bannerImageUrl:employer.employerDetails.bannerImageUrl,
          } as EmployerProfileData
          }/>
        </div>
    )
}

export default EmployerSetting;