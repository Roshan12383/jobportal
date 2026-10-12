import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

type JobsPaginationProps = {
  page: number;
  totalPages: number;
  hrefFor: (page: number) => string;
};

export function JobsPagination({ page, totalPages, hrefFor }: JobsPaginationProps) {
  if (totalPages < 1) return null;

  return (
    <nav className="flex items-center justify-center gap-6 border-t border-gray-100 pt-6 text-sm">
      {page <= 1 ? (
        <span className="inline-flex cursor-default items-center gap-1 text-gray-300">
          <ChevronLeft className="h-4 w-4" />
          Previous
        </span>
      ) : (
        <Link href={hrefFor(page - 1)} className="inline-flex items-center gap-1 text-gray-500 hover:text-gray-900">
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Link>
      )}

      {Array.from({ length: totalPages }, (_, index) => index + 1).map((number) =>
        number === page ? (
          <span
            key={number}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white font-medium text-gray-900 shadow-sm"
          >
            {number}
          </span>
        ) : (
          <Link key={number} href={hrefFor(number)} className="text-gray-500 hover:text-gray-900">
            {number}
          </Link>
        ),
      )}

      {page >= totalPages ? (
        <span className="inline-flex cursor-default items-center gap-1 text-gray-300">
          Next
          <ChevronRight className="h-4 w-4" />
        </span>
      ) : (
        <Link href={hrefFor(page + 1)} className="inline-flex items-center gap-1 font-medium text-gray-700 hover:text-gray-900">
          Next
          <ChevronRight className="h-4 w-4" />
        </Link>
      )}
    </nav>
  );
}

export function jobsPageHref(pathname: string, query: Record<string, string>, page: number) {
  const params = new URLSearchParams(query);
  params.set("page", String(Math.max(1, page)));
  const search = params.toString();
  return search ? `${pathname}?${search}` : pathname;
}
