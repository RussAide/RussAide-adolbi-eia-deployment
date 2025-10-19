import { relations } from "drizzle-orm";
import {
  boolean,
  datetime,
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin", "therapist", "case_manager", "billing", "intake_coordinator", "clinical_director", "program_manager", "qa_officer"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow(),
  // Staff profile fields
  credentials: varchar("credentials", { length: 100 }),
  licenseNumber: varchar("licenseNumber", { length: 50 }),
  licenseExpiration: datetime("licenseExpiration"),
  npiNumber: varchar("npiNumber", { length: 20 }),
  phone: varchar("phone", { length: 20 }),
  maxCaseload: int("maxCaseload"),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Clients table - Core client management
 */
export const clients = mysqlTable("clients", {
  id: int("id").primaryKey().autoincrement(),
  firstName: varchar("firstName", { length: 100 }).notNull(),
  lastName: varchar("lastName", { length: 100 }).notNull(),
  dateOfBirth: datetime("dateOfBirth"),
  gender: varchar("gender", { length: 20 }),
  ssn: varchar("ssn", { length: 11 }),
  phone: varchar("phone", { length: 20 }),
  email: varchar("email", { length: 320 }),
  address: text("address"),
  city: varchar("city", { length: 100 }),
  state: varchar("state", { length: 2 }),
  zipCode: varchar("zipCode", { length: 10 }),
  guardianName: varchar("guardianName", { length: 200 }),
  guardianPhone: varchar("guardianPhone", { length: 20 }),
  guardianRelationship: varchar("guardianRelationship", { length: 50 }),
  medicaidId: varchar("medicaidId", { length: 50 }),
  insuranceProvider: varchar("insuranceProvider", { length: 100 }),
  insurancePolicyNumber: varchar("insurancePolicyNumber", { length: 50 }),
  primaryDiagnosis: text("primaryDiagnosis"),
  secondaryDiagnosis: text("secondaryDiagnosis"),
  riskLevel: mysqlEnum("riskLevel", ["low", "medium", "high", "critical"]).default("low"),
  status: mysqlEnum("status", ["active", "inactive", "discharged"]).default("active"),
  admissionDate: datetime("admissionDate"),
  dischargeDate: datetime("dischargeDate"),
  placementType: varchar("placementType", { length: 100 }),
  placementAddress: text("placementAddress"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export type Client = typeof clients.$inferSelect;
export type InsertClient = typeof clients.$inferInsert;

/**
 * Referrals table
 */
export const referrals = mysqlTable("referrals", {
  id: int("id").primaryKey().autoincrement(),
  clientId: int("clientId").references(() => clients.id),
  referralDate: datetime("referralDate").notNull(),
  referralSource: varchar("referralSource", { length: 200 }),
  referralContactName: varchar("referralContactName", { length: 200 }),
  referralContactPhone: varchar("referralContactPhone", { length: 20 }),
  referralContactEmail: varchar("referralContactEmail", { length: 320 }),
  urgencyLevel: mysqlEnum("urgencyLevel", ["routine", "urgent", "emergency"]).default("routine"),
  priorityScore: int("priorityScore"),
  assignedTo: varchar("assignedTo", { length: 64 }).references(() => users.id),
  status: mysqlEnum("status", ["pending", "accepted", "declined", "completed"]).default("pending"),
  responseDueDate: datetime("responseDueDate"),
  intakeScheduledDate: datetime("intakeScheduledDate"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export type Referral = typeof referrals.$inferSelect;
export type InsertReferral = typeof referrals.$inferInsert;

/**
 * Crisis events table
 */
export const crisisEvents = mysqlTable("crisisEvents", {
  id: int("id").primaryKey().autoincrement(),
  clientId: int("clientId").notNull().references(() => clients.id),
  eventDate: datetime("eventDate").notNull(),
  crisisType: varchar("crisisType", { length: 100 }),
  riskLevel: mysqlEnum("riskLevel", ["low", "medium", "high", "critical"]).notNull(),
  location: varchar("location", { length: 200 }),
  description: text("description"),
  interventionType: varchar("interventionType", { length: 100 }),
  interventionDetails: text("interventionDetails"),
  outcome: text("outcome"),
  followUpRequired: boolean("followUpRequired").default(false),
  followUpDueDate: datetime("followUpDueDate"),
  followUpCompleted: boolean("followUpCompleted").default(false),
  hospitalization: boolean("hospitalization").default(false),
  status: mysqlEnum("status", ["active", "resolved", "escalated"]).default("active"),
  reportedBy: varchar("reportedBy", { length: 64 }).references(() => users.id),
  respondedBy: varchar("respondedBy", { length: 64 }).references(() => users.id),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export type CrisisEvent = typeof crisisEvents.$inferSelect;
export type InsertCrisisEvent = typeof crisisEvents.$inferInsert;

/**
 * Services table
 */
export const services = mysqlTable("services", {
  id: int("id").primaryKey().autoincrement(),
  clientId: int("clientId").notNull().references(() => clients.id),
  providerId: varchar("providerId", { length: 64 }).references(() => users.id),
  serviceDate: datetime("serviceDate").notNull(),
  serviceType: varchar("serviceType", { length: 100 }).notNull(),
  units: int("units"),
  rate: int("rate"),
  totalAmount: int("totalAmount"),
  billingStatus: mysqlEnum("billingStatus", ["pending", "ready", "submitted", "paid"]).default("pending"),
  documentationCompleted: boolean("documentationCompleted").default(false),
  notes: text("notes"),
  serviceLocation: varchar("serviceLocation", { length: 200 }),
  status: mysqlEnum("status", ["scheduled", "completed", "cancelled", "no_show"]).default("scheduled"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export type Service = typeof services.$inferSelect;
export type InsertService = typeof services.$inferInsert;

/**
 * Billing claims table
 */
export const billingClaims = mysqlTable("billingClaims", {
  id: int("id").primaryKey().autoincrement(),
  clientId: int("clientId").notNull().references(() => clients.id),
  claimNumber: varchar("claimNumber", { length: 50 }),
  serviceDate: datetime("serviceDate").notNull(),
  amount: int("amount").notNull(),
  amountPaid: int("amountPaid"),
  adjustmentAmount: int("adjustmentAmount"),
  payerName: varchar("payerName", { length: 200 }),
  payerId: varchar("payerId", { length: 50 }),
  status: mysqlEnum("status", ["pending", "submitted", "paid", "denied", "appealed"]).default("pending"),
  submissionDate: datetime("submissionDate"),
  paymentDate: datetime("paymentDate"),
  denialDate: datetime("denialDate"),
  denialReason: text("denialReason"),
  appealNotes: text("appealNotes"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export type BillingClaim = typeof billingClaims.$inferSelect;
export type InsertBillingClaim = typeof billingClaims.$inferInsert;

/**
 * EIA Workflows table - Tracks document generation workflows
 */
export const eiaWorkflows = mysqlTable("eiaWorkflows", {
  id: int("id").primaryKey().autoincrement(),
  clientId: int("clientId").notNull().references(() => clients.id),
  workflowStep: mysqlEnum("workflowStep", [
    "referral_receipt",
    "service_engagement",
    "clinical_review",
    "cans_assessment",
    "service_delivery",
    "documentation_qa",
    "risk_management"
  ]).notNull(),
  status: mysqlEnum("status", ["not_started", "in_progress", "completed", "skipped"]).default("not_started"),
  startedAt: datetime("startedAt"),
  completedAt: datetime("completedAt"),
  startedBy: varchar("startedBy", { length: 64 }).references(() => users.id),
  completedBy: varchar("completedBy", { length: 64 }).references(() => users.id),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export type EiaWorkflow = typeof eiaWorkflows.$inferSelect;
export type InsertEiaWorkflow = typeof eiaWorkflows.$inferInsert;

/**
 * Documents table - Stores all generated documents
 */
export const documents = mysqlTable("documents", {
  id: int("id").primaryKey().autoincrement(),
  clientId: int("clientId").references(() => clients.id),
  workflowId: int("workflowId").references(() => eiaWorkflows.id),
  referralId: int("referralId").references(() => referrals.id),
  crisisEventId: int("crisisEventId").references(() => crisisEvents.id),
  serviceId: int("serviceId").references(() => services.id),
  claimId: int("claimId").references(() => billingClaims.id),
  documentType: varchar("documentType", { length: 100 }).notNull(),
  title: varchar("title", { length: 500 }).notNull(),
  content: text("content"),
  filePath: varchar("filePath", { length: 500 }),
  fileUrl: varchar("fileUrl", { length: 500 }),
  mimeType: varchar("mimeType", { length: 100 }),
  fileSize: int("fileSize"),
  generatedBy: varchar("generatedBy", { length: 64 }).references(() => users.id),
  generatedAt: datetime("generatedAt"),
  metadata: text("metadata"), // JSON string for additional data
  status: mysqlEnum("status", ["draft", "final", "archived"]).default("draft"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export type Document = typeof documents.$inferSelect;
export type InsertDocument = typeof documents.$inferInsert;

/**
 * Document templates table - For EIA document generation
 */
export const documentTemplates = mysqlTable("documentTemplates", {
  id: int("id").primaryKey().autoincrement(),
  templateName: varchar("templateName", { length: 200 }).notNull(),
  documentType: varchar("documentType", { length: 100 }).notNull(),
  workflowStep: mysqlEnum("workflowStep", [
    "referral_receipt",
    "service_engagement",
    "clinical_review",
    "cans_assessment",
    "service_delivery",
    "documentation_qa",
    "risk_management"
  ]),
  templateContent: text("templateContent").notNull(),
  promptTemplate: text("promptTemplate"),
  variables: text("variables"), // JSON array of variable names
  isActive: boolean("isActive").default(true),
  createdBy: varchar("createdBy", { length: 64 }).references(() => users.id),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export type DocumentTemplate = typeof documentTemplates.$inferSelect;
export type InsertDocumentTemplate = typeof documentTemplates.$inferInsert;

// Relations
export const clientsRelations = relations(clients, ({ many }) => ({
  referrals: many(referrals),
  crisisEvents: many(crisisEvents),
  services: many(services),
  billingClaims: many(billingClaims),
  eiaWorkflows: many(eiaWorkflows),
  documents: many(documents),
}));

export const referralsRelations = relations(referrals, ({ one, many }) => ({
  client: one(clients, {
    fields: [referrals.clientId],
    references: [clients.id],
  }),
  assignedUser: one(users, {
    fields: [referrals.assignedTo],
    references: [users.id],
  }),
  documents: many(documents),
}));

export const crisisEventsRelations = relations(crisisEvents, ({ one, many }) => ({
  client: one(clients, {
    fields: [crisisEvents.clientId],
    references: [clients.id],
  }),
  reportedByUser: one(users, {
    fields: [crisisEvents.reportedBy],
    references: [users.id],
  }),
  respondedByUser: one(users, {
    fields: [crisisEvents.respondedBy],
    references: [users.id],
  }),
  documents: many(documents),
}));

export const servicesRelations = relations(services, ({ one, many }) => ({
  client: one(clients, {
    fields: [services.clientId],
    references: [clients.id],
  }),
  provider: one(users, {
    fields: [services.providerId],
    references: [users.id],
  }),
  documents: many(documents),
}));

export const billingClaimsRelations = relations(billingClaims, ({ one, many }) => ({
  client: one(clients, {
    fields: [billingClaims.clientId],
    references: [clients.id],
  }),
  documents: many(documents),
}));

export const eiaWorkflowsRelations = relations(eiaWorkflows, ({ one, many }) => ({
  client: one(clients, {
    fields: [eiaWorkflows.clientId],
    references: [clients.id],
  }),
  startedByUser: one(users, {
    fields: [eiaWorkflows.startedBy],
    references: [users.id],
  }),
  completedByUser: one(users, {
    fields: [eiaWorkflows.completedBy],
    references: [users.id],
  }),
  documents: many(documents),
}));

export const documentsRelations = relations(documents, ({ one }) => ({
  client: one(clients, {
    fields: [documents.clientId],
    references: [clients.id],
  }),
  workflow: one(eiaWorkflows, {
    fields: [documents.workflowId],
    references: [eiaWorkflows.id],
  }),
  referral: one(referrals, {
    fields: [documents.referralId],
    references: [referrals.id],
  }),
  crisisEvent: one(crisisEvents, {
    fields: [documents.crisisEventId],
    references: [crisisEvents.id],
  }),
  service: one(services, {
    fields: [documents.serviceId],
    references: [services.id],
  }),
  claim: one(billingClaims, {
    fields: [documents.claimId],
    references: [billingClaims.id],
  }),
  generatedByUser: one(users, {
    fields: [documents.generatedBy],
    references: [users.id],
  }),
}));

