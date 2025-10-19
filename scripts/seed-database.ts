import { drizzle } from "drizzle-orm/mysql2";
import { clients, referrals, crisisEvents, services, billingClaims } from "../drizzle/schema";

const db = drizzle(process.env.DATABASE_URL!);

async function seed() {
  console.log("🌱 Seeding database with sample data...");

  try {
    // 1. Create clients first (no foreign key dependencies)
    console.log("Creating clients...");
    const clientIds = await db.insert(clients).values([
      {
        firstName: "Emma",
        lastName: "Johnson",
        dateOfBirth: new Date("2010-05-15"),
        gender: "female",
        primaryPhone: "(555) 101-2001",
        email: "emma.johnson@email.com",
        address: "123 Maple Street",
        city: "Springfield",
        state: "IL",
        zipCode: "62701",
        insuranceProvider: "Blue Cross Blue Shield",
        insurancePolicyNumber: "BCBS-123456",
        emergencyContactName: "Sarah Johnson",
        emergencyContactPhone: "(555) 101-2002",
        emergencyContactRelationship: "Mother",
        admissionDate: new Date("2024-01-15"),
        currentRiskLevel: "low",
        isActive: true,
      },
      {
        firstName: "Michael",
        lastName: "Chen",
        dateOfBirth: new Date("2012-08-22"),
        gender: "male",
        primaryPhone: "(555) 202-3001",
        email: "michael.chen@email.com",
        address: "456 Oak Avenue",
        city: "Springfield",
        state: "IL",
        zipCode: "62702",
        insuranceProvider: "Aetna",
        insurancePolicyNumber: "AETNA-789012",
        emergencyContactName: "Lisa Chen",
        emergencyContactPhone: "(555) 202-3002",
        emergencyContactRelationship: "Mother",
        admissionDate: new Date("2024-02-01"),
        currentRiskLevel: "medium",
        isActive: true,
      },
      {
        firstName: "Sophia",
        lastName: "Rodriguez",
        dateOfBirth: new Date("2011-03-10"),
        gender: "female",
        primaryPhone: "(555) 303-4001",
        email: "sophia.rodriguez@email.com",
        address: "789 Pine Road",
        city: "Springfield",
        state: "IL",
        zipCode: "62703",
        insuranceProvider: "UnitedHealthcare",
        insurancePolicyNumber: "UHC-345678",
        emergencyContactName: "Maria Rodriguez",
        emergencyContactPhone: "(555) 303-4002",
        emergencyContactRelationship: "Mother",
        admissionDate: new Date("2024-03-15"),
        currentRiskLevel: "high",
        isActive: true,
      },
      {
        firstName: "James",
        lastName: "Williams",
        dateOfBirth: new Date("2013-11-05"),
        gender: "male",
        primaryPhone: "(555) 404-5001",
        address: "321 Elm Street",
        city: "Springfield",
        state: "IL",
        zipCode: "62704",
        insuranceProvider: "Cigna",
        insurancePolicyNumber: "CIGNA-901234",
        emergencyContactName: "Robert Williams",
        emergencyContactPhone: "(555) 404-5002",
        emergencyContactRelationship: "Father",
        admissionDate: new Date("2024-04-01"),
        currentRiskLevel: "low",
        isActive: true,
      },
      {
        firstName: "Olivia",
        lastName: "Martinez",
        dateOfBirth: new Date("2009-07-18"),
        gender: "female",
        primaryPhone: "(555) 505-6001",
        email: "olivia.martinez@email.com",
        address: "654 Birch Lane",
        city: "Springfield",
        state: "IL",
        zipCode: "62705",
        insuranceProvider: "Humana",
        insurancePolicyNumber: "HUM-567890",
        emergencyContactName: "Carlos Martinez",
        emergencyContactPhone: "(555) 505-6002",
        emergencyContactRelationship: "Father",
        admissionDate: new Date("2024-05-10"),
        currentRiskLevel: "medium",
        isActive: true,
      },
    ]);

    const firstClientId = Number(clientIds[0].insertId);
    console.log(`✓ Created 5 clients starting with ID ${firstClientId}`);

    // 2. Create referrals (depends on clients)
    console.log("Creating referrals...");
    await db.insert(referrals).values([
      {
        clientId: firstClientId,
        referralDate: new Date("2024-01-10"),
        referralSource: "Springfield Elementary School",
        referralContactName: "Principal Anderson",
        referralContactPhone: "(555) 111-0000",
        referralContactEmail: "anderson@springfield-elem.edu",
        urgencyLevel: "urgent",
        priorityScore: 8,
        status: "completed",
        intakeScheduledDate: new Date("2024-01-15"),
        notes: "Student showing signs of attention difficulties and anxiety in classroom",
      },
      {
        clientId: firstClientId + 1,
        referralDate: new Date("2024-01-25"),
        referralSource: "Family Physician - Dr. Smith",
        referralContactName: "Dr. Robert Smith",
        referralContactPhone: "(555) 222-0000",
        referralContactEmail: "dr.smith@familymed.com",
        urgencyLevel: "emergency",
        priorityScore: 9,
        status: "completed",
        intakeScheduledDate: new Date("2024-02-01"),
        notes: "Adolescent presenting with depressive symptoms and social withdrawal",
      },
      {
        clientId: firstClientId + 2,
        referralDate: new Date("2024-03-10"),
        referralSource: "Department of Child and Family Services",
        referralContactName: "Case Worker Johnson",
        referralContactPhone: "(555) 333-0000",
        urgencyLevel: "urgent",
        priorityScore: 7,
        status: "completed",
        intakeScheduledDate: new Date("2024-03-15"),
        notes: "Child needs behavioral health assessment and ongoing support",
      },
      {
        clientId: firstClientId + 3,
        referralDate: new Date("2024-10-15"),
        referralSource: "Community Mental Health Center",
        referralContactName: "Therapist Williams",
        referralContactPhone: "(555) 444-0000",
        urgencyLevel: "routine",
        priorityScore: 5,
        status: "pending",
        notes: "Client needs specialized behavioral health services",
      },
    ]);
    console.log("✓ Created 4 referrals");

    // 3. Create crisis events
    console.log("Creating crisis events...");
    await db.insert(crisisEvents).values([
      {
        clientId: firstClientId + 1,
        eventDate: new Date("2024-08-15"),
        crisisType: "Self-harm incident",
        description: "Client expressed suicidal ideation during therapy session",
        location: "Adolbi Care Facility - Therapy Room 3",
        riskLevel: "high",
        interventionDetails: "Immediate safety assessment conducted. Parent contacted. Safety plan created.",
        outcome: "Client stabilized. Agreed to safety contract. Increased monitoring implemented.",
        status: "active",
        followUpRequired: true,
      },
      {
        clientId: firstClientId + 2,
        eventDate: new Date("2024-09-20"),
        crisisType: "Aggressive behavior",
        description: "Physical altercation with peer during group therapy",
        location: "Adolbi Care Facility - Group Room",
        riskLevel: "medium",
        interventionDetails: "De-escalation techniques applied. Individual counseling provided.",
        outcome: "Client calmed down. Apologized to peer. Discussed anger management strategies.",
        status: "resolved",
        followUpRequired: false,
      },
      {
        clientId: firstClientId,
        eventDate: new Date("2024-10-05"),
        crisisType: "Anxiety attack",
        description: "Severe panic attack during school transition planning meeting",
        location: "Adolbi Care Facility - Conference Room",
        riskLevel: "low",
        interventionDetails: "Breathing exercises. Removed from stressful environment. Parent support.",
        outcome: "Client recovered. Discussed coping strategies for future anxiety triggers.",
        status: "resolved",
        followUpRequired: true,
      },
    ]);
    console.log("✓ Created 3 crisis events");

    // 4. Create services
    console.log("Creating services...");
    await db.insert(services).values([
      {
        clientId: firstClientId,
        serviceDate: new Date("2024-10-01"),
        serviceType: "Individual Therapy",
        duration: 60,
        serviceLocation: "Adolbi Care Facility",
        totalAmount: 150.0,
        status: "completed",
        billingStatus: "paid",
        documentationCompleted: true,
        notes: "Discussed school anxiety and coping strategies. Client engaged well.",
      },
      {
        clientId: firstClientId + 1,
        serviceDate: new Date("2024-10-03"),
        serviceType: "Family Therapy",
        duration: 90,
        serviceLocation: "Adolbi Care Facility",
        totalAmount: 200.0,
        status: "completed",
        billingStatus: "submitted",
        documentationCompleted: true,
        notes: "Family communication patterns addressed. Homework assigned.",
      },
      {
        clientId: firstClientId + 2,
        serviceDate: new Date("2024-10-05"),
        serviceType: "Group Therapy",
        duration: 75,
        serviceLocation: "Adolbi Care Facility",
        totalAmount: 100.0,
        status: "completed",
        billingStatus: "ready",
        documentationCompleted: true,
        notes: "Social skills group. Client participated actively.",
      },
      {
        clientId: firstClientId + 3,
        serviceDate: new Date("2024-10-08"),
        serviceType: "Psychiatric Evaluation",
        duration: 120,
        serviceLocation: "Adolbi Care Facility",
        totalAmount: 350.0,
        status: "completed",
        billingStatus: "pending",
        documentationCompleted: false,
        notes: "Comprehensive psychiatric assessment completed. Medication recommendations provided.",
      },
      {
        clientId: firstClientId + 4,
        serviceDate: new Date("2024-10-10"),
        serviceType: "Crisis Intervention",
        duration: 45,
        serviceLocation: "Adolbi Care Facility",
        totalAmount: 175.0,
        status: "completed",
        billingStatus: "ready",
        documentationCompleted: true,
        notes: "Emergency session for anxiety management. Safety plan reviewed.",
      },
      {
        clientId: firstClientId,
        serviceDate: new Date("2024-10-22"),
        serviceType: "Individual Therapy",
        duration: 60,
        serviceLocation: "Adolbi Care Facility",
        totalAmount: 150.0,
        status: "scheduled",
        billingStatus: "pending",
        documentationCompleted: false,
        notes: "Follow-up session scheduled.",
      },
    ]);
    console.log("✓ Created 6 services");

    // 5. Create billing claims
    console.log("Creating billing claims...");
    await db.insert(billingClaims).values([
      {
        clientId: firstClientId,
        claimNumber: "CLM-2024-001",
        serviceDate: new Date("2024-10-01"),
        amount: 150.0,
        amountPaid: 150.0,
        payerName: "Blue Cross Blue Shield",
        status: "paid",
        submissionDate: new Date("2024-10-02"),
        paymentDate: new Date("2024-10-15"),
      },
      {
        clientId: firstClientId + 1,
        claimNumber: "CLM-2024-002",
        serviceDate: new Date("2024-10-03"),
        amount: 200.0,
        payerName: "Aetna",
        status: "submitted",
        submissionDate: new Date("2024-10-04"),
      },
      {
        clientId: firstClientId + 2,
        claimNumber: "CLM-2024-003",
        serviceDate: new Date("2024-10-05"),
        amount: 100.0,
        payerName: "UnitedHealthcare",
        status: "pending",
      },
      {
        clientId: firstClientId + 3,
        claimNumber: "CLM-2024-004",
        serviceDate: new Date("2024-10-08"),
        amount: 350.0,
        amountPaid: 0.0,
        payerName: "Cigna",
        status: "denied",
        submissionDate: new Date("2024-10-09"),
        denialReason: "Prior authorization required",
      },
      {
        clientId: firstClientId + 4,
        claimNumber: "CLM-2024-005",
        serviceDate: new Date("2024-10-10"),
        amount: 175.0,
        payerName: "Humana",
        status: "pending",
      },
    ]);
    console.log("✓ Created 5 billing claims");

    console.log("\n✅ Database seeding completed successfully!");
    console.log("📊 Summary:");
    console.log("   - 5 clients");
    console.log("   - 4 referrals");
    console.log("   - 3 crisis events");
    console.log("   - 6 services");
    console.log("   - 5 billing claims");
    
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    throw error;
  }
}

seed()
  .then(() => {
    console.log("\n🎉 All done!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });

