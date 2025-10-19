import { useEffect } from "react";
import { useEIAContext } from "@/contexts/EIAContext";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  FileText,
  AlertCircle,
  DollarSign,
  Plus,
  FileEdit,
  BarChart3,
  TrendingUp,
  Clock,
} from "lucide-react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";

export default function Dashboard() {
  const { setContext } = useEIAContext();
  const { user } = useAuth();
  
  // Fetch real dashboard stats from API
  const { data: stats, isLoading } = trpc.dashboard.stats.useQuery();
  
  const displayStats = stats || {
    activeClients: 0,
    pendingReferrals: 0,
    activeCrisis: 0,
    pendingClaimsAmount: 0,
  };

  const urgentAlerts = [
    {
      title: "Crisis Follow-up Due",
      description: "Jane Smith - Due today",
      priority: "high",
    },
    {
      title: "Authorization Expiring",
      description: "3 clients need renewal",
      priority: "medium",
    },
  ];

  const upcomingTasks = [
    {
      title: "CANS Assessment",
      client: "John Doe",
      due: "Tomorrow",
    },
    {
      title: "Treatment Plan Review",
      client: "Bob Johnson",
      due: "Friday",
    },
    {
      title: "Supervision Session",
      client: "Team meeting",
      due: "Monday",
    },
  ];

  const recentActivity = [
    {
      type: "client",
      message: "New client admitted",
      user: "John Doe",
      time: "2 hours ago",
      icon: Users,
      color: "text-blue-600",
    },
    {
      type: "crisis",
      message: "Crisis event resolved",
      user: "Jane Smith",
      time: "4 hours ago",
      icon: AlertCircle,
      color: "text-red-600",
    },
    {
      type: "document",
      message: "Document generated",
      user: "Bob Johnson",
      time: "5 hours ago",
      icon: FileEdit,
      color: "text-purple-600",
    },
    {
      type: "billing",
      message: "Claim submitted",
      user: "Alice Brown",
      time: "1 day ago",
      icon: DollarSign,
      color: "text-green-600",
    },
  ];

  // Set EIA context with rich data
  useEffect(() => {
    if (stats) {
      setContext("dashboard", "Dashboard", {
        activeClients: stats.activeClients,
        pendingReferrals: stats.pendingReferrals,
        urgentReferrals: 2,
        activeCrisis: stats.activeCrisis,
        pendingClaimsAmount: stats.pendingClaimsAmount,
        pendingClaimsCount: 5,
        urgentAlerts: urgentAlerts,
        upcomingTasks: upcomingTasks,
        recentActivity: recentActivity.slice(0, 2),
      });
    } else {
      setContext("dashboard", "Dashboard");
    }
  }, [setContext, stats]);

  const metrics = [
    {
      title: "Active Clients",
      value: isLoading ? "..." : displayStats.activeClients.toString(),
      change: "+3 this week",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Pending Referrals",
      value: isLoading ? "..." : displayStats.pendingReferrals.toString(),
      change: "2 urgent",
      icon: FileText,
      color: "text-pink-600",
      bgColor: "bg-pink-100",
    },
    {
      title: "Crisis Events",
      value: isLoading ? "..." : displayStats.activeCrisis.toString(),
      change: "Active monitoring",
      icon: AlertCircle,
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
    {
      title: "Pending Claims",
      value: isLoading ? "..." : `$${(displayStats.pendingClaimsAmount / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: "5 claims ready",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
  ];

  const quickActions = [
    {
      title: "Add New Client",
      description: "Register a new client in the system",
      icon: Plus,
      color: "bg-blue-600",
      link: "/clients",
    },
    {
      title: "Generate Document",
      description: "Create AI-powered documentation",
      icon: FileEdit,
      color: "bg-purple-600",
      link: "/documentation",
    },
    {
      title: "View Reports",
      description: "Access analytics and insights",
      icon: BarChart3,
      color: "bg-orange-600",
      link: "/reports",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-8 px-6">
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Welcome back, {user?.name || "User"}!</h1>
              <p className="text-blue-100 mt-2">Here's what's happening with your clients today</p>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4" />
              <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-8 px-6">
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">{metric.title}</p>
                      <div className="text-3xl font-bold mb-1">{metric.value}</div>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        {metric.change}
                      </p>
                    </div>
                    <div className={`${metric.bgColor} ${metric.color} p-3 rounded-lg`}>
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks and workflows</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {quickActions.map((action, index) => {
                    const Icon = action.icon;
                    return (
                      <Link key={index} href={action.link}>
                        <Card className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-blue-200">
                          <CardContent className="pt-6 text-center">
                            <div className={`${action.color} text-white w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3`}>
                              <Icon className="w-6 h-6" />
                            </div>
                            <h3 className="font-semibold mb-1">{action.title}</h3>
                            <p className="text-sm text-gray-600">{action.description}</p>
                          </CardContent>
                        </Card>
                      </Link>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest updates across all modules</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => {
                    const Icon = activity.icon;
                    return (
                      <div key={index} className="flex items-start gap-3 pb-4 border-b last:border-0">
                        <div className={`${activity.color} mt-1`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{activity.message}</p>
                          <p className="text-sm text-gray-600">{activity.user}</p>
                        </div>
                        <span className="text-xs text-gray-500">{activity.time}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Urgent Alerts */}
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-700">
                  <AlertCircle className="w-5 h-5" />
                  Urgent Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {urgentAlerts.map((alert, index) => (
                    <div key={index} className="bg-white p-3 rounded-lg border border-red-200">
                      <h4 className="font-semibold text-sm mb-1">{alert.title}</h4>
                      <p className="text-xs text-gray-600">{alert.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Tasks */}
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700">
                  <Clock className="w-5 h-5" />
                  Upcoming Tasks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingTasks.map((task, index) => (
                    <div key={index} className="bg-white p-3 rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-sm mb-1">{task.title}</h4>
                      <p className="text-xs text-gray-600">{task.client} - {task.due}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* EIA Documentation */}
            <Card className="bg-gradient-to-br from-purple-600 to-purple-800 text-white">
              <CardHeader>
                <CardTitle>EIA Documentation</CardTitle>
                <CardDescription className="text-purple-100">
                  AI-powered document generation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-4 text-purple-100">
                  Generate professional documentation in minutes with our AI assistant
                </p>
                <Link href="/documentation">
                  <Button variant="secondary" className="w-full">
                    <FileEdit className="w-4 h-4 mr-2" />
                    Start Workflow
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t mt-12 py-6">
        <div className="container mx-auto px-6 text-center text-sm text-gray-600">
          <p>© 2025 Adolbi Care. All rights reserved.</p>
          <p className="mt-1">Integrated Behavioral Health Platform</p>
        </div>
      </footer>
    </div>
  );
}

