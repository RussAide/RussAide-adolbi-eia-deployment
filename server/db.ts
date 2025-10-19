import { eq, desc, and, gte, lte, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, 
  users, 
  clients, 
  referrals, 
  crisisEvents, 
  services, 
  billingClaims, 
  eiaWorkflows,
  documents,
  documentTemplates,
  InsertClient,
  InsertReferral,
  InsertCrisisEvent,
  InsertService,
  InsertBillingClaim,
  InsertEiaWorkflow,
  InsertDocument
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ============================================================================
// USER MANAGEMENT
// ============================================================================

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.id) {
    throw new Error("User ID is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      id: user.id,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role === undefined) {
      if (user.id === ENV.ownerId) {
        user.role = 'admin';
        values.role = 'admin';
        updateSet.role = 'admin';
      }
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUser(id: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ============================================================================
// CLIENT MANAGEMENT
// ============================================================================

export async function getAllClients() {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.select().from(clients).orderBy(desc(clients.createdAt));
  return result;
}

export async function getClientById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(clients).where(eq(clients.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createClient(client: InsertClient) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(clients).values(client);
  return result;
}

export async function updateClient(id: number, client: Partial<InsertClient>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(clients).set(client).where(eq(clients.id, id));
}

export async function getActiveClients() {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.select().from(clients)
    .where(eq(clients.status, 'active'))
    .orderBy(desc(clients.createdAt));
  return result;
}

// ============================================================================
// REFERRAL MANAGEMENT
// ============================================================================

export async function getAllReferrals() {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.select().from(referrals).orderBy(desc(referrals.createdAt));
  return result;
}

export async function getReferralById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(referrals).where(eq(referrals.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createReferral(referral: InsertReferral) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(referrals).values(referral);
  return result;
}

export async function getPendingReferrals() {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.select().from(referrals)
    .where(eq(referrals.status, 'pending'))
    .orderBy(desc(referrals.createdAt));
  return result;
}

// ============================================================================
// CRISIS MANAGEMENT
// ============================================================================

export async function getAllCrisisEvents() {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.select().from(crisisEvents).orderBy(desc(crisisEvents.eventDate));
  return result;
}

export async function getCrisisEventById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(crisisEvents).where(eq(crisisEvents.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getCrisisEventsByClient(clientId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.select().from(crisisEvents)
    .where(eq(crisisEvents.clientId, clientId))
    .orderBy(desc(crisisEvents.eventDate));
  return result;
}

export async function createCrisisEvent(event: InsertCrisisEvent) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(crisisEvents).values(event);
  return result;
}

export async function getActiveCrisisEvents() {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.select().from(crisisEvents)
    .where(eq(crisisEvents.status, 'active'))
    .orderBy(desc(crisisEvents.eventDate));
  return result;
}

// ============================================================================
// SERVICE DELIVERY
// ============================================================================

export async function getAllServices() {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.select().from(services).orderBy(desc(services.serviceDate));
  return result;
}

export async function getServiceById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(services).where(eq(services.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getServicesByClient(clientId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.select().from(services)
    .where(eq(services.clientId, clientId))
    .orderBy(desc(services.serviceDate));
  return result;
}

export async function createService(service: InsertService) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(services).values(service);
  return result;
}

// ============================================================================
// BILLING & CLAIMS
// ============================================================================

export async function getAllBillingClaims() {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.select().from(billingClaims).orderBy(desc(billingClaims.createdAt));
  return result;
}

export async function getBillingClaimById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(billingClaims).where(eq(billingClaims.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createBillingClaim(claim: InsertBillingClaim) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(billingClaims).values(claim);
  return result;
}

export async function getPendingClaims() {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.select().from(billingClaims)
    .where(eq(billingClaims.status, 'pending'))
    .orderBy(desc(billingClaims.createdAt));
  return result;
}

// ============================================================================
// STAFF MANAGEMENT (uses users table with staff roles)
// ============================================================================

export async function getAllStaff() {
  const db = await getDb();
  if (!db) return [];
  
  // Get users with staff roles
  const result = await db.select().from(users)
    .where(sql`${users.role} IN ('therapist', 'case_manager', 'clinical_director', 'program_manager', 'qa_officer')`);
  return result;
}

export async function getStaffById(id: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getActiveStaff() {
  const db = await getDb();
  if (!db) return [];
  
  // Get users with staff roles
  const result = await db.select().from(users)
    .where(sql`${users.role} IN ('therapist', 'case_manager', 'clinical_director', 'program_manager', 'qa_officer')`);
  return result;
}

// ============================================================================
// EIA WORKFLOWS & DOCUMENTS
// ============================================================================

export async function getAllWorkflows() {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.select().from(eiaWorkflows).orderBy(desc(eiaWorkflows.createdAt));
  return result;
}

export async function getWorkflowById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(eiaWorkflows).where(eq(eiaWorkflows.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createWorkflow(workflow: InsertEiaWorkflow) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(eiaWorkflows).values(workflow);
  return result;
}

export async function getAllDocuments() {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.select().from(documents).orderBy(desc(documents.createdAt));
  return result;
}

export async function getDocumentById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(documents).where(eq(documents.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createDocument(document: InsertDocument) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(documents).values(document);
  return result;
}

export async function getAllDocumentTemplates() {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.select().from(documentTemplates).orderBy(desc(documentTemplates.createdAt));
  return result;
}

// ============================================================================
// DASHBOARD STATISTICS
// ============================================================================

export async function getDashboardStats() {
  const db = await getDb();
  if (!db) return null;
  
  try {
    // Get active clients count
    const activeClientsResult = await db.select({ count: sql<number>`count(*)` })
      .from(clients)
      .where(eq(clients.status, 'active'));
    const activeClients = activeClientsResult[0]?.count || 0;
    
    // Get pending referrals count
    const pendingReferralsResult = await db.select({ count: sql<number>`count(*)` })
      .from(referrals)
      .where(eq(referrals.status, 'pending'));
    const pendingReferrals = pendingReferralsResult[0]?.count || 0;
    
    // Get active crisis events count
    const activeCrisisResult = await db.select({ count: sql<number>`count(*)` })
      .from(crisisEvents)
      .where(eq(crisisEvents.status, 'active'));
    const activeCrisis = activeCrisisResult[0]?.count || 0;
    
    // Get pending claims total
    const pendingClaimsResult = await db.select({ total: sql<number>`sum(amount)` })
      .from(billingClaims)
      .where(eq(billingClaims.status, 'pending'));
    const pendingClaimsAmount = pendingClaimsResult[0]?.total || 0;
    
    return {
      activeClients,
      pendingReferrals,
      activeCrisis,
      pendingClaimsAmount
    };
  } catch (error) {
    console.error("[Database] Failed to get dashboard stats:", error);
    return null;
  }
}

