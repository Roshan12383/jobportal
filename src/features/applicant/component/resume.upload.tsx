"use client";

import { cn } from "@/lib/utils";
import { useUploadThing } from "@/lib/uploadthing";
import { useDropzone } from "@uploadthing/react";
import { FileText, Loader2, UploadCloud } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type ResumeUploadProps = {
  value?: string;
  fileName?: string;
  onChange: (file: { url: string; name: string; size: number }) => void;
};

export function ResumeUpload({ value, fileName, onChange }: ResumeUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const { startUpload } = useUploadThing("pdfUploader", {
    onClientUploadComplete: async (res) => {
      const file = res?.[0];
      if (!file?.ufsUrl) {
        setIsUploading(false);
        return;
      }

      onChange({
        url: file.ufsUrl,
        name: file.name,
        size: file.size,
      });
      toast.success("Resume uploaded");
      setIsUploading(false);
    },
    onUploadError: (error) => {
      toast.error(error.message || "Resume upload failed");
      setIsUploading(false);
    },
  });

  const handleFileSelect = async (files: File[]) => {
    const file = files[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are allowed");
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      toast.error("PDF must be smaller than 4MB");
      return;
    }

    setIsUploading(true);
    await startUpload([file]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleFileSelect,
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    disabled: isUploading,
  });

  return (
    <div className="space-y-3">
      <div
        {...getRootProps()}
        className={cn(
          "cursor-pointer rounded-xl border-2 border-dashed border-gray-200 p-8 text-center transition hover:bg-gray-50",
          isDragActive && "border-blue-400 bg-blue-50",
          isUploading && "pointer-events-none opacity-70",
        )}
      >
        <input {...getInputProps()} />
        <div className="mb-3 inline-flex rounded-full bg-blue-50 p-3 text-blue-600">
          {isUploading ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            <UploadCloud className="h-6 w-6" />
          )}
        </div>
        <h4 className="text-sm font-medium">
          {isUploading ? "Uploading resume..." : "Click to upload or drag and drop"}
        </h4>
        <p className="mt-1 text-xs text-muted-foreground">PDF (Max 4MB)</p>
      </div>

      {value && (
        <a
          href={value}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-blue-600 hover:bg-gray-50"
        >
          <FileText className="h-4 w-4" />
          <span className="truncate">{fileName || "Uploaded resume"}</span>
        </a>
      )}
    </div>
  );
}
