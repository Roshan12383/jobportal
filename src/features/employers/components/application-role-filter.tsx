"use client";

import { Search } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";

export function ApplicationRoleFilter({ query }: { query: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const [keyword, setKeyword] = useState(query);
  const [, startTransition] = useTransition();
  const timer = useRef<number | null>(null);

  return (
    <label className="relative block w-52 shrink-0">
      <Search className="pointer-events-none absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
      <input
        value={keyword}
        onChange={(event) => {
          const value = event.target.value;
          setKeyword(value);
          if (timer.current) window.clearTimeout(timer.current);
          timer.current = window.setTimeout(() => {
            const term = value.trim();
            const params = new URLSearchParams();
            if (term) params.set("role", term);
            const search = params.toString();
            startTransition(() => {
              router.replace(search ? `${pathname}?${search}` : pathname, { scroll: false });
            });
          }, 300);
        }}
        placeholder="Search role"
        className="h-9 w-full rounded-lg border border-gray-200 bg-white pr-3 pl-8 text-sm outline-none focus:border-gray-400"
      />
    </label>
  );
}
