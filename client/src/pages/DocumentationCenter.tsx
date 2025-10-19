import { useEffect } from "react";
import { useEIAContext } from "@/contexts/EIAContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  FileText,
  CheckCircle,
  Clock,
  Play,
  FileEdit,
  Download,
  Eye,
} from "lucide-react";

export default function DocumentationCenter() {
  const { setContext } = useEIAContext();

  useEffect(() => {
    setContext("documentation", "EIA Documentation Center", {
      totalWorkflows: 6,
      completedWorkflows: 2,
      inProgressWorkflows: 2,
      pendingWorkflows: 2,
      documentsGenerated: 15,
      recentDocument: "Client Intake Assessment",
    });
  }, [setContext]);

  const workflowSteps = [
    {
      id: 1,
      title: "Referral Receipt",
      description: "Process incoming referrals and generate intake documents",
      status: "completed",
      progress: 100,
      documentsGenerated: 5,
      icon: FileText,
    },
    {
      id: 2,
      title: "Service Engagement",
      description: "Create engagement letters and service agreements",
      status: "in_progress",
      progress: 60,
      documentsGenerated: 3,
      icon: FileEdit,
    },
    {
      id: 3,
      title: "Clinical Review",
      description: "Generate clinical assessment and review documents",
      status: "in_progress",
      progress: 40,
      documentsGenerated: 2,
      icon: CheckCircle,
    },
    {
      id: 4,
      title: "CANS Assessment",
      description: "Create CANS assessment forms and reports",
      status: "not_started",
      progress: 0,
      documentsGenerated: 0,
      icon: FileText,
    },
    {
      id: 5,
      title: "Service Delivery",
      description: "Generate progress notes and treatment plans",
      status: "not_started",
      progress: 0,
      documentsGenerated: 0,
      icon: FileEdit,
    },
    {
      id: 6,
      title: "Documentation QA",
      description: "Quality assurance and compliance documentation",
      status: "not_started",
      progress: 0,
      documentsGenerated: 0,
      icon: CheckCircle,
    },
    {
      id: 7,
      title: "Risk Management",
      description: "Generate risk assessments and safety plans",
      status: "not_started",
      progress: 0,
      documentsGenerated: 0,
      icon: FileText,
    },
  ];

  const recentDocuments = [
    {
      id: 1,
      title: "Intake Assessment - John Doe",
      type: "Referral Receipt",
      generatedAt: "2025-10-17 14:30",
      status: "final",
    },
    {
      id: 2,
      title: "Service Agreement - Jane Smith",
      type: "Service Engagement",
      generatedAt: "2025-10-17 13:15",
      status: "draft",
    },
    {
      id: 3,
      title: "Clinical Review - Bob Johnson",
      type: "Clinical Review",
      generatedAt: "2025-10-17 11:45",
      status: "final",
    },
    {
      id: 4,
      title: "Progress Note - Alice Brown",
      type: "Service Delivery",
      generatedAt: "2025-10-16 16:20",
      status: "final",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Completed</Badge>;
      case "in_progress":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">In Progress</Badge>;
      case "not_started":
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Not Started</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const getDocStatusBadge = (status: string) => {
    switch (status) {
      case "final":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Final</Badge>;
      case "draft":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Draft</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white">
        <div className="container py-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Documentation Center</h1>
              <p className="text-purple-100 text-lg">
                AI-powered document generation and workflow management
              </p>
            </div>
            <Button variant="secondary" size="lg">
              <FileEdit className="w-5 h-5 mr-2" />
              New Workflow
            </Button>
          </div>
        </div>
      </div>

      <div className="container py-8">
        {/* Workflow Steps */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">EIA Workflow Steps</h2>
          <p className="text-gray-600 mb-6">
            Complete documentation workflows from referral to service delivery
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workflowSteps.map((step) => {
              const Icon = step.icon;
              return (
                <Card key={step.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-purple-600" />
                      </div>
                      {getStatusBadge(step.status)}
                    </div>
                    <CardTitle className="text-lg">{step.title}</CardTitle>
                    <CardDescription>{step.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600">Progress</span>
                          <span className="font-medium">{step.progress}%</span>
                        </div>
                        <Progress value={step.progress} className="h-2" />
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Documents Generated</span>
                        <span className="font-semibold text-purple-600">
                          {step.documentsGenerated}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        {step.status === "not_started" && (
                          <Button size="sm" className="flex-1 bg-purple-600 hover:bg-purple-700">
                            <Play className="w-4 h-4 mr-1" />
                            Start
                          </Button>
                        )}
                        {step.status === "in_progress" && (
                          <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
                            <Clock className="w-4 h-4 mr-1" />
                            Continue
                          </Button>
                        )}
                        {step.status === "completed" && (
                          <Button size="sm" variant="outline" className="flex-1">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            View
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          <FileEdit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Recent Documents */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Documents</CardTitle>
                <CardDescription>Recently generated documentation</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{doc.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-gray-600">{doc.type}</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-sm text-gray-600">{doc.generatedAt}</span>
                        <span className="text-gray-400">•</span>
                        {getDocStatusBadge(doc.status)}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="mt-6 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0">
                <FileEdit className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">AI-Powered Documentation</h3>
                <p className="text-gray-700">
                  The EIA system uses advanced AI to generate professional, compliant documentation
                  based on your client data and workflow context. Each document is tailored to meet
                  regulatory requirements and best practices in behavioral health.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

