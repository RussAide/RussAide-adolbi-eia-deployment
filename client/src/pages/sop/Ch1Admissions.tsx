import { useState, useEffect } from "react";
import { useEIAContext } from "@/contexts/EIAContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Check, Circle } from "lucide-react";
import { Link } from "wouter";

export default function Ch1Admissions() {
  const { setContext } = useEIAContext();
  const [currentStep, setCurrentStep] = useState(3); // Start at step 3 (Client Information)
  
  const steps = [
    { id: 1, name: "Referral Received", completed: true },
    { id: 2, name: "Initial Screening", completed: true },
    { id: 3, name: "Client Information", completed: false },
    { id: 4, name: "Assessment", completed: false },
    { id: 5, name: "Authorization", completed: false },
    { id: 6, name: "Service Planning", completed: false },
    { id: 7, name: "Enrollment", completed: false },
  ];

  // Set EIA context with workflow information
  useEffect(() => {
    const completedSteps = steps.filter(s => s.completed).length;
    const currentStepData = steps.find(s => s.id === currentStep);
    const completionPercentage = Math.round((completedSteps / steps.length) * 100);
    const requiredFieldsRemaining = 8; // Count of empty required fields

    setContext("sop-chapters", "Ch.1 - Admissions & Intake", {
      workflowName: "Admissions & Intake",
      workflowStep: currentStepData?.name,
      currentStep: currentStep,
      totalSteps: steps.length,
      stepName: currentStepData?.name,
      completionPercentage: completionPercentage,
      requiredFieldsRemaining: requiredFieldsRemaining,
      completedSteps: steps.filter(s => s.completed).map(s => s.name),
      pendingSteps: steps.filter(s => !s.completed && s.id !== currentStep).map(s => s.name),
    });
  }, [setContext, currentStep]);

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <Link href="/sop-chapters">
          <Button variant="ghost" className="mb-4">
            ← Back to SOP Chapters
          </Button>
        </Link>
        <h1 className="text-3xl font-bold mb-2">📝 Ch.1 - Admissions & Intake</h1>
        <p className="text-gray-600">Complete intake workflow from referral to enrollment</p>
      </div>

      {/* Workflow Progress */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>📊 Intake Workflow Progress</CardTitle>
          <CardDescription>7-step guided admission process</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  step.id === currentStep
                    ? "bg-blue-50 border-2 border-blue-500"
                    : step.completed
                    ? "bg-green-50"
                    : "bg-gray-50"
                }`}
              >
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    step.completed
                      ? "bg-green-500 text-white"
                      : step.id === currentStep
                      ? "bg-blue-500 text-white"
                      : "bg-gray-300 text-gray-600"
                  }`}
                >
                  {step.completed ? <Check className="w-5 h-5" /> : step.id}
                </div>
                <div className="flex-1">
                  <div className="font-semibold">{step.name}</div>
                  {step.id === currentStep && (
                    <div className="text-sm text-blue-600">In Progress</div>
                  )}
                  {step.completed && (
                    <div className="text-sm text-green-600">Completed</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Client Intake Assessment Form */}
      <Card>
        <CardHeader>
          <CardTitle>📋 Client Intake Assessment</CardTitle>
          <CardDescription>Step 3: Collect client information for admission</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                👤 Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input id="firstName" required />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input id="lastName" required />
                </div>
                <div>
                  <Label htmlFor="dob">Date of Birth *</Label>
                  <Input id="dob" type="date" required />
                </div>
                <div>
                  <Label htmlFor="ssn">Social Security Number</Label>
                  <Input id="ssn" placeholder="XXX-XX-XXXX" />
                </div>
                <div>
                  <Label htmlFor="gender">Gender *</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input id="phone" placeholder="(XXX) XXX-XXXX" required />
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                🏠 Address Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="street">Street Address *</Label>
                  <Input id="street" required />
                </div>
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input id="city" required />
                </div>
                <div>
                  <Label htmlFor="state">State *</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select State" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TX">Texas</SelectItem>
                      <SelectItem value="CA">California</SelectItem>
                      <SelectItem value="NY">New York</SelectItem>
                      <SelectItem value="FL">Florida</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="zip">ZIP Code *</Label>
                  <Input id="zip" placeholder="XXXXX" required />
                </div>
              </div>
            </div>

            {/* Referral Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                🏥 Referral Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="referringAgency">Referring Agency *</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Agency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dhs">Department of Human Services</SelectItem>
                      <SelectItem value="hospital">Hospital/Medical Center</SelectItem>
                      <SelectItem value="school">School District</SelectItem>
                      <SelectItem value="court">Court System</SelectItem>
                      <SelectItem value="self">Self-Referral</SelectItem>
                      <SelectItem value="family">Family/Guardian</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="referralDate">Referral Date *</Label>
                  <Input id="referralDate" type="date" required />
                </div>
                <div>
                  <Label htmlFor="diagnosis">Primary Diagnosis</Label>
                  <Input id="diagnosis" placeholder="ICD-10 Code and Description" />
                </div>
                <div>
                  <Label htmlFor="urgency">Urgency Level *</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Urgency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="routine">Routine</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                      <SelectItem value="emergency">Emergency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="reason">Reason for Referral *</Label>
                  <Textarea
                    id="reason"
                    placeholder="Describe the reason for referral and presenting concerns..."
                    rows={4}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <Button type="button" variant="outline">
                💾 Save as Draft
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                ➡️ Continue to Assessment
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

