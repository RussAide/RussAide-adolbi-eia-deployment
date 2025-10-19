import { useEffect } from "react";
import { useEIAContext } from "@/contexts/EIAContext";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Reports() {
  const { setContext } = useEIAContext();

  useEffect(() => {
    setContext("reports", "Reports & Analytics", {
      availableReports: 8,
      scheduledReports: 3,
      recentlyGenerated: 5,
      mostViewedReport: "Monthly Service Utilization Report",
      dataFreshness: "Updated today",
    });
  }, [setContext]);

  const { user } = useAuth();

  // Sample report data
  const reports = [
    {
      id: 1,
      title: "Monthly Service Utilization Report",
      description: "H2017, H2014, H2011, H0034, MHTCM service hours by client and provider",
      period: "October 2024",
      type: "Service Analytics",
      status: "Available",
      generatedDate: "2024-10-15",
    },
    {
      id: 2,
      title: "Billing Claims Summary",
      description: "Claims submitted, paid, denied, and pending by payer and service code",
      period: "Q3 2024",
      type: "Financial",
      status: "Available",
      generatedDate: "2024-10-01",
    },
    {
      id: 3,
      title: "Crisis Event Analysis",
      description: "Crisis incidents by type, risk level, and intervention outcomes",
      period: "September 2024",
      type: "Clinical",
      status: "Available",
      generatedDate: "2024-10-05",
    },
    {
      id: 4,
      title: "MHTCM Coordination Report",
      description: "Case management hours, coordination activities, and client outcomes",
      period: "October 2024",
      type: "Case Management",
      status: "Available",
      generatedDate: "2024-10-10",
    },
    {
      id: 5,
      title: "Compliance & Quality Metrics",
      description: "Documentation completion rates, audit findings, and quality indicators",
      period: "Q3 2024",
      type: "Compliance",
      status: "Available",
      generatedDate: "2024-10-12",
    },
  ];

  const metrics = [
    {
      label: "Total Service Hours (October)",
      value: "342 hours",
      detail: "H2017: 180hrs, H2014: 96hrs, MHTCM: 48hrs, H2011: 18hrs",
      trend: "+12% vs Sept",
      color: "text-blue-600",
    },
    {
      label: "Claims Paid (October)",
      value: "$24,750.00",
      detail: "18 claims approved, avg $1,375 per claim",
      trend: "+8% vs Sept",
      color: "text-green-600",
    },
    {
      label: "Client Engagement Rate",
      value: "94%",
      detail: "47 of 50 scheduled sessions attended",
      trend: "+3% vs Sept",
      color: "text-purple-600",
    },
    {
      label: "Documentation Compliance",
      value: "98%",
      detail: "All service notes completed within 24 hours",
      trend: "Maintained",
      color: "text-teal-600",
    },
  ];

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Reports & Analytics</h1>
        <p className="text-gray-600">Comprehensive reporting and data insights for MHRS/MHTCM services</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">{metric.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${metric.color} mb-2`}>{metric.value}</div>
              <p className="text-sm text-gray-600 mb-1">{metric.detail}</p>
              <p className="text-xs text-green-600 font-medium">{metric.trend}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Available Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Available Reports</CardTitle>
          <CardDescription>Download and view detailed analytics reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reports.map((report) => (
              <div
                key={report.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">{report.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{report.description}</p>
                  <div className="flex gap-4 text-sm text-gray-500">
                    <span>📊 {report.type}</span>
                    <span>📅 {report.period}</span>
                    <span>✅ {report.status}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                  <Button variant="default" size="sm">
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Service Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">H2017 (MHRS)</span>
                <span className="font-semibold">180 hrs (53%)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">H2014 (Skills Training)</span>
                <span className="font-semibold">96 hrs (28%)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">MHTCM (Case Mgmt)</span>
                <span className="font-semibold">48 hrs (14%)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">H2011 (Crisis)</span>
                <span className="font-semibold">18 hrs (5%)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Payers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Texas Medicaid</span>
                <span className="font-semibold">$22,500</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">CHIP</span>
                <span className="font-semibold">$1,800</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Private Insurance</span>
                <span className="font-semibold">$450</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Client Outcomes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Goals Met</span>
                <span className="font-semibold text-green-600">67%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">In Progress</span>
                <span className="font-semibold text-blue-600">28%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Needs Revision</span>
                <span className="font-semibold text-orange-600">5%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

