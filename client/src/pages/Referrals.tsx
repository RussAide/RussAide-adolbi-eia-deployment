import { useEffect } from "react";
import { useEIAContext } from "@/contexts/EIAContext";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Filter, Phone, Mail, Calendar, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function Referrals() {
  const { setContext } = useEIAContext();
  const { data: referrals, isLoading } = trpc.referrals.list.useQuery();

  useEffect(() => {
    if (referrals && referrals.length > 0) {
      const pendingCount = referrals.filter(r => r.status === 'pending').length;
      
      setContext("referrals", "Admissions & Referrals", {
        totalReferrals: referrals.length,
        pendingReferrals: pendingCount,
        urgentReferrals: 2, // Placeholder
        recentReferral: referrals[0] ? `Referral #${referrals[0].id}` : null,
        needsScreening: pendingCount,
      });
    } else {
      setContext("referrals", "Admissions & Referrals");
    }
  }, [setContext, referrals]);

  const getUrgencyColor = (urgency?: string) => {
    switch (urgency) {
      case "emergency": return "bg-red-600 text-white";
      case "urgent": return "bg-orange-600 text-white";
      case "routine": return "bg-blue-600 text-white";
      default: return "bg-gray-600 text-white";
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "completed": return "bg-green-600 text-white";
      case "accepted": return "bg-blue-600 text-white";
      case "pending": return "bg-yellow-600 text-white";
      case "declined": return "bg-red-600 text-white";
      default: return "bg-gray-600 text-white";
    }
  };

  return (
    <div className="container mx-auto py-8 px-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Referrals</h1>
          <p className="text-gray-600 mt-1">Manage intake referrals and assignments</p>
        </div>
        <Button className="bg-pink-600 hover:bg-pink-700">
          <Plus className="w-4 h-4 mr-2" />
          New Referral
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search referrals..."
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Referrals List */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading referrals...</p>
        </div>
      ) : referrals && referrals.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {referrals.map((referral) => (
            <Card key={referral.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">
                      Referral #{referral.id}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {referral.referralSource}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={getUrgencyColor(referral.urgencyLevel || undefined)}>
                      {referral.urgencyLevel || "routine"}
                    </Badge>
                    <Badge className={getStatusColor(referral.status || undefined)}>
                      {referral.status || "pending"}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {referral.referralContactName && (
                    <div className="flex items-center gap-2 text-sm">
                      <AlertCircle className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Contact:</span>
                      <span className="font-medium">{referral.referralContactName}</span>
                    </div>
                  )}
                  {referral.referralContactPhone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">{referral.referralContactPhone}</span>
                    </div>
                  )}
                  {referral.referralContactEmail && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">{referral.referralContactEmail}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Referral Date:</span>
                    <span className="font-medium">
                      {new Date(referral.referralDate).toLocaleDateString()}
                    </span>
                  </div>
                  {referral.priorityScore && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-600">Priority Score:</span>
                      <span className="font-bold text-pink-600">{referral.priorityScore}/10</span>
                    </div>
                  )}
                </div>
                {referral.notes && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">{referral.notes}</p>
                  </div>
                )}
                <div className="mt-4 flex gap-2">
                  <Button size="sm" variant="outline">View Details</Button>
                  <Button size="sm" variant="outline">Assign</Button>
                  <Button size="sm" variant="outline">Schedule Intake</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No referrals found</h3>
            <p className="text-gray-600 mb-4">Get started by adding your first referral</p>
            <Button className="bg-pink-600 hover:bg-pink-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Referral
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

