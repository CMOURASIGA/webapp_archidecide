
import { GoogleGenAI } from "@google/genai";
import { GeminiConfig, Project, ClientProfile, TemplateInput } from "../types/project.ts";

/**
 * Serviço de integração com Google Gemini.
 * Focado em gerar conteúdo arquitetônico de alto nível com tipografia técnica e direta.
 */
export const geminiService = {
  generateGuidelines: async (config: GeminiConfig, project: Project) => {
    // @ts-ignore
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `Você é um consultor sênior de arquitetura. Gere diretrizes conceituais.
    Perfil: ${JSON.stringify(project.clientProfile)}
    Imóvel: ${JSON.stringify(project.propertyInfo)}
    
    REGRAS DE ESCRITA:
    - Seja conciso e direto ao ponto (estilo editorial técnico).
    - Use H2 para seções e H3 para sub-tópicos.
    - Foque em soluções espaciais práticas.
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
    
    const prompt = `Você é um estrategista em viabilidade de plantas. 
    Compare criticamente a Planta Alpha e a Planta Beta.

    DADOS:
    Planta Alpha: ${JSON.stringify(project.planA)}
    Planta Beta: ${JSON.stringify(project.planB)}
    Critérios: ${JSON.stringify(project.comparison?.criterios)}

    DIRETRIZES DE FORMATAÇÃO (MUITO IMPORTANTE):
    - Escreva de forma executiva, frases curtas, foco em m² e eficiência.
    - # Relatório de Análise Técnica
    - ## 1. Análise Crítica por Critérios (Use listas curtas para cada critério)
    - ## 2. Tabela Comparativa (Crie uma tabela Markdown objetiva: Critério | Alpha | Beta | Vencedora)
    - ## 3. Veredito Estratégico (Recomendação final direta)

    EVITE: Parágrafos longos. Priorize a "batida de olho" do arquiteto.`;

    const response = await ai.models.generateContent({
      model: config.model || 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "";
  },

  generateTemplateRecommendations: async (config: GeminiConfig, templateInput: TemplateInput, profile: ClientProfile | null) => {
    // @ts-ignore
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const prompt = `Recomendações técnicas para ambiente: ${templateInput.templateType}.
    Entrada: ${JSON.stringify(templateInput)}.
    Contexto Cliente: ${JSON.stringify(profile)}.
    
    ESTRUTURA TÉCNICA:
    - Título Curto
    - Tópicos de Marcenaria
    - Tópicos de Iluminação e Elétrica
    - Sugestão de Materiais
    
    Seja breve, técnico e profissional.`;

    const response = await ai.models.generateContent({
      model: config.model || 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "";
  }
};
