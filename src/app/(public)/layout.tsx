import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getCurrentUser } from "@/features/auth/server/auth.queries";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader user={user ? { role: user.role, name: user.name } : null} />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
