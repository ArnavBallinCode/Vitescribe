import { GoogleGenAI, Type, Schema } from "@google/genai";
import { HealthAnalysis } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Define the response schema for structured output
const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    summary: { type: Type.STRING, description: "A concise executive summary of the document." },
    patientContext: { type: Type.STRING, description: "Inferred context (e.g., 'Adult Male', 'Geriatric', or 'General')." },
    metrics: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          value: { type: Type.STRING },
          unit: { type: Type.STRING },
          status: { type: Type.STRING, enum: ['Normal', 'High', 'Low', 'Critical', 'Unknown'] },
          range: { type: Type.STRING },
          insight: { type: Type.STRING, description: "A one-sentence plain English explanation of this specific metric." }
        }
      }
    },
    simplifiedExplanation: { type: Type.STRING, description: "An 'Explain Like I'm 5' paragraph breaking down the medical findings." },
    actionPlan: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          priority: { type: Type.STRING, enum: ['High', 'Medium', 'Low'] },
          category: { type: Type.STRING, enum: ['Lifestyle', 'Diet', 'Follow-up', 'Medication'] }
        }
      }
    },
    reasoningTrace: {
      type: Type.ARRAY,
      description: "Show your chain of thought. How did you arrive at these conclusions?",
      items: {
        type: Type.OBJECT,
        properties: {
          step: { type: Type.STRING },
          detail: { type: Type.STRING }
        }
      }
    },
    potentialRisks: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Any immediate red flags, interactions, or urgent warnings."
    }
  },
  required: ["summary", "metrics", "simplifiedExplanation", "actionPlan", "reasoningTrace", "potentialRisks"]
};

export const analyzeMedicalDocument = async (base64Data: string, mimeType: string): Promise<HealthAnalysis> => {
  try {
    // Create a timeout promise to prevent infinite loading
    const timeoutMs = 60000; // 60 seconds
    const timeoutPromise = new Promise<never>((_, reject) => 
      setTimeout(() => reject(new Error(`Analysis timed out after ${timeoutMs/1000}s. Please try a clearer or smaller document.`)), timeoutMs)
    );

    const apiCall = ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType
            }
          },
          {
            text: `Analyze the attached medical document (Lab report, Prescription, X-Ray report, or Photograph of medication).
            
            Perform the following:
            1. Extract key vital metrics and lab values.
            2. Compare them against standard reference ranges if not explicitly stated in the doc.
            3. Explain the findings in simple, non-medical terms.
            4. Identify actionable next steps (Diet, Lifestyle, etc.).
            5. Provide a chain-of-thought trace of how you analyzed this.
            
            IMPORTANT: If the document is not medical related, return a summary stating that this is not a valid medical document.`
          }
        ]
      },
      config: {
        systemInstruction: "You are VitalScribe, a world-class medical analysis assistant. Your goal is to provide plain-English explanations, safety checks, and actionable wellness insights.",
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        temperature: 0.1
      }
    });

    // Race against timeout
    const response = await Promise.race([apiCall, timeoutPromise]);

    if (!response.text) {
      throw new Error("The AI returned an empty response. Please try again.");
    }

    const data = JSON.parse(response.text) as HealthAnalysis;
    return data;

  } catch (error: any) {
    console.error("Gemini Analysis Error:", error);
    // Return a more user-friendly error message
    throw new Error(error.message || "Failed to analyze document. Please check your internet connection.");
  }
};

export const chatWithContext = async (
  history: { role: string, parts: { text: string }[] }[],
  newMessage: string,
  docContext?: string
): Promise<string> => {
  try {
    const chat = ai.chats.create({
      model: 'gemini-3-pro-preview',
      config: {
        systemInstruction: `You are VitalScribe. You have already analyzed a medical document. 
        The context of the analysis is: ${docContext ? docContext : 'No document context'}.
        Answer the user's follow-up questions clearly, empathetically, and accurately.
        Always remind the user to consult a doctor for serious issues.`
      },
      history: history.map(h => ({
        role: h.role,
        parts: h.parts
      }))
    });

    const result = await chat.sendMessage({ message: newMessage });
    return result.text || "I couldn't generate a response.";
  } catch (error) {
    console.error("Chat Error:", error);
    return "I'm having trouble connecting to the medical insights engine right now.";
  }
};