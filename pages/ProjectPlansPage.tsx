
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
    <div className={`bg-white border border-zinc-200 rounded-2xl shadow-md overflow-hidden flex flex-col border-t-4 ${colorClass}`}>
      <div className="px-6 py-4 border-b border-zinc-100 bg-zinc-50 flex justify-between items-center">
        <h3 className="font-bold text-zinc-900 flex items-center gap-2">
          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] text-white ${variant === 'A' ? 'bg-zinc-900' : 'bg-blue-500'}`}>
            {variant}
          </span>
          {title}
        </h3>
      </div>
      
      <div className="p-6 space-y-8">
        {/* Basic Info Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="sm:col-span-2">
            <Input 
              label="Nome da Proposta" 
              value={currentPlan.nome} 
              onChange={e => handleChange('nome', e.target.value)}
              placeholder="Ex: Layout Fluído"
            />
          </div>
          <Input 
            label="Área Total (m²)" 
            type="number" 
            value={currentPlan.areaTotal || ''} 
            onChange={e => handleChange('areaTotal', parseFloat(e.target.value))}
          />
        </div>

        {/* Technical Concept - HIGHLIGHTED AT TOP */}
        <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-100">
          <Textarea 
            label="Conceito Técnico / Premissas" 
            value={currentPlan.observacoes} 
            onChange={e => handleChange('observacoes', e.target.value)}
            placeholder="Descreva a lógica por trás desta planta, fluxos, aberturas..."
            className="min-h-[120px] bg-white text-sm"
          />
        </div>

        {/* Environments Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Ambientes e Áreas</label>
            <button 
              onClick={addAmbiente}
              className="text-[10px] font-bold bg-zinc-900 text-white px-3 py-1.5 rounded-lg hover:bg-zinc-700 transition-all"
            >
              + ADICIONAR
            </button>
          </div>
          
          <div className="border border-zinc-200 rounded-xl overflow-hidden shadow-inner">
            <div className="max-h-[300px] overflow-y-auto">
              {currentPlan.areasPorAmbiente.length === 0 && (
                <div className="py-10 text-center text-xs text-zinc-400">Nenhum ambiente adicionado</div>
              )}
              {currentPlan.areasPorAmbiente.map((amb, index) => (
                <div key={amb.id} className={`flex items-center gap-3 p-3 ${index !== 0 ? 'border-t border-zinc-100' : ''}`}>
                  <input 
                    className="flex-1 bg-transparent text-sm px-2 py-1 focus:ring-1 focus:ring-zinc-900 rounded outline-none" 
                    placeholder="Nome do ambiente"
                    value={amb.nome} 
                    onChange={e => updateAmbiente(amb.id, 'nome', e.target.value)} 
                  />
                  <div className="flex items-center gap-1 bg-zinc-50 border border-zinc-200 rounded px-2">
                    <input 
                      className="w-14 text-xs py-1.5 text-right bg-transparent focus:outline-none font-bold" 
                      type="number"
                      value={amb.area || ''} 
                      onChange={e => updateAmbiente(amb.id, 'area', parseFloat(e.target.value))} 
                    />
                    <span className="text-[10px] text-zinc-400">m²</span>
                  </div>
                  <button onClick={() => removeAmbiente(amb.id)} className="text-zinc-300 hover:text-red-500 transition-colors p-1">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Strengths/Weaknesses */}
        <div className="grid grid-cols-1 gap-4">
          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
            <label className="text-[11px] font-bold text-emerald-700 uppercase mb-2 block">Pontos Fortes</label>
            <textarea 
              className="w-full bg-transparent border-none focus:ring-0 text-sm p-0 min-h-[80px] resize-none leading-relaxed"
              value={currentPlan.pontosFortes}
              onChange={e => handleChange('pontosFortes', e.target.value)}
              placeholder="Vantagens..."
            />
          </div>
          <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
            <label className="text-[11px] font-bold text-amber-700 uppercase mb-2 block">Pontos Fracos</label>
            <textarea 
              className="w-full bg-transparent border-none focus:ring-0 text-sm p-0 min-h-[80px] resize-none leading-relaxed"
              value={currentPlan.pontosFracos}
              onChange={e => handleChange('pontosFracos', e.target.value)}
              placeholder="Limitações..."
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
      const text = await geminiService.generateComparativeAnalysis(geminiConfig || { model: 'gemini-3-flash-preview', lastUpdated: '' }, project);
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
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-12 pb-32">
      <div>
        <h2 className="text-3xl font-black text-zinc-900 tracking-tight">Comparativo de Plantas</h2>
        <p className="text-zinc-500">Documente e compare as propostas arquitetônicas.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
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

      <Card className="border-2 border-zinc-100 shadow-2xl overflow-hidden bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-4 p-8 bg-zinc-50 border-r border-zinc-100 space-y-6">
            <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-widest">Pilares da Análise</h3>
            <div className="space-y-3">
              <Checkbox label="Fluxos e Circulação" checked={comparison.criterios.circulacao} onChange={e => handleCriteriaChange('circulacao', e.target.checked)} />
              <Checkbox label="Integração" checked={comparison.criterios.integracao} onChange={e => handleCriteriaChange('integracao', e.target.checked)} />
              <Checkbox label="Privacidade" checked={comparison.criterios.privacidade} onChange={e => handleCriteriaChange('privacidade', e.target.checked)} />
              <Checkbox label="Iluminação" checked={comparison.criterios.iluminacao} onChange={e => handleCriteriaChange('iluminacao', e.target.checked)} />
              <Checkbox label="Ventilação" checked={comparison.criterios.ventilacao} onChange={e => handleCriteriaChange('ventilacao', e.target.checked)} />
            </div>
            <Button className="w-full py-4 font-bold" onClick={handleGenerateAnalysis} isLoading={isGenerating}>🚀 ANALISAR COM IA</Button>
          </div>
          <div className="lg:col-span-8 bg-zinc-900 p-8 min-h-[400px]">
             <div className="text-emerald-500 font-mono text-xs mb-4 uppercase">Resultado da Análise Comparativa</div>
             {comparison.analiseComparativa ? (
               <textarea 
                 className="w-full h-full bg-transparent text-zinc-200 border-none focus:ring-0 font-mono text-sm leading-relaxed resize-none"
                 value={comparison.analiseComparativa.content}
                 onChange={e => updateProject(project.id, prev => ({
                   ...prev,
                   comparison: {
                     ...comparison,
                     analiseComparativa: { ...comparison.analiseComparativa!, content: e.target.value }
                   }
                 }))}
               />
             ) : (
               <div className="text-zinc-600 font-mono text-sm h-full flex items-center justify-center italic">
                 Aguardando parâmetros de análise...
               </div>
             )}
          </div>
        </div>
      </Card>

      <div className="flex justify-end gap-4 pt-8 border-t border-zinc-100">
        <Link to={`/projects/${projectId}/profile`}>
          <Button variant="ghost">Voltar</Button>
        </Link>
        <Link to={`/projects/${projectId}/templates`}>
          <Button className="px-10 py-4 font-bold">Avançar para Templates →</Button>
        </Link>
      </div>
    </div>
  );
};

export default ProjectPlansPage;
