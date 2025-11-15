
import { GoogleGenAI, Type } from "@google/genai";
import type { Lead, Property } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const generateGuestResponse = async (guestQuery: string, propertyName: string): Promise<string> => {
  if (!API_KEY) return "AI service is currently unavailable.";
  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `A guest at "${propertyName}" asked: "${guestQuery}". Respond in a warm, helpful, and personal tone. Avoid sounding like a robot.`,
        config: {
            systemInstruction: "You are a helpful and friendly property manager assistant for a vacation rental company called Peoplestay. Your goal is to provide excellent guest service with a personal touch."
        }
    });
    return response.text;
  } catch (error) {
    console.error("Error generating guest response:", error);
    return "I'm having trouble connecting to my assistant right now. Please try again later.";
  }
};

export const suggestPricing = async (property: Property, marketContext: string): Promise<any> => {
    if (!API_KEY) return { error: "AI service is currently unavailable." };
    const prompt = `Analyze the pricing for the property "${property.name}" located at ${property.address}. 
    Current Price: $${property.currentPrice}. Current Occupancy: ${property.occupancy}%.
    Market Context: ${marketContext}.
    Based on this, provide a suggested price, a confidence score (low, medium, high), and a brief reasoning.
    Also provide a projected price for the next 7 days.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        suggestedPrice: { type: Type.NUMBER },
                        confidence: { type: Type.STRING },
                        reasoning: { type: Type.STRING },
                        priceForecast: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    day: { type: Type.STRING },
                                    price: { type: Type.NUMBER },
                                }
                            }
                        }
                    }
                }
            }
        });
        
        return JSON.parse(response.text);

    } catch (error) {
        console.error("Error suggesting pricing:", error);
        return { error: "Failed to generate pricing suggestions." };
    }
};

export const generateLeadFollowUp = async (lead: Lead): Promise<string> => {
  if (!API_KEY) return "AI service is currently unavailable.";
  const prompt = `Generate a personalized, friendly, and professional follow-up email for a new lead.
  Lead Name: ${lead.name}
  Source: ${lead.source}
  Inquiry Date: ${lead.inquiryDate}
  The goal is to encourage them to book a stay with Peoplestay. Mention our unique properties and personalized service. Keep it concise and engaging.
  `;
  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            systemInstruction: "You are a sales assistant for Peoplestay, a premium vacation rental company. Your tone should be welcoming and persuasive, but not pushy."
        }
    });
    return response.text;
  } catch (error) {
    console.error("Error generating lead follow-up:", error);
    return "Failed to generate follow-up email.";
  }
};
