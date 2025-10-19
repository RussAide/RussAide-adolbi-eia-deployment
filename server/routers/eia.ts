import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { invokeLLM } from "../_core/llm";

export const eiaRouter = router({
  generateDocument: protectedProcedure
    .input(
      z.object({
        documentType: z.enum([
          "intake_assessment",
          "progress_note",
          "treatment_plan",
          "incident_report",
          "discharge_summary",
          "crisis_plan",
          "service_note",
        ]),
        clientData: z.object({
          name: z.string().optional(),
          age: z.number().optional(),
          diagnosis: z.string().optional(),
          serviceType: z.string().optional(),
        }).optional(),
        additionalInfo: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { documentType, clientData, additionalInfo } = input;

      // Build the prompt based on document type
      const prompts: Record<string, string> = {
        intake_assessment: `Generate a comprehensive intake assessment for a behavioral health client with the following information:
${clientData ? `Client Name: ${clientData.name || "Not provided"}
Age: ${clientData.age || "Not provided"}
Diagnosis: ${clientData.diagnosis || "Not provided"}` : ""}
${additionalInfo ? `Additional Information: ${additionalInfo}` : ""}

Please include:
1. Presenting Problem
2. Mental Status Examination
3. Risk Assessment
4. Diagnostic Impression
5. Treatment Recommendations

Format the document professionally with clear sections.`,

        progress_note: `Generate a SOAP (Subjective, Objective, Assessment, Plan) progress note for a behavioral health session:
${clientData ? `Client: ${clientData.name || "Client"}
Service Type: ${clientData.serviceType || "MHRS"}` : ""}
${additionalInfo ? `Session Details: ${additionalInfo}` : ""}

Include:
- Subjective: Client's reported mood, concerns, progress
- Objective: Observed behavior, appearance, affect
- Assessment: Clinical impression, progress toward goals
- Plan: Next steps, interventions, follow-up`,

        treatment_plan: `Generate a comprehensive treatment plan for:
${clientData ? `Client: ${clientData.name || "Client"}
Diagnosis: ${clientData.diagnosis || "Not specified"}` : ""}
${additionalInfo ? `Background: ${additionalInfo}` : ""}

Include:
1. Problem Statement
2. Long-term Goal
3. Short-term Objectives (3-4 measurable objectives)
4. Interventions and Services
5. Target Dates
6. Responsible Staff`,

        incident_report: `Generate a detailed incident report:
${clientData ? `Client Involved: ${clientData.name || "Client"}` : ""}
${additionalInfo ? `Incident Details: ${additionalInfo}` : ""}

Include:
1. Date, Time, and Location
2. Description of Incident
3. Individuals Involved
4. Actions Taken
5. Outcome
6. Follow-up Required`,

        discharge_summary: `Generate a discharge summary:
${clientData ? `Client: ${clientData.name || "Client"}
Diagnosis: ${clientData.diagnosis || "Not specified"}` : ""}
${additionalInfo ? `Treatment Summary: ${additionalInfo}` : ""}

Include:
1. Reason for Discharge
2. Treatment Summary
3. Progress Achieved
4. Current Status
5. Aftercare Recommendations
6. Follow-up Plan`,

        crisis_plan: `Generate a crisis safety plan:
${clientData ? `Client: ${clientData.name || "Client"}` : ""}
${additionalInfo ? `Crisis History: ${additionalInfo}` : ""}

Include:
1. Warning Signs
2. Coping Strategies
3. Support Contacts
4. Emergency Resources
5. Professional Contacts
6. Making Environment Safe`,

        service_note: `Generate a service delivery note:
${clientData ? `Client: ${clientData.name || "Client"}
Service: ${clientData.serviceType || "MHRS"}` : ""}
${additionalInfo ? `Service Details: ${additionalInfo}` : ""}

Include:
1. Service Date and Duration
2. Service Location
3. Activities and Interventions
4. Client Response
5. Progress Toward Goals
6. Next Session Plan`,
      };

      const prompt = prompts[documentType] || "Generate a professional behavioral health document.";

      try {
        // Call LLM to generate the document
        const response = await invokeLLM({
          messages: [
            {
              role: "system",
              content: "You are an expert behavioral health documentation specialist. Generate professional, HIPAA-compliant clinical documents that meet regulatory standards. Use clear, objective language and proper clinical terminology.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
        });

        const messageContent = response.choices[0]?.message?.content;
        const generatedContent = typeof messageContent === 'string' ? messageContent : "Error generating document";

        return {
          success: true,
          documentType,
          content: generatedContent,
          generatedAt: new Date(),
          generatedBy: ctx.user.name || ctx.user.email,
        };
      } catch (error) {
        console.error("Error generating document:", error);
        throw new Error("Failed to generate document. Please try again.");
      }
    }),

  chat: protectedProcedure
    .input(
      z.object({
        message: z.string(),
        context: z.record(z.string(), z.any()).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { message, context } = input;

      const systemPrompt = `You are EIA (Executive Intelligence Assistant), an AI assistant for Adolbi Care's MHRS/MHTCM behavioral health platform.

Current Context:
- Module: ${context?.module || "unknown"}
- Page: ${context?.page || "unknown"}

You provide expert guidance on:
- MHRS (Mental Health Rehabilitative Services) and MHTCM (Mental Health Targeted Case Management)
- Clinical documentation and compliance
- HHSC regulations and best practices
- Service codes (H2017, H2014, H2011, H0034, MHTCM)
- Crisis management and safety planning
- Quality assurance and audit requirements

Provide concise, actionable responses tailored to the user's current context.`;

      const response = await invokeLLM({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message },
        ],
      });

      const content = response.choices[0]?.message?.content || "I apologize, but I couldn't generate a response. Please try again.";
      const responseText = typeof content === 'string' ? content : String(content);

      return { response: responseText };
    }),

  chatAssistant: protectedProcedure
    .input(
      z.object({
        message: z.string(),
        context: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { message, context } = input;

      try {
        const response = await invokeLLM({
          messages: [
            {
              role: "system",
              content: `You are the Executive Intelligence Assistant (EIA) for Adolbi Care, a behavioral health platform. You help staff with:
- Clinical documentation guidance
- MHRS/MHTCM service protocols
- Compliance and regulatory questions
- Workflow assistance
- Best practices for behavioral health services

Provide clear, professional, and actionable guidance. Reference specific procedures when relevant.`,
            },
            ...(context ? [{ role: "system" as const, content: `Context: ${context}` }] : []),
            {
              role: "user",
              content: message,
            },
          ],
        });

        const messageContent = response.choices[0]?.message?.content;
        const reply = typeof messageContent === 'string' ? messageContent : "I'm sorry, I couldn't process that request.";

        return {
          success: true,
          reply,
          timestamp: new Date(),
        };
      } catch (error) {
        console.error("Error in chat assistant:", error);
        throw new Error("Failed to get response from EIA. Please try again.");
      }
    }),
});

