import { SiteHeader } from "@/components/site-header";
import ApplicantSidebar from "@/features/applicant/component/applicant-sidebar";
import { getCurrentUser } from "@/features/auth/server/auth.queries";
import { redirect } from "next/navigation";

export default async function RootLayout({children}:Readonly<{children:React.ReactNode;}>){
    const user=await getCurrentUser();
    if(!user) return redirect('/login');

    if(user.role !== "applicant")  return redirect("/employer-dashboard");
   

    return(
        <div className="min-h-screen bg-background">
            <ApplicantSidebar />
            <div className="ml-64">
            <SiteHeader area="applicant" user={{ role: user.role, name: user.name }} />
           <main className="container mx-auto mt-5 px-8">{children}</main>
            </div>
        </div>
    )
}