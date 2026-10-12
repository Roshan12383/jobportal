import Link from "next/link";

export default function JobNotFound() {
  return (
    <div className="flex h-[350px] flex-col items-center justify-center p-6 text-center">
      <h1 className="text-lg font-semibold text-gray-900">This job is no longer open</h1>
      <p className="mt-1 text-sm text-gray-500">It may have expired or been removed.</p>
      <Link href="/dashboard/jobs" className="mt-4 text-sm font-medium text-blue-600 hover:underline">
        Back to jobs
      </Link>
    </div>
  );
}
