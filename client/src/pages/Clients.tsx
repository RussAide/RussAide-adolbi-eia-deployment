import { useEffect } from "react";
import { useEIAContext } from "@/contexts/EIAContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, FileEdit, User, Phone, Calendar } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

export default function Clients() {
  const { setContext } = useEIAContext();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [riskFilter, setRiskFilter] = useState("all");

  // Mock data - will be replaced with tRPC queries
  const clients = [
    {
      id: 1,
      firstName: "John",
      lastName: "Doe",
      dateOfBirth: "1990-05-15",
      riskLevel: "medium",
      status: "active",
      phone: "(555) 123-4567",
      lastService: "2025-10-15",
    },
    {
      id: 2,
      firstName: "Jane",
      lastName: "Smith",
      riskLevel: "high",
      status: "active",
      phone: "(555) 234-5678",
      lastService: "2025-10-16",
    },
    {
      id: 3,
      firstName: "Bob",
      lastName: "Johnson",
      riskLevel: "low",
      status: "active",
      phone: "(555) 345-6789",
      lastService: "2025-10-14",
    },
    {
      id: 4,
      firstName: "Alice",
      lastName: "Brown",
      riskLevel: "critical",
      status: "active",
      phone: "(555) 456-7890",
      lastService: "2025-10-17",
    },
  ];

  useEffect(() => {
    const activeClients = clients.filter(c => c.status === 'active');
    const highRiskClients = clients.filter(c => c.riskLevel === 'high' || c.riskLevel === 'critical');
    const criticalClients = clients.filter(c => c.riskLevel === 'critical');
    
    setContext("clients", "Client Management", {
      totalClients: clients.length,
      activeClients: activeClients.length,
      highRiskCount: highRiskClients.length,
      criticalCount: criticalClients.length,
      recentClient: clients[0] ? `${clients[0].firstName} ${clients[0].lastName}` : null,
      clientList: clients.slice(0, 3).map(c => `${c.firstName} ${c.lastName} (${c.riskLevel})`),
      overdueAppointments: 5,
      authorizationsExpiring: 8,
    });
    }, []);
  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "critical":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "inactive":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "discharged":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Client Management</h1>
              <p className="text-gray-600 mt-1">Manage and track all client information</p>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add New Client
            </Button>
          </div>
        </div>
      </div>

      <div className="container py-8">
        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Search & Filter</CardTitle>
            <CardDescription>Find clients by name, status, or risk level</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="discharged">Discharged</SelectItem>
                </SelectContent>
              </Select>
              <Select value={riskFilter} onValueChange={setRiskFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by risk level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Risk Levels</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Client Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clients.map((client) => (
            <Card key={client.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white font-bold text-lg">
                      {client.firstName[0]}{client.lastName[0]}
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        {client.firstName} {client.lastName}
                      </CardTitle>
                      <CardDescription className="flex items-center mt-1">
                        <User className="w-3 h-3 mr-1" />
                        ID: {client.id}
                      </CardDescription>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <Badge className={getRiskBadgeColor(client.riskLevel)}>
                    {client.riskLevel.toUpperCase()}
                  </Badge>
                  <Badge className={getStatusBadgeColor(client.status)}>
                    {client.status.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  {client.phone && (
                    <div className="flex items-center text-gray-600">
                      <Phone className="w-4 h-4 mr-2" />
                      {client.phone}
                    </div>
                  )}
                  {client.lastService && (
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      Last service: {new Date(client.lastService).toLocaleDateString()}
                    </div>
                  )}
                </div>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1">
                    View Details
                  </Button>
                  <Link href="/documentation">
                    <Button size="sm" className="flex-1 bg-purple-600 hover:bg-purple-700">
                      <FileEdit className="w-4 h-4 mr-1" />
                      Generate Docs
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {clients.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No clients found</h3>
              <p className="text-gray-600 mb-4">
                Get started by adding your first client
              </p>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Add New Client
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

