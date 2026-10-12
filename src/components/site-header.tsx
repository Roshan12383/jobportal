import { Briefcase } from "lucide-react";
import Link from "next/link";

type SiteHeaderProps = {
  user: { role: string | null; name: string } | null;
  area?: "public" | "applicant" | "employer";
};

export function SiteHeader({ area = "public" }: SiteHeaderProps) {
  const isApplicant = area === "applicant";
  const isEmployer = area === "employer";
  const isDashboard = isApplicant || isEmployer;
  const homeHref = isApplicant ? "/dashboard" : isEmployer ? "/employer-dashboard" : "/";

  const links = (
    <>
      <Link href={homeHref} className="flex items-center gap-2 font-semibold text-foreground">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-foreground text-background">
          <Briefcase className="h-4 w-4" />
        </span>
        CareerNest
      </Link>
      <Link href={homeHref} className="hover:text-foreground">Home</Link>
      <Link
        href={isApplicant ? "/dashboard/jobs" : isEmployer ? "/employer-dashboard/jobs" : "/jobs"}
        className="hover:text-foreground"
      >
        {isEmployer ? "My Jobs" : "Find Job"}
      </Link>
      {isApplicant ? (
        <Link href="/dashboard/settings" className="hover:text-foreground">Settings</Link>
      ) : isEmployer ? (
        <Link href="/employer-dashboard/settings" className="hover:text-foreground">Settings</Link>
      ) : (
        <Link href="/employers" className="hover:text-foreground">Employers</Link>
      )}
    </>
  );

  return (
    <header className={`sticky top-0 z-40 bg-background/95 backdrop-blur ${isDashboard ? "" : "border-b border-border"}`}>
      <div className={isDashboard ? "relative flex h-16 items-center justify-center px-6" : "mx-auto flex h-16 max-w-6xl items-center gap-4 px-4"}>
        {isDashboard ? (
          <nav className={`flex items-center gap-6 text-sm text-muted-foreground ${isEmployer ? "-translate-x-16" : "-translate-x-10"}`}>
            {links}
          </nav>
        ) : (
          <>
            <Link href={homeHref} className="flex items-center gap-2 font-semibold text-foreground">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-foreground text-background">
                <Briefcase className="h-4 w-4" />
              </span>
              CareerNest
            </Link>
            <nav className="ml-6 hidden items-center gap-6 text-sm text-muted-foreground md:flex">
              <Link href="/" className="hover:text-foreground">Home</Link>
              <Link href="/jobs" className="hover:text-foreground">Find Job</Link>
              <Link href="/employers" className="hover:text-foreground">Employers</Link>
            </nav>
          </>
        )}

        {!isDashboard && (
          <div className="ml-auto flex items-center gap-3">
            <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground">
              Sign In
            </Link>
            <Link
              href="/register"
              className="inline-flex h-9 items-center rounded-full bg-foreground px-4 text-sm font-medium text-background"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
