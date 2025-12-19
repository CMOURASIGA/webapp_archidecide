
import { GoogleGenAI } from "@google/genai";
import { GeminiConfig, Project, ClientProfile, PropertyInfo, TemplateInput } from "../types/project";

// Always initialize GoogleGenAI with the API key from environment variables.
// Per guidelines, create a new instance right before making an API call.
const getClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const geminiService = {
  generateGuidelines: async (config: GeminiConfig, project: Project) => {
    const ai = getClient();
    const profile = project.clientProfile;
    const info = project.propertyInfo;

    const prompt = `Você é um consultor sênior de arquitetura. Com base nos dados abaixo, gere diretrizes gerais de projeto que ajudem o arquiteto a tomar decisões de layout, materiais e funcionalidade.
    
    Perfil do Cliente: ${JSON.stringify(profile)}
    Informações do Imóvel: ${JSON.stringify(info)}
    
    O texto deve ser profissional, estruturado e inspirador. Use bullet points e seções claras.`;

    // Architectural analysis is a complex task, using 'gemini-3-pro-preview' by default.
    const response = await ai.models.generateContent({
      model: config.model || 'gemini-3-pro-preview',
      contents: prompt,
    });

    // Directly access the .text property from GenerateContentResponse.
    return response.text || "";
  },

  generateComparativeAnalysis: async (config: GeminiConfig, project: Project) => {
    const ai = getClient();
    const { planA, planB, comparison } = project;

    const prompt = `Você é um arquiteto analista. Compare duas alternativas de planta para o mesmo projeto residencial.
    
    Alternativa A: ${JSON.stringify(planA)}
    Alternativa B: ${JSON.stringify(planB)}
    Critérios de Foco: ${JSON.stringify(comparison?.criterios)}
    
    Analise os pontos fortes e fracos de cada uma em relação às necessidades do cliente (${JSON.stringify(project.clientProfile)}). Recomende qual alternativa é mais equilibrada e por quê.`;

    const response = await ai.models.generateContent({
      model: config.model || 'gemini-3-pro-preview',
      contents: prompt,
    });

    return response.text || "";
  },

  generateTemplateRecommendations: async (config: GeminiConfig, templateInput: TemplateInput, profile: ClientProfile | null) => {
    const ai = getClient();

    const prompt = `Gere recomendações detalhadas para o ambiente: ${templateInput.templateType}.
    Dados de entrada: Tamanho ${templateInput.tamanhoAproximado}, Estilo ${templateInput.estilo}, Orçamento ${templateInput.orcamento}, Preferências ${templateInput.preferencias}.
    Contexto do cliente: ${JSON.stringify(profile)}.
    
    Responda em 4 partes bem definidas:
    1. Conceito do Ambiente
    2. Recomendações Práticas
    3. Pontos de Atenção (erros comuns)
    4. Sugestões de Materiais/Mobiliário por faixa de preço.`;

    const response = await ai.models.generateContent({
      model: config.model || 'gemini-3-pro-preview',
      contents: prompt,
    });

    return response.text || "";
  }
};
