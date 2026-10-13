"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Briefcase, Building2, Calendar, Divide, FileText, Globe, Loader, Loader2, MapPin, Upload, X } from "lucide-react"
import { Controller, useForm } from "react-hook-form"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,SelectContent,SelectGroup,SelectItem,SelectLabel,SelectTrigger,SelectValue,
} from "@/components/ui/select"
import { updateEmployerProfileAction } from "@/features/server/employer.action"
import { toast } from "sonner"
import { EmployerProfileData, employerProfileSchema, organizationTypes, teamSizes } from "../employer.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import Tiptap from "@/components/text-editor"
import { UploadButton } from "@/lib/uploadthing"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { ComponentProps, useState } from "react"
import { useDropzone } from "@uploadthing/react"
import {  useUploadThing } from "@/lib/uploadthing";

interface props{
    initialData?: Partial<EmployerProfileData>;
}


const EmployerSettingForm=({initialData}:props)=>{
   const {register,handleSubmit,control,setValue,watch,formState:{errors,isDirty,isSubmitting}}=useForm<EmployerProfileData>({
    defaultValues:{
      name:initialData?.name || "",
      description:initialData?.description || "",
      organizationType:initialData?.organizationType || undefined,
      teamSize:initialData?.teamSize || undefined,
      yearOfEstablishment:initialData?.yearOfEstablishment,
      websiteUrl:initialData?.websiteUrl || "",
      location:initialData?.location || "",
      avatarUrl:initialData?.avatarUrl || "",
      bannerImageUrl:initialData?.bannerImageUrl || "",
    },
    resolver:zodResolver(employerProfileSchema)
   });

   const avatarUrl=watch("avatarUrl");


   const handleRemoveAvatar=()=>{
    setValue("avatarUrl","");
   }
   const handleFormSubmit = async (data: EmployerProfileData) => {
  console.log("data: ", data);

  const response = await updateEmployerProfileAction(data);

  if (response.status === "SUCCESS") {
    toast.success(response.message);
  } else {
    toast.error(response.message);
  }
};

   const handleSubmitForm=async(data:EmployerProfileData)=>{
     console.log(data)
    const response=await updateEmployerProfileAction(data);


    if(response.status==="SUCCESS") toast.success(response.message)
      else toast.error(response.message)

   }

   return(
   <Card className="w-full lg:w-3/4">
    <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      
      {/* {avatarUrl ? (
  <div className="flex items-center gap-4">
    <div className="relative w-24 h-24 rounded-lg overflow-hidden border-2 border-border">
      <Image
        src={avatarUrl}
        alt="Company logo"
        className="w-full h-full object-cover"
        width={100}
        height={100}
      />
    </div>

    <Button
      type="button"
      variant="destructive"
      size="sm"
      onClick={handleRemoveAvatar}
    >
      <X className="w-4 h-4 mr-2" />
      Remove Logo
    </Button>
  </div>
) : (
  <UploadButton
  endpoint="imageUploader"
  onClientUploadComplete={(res) => {
    const profilePic = res[0];

    setValue("avatarUrl", profilePic.ufsUrl, {
      shouldDirty: true,
    });

    console.log("Files: ", res);
  }}
  onUploadError={(error: Error) => {
    toast.error(`Upload failed: ${error.message}`);
  }}
/>
)} */}


     <div className="grid lg:grid-cols-[1fr_4fr] gap-6"> 
      <Controller
         name="avatarUrl"  control={control} render={({field,fieldState})=>(
            <div className="space-y-2">
              <Label>Upload Logo</Label>
              <ImageUpload value={field.value} onChange={field.onChange} 
                boxText={"A photo larger than 400 pixel works best. Max photo size 5 MB."}
              className={cn(
                fieldState.error && "ring-1 ring-destructive/50 rounded-lg","h-40 w-40 sm:h-64 sm:w-64"
              )}
                />

                {fieldState.error && (
                  <p className="text-sm text-destructive">{fieldState.error.message}</p>
                )}
            </div>
         )}
      />


      
      <Controller
         name="bannerImageUrl"  control={control} render={({field,fieldState})=>(
            <div className="space-y-2">
              <Label>Banner Image</Label>
              <ImageUpload value={field.value} onChange={field.onChange} 
                boxText={"Banner images optimal dimension 1502*400. Supported format JPEG, PNG. Max photo size 5 MB.    "}
              className={cn(
                fieldState.error && "ring-1 ring-destructive/50 rounded-lg","h-64 w-full"
              )}
                />

                {fieldState.error && (
                  <p className="text-sm text-destructive">{fieldState.error.message}</p>
                )}
            </div>
         )}
      />

      </div>
            {/* CompanyName */}

            <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"/>
                <Input id="companyName" type="text" placeholder="Enter company name" 
                className={`pl-10 ${errors.name?"border-destructive":"" }`}
                 {...register("name")}  />
              </div>

              {
                errors.name&& 
                <p className="text-sm text-destructive">{errors.name.message}</p>
              }
            </div>
  


           {/* //Description */}

           <Controller name="description"  control={control}  render={({field,fieldState})=>(
              <div className="space-y-2">
                 <Label>Description</Label>
                 <Tiptap content={field.value} onChange={field.onChange}/>

                 {fieldState.error && (
                  <p className="text-sm text-destructive">  
                    {fieldState.error.message}
                  </p>
                 )}
              </div>
           )}
           
           
           />


    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Organization Type */}
        <div className="space-y-2">
             <Label htmlFor="organizationType">Organization Type</Label>
            <Controller name="organizationType" control={control} render={({field})=>(
               <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2  w-4 h-4 z-10 text-muted-foreground" />
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className={`pl-10 w-full ${errors.organizationType?"border-destructive":"" }`}>
                     <SelectValue placeholder="Select organization type"/>
                  </SelectTrigger>
                <SelectContent>
                 {organizationTypes.map((type) => (
                   <SelectItem key={type} value={type}>
                 {type.toUpperCase()}
               </SelectItem>
           ))}
              </SelectContent>
            </Select>
          </div>
            )}/>

            {
                errors.organizationType&& 
                <p className="text-sm text-destructive">{errors.organizationType.message}</p>
              }
       </div>

       {/*TeamSize*/}
   
        <div className="space-y-2">
            <Label htmlFor="teamSize">Team Size</Label> 
            <Controller name="teamSize" control={control} render={({field})=>(
               <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2  w-4 h-4 z-10 text-muted-foreground" />
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className={`pl-10 w-full ${errors.teamSize?"border-destructive":"" }`}>
                     <SelectValue placeholder="Select TeamSize"/>
                  </SelectTrigger>
                <SelectContent>
                 {teamSizes.map((type) => (
                <SelectItem key={type} value={type}>
                 {type.toUpperCase()}
               </SelectItem>
           ))}
              </SelectContent>
            </Select>
        </div>
            )}/>
            {
                errors.teamSize&& 
                <p className="text-sm text-destructive">{errors.teamSize.message}</p>
            }
      </div>
  </div>


           {/* year of establishment and location */}

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> 
              <div className="space-y-2">
                <Label htmlFor="yearOfEstablishment">Year of Establishment</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 
                  text-muted-foreground"/>
                  <Input id="yearOfEstablishment" placeholder="e.g., 2020" type="text" maxLength={4} 
                  className={`pl-10 ${errors.yearOfEstablishment?"border-destructive":"" }`}
                  {...register("yearOfEstablishment")}/>
                </div>
                {
                errors.yearOfEstablishment&& 
                <p className="text-sm text-destructive">{errors.yearOfEstablishment.message}</p>
              }
             </div>



           <div  className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 
                  text-muted-foreground"/>
                <Input id="location" placeholder="e.g., Pune,Ahmedabad" type="text" 
                  className={`pl-10  ${errors.location?"border-destructive":"" }`}
                  {...register("location")}/>
            </div>
            {
                errors.location&& 
                <p className="text-sm text-destructive">{errors.location.message}</p>
              }
           </div>
        </div>

        {/* Website URL */}

        <div className="space-y-2">
              <Label htmlFor="websiteUrl">Website URL (Optional)</Label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"/>
              <Input id="websiteUrl" type="text" placeholder="https://www.yourcompany.com" 
               className={`pl-10 ${errors.websiteUrl?"border-destructive":"" }`}
               {...register("websiteUrl")}/>
            </div>
            {
                errors.websiteUrl&& 
                <p className="text-sm text-destructive">{errors.websiteUrl.message}</p>
              }
        </div>

           <div className="flex items-center gap-4 pt-5">
             <Button type="submit">
              {isSubmitting && <Loader className="w-4 h-4 animate-spin"/>}
              {isSubmitting ? "Saving Changes.." : "Save Change"}
            </Button>
            {!isDirty && (
              <p className="text-sm text-muted-foreground">No change to save</p>
            )}
           </div>
        </form>
    </CardContent>
   </Card>
   )
}

export default EmployerSettingForm






type ImageUploadProps=Omit<ComponentProps<"div">,"onChange">&{
  value?:string,
   boxText?:string,
   onChange:(url:string)=>void;
}


export const ImageUpload = ({
  value,
  onChange,
  className,
  boxText,
  ...props
}: ImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { startUpload } = useUploadThing("imageUploader", {
    onClientUploadComplete: (res) => {
      if (res && res[0]) {
        const url = res[0].ufsUrl;

        onChange(url);
        setPreviewUrl(url);

        toast.success("Image uploaded successfully!");
      }

      setIsUploading(false);
    },

    onUploadError: (error: Error) => {
      toast.error(`Upload failed: ${error.message}`);

      setIsUploading(false);
      setPreviewUrl(null);
    },
  });

  const handleFileSelect = async (files: File[]) => {
    const file = files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setPreviewUrl(reader.result as string);
    };

    reader.readAsDataURL(file);

    setIsUploading(true);

    await startUpload([file]);
  };

  const {
    getRootProps,
    getInputProps,
    isDragActive,
  } = useDropzone({
    onDrop: handleFileSelect,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".webp"],
    },
    maxFiles: 1,
    disabled: isUploading,
  });

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();

    onChange("");
    setPreviewUrl(null);
  };

  // =========================
  // Image already exists
  // =========================
  if (value || previewUrl) {
    return (
      <div
        className={cn(
          "relative overflow-hidden border-2 border-border rounded-lg group",
          className
        )}
        {...props}
      >
        <Image
          src={previewUrl || value || ""}
          alt="Uploaded Image"
          width={200}
          height={200}
          className="w-full h-full object-cover"
        />

        {/* Uploading Overlay */}
        {isUploading && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 text-white animate-spin" />

              <p className="text-sm text-white font-medium">
                Uploading...
              </p>
            </div>
          </div>
        )}

        {/* Hover Overlay */}
        {!isUploading && (
          <div
            {...getRootProps()}
            className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 cursor-pointer"
          >
            <input {...getInputProps()} />

            {/* Change Image */}
            <Button
              type="button"
              variant="secondary"
              size="sm"
            >
              Change Image
            </Button>

            {/* Remove */}
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleRemove}
            >
              <X className="w-4 h-4 mr-2" />
              Remove
            </Button>
          </div>
        )}
      </div>
    );
  } // 👈 THIS WAS MISSING

  // =========================
  // No image
  // =========================
  return (
    <div
      {...getRootProps()}
      className={cn(
        "h-40 w-40 sm:h-64 sm:w-64",
        "border-2 border-dashed border-border rounded-lg",
        "flex flex-col items-center justify-center",
        "cursor-pointer text-center",
        "hover:bg-muted/50 transition-colors",
        isDragActive && "border-primary bg-muted/30",
        className
      )}
      {...props}
    >
      <input {...getInputProps()} />

      {isUploading ? (
        <>
          <Loader className="w-6 h-6 animate-spin mb-3" />

          <p className="text-sm font-medium">
            Uploading...
          </p>
        </>
      ) : isDragActive ? (
        <p className="text-sm font-medium">
          Drop your photo here
        </p>
      ) : (
        <>
          <div className="mb-3 text-muted-foreground">
            <Upload className="w-6 h-6" />
          </div>

          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">
              Browse photo
            </span>{" "}
            or drop here
          </p>

          <p className="text-[10px] text-muted-foreground mt-2 px-4">
            {boxText}
          </p>
        </>
      )}
    </div>
  );
};