"use client";

import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useState } from "react";
import { createPortal } from "react-dom";

export function CoverLetterButton({
  name,
  letter,
}: {
  name: string;
  letter: string | null;
}) {
  const [open, setOpen] = useState(false);
  const text = letter?.trim() ?? "";

  if (!text) {
    return (
      <Button type="button" variant="outline" disabled>
        Cover Letter
      </Button>
    );
  }

  return (
    <>
      <Button type="button" variant="outline" onClick={() => setOpen(true)}>
        Cover Letter
      </Button>
      {open &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <button
              type="button"
              aria-label="Close"
              className="absolute inset-0 bg-black/40"
              onClick={() => setOpen(false)}
            />
            <div className="relative z-10 w-full max-w-md rounded-xl bg-white p-5 shadow-xl">
              <div className="mb-4 flex items-start justify-between gap-4">
                <h2 className="text-sm font-semibold text-gray-900">
                  Cover Letter: {name.toUpperCase()}
                </h2>
                <button type="button" aria-label="Close" onClick={() => setOpen(false)}>
                  <X className="h-4 w-4 text-gray-500" />
                </button>
              </div>
              <div className="rounded-lg border border-gray-200 px-3 py-2">
                <p className="whitespace-pre-wrap text-sm text-gray-700">{text}</p>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
