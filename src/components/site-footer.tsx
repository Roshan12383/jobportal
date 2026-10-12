import { Briefcase } from "lucide-react";
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border bg-muted/40">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2 font-semibold text-foreground">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-foreground text-background">
              <Briefcase className="h-4 w-4" />
            </span>
            CareerNest
          </div>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            Find a job that suits your interest and skills, or hire the right candidate.
          </p>
        </div>
        <div className="text-sm">
          <p className="font-medium text-foreground">Explore</p>
          <div className="mt-3 flex flex-col gap-2 text-muted-foreground">
            <Link href="/" className="hover:text-foreground">Home</Link>
            <Link href="/jobs" className="hover:text-foreground">Find Job</Link>
            <Link href="/employers" className="hover:text-foreground">Employers</Link>
          </div>
        </div>
        <div className="text-sm">
          <p className="font-medium text-foreground">Account</p>
          <div className="mt-3 flex flex-col gap-2 text-muted-foreground">
            <Link href="/login" className="hover:text-foreground">Sign In</Link>
            <Link href="/register" className="hover:text-foreground">Register</Link>
            <Link href="/login" className="hover:text-foreground">Post a Job</Link>
          </div>
        </div>
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} CareerNest. All rights reserved.
      </div>
    </footer>
  );
}
