
import { GoogleGenAI } from "@google/genai";
import { GeminiConfig, Project, ClientProfile, TemplateInput } from "../types/project.ts";

export const geminiService = {
  generateGuidelines: async (config: GeminiConfig, project: Project) => {
    // Strictly following the rule: Must use new GoogleGenAI({ apiKey: process.env.API_KEY })
    // @ts-ignore
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `Você é um consultor sênior de arquitetura. Com base nos dados abaixo, gere diretrizes gerais de projeto.
    Perfil: ${JSON.stringify(project.clientProfile)}
    Imóvel: ${JSON.stringify(project.propertyInfo)}
    Responda em Português com seções claras, foco técnico e estético.`;

    const response = await ai.models.generateContent({
      model: config.model || 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "";
  },

  generateComparativeAnalysis: async (config: GeminiConfig, project: Project) => {
    // Strictly following the rule: Must use new GoogleGenAI({ apiKey: process.env.API_KEY })
    // @ts-ignore
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `Compare estas duas plantas residenciais.
    Planta A: ${JSON.stringify(project.planA)}
    Planta B: ${JSON.stringify(project.planB)}
    Critérios: ${JSON.stringify(project.comparison?.criterios)}
    Seja crítico e profissional em Português, aponte qual a melhor solução técnica baseada nas necessidades do cliente.`;

    const response = await ai.models.generateContent({
      model: config.model || 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "";
  },

  generateTemplateRecommendations: async (config: GeminiConfig, templateInput: TemplateInput, profile: ClientProfile | null) => {
    // Strictly following the rule: Must use new GoogleGenAI({ apiKey: process.env.API_KEY })
    // @ts-ignore
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const prompt = `Gere recomendações para o ambiente: ${templateInput.templateType}.
    Entrada: ${JSON.stringify(templateInput)}.
    Contexto do Cliente: ${JSON.stringify(profile)}.
    Responda em Português de forma estruturada.`;

    const response = await ai.models.generateContent({
      model: config.model || 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "";
  }
};
