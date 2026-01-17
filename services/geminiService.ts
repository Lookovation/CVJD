
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, InputData } from "../types";

export const analyzeAlignment = async (data: InputData): Promise<AnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const systemInstruction = `
    You are the CV-JD ALIGNMENT TOOL v2.0. Your goal is to match CVs to job descriptions HONESTLY.
    You catch false positives. You don't let keyword overlap mask qualification gaps.

    PHASE 1: HARD REQUIREMENT EXTRACTION (Internal)
    Scan for signals: "Required", "Must have", "Minimum qualifications", Mandatory Degree, Years in specific function, non-negotiable tech skills.
    Classify as HARD (ATS filters) or SOFT (Preferred/Nice-to-have).

    PHASE 2: SCORING WITH PENALTIES (Internal)
    Base Score:
    - Direct experience: +20
    - Domain/industry: +15
    - Technical skills: +15
    - Scale/scope: +10
    - Leadership level: +10
    - Soft skills: +10
    - Nice-to-haves: +5 each (max 20)

    PENALTY RULES (MANDATORY):
    - 0 gaps: 100% cap
    - 1 gap: 75% cap
    - 2 gaps: 65% cap
    - 3+ gaps: 50% cap

    CRITICAL RULES:
    - Keyword similarity is NOT qualification match.
    - "AI Product Strategy" is NOT "Software Product Management".
    - "Evaluated vendors" is NOT "Hands-on engineering".
    - "Led team" is NOT "Wrote code".
    - Domain expertise cannot compensate for missing technical prerequisites.
    - Engineering degree required means a gap if they have a non-engineering degree.

    OUTPUT: Provide a JSON response following the specified schema.
  `;

  const prompt = `
    JOB DESCRIPTION:
    ${data.jdText}

    CANDIDATE CV:
    ${data.cvText || "See attached image for CV content."}
  `;

  const parts: any[] = [{ text: prompt }];
  
  if (data.cvImageBase64 && data.cvImageMimeType) {
    parts.push({
      inlineData: {
        data: data.cvImageBase64,
        mimeType: data.cvImageMimeType,
      },
    });
  }

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: { parts },
    config: {
      systemInstruction,
      thinkingConfig: { thinkingBudget: 32768 },
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER },
          classification: { type: Type.STRING },
          summary: { type: Type.STRING },
          hardRequirementGapsCount: { type: Type.NUMBER },
          requirements: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                label: { type: Type.STRING },
                type: { type: Type.STRING, enum: ['HARD', 'SOFT'] },
                status: { type: Type.STRING, enum: ['MET', 'UNMET', 'PARTIAL'] },
                explanation: { type: Type.STRING },
              },
              required: ['label', 'type', 'status', 'explanation']
            }
          },
          gaps: { type: Type.ARRAY, items: { type: Type.STRING } },
          strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
          recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ['score', 'classification', 'summary', 'hardRequirementGapsCount', 'requirements', 'gaps', 'strengths', 'recommendations']
      }
    },
  });

  try {
    const result = JSON.parse(response.text);
    return result as AnalysisResult;
  } catch (error) {
    console.error("Failed to parse Gemini response:", error);
    throw new Error("Alignment analysis failed to produce valid data.");
  }
};
