import { drizzle } from "drizzle-orm/mysql2";
import { clients, referrals, crisisEvents, services, billingClaims } from "../drizzle/schema";

const db = drizzle(process.env.DATABASE_URL!);

async function seedMHRSData() {
  console.log("🌱 Seeding MHRS/MHTCM sample data...");

  try {
    // Clear existing data
    console.log("Clearing existing data...");
    await db.delete(billingClaims);
    await db.delete(services);
    await db.delete(crisisEvents);
    await db.delete(referrals);
    await db.delete(clients);

    // Create MHRS/MHTCM clients
    console.log("Creating MHRS/MHTCM clients...");
    const clientResults = await db.insert(clients).values([
      {
        firstName: "Grayson",
        lastName: "Goss",
        dateOfBirth: new Date("2011-01-11"),
        gender: "male",
        medicaidId: "625002112",
        primaryDiagnosis: "F84.0 - Autism Spectrum Disorder, Level 1",
        secondaryDiagnosis: "F90.2 - ADHD, Combined; F25.0 - Schizoaffective Disorder",
        riskLevel: "high",
        status: "active",
        admissionDate: new Date("2024-08-01"),
        guardianName: "DFPS - Angela Stites",
        guardianPhone: "(512) 555-0198",
        guardianRelationship: "Case Worker",
        address: "Angeles De La Tierra LLC - Residential Placement",
        city: "Austin",
        state: "TX",
        zipCode: "78701",
        insuranceProvider: "Texas Medicaid",
        insurancePolicyNumber: "625002112",
      },
      {
        firstName: "Marcus",
        lastName: "Johnson",
        dateOfBirth: new Date("2008-05-15"),
        gender: "male",
        medicaidId: "625003445",
        primaryDiagnosis: "F91.1 - Conduct Disorder, Childhood-Onset",
        secondaryDiagnosis: "F43.10 - PTSD; F90.1 - ADHD, Predominantly Hyperactive",
        riskLevel: "high",
        status: "active",
        admissionDate: new Date("2024-07-15"),
        guardianName: "Sharon Johnson",
        guardianPhone: "(512) 555-0234",
        guardianRelationship: "Mother",
        address: "1234 Oak Street",
        city: "Austin",
        state: "TX",
        zipCode: "78702",
        insuranceProvider: "Texas Medicaid",
        insurancePolicyNumber: "625003445",
      },
      {
        firstName: "Destiny",
        lastName: "Martinez",
        dateOfBirth: new Date("2010-09-22"),
        gender: "female",
        medicaidId: "625004789",
        primaryDiagnosis: "F32.2 - Major Depressive Disorder, Severe",
        secondaryDiagnosis: "F40.10 - Social Anxiety Disorder; F50.00 - Anorexia Nervosa",
        riskLevel: "medium",
        status: "active",
        admissionDate: new Date("2024-09-01"),
        guardianName: "Rosa Martinez",
        guardianPhone: "(512) 555-0567",
        guardianRelationship: "Mother",
        address: "5678 Elm Avenue",
        city: "Austin",
        state: "TX",
        zipCode: "78703",
        insuranceProvider: "Texas Medicaid",
        insurancePolicyNumber: "625004789",
      },
      {
        firstName: "Jamal",
        lastName: "Washington",
        dateOfBirth: new Date("2009-03-08"),
        gender: "male",
        medicaidId: "625005123",
        primaryDiagnosis: "F31.81 - Bipolar II Disorder",
        secondaryDiagnosis: "F91.3 - Oppositional Defiant Disorder",
        riskLevel: "medium",
        status: "active",
        admissionDate: new Date("2024-08-15"),
        guardianName: "Patricia Washington",
        guardianPhone: "(512) 555-0789",
        guardianRelationship: "Grandmother",
        address: "9012 Pine Road",
        city: "Austin",
        state: "TX",
        zipCode: "78704",
        insuranceProvider: "Texas Medicaid",
        insurancePolicyNumber: "625005123",
      },
      {
        firstName: "Sophia",
        lastName: "Chen",
        dateOfBirth: new Date("2011-11-30"),
        gender: "female",
        medicaidId: "625006456",
        primaryDiagnosis: "F84.5 - Asperger's Syndrome",
        secondaryDiagnosis: "F41.1 - Generalized Anxiety Disorder",
        riskLevel: "low",
        status: "active",
        admissionDate: new Date("2024-09-15"),
        guardianName: "Linda Chen",
        guardianPhone: "(512) 555-0901",
        guardianRelationship: "Mother",
        address: "3456 Maple Drive",
        city: "Austin",
        state: "TX",
        zipCode: "78705",
        insuranceProvider: "Texas Medicaid",
        insurancePolicyNumber: "625006456",
      },
    ]);

    const firstClientId = clientResults[0].insertId;
    console.log(`✓ Created 5 MHRS/MHTCM clients starting with ID ${firstClientId}`);

    // Create referrals
    console.log("Creating referrals...");
    await db.insert(referrals).values([
      {
        clientId: firstClientId + 3,
        referralDate: new Date("2024-08-01"),
        referralSource: "DFPS (Department of Family and Protective Services)",
        referralReason: "Youth in foster care requiring intensive behavioral health services due to aggression and trauma history",
        referralContactName: "Angela Stites",
        referralContactPhone: "(512) 555-0198",
        referralContactEmail: "angela.stites@dfps.texas.gov",
        urgencyLevel: "emergency",
        priorityScore: 95,
        status: "completed",
        intakeScheduledDate: new Date("2024-08-05"),
        notes: "Requires MHTCM coordination with residential placement",
      },
      {
        clientId: firstClientId + 1,
        referralDate: new Date("2024-07-10"),
        referralReason: "Conduct disorder with aggressive behaviors at school and home, PTSD from community violence exposure",
        referralSource: "Austin ISD School Counselor",
        referralContactName: "Jennifer Lopez",
        referralContactPhone: "(512) 555-0345",
        referralContactEmail: "jlopez@austinisd.org",
        urgencyLevel: "urgent",
        priorityScore: 85,
        status: "completed",
        intakeScheduledDate: new Date("2024-07-15"),
        notes: "Needs H2017 MHRS services and skills training",
      },
      {
        referralDate: new Date("2024-10-15"),
        referralSource: "Community Mental Health Center",
        referralReason: "12-year-old with severe depression and self-harm behaviors, recent hospitalization",
        referralContactName: "Dr. Michael Torres",
        referralContactPhone: "(512) 555-0678",
        referralContactEmail: "mtorres@cmhc.org",
        urgencyLevel: "urgent",
        priorityScore: 90,
        status: "pending",
        notes: "Requires crisis intervention services (H2011) and intensive MHRS",
      },
    ]);
    console.log("✓ Created 3 referrals");

    // Create crisis events
    console.log("Creating crisis events...");
    await db.insert(crisisEvents).values([
      {
        clientId: firstClientId,
        eventDate: new Date("2024-08-15"),
        crisisType: "Suicidal ideation with plan",
        riskLevel: "critical",
        location: "Angeles De La Tierra LLC - Residential Facility",
        description: "Client expressed suicidal ideation during therapy session with specific plan. Immediate safety assessment conducted.",
        interventionDetails: "H2011 Crisis Intervention Services activated. 24/7 line-of-sight supervision implemented. Safety plan created. Parent/guardian contacted. Psychiatric consultation completed.",
        outcome: "Client stabilized. Agreed to safety contract. Increased monitoring implemented with 2:1 staffing ratio.",
        status: "active",
        followUpRequired: true,
        followUpDueDate: new Date("2024-10-25"),
        hospitalization: false,
      },
      {
        clientId: firstClientId + 1,
        eventDate: new Date("2024-09-20"),
        crisisType: "Physical aggression toward staff",
        riskLevel: "high",
        location: "Adolbi Care Facility - Group Room",
        description: "Physical altercation with peer during H2017 group therapy session. Client became aggressive when peer made comment about family.",
        interventionDetails: "De-escalation techniques applied per ART protocol. Individual counseling provided. MHTCM coordinator notified.",
        outcome: "Client calmed down after 20 minutes. Apologized to peer. Discussed anger management strategies. No injuries.",
        status: "resolved",
        followUpRequired: false,
      },
      {
        clientId: firstClientId + 2,
        eventDate: new Date("2024-10-05"),
        crisisType: "Severe anxiety attack",
        riskLevel: "medium",
        location: "Adolbi Care Facility - Skills Training Room",
        description: "Severe panic attack during H2014 skills training session when discussing school transition planning.",
        interventionDetails: "Breathing exercises implemented. Removed from stressful environment. Guardian support contacted. PAYA curriculum coping strategies applied.",
        outcome: "Client recovered within 15 minutes. Discussed coping strategies for future anxiety triggers. Scheduled additional H2014 sessions.",
        status: "resolved",
        followUpRequired: true,
        followUpDueDate: new Date("2024-10-20"),
      },
    ]);
    console.log("✓ Created 3 crisis events");

    // Create MHRS/MHTCM services
    console.log("Creating MHRS/MHTCM services...");
    await db.insert(services).values([
      {
        clientId: firstClientId,
        serviceDate: new Date("2024-10-01"),
        serviceType: "H2017 - Psychosocial Rehabilitative Services (MHRS)",
        duration: 60,
        provider: "Marques William-Bey, MSW, QMHP-CS",
        location: "Residential Setting",
        notes: "Aggression Replacement Training (ART) session. Client practiced anger management techniques and role-played appropriate responses to peer conflicts.",
        billingStatus: "paid",
        billingAmount: 75.00,
      },
      {
        clientId: firstClientId,
        serviceDate: new Date("2024-10-02"),
        serviceType: "H2014 - Skills Training and Development",
        duration: 45,
        provider: "Necole Lott, LVN, CSSP",
        location: "Residential Setting",
        notes: "PAYA curriculum implementation. Worked on emotional regulation skills using sensory tools and visual emotion charts.",
        billingStatus: "paid",
        billingAmount: 56.25,
      },
      {
        clientId: firstClientId,
        serviceDate: new Date("2024-10-03"),
        serviceType: "MHTCM - Mental Health Targeted Case Management",
        duration: 120,
        provider: "Marques William-Bey, MSW, QMHP-CS",
        location: "Multiple Settings",
        notes: "Comprehensive case management coordination. Met with DFPS case worker, residential staff, and educational team. Coordinated service array and crisis protocols.",
        billingStatus: "paid",
        billingAmount: 150.00,
      },
      {
        clientId: firstClientId + 1,
        serviceDate: new Date("2024-10-01"),
        serviceType: "H2017 - Psychosocial Rehabilitative Services (MHRS)",
        duration: 60,
        provider: "Contracted LMSW, QMHP-CS",
        location: "Community Setting",
        notes: "Social skills training in group format. Client participated in role-playing exercises for appropriate peer interactions.",
        billingStatus: "paid",
        billingAmount: 75.00,
      },
      {
        clientId: firstClientId + 2,
        serviceDate: new Date("2024-10-04"),
        serviceType: "H2011 - Crisis Intervention Services",
        duration: 90,
        provider: "Contracted LMSW, QMHP-CS",
        location: "Residential Setting",
        notes: "Crisis intervention for anxiety attack. Implemented safety plan strategies and coping skills. Client stabilized successfully.",
        billingStatus: "pending",
        billingAmount: 112.50,
      },
      {
        clientId: firstClientId,
        serviceDate: new Date("2024-10-05"),
        serviceType: "H0034 - Medication Training and Support",
        duration: 30,
        provider: "Lamonica Fox, PNP",
        location: "Community Clinic",
        notes: "Medication education session. Reviewed current psychiatric medications, side effects, and compliance strategies. Client demonstrated understanding.",
        billingStatus: "paid",
        billingAmount: 45.00,
      },
      {
        clientId: firstClientId + 3,
        serviceDate: new Date("2024-10-06"),
        serviceType: "H2017 - Psychosocial Rehabilitative Services (MHRS)",
        duration: 60,
        provider: "Contracted LMSW, QMHP-CS",
        location: "School Setting",
        notes: "Behavioral support in educational setting. Coordinated with IEP team. Client remained in classroom for 45 minutes without aggressive behaviors.",
        billingStatus: "pending",
        billingAmount: 75.00,
      },
      {
        clientId: firstClientId + 4,
        serviceDate: new Date("2024-10-07"),
        serviceType: "H2014 - Skills Training and Development",
        duration: 45,
        provider: "Necole Lott, LVN, CSSP",
        location: "Residential Setting",
        notes: "Life skills training focusing on independent living skills. Client practiced morning hygiene routine with minimal prompting.",
        billingStatus: "pending",
        billingAmount: 56.25,
      },
    ]);
    console.log("✓ Created 8 MHRS/MHTCM services");

    // Create billing claims
    console.log("Creating billing claims...");
    await db.insert(billingClaims).values([
      {
        clientId: firstClientId,
        claimNumber: "TX-MHRS-2024-001",
        serviceDate: new Date("2024-09-01"),
        amount: 120000,
        amountPaid: 120000,
        payerName: "Texas Medicaid",
        status: "paid",
        paymentDate: new Date("2024-10-01"),
        submissionDate: new Date("2024-09-15"),
      },
      {
        clientId: firstClientId,
        claimNumber: "TX-MHTCM-2024-002",
        serviceDate: new Date("2024-09-01"),
        amount: 120000,
        amountPaid: 120000,
        payerName: "Texas Medicaid",
        status: "paid",
        paymentDate: new Date("2024-10-01"),
        submissionDate: new Date("2024-09-15"),
      },
      {
        clientId: firstClientId + 1,
        claimNumber: "TX-MHRS-2024-003",
        serviceDate: new Date("2024-09-01"),
        amount: 90000,
        payerName: "Texas Medicaid",
        status: "submitted",
        submissionDate: new Date("2024-09-15"),
      },
      {
        clientId: firstClientId + 2,
        claimNumber: "TX-H2014-2024-004",
        serviceDate: new Date("2024-09-01"),
        amount: 135000,
        payerName: "Texas Medicaid",
        status: "pending",
      },
      {
        clientId: firstClientId,
        claimNumber: "TX-H2011-2024-005",
        serviceDate: new Date("2024-08-15"),
        amount: 67500,
        payerName: "Texas Medicaid",
        status: "denied",
        denialReason: "Insufficient documentation of medical necessity",
        denialDate: new Date("2024-09-10"),
        submissionDate: new Date("2024-08-30"),
      },
    ]);
    console.log("✓ Created 5 billing claims");

    console.log("✅ MHRS/MHTCM database seeding completed successfully!");
    console.log("📊 Summary:");
    console.log("   - 5 clients with MHRS/MHTCM diagnoses");
    console.log("   - 3 referrals from DFPS, schools, and community");
    console.log("   - 3 crisis events with H2011 interventions");
    console.log("   - 8 MHRS/MHTCM services (H2017, H2014, MHTCM, H2011, H0034)");
    console.log("   - 5 billing claims with various statuses");
    console.log("🎉 All done!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

seedMHRSData();

