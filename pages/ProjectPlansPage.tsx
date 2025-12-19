
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProjectStore } from '../store/useProjectStore.ts';
import { Button, Card, Input, Textarea, Checkbox } from '../components/common/UI.tsx';
import { geminiService } from '../services/geminiService.ts';
import { PlanAlternative, AreaPorAmbiente, ComparisonCriteria } from '../types/project.ts';

const PlanForm: React.FC<{ 
  plan: PlanAlternative | null, 
  title: string, 
  variant: 'A' | 'B',
  onUpdate: (plan: PlanAlternative) => void 
}> = ({ plan, title, variant, onUpdate }) => {
  const currentPlan = plan || {
    id: crypto.randomUUID(),
    nome: title,
    areaTotal: 0,
    areasPorAmbiente: [],
    observacoes: "",
    pontosFortes: "",
    pontosFracos: ""
  };

  const handleChange = (field: keyof PlanAlternative, value: any) => {
    onUpdate({ ...currentPlan, [field]: value });
  };

  const addAmbiente = () => {
    const next = [...currentPlan.areasPorAmbiente, { id: crypto.randomUUID(), nome: '', area: null }];
    handleChange('areasPorAmbiente', next);
  };

  const removeAmbiente = (id: string) => {
    const next = currentPlan.areasPorAmbiente.filter(a => a.id !== id);
    handleChange('areasPorAmbiente', next);
  };

  const updateAmbiente = (id: string, field: keyof AreaPorAmbiente, value: any) => {
    const next = currentPlan.areasPorAmbiente.map(a => a.id === id ? { ...a, [field]: value } : a);
    handleChange('areasPorAmbiente', next);
  };

  const colorClass = variant === 'A' ? 'border-t-zinc-900' : 'border-t-blue-500';

  return (
    <div className={`bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden flex flex-col h-full border-t-4 ${colorClass}`}>
      <div className="px-6 py-4 border-b border-zinc-100 bg-zinc-50/50 flex justify-between items-center">
        <h3 className="font-bold text-zinc-900 flex items-center gap-2">
          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] text-white ${variant === 'A' ? 'bg-zinc-900' : 'bg-blue-500'}`}>
            {variant}
          </span>
          {title}
        </h3>
      </div>
      
      <div className="p-6 space-y-8 flex-1">
        {/* Basic Info Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <Input 
              label="Nome da Proposta" 
              value={currentPlan.nome} 
              onChange={e => handleChange('nome', e.target.value)}
              placeholder="Ex: Layout Aberto"
            />
          </div>
          <Input 
            label="Área Total (m²)" 
            type="number" 
            value={currentPlan.areaTotal || ''} 
            onChange={e => handleChange('areaTotal', parseFloat(e.target.value))}
          />
        </div>

        {/* Environments Table */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Setorização / Ambientes</label>
            <button 
              onClick={addAmbiente}
              className="text-[10px] font-bold bg-zinc-100 text-zinc-600 px-2 py-1 rounded hover:bg-zinc-900 hover:text-white transition-all"
            >
              + ADICIONAR
            </button>
          </div>
          
          <div className="border border-zinc-100 rounded-xl overflow-hidden shadow-inner bg-zinc-50/30">
            <div className="max-h-[220px] overflow-y-auto custom-scrollbar">
              {currentPlan.areasPorAmbiente.length === 0 && (
                <div className="py-8 text-center text-xs text-zinc-400 italic">Lista vazia</div>
              )}
              {currentPlan.areasPorAmbiente.map((amb, index) => (
                <div key={amb.id} className={`flex items-center gap-2 p-2 ${index !== 0 ? 'border-t border-zinc-50' : ''}`}>
                  <input 
                    className="flex-1 bg-transparent text-sm px-2 py-1 focus:outline-none placeholder:text-zinc-300" 
                    placeholder="Nome do cômodo"
                    value={amb.nome} 
                    onChange={e => updateAmbiente(amb.id, 'nome', e.target.value)} 
                  />
                  <div className="flex items-center gap-1 bg-white border border-zinc-200 rounded px-2">
                    <input 
                      className="w-12 text-xs py-1 text-right focus:outline-none" 
                      type="number"
                      value={amb.area || ''} 
                      onChange={e => updateAmbiente(amb.id, 'area', parseFloat(e.target.value))} 
                    />
                    <span className="text-[10px] text-zinc-400">m²</span>
                  </div>
                  <button onClick={() => removeAmbiente(amb.id)} className="text-zinc-300 hover:text-red-500 transition-colors p-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Technical Concept - Full Width Textarea */}
        <div className="w-full pt-2">
          <Textarea 
            label="Conceito Técnico" 
            value={currentPlan.observacoes} 
            onChange={e => handleChange('observacoes', e.target.value)}
            placeholder="Descreva a lógica por trás desta planta, fluxos, diretrizes de layout..."
            className="min-h-[120px] w-full text-sm leading-relaxed"
          />
        </div>

        {/* Narrative Section - Strengths/Weaknesses */}
        <div className="grid grid-cols-1 gap-4 pt-2">
          <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100 space-y-2">
            <label className="text-[11px] font-bold text-emerald-700 uppercase tracking-widest flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
              Pontos Fortes
            </label>
            <textarea 
              className="w-full bg-transparent border-none focus:ring-0 text-sm p-0 min-h-[100px] text-emerald-900 placeholder:text-emerald-200 resize-none leading-relaxed"
              placeholder="Vantagens desta opção..."
              value={currentPlan.pontosFortes}
              onChange={e => handleChange('pontosFortes', e.target.value)}
            />
          </div>

          <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-100 space-y-2">
            <label className="text-[11px] font-bold text-amber-700 uppercase tracking-widest flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              Pontos Fracos / Desafios
            </label>
            <textarea 
              className="w-full bg-transparent border-none focus:ring-0 text-sm p-0 min-h-[100px] text-amber-900 placeholder:text-amber-200 resize-none leading-relaxed"
              placeholder="Limitações ou trade-offs..."
              value={currentPlan.pontosFracos}
              onChange={e => handleChange('pontosFracos', e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const ProjectPlansPage: React.FC = () => {
  const { projectId } = useParams();
  const { projects, updateProject, geminiConfig } = useProjectStore();
  const project = projects.find(p => p.id === projectId);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!project) return <div>Projeto não encontrado.</div>;

  const handleUpdatePlan = (key: 'planA' | 'planB', data: PlanAlternative) => {
    updateProject(project.id, prev => ({ ...prev, [key]: data }));
  };

  const comparison = project.comparison || {
    criterios: { circulacao: false, integracao: false, privacidade: false, iluminacao: false, ventilacao: false },
    tabelaComparativaMarkdown: "",
    analiseComparativa: null
  };

  const handleCriteriaChange = (key: keyof ComparisonCriteria, val: any) => {
    updateProject(project.id, prev => ({
      ...prev,
      comparison: { ...comparison, criterios: { ...comparison.criterios, [key]: val } }
    }));
  };

  const handleGenerateAnalysis = async () => {
    if (!project.planA || !project.planB) {
      alert("Preencha ambas as alternativas antes de comparar.");
      return;
    }
    setIsGenerating(true);
    try {
      const text = await geminiService.generateComparativeAnalysis(geminiConfig || { model: 'gemini-3-pro-preview', lastUpdated: '' }, project);
      updateProject(project.id, prev => ({
        ...prev,
        comparison: {
          ...comparison,
          analiseComparativa: {
            id: crypto.randomUUID(),
            title: "Análise Técnica IA",
            content: text,
            source: "gemini",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        }
      }));
    } catch (err) {
      console.error(err);
      alert("Erro ao analisar. Verifique sua conexão ou API Key.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-12 pb-32">
      <div className="flex flex-col md:flex-row items-end justify-between gap-4 border-b border-zinc-200 pb-6">
        <div>
          <h2 className="text-3xl font-black text-zinc-900 tracking-tight">Comparativo de Plantas</h2>
          <p className="text-zinc-500">Analise as opções A e B para fundamentar sua decisão técnica.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        <PlanForm 
          variant="A" 
          title="Alternativa Alpha" 
          plan={project.planA} 
          onUpdate={data => handleUpdatePlan('planA', data)} 
        />
        <PlanForm 
          variant="B" 
          title="Alternativa Beta" 
          plan={project.planB} 
          onUpdate={data => handleUpdatePlan('planB', data)} 
        />
      </div>

      <Card className="border-2 border-zinc-100 shadow-xl overflow-hidden bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Controls */}
          <div className="lg:col-span-4 p-8 bg-zinc-50 border-r border-zinc-100 space-y-8">
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest">Critérios de Análise</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">Selecione quais pilares a IA deve priorizar ao comparar as duas propostas.</p>
              
              <div className="space-y-3 py-4">
                <Checkbox label="Fluxos e Circulação" checked={comparison.criterios.circulacao} onChange={e => handleCriteriaChange('circulacao', e.target.checked)} />
                <Checkbox label="Integração de Ambientes" checked={comparison.criterios.integracao} onChange={e => handleCriteriaChange('integracao', e.target.checked)} />
                <Checkbox label="Privacidade Acústica/Visual" checked={comparison.criterios.privacidade} onChange={e => handleCriteriaChange('privacidade', e.target.checked)} />
                <Checkbox label="Eficiência de Iluminação" checked={comparison.criterios.iluminacao} onChange={e => handleCriteriaChange('iluminacao', e.target.checked)} />
                <Checkbox label="Conforto Térmico/Ventilação" checked={comparison.criterios.ventilacao} onChange={e => handleCriteriaChange('ventilacao', e.target.checked)} />
              </div>
              
              <Input 
                label="Outro Critério (Opcional)" 
                value={comparison.criterios.outros || ""} 
                onChange={e => handleCriteriaChange('outros', e.target.value)} 
                placeholder="Ex: Custo de obra"
              />
            </div>

            <Button 
              className="w-full py-4 shadow-lg hover:shadow-zinc-200 transition-all text-sm font-bold uppercase tracking-widest" 
              variant="primary" 
              onClick={handleGenerateAnalysis} 
              isLoading={isGenerating}
            >
              🚀 Gerar Argumentação IA
            </Button>
          </div>

          {/* AI Result Area */}
          <div className="lg:col-span-8 p-0 flex flex-col bg-zinc-900 min-h-[500px]">
            <div className="px-6 py-3 border-b border-zinc-800 flex items-center justify-between bg-zinc-800/50">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50"></div>
              </div>
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Architect Decision Support System</span>
            </div>
            
            <div className="flex-1 p-8 overflow-y-auto">
              {comparison.analiseComparativa ? (
                <textarea 
                  className="w-full h-full bg-transparent text-zinc-200 border-none focus:ring-0 p-0 font-mono text-sm leading-relaxed resize-none custom-scrollbar"
                  value={comparison.analiseComparativa.content}
                  onChange={e => updateProject(project.id, prev => ({
                    ...prev,
                    comparison: {
                      ...comparison,
                      analiseComparativa: {
                        ...comparison.analiseComparativa!,
                        content: e.target.value,
                        updatedAt: new Date().toISOString(),
                        source: 'manual'
                      }
                    }
                  }))}
                />
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-30">
                  <div className="w-12 h-12 border-2 border-dashed border-zinc-600 rounded-full flex items-center justify-center text-xl">💡</div>
                  <p className="text-zinc-500 font-mono text-xs max-w-xs">Aguardando critérios para processar a análise comparativa entre as Alternativas A e B.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      <div className="flex justify-end gap-4 pt-8">
        <Link to={`/projects/${projectId}/profile`}>
          <Button variant="ghost">← Voltar para Perfil</Button>
        </Link>
        <Link to={`/projects/${projectId}/templates`}>
          <Button className="px-10 py-4 shadow-xl text-lg font-bold">
            Prosseguir: Estudos de Ambientes →
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ProjectPlansPage;
