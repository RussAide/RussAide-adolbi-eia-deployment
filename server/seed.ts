import { drizzle } from "drizzle-orm/mysql2";
import {
  users,
  clients,
  referrals,
  crisisEvents,
  services,
  billingClaims,
  eiaWorkflows,
  documents,
  documentTemplates,
} from "../drizzle/schema";

// Get database connection
const db = drizzle(process.env.DATABASE_URL!);

async function seed() {
  console.log("🌱 Starting database seeding...");

  try {
    // Clear existing data (in reverse order of foreign key dependencies)
    console.log("Clearing existing data...");
    await db.delete(documents);
    await db.delete(documentTemplates);
    await db.delete(eiaWorkflows);
    await db.delete(billingClaims);
    await db.delete(services);
    await db.delete(crisisEvents);
    await db.delete(referrals);
    await db.delete(clients);
    // Don't delete users table as it may contain authenticated users
    console.log("Existing data cleared.");
    // 1. Create staff users (use upsert to handle duplicates)
    console.log("Creating staff users...");
    const staffUsers = [
      {
        id: "staff_therapist_1",
        name: "Dr. Sarah Johnson",
        email: "sarah.johnson@adolbicare.com",
        role: "therapist" as const,
        credentials: "PhD, LCSW",
        licenseNumber: "LCSW-12345",
        licenseExpiration: new Date("2026-12-31"),
        npiNumber: "1234567890",
        phone: "(555) 123-4567",
        maxCaseload: 25,
      },
      {
        id: "staff_therapist_2",
        name: "Michael Chen",
        email: "michael.chen@adolbicare.com",
        role: "therapist" as const,
        credentials: "MSW, LMFT",
        licenseNumber: "LMFT-67890",
        licenseExpiration: new Date("2027-06-30"),
        npiNumber: "0987654321",
        phone: "(555) 234-5678",
        maxCaseload: 20,
      },
      {
        id: "staff_case_manager_1",
        name: "Jennifer Martinez",
        email: "jennifer.martinez@adolbicare.com",
        role: "case_manager" as const,
        credentials: "BSW",
        phone: "(555) 345-6789",
        maxCaseload: 30,
      },
      {
        id: "staff_billing_1",
        name: "Robert Taylor",
        email: "robert.taylor@adolbicare.com",
        role: "billing" as const,
        phone: "(555) 456-7890",
      },
      {
        id: "staff_director_1",
        name: "Dr. Emily Rodriguez",
        email: "emily.rodriguez@adolbicare.com",
        role: "clinical_director" as const,
        credentials: "PhD, LCSW",
        licenseNumber: "LCSW-11111",
        licenseExpiration: new Date("2028-12-31"),
        npiNumber: "1111111111",
        phone: "(555) 567-8901",
      },
    ];
    
    // Insert users one by one to handle duplicates gracefully
    for (const user of staffUsers) {
      try {
        await db.insert(users).values(user).onDuplicateKeyUpdate({ set: { name: user.name } });
      } catch (error) {
        console.log(`User ${user.id} already exists, skipping...`);
      }
    }

    // 2. Create clients
    console.log("Creating clients...");
    const clientResults = await db.insert(clients).values([
      {
        firstName: "Emma",
        lastName: "Williams",
        dateOfBirth: new Date("2010-03-15"),
        gender: "Female",
        ssn: "123-45-6789",
        phone: "(555) 111-2222",
        email: "emma.williams@email.com",
        address: "123 Main Street",
        city: "Springfield",
        state: "IL",
        zipCode: "62701",
        guardianName: "Lisa Williams",
        guardianPhone: "(555) 111-3333",
        guardianRelationship: "Mother",
        medicaidId: "MCD123456789",
        insuranceProvider: "Blue Cross Blue Shield",
        insurancePolicyNumber: "BCBS-987654",
        primaryDiagnosis: "F90.2 - ADHD, Combined Type",
        secondaryDiagnosis: "F41.1 - Generalized Anxiety Disorder",
        riskLevel: "medium",
        status: "active",
        admissionDate: new Date("2024-09-01"),
        placementType: "Outpatient",
      },
      {
        firstName: "Liam",
        lastName: "Johnson",
        dateOfBirth: new Date("2012-07-22"),
        gender: "Male",
        ssn: "234-56-7890",
        phone: "(555) 222-3333",
        address: "456 Oak Avenue",
        city: "Springfield",
        state: "IL",
        zipCode: "62702",
        guardianName: "James Johnson",
        guardianPhone: "(555) 222-4444",
        guardianRelationship: "Father",
        medicaidId: "MCD234567890",
        insuranceProvider: "Aetna",
        insurancePolicyNumber: "AET-876543",
        primaryDiagnosis: "F32.1 - Major Depressive Disorder, Moderate",
        secondaryDiagnosis: "F40.10 - Social Anxiety Disorder",
        riskLevel: "high",
        status: "active",
        admissionDate: new Date("2024-08-15"),
        placementType: "Intensive Outpatient",
      },
      {
        firstName: "Sophia",
        lastName: "Martinez",
        dateOfBirth: new Date("2011-11-08"),
        gender: "Female",
        ssn: "345-67-8901",
        phone: "(555) 333-4444",
        address: "789 Elm Street",
        city: "Springfield",
        state: "IL",
        zipCode: "62703",
        guardianName: "Maria Martinez",
        guardianPhone: "(555) 333-5555",
        guardianRelationship: "Mother",
        medicaidId: "MCD345678901",
        insuranceProvider: "United Healthcare",
        insurancePolicyNumber: "UHC-765432",
        primaryDiagnosis: "F43.10 - Post-Traumatic Stress Disorder",
        secondaryDiagnosis: "F32.0 - Major Depressive Disorder, Mild",
        riskLevel: "critical",
        status: "active",
        admissionDate: new Date("2024-07-01"),
        placementType: "Residential",
      },
      {
        firstName: "Noah",
        lastName: "Davis",
        dateOfBirth: new Date("2013-05-30"),
        gender: "Male",
        ssn: "456-78-9012",
        phone: "(555) 444-5555",
        address: "321 Pine Road",
        city: "Springfield",
        state: "IL",
        zipCode: "62704",
        guardianName: "David Davis",
        guardianPhone: "(555) 444-6666",
        guardianRelationship: "Father",
        medicaidId: "MCD456789012",
        insuranceProvider: "Cigna",
        insurancePolicyNumber: "CIG-654321",
        primaryDiagnosis: "F84.0 - Autism Spectrum Disorder",
        secondaryDiagnosis: "F90.0 - ADHD, Predominantly Inattentive",
        riskLevel: "low",
        status: "active",
        admissionDate: new Date("2024-10-01"),
        placementType: "Outpatient",
      },
      {
        firstName: "Olivia",
        lastName: "Brown",
        dateOfBirth: new Date("2009-12-12"),
        gender: "Female",
        ssn: "567-89-0123",
        phone: "(555) 555-6666",
        address: "654 Maple Drive",
        city: "Springfield",
        state: "IL",
        zipCode: "62705",
        guardianName: "Susan Brown",
        guardianPhone: "(555) 555-7777",
        guardianRelationship: "Mother",
        medicaidId: "MCD567890123",
        insuranceProvider: "Humana",
        insurancePolicyNumber: "HUM-543210",
        primaryDiagnosis: "F31.81 - Bipolar II Disorder",
        secondaryDiagnosis: "F41.9 - Anxiety Disorder, Unspecified",
        riskLevel: "high",
        status: "active",
        admissionDate: new Date("2024-06-15"),
        placementType: "Partial Hospitalization",
      },
      {
        firstName: "Ethan",
        lastName: "Wilson",
        dateOfBirth: new Date("2014-02-18"),
        gender: "Male",
        ssn: "678-90-1234",
        phone: "(555) 666-7777",
        address: "987 Cedar Lane",
        city: "Springfield",
        state: "IL",
        zipCode: "62706",
        guardianName: "Karen Wilson",
        guardianPhone: "(555) 666-8888",
        guardianRelationship: "Mother",
        medicaidId: "MCD678901234",
        insuranceProvider: "Blue Cross Blue Shield",
        insurancePolicyNumber: "BCBS-432109",
        primaryDiagnosis: "F91.1 - Conduct Disorder, Childhood-Onset",
        secondaryDiagnosis: "F90.1 - ADHD, Predominantly Hyperactive",
        riskLevel: "medium",
        status: "active",
        admissionDate: new Date("2024-09-20"),
        placementType: "Outpatient",
      },
    ]);

    console.log(`Created ${clientResults[0].affectedRows} clients`);

    // 3. Create referrals
    console.log("Creating referrals...");
    await db.insert(referrals).values([
      {
        clientId: 1,
        referralDate: new Date("2024-08-25"),
        referralSource: "Springfield Elementary School",
        referralContactName: "Principal Anderson",
        referralContactPhone: "(555) 111-0000",
        referralContactEmail: "anderson@springfield-elem.edu",
        urgencyLevel: "urgent",
        priorityScore: 8,
        assignedTo: "staff_case_manager_1",
        status: "completed",
        intakeScheduledDate: new Date("2024-09-01"),
        notes: "Student showing signs of attention difficulties and anxiety in classroom",
      },
      {
        clientId: 2,
        referralDate: new Date("2024-08-10"),
        referralSource: "Family Physician - Dr. Smith",
        referralContactName: "Dr. Robert Smith",
        referralContactPhone: "(555) 222-0000",
        referralContactEmail: "dr.smith@familymed.com",
        urgencyLevel: "emergency",
        priorityScore: 9,
        assignedTo: "staff_case_manager_1",
        status: "completed",
        intakeScheduledDate: new Date("2024-08-15"),
        notes: "Adolescent presenting with depressive symptoms and social withdrawal",
      },
      {
        referralDate: new Date("2024-10-15"),
        referralSource: "Department of Child and Family Services",
        referralContactName: "Case Worker Johnson",
        referralContactPhone: "(555) 333-0000",
        referralContactEmail: "johnson@dcfs.state.il.us",
        urgencyLevel: "urgent",
        priorityScore: 7,
        assignedTo: "staff_case_manager_1",
        status: "pending",
        responseDueDate: new Date("2024-10-22"),
        notes: "Child removed from home due to neglect, needs immediate assessment",
      },
      {
        referralDate: new Date("2024-10-18"),
        referralSource: "Community Mental Health Center",
        referralContactName: "Therapist Williams",
        referralContactPhone: "(555) 444-0000",
        referralContactEmail: "williams@cmhc.org",
        urgencyLevel: "routine",
        priorityScore: 5,
        status: "pending",
        notes: "Client needs specialized behavioral health services",
      },
    ]);

    // 4. Create crisis events
    console.log("Creating crisis events...");
    await db.insert(crisisEvents).values([
      {
        clientId: 2,
        eventDate: new Date("2024-10-10"),
        crisisType: "Suicidal Ideation",
        riskLevel: "critical",
        location: "Client Home",
        description: "Client expressed suicidal thoughts to parent. Immediate intervention required. Reported by parent.",
        interventionType: "Safety Plan Development",
        interventionDetails: "Developed safety plan with client and family. Increased therapy frequency to 2x weekly.",
        outcome: "Client stabilized, no hospitalization required",
        followUpRequired: true,
        followUpDueDate: new Date("2024-10-17"),
        hospitalization: false,
        status: "resolved",
        respondedBy: "staff_therapist_1",
      },
      {
        clientId: 3,
        eventDate: new Date("2024-10-12"),
        crisisType: "Aggressive Behavior",
        riskLevel: "high",
        location: "Residential Facility",
        description: "Client became physically aggressive with staff member during group session. Reported by residential staff.",
        interventionType: "De-escalation",
        interventionDetails: "Staff used de-escalation techniques. Client removed to quiet room. PRN medication administered.",
        outcome: "Client calmed after 45 minutes",
        followUpRequired: true,
        followUpDueDate: new Date("2024-10-19"),
        hospitalization: false,
        status: "active",
        reportedBy: "staff_therapist_2",
        respondedBy: "staff_therapist_2",
      },
      {
        clientId: 5,
        eventDate: new Date("2024-10-08"),
        crisisType: "Manic Episode",
        riskLevel: "high",
        location: "Partial Hospitalization Program",
        description: "Client exhibiting manic symptoms: pressured speech, grandiosity, decreased need for sleep. Reported by program staff.",
        interventionType: "Medication Adjustment",
        interventionDetails: "Psychiatrist consulted. Mood stabilizer dosage increased. Family educated on warning signs.",
        outcome: "Symptoms improving with medication adjustment",
        followUpRequired: true,
        followUpDueDate: new Date("2024-10-15"),
        hospitalization: false,
        status: "active",
        reportedBy: "staff_director_1",
        respondedBy: "staff_director_1",
      },
    ]);

    // 5. Create services
    console.log("Creating services...");
    await db.insert(services).values([
      {
        clientId: 1,
        providerId: "staff_therapist_1",
        serviceDate: new Date("2024-10-01"),
        serviceType: "Individual Therapy",
        units: 1,
        rate: 150,
        totalAmount: 150,
        billingStatus: "paid",
        documentationCompleted: true,
        notes: "Client made progress on anxiety management techniques",
        serviceLocation: "Office",
        status: "completed",
      },
      {
        clientId: 1,
        providerId: "staff_therapist_1",
        serviceDate: new Date("2024-10-08"),
        serviceType: "Individual Therapy",
        units: 1,
        rate: 150,
        totalAmount: 150,
        billingStatus: "submitted",
        documentationCompleted: true,
        notes: "Continued work on ADHD coping strategies",
        serviceLocation: "Office",
        status: "completed",
      },
      {
        clientId: 2,
        providerId: "staff_therapist_2",
        serviceDate: new Date("2024-10-05"),
        serviceType: "Individual Therapy",
        units: 1,
        rate: 150,
        totalAmount: 150,
        billingStatus: "paid",
        documentationCompleted: true,
        notes: "Addressed depressive symptoms and safety planning",
        serviceLocation: "Office",
        status: "completed",
      },
      {
        clientId: 2,
        providerId: "staff_therapist_2",
        serviceDate: new Date("2024-10-12"),
        serviceType: "Crisis Intervention",
        units: 2,
        rate: 200,
        totalAmount: 400,
        billingStatus: "ready",
        documentationCompleted: true,
        notes: "Emergency session following suicidal ideation",
        serviceLocation: "Client Home",
        status: "completed",
      },
      {
        clientId: 3,
        providerId: "staff_therapist_1",
        serviceDate: new Date("2024-10-03"),
        serviceType: "Trauma-Focused Therapy",
        units: 1,
        rate: 175,
        totalAmount: 175,
        billingStatus: "paid",
        documentationCompleted: true,
        notes: "EMDR session for PTSD treatment",
        serviceLocation: "Office",
        status: "completed",
      },
      {
        clientId: 4,
        providerId: "staff_therapist_2",
        serviceDate: new Date("2024-10-07"),
        serviceType: "Behavioral Therapy",
        units: 1,
        rate: 150,
        totalAmount: 150,
        billingStatus: "pending",
        documentationCompleted: false,
        notes: "Applied behavior analysis session",
        serviceLocation: "Office",
        status: "completed",
      },
      {
        clientId: 5,
        providerId: "staff_director_1",
        serviceDate: new Date("2024-10-09"),
        serviceType: "Psychiatric Consultation",
        units: 1,
        rate: 250,
        totalAmount: 250,
        billingStatus: "ready",
        documentationCompleted: true,
        notes: "Medication management for bipolar disorder",
        serviceLocation: "PHP Facility",
        status: "completed",
      },
      {
        clientId: 1,
        providerId: "staff_therapist_1",
        serviceDate: new Date("2024-10-22"),
        serviceType: "Individual Therapy",
        units: 1,
        rate: 150,
        totalAmount: 150,
        billingStatus: "pending",
        documentationCompleted: false,
        serviceLocation: "Office",
        status: "scheduled",
      },
    ]);

    // 6. Create billing claims
    console.log("Creating billing claims...");
    await db.insert(billingClaims).values([
      {
        clientId: 1,
        claimNumber: "CLM-2024-001",
        serviceDate: new Date("2024-10-01"),
        amount: 150,
        amountPaid: 150,
        payerName: "Blue Cross Blue Shield",
        status: "paid",
        submissionDate: new Date("2024-10-02"),
        paymentDate: new Date("2024-10-15"),
      },
      {
        clientId: 2,
        claimNumber: "CLM-2024-002",
        serviceDate: new Date("2024-10-05"),
        amount: 150,
        amountPaid: 150,
        payerName: "Aetna",
        status: "paid",
        submissionDate: new Date("2024-10-06"),
        paymentDate: new Date("2024-10-18"),
      },
      {
        clientId: 1,
        claimNumber: "CLM-2024-003",
        serviceDate: new Date("2024-10-08"),
        amount: 150,
        payerName: "Blue Cross Blue Shield",
        status: "submitted",
        submissionDate: new Date("2024-10-09"),
      },
      {
        clientId: 2,
        claimNumber: "CLM-2024-004",
        serviceDate: new Date("2024-10-12"),
        amount: 400,
        payerName: "Aetna",
        status: "pending",
      },
      {
        clientId: 3,
        claimNumber: "CLM-2024-005",
        serviceDate: new Date("2024-10-03"),
        amount: 175,
        payerName: "United Healthcare",
        status: "denied",
        submissionDate: new Date("2024-10-04"),
        denialDate: new Date("2024-10-12"),
        denialReason: "Prior authorization required",
      },
      {
        clientId: 5,
        claimNumber: "CLM-2024-006",
        serviceDate: new Date("2024-10-09"),
        amount: 250,
        payerName: "Humana",
        status: "pending",
      },
    ]);

    // 7. Create EIA workflows
    console.log("Creating EIA workflows...");
    await db.insert(eiaWorkflows).values([
      {
        clientId: 1,
        workflowStep: "referral_receipt",
        status: "completed",
        startedAt: new Date("2024-09-01"),
        completedAt: new Date("2024-09-01"),
        startedBy: "staff_case_manager_1",
        completedBy: "staff_case_manager_1",
        notes: "Initial referral processed from school",
      },
      {
        clientId: 1,
        workflowStep: "service_engagement",
        status: "completed",
        startedAt: new Date("2024-09-02"),
        completedAt: new Date("2024-09-05"),
        startedBy: "staff_therapist_1",
        completedBy: "staff_therapist_1",
        notes: "Initial assessment completed, treatment plan developed",
      },
      {
        clientId: 2,
        workflowStep: "clinical_review",
        status: "in_progress",
        startedAt: new Date("2024-10-10"),
        startedBy: "staff_director_1",
        notes: "Reviewing crisis intervention and safety plan",
      },
      {
        clientId: 3,
        workflowStep: "cans_assessment",
        status: "completed",
        startedAt: new Date("2024-07-05"),
        completedAt: new Date("2024-07-08"),
        startedBy: "staff_therapist_1",
        completedBy: "staff_therapist_1",
        notes: "CANS assessment completed, high needs identified",
      },
    ]);

    // 8. Create documents
    console.log("Creating documents...");
    await db.insert(documents).values([
      {
        clientId: 1,
        workflowId: 1,
        referralId: 1,
        documentType: "Referral Intake Report",
        title: "Initial Referral Report - Emma Williams",
        content: "Client: Emma Williams\nReferral Source: Springfield Elementary School\nReason: Attention difficulties and anxiety\nRecommendation: Outpatient therapy services",
        generatedBy: "staff_case_manager_1",
        generatedAt: new Date("2024-09-01"),
        status: "final",
      },
      {
        clientId: 1,
        workflowId: 2,
        documentType: "Treatment Plan",
        title: "Individual Treatment Plan - Emma Williams",
        content: "Goals:\n1. Reduce anxiety symptoms by 50%\n2. Improve attention and focus in school\n3. Develop coping strategies for ADHD\nInterventions: Weekly individual therapy, parent training",
        generatedBy: "staff_therapist_1",
        generatedAt: new Date("2024-09-05"),
        status: "final",
      },
      {
        clientId: 2,
        crisisEventId: 1,
        documentType: "Crisis Report",
        title: "Crisis Intervention Report - Liam Johnson",
        content: "Crisis Type: Suicidal Ideation\nRisk Level: Critical\nIntervention: Safety planning, increased therapy frequency\nOutcome: Client stabilized, no hospitalization required",
        generatedBy: "staff_therapist_1",
        generatedAt: new Date("2024-10-10"),
        status: "final",
      },
      {
        clientId: 1,
        serviceId: 1,
        documentType: "Progress Note",
        title: "Progress Note - Emma Williams - 10/01/2024",
        content: "Session focused on anxiety management techniques. Client practiced deep breathing and progressive muscle relaxation. Homework assigned to practice techniques daily.",
        generatedBy: "staff_therapist_1",
        generatedAt: new Date("2024-10-01"),
        status: "final",
      },
      {
        clientId: 3,
        workflowId: 4,
        documentType: "CANS Assessment",
        title: "CANS Assessment Report - Sophia Martinez",
        content: "Child and Adolescent Needs and Strengths Assessment\nLife Domain Functioning: Moderate needs\nChild Strengths: Strong family support\nCaregiving: High needs due to trauma history\nRecommendation: Residential treatment with trauma-focused therapy",
        generatedBy: "staff_therapist_1",
        generatedAt: new Date("2024-07-08"),
        status: "final",
      },
    ]);

    // 9. Create document templates
    console.log("Creating document templates...");
    await db.insert(documentTemplates).values([
      {
        templateName: "Referral Intake Report Template",
        documentType: "Referral Intake Report",
        workflowStep: "referral_receipt",
        templateContent: "# Referral Intake Report\n\n**Client Name:** {{clientName}}\n**Referral Date:** {{referralDate}}\n**Referral Source:** {{referralSource}}\n\n## Presenting Problem\n{{presentingProblem}}\n\n## Recommendations\n{{recommendations}}",
        promptTemplate: "Generate a professional referral intake report for a behavioral health client based on the following information: {{clientInfo}}. Include presenting problem, background, and service recommendations.",
        isActive: true,
      },
      {
        templateName: "Treatment Plan Template",
        documentType: "Treatment Plan",
        workflowStep: "service_engagement",
        templateContent: "# Individual Treatment Plan\n\n**Client:** {{clientName}}\n**Date:** {{date}}\n\n## Goals\n{{goals}}\n\n## Interventions\n{{interventions}}\n\n## Progress Measures\n{{progressMeasures}}",
        promptTemplate: "Create a comprehensive treatment plan for a behavioral health client with the following diagnosis and needs: {{clientInfo}}. Include SMART goals, evidence-based interventions, and measurable outcomes.",
        isActive: true,
      },
      {
        templateName: "Crisis Report Template",
        documentType: "Crisis Report",
        workflowStep: "risk_management",
        templateContent: "# Crisis Intervention Report\n\n**Client:** {{clientName}}\n**Date:** {{crisisDate}}\n**Crisis Type:** {{crisisType}}\n\n## Description\n{{description}}\n\n## Intervention\n{{intervention}}\n\n## Outcome\n{{outcome}}",
        promptTemplate: "Document a crisis event for a behavioral health client including: {{crisisInfo}}. Provide detailed intervention steps and outcome assessment.",
        isActive: true,
      },
    ]);

    console.log("✅ Database seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

// Run the seed function
seed()
  .then(() => {
    console.log("Seeding finished");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exit(1);
  });

