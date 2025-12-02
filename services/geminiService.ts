import { GoogleGenAI } from "@google/genai";
import { DayPlan } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const askGemini = async (prompt: string, context: DayPlan[]): Promise<string> => {
  try {
    const contextStr = JSON.stringify(context);
    const fullPrompt = `
      You are a helpful travel assistant for a trip to Shanghai.
      Here is the user's current itinerary JSON: ${contextStr}

      User Question: ${prompt}

      Provide a concise, helpful answer. If suggesting locations, include addresses if known.
      Keep the tone friendly and practical.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
    });

    return response.text || "Sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Unable to contact travel assistant. Please check your connection.";
  }
};

export const autoFormatItinerary = async (rawText: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Parse the following unstructured travel notes into a JSON array of objects fitting this schema: { time: string, title: string, type: 'activity'|'food'|'transport', address: string, description: string }. Raw text: ${rawText}. Return ONLY JSON.`,
            config: {
                responseMimeType: 'application/json'
            }
        });
        return response.text || "[]";
    } catch (e) {
        return "[]";
    }
}