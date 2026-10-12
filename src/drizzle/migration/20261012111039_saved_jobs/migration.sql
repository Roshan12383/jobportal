CREATE TABLE `saved_jobs` (
	`id` int AUTO_INCREMENT PRIMARY KEY,
	`job_id` int NOT NULL,
	`applicant_id` int NOT NULL,
	`saved_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `saved_jobs_applicant_job_unique` UNIQUE INDEX(`applicant_id`,`job_id`),
	CONSTRAINT `saved_jobs_job_id_jobs_id_fkey` FOREIGN KEY (`job_id`) REFERENCES `jobs`(`id`),
	CONSTRAINT `saved_jobs_applicant_id_applicants_id_fkey` FOREIGN KEY (`applicant_id`) REFERENCES `applicants`(`id`)
);
