
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProjectStore } from '../store/useProjectStore.ts';
import { Button, Card, Input, Checkbox } from '../components/common/UI.tsx';
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

  const colorClass = variant === 'A' ? 'border-t-zinc-900' : 'border-t-blue-600';

  return (
    <div className={`bg-white border border-zinc-200 rounded-2xl shadow-lg overflow-hidden flex flex-col border-t-4 ${colorClass}`}>
      <div className="px-6 py-4 border-b border-zinc-100 bg-zinc-50 flex justify-between items-center">
        <h3 className="font-bold text-zinc-900 flex items-center gap-2">
          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] text-white ${variant === 'A' ? 'bg-zinc-900' : 'bg-blue-600'}`}>
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

        {/* Technical Concept - FIXED FULL WIDTH */}
        <div className="w-full flex flex-col space-y-2">
          <label className="text-sm font-bold text-zinc-800 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-900"></span>
            Conceito Técnico & Premissas
          </label>
          <textarea 
            className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900 focus:outline-none transition-all min-h-[140px] text-sm leading-relaxed bg-zinc-50/50"
            value={currentPlan.observacoes} 
            onChange={e => handleChange('observacoes', e.target.value)}
            placeholder="Descreva a lógica por trás desta planta, fluxos de circulação, aberturas, diretrizes de layout e zoneamento..."
          />
        </div>

        {/* Environments Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Ambientes e Dimensionamento</label>
            <button 
              onClick={addAmbiente}
              className="text-[10px] font-bold bg-zinc-900 text-white px-3 py-1.5 rounded-lg hover:bg-zinc-700 transition-all shadow-sm"
            >
              + ADICIONAR
            </button>
          </div>
          
          <div className="border border-zinc-200 rounded-xl overflow-hidden shadow-sm bg-white">
            <div className="max-h-[350px] overflow-y-auto custom-scrollbar">
              {currentPlan.areasPorAmbiente.length === 0 && (
                <div className="py-12 text-center text-xs text-zinc-300 italic">Lista de ambientes vazia</div>
              )}
              {currentPlan.areasPorAmbiente.map((amb, index) => (
                <div key={amb.id} className={`flex items-center gap-3 p-3 ${index !== 0 ? 'border-t border-zinc-50' : ''}`}>
                  <input 
                    className="flex-1 bg-transparent text-sm px-2 py-1 focus:ring-1 focus:ring-zinc-900 rounded-lg outline-none font-medium text-zinc-700" 
                    placeholder="Nome do ambiente..."
                    value={amb.nome} 
                    onChange={e => updateAmbiente(amb.id, 'nome', e.target.value)} 
                  />
                  <div className="flex items-center gap-1 bg-zinc-100 border border-zinc-200 rounded-lg px-3">
                    <input 
                      className="w-14 text-xs py-2 text-right bg-transparent focus:outline-none font-black text-zinc-900" 
                      type="number"
                      value={amb.area || ''} 
                      onChange={e => updateAmbiente(amb.id, 'area', parseFloat(e.target.value))} 
                    />
                    <span className="text-[10px] text-zinc-400 font-bold">m²</span>
                  </div>
                  <button onClick={() => removeAmbiente(amb.id)} className="text-zinc-300 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Narrative Section - Strengths/Weaknesses */}
        <div className="grid grid-cols-1 gap-4 pt-4 border-t border-zinc-50">
          <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-100 space-y-3">
            <label className="text-[11px] font-black text-emerald-700 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Pontos Fortes da Proposta
            </label>
            <textarea 
              className="w-full bg-transparent border-none focus:ring-0 text-sm p-0 min-h-[90px] text-emerald-900 placeholder:text-emerald-300 resize-none leading-relaxed font-medium"
              placeholder="O que esta planta resolve de forma excelente?"
              value={currentPlan.pontosFortes}
              onChange={e => handleChange('pontosFortes', e.target.value)}
            />
          </div>

          <div className="p-5 bg-amber-50 rounded-2xl border border-amber-100 space-y-3">
            <label className="text-[11px] font-black text-amber-700 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              Pontos de Atenção / Trade-offs
            </label>
            <textarea 
              className="w-full bg-transparent border-none focus:ring-0 text-sm p-0 min-h-[90px] text-amber-900 placeholder:text-amber-300 resize-none leading-relaxed font-medium"
              placeholder="Quais são as limitações ou desafios desta opção?"
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
      <div className="border-b border-zinc-200 pb-8">
        <h2 className="text-4xl font-black text-zinc-900 tracking-tight">Comparativo de Plantas</h2>
        <p className="text-zinc-500 mt-2 text-lg">Analise e fundamente tecnicamente as escolhas projetuais.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
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

      <Card className="border-2 border-zinc-100 shadow-2xl overflow-hidden bg-white rounded-3xl">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-4 p-10 bg-zinc-50 border-r border-zinc-100 space-y-8">
            <h3 className="text-sm font-black text-zinc-900 uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 bg-zinc-900 rounded-full"></span>
              Foco da Análise IA
            </h3>
            <div className="space-y-4">
              <Checkbox label="Fluxos e Circulação" checked={comparison.criterios.circulacao} onChange={e => handleCriteriaChange('circulacao', e.target.checked)} />
              <Checkbox label="Integração de Ambientes" checked={comparison.criterios.integracao} onChange={e => handleCriteriaChange('integracao', e.target.checked)} />
              <Checkbox label="Privacidade Acústica/Visual" checked={comparison.criterios.privacidade} onChange={e => handleCriteriaChange('privacidade', e.target.checked)} />
              <Checkbox label="Eficiência de Iluminação" checked={comparison.criterios.iluminacao} onChange={e => handleCriteriaChange('iluminacao', e.target.checked)} />
              <Checkbox label="Ventilação e Conforto" checked={comparison.criterios.ventilacao} onChange={e => handleCriteriaChange('ventilacao', e.target.checked)} />
            </div>
            <Button className="w-full py-5 font-black text-lg shadow-xl hover:scale-[1.02] transition-all" onClick={handleGenerateAnalysis} isLoading={isGenerating}>🚀 ANALISAR COM IA</Button>
          </div>
          <div className="lg:col-span-8 bg-zinc-900 p-10 min-h-[450px] flex flex-col">
             <div className="text-emerald-500 font-mono text-xs mb-6 flex justify-between items-center border-b border-zinc-800 pb-4">
               <span>ESTUDO TÉCNICO COMPARATIVO</span>
               <span className="opacity-50">GEMINI ENGINE v3.0</span>
             </div>
             <div className="flex-1">
               {comparison.analiseComparativa ? (
                 <textarea 
                   className="w-full h-full bg-transparent text-zinc-100 border-none focus:ring-0 font-mono text-sm leading-relaxed resize-none custom-scrollbar"
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
                 <div className="text-zinc-700 font-mono text-sm h-full flex flex-col items-center justify-center italic text-center space-y-4">
                   <div className="text-3xl opacity-20">📐</div>
                   <p className="max-w-xs">Selecione os pilares ao lado para gerar a argumentação técnica entre as alternativas.</p>
                 </div>
               )}
             </div>
          </div>
        </div>
      </Card>

      <div className="flex justify-end gap-6 pt-10 border-t border-zinc-100">
        <Link to={`/projects/${projectId}/profile`}>
          <Button variant="ghost" className="px-8">Voltar para Perfil</Button>
        </Link>
        <Link to={`/projects/${projectId}/templates`}>
          <Button className="px-12 py-5 font-black text-xl shadow-2xl">Avançar para Templates →</Button>
        </Link>
      </div>
    </div>
  );
};

export default ProjectPlansPage;
