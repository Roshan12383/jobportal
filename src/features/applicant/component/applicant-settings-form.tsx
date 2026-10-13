"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { BriefcaseBusiness, Calendar, Flag, Globe, Loader, Mail, Phone, User } from "lucide-react";
import { Controller, useForm } from "react-hook-form"
import { ApplicantSettingsSchema, applicantSettingsSchema } from "../jobs/jobs.schema";
import { Button } from "@/components/ui/button";
import Tiptap from "@/components/text-editor";
import { ImageUpload } from "@/features/employers/components/employer-setting-form";
import { ResumeUpload } from "@/features/applicant/component/resume.upload";
import { createApplicantProfile } from "@/features/applicant/server/settings";
import { cn } from "@/lib/utils";
import { toast } from "sonner";




type ApplicantProfileData = {
    fullName: string,
    email: string,
    phone: string,
    location: string,
    dateOfBirth: string,
    nationality: string,
    gender: string,
    maritalStatus: string,
    education: string,
    experience: string,
    websiteUrl: string,
    biography: string,
}
const ApplicantSettingsForm = ({
    initialData,
}: {
    initialData: Partial<ApplicantSettingsSchema>;
}) => {
    const { register, handleSubmit, watch, control, setValue, formState: { errors, isDirty, isSubmitting } } =
        useForm<ApplicantSettingsSchema>({
            resolver: zodResolver(applicantSettingsSchema),
            defaultValues: {
                name: initialData.name ?? "",
                email: initialData.email ?? "",
                phoneNumber: initialData.phoneNumber ?? "",
                avatarUrl: initialData.avatarUrl ?? "",
                location: initialData.location ?? "",
                dateOfBirth: initialData.dateOfBirth ?? "",
                nationality: initialData.nationality ?? "",
                gender: initialData.gender,
                maritalStatus: initialData.maritalStatus,
                education: initialData.education,
                experience: initialData.experience ?? "",
                websiteUrl: initialData.websiteUrl ?? "",
                biography: initialData.biography ?? "",
                resumeUrl: initialData.resumeUrl ?? "",
                resumeName: initialData.resumeName ?? "",
                resumeSize: initialData.resumeSize,
            }
        });

    const profileReady = applicantSettingsSchema.safeParse(watch()).success;

    const onSubmit = async (data: ApplicantSettingsSchema) => {
       try {
         const res = await createApplicantProfile(data);
         if (res.status === "SUCCESS") {
            toast.success(res.message);
         }else{
            toast.error(res.message);
         }
       } catch (error) {
          toast.error("Something went wrong. Please try again.")
          console.error("Form Submission Error",error);
       }
    }

    return (
        <div className="mx-auto max-w-5xl py-4 sm:py-8">
            <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
                <Card>
                    <CardHeader>
                        <CardTitle>Basis Information</CardTitle>
                        <CardDescription>
                            This is how employers will see you.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        <div className="flex items-center gap-6 mb-6">
                            <div className="text-center space-y-1">
                                <Controller
                                    name="avatarUrl"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <div className="space-y-2">
                                            <Label>Upload Photo *</Label>

                                            <ImageUpload
                                                value={field.value ?? ""}
                                                onChange={field.onChange}
                                                boxText="Max file size 5MB"
                                                className={cn(
                                                    "h-32 w-32",
                                                    fieldState.error && "ring-1 ring-destructive"
                                                )}
                                            />

                                            {fieldState.error && (
                                                <p className="text-sm text-destructive">
                                                    {fieldState.error.message}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                />
                            </div>

                            <div className="text-sm text-muted-foreground">
                                <p>Max file size is 5MB. Minimum dimension: 150*150</p>
                                <p>Suitable files are .jpg and .png</p>
                            </div>
                        </div>


                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="fullName">Full Name</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 
                                   text-muted-foreground"/>

                                    <Input placeholder="John Deo" id="fullName" {...register("name")}
                                        className={`pl-10 ${errors.name
                                            ? "border-destructive focus-visible:ring-destructive"
                                            : ""
                                            }`} />
                                </div>
                                {
                                    errors.name &&
                                    <p className="text-sm text-destructive">{errors.name.message}</p>
                                }
                            </div>


                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 
                                   text-muted-foreground"/>

                                    <Input placeholder="John13@gmail.com" id="email" {...register("email")} readOnly className="pl-10 bg-gray-50" />
                                </div>
                                {
                                    errors.email &&
                                    <p className="text-sm text-destructive">{errors.email.message}</p>
                                }
                            </div>


                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone</Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 
                                   text-muted-foreground"/>

                                    <Input placeholder="+1 234 567 890" id="phone" {...register("phoneNumber")} className={`pl-10 ${errors.phoneNumber
                                        ? "border-destructive focus-visible:ring-destructive"
                                        : ""}`} />
                                </div>
                                {
                                    errors.phoneNumber &&
                                    <p className="text-sm text-destructive">{errors.phoneNumber.message}</p>
                                }
                            </div>


                            <div className="space-y-2">
                                <Label htmlFor="location">Location</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 
                                   text-muted-foreground"/>

                                    <Input placeholder="Udaipur" id="location" {...register("location")} className={`pl-10 ${errors.location
                                        ? "border-destructive focus-visible:ring-destructive"
                                        : ""
                                        }`} />
                                </div>
                                {
                                    errors.location &&
                                    <p className="text-sm text-destructive">{errors.location.message}</p>
                                }
                            </div>
                        </div>
                    </CardContent>
                </Card>



                <Card>
                    <CardHeader>
                        <CardTitle>Personal Details</CardTitle>
                    </CardHeader>

                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label>Date of Birth</Label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 
                            text-muted-foreground"/>

                                <Input type="date"  {...register("dateOfBirth")} className={`pl-10 ${errors.dateOfBirth
                                    ? "border-destructive focus-visible:ring-destructive"
                                    : ""
                                    }`} />
                            </div>
                            {
                                errors.dateOfBirth &&
                                <p className="text-sm text-destructive">{errors.dateOfBirth.message}</p>
                            }
                        </div>

                        <div className="space-y-2">
                            <Label>Nationality</Label>
                            <div className="relative">
                                <Flag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 
                         text-muted-foreground"/>

                                <Input placeholder="American" {...register("nationality")} className={`pl-10 ${errors.nationality
                                    ? "border-destructive focus-visible:ring-destructive"
                                    : ""
                                    }`} />
                            </div>
                            {
                                errors.nationality &&
                                <p className="text-sm text-destructive">{errors.nationality.message}</p>
                            }
                        </div>


                        <div className="space-y-2">
                            <Label>Gender</Label>
                            <Controller name="gender" control={control} render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger className={`pl-10 ${errors.gender
                                        ? "border-destructive focus-visible:ring-destructive"
                                        : ""
                                        }`} >
                                        <SelectValue placeholder="Select Gender" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        <SelectItem value="male">Male</SelectItem>
                                        <SelectItem value="female">Female</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                            />

                            {
                                errors.gender &&
                                <p className="text-sm text-destructive">{errors.gender.message}</p>
                            }
                        </div>


                        <div className="space-y-2">
                            <Label>Marital Status</Label>
                            <Controller name="maritalStatus" control={control} render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger className={`pl-10 ${errors.maritalStatus
                                        ? "border-destructive focus-visible:ring-destructive"
                                        : ""
                                        }`} >
                                        <SelectValue placeholder="Select Status" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        <SelectItem value="single">Single</SelectItem>
                                        <SelectItem value="married">Married</SelectItem>
                                        <SelectItem value="divorced">Divorced</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                            />
                            {
                                errors.maritalStatus &&
                                <p className="text-sm text-destructive">{errors.maritalStatus.message}</p>
                            }
                        </div>
                    </CardContent>
                </Card>



                <Card>
                    <CardHeader>
                        <CardTitle>Professional Profile</CardTitle>
                        <CardDescription>
                            Highlight your skills and experience.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {/* Highest Education & Experience */}
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label>Highest Education</Label>

                                <Controller
                                    name="education"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <SelectTrigger className={`pl-10 ${errors.education
                                                ? "border-destructive focus-visible:ring-destructive"
                                                : ""
                                                }`} >
                                                <SelectValue placeholder="Select Education" />
                                            </SelectTrigger>

                                            <SelectContent>
                                                <SelectItem value="high school">
                                                    High School
                                                </SelectItem>
                                                <SelectItem value="undergraduate">
                                                    Bachelor&apos;s Degree
                                                </SelectItem>
                                                <SelectItem value="masters">
                                                    Master&apos;s Degree
                                                </SelectItem>
                                                <SelectItem value="phd">PhD</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />

                                {
                                    errors.education &&
                                    <p className="text-sm text-destructive">{errors.education.message}</p>
                                }
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="experience">Experience</Label>

                                <div className="relative">
                                    <BriefcaseBusiness className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                                    <Input
                                        id="experience"
                                        placeholder="e.g. 5 Years"
                                        className={`pl-10 ${errors.experience
                                            ? "border-destructive focus-visible:ring-destructive"
                                            : ""
                                            }`}
                                        {...register("experience")}
                                    />
                                </div>
                                {
                                    errors.experience &&
                                    <p className="text-sm text-destructive">{errors.experience.message}</p>
                                }
                            </div>
                        </div>

                        {/* Portfolio Website */}
                        <div className="space-y-2">
                            <Label htmlFor="websiteUrl">Portfolio Website</Label>

                            <div className="relative">
                                <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                                <Input
                                    id="websiteUrl"
                                    {...register("websiteUrl")}
                                    placeholder="https://..."
                                    className={`pl-10 ${errors.websiteUrl
                                        ? "border-destructive focus-visible:ring-destructive"
                                        : ""
                                        }`}
                                />
                            </div>
                            {
                                errors.websiteUrl &&
                                <p className="text-sm text-destructive">{errors.websiteUrl.message}</p>
                            }
                        </div>

                        {/* Biography */}

                        <Controller name="biography" control={control} render={({ field, fieldState }) => (
                            <div className="space-y-2">
                                <Label>Biography</Label>
                                <Tiptap content={field.value} onChange={field.onChange} />

                                {fieldState.error && (
                                    <p className="text-sm text-destructive">
                                        {fieldState.error.message}
                                    </p>
                                )}
                            </div>
                        )}


                        />


                        <Separator />

                        {/* Resume / CV */}

                        <Controller
                            name="resumeUrl"
                            control={control}
                            render={({ field, fieldState }) => (
                                <div className="space-y-4">
                                    <Label className="text-base">Resume / CV</Label>
                                    <ResumeUpload
                                        value={field.value}
                                        fileName={watch("resumeName")}
                                        onChange={({ url, name, size }) => {
                                            setValue("resumeUrl", url, { shouldDirty: true, shouldValidate: true });
                                            setValue("resumeName", name, { shouldDirty: true });
                                            setValue("resumeSize", size, { shouldDirty: true });
                                        }}
                                    />
                                    {fieldState.error && (
                                        <p className="text-sm text-destructive">{fieldState.error.message}</p>
                                    )}
                                </div>
                            )}
                        />

                    </CardContent>
                </Card>


                <div className="flex items-center gap-4 pt-5">
                    <Button type="submit">
                        {isSubmitting && <Loader className="w-4 h-4 animate-spin" />}
                        {isSubmitting
                            ? profileReady
                                ? "Updating Change"
                                : "Saving Changes.."
                            : profileReady
                                ? "Update Change"
                                : "Save Change"}
                    </Button>
                    {profileReady && !isDirty && (
                        <p className="text-sm text-muted-foreground">No change to save</p>
                    )}
                </div>

            </form>
        </div>
    )
}

export default ApplicantSettingsForm