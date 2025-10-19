import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  FileText,
  Target,
  ClipboardCheck,
  AlertCircle,
  Pill,
  CheckCircle,
  Car,
  Siren,
  GraduationCap,
  DollarSign,
  Link as LinkIcon,
} from "lucide-react";

export default function SOPChapters() {
  const chapters = [
    {
      id: 1,
      number: "Ch.1",
      title: "Admissions & Intake",
      description: "Complete intake workflow from referral to enrollment with 7-step guided process",
      icon: FileText,
      color: "bg-blue-100 text-blue-700",
      path: "/sop/ch1-admissions",
      steps: 7,
    },
    {
      id: 2,
      number: "Ch.2",
      title: "Service Delivery",
      description: "MHRS, MHTCM, and behavioral health service delivery protocols and documentation",
      icon: Target,
      color: "bg-green-100 text-green-700",
      path: "/sop/ch2-service-delivery",
      steps: 6,
    },
    {
      id: 3,
      number: "Ch.3",
      title: "Documentation Standards",
      description: "Clinical documentation requirements, templates, and compliance guidelines",
      icon: ClipboardCheck,
      color: "bg-purple-100 text-purple-700",
      path: "/sop/ch3-documentation",
      steps: 5,
    },
    {
      id: 4,
      number: "Ch.4",
      title: "Crisis Management",
      description: "Crisis intervention protocols, safety planning, and emergency response procedures",
      icon: AlertCircle,
      color: "bg-red-100 text-red-700",
      path: "/sop/ch4-crisis",
      steps: 8,
    },
    {
      id: 5,
      number: "Ch.5",
      title: "Medication Management",
      description: "Medication training, monitoring, and coordination with healthcare providers",
      icon: Pill,
      color: "bg-orange-100 text-orange-700",
      path: "/sop/ch5-medication",
      steps: 6,
    },
    {
      id: 6,
      number: "Ch.6",
      title: "Quality Assurance",
      description: "Quality metrics, audits, compliance monitoring, and continuous improvement",
      icon: CheckCircle,
      color: "bg-teal-100 text-teal-700",
      path: "/sop/ch6-quality",
      steps: 5,
    },
    {
      id: 7,
      number: "Ch.7",
      title: "Transportation & Community",
      description: "Transportation coordination, community integration, and resource linkage",
      icon: Car,
      color: "bg-cyan-100 text-cyan-700",
      path: "/sop/ch7-transportation",
      steps: 4,
    },
    {
      id: 8,
      number: "Ch.8",
      title: "Emergency Response",
      description: "Emergency protocols, incident reporting, and crisis stabilization procedures",
      icon: Siren,
      color: "bg-rose-100 text-rose-700",
      path: "/sop/ch8-emergency",
      steps: 7,
    },
    {
      id: 9,
      number: "Ch.9",
      title: "Staff Training & Performance",
      description: "Staff onboarding, training requirements, performance evaluation, and supervision",
      icon: GraduationCap,
      color: "bg-indigo-100 text-indigo-700",
      path: "/sop/ch9-staff-training",
      steps: 6,
    },
    {
      id: 10,
      number: "Ch.10",
      title: "Billing & Finance",
      description: "Claims processing, billing procedures, revenue cycle management, and financial reporting",
      icon: DollarSign,
      color: "bg-amber-100 text-amber-700",
      path: "/sop/ch10-billing",
      steps: 8,
    },
    {
      id: 11,
      number: "Ch.11",
      title: "GRO Integration",
      description: "Guardian Residential Operations integration, coordination, and data exchange protocols",
      icon: LinkIcon,
      color: "bg-violet-100 text-violet-700",
      path: "/sop/ch11-gro",
      steps: 5,
    },
  ];

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-3">📚 Standard Operating Procedures</h1>
        <p className="text-lg text-gray-600">
          Comprehensive operational guidelines and workflows for Adolbi Care behavioral health services
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-blue-600 mb-1">11</div>
            <div className="text-sm text-gray-600">SOP Chapters</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-green-600 mb-1">67</div>
            <div className="text-sm text-gray-600">Total Workflows</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-purple-600 mb-1">98%</div>
            <div className="text-sm text-gray-600">Compliance Rate</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-orange-600 mb-1">24/7</div>
            <div className="text-sm text-gray-600">Access Available</div>
          </CardContent>
        </Card>
      </div>

      {/* SOP Chapters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {chapters.map((chapter) => {
          const Icon = chapter.icon;
          return (
            <Card key={chapter.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-3 rounded-lg ${chapter.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-semibold text-gray-500">{chapter.steps} Steps</span>
                </div>
                <CardTitle className="text-xl mb-2">
                  {chapter.number}: {chapter.title}
                </CardTitle>
                <CardDescription className="text-sm">{chapter.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href={chapter.path}>
                  <Button className="w-full" variant="default">
                    View Chapter →
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Access Section */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Quick Access Resources</CardTitle>
          <CardDescription>Frequently used forms and templates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto py-4 flex flex-col items-start">
              <span className="font-semibold mb-1">📋 Intake Form</span>
              <span className="text-xs text-gray-600">New client assessment</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col items-start">
              <span className="font-semibold mb-1">📝 Progress Note</span>
              <span className="text-xs text-gray-600">Service documentation</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col items-start">
              <span className="font-semibold mb-1">🚨 Incident Report</span>
              <span className="text-xs text-gray-600">Crisis documentation</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

