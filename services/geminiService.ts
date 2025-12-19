
import { GoogleGenAI, Type } from "@google/genai";
import { GeminiConfig, Project, ClientProfile, TemplateInput } from "../types/project.ts";

/**
 * Serviço de integração com Google Gemini.
 * Focado em gerar dados estruturados para decisões arquitetônicas.
 */
export const geminiService = {
  generateGuidelines: async (config: GeminiConfig, project: Project) => {
    // @ts-ignore
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `Você é um consultor sênior de arquitetura. Gere diretrizes conceituais.
    Perfil: ${JSON.stringify(project.clientProfile)}
    Imóvel: ${JSON.stringify(project.propertyInfo)}
    
    REGRAS DE ESCRITA:
    - Seja conciso e direto ao ponto.
    - Responda em Português (Brasil).`;

    const response = await ai.models.generateContent({
      model: config.model || 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "";
  },

  generateComparativeAnalysis: async (config: GeminiConfig, project: Project) => {
    // @ts-ignore
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: config.model || 'gemini-3-flash-preview',
      contents: `Compare criticamente a Planta Alpha e a Planta Beta para este cliente.
      Alpha: ${JSON.stringify(project.planA)}
      Beta: ${JSON.stringify(project.planB)}
      Critérios: ${JSON.stringify(project.comparison?.criterios)}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recomendacao: {
              type: Type.OBJECT,
              properties: {
                planta: { type: Type.STRING, description: "Alpha ou Beta" },
                motivo: { type: Type.STRING, description: "Explicação curta do porquê" }
              },
              required: ["planta", "motivo"]
            },
            placar: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  criterio: { type: Type.STRING },
                  vencedora: { type: Type.STRING, description: "Alpha, Beta ou Empate" }
                },
                required: ["criterio", "vencedora"]
              }
            },
            detalhes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  criterio: { type: Type.STRING },
                  analiseAlpha: { type: Type.STRING },
                  analiseBeta: { type: Type.STRING },
                  conclusao: { type: Type.STRING }
                },
                required: ["criterio", "analiseAlpha", "analiseBeta", "conclusao"]
              }
            },
            riscosMitigacoes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  risco: { type: Type.STRING },
                  ajusteSugerido: { type: Type.STRING }
                },
                required: ["risco", "ajusteSugerido"]
              }
            }
          },
          required: ["recomendacao", "placar", "detalhes", "riscosMitigacoes"]
        }
      }
    });
    return response.text || "";
  },

  generateTemplateRecommendations: async (config: GeminiConfig, templateInput: TemplateInput, profile: ClientProfile | null) => {
    // @ts-ignore
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: config.model || 'gemini-3-flash-preview',
      contents: `Recomendações técnicas: ${templateInput.templateType}. Entrada: ${JSON.stringify(templateInput)}.`,
    });
    return response.text || "";
  }
};
