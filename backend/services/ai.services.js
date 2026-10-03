import { GoogleGenAI } from "@google/genai";
import { ApiError } from "../utils/ApiError";
import { model } from "mongoose";
import { config } from "dotenv";

let client = null;

const getClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new ApiError(
            503, 
            "Gemini API key is not configured, Add GEMINI_API_KEY to the backend .env file."
        );
    }
    if (!client) client = new GoogleGenAI({ apiKey });
    return client;
};

const MODEL = () => process.env.GEMINI_MODEL || "gemini-2.5-flash";

export const isAIConfigured = () => Boolean(process.env.GEMINI_API_KEY);


const generateJSON = async (prompt, schema) => {
    const ai = getClient();
    try {
        const response = await ai.models.generateContent({
            model: MODEL(),
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema,
                temperature: 0.6,
            },
        });
        return JSON.parse(response.text);
    } catch (err) {
        console.error("Gemini JSON error:", err?.message || err);
        throw new ApiError(502, "AI request failed. Please try again in a moment.");
    }
};

const generateText = async (prompt, temperature = 0.7) => {
    const ai = getClient();
    try {
        const response = await ai.model.generateContent({
            model: MODEL(),
            contents: prompt,
            config: { temperature },
        });
        return response.text.trim();
    } catch (err) {
        console.error("Gemini text error:", err?.message || err);
        throw new ApiError(502, "AI request failed. Please try again in a moment.");
    }
};

