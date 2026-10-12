"use client";

import { logoutUserAction } from "@/features/auth/server/auth.action";
import { cn } from "@/lib/utils";

import { Bookmark, Briefcase, Building, CreditCard, LayoutDashboard, LogOut, Plus, Settings, User } from "lucide-react";
import Link from "next/link";
import {  usePathname } from "next/navigation";
const base="/employer-dashboard";

const navigationItems=[
  {name:"Overview",icon:LayoutDashboard,href:base},
  {name:"Applications",icon:User,href:`${base}/applications`},
  {name:"Post a Job",icon:Plus,href:`${base}/jobs/create`},
  {name:"My Jobs",icon:Briefcase,href:`${base}/jobs`},
  {name:"Setting",icon:Settings,href:`${base}/settings`}
]


const EmployerSidebar=()=>{
  const pathname=usePathname();
  console.log("Pathname",pathname);

  function isLinkActive({
    href,pathname,base="/",
  }:{
      href:string,pathname:string,base?:string,
  }){
     const normalizedHref=href.replace(/\/$/,"") || "/";
     const normalizedPath=pathname.replace(/\/$/,"") || "/";

     if(normalizedHref===`${base}/jobs`){
       return normalizedPath===normalizedHref || /^\/employer-dashboard\/jobs\/\d+/.test(normalizedPath);
     }

     if(normalizedHref===base){
       return normalizedPath===base;
     }

     return normalizedPath===normalizedHref || normalizedPath.startsWith(`${normalizedHref}/`);
  }
 return(
    <div className="bg-card w-64 border-r bottom-0 top-0 border-border fixed">

        <div className="p-6">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Employers Dashboard
            </h2>
        </div>
        

    <nav className="px-3 space-y-1">
      {
        navigationItems.map((currNav)=>{
            const Icon=currNav.icon;
            return(
             <Link key={currNav.name} href={currNav.href || "#"}
               className={cn(
                  "flex items-center gap-3 px-3 py-2 font-medium text-sm rounded-lg transition",
                  isLinkActive({
                    href:currNav.href || "#",
                    pathname,
                    base:"/employer-dashboard",
                  }) && "text-primary bg-blue-300"
                )
               }
             >
                <Icon/>
                {currNav.name}   
             </Link> 
            )
        })}
    </nav>

    <div className="absolute bottom-6 left-3 right-3">
       <button onClick={logoutUserAction}
          className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground 
          hover:text-foreground hover:bg-accent rounded-lg transition-colors w-full"
        >
           <LogOut className="h-4 w-4"/>
           Log-out
       </button>
    </div>

    </div>
 )
}

export default EmployerSidebar;