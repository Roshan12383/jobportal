import { SiteHeader } from "@/components/site-header";
import { getCurrentUser } from "@/features/auth/server/auth.queries";
import EmployerSidebar from "@/features/employers/components/employer-sidebar";
import { redirect } from "next/navigation";

export default async function RootLayout({children}:Readonly<{children:React.ReactNode;}>){
    const user=await getCurrentUser();
    if(!user) return redirect('/login');

    if(user.role !== "employer")  return redirect("/dashboard");
   

    return(
        <div className="min-h-screen bg-background">
            <EmployerSidebar/>
            <div className="min-w-0 lg:ml-64">
            <SiteHeader area="employer" user={{ role: user.role, name: user.name }} />
           <main className="container mx-auto mt-5 px-4 sm:px-8">{children}</main>
            </div>
        </div>
    )
}