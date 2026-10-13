"use client";

import { applicantNavItems } from "@/config/constant";
import { logoutUserAction } from "@/features/auth/server/auth.action";
import { isActiveLink } from "@/lib/navigation-util";
import { cn } from "@/lib/utils";

import { Bookmark, Briefcase, Building, CreditCard, LayoutDashboard, LogOut, Plus, Search, Settings, User } from "lucide-react";
import Link from "next/link";
import {  usePathname } from "next/navigation";
import { URLPattern } from "next/server";




const ApplicantSidebar=()=>{
  const pathname=usePathname();
  console.log("Pathname",pathname);

  function isLinkActive({
    href,pathname,base="/",
  }:{
      href:string,pathname:string,base?:string,
  }){
     const normalizedHref=href.replace(/\/$/,"") || "/";

     const pattern=new URLPattern({
      pathname:normalizedHref===base? base :`${normalizedHref}{/*}?`,
     })

     return pattern.test({pathname})
  }
 return(
    <div className="z-30 w-full border-b border-border bg-card lg:fixed lg:top-0 lg:bottom-0 lg:w-64 lg:border-r lg:border-b-0">

        <div className="px-4 py-3 lg:p-6">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Applicant Dashboard
            </h2>
        </div>
        

    <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:block lg:space-y-1 lg:overflow-visible lg:px-3 lg:pb-0">
      {
        applicantNavItems.map((currNav)=>{
            const Icon=currNav.icon;
            const active=isActiveLink(pathname,currNav.href,currNav.exact);

            return(
             <Link key={currNav.name} href={currNav.href || "#"}
               className={cn(
                  "flex shrink-0 items-center gap-3 px-3 py-2 font-medium text-sm rounded-lg transition-colors",
               
                  active?"text-primary bg-primary/10":"text-muted-foreground hover:text-foreground hover:bg-accent"
            )}
             >
                <Icon className="w-4 h-4"/>
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

export default ApplicantSidebar;