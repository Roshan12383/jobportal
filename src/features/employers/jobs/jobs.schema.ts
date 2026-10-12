import { JOB_LEVEL, JOB_TYPE, MIN_EDUCATION, SALARY_CURRENCY, SALARY_PERIOD, WORK_TYPE } from "@/config/constant";
import z from "zod";


export const jobsSchema=z.object({
    title:z.string().trim()
          .min(3,"Job title must be at least 3 characters long")
          .max(255,"job title must not exceed 255 characters"),

    description:z.string().trim()
        .min(50,"Description must be at least 50 characters long")
        .max(5000,"Description must not exceed 5000 characters"),

    tags:z.string().trim()
       .max(500,"Tags must not exceed 500 characters").optional().or(z.literal("")),

   
minSalary: z
  .union([
    z.string().trim().regex(/^\d+$/, "Minimum salary must be a valid number").transform(Number),
    z.number().finite().nonnegative(),
  ])
  .optional()
  .or(z.literal(""))
  .transform((v) => (v === "" || v === undefined ? null : v))
  .nullable(),

maxSalary: z
  .union([
    z.string().trim().regex(/^\d+$/, "Maximum salary must be a valid number").transform(Number),
    z.number().finite().nonnegative(),
  ])
  .optional()
  .or(z.literal(""))
  .transform((v) => (v === "" || v === undefined ? null : v))
  .nullable(),

    salaryCurrency: z.enum(SALARY_CURRENCY, {error: "Please select a valid currency",}).optional(),

    salaryPeriod: z.enum(SALARY_PERIOD, {error: "Please select a valid salary period", }).optional(),

    location:z.string().trim()
        .min(2,"Location must be at least 2 characters long")
        .max(255,"Location must not exceed 255 characters").optional().or(z.literal("")),

    jobType:z.enum(JOB_TYPE, {error:"Please select a valid job type",}),

    workType:z.enum(WORK_TYPE, {error:"Please select a valid work type",}),

    jobLevel:z.enum(JOB_LEVEL, {error:"Please select a valid job level",}),

    
    experience: z.string().trim()
        .max(1000, "Experience requirements must not exceed 1000 characters").optional().or(z.literal("")),

    minEducation: z.enum(MIN_EDUCATION, { error: "Please select a valid education level",}).optional(),

    expiresAt: z
  .union([z.string(), z.date(), z.null()])
  .optional()
  .or(z.literal(""))
  .transform((value) => {
    if (value == null || value === "") return null;
    const date = value instanceof Date ? new Date(value) : new Date(value);
    if (Number.isNaN(date.getTime())) return null;
    date.setHours(0, 0, 0, 0);
    return date;
  })
  .refine((date) => {
    if (!date) return true;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today;
  }, {
    message: "Expiry date must be today or in the future",
  }),

})
.refine((data)=>{
    if(data.minSalary && data.maxSalary){
        return data.minSalary <= data.maxSalary;
    }

    return true
},
{
    message:"Maximum salary must be greater than or equal to minimum salary",
    path:["maxSalary"],
}
)
.refine((data)=>{
   const hasSalaryInfo= data.minSalary || data.maxSalary || data.salaryCurrency || data.salaryPeriod;

   if(hasSalaryInfo){
    return data.salaryCurrency && data.salaryPeriod;
   }

   return true
},{
    message:"Currency and period are required when salary is specified",
    path:["salaryCurrency"],
})


export type JobFormData=z.infer<typeof jobsSchema> ;




