CREATE TABLE `billingClaims` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`claimNumber` varchar(50),
	`serviceDate` datetime NOT NULL,
	`amount` int NOT NULL,
	`amountPaid` int,
	`adjustmentAmount` int,
	`payerName` varchar(200),
	`payerId` varchar(50),
	`status` enum('pending','submitted','paid','denied','appealed') DEFAULT 'pending',
	`submissionDate` datetime,
	`paymentDate` datetime,
	`denialDate` datetime,
	`denialReason` text,
	`appealNotes` text,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `billingClaims_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `clients` (
	`id` int AUTO_INCREMENT NOT NULL,
	`firstName` varchar(100) NOT NULL,
	`lastName` varchar(100) NOT NULL,
	`dateOfBirth` datetime,
	`gender` varchar(20),
	`ssn` varchar(11),
	`phone` varchar(20),
	`email` varchar(320),
	`address` text,
	`city` varchar(100),
	`state` varchar(2),
	`zipCode` varchar(10),
	`guardianName` varchar(200),
	`guardianPhone` varchar(20),
	`guardianRelationship` varchar(50),
	`medicaidId` varchar(50),
	`insuranceProvider` varchar(100),
	`insurancePolicyNumber` varchar(50),
	`primaryDiagnosis` text,
	`secondaryDiagnosis` text,
	`riskLevel` enum('low','medium','high','critical') DEFAULT 'low',
	`status` enum('active','inactive','discharged') DEFAULT 'active',
	`admissionDate` datetime,
	`dischargeDate` datetime,
	`placementType` varchar(100),
	`placementAddress` text,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `clients_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `crisisEvents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`eventDate` datetime NOT NULL,
	`crisisType` varchar(100),
	`riskLevel` enum('low','medium','high','critical') NOT NULL,
	`location` varchar(200),
	`description` text,
	`interventionType` varchar(100),
	`interventionDetails` text,
	`outcome` text,
	`followUpRequired` boolean DEFAULT false,
	`followUpDueDate` datetime,
	`followUpCompleted` boolean DEFAULT false,
	`hospitalization` boolean DEFAULT false,
	`status` enum('active','resolved','escalated') DEFAULT 'active',
	`reportedBy` varchar(64),
	`respondedBy` varchar(64),
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `crisisEvents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `documentTemplates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`templateName` varchar(200) NOT NULL,
	`documentType` varchar(100) NOT NULL,
	`workflowStep` enum('referral_receipt','service_engagement','clinical_review','cans_assessment','service_delivery','documentation_qa','risk_management'),
	`templateContent` text NOT NULL,
	`promptTemplate` text,
	`variables` text,
	`isActive` boolean DEFAULT true,
	`createdBy` varchar(64),
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `documentTemplates_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `documents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int,
	`workflowId` int,
	`referralId` int,
	`crisisEventId` int,
	`serviceId` int,
	`claimId` int,
	`documentType` varchar(100) NOT NULL,
	`title` varchar(500) NOT NULL,
	`content` text,
	`filePath` varchar(500),
	`fileUrl` varchar(500),
	`mimeType` varchar(100),
	`fileSize` int,
	`generatedBy` varchar(64),
	`generatedAt` datetime,
	`metadata` text,
	`status` enum('draft','final','archived') DEFAULT 'draft',
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `documents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `eiaWorkflows` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`workflowStep` enum('referral_receipt','service_engagement','clinical_review','cans_assessment','service_delivery','documentation_qa','risk_management') NOT NULL,
	`status` enum('not_started','in_progress','completed','skipped') DEFAULT 'not_started',
	`startedAt` datetime,
	`completedAt` datetime,
	`startedBy` varchar(64),
	`completedBy` varchar(64),
	`notes` text,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `eiaWorkflows_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `referrals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int,
	`referralDate` datetime NOT NULL,
	`referralSource` varchar(200),
	`referralContactName` varchar(200),
	`referralContactPhone` varchar(20),
	`referralContactEmail` varchar(320),
	`urgencyLevel` enum('routine','urgent','emergency') DEFAULT 'routine',
	`priorityScore` int,
	`assignedTo` varchar(64),
	`status` enum('pending','accepted','declined','completed') DEFAULT 'pending',
	`responseDueDate` datetime,
	`intakeScheduledDate` datetime,
	`notes` text,
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `referrals_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `services` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`providerId` varchar(64),
	`serviceDate` datetime NOT NULL,
	`serviceType` varchar(100) NOT NULL,
	`units` int,
	`rate` int,
	`totalAmount` int,
	`billingStatus` enum('pending','ready','submitted','paid') DEFAULT 'pending',
	`documentationCompleted` boolean DEFAULT false,
	`notes` text,
	`serviceLocation` varchar(200),
	`status` enum('scheduled','completed','cancelled','no_show') DEFAULT 'scheduled',
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()),
	CONSTRAINT `services_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('user','admin','therapist','case_manager','billing','intake_coordinator','clinical_director','program_manager','qa_officer') NOT NULL DEFAULT 'user';--> statement-breakpoint
ALTER TABLE `users` ADD `credentials` varchar(100);--> statement-breakpoint
ALTER TABLE `users` ADD `licenseNumber` varchar(50);--> statement-breakpoint
ALTER TABLE `users` ADD `licenseExpiration` datetime;--> statement-breakpoint
ALTER TABLE `users` ADD `npiNumber` varchar(20);--> statement-breakpoint
ALTER TABLE `users` ADD `phone` varchar(20);--> statement-breakpoint
ALTER TABLE `users` ADD `maxCaseload` int;--> statement-breakpoint
ALTER TABLE `billingClaims` ADD CONSTRAINT `billingClaims_clientId_clients_id_fk` FOREIGN KEY (`clientId`) REFERENCES `clients`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `crisisEvents` ADD CONSTRAINT `crisisEvents_clientId_clients_id_fk` FOREIGN KEY (`clientId`) REFERENCES `clients`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `crisisEvents` ADD CONSTRAINT `crisisEvents_reportedBy_users_id_fk` FOREIGN KEY (`reportedBy`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `crisisEvents` ADD CONSTRAINT `crisisEvents_respondedBy_users_id_fk` FOREIGN KEY (`respondedBy`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `documentTemplates` ADD CONSTRAINT `documentTemplates_createdBy_users_id_fk` FOREIGN KEY (`createdBy`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `documents` ADD CONSTRAINT `documents_clientId_clients_id_fk` FOREIGN KEY (`clientId`) REFERENCES `clients`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `documents` ADD CONSTRAINT `documents_workflowId_eiaWorkflows_id_fk` FOREIGN KEY (`workflowId`) REFERENCES `eiaWorkflows`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `documents` ADD CONSTRAINT `documents_referralId_referrals_id_fk` FOREIGN KEY (`referralId`) REFERENCES `referrals`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `documents` ADD CONSTRAINT `documents_crisisEventId_crisisEvents_id_fk` FOREIGN KEY (`crisisEventId`) REFERENCES `crisisEvents`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `documents` ADD CONSTRAINT `documents_serviceId_services_id_fk` FOREIGN KEY (`serviceId`) REFERENCES `services`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `documents` ADD CONSTRAINT `documents_claimId_billingClaims_id_fk` FOREIGN KEY (`claimId`) REFERENCES `billingClaims`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `documents` ADD CONSTRAINT `documents_generatedBy_users_id_fk` FOREIGN KEY (`generatedBy`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `eiaWorkflows` ADD CONSTRAINT `eiaWorkflows_clientId_clients_id_fk` FOREIGN KEY (`clientId`) REFERENCES `clients`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `eiaWorkflows` ADD CONSTRAINT `eiaWorkflows_startedBy_users_id_fk` FOREIGN KEY (`startedBy`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `eiaWorkflows` ADD CONSTRAINT `eiaWorkflows_completedBy_users_id_fk` FOREIGN KEY (`completedBy`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `referrals` ADD CONSTRAINT `referrals_clientId_clients_id_fk` FOREIGN KEY (`clientId`) REFERENCES `clients`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `referrals` ADD CONSTRAINT `referrals_assignedTo_users_id_fk` FOREIGN KEY (`assignedTo`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `services` ADD CONSTRAINT `services_clientId_clients_id_fk` FOREIGN KEY (`clientId`) REFERENCES `clients`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `services` ADD CONSTRAINT `services_providerId_users_id_fk` FOREIGN KEY (`providerId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;