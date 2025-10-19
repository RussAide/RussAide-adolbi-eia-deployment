import { useEffect } from "react";
import { useEIAContext } from "@/contexts/EIAContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, CheckCircle, AlertTriangle, FileCheck, Clock } from "lucide-react";

export default function Compliance() {
  const { setContext } = useEIAContext();

  useEffect(() => {
    setContext("compliance", "Quality Assurance & Compliance", {
      documentationCompliance: 94,
      staffCertificationsCurrent: 100,
      pendingReviews: 3,
      qualityScore: "A",
      recentAudits: 5,
      issuesIdentified: 2,
    });
  }, [setContext]);

  // Sample compliance data
  const complianceMetrics = [
    { label: "Documentation Compliance", value: "94%", status: "good", icon: FileCheck },
    { label: "Staff Certifications Current", value: "100%", status: "excellent", icon: CheckCircle },
    { label: "Pending Reviews", value: "3", status: "warning", icon: Clock },
    { label: "Quality Score", value: "A", status: "excellent", icon: Shield },
  ];

  const recentAudits = [
    {
      id: 1,
      type: "Documentation Review",
      date: "2024-10-15",
      status: "passed",
      score: 95,
      reviewer: "Quality Assurance Team",
    },
    {
      id: 2,
      type: "HIPAA Compliance Check",
      date: "2024-10-10",
      status: "passed",
      score: 100,
      reviewer: "Compliance Officer",
    },
    {
      id: 3,
      type: "Service Delivery Audit",
      date: "2024-10-05",
      status: "passed",
      score: 92,
      reviewer: "Clinical Director",
    },
    {
      id: 4,
      type: "Billing Accuracy Review",
      date: "2024-09-28",
      status: "attention",
      score: 88,
      reviewer: "Finance Department",
      notes: "Minor discrepancies found, corrective action taken",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
      case "good":
      case "passed":
        return "bg-green-100 text-green-800";
      case "warning":
      case "attention":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 95) return "text-green-600";
    if (score >= 85) return "text-blue-600";
    if (score >= 75) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="container mx-auto py-8 px-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Compliance & Quality Assurance</h1>
      <p className="text-gray-600 mb-8">Monitor regulatory compliance and quality metrics</p>

      {/* Compliance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {complianceMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <Icon className="w-8 h-8 text-slate-600" />
                  <Badge className={getStatusColor(metric.status)}>
                    {metric.status}
                  </Badge>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{metric.value}</div>
                <div className="text-sm text-gray-600">{metric.label}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Audits */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="w-5 h-5 mr-2 text-slate-600" />
            Recent Audits & Reviews
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentAudits.map((audit) => (
              <div
                key={audit.id}
                className="flex items-start justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-semibold text-gray-900">{audit.type}</h3>
                    <Badge className={getStatusColor(audit.status)}>
                      {audit.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Date: {new Date(audit.date).toLocaleDateString()}</p>
                    <p>Reviewer: {audit.reviewer}</p>
                    {audit.notes && (
                      <p className="text-yellow-700 flex items-start mt-2">
                        <AlertTriangle className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" />
                        {audit.notes}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right ml-4">
                  <div className={`text-2xl font-bold ${getScoreColor(audit.score)}`}>
                    {audit.score}%
                  </div>
                  <div className="text-xs text-gray-500">Score</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Compliance Areas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Regulatory Compliance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">HIPAA Privacy</span>
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">State Licensing</span>
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Medicaid Standards</span>
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">CARF Accreditation</span>
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quality Indicators</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Client Satisfaction</span>
                <span className="font-semibold text-green-600">4.8/5.0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Treatment Outcomes</span>
                <span className="font-semibold text-green-600">92%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Staff Retention</span>
                <span className="font-semibold text-blue-600">89%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Safety Incidents</span>
                <span className="font-semibold text-green-600">0.2%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

