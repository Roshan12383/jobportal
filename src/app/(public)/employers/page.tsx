import { db } from "@/config/db";
import { employers, users } from "@/drizzle/schema";
import { eq, isNull } from "drizzle-orm";
import { MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function EmployersPage() {
  const companies = await db
    .select({
      id: employers.id,
      name: employers.name,
      location: employers.location,
      logo: users.avatarUrl,
    })
    .from(employers)
    .innerJoin(users, eq(employers.id, users.id))
    .where(isNull(employers.deletedAt));

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-bold text-foreground">Employers</h1>
      <p className="mt-1 text-sm text-muted-foreground">Companies hiring on CareerNest.</p>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {companies.map((company) => {
          const name = company.name?.trim() || "Company";
          return (
            <Link
              key={company.id}
              href={`/jobs?search=${encodeURIComponent(name)}`}
              className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 hover:border-foreground/20"
            >
              <div className="relative h-12 w-12 overflow-hidden rounded-lg border border-border bg-muted">
                {company.logo ? (
                  <Image src={company.logo} alt="" fill sizes="48px" className="object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm font-bold text-muted-foreground">
                    {name.slice(0, 1).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <p className="truncate font-semibold text-foreground">{name}</p>
                <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  {company.location || "Location not listed"}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
