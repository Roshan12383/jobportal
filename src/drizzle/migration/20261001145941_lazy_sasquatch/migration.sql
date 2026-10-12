CREATE TABLE `users` (
	`id` int AUTO_INCREMENT PRIMARY KEY,
	`name` varchar(255) NOT NULL,
	`username` varchar(255),
	`email` varchar(255),
	`password` text NOT NULL,
	`number` varchar(255),
	`deleted_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `username_unique` UNIQUE INDEX(`username`),
	CONSTRAINT `email_unique` UNIQUE INDEX(`email`)
);
