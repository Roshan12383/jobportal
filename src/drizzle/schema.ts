
import { JOB_LEVEL, JOB_TYPE, MIN_EDUCATION, SALARY_CURRENCY, SALARY_PERIOD, WORK_TYPE } from "@/config/constant"
import { relations } from "drizzle-orm/_relations"
import {int,varchar,mysqlTable,text,timestamp, mysqlEnum, year ,datetime, date, boolean, uniqueIndex,} from "drizzle-orm/mysql-core"

export const users=mysqlTable("users",{
  id:int("id").autoincrement().primaryKey(),
  name:varchar("name",{length:255}).notNull(),
  userName:varchar("username",{length:255}).unique().notNull(),
  email:varchar("email",{length:255}).unique(),
  role:mysqlEnum("role",["admin","applicant","employer"]).default("applicant"),
  password:text("password").notNull(),
  phoneNumber:varchar("number",{length:255}),
  avatarUrl:text("avatar_url"),
  deletedAt:timestamp("deleted_at"),
  createdAt:timestamp("created_at").defaultNow().notNull(),
  updatedAt:timestamp("updated_at").defaultNow().onUpdateNow().notNull()
})


export const sessions=mysqlTable("sessions",{
   id:varchar("id",{length:255}).primaryKey(),
   userId:int("user_id").notNull().references(()=>users.id,{onDelete:'cascade'}),
   userAgent:text("user_agent").notNull(),
   ip:varchar("ip",{length:255}).notNull(),
   expiresAt:timestamp("expires_at").notNull(),
   createdAt:timestamp("created_at").defaultNow().notNull(),
   updatedAt:timestamp("updated_at").defaultNow().onUpdateNow().notNull()
})


export const employers=mysqlTable("employers",{
  id:int("id").primaryKey().references(()=>users.id,{onDelete:"cascade"}),
  name:varchar("name",{length:255}),
  description:text("description"),
  avatarUrl:text("avatar_url"),
  bannerImageUrl:text("banner_image_url") ,
  organizationType:varchar("organization_type",{length:100}),
  teamSize:varchar("team_size",{length:50}),
  yearOfEstablishment:year("year_of_establishment"),
  websiteUrl:varchar("website_url",{length:255}),
  location:varchar("location",{length:255}),

  deletedAt:timestamp("deleted_at",{mode:"string"}),
  createdAt:timestamp("created_at",{mode:"string"}).defaultNow().notNull(),
  updatedAt:timestamp("updated_at",{mode:"string"}).defaultNow().notNull(),
})

export const applicants=mysqlTable("applicants",{
  id:int("id").primaryKey().references(()=>users.id,{onDelete:"cascade"}),
  biography:text("biography"),
  dateOfBirth:datetime("date_of_birth"),
  nationality:varchar("nationality",{length:100}),

  maritalStatus: mysqlEnum("marital_status",["single", "married", "divorced"]),
  gender: mysqlEnum("gender",["male", "female", "other"]),
  education: mysqlEnum("education", ["none","high school","undergraduate","masters","phd"]),
  experience: text("experience"),
  websiteUrl: varchar("website_url", { length: 255 }),
  location: varchar("location", { length: 255 }),


  deletedAt:timestamp("deleted_at",{mode:"string"}),
  createdAt:timestamp("created_at",{mode:"string"}).defaultNow().notNull(),
  updatedAt:timestamp("updated_at",{mode:"string"}).defaultNow().notNull(),

});


export const jobs=mysqlTable("jobs",{
  id:int("id").primaryKey().autoincrement(),
  title:varchar("title",{length:255}).notNull(),
  employerId:int("employer_id").notNull().references(()=>employers.id,{onDelete:"cascade"}),
  description:text("description").notNull(),
  tags:text("tags"),
  minSalary:int("min_salary"),
  maxSalary:int("max_salary"),
  salaryCurrency:mysqlEnum("salary_currency",SALARY_CURRENCY),
  salaryPeriod:mysqlEnum("salary_period",SALARY_PERIOD),
  location: varchar("location", { length: 255 }),
  jobType: mysqlEnum("job_type", JOB_TYPE),
  workType: mysqlEnum("work_type", WORK_TYPE),
  jobLevel: mysqlEnum("job_level", JOB_LEVEL),
  experience: text("experience"),   
  minEducation:mysqlEnum("min_education",MIN_EDUCATION),
  isFeatured:boolean("is_featured").default(false).notNull(),
  expiresAt:date("expires_at"),
  deletedAt:timestamp("deleted_at"),
  updatedAt:timestamp("updated_at").defaultNow().notNull(),
  createdAt:timestamp("created_at").defaultNow().notNull(),

});


export const resumes = mysqlTable("resumes", {
  id: int("id").autoincrement().primaryKey(),

  applicantId: int("applicant_id")
    .notNull()
    .references(() => applicants.id, { onDelete: "cascade" }),

  fileUrl: text("file_url").notNull(), // The UploadThing URL
  fileName: varchar("file_name", { length: 255 }).notNull(),

  fileSize: int("file_size"),
  isPrimary: boolean("is_primary").default(false),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .onUpdateNow()
    .notNull(),
});

export const savedJobs = mysqlTable(
  "saved_jobs",
  {
    id: int("id").autoincrement().primaryKey(),
    jobId: int("job_id")
      .notNull()
      .references(() => jobs.id, { onDelete: "cascade" }),
    applicantId: int("applicant_id")
      .notNull()
      .references(() => applicants.id, { onDelete: "cascade" }),
    savedAt: timestamp("saved_at").defaultNow().notNull(),
  },
  (table) => [uniqueIndex("saved_jobs_applicant_job_unique").on(table.applicantId, table.jobId)],
);

export const jobApplications = mysqlTable("job_applications", {
  id: int("id").autoincrement().primaryKey(),

  jobId: int("job_id")
    .notNull()
    .references(() => jobs.id, { onDelete: "cascade" }),

  applicantId: int("applicant_id")
    .notNull()
    .references(() => applicants.id, { onDelete: "cascade" }),

  resumeId: int("resume_id")
    .notNull()
    .references(() => resumes.id, { onDelete: "restrict" }),

  coverLetter: text("cover_letter"),

  appliedAt: timestamp("applied_at").defaultNow().notNull(),
});

export const usersRelations=relations(users,({one,many})=>({
  employer:one(employers,{
    fields:[users.id],
    references:[employers.id],
  }),

  applicant:one(applicants,{
    fields:[users.id],
    references:[applicants.id],
  }),

  sessions:many(sessions)
}))


export const sessionsRelations=relations(sessions, ({ one })=>({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));



export const jobsRelations=relations(jobs,({one, many})=>({
  employer:one(employers,{
    fields:[jobs.employerId],
    references:[employers.id],
  }),
  savedBy: many(savedJobs),
}))


export const resumesRelations = relations(resumes, ({ one }) => ({
  applicant: one(applicants, {
    fields: [resumes.applicantId],
    references: [applicants.id],
  }),
}));


export const applicantRelations=relations(applicants,({many})=>({
  resumes:many(resumes),
  savedJobs: many(savedJobs),
}))

export const savedJobsRelations = relations(savedJobs, ({ one }) => ({
  job: one(jobs, {
    fields: [savedJobs.jobId],
    references: [jobs.id],
  }),
  applicant: one(applicants, {
    fields: [savedJobs.applicantId],
    references: [applicants.id],
  }),
}));


export const jobApplicationsRelations = relations(
  jobApplications,
  ({ one }) => ({
    job: one(jobs, {
      fields: [jobApplications.jobId],
      references: [jobs.id],
    }),

    applicant: one(applicants, {
      fields: [jobApplications.applicantId],
      references: [applicants.id],
    }),

    resume: one(resumes, {
      fields: [jobApplications.resumeId],
      references: [resumes.id],
    }),
  })
); 