"use client";

import { toggleSavedJobAction } from "@/features/applicant/server/saved.action";
import { cn } from "@/lib/utils";
import { Bookmark } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

export function SaveJobButton({ jobId, saved }: { jobId: number; saved: boolean }) {
  const router = useRouter();
  const [isSaved, setIsSaved] = useState(saved);
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      aria-pressed={isSaved}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        startTransition(async () => {
          const result = await toggleSavedJobAction(jobId);
          if (result.status === "SUCCESS") {
            setIsSaved(result.saved);
            toast.success(result.message);
            router.refresh();
            return;
          }
          toast.error(result.message);
        });
      }}
      className={cn(
        "inline-flex h-9 items-center gap-1.5 rounded-lg border px-3 text-sm font-medium transition-colors disabled:opacity-60",
        isSaved
          ? "border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100"
          : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50",
      )}
    >
      <Bookmark className={cn("h-4 w-4", isSaved && "fill-current")} />
      {isSaved ? "Saved" : "Save"}
    </button>
  );
}
