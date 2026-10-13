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
      <div className={isDashboard ? "relative flex min-h-16 items-center justify-center px-3 sm:px-6" : "mx-auto flex min-h-16 max-w-6xl flex-wrap items-center gap-3 px-4 py-2"}>
        {isDashboard ? (
          <nav className={`flex flex-wrap items-center justify-center gap-x-4 gap-y-2 py-3 text-sm text-muted-foreground lg:gap-6 ${isEmployer ? "lg:-translate-x-16" : "lg:-translate-x-10"}`}>
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
            <nav className="order-3 flex w-full flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground md:order-none md:ml-6 md:w-auto md:gap-6">
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
