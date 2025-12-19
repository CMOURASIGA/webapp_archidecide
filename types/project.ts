
export type ClientType = "casal" | "familia" | "solteiro" | "outro";
export type BudgetLevel = "baixo" | "medio" | "alto";
export type PropertyType = "casa_terrea" | "sobrado" | "apartamento";
export type TemplateType =
  | "sala_estar"
  | "cozinha"
  | "quarto"
  | "banheiro"
  | "area_gourmet"
  | "casa_completa";

export interface ClientProfile {
  tipoCliente: ClientType;
  numeroMoradores: number | null;
  pets: string;
  rotina: string;
  estiloDesejado: string;
  orcamento: BudgetLevel;
  prioridades: string[];
}

export interface PropertyInfo {
  metragemTotal: number | null;
  numeroQuartos: number | null;
  numeroBanheiros: number | null;
  tipoImovel: PropertyType;
  restricoesRelevantes: string;
}

export interface GeneratedTextSection {
  id: string;
  title: string;
  content: string; // Pode ser Markdown ou JSON stringificado
  createdAt: string;
  updatedAt: string;
  source: "manual" | "gemini";
}

export interface StructuredAnalysis {
  recomendacao: {
    planta: "Alpha" | "Beta";
    motivo: string;
  };
  placar: {
    criterio: string;
    vencedora: "Alpha" | "Beta" | "Empate";
  }[];
  detalhes: {
    criterio: string;
    analiseAlpha: string;
    analiseBeta: string;
    conclusao: string;
  }[];
  riscosMitigacoes: {
    risco: string;
    ajusteSugerido: string;
  }[];
}

export interface AreaPorAmbiente {
  id: string;
  nome: string;
  area: number | null;
}

export interface PlanAlternative {
  id: string;
  nome: string;
  imagemPlantaUrl?: string;
  areaTotal: number | null;
  areasPorAmbiente: AreaPorAmbiente[];
  observacoes: string;
  pontosFortes: string;
  pontosFracos: string;
}

export interface ComparisonCriteria {
  circulacao: boolean;
  integracao: boolean;
  privacidade: boolean;
  iluminacao: boolean;
  ventilacao: boolean;
  outros?: string;
}

export interface PlanComparison {
  criterios: ComparisonCriteria;
  tabelaComparativaMarkdown: string;
  analiseComparativa: GeneratedTextSection | null;
}

export interface TemplateInput {
  id: string;
  templateType: TemplateType;
  tamanhoAproximado: string;
  estilo: string;
  orcamento: BudgetLevel;
  preferencias: string;
  createdAt: string;
}

export interface TemplateResult {
  id: string;
  templateInputId: string;
  conceitoAmbiente: GeneratedTextSection | null;
  recomendacoesPraticas: GeneratedTextSection | null;
  pontosAtencao: GeneratedTextSection | null;
  opcoesPorOrcamento: GeneratedTextSection | null;
}

export interface ReportMeta {
  id: string;
  generatedAt: string;
  fileName: string;
  pdfBase64?: string;
}

export interface Project {
  id: string;
  nome: string;
  cliente: string;
  dataProjeto: string;
  observacoes: string;
  clientProfile: ClientProfile | null;
  propertyInfo: PropertyInfo | null;
  diretrizesGerais: GeneratedTextSection | null;
  planA: PlanAlternative | null;
  planB: PlanAlternative | null;
  comparison: PlanComparison | null;
  templatesInputs: TemplateInput[];
  templatesResults: TemplateResult[];
  reports: ReportMeta[];
  createdAt: string;
  updatedAt: string;
  version: number;
}

export interface GeminiConfig {
  model: string;
  lastUpdated: string;
}
