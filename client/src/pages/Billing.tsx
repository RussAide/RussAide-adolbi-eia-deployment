import { useEffect } from "react";
import { useEIAContext } from "@/contexts/EIAContext";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, DollarSign, Calendar, FileText } from "lucide-react";

export default function Billing() {
  const { setContext } = useEIAContext();
  const { data: claims, isLoading } = trpc.billing.list.useQuery();

  useEffect(() => {
    if (claims && claims.length > 0) {
      const pendingCount = claims.filter(c => c.status === 'pending').length;
      const deniedCount = claims.filter(c => c.status === 'denied').length;
      const totalAmount = claims.reduce((sum, c) => sum + (c.amount || 0), 0);
      
      setContext("billing", "Billing & Claims", {
        totalClaims: claims.length,
        pendingClaims: pendingCount,
        deniedClaims: deniedCount,
        totalAmount: totalAmount,
        recentClaim: claims[0] ? `Claim #${claims[0].id}` : null,
        needsReview: pendingCount + deniedCount,
      });
    } else {
      setContext("billing", "Billing & Claims");
    }
  }, [setContext, claims]);

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "paid": return "bg-green-600 text-white";
      case "submitted": return "bg-blue-600 text-white";
      case "pending": return "bg-yellow-600 text-white";
      case "denied": return "bg-red-600 text-white";
      case "appealed": return "bg-purple-600 text-white";
      default: return "bg-gray-600 text-white";
    }
  };

  return (
    <div className="container mx-auto py-8 px-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Billing & Claims</h1>
          <p className="text-gray-600 mt-1">Manage insurance claims and revenue</p>
        </div>
        <Button className="bg-orange-600 hover:bg-orange-700">
          <Plus className="w-4 h-4 mr-2" />
          New Claim
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading claims...</p>
        </div>
      ) : claims && claims.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {claims.map((claim) => (
            <Card key={claim.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{claim.claimNumber || `Claim #${claim.id}`}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">Client ID: {claim.clientId}</p>
                  </div>
                  <Badge className={getStatusColor(claim.status || undefined)}>
                    {claim.status || "pending"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-bold text-orange-600">
                        ${claim.amount?.toFixed(2) || "0.00"}
                      </span>
                    </div>
                    {claim.amountPaid && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-600">Paid:</span>
                        <span className="font-bold text-green-600">
                          ${claim.amountPaid.toFixed(2)}
                        </span>
                      </div>
                    )}
                  </div>

                  {claim.payerName && (
                    <div className="flex items-center gap-2 text-sm">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Payer:</span>
                      <span className="font-medium">{claim.payerName}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Service Date:</span>
                    <span className="font-medium">
                      {new Date(claim.serviceDate).toLocaleDateString()}
                    </span>
                  </div>

                  {claim.denialReason && (
                    <div className="p-3 bg-red-50 rounded-lg">
                      <p className="text-sm font-semibold text-red-700 mb-1">Denial Reason:</p>
                      <p className="text-sm text-red-600">{claim.denialReason}</p>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline">View Details</Button>
                    {claim.status === "pending" && (
                      <Button size="sm" className="bg-orange-600 hover:bg-orange-700">Submit</Button>
                    )}
                    {claim.status === "denied" && (
                      <Button size="sm" className="bg-purple-600 hover:bg-purple-700">Appeal</Button>
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
            <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No claims found</h3>
            <p className="text-gray-600 mb-4">Start by creating your first billing claim</p>
            <Button className="bg-orange-600 hover:bg-orange-700">
              <Plus className="w-4 h-4 mr-2" />
              Create Claim
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

