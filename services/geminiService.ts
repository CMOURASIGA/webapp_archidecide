
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
    
    const prompt = `Você é um consultor sênior de arquitetura e estratégia imobiliária. 
    Gere diretrizes conceituais para este projeto.
    
    DADOS DO PROJETO:
    Perfil: ${JSON.stringify(project.clientProfile)}
    Imóvel: ${JSON.stringify(project.propertyInfo)}
    
    ESTILO DE ESCRITA:
    - Editorial de alto padrão (Luxo/Estratégico).
    - Use títulos claros (Conceito, Fluxos, Materiais, Iluminação).
    - NÃO USE markdown exagerado como "###" ou muitos "**", apenas texto limpo e direto.
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
    
    const prompt = `Você é um estrategista de arquitetura comparando duas variações de layout.
    
    CONTEXTO:
    Alpha: ${JSON.stringify(project.planA)}
    Beta: ${JSON.stringify(project.planB)}
    Critérios de Sucesso: ${JSON.stringify(project.comparison?.criterios)}
    
    INSTRUÇÕES CRÍTICAS PARA O JSON:
    - No campo "motivo", escreva um parágrafo executivo sem markdown.
    - Nas análises detalhadas, seja técnico e isento.
    - NÃO use caracteres de markdown (#, *, ` + "`" + `) dentro das strings do JSON.
    - Mantenha um tom profissional de consultoria.`;

    const response = await ai.models.generateContent({
      model: config.model || 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recomendacao: {
              type: Type.OBJECT,
              properties: {
                planta: { type: Type.STRING, description: "Alpha ou Beta" },
                motivo: { type: Type.STRING, description: "Justificativa sem markdown." }
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
      contents: `Gere recomendações técnicas de design de interiores: ${templateInput.templateType}. 
      Contexto do Cliente: ${JSON.stringify(profile)}.
      Estilo: ${templateInput.estilo}. 
      Orçamento: ${templateInput.orcamento}.
      Responda de forma técnica, sem markdown de títulos exagerados.`,
    });
    return response.text || "";
  }
};
