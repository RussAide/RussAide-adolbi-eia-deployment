import { useEffect } from "react";
import { useEIAContext } from "@/contexts/EIAContext";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, DollarSign, FileCheck, MapPin } from "lucide-react";

export default function Services() {
  const { setContext } = useEIAContext();
  const { data: services, isLoading } = trpc.services.list.useQuery();

  useEffect(() => {
    if (services && services.length > 0) {
      const completedCount = services.filter(s => s.status === 'completed').length;
      const scheduledCount = services.filter(s => s.status === 'scheduled').length;
      const pendingNotesCount = services.filter(s => s.status === 'completed' && s.billingStatus === 'pending').length;
      
      setContext("services", "Service Delivery", {
        totalServices: services.length,
        completedServices: completedCount,
        scheduledServices: scheduledCount,
        pendingNotes: pendingNotesCount,
        recentService: services[0] ? `Service #${services[0].id}` : null,
        needsDocumentation: pendingNotesCount,
      });
    } else {
      setContext("services", "Service Delivery");
    }
  }, [setContext, services]);

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "completed": return "bg-green-600 text-white";
      case "scheduled": return "bg-blue-600 text-white";
      case "cancelled": return "bg-red-600 text-white";
      default: return "bg-gray-600 text-white";
    }
  };

  const getBillingColor = (status?: string) => {
    switch (status) {
      case "paid": return "bg-green-600 text-white";
      case "submitted": return "bg-blue-600 text-white";
      case "ready": return "bg-yellow-600 text-white";
      case "pending": return "bg-orange-600 text-white";
      default: return "bg-gray-600 text-white";
    }
  };

  return (
    <div className="container mx-auto py-8 px-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Service Delivery</h1>
          <p className="text-gray-600 mt-1">Track therapy sessions and treatment services</p>
        </div>
        <Button className="bg-cyan-600 hover:bg-cyan-700">
          <Plus className="w-4 h-4 mr-2" />
          Log Service
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading services...</p>
        </div>
      ) : services && services.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {services.map((service) => (
            <Card key={service.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{service.serviceType}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">Client ID: {service.clientId}</p>
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    <Badge className={getStatusColor(service.status || undefined)}>
                      {service.status || "completed"}
                    </Badge>
                    {service.billingStatus && (
                      <Badge className={getBillingColor(service.billingStatus || undefined)}>
                        {service.billingStatus}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Date:</span>
                      <span className="font-medium">
                        {new Date(service.serviceDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-gray-400" />
                      <span className="font-bold text-cyan-600">
                        ${service.totalAmount?.toFixed(2) || "0.00"}
                      </span>
                    </div>
                  </div>

                  {service.serviceLocation && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">{service.serviceLocation}</span>
                    </div>
                  )}

                  {service.documentationCompleted && (
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <FileCheck className="w-4 h-4" />
                      <span>Documentation Complete</span>
                    </div>
                  )}

                  {service.notes && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">{service.notes}</p>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline">View Details</Button>
                    <Button size="sm" variant="outline">Edit</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No services logged</h3>
            <p className="text-gray-600 mb-4">Start tracking therapy sessions and services</p>
            <Button className="bg-cyan-600 hover:bg-cyan-700">
              <Plus className="w-4 h-4 mr-2" />
              Log First Service
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

