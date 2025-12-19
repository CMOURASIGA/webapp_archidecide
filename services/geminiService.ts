
import { GoogleGenAI, Type } from "@google/genai";
import { GeminiConfig, Project, ClientProfile, TemplateInput } from "../types/project.ts";

/**
 * Serviço de integração com Google Gemini.
 * Focado em gerar dados estruturados para decisões arquitetônicas e relatórios editoriais de alto padrão.
 */
export const geminiService = {
  generateGuidelines: async (config: GeminiConfig, project: Project) => {
    // @ts-ignore
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `Você é um consultor sênior de arquitetura. Gere diretrizes conceituais.
    Perfil: ${JSON.stringify(project.clientProfile)}
    Imóvel: ${JSON.stringify(project.propertyInfo)}
    
    REGRAS DE ESCRITA:
    - Use títulos claros para: Conceito, Decisões de Layout, Prioridades Técnicas e Pontos de Atenção.
    - Seja conciso (bullets). Estilo editorial de luxo. Máximo 4 itens por seção.
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
      contents: `Você é um estrategista em viabilidade arquitetônica. Compare criticamente a Planta Alpha e a Planta Beta.
      Alpha: ${JSON.stringify(project.planA)}
      Beta: ${JSON.stringify(project.planB)}
      Critérios: ${JSON.stringify(project.comparison?.criterios)}
      
      FOCO DO RELATÓRIO:
      - Recomendação clara.
      - Análise de riscos e como mitigá-los.
      - Texto curto e executivo para clientes de alto padrão.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recomendacao: {
              type: Type.OBJECT,
              properties: {
                planta: { type: Type.STRING, description: "Alpha ou Beta" },
                motivo: { type: Type.STRING, description: "Justificativa executiva de no máximo 3 linhas." }
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
                  analiseAlpha: { type: Type.STRING, description: "Análise concisa (max 3 linhas)." },
                  analiseBeta: { type: Type.STRING, description: "Análise concisa (max 3 linhas)." },
                  conclusao: { type: Type.STRING, description: "Veredito rápido." }
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
      contents: `Recomendações técnicas: ${templateInput.templateType}. Perfil: ${JSON.stringify(profile)}.`,
    });
    return response.text || "";
  }
};
