
import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProjectStore } from '../store/useProjectStore.ts';
import { Button, Card, Input, Checkbox } from '../components/common/UI.tsx';
import { geminiService } from '../services/geminiService.ts';
import { PlanAlternative, AreaPorAmbiente, ComparisonCriteria, StructuredAnalysis } from '../types/project.ts';

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
    <div className={`bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden flex flex-col border-t-4 transition-all ${colorClass}`}>
      <div className="px-6 py-4 border-b border-zinc-100 bg-zinc-50/50 flex justify-between items-center">
        <h3 className="font-black text-zinc-900 flex items-center gap-2 uppercase tracking-wider text-xs">
          <span className={`w-6 h-6 rounded flex items-center justify-center text-[10px] text-white font-black ${variant === 'A' ? 'bg-zinc-900' : 'bg-blue-600'}`}>
            {variant}
          </span>
          {title}
        </h3>
      </div>
      
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <Input 
              label="Nome da Proposta" 
              value={currentPlan.nome} 
              onChange={e => handleChange('nome', e.target.value)}
              className="text-sm"
            />
          </div>
          <Input 
            label="Área (m²)" 
            type="number" 
            value={currentPlan.areaTotal || ''} 
            onChange={e => handleChange('areaTotal', parseFloat(e.target.value))}
            className="text-sm"
          />
        </div>

        <div className="block w-full">
          <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-2 block">CONCEITO TÉCNICO</label>
          <textarea 
            className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900 focus:outline-none transition-all min-h-[100px] text-xs leading-relaxed bg-zinc-50/30 font-medium resize-none"
            value={currentPlan.observacoes} 
            onChange={e => handleChange('observacoes', e.target.value)}
            placeholder="Logica arquitetônica..."
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">CÔMODOS</label>
            <button onClick={addAmbiente} className="text-[8px] font-black bg-zinc-100 text-zinc-500 px-2 py-1 rounded hover:bg-zinc-900 hover:text-white transition-all">
              + AMBIENTE
            </button>
          </div>
          
          <div className="max-h-[200px] overflow-y-auto custom-scrollbar-light space-y-1 pr-1">
            {currentPlan.areasPorAmbiente.map((amb, index) => (
              <div key={amb.id} className="flex items-center gap-2 p-2 bg-white rounded-lg border border-zinc-50">
                <input className="flex-1 bg-transparent text-[11px] px-1 py-1 focus:outline-none font-bold text-zinc-800" value={amb.nome} onChange={e => updateAmbiente(amb.id, 'nome', e.target.value)} />
                <div className="flex items-center gap-1">
                  <input className="w-8 text-[11px] py-1 text-right bg-transparent focus:outline-none font-black text-zinc-900" type="number" value={amb.area || ''} onChange={e => updateAmbiente(amb.id, 'area', parseFloat(e.target.value))} />
                  <span className="text-[8px] text-zinc-400 font-black">M²</span>
                </div>
                <button onClick={() => removeAmbiente(amb.id)} className="text-zinc-200 hover:text-red-400 transition-colors p-1">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            ))}
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

  const comparison = project.comparison || {
    criterios: { circulacao: false, integracao: false, privacidade: false, iluminacao: false, ventilacao: false },
    tabelaComparativaMarkdown: "",
    analiseComparativa: null
  };

  const structuredData: StructuredAnalysis | null = useMemo(() => {
    if (!comparison.analiseComparativa?.content) return null;
    try {
      return JSON.parse(comparison.analiseComparativa.content);
    } catch (e) {
      return null;
    }
  }, [comparison.analiseComparativa?.content]);

  const handleGenerateAnalysis = async () => {
    if (!project.planA || !project.planB) return alert("Preencha ambas as alternativas.");
    setIsGenerating(true);
    try {
      const jsonStr = await geminiService.generateComparativeAnalysis(geminiConfig || { model: 'gemini-3-flash-preview', lastUpdated: '' }, project);
      updateProject(project.id, prev => ({
        ...prev,
        comparison: {
          ...comparison,
          analiseComparativa: {
            id: crypto.randomUUID(),
            title: "Parecer Técnico",
            content: jsonStr,
            source: "gemini",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        }
      }));
    } catch (err: any) {
      alert("Erro na análise. Tente novamente.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCriteriaChange = (key: keyof ComparisonCriteria, val: any) => {
    updateProject(project.id, prev => ({
      ...prev,
      comparison: { ...comparison, criterios: { ...comparison.criterios, [key]: val } }
    }));
  };

  return (
    <div className="space-y-10 pb-20">
      <div className="border-b border-zinc-200 pb-6">
        <h2 className="text-3xl md:text-5xl font-black text-zinc-900 tracking-tighter uppercase italic">Análise Técnica</h2>
        <p className="text-zinc-500 mt-2 text-xs md:text-sm font-medium uppercase tracking-widest">Contraste de Propostas A vs B</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
        <PlanForm variant="A" title="Alpha" plan={project.planA} onUpdate={data => updateProject(project.id, p => ({...p, planA: data}))} />
        <PlanForm variant="B" title="Beta" plan={project.planB} onUpdate={data => updateProject(project.id, p => ({...p, planB: data}))} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
        <div className="lg:col-span-4 xl:col-span-3">
          <Card className="p-6 rounded-2xl bg-zinc-900 border-none sticky top-4 md:top-10 shadow-xl">
            <h3 className="text-[9px] font-black text-white/40 uppercase tracking-[0.3em] mb-6">Eixos de Decisão</h3>
            <div className="space-y-4">
              <Checkbox className="text-white text-xs" label="Fluxos" checked={comparison.criterios.circulacao} onChange={e => handleCriteriaChange('circulacao', e.target.checked)} />
              <Checkbox className="text-white text-xs" label="Integração" checked={comparison.criterios.integracao} onChange={e => handleCriteriaChange('integracao', e.target.checked)} />
              <Checkbox className="text-white text-xs" label="Privacidade" checked={comparison.criterios.privacidade} onChange={e => handleCriteriaChange('privacidade', e.target.checked)} />
              <Checkbox className="text-white text-xs" label="Luz Natural" checked={comparison.criterios.iluminacao} onChange={e => handleCriteriaChange('iluminacao', e.target.checked)} />
              <Checkbox className="text-white text-xs" label="Conforto Térmico" checked={comparison.criterios.ventilacao} onChange={e => handleCriteriaChange('ventilacao', e.target.checked)} />
            </div>
            <Button className="w-full mt-8 py-4 font-black text-[10px] bg-white text-black hover:bg-zinc-200 uppercase tracking-widest" onClick={handleGenerateAnalysis} isLoading={isGenerating}>🚀 ANALISAR AGORA</Button>
          </Card>
        </div>

        <div className="lg:col-span-8 xl:col-span-9 space-y-10">
           {structuredData ? (
             <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
               <div className="bg-white border-2 border-zinc-900 p-6 md:p-10 rounded-[2rem] shadow-sm mb-10">
                  <h4 className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-400 mb-2 italic">Parecer Final</h4>
                  <div className="text-2xl md:text-4xl font-black text-zinc-900 tracking-tight uppercase italic mb-3">
                    Planta {structuredData.recomendacao.planta}
                  </div>
                  <p className="text-zinc-600 text-sm md:text-lg font-medium leading-relaxed">
                    {structuredData.recomendacao.motivo}
                  </p>
               </div>

               <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-10">
                  {structuredData.placar.map((p, i) => (
                    <div key={i} className="bg-zinc-50 p-4 rounded-2xl border border-zinc-100 flex flex-col justify-center gap-1 text-center">
                       <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">{p.criterio}</span>
                       <div className={`text-[8px] font-black uppercase py-1 px-2 rounded-full ${p.vencedora === 'Empate' ? 'bg-zinc-100 text-zinc-400' : 'bg-zinc-900 text-white'}`}>
                         {p.vencedora}
                       </div>
                    </div>
                  ))}
               </div>

               <div className="space-y-6">
                  {structuredData.detalhes.map((det, i) => (
                    <div key={i} className="bg-white border border-zinc-100 rounded-2xl overflow-hidden hover:shadow-lg transition-all">
                       <div className="px-6 py-3 bg-zinc-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                          <h5 className="font-black text-[10px] uppercase tracking-[0.2em] text-zinc-900">{det.criterio}</h5>
                          <span className="text-[9px] font-black text-zinc-400 uppercase italic">Conclusão: {det.conclusao}</span>
                       </div>
                       <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-zinc-50">
                          <div className="p-6">
                             <div className="text-[8px] font-black text-zinc-300 uppercase mb-2">Alpha</div>
                             <p className="text-xs text-zinc-600 leading-relaxed font-medium">{det.analiseAlpha}</p>
                          </div>
                          <div className="p-6">
                             <div className="text-[8px] font-black text-zinc-300 uppercase mb-2">Beta</div>
                             <p className="text-xs text-zinc-600 leading-relaxed font-medium">{det.analiseBeta}</p>
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
             </div>
           ) : (
             <div className="h-[300px] md:h-[500px] flex flex-col items-center justify-center text-center space-y-4 opacity-30 bg-zinc-50 rounded-[2rem] border-2 border-dashed border-zinc-200">
                <div className="text-5xl">📐</div>
                <p className="uppercase tracking-[0.3em] font-black text-[10px]">Aguardando Análise</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default ProjectPlansPage;
