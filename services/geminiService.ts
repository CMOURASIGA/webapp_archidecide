
import { GoogleGenAI } from "@google/genai";
import { GeminiConfig, Project, ClientProfile, TemplateInput } from "../types/project.ts";

/**
 * Serviço de integração com Google Gemini.
 * Focado em gerar conteúdo arquitetônico de alto nível que será renderizado como Relatório Profissional.
 */
export const geminiService = {
  generateGuidelines: async (config: GeminiConfig, project: Project) => {
    // @ts-ignore
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `Você é um consultor sênior de arquitetura. Com base nos dados abaixo, gere diretrizes gerais de projeto.
    Perfil: ${JSON.stringify(project.clientProfile)}
    Imóvel: ${JSON.stringify(project.propertyInfo)}
    
    ESTRUTURA DA RESPOSTA:
    1. Use Títulos (H2) para grandes seções.
    2. Use listas com marcadores para diretrizes práticas.
    3. Foque em conceitos estéticos, técnicos e funcionais.
    4. Responda em Português (Brasil).`;

    const response = await ai.models.generateContent({
      model: config.model || 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "";
  },

  generateComparativeAnalysis: async (config: GeminiConfig, project: Project) => {
    // @ts-ignore
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `Você é um especialista em análise de plantas e viabilidade arquitetônica. 
    Compare criticamente estas duas propostas de layout para o mesmo cliente.

    DADOS DO PROJETO:
    Planta Alpha: ${JSON.stringify(project.planA)}
    Planta Beta: ${JSON.stringify(project.planB)}
    Critérios Relevantes: ${JSON.stringify(project.comparison?.criterios)}

    ESTRUTURA OBRIGATÓRIA DA RESPOSTA:
    - # Relatório de Análise Técnica: Alpha vs Beta
    - ## 1. Análise Crítica por Critérios (Destaque o que funciona em cada uma)
    - ## 2. Quadro Comparativo Técnico (Use uma Tabela Markdown com colunas: Critério, Planta A, Planta B, Veredito)
    - ## 3. Parecer Técnico e Recomendação (Justifique qual é a melhor escolha técnica para o longo prazo do cliente)

    Seja extremamente profissional, evite linguagem genérica, foque em m², fluxos, ergonomia e custo-benefício.`;

    const response = await ai.models.generateContent({
      model: config.model || 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "";
  },

  generateTemplateRecommendations: async (config: GeminiConfig, templateInput: TemplateInput, profile: ClientProfile | null) => {
    // @ts-ignore
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const prompt = `Gere recomendações executivas para o ambiente: ${templateInput.templateType}.
    Entrada: ${JSON.stringify(templateInput)}.
    Contexto do Cliente: ${JSON.stringify(profile)}.
    
    ESTRUTURA:
    - Título do Ambiente
    - Conceito Espacial
    - Sugestões de Materiais e Cores
    - Pontos de Atenção Técnica (Iluminação, Elétrica, Marcenaria)
    
    Use tabelas se houver comparações de orçamentos ou materiais.`;

    const response = await ai.models.generateContent({
      model: config.model || 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "";
  }
};
