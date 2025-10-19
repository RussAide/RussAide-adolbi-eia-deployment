import { useEffect } from "react";
import { useEIAContext } from "@/contexts/EIAContext";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Mail, Calendar } from "lucide-react";

export default function Staff() {
  const { setContext } = useEIAContext();
  const { data: staff, isLoading } = trpc.staff.list.useQuery();

  useEffect(() => {
    if (staff && staff.length > 0) {
      const therapistCount = staff.filter(s => s.role === 'therapist').length;
      const caseManagerCount = staff.filter(s => s.role === 'case_manager').length;
      
      setContext("staff", "Staff Management", {
        totalStaff: staff.length,
        therapistCount: therapistCount,
        caseManagerCount: caseManagerCount,
        credentialsExpiring: 2,
        supervisionDue: 3,
        recentStaff: staff[0]?.name || null,
      });
    } else {
      setContext("staff", "Staff Management");
    }
  }, [setContext, staff]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-6">
        <div className="text-center py-12">Loading staff...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Staff Management</h1>
      <p className="text-gray-600 mb-8">Manage staff profiles, credentials, and caseloads</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {staff && staff.length > 0 ? (
          staff.map((member) => (
            <Card key={member.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center">
                      <Users className="w-6 h-6 text-teal-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{member.name || "Staff Member"}</CardTitle>
                      <Badge variant="outline" className="mt-1">
                        {member.role === "admin" ? "Administrator" : "Staff"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  {member.email && (
                    <div className="flex items-center text-gray-600">
                      <Mail className="w-4 h-4 mr-2" />
                      {member.email}
                    </div>
                  )}
                  {member.lastSignedIn && (
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      Last active: {new Date(member.lastSignedIn).toLocaleDateString()}
                    </div>
                  )}
                  <div className="pt-2 mt-2 border-t">
                    <p className="text-xs text-gray-500">Login method: {member.loginMethod || "OAuth"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="col-span-full">
            <CardContent className="text-center py-12">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Staff Members</h3>
              <p className="text-gray-600">Staff members will appear here once they sign in to the system</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

