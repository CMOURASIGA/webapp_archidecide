
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

  const colorClass = variant === 'A' ? 'border-t-zinc-900 shadow-zinc-200' : 'border-t-blue-600 shadow-blue-50';

  return (
    <div className={`bg-white border border-zinc-200 rounded-3xl shadow-xl overflow-hidden flex flex-col border-t-8 transition-all hover:shadow-2xl ${colorClass}`}>
      <div className="px-8 py-5 border-b border-zinc-100 bg-zinc-50/50 flex justify-between items-center">
        <h3 className="font-black text-zinc-900 flex items-center gap-3 uppercase tracking-wider text-sm">
          <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs text-white shadow-sm font-black ${variant === 'A' ? 'bg-zinc-900' : 'bg-blue-600'}`}>
            {variant}
          </span>
          {title}
        </h3>
      </div>
      
      <div className="p-8 space-y-10">
        {/* Row 1: Basic Info */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div className="sm:col-span-2">
            <Input 
              label="Nome da Proposta" 
              value={currentPlan.nome} 
              onChange={e => handleChange('nome', e.target.value)}
              placeholder="Ex: Layout Open Plan"
              className="font-bold text-zinc-800"
            />
          </div>
          <Input 
            label="Área Total (m²)" 
            type="number" 
            value={currentPlan.areaTotal || ''} 
            onChange={e => handleChange('areaTotal', parseFloat(e.target.value))}
            className="font-black text-zinc-900"
          />
        </div>

        {/* Row 2: TECHNICAL CONCEPT (CORRIGIDO PARA LARGURA TOTAL) */}
        <div className="block w-full">
          <label className="text-xs font-black text-zinc-400 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
            Conceito Técnico & Premissas Projetuais
          </label>
          <textarea 
            className="w-full px-5 py-4 border border-zinc-200 rounded-2xl focus:ring-4 focus:ring-zinc-900/5 focus:border-zinc-900 focus:outline-none transition-all min-h-[160px] text-sm leading-relaxed bg-zinc-50/30 text-zinc-700 placeholder:text-zinc-300 font-medium resize-none"
            value={currentPlan.observacoes} 
            onChange={e => handleChange('observacoes', e.target.value)}
            placeholder="Descreva a lógica arquitetônica: zoneamento, fluxos, aberturas, e como a planta responde ao briefing..."
          />
        </div>

        {/* Row 3: Environments List */}
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black text-zinc-400 uppercase tracking-[0.2em]">Dimensionamento por Ambiente</label>
            <button 
              onClick={addAmbiente}
              className="text-[10px] font-black bg-zinc-900 text-white px-4 py-2 rounded-xl hover:bg-zinc-700 transition-all shadow-lg active:scale-90 flex items-center gap-2"
            >
              <span>+</span> ADICIONAR
            </button>
          </div>
          
          <div className="border border-zinc-100 rounded-3xl overflow-hidden bg-zinc-50/20 shadow-inner p-2">
            <div className="max-h-[380px] overflow-y-auto custom-scrollbar space-y-1">
              {currentPlan.areasPorAmbiente.length === 0 && (
                <div className="py-16 text-center text-xs text-zinc-300 font-bold italic uppercase tracking-widest">Nenhum cômodo listado</div>
              )}
              {currentPlan.areasPorAmbiente.map((amb, index) => (
                <div key={amb.id} className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-zinc-100 shadow-sm transition-all hover:border-zinc-300">
                  <div className="w-6 text-[10px] font-black text-zinc-300 flex-shrink-0">{index + 1}</div>
                  <input 
                    className="flex-1 bg-transparent text-sm px-2 py-1 focus:outline-none font-bold text-zinc-800 placeholder:text-zinc-300" 
                    placeholder="Nome do ambiente..."
                    value={amb.nome} 
                    onChange={e => updateAmbiente(amb.id, 'nome', e.target.value)} 
                  />
                  <div className="flex items-center gap-1 bg-zinc-100 border border-zinc-200 rounded-xl px-4 py-1">
                    <input 
                      className="w-14 text-xs py-1.5 text-right bg-transparent focus:outline-none font-black text-zinc-900" 
                      type="number"
                      value={amb.area || ''} 
                      onChange={e => updateAmbiente(amb.id, 'area', parseFloat(e.target.value))} 
                    />
                    <span className="text-[10px] text-zinc-400 font-black uppercase">m²</span>
                  </div>
                  <button onClick={() => removeAmbiente(amb.id)} className="text-zinc-300 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-lg">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Row 4: Strengths/Weaknesses */}
        <div className="grid grid-cols-1 gap-6 pt-6 border-t border-zinc-100">
          <div className="p-6 bg-emerald-50/50 rounded-3xl border border-emerald-100 shadow-sm group">
            <label className="text-[10px] font-black text-emerald-700 uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Pontos Fortes da Proposta
            </label>
            <textarea 
              className="w-full bg-transparent border-none focus:ring-0 text-sm p-0 min-h-[100px] text-emerald-950 placeholder:text-emerald-200 resize-none leading-relaxed font-bold"
              placeholder="O que esta solução resolve melhor?"
              value={currentPlan.pontosFortes}
              onChange={e => handleChange('pontosFortes', e.target.value)}
            />
          </div>

          <div className="p-6 bg-amber-50/50 rounded-3xl border border-amber-100 shadow-sm group">
            <label className="text-[10px] font-black text-amber-700 uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              Pontos Fracos / Desafios
            </label>
            <textarea 
              className="w-full bg-transparent border-none focus:ring-0 text-sm p-0 min-h-[100px] text-amber-950 placeholder:text-amber-200 resize-none leading-relaxed font-bold"
              placeholder="Quais são as limitações técnicas?"
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
            title: "Argumentação Técnica IA",
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
    <div className="space-y-16 pb-32">
      <div className="border-b border-zinc-200 pb-10">
        <h2 className="text-5xl font-black text-zinc-900 tracking-tighter uppercase italic">Estudo Comparativo</h2>
        <p className="text-zinc-500 mt-4 text-xl font-medium">Contraste as propostas A e B para fundamentar a viabilidade técnica.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <PlanForm 
          variant="A" 
          title="Conceito Alpha" 
          plan={project.planA} 
          onUpdate={data => handleUpdatePlan('planA', data)} 
        />
        <PlanForm 
          variant="B" 
          title="Conceito Beta" 
          plan={project.planB} 
          onUpdate={data => handleUpdatePlan('planB', data)} 
        />
      </div>

      <Card className="border-2 border-zinc-100 shadow-2xl overflow-hidden bg-white rounded-[2.5rem] border-none ring-1 ring-zinc-100">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-4 p-12 bg-zinc-50/80 border-r border-zinc-100 space-y-10">
            <h3 className="text-xs font-black text-zinc-900 uppercase tracking-[0.25em] flex items-center gap-3">
              <span className="w-2 h-2 bg-zinc-900 rounded-full animate-pulse"></span>
              Filtro de Análise IA
            </h3>
            <div className="space-y-5">
              <Checkbox label="Fluxos e Setorização" checked={comparison.criterios.circulacao} onChange={e => handleCriteriaChange('circulacao', e.target.checked)} />
              <Checkbox label="Integração Social" checked={comparison.criterios.integracao} onChange={e => handleCriteriaChange('integracao', e.target.checked)} />
              <Checkbox label="Zoneamento Íntimo" checked={comparison.criterios.privacidade} onChange={e => handleCriteriaChange('privacidade', e.target.checked)} />
              <Checkbox label="Luminotécnica Natural" checked={comparison.criterios.iluminacao} onChange={e => handleCriteriaChange('iluminacao', e.target.checked)} />
              <Checkbox label="Eficiência Térmica" checked={comparison.criterios.ventilacao} onChange={e => handleCriteriaChange('ventilacao', e.target.checked)} />
            </div>
            <Button className="w-full py-6 font-black text-lg shadow-2xl hover:scale-[1.03] transition-all bg-zinc-900" onClick={handleGenerateAnalysis} isLoading={isGenerating}>🚀 ANALISAR COM IA</Button>
          </div>
          <div className="lg:col-span-8 bg-zinc-900 p-12 min-h-[500px] flex flex-col shadow-[inset_0_0_80px_rgba(0,0,0,0.4)]">
             <div className="text-emerald-500 font-mono text-[10px] mb-8 flex justify-between items-center border-b border-zinc-800 pb-5">
               <span className="font-bold tracking-[0.3em]">RELATÓRIO DE INTELIGÊNCIA ARQUITETÔNICA</span>
               <span className="opacity-40 tracking-widest font-black uppercase">Alpha vs Beta</span>
             </div>
             <div className="flex-1">
               {comparison.analiseComparativa ? (
                 <textarea 
                   className="w-full h-full bg-transparent text-emerald-50/90 border-none focus:ring-0 font-mono text-sm leading-loose resize-none custom-scrollbar-light"
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
                 <div className="text-zinc-700 font-mono text-xs h-full flex flex-col items-center justify-center italic text-center space-y-6">
                   <div className="text-5xl opacity-10 animate-bounce">⚖️</div>
                   <p className="max-w-xs leading-relaxed uppercase tracking-widest font-black opacity-30">Selecione os parâmetros e inicie o processamento da argumentação técnica.</p>
                 </div>
               )}
             </div>
          </div>
        </div>
      </Card>

      <div className="flex justify-end gap-8 pt-12 border-t border-zinc-100">
        <Link to={`/projects/${projectId}/profile`}>
          <Button variant="ghost" className="px-10 font-bold text-zinc-400 hover:text-zinc-900">Retornar ao Perfil</Button>
        </Link>
        <Link to={`/projects/${projectId}/templates`}>
          <Button className="px-16 py-6 font-black text-xl shadow-2xl hover:scale-105 active:scale-95 transition-all">
            Estudos de Ambientes →
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ProjectPlansPage;
