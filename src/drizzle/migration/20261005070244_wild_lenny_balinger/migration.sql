CREATE TABLE `applicants` (
	`id` int PRIMARY KEY,
	`biography` text,
	`date_of_birth` datetime,
	`nationality` varchar(100),
	`marital_status` enum('single','married','divorced'),
	`gender` enum('male','female','other'),
	`education` enum('none','high school','undergraduate','masters','phd'),
	`experience` text,
	`website_url` varchar(255),
	`location` varchar(255),
	`deleted_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now())
);
--> statement-breakpoint
CREATE TABLE `employers` (
	`id` int PRIMARY KEY,
	`name` varchar(255),
	`description` text,
	`avatar_url` text,
	`banner_image_url` text,
	`organization_type` varchar(100),
	`team-size` varchar(50),
	`year_of_establishment` year,
	`website_url` varchar(255),
	`location` varchar(255),
	`deleted_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now())
);
--> statement-breakpoint
ALTER TABLE `applicants` ADD CONSTRAINT `applicants_id_users_id_fkey` FOREIGN KEY (`id`) REFERENCES `users`(`id`) ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE `employers` ADD CONSTRAINT `employers_id_users_id_fkey` FOREIGN KEY (`id`) REFERENCES `users`(`id`) ON DELETE CASCADE;