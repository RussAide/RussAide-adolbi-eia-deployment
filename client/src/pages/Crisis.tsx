import { useEffect } from "react";
import { useEIAContext } from "@/contexts/EIAContext";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, AlertTriangle, MapPin, Calendar, User, CheckCircle2 } from "lucide-react";

export default function Crisis() {
  const { setContext } = useEIAContext();
  const { data: crisisEvents, isLoading } = trpc.crisis.list.useQuery();

  useEffect(() => {
    if (crisisEvents && crisisEvents.length > 0) {
      const activeCount = crisisEvents.filter(c => c.status === 'active').length;
      const escalatedCount = crisisEvents.filter(c => c.status === 'escalated').length;
      const criticalCount = crisisEvents.filter(c => c.riskLevel === 'critical').length;
      
      setContext("crisis", "Crisis Management", {
        totalCrisis: crisisEvents.length,
        activeCrisis: activeCount,
        escalatedCrisis: escalatedCount,
        criticalRisk: criticalCount,
        recentCrisis: crisisEvents[0] ? `Crisis #${crisisEvents[0].id}` : null,
        needsFollowUp: activeCount + escalatedCount,
      });
    } else {
      setContext("crisis", "Crisis Management");
    }
  }, [setContext, crisisEvents]);

  const getRiskColor = (risk?: string) => {
    switch (risk) {
      case "critical": return "bg-red-600 text-white";
      case "high": return "bg-orange-600 text-white";
      case "medium": return "bg-yellow-600 text-white";
      case "low": return "bg-green-600 text-white";
      default: return "bg-gray-600 text-white";
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "resolved": return "bg-green-600 text-white";
      case "active": return "bg-red-600 text-white";
      case "monitoring": return "bg-yellow-600 text-white";
      default: return "bg-gray-600 text-white";
    }
  };

  return (
    <div className="container mx-auto py-8 px-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Crisis Management</h1>
          <p className="text-gray-600 mt-1">Monitor and respond to crisis events</p>
        </div>
        <Button className="bg-red-600 hover:bg-red-700">
          <Plus className="w-4 h-4 mr-2" />
          Report Crisis
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading crisis events...</p>
        </div>
      ) : crisisEvents && crisisEvents.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {crisisEvents.map((event) => (
            <Card key={event.id} className="hover:shadow-lg transition-shadow border-l-4 border-l-red-600">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                      {event.crisisType}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      Client ID: {event.clientId}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={getRiskColor(event.riskLevel || undefined)}>
                      {event.riskLevel || "unknown"} risk
                    </Badge>
                    <Badge className={getStatusColor(event.status || undefined)}>
                      {event.status || "active"}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Event Date:</span>
                      <span className="font-medium">
                        {new Date(event.eventDate).toLocaleString()}
                      </span>
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">{event.location}</span>
                      </div>
                    )}
                    {event.respondedBy && (
                      <div className="flex items-center gap-2 text-sm">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">Responded By:</span>
                        <span className="font-medium">{event.respondedBy}</span>
                      </div>
                    )}
                    {event.followUpRequired && (
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-orange-500" />
                        <span className="text-orange-600 font-medium">Follow-up Required</span>
                      </div>
                    )}
                  </div>

                  {event.description && (
                    <div className="p-3 bg-red-50 rounded-lg">
                      <p className="text-sm font-semibold text-gray-700 mb-1">Description:</p>
                      <p className="text-sm text-gray-700">{event.description}</p>
                    </div>
                  )}

                  {event.interventionDetails && (
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm font-semibold text-gray-700 mb-1">Intervention:</p>
                      <p className="text-sm text-gray-700">{event.interventionDetails}</p>
                    </div>
                  )}

                  {event.outcome && (
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="text-sm font-semibold text-gray-700 mb-1">Outcome:</p>
                      <p className="text-sm text-gray-700">{event.outcome}</p>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline">View Full Report</Button>
                    <Button size="sm" variant="outline">Update Status</Button>
                    {event.followUpRequired && (
                      <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                        Complete Follow-up
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No crisis events</h3>
            <p className="text-gray-600">All clients are stable</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

