
import { GoogleGenAI } from "@google/genai";
import { GeminiConfig, Project, ClientProfile, TemplateInput } from "../types/project.ts";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey || apiKey === "") {
    throw new Error("API Key não configurada. Por favor, clique no botão 'Ativar Gemini' na barra lateral esquerda antes de continuar.");
  }
  return new GoogleGenAI({ apiKey });
};

export const geminiService = {
  generateGuidelines: async (config: GeminiConfig, project: Project) => {
    try {
      const ai = getClient();
      const profile = project.clientProfile;
      const info = project.propertyInfo;

      const prompt = `Você é um consultor sênior de arquitetura. Com base nos dados abaixo, gere diretrizes gerais de projeto que ajudem o arquiteto a tomar decisões de layout, materiais e funcionalidade.
      
      Perfil do Cliente: ${JSON.stringify(profile)}
      Informações do Imóvel: ${JSON.stringify(info)}
      
      O texto deve ser profissional, estruturado e inspirador. Use bullet points e seções claras.`;

      const response = await ai.models.generateContent({
        model: config.model || 'gemini-3-flash-preview',
        contents: prompt,
      });

      return response.text || "Não foi possível gerar as diretrizes.";
    } catch (error: any) {
      console.error("Gemini Error:", error);
      throw new Error(error.message || "Erro desconhecido na API do Gemini.");
    }
  },

  generateComparativeAnalysis: async (config: GeminiConfig, project: Project) => {
    try {
      const ai = getClient();
      const { planA, planB, comparison } = project;

      const prompt = `Você é um arquiteto analista. Compare duas alternativas de planta para o mesmo projeto residencial.
      
      Alternativa A: ${JSON.stringify(planA)}
      Alternativa B: ${JSON.stringify(planB)}
      Critérios de Foco: ${JSON.stringify(comparison?.criterios)}
      
      Analise os pontos fortes e fracos de cada uma em relação às necessidades do cliente (${JSON.stringify(project.clientProfile)}). Recomende qual alternativa é mais equilibrada e por quê.`;

      const response = await ai.models.generateContent({
        model: config.model || 'gemini-3-flash-preview',
        contents: prompt,
      });

      return response.text || "Não foi possível gerar a análise.";
    } catch (error: any) {
      console.error("Gemini Error:", error);
      throw new Error(error.message || "Erro desconhecido na API do Gemini.");
    }
  },

  generateTemplateRecommendations: async (config: GeminiConfig, templateInput: TemplateInput, profile: ClientProfile | null) => {
    try {
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
        model: config.model || 'gemini-3-flash-preview',
        contents: prompt,
      });

      return response.text || "Não foi possível gerar as recomendações.";
    } catch (error: any) {
      console.error("Gemini Error:", error);
      throw new Error(error.message || "Erro desconhecido na API do Gemini.");
    }
  }
};
