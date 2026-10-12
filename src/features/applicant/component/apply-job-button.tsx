"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { applyJobAction } from "@/features/applicant/server/application.action";
import { ApplicantResumeOption } from "@/features/applicant/server/application.queries";
import { saveApplicantResume } from "@/features/applicant/server/settings";
import { ApplyJobSchema, applyJobSchema } from "@/features/applicant/jobs/apply.job.schema";
import { useUploadThing } from "@/lib/uploadthing";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type ApplyJobButtonProps = {
  jobId: number;
  jobTitle: string;
  resumes: ApplicantResumeOption[];
  alreadyApplied: boolean;
};

export function ApplyJobButton({
  jobId,
  jobTitle,
  resumes,
  alreadyApplied,
}: ApplyJobButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [applied, setApplied] = useState(alreadyApplied);
  const [resumeOptions, setResumeOptions] = useState(resumes);
  const [isUploading, setIsUploading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ApplyJobSchema>({
    resolver: zodResolver(applyJobSchema),
    defaultValues: {
      jobId,
      resumeId: resumes[0]?.id ?? 0,
      coverLetter: "",
    },
  });

  const { startUpload } = useUploadThing("pdfUploader", {
    onClientUploadComplete: async (res) => {
      const file = res?.[0];
      if (!file?.ufsUrl) {
        setIsUploading(false);
        return;
      }

      const saved = await saveApplicantResume({
        fileUrl: file.ufsUrl,
        fileName: file.name,
        fileSize: file.size,
      });

      if (saved.status === "SUCCESS") {
        setResumeOptions((current) => [
          saved.resume,
          ...current.filter((item) => item.id !== saved.resume.id),
        ]);
        setValue("resumeId", saved.resume.id, { shouldValidate: true });
        toast.success("Resume saved. It will show in Settings too.");
        router.refresh();
      } else {
        toast.error(saved.message);
      }
      setIsUploading(false);
    },
    onUploadError: (error) => {
      toast.error(error.message || "Resume upload failed");
      setIsUploading(false);
    },
  });

  const uploadResume = async (fileList: FileList | null) => {
    const file = fileList?.[0];
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

  const onSubmit = async (data: ApplyJobSchema) => {
    const response = await applyJobAction(data);
    if (response.status === "SUCCESS") {
      toast.success(response.message);
      setApplied(true);
      setOpen(false);
      router.refresh();
      return;
    }

    if (response.message.toLowerCase().includes("already applied")) {
      setApplied(true);
      setOpen(false);
    }
    toast.error(response.message);
  };

  if (applied) {
    return (
      <span className="inline-flex h-9 items-center rounded-lg border border-gray-200 bg-gray-100 px-3 text-sm font-medium text-gray-600">
        Already Applied
      </span>
    );
  }

  return (
    <>
      <Button
        type="button"
        className="h-9 bg-gray-900 px-4 text-white hover:bg-gray-800"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setOpen(true);
        }}
      >
        Apply Now
        <ArrowRight className="h-4 w-4" />
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
            <div className="relative z-10 w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
              <div className="mb-5 flex items-start justify-between gap-4">
                <h2 className="text-base font-semibold text-gray-900">
                  Apply Job: {jobTitle}
                </h2>
                <button
                  type="button"
                  aria-label="Close"
                  className="text-gray-400 hover:text-gray-700"
                  onClick={() => setOpen(false)}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                <input type="hidden" {...register("jobId", { valueAsNumber: true })} />

                <div className="space-y-2">
                  <Label>
                    Choose Resume <span className="text-destructive">*</span>
                  </Label>
                  {resumeOptions.length > 0 ? (
                    <select
                      className="h-10 w-full rounded-lg border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                      {...register("resumeId", { valueAsNumber: true })}
                    >
                      {resumeOptions.map((resume) => (
                        <option key={resume.id} value={resume.id}>
                          {resume.fileName}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No resume yet. Upload a PDF below.
                    </p>
                  )}
                  <label className="inline-flex cursor-pointer text-sm font-medium text-blue-600">
                    {isUploading ? "Uploading resume..." : "Upload a new resume"}
                    <input
                      type="file"
                      accept="application/pdf,.pdf"
                      className="hidden"
                      disabled={isUploading}
                      onChange={(event) => {
                        void uploadResume(event.target.files);
                        event.target.value = "";
                      }}
                    />
                  </label>
                  {/* <p className="text-xs text-muted-foreground">
                    Settings resume stays selected if you do not upload a new one. A new PDF replaces it in Settings too.
                  </p> */}
                  {errors.resumeId && (
                    <p className="text-sm text-destructive">{errors.resumeId.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`cover-${jobId}`}>Cover Letter</Label>
                  <Textarea
                    id={`cover-${jobId}`}
                    rows={5}
                    placeholder="Write down your biography here.."
                    {...register("coverLetter")}
                  />
                  {errors.coverLetter && (
                    <p className="text-sm text-destructive">{errors.coverLetter.message}</p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting || isUploading || resumeOptions.length === 0}
                    className="bg-gray-900 text-white hover:bg-gray-800"
                  >
                    {isSubmitting ? "Applying..." : "Apply Now"}
                    {!isSubmitting && <ArrowRight className="h-4 w-4" />}
                  </Button>
                </div>
              </form>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
