import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { eiaRouter } from "./routers/eia";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import * as db from "./db";

export const appRouter = router({
  system: systemRouter,
  eia: eiaRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // ============================================================================
  // DASHBOARD
  // ============================================================================
  
  dashboard: router({
    stats: protectedProcedure.query(async () => {
      const stats = await db.getDashboardStats();
      return stats || {
        activeClients: 0,
        pendingReferrals: 0,
        activeCrisis: 0,
        pendingClaimsAmount: 0
      };
    }),
  }),

  // ============================================================================
  // CLIENT MANAGEMENT
  // ============================================================================
  
  clients: router({
    list: protectedProcedure.query(async () => {
      return await db.getAllClients();
    }),
    
    active: protectedProcedure.query(async () => {
      return await db.getActiveClients();
    }),
    
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getClientById(input.id);
      }),
    
    create: protectedProcedure
      .input(z.object({
        firstName: z.string(),
        lastName: z.string(),
        dateOfBirth: z.date().optional(),
        gender: z.string().optional(),
        ssn: z.string().optional(),
        phone: z.string().optional(),
        email: z.string().optional(),
        address: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        zipCode: z.string().optional(),
        guardianName: z.string().optional(),
        guardianPhone: z.string().optional(),
        guardianRelationship: z.string().optional(),
        medicaidId: z.string().optional(),
        insuranceProvider: z.string().optional(),
        insurancePolicyNumber: z.string().optional(),
        primaryDiagnosis: z.string().optional(),
        secondaryDiagnosis: z.string().optional(),
        riskLevel: z.enum(['low', 'medium', 'high', 'critical']).optional(),
        status: z.enum(['active', 'inactive', 'discharged']).optional(),
        admissionDate: z.date().optional(),
        dischargeDate: z.date().optional(),
        placementType: z.string().optional(),
        placementAddress: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return await db.createClient(input);
      }),
    
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        data: z.object({
          firstName: z.string().optional(),
          lastName: z.string().optional(),
          phone: z.string().optional(),
          email: z.string().optional(),
          riskLevel: z.enum(['low', 'medium', 'high', 'critical']).optional(),
          status: z.enum(['active', 'inactive', 'discharged']).optional(),
        })
      }))
      .mutation(async ({ input }) => {
        await db.updateClient(input.id, input.data);
        return { success: true };
      }),
  }),

  // ============================================================================
  // REFERRAL MANAGEMENT
  // ============================================================================
  
  referrals: router({
    list: protectedProcedure.query(async () => {
      return await db.getAllReferrals();
    }),
    
    pending: protectedProcedure.query(async () => {
      return await db.getPendingReferrals();
    }),
    
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getReferralById(input.id);
      }),
    
    create: protectedProcedure
      .input(z.object({
        clientId: z.number().optional(),
        referralDate: z.date(),
        referralSource: z.string().optional(),
        referralContactName: z.string().optional(),
        referralContactPhone: z.string().optional(),
        referralContactEmail: z.string().optional(),
        urgencyLevel: z.enum(['routine', 'urgent', 'emergency']).optional(),
        priorityScore: z.number().optional(),
        assignedTo: z.string().optional(),
        status: z.enum(['pending', 'accepted', 'declined', 'completed']).optional(),
        responseDueDate: z.date().optional(),
        intakeScheduledDate: z.date().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return await db.createReferral(input);
      }),
  }),

  // ============================================================================
  // CRISIS MANAGEMENT
  // ============================================================================
  
  crisis: router({
    list: protectedProcedure.query(async () => {
      return await db.getAllCrisisEvents();
    }),
    
    active: protectedProcedure.query(async () => {
      return await db.getActiveCrisisEvents();
    }),
    
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getCrisisEventById(input.id);
      }),
    
    getByClient: protectedProcedure
      .input(z.object({ clientId: z.number() }))
      .query(async ({ input }) => {
        return await db.getCrisisEventsByClient(input.clientId);
      }),
    
    create: protectedProcedure
      .input(z.object({
        clientId: z.number(),
        eventDate: z.date(),
        crisisType: z.string(),
        riskLevel: z.enum(['low', 'medium', 'high', 'critical']),
        location: z.string().optional(),
        description: z.string().optional(),
        interventionType: z.string().optional(),
        interventionDetails: z.string().optional(),
        outcome: z.string().optional(),
        followUpRequired: z.boolean().optional(),
        followUpDueDate: z.date().optional(),
        hospitalization: z.boolean().optional(),
        status: z.enum(['active', 'resolved', 'escalated']).optional(),
        reportedBy: z.string().optional(),
        respondedBy: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return await db.createCrisisEvent(input);
      }),
  }),

  // ============================================================================
  // SERVICE DELIVERY
  // ============================================================================
  
  services: router({
    list: protectedProcedure.query(async () => {
      return await db.getAllServices();
    }),
    
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getServiceById(input.id);
      }),
    
    getByClient: protectedProcedure
      .input(z.object({ clientId: z.number() }))
      .query(async ({ input }) => {
        return await db.getServicesByClient(input.clientId);
      }),
    
    create: protectedProcedure
      .input(z.object({
        clientId: z.number(),
        providerId: z.string().optional(),
        serviceDate: z.date(),
        serviceType: z.string(),
        units: z.number().optional(),
        rate: z.number().optional(),
        totalAmount: z.number().optional(),
        billingStatus: z.enum(['pending', 'ready', 'submitted', 'paid']).optional(),
        documentationCompleted: z.boolean().optional(),
        notes: z.string().optional(),
        serviceLocation: z.string().optional(),
        status: z.enum(['scheduled', 'completed', 'cancelled', 'no_show']).optional(),
      }))
      .mutation(async ({ input }) => {
        return await db.createService(input);
      }),
  }),

  // ============================================================================
  // BILLING & CLAIMS
  // ============================================================================
  
  billing: router({
    list: protectedProcedure.query(async () => {
      return await db.getAllBillingClaims();
    }),
    
    pending: protectedProcedure.query(async () => {
      return await db.getPendingClaims();
    }),
    
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getBillingClaimById(input.id);
      }),
    
    create: protectedProcedure
      .input(z.object({
        clientId: z.number(),
        serviceId: z.number().optional(),
        claimNumber: z.string(),
        claimDate: z.date(),
        serviceDate: z.date(),
        amount: z.number(),
        payer: z.string(),
        status: z.enum(['pending', 'submitted', 'paid', 'denied', 'appealed']).optional(),
        submittedDate: z.date().optional(),
        paidDate: z.date().optional(),
        denialReason: z.string().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return await db.createBillingClaim(input);
      }),
  }),

  // ============================================================================
  // STAFF MANAGEMENT
  // ============================================================================
  
  staff: router({
    list: protectedProcedure.query(async () => {
      return await db.getAllStaff();
    }),
    
    active: protectedProcedure.query(async () => {
      return await db.getActiveStaff();
    }),
    
    getById: protectedProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => {
        return await db.getStaffById(input.id);
      }),
  }),

  // ============================================================================
  // EIA WORKFLOWS & DOCUMENTATION
  // ============================================================================
  
  workflows: router({
    list: protectedProcedure.query(async () => {
      return await db.getAllWorkflows();
    }),
    
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getWorkflowById(input.id);
      }),
    
    create: protectedProcedure
      .input(z.object({
        clientId: z.number(),
        workflowStep: z.enum([
          'referral_receipt',
          'service_engagement',
          'clinical_review',
          'cans_assessment',
          'service_delivery',
          'documentation_qa',
          'risk_management'
        ]),
        status: z.enum(['not_started', 'in_progress', 'completed', 'skipped']).optional(),
        startedAt: z.date().optional(),
        completedAt: z.date().optional(),
        startedBy: z.string().optional(),
        completedBy: z.string().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return await db.createWorkflow(input);
      }),
  }),

  documents: router({
    list: protectedProcedure.query(async () => {
      return await db.getAllDocuments();
    }),
    
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getDocumentById(input.id);
      }),
    
    create: protectedProcedure
      .input(z.object({
        clientId: z.number().optional(),
        workflowId: z.number().optional(),
        referralId: z.number().optional(),
        crisisEventId: z.number().optional(),
        serviceId: z.number().optional(),
        claimId: z.number().optional(),
        documentType: z.string(),
        title: z.string(),
        content: z.string().optional(),
        filePath: z.string().optional(),
        fileUrl: z.string().optional(),
        mimeType: z.string().optional(),
        fileSize: z.number().optional(),
        generatedBy: z.string().optional(),
        generatedAt: z.date().optional(),
        metadata: z.string().optional(),
        status: z.enum(['draft', 'final', 'archived']).optional(),
      }))
      .mutation(async ({ input }) => {
        return await db.createDocument(input);
      }),
    
    templates: protectedProcedure.query(async () => {
      return await db.getAllDocumentTemplates();
    }),
  }),
});

export type AppRouter = typeof appRouter;

