import { Bookmark, Briefcase, LayoutDashboard, Search, Settings } from "lucide-react";
import type { LucideIcon } from "lucide-react";
export const SESSION_LIFETIME=30*24*60*60

export const SESSION_REFRESH_TIME=SESSION_LIFETIME/2;

export const SALARY_CURRENCY=[
    "USD","EUR","GBP","CAD","AUD","JPY","INR","NPR"
] as const;

export const SALARY_PERIOD=["hourly","monthly","yearly"] as const;

export const JOB_TYPE=["remote","hybrid","on-site"] as const;

export const WORK_TYPE=[
    "full-time",
    "part-time",
    "contract",
    "temporary",
    "freelance",
] as const;

export const JOB_LEVEL=[
    "internship","entry level","junior","mid level","senior level","lead","manager","director","executive"
] as const;

export const MIN_EDUCATION=[
  "None", 
  "HIGH_SCHOOL",
  "DIPLOMA",
  "BACHELOR",
  "MASTER",
]as const;


export interface NavItem{
    name:string,
    href:string,
    icon:LucideIcon,
    exact?:boolean,
    badge?:number|"dynamic",
}


export const applicantNavItems:NavItem[]=[
    {
        name:"Home",
        href:"/dashboard",
        icon:LayoutDashboard,
        exact:true,
    },
    {
        name:"Find Jobs",
        href:"/dashboard/jobs",
        icon:Search,
    },
    {
        name:"Applied",
        href:"/dashboard/applied-jobs",
        icon:Briefcase,
        badge:"dynamic"
    },
    {
        name:"Saved Jobs",
        href:"/dashboard/saved-jobs",
        icon:Bookmark,
        badge:"dynamic"
    },{
       name:"Settings",
       href:"/dashboard/settings",
       icon:Settings,
    }
]