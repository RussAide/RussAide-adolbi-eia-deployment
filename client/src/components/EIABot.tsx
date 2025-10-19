import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { MessageCircle, X, Minimize2, Send, Sparkles } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useEIAContext } from "@/contexts/EIAContext";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const moduleGuidance: Record<string, { title: string; tips: string[] }> = {
  dashboard: {
    title: "Dashboard Overview",
    tips: [
      "Review urgent alerts and pending tasks",
      "Check crisis events requiring follow-up",
      "Monitor authorization expirations",
    ],
  },
  clients: {
    title: "Client Management",
    tips: [
      "Ensure all client demographics are complete",
      "Verify insurance information and authorization status",
      "Document any changes in risk level or placement",
    ],
  },
  referrals: {
    title: "Admissions & Referrals",
    tips: [
      "Complete initial screening within 24 hours",
      "Verify Medicaid eligibility before intake",
      "Assign appropriate QMHP-CS for assessment",
    ],
  },
  crisis: {
    title: "Crisis Management",
    tips: [
      "Document all crisis events within 1 hour",
      "Complete safety assessment and intervention plan",
      "Notify guardian/LAR and update crisis plan",
    ],
  },
  services: {
    title: "Service Delivery",
    tips: [
      "Use SOAP format for all progress notes",
      "Document service code (H2017, H2014, etc.) and units",
      "Ensure notes are completed within 24 hours of service",
    ],
  },
  staff: {
    title: "Staff Management",
    tips: [
      "Verify all credentials are current",
      "Monitor caseload capacity (max 12 clients per QMHP)",
      "Schedule monthly supervision sessions",
    ],
  },
  documentation: {
    title: "EIA Documentation Center",
    tips: [
      "Select appropriate document type for the situation",
      "Provide detailed client context for better AI generation",
      "Review and customize generated documents before saving",
    ],
  },
  "sop-chapters": {
    title: "SOP Operational Procedures",
    tips: [
      "Follow step-by-step workflows for compliance",
      "Complete all required fields in each step",
      "Generate supporting documentation at each stage",
    ],
  },
  billing: {
    title: "Billing & Claims",
    tips: [
      "Submit claims within 95 days of service date",
      "Ensure service notes match billed units",
      "Follow up on denied claims within 30 days",
    ],
  },
  compliance: {
    title: "Quality Assurance & Compliance",
    tips: [
      "Complete quarterly audits for all active clients",
      "Review documentation for HHSC compliance",
      "Address any quality issues within 48 hours",
    ],
  },
  reports: {
    title: "Reports & Analytics",
    tips: [
      "Review service utilization trends monthly",
      "Monitor billing metrics and revenue cycle",
      "Track client outcomes and engagement rates",
    ],
  },
};

// Generate context-aware greeting based on module and data
function generateContextAwareGreeting(module: string, page: string, contextData: Record<string, any>): string {
  const guidance = moduleGuidance[module] || moduleGuidance.dashboard;
  
  // Dashboard-specific context
  if (module === "dashboard") {
    let greeting = `👋 Hello! I'm your AI assistant for Adolbi Care operations. I can help you with:\n\n`;
    greeting += `• Client intake procedures\n`;
    greeting += `• SOP guidance and compliance\n`;
    greeting += `• Staff scheduling optimization\n`;
    greeting += `• Document management\n`;
    greeting += `• Regulatory requirements\n\n`;
    
    if (contextData.pendingReferrals > 0) {
      greeting += `🔔 **I notice you have ${contextData.pendingReferrals} pending intake${contextData.pendingReferrals > 1 ? 's' : ''}.**`;
      if (contextData.urgentReferrals > 0) {
        greeting += ` ${contextData.urgentReferrals} ${contextData.urgentReferrals > 1 ? 'are' : 'is'} marked urgent.`;
      }
      greeting += ` Would you like me to help prioritize them based on urgency and available staff capacity?\n\n`;
    }
    
    if (contextData.urgentAlerts && contextData.urgentAlerts.length > 0) {
      greeting += `⚠️ **Urgent Alerts:**\n`;
      contextData.urgentAlerts.forEach((alert: any) => {
        greeting += `• ${alert.title}: ${alert.description}\n`;
      });
      greeting += `\n`;
    }
    
    greeting += `What would you like assistance with today?`;
    return greeting;
  }
  
  // Client Management specific context
  if (module === "clients") {
    let greeting = `👋 I'm your **Client Management Assistant**.\n\n`;
    
    if (contextData.totalClients !== undefined) {
      greeting += `**Current Status:**\n`;
      greeting += `• Total Clients: ${contextData.totalClients} (${contextData.activeClients || 0} active)\n`;
      
      if (contextData.highRiskCount > 0) {
        greeting += `• High Priority: ${contextData.highRiskCount} client${contextData.highRiskCount > 1 ? 's' : ''} need${contextData.highRiskCount === 1 ? 's' : ''} immediate attention\n`;
      }
      
      if (contextData.recentClient) {
        greeting += `• Recently viewed: ${contextData.recentClient}\n`;
      }
      
      greeting += `\n`;
    }
    
    greeting += `**Recommendations:**\n`;
    greeting += `• Review clients with overdue appointments\n`;
    greeting += `• Update insurance authorizations as needed\n`;
    greeting += `• Complete pending assessments\n\n`;
    greeting += `How can I assist with client management today?`;
    return greeting;
  }
  
  // Services specific context
  if (module === "services") {
    let greeting = `👋 I'm your **Service Delivery Assistant**.\n\n`;
    
    if (contextData.totalServices !== undefined) {
      greeting += `**Current Status:**\n`;
      greeting += `• Total Services: ${contextData.totalServices}\n`;
      greeting += `• Completed: ${contextData.completedServices || 0}\n`;
      greeting += `• Scheduled: ${contextData.scheduledServices || 0}\n`;
      
      if (contextData.pendingNotes > 0) {
        greeting += `• ⚠️ Pending Notes: ${contextData.pendingNotes} service${contextData.pendingNotes > 1 ? 's' : ''} need${contextData.pendingNotes === 1 ? 's' : ''} documentation\n`;
      }
      
      greeting += `\n`;
    }
    
    greeting += `**Recommendations:**\n`;
    greeting += `• Complete progress notes within 24 hours\n`;
    greeting += `• Use SOAP format for all documentation\n`;
    greeting += `• Verify service codes and units\n\n`;
    greeting += `How can I assist with service delivery today?`;
    return greeting;
  }
  
  // Staff Management specific context
  if (module === "staff") {
    let greeting = `👋 I'm your **Staff Management Assistant**.\n\n`;
    
    if (contextData.totalStaff !== undefined) {
      greeting += `**Current Status:**\n`;
      greeting += `• Total Staff: ${contextData.totalStaff}\n`;
      greeting += `• Therapists: ${contextData.therapistCount || 0}\n`;
      greeting += `• Case Managers: ${contextData.caseManagerCount || 0}\n`;
      
      if (contextData.credentialsExpiring > 0) {
        greeting += `• ⚠️ Credentials Expiring: ${contextData.credentialsExpiring} staff member${contextData.credentialsExpiring > 1 ? 's' : ''}\n`;
      }
      
      if (contextData.supervisionDue > 0) {
        greeting += `• 📅 Supervision Due: ${contextData.supervisionDue} session${contextData.supervisionDue > 1 ? 's' : ''}\n`;
      }
      
      greeting += `\n`;
    }
    
    greeting += `**Recommendations:**\n`;
    greeting += `• Review expiring credentials and schedule renewals
`;
    greeting += `• Schedule monthly supervision sessions
`;
    greeting += `• Monitor caseload capacity

`;
    greeting += `How can I assist with staff management today?`;
    return greeting;
  }
  
  // Billing specific context
  if (module === "billing") {
    let greeting = `👋 I'm your **Billing & Claims Assistant**.\n\n`;
    
    if (contextData.totalClaims !== undefined) {
      greeting += `**Current Status:**\n`;
      greeting += `• Total Claims: ${contextData.totalClaims}\n`;
      greeting += `• Pending: ${contextData.pendingClaims || 0}\n`;
      
      if (contextData.deniedClaims > 0) {
        greeting += `• ⚠️ Denied: ${contextData.deniedClaims} claim${contextData.deniedClaims > 1 ? 's' : ''} need${contextData.deniedClaims === 1 ? 's' : ''} attention\n`;
      }
      
      if (contextData.totalAmount) {
        greeting += `• Total Amount: $${contextData.totalAmount.toLocaleString()}\n`;
      }
      
      greeting += `\n`;
    }
    
    greeting += `**Recommendations:**\n`;
    greeting += `• Review denied claims and prepare appeals
`;
    greeting += `• Submit pending claims within 95 days
`;
    greeting += `• Verify service documentation matches billing

`;
    greeting += `How can I assist with billing today?`;
    return greeting;
  }
  
  // Compliance specific context
  if (module === "compliance") {
    let greeting = `👋 I'm your **Compliance & Quality Assurance Assistant**.

`;
    greeting += `**Current Status:**
`;
    greeting += `• Quality Score: ${contextData.qualityScore}
`;
    greeting += `• Documentation Compliance: ${contextData.documentationCompliance}%
`;
    greeting += `• Staff Certifications: ${contextData.staffCertificationsCurrent}% current
`;
    
    if (contextData.pendingReviews > 0) {
      greeting += `• 📋 Pending Reviews: ${contextData.pendingReviews}
`;
    }
    
    if (contextData.issuesIdentified > 0) {
      greeting += `• ⚠️ Issues Identified: ${contextData.issuesIdentified} requiring attention
`;
    }
    
    greeting += `
**Recommendations:**
`;
    greeting += `• Complete pending quality reviews
`;
    greeting += `• Address identified issues within 48 hours
`;
    greeting += `• Maintain HHSC compliance standards

`;
    greeting += `How can I assist with compliance today?`;
    return greeting;
  }
  
  // Reports specific context
  if (module === "reports") {
    let greeting = `👋 I'm your **Reports & Analytics Assistant**.

`;
    greeting += `**Current Status:**
`;
    greeting += `• Available Reports: ${contextData.availableReports}
`;
    greeting += `• Scheduled Reports: ${contextData.scheduledReports}
`;
    greeting += `• Recently Generated: ${contextData.recentlyGenerated}
`;
    greeting += `• Data Freshness: ${contextData.dataFreshness}
`;
    
    greeting += `
**Recommendations:**
`;
    greeting += `• Review monthly service utilization trends
`;
    greeting += `• Monitor billing metrics and revenue cycle
`;
    greeting += `• Track client outcomes and engagement

`;
    greeting += `How can I assist with reports today?`;
    return greeting;
  }
  
  // Documentation Center specific context
  if (module === "documentation") {
    let greeting = `👋 I'm your **Documentation Assistant**.

`;
    greeting += `**Current Status:**
`;
    greeting += `• Total Workflows: ${contextData.totalWorkflows}
`;
    greeting += `• Completed: ${contextData.completedWorkflows}
`;
    greeting += `• In Progress: ${contextData.inProgressWorkflows}
`;
    greeting += `• Documents Generated: ${contextData.documentsGenerated}
`;
    
    greeting += `
**Recommendations:**
`;
    greeting += `• Select appropriate document type for your needs
`;
    greeting += `• Provide detailed client context for better AI generation
`;
    greeting += `• Review and customize generated documents

`;
    greeting += `How can I assist with documentation today?`;
    return greeting;
  }
  
  // Referrals specific context
  if (module === "referrals") {
    let greeting = `👋 I'm your **Referrals & Intake Assistant**.\n\n`;
    
    if (contextData.totalReferrals !== undefined) {
      greeting += `**Current Status:**\n`;
      greeting += `• Total Referrals: ${contextData.totalReferrals}\n`;
      greeting += `• Pending: ${contextData.pendingReferrals || 0}\n`;
      
      if (contextData.urgentReferrals > 0) {
        greeting += `• ⚠️ Urgent: ${contextData.urgentReferrals} referral${contextData.urgentReferrals > 1 ? 's' : ''}\n`;
      }
      
      greeting += `\n`;
    }
    
    greeting += `**Recommendations:**\n`;
    greeting += `• Complete initial screening within 24 hours
`;
    greeting += `• Verify Medicaid eligibility before intake
`;
    greeting += `• Prioritize urgent referrals first

`;
    greeting += `How can I assist with referrals today?`;
    return greeting;
  }
  
  // Crisis Management specific context
  if (module === "crisis") {
    let greeting = `👋 I'm your **Crisis Management Assistant**.\n\n`;
    
    if (contextData.totalCrisis !== undefined) {
      greeting += `**Current Status:**\n`;
      greeting += `• Total Crisis Events: ${contextData.totalCrisis}\n`;
      greeting += `• Active: ${contextData.activeCrisis || 0}\n`;
      greeting += `• Escalated: ${contextData.escalatedCrisis || 0}\n`;
      
      if (contextData.criticalRisk > 0) {
        greeting += `• ⚠️ Critical Risk: ${contextData.criticalRisk} event${contextData.criticalRisk > 1 ? 's' : ''}\n`;
      }
      
      greeting += `\n`;
    }
    
    greeting += `**Recommendations:**\n`;
    greeting += `• Document all crisis events within 1 hour
`;
    greeting += `• Complete safety assessment immediately
`;
    greeting += `• Notify guardian/LAR of critical events

`;
    greeting += `How can I assist with crisis management today?`;
    return greeting;
  }
  
  // Workflow step context (for SOP chapters)
  if (module === "sop-chapters" && contextData.workflowStep && contextData.currentStep) {
    let greeting = `👋 I'm monitoring the **${contextData.workflowName || 'workflow'}** process.\n\n`;
    greeting += `**Progress:** Step ${contextData.currentStep} of ${contextData.totalSteps} - ${contextData.stepName}\n`;
    greeting += `**Completion:** ${contextData.completionPercentage}% complete\n`;
    
    if (contextData.requiredFieldsRemaining) {
      greeting += `**Required Fields:** ${contextData.requiredFieldsRemaining} remaining\n`;
    }
    
    greeting += `\n**${contextData.stepName} recommendations:**\n`;
    guidance.tips.forEach((tip, i) => {
      greeting += `• ${tip}\n`;
    });
    
    greeting += `\nHow can I help with this step?`;
    return greeting;
  }
  
  // Default context with basic info
  let greeting = `👋 Hi! I'm your EIA assistant. I see you're in **${page}**.\n\n`;
  
  if (contextData && Object.keys(contextData).length > 0) {
    greeting += `**Current Context:**\n`;
    if (contextData.totalClients) greeting += `• Total Clients: ${contextData.totalClients}\n`;
    if (contextData.activeClients) greeting += `• Active Clients: ${contextData.activeClients}\n`;
    if (contextData.highRiskCount) greeting += `• High Risk: ${contextData.highRiskCount}\n`;
    if (contextData.recentClient) greeting += `• Viewing: ${contextData.recentClient}\n`;
    greeting += `\n`;
  }
  
  greeting += `**${guidance.title}**\n\n`;
  greeting += `**Quick Tips:**\n`;
  guidance.tips.forEach((tip, i) => {
    greeting += `${i + 1}. ${tip}\n`;
  });
  greeting += `\nHow can I help you today?`;
  
  return greeting;
}

export default function EIABot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { currentModule, currentPage, contextData } = useEIAContext();

  const chatMutation = trpc.eia.chat.useMutation({
    onSuccess: (data) => {
      setMessages((prev) => [...prev, { role: "assistant", content: data.response }]);
    },
  });

  // Track previous module/page to prevent duplicate messages
  const prevModuleRef = useRef<string>("");
  const prevPageRef = useRef<string>("");
  
  useEffect(() => {
    if (isOpen) {
      const greeting = generateContextAwareGreeting(currentModule, currentPage, contextData);
      const guidance = moduleGuidance[currentModule] || moduleGuidance.dashboard;
      
      // Check if module or page actually changed
      const moduleChanged = prevModuleRef.current !== currentModule;
      const pageChanged = prevPageRef.current !== currentPage;
      
      if (moduleChanged || pageChanged) {
        // Add context update message if messages exist and page/context changed
        if (messages.length > 0) {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: `📍 You've navigated to **${currentPage}**. ${guidance.tips[0]}`,
            },
          ]);
        } else {
          // Initial greeting with full context
          setMessages([{ role: "assistant", content: greeting }]);
        }
        
        // Update refs
        prevModuleRef.current = currentModule;
        prevPageRef.current = currentPage;
      }
    }
  }, [currentModule, currentPage, isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = inputMessage.trim();
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setInputMessage("");

    await chatMutation.mutateAsync({
      message: userMessage,
      context: {
        module: currentModule,
        page: currentPage,
        ...contextData,
      },
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 z-50"
        aria-label="Open EIA"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    );
  }

  if (isMinimized) {
    return (
      <Card className="fixed bottom-6 right-6 w-80 bg-purple-600 text-white shadow-xl z-50">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            <span className="font-semibold">EIA</span>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="ghost"
              className="text-white hover:bg-purple-700 h-8 w-8 p-0"
              onClick={() => setIsMinimized(false)}
            >
              <Minimize2 className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="text-white hover:bg-purple-700 h-8 w-8 p-0"
              onClick={() => setIsOpen(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 w-96 h-[600px] shadow-2xl flex flex-col z-50">
      <div className="bg-purple-600 text-white p-4 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          <div>
            <h3 className="font-semibold">EIA</h3>
            <p className="text-xs opacity-90">{currentPage}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="ghost"
            className="text-white hover:bg-purple-700 h-8 w-8 p-0"
            onClick={() => setIsMinimized(true)}
          >
            <Minimize2 className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="text-white hover:bg-purple-700 h-8 w-8 p-0"
            onClick={() => setIsOpen(false)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                msg.role === "user"
                  ? "bg-purple-600 text-white"
                  : "bg-white border border-gray-200 text-gray-900"
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}
        {chatMutation.isPending && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-200 bg-white rounded-b-lg">
        <div className="flex gap-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything..."
            className="flex-1"
            disabled={chatMutation.isPending}
          />
          <Button
            onClick={handleSend}
            disabled={!inputMessage.trim() || chatMutation.isPending}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          💡 Tip: I'm context-aware and can help with {currentPage.toLowerCase()} tasks
        </p>
      </div>
    </Card>
  );
}

