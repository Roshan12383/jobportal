"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { JOB_LEVEL, JOB_TYPE, WORK_TYPE } from "@/config/constant";
import { Search, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";

type JobFiltersProps = {
  search?: string;
  jobType?: string;
  jobLevel?: string;
  workType?: string;
};

export function JobFilters({ search, jobType, jobLevel, workType }: JobFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [keyword, setKeyword] = useState(search);
  const [isPending, startTransition] = useTransition();
  const timer = useRef<number | null>(null);
  const current = useRef({ search, jobType, jobLevel, workType });
  current.current = { search: keyword, jobType, jobLevel, workType };

  function navigate(next: { search: string; jobType: string; jobLevel: string; workType: string }) {
    const params = new URLSearchParams();
    const term = next.search.trim();

    if (term) params.set("search", term);
    if (next.jobType) params.set("jobType", next.jobType);
    if (next.jobLevel) params.set("jobLevel", next.jobLevel);
    if (next.workType) params.set("workType", next.workType);
    params.set("page", "1");

    const qs = params.toString();
    startTransition(() => {
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    });
  }

  const hasFilters = Boolean(search || jobType || jobLevel || workType);

  return (
    <div className="space-y-4 rounded-2xl border border-border bg-card p-4 shadow-sm">
      <label className="relative block">
        <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          value={keyword}
          onChange={(event) => {
            const value = event.target.value;
            setKeyword(value);
            if (timer.current) window.clearTimeout(timer.current);
            timer.current = window.setTimeout(() => {
              navigate({ ...current.current, search: value });
            }, 350);
          }}
          placeholder="Search jobs, skills, or companies"
          className="h-11 w-full rounded-xl border border-gray-200 bg-white pr-3 pl-10 text-sm outline-none focus:border-gray-400"
        />
      </label>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-3">
          <FilterSelect
            value={jobType}
            placeholder="Job Type"
            options={JOB_TYPE}
            onChange={(value) => navigate({ ...current.current, jobType: value })}
          />
          <FilterSelect
            value={jobLevel}
            placeholder="Job Level"
            options={JOB_LEVEL}
            onChange={(value) => navigate({ ...current.current, jobLevel: value })}
          />
          <FilterSelect
            value={workType}
            placeholder="Work Type"
            options={WORK_TYPE}
            onChange={(value) => navigate({ ...current.current, workType: value })}
          />
        </div>

        <button
          type="button"
          disabled={!hasFilters || isPending}
          onClick={() => {
            setKeyword("");
            navigate({ search: "", jobType: "", jobLevel: "", workType: "" });
          }}
          className="inline-flex items-center gap-1 self-end text-sm font-medium text-red-500 hover:text-red-600 disabled:opacity-40 sm:self-center"
        >
          <X className="h-4 w-4" />
          Reset Filters
        </button>
      </div>
    </div>
  );
}

function FilterSelect({
  value,
  placeholder,
  options,
  onChange,
}: {
  value: string;
  placeholder: string;
  options: readonly string[];
  onChange: (value: string) => void;
}) {
  return (
    <Select value={value || null} onValueChange={(next) => onChange(next ?? "")}>
      <SelectTrigger className="h-10 w-full rounded-lg border-gray-200 bg-white">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option} value={option}>
            {option.replaceAll("-", " ")}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
