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
    <div className="z-30 w-full border-b border-border bg-card lg:fixed lg:top-0 lg:bottom-0 lg:w-64 lg:border-r lg:border-b-0">

        <div className="px-4 py-3 lg:p-6">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Employers Dashboard
            </h2>
        </div>
        

    <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:block lg:space-y-1 lg:overflow-visible lg:px-3 lg:pb-0">
      {
        navigationItems.map((currNav)=>{
            const Icon=currNav.icon;
            return(
             <Link key={currNav.name} href={currNav.href || "#"}
               className={cn(
                  "flex shrink-0 items-center gap-3 px-3 py-2 font-medium text-sm rounded-lg transition",
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

    <div className="px-3 pb-3 lg:absolute lg:bottom-6 lg:left-3 lg:right-3 lg:px-0 lg:pb-0">
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