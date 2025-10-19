import { Check } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface WorkflowStep {
  id: number;
  name: string;
  completed: boolean;
}

interface WorkflowProgressProps {
  title: string;
  description: string;
  steps: WorkflowStep[];
  currentStep: number;
}

export default function WorkflowProgress({ 
  title, 
  description, 
  steps, 
  currentStep 
}: WorkflowProgressProps) {
  const completedCount = steps.filter(s => s.completed).length;
  const completionPercentage = Math.round((completedCount / steps.length) * 100);

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">{completionPercentage}%</div>
            <div className="text-sm text-gray-600">Complete</div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        {/* Steps List */}
        <div className="space-y-3">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                step.id === currentStep
                  ? "bg-blue-50 border-2 border-blue-500"
                  : step.completed
                  ? "bg-green-50 border border-green-200"
                  : "bg-gray-50 border border-gray-200"
              }`}
            >
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                  step.completed
                    ? "bg-green-500 text-white"
                    : step.id === currentStep
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300 text-gray-600"
                }`}
              >
                {step.completed ? <Check className="w-5 h-5" /> : step.id}
              </div>
              <div className="flex-1">
                <div className={`font-semibold ${
                  step.id === currentStep ? "text-blue-700" : 
                  step.completed ? "text-green-700" : "text-gray-700"
                }`}>
                  {step.name}
                </div>
                {step.id === currentStep && (
                  <div className="text-sm text-blue-600 font-medium">In Progress</div>
                )}
                {step.completed && (
                  <div className="text-sm text-green-600">✓ Completed</div>
                )}
                {!step.completed && step.id !== currentStep && (
                  <div className="text-sm text-gray-500">Pending</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

