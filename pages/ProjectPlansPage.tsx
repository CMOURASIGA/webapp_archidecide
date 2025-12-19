
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProjectStore } from '../store/useProjectStore.ts';
import { Button, Card, Input, Textarea, Checkbox } from '../components/common/UI.tsx';
import { geminiService } from '../services/geminiService.ts';
import { PlanAlternative, AreaPorAmbiente, ComparisonCriteria } from '../types/project.ts';

const PlanForm: React.FC<{ 
  plan: PlanAlternative | null, 
  title: string, 
  onUpdate: (plan: PlanAlternative) => void 
}> = ({ plan, title, onUpdate }) => {
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

  return (
    <Card title={title}>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Nome da Alternativa" value={currentPlan.nome} onChange={e => handleChange('nome', e.target.value)} />
          <Input label="Área Total (m²)" type="number" value={currentPlan.areaTotal || ''} onChange={e => handleChange('areaTotal', parseFloat(e.target.value))} />
        </div>
        
        <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-100 space-y-3 shadow-inner">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Ambientes e Áreas</label>
            <button onClick={addAmbiente} className="text-xs font-bold text-zinc-900 hover:text-zinc-600 transition-colors">+ Novo Ambiente</button>
          </div>
          <div className="space-y-2 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
            {currentPlan.areasPorAmbiente.length === 0 && (
              <p className="text-xs text-zinc-400 italic py-4 text-center">Adicione ambientes para detalhar a planta.</p>
            )}
            {currentPlan.areasPorAmbiente.map((amb) => (
              <div key={amb.id} className="flex gap-2 items-center bg-white p-1 rounded-lg border border-zinc-200 shadow-sm">
                <input 
                  className="flex-1 text-sm px-2 py-1.5 focus:outline-none" 
                  placeholder="Nome" value={amb.nome} onChange={e => updateAmbiente(amb.id, 'nome', e.target.value)} 
                />
                <div className="flex items-center gap-1 border-l border-zinc-100 pl-2">
                  <input 
                    className="w-16 text-sm py-1.5 focus:outline-none text-right" 
                    placeholder="0" type="number" value={amb.area || ''} onChange={e => updateAmbiente(amb.id, 'area', parseFloat(e.target.value))} 
                  />
                  <span className="text-[10px] text-zinc-400 mr-2">m²</span>
                </div>
                <button onClick={() => removeAmbiente(amb.id)} className="text-zinc-300 hover:text-red-500 px-2 transition-colors">✕</button>
              </div>
            ))}
          </div>
        </div>

        <Textarea 
          label="Observações Técnicas" 
          value={currentPlan.observacoes} 
          onChange={e => handleChange('observacoes', e.target.value)} 
          placeholder="Descreva as soluções de layout desta planta..." 
          className="min-h-[100px]"
        />
        
        <div className="space-y-6 pt-2">
          <div className="space-y-2">
            <label className="text-sm font-bold text-emerald-700 flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
              PONTOS FORTES
            </label>
            <Textarea 
              className="bg-emerald-50/20 border-emerald-100 focus:ring-emerald-500 min-h-[150px] text-sm" 
              value={currentPlan.pontosFortes} 
              onChange={e => handleChange('pontosFortes', e.target.value)} 
              placeholder="O que torna esta planta uma boa opção?"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-bold text-amber-700 flex items-center gap-2">
              <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
              PONTOS FRACOS / DESAFIOS
            </label>
            <Textarea 
              className="bg-amber-50/20 border-amber-100 focus:ring-amber-500 min-h-[150px] text-sm" 
              value={currentPlan.pontosFracos} 
              onChange={e => handleChange('pontosFracos', e.target.value)} 
              placeholder="Quais os pontos críticos ou limitações?"
            />
          </div>
        </div>
      </div>
    </Card>
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
            title: "Análise Comparativa IA",
            content: text,
            source: "gemini",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        }
      }));
    } catch (err) {
      console.error(err);
      alert("Erro ao analisar via IA.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-12 pb-32">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        <PlanForm title="ALTERNATIVA A" plan={project.planA} onUpdate={data => handleUpdatePlan('planA', data)} />
        <PlanForm title="ALTERNATIVA B" plan={project.planB} onUpdate={data => handleUpdatePlan('planB', data)} />
      </div>

      <Card title="Comparativo & Análise de Decisão">
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-6">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Parâmetros Analíticos</label>
              <div className="grid grid-cols-2 gap-4 bg-zinc-50 p-6 rounded-2xl border border-zinc-100 shadow-inner">
                <Checkbox label="Circulação" checked={comparison.criterios.circulacao} onChange={e => handleCriteriaChange('circulacao', e.target.checked)} />
                <Checkbox label="Integração" checked={comparison.criterios.integracao} onChange={e => handleCriteriaChange('integracao', e.target.checked)} />
                <Checkbox label="Privacidade" checked={comparison.criterios.privacidade} onChange={e => handleCriteriaChange('privacidade', e.target.checked)} />
                <Checkbox label="Iluminação" checked={comparison.criterios.iluminacao} onChange={e => handleCriteriaChange('iluminacao', e.target.checked)} />
                <Checkbox label="Ventilação" checked={comparison.criterios.ventilacao} onChange={e => handleCriteriaChange('ventilacao', e.target.checked)} />
              </div>
              <Input label="Critérios Específicos" value={comparison.criterios.outros || ""} onChange={e => handleCriteriaChange('outros', e.target.value)} placeholder="Ex: Custo, Estrutura..." />
              <Button className="w-full h-14 shadow-lg text-lg" variant="secondary" onClick={handleGenerateAnalysis} isLoading={isGenerating}>
                🤖 Gerar Análise Comparativa IA
              </Button>
            </div>

            <div className="flex flex-col">
               <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Resultado da Argumentação Técnica</label>
               <div className="flex-1 min-h-[400px] bg-zinc-900 rounded-2xl p-6 relative group shadow-2xl">
                  <Textarea 
                    className="h-full w-full bg-transparent text-zinc-100 border-none focus:ring-0 p-0 font-mono text-sm leading-relaxed resize-none" 
                    value={comparison.analiseComparativa?.content || ""} 
                    onChange={e => updateProject(project.id, prev => ({
                      ...prev,
                      comparison: {
                        ...comparison,
                        analiseComparativa: {
                          id: comparison.analiseComparativa?.id || crypto.randomUUID(),
                          title: "Análise Comparativa",
                          content: e.target.value,
                          source: "manual",
                          createdAt: comparison.analiseComparativa?.createdAt || new Date().toISOString(),
                          updatedAt: new Date().toISOString()
                        }
                      }
                    }))}
                    placeholder="Redija aqui suas conclusões ou use o Gemini para gerar uma análise isenta baseada nos critérios..."
                  />
                  <div className="absolute bottom-4 right-4 text-[9px] text-zinc-600 font-mono uppercase tracking-widest group-hover:text-zinc-400 transition-colors pointer-events-none select-none">
                    Terminal de Dados
                  </div>
               </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="flex justify-end pt-4">
        <Link to={`/projects/${projectId}/templates`}>
          <Button className="px-12 py-5 shadow-2xl text-xl hover:scale-[1.02] transition-transform">
            Próximo Passo: Detalhamento de Ambientes 🛋️
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ProjectPlansPage;
