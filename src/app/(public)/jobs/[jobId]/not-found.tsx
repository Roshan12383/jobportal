import Link from "next/link";

export default function PublicJobNotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <h1 className="text-2xl font-semibold">Job not found</h1>
      <p className="mt-2 text-sm text-muted-foreground">This job is closed or no longer available.</p>
      <Link href="/jobs" className="mt-4 inline-flex text-sm text-blue-600 hover:underline">
        Back to jobs
      </Link>
    </div>
  );
}
