
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

        <div className="block w-full">
          <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
            CONCEITO TÉCNICO & PREMISSAS
          </label>
          <textarea 
            className="w-full px-5 py-4 border border-zinc-200 rounded-2xl focus:ring-4 focus:ring-zinc-900/5 focus:border-zinc-900 focus:outline-none transition-all min-h-[140px] text-[13px] leading-relaxed bg-zinc-50/30 text-zinc-700 placeholder:text-zinc-300 font-medium resize-none"
            value={currentPlan.observacoes} 
            onChange={e => handleChange('observacoes', e.target.value)}
            placeholder="Descreva a lógica arquitetônica..."
          />
        </div>

        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">CÔMODOS</label>
            <button onClick={addAmbiente} className="text-[9px] font-black bg-zinc-100 text-zinc-500 px-3 py-1.5 rounded-lg hover:bg-zinc-900 hover:text-white transition-all shadow-sm flex items-center gap-2">
              <span>+</span> AMBIENTE
            </button>
          </div>
          
          <div className="border border-zinc-100 rounded-3xl overflow-hidden bg-zinc-50/20 p-2">
            <div className="max-h-[300px] overflow-y-auto custom-scrollbar space-y-1">
              {currentPlan.areasPorAmbiente.map((amb, index) => (
                <div key={amb.id} className="flex items-center gap-3 p-2 bg-white rounded-xl border border-zinc-50 shadow-sm">
                  <div className="w-5 text-[9px] font-black text-zinc-300 flex-shrink-0 text-center">{index + 1}</div>
                  <input className="flex-1 bg-transparent text-[12px] px-1 py-1 focus:outline-none font-bold text-zinc-800" value={amb.nome} onChange={e => updateAmbiente(amb.id, 'nome', e.target.value)} />
                  <div className="flex items-center gap-1 bg-zinc-50 border border-zinc-100 rounded-lg px-3 py-0.5">
                    <input className="w-10 text-[11px] py-1 text-right bg-transparent focus:outline-none font-black text-zinc-900" type="number" value={amb.area || ''} onChange={e => updateAmbiente(amb.id, 'area', parseFloat(e.target.value))} />
                    <span className="text-[9px] text-zinc-400 font-black uppercase">m²</span>
                  </div>
                  <button onClick={() => removeAmbiente(amb.id)} className="text-zinc-200 hover:text-red-400 transition-colors p-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              ))}
            </div>
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
      console.error("Erro ao processar dados da IA", e);
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
      alert(err.message);
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
    <div className="space-y-16 pb-32">
      {/* BLOCO 1 - Cabeçalho Funcional */}
      <div className="border-b border-zinc-200 pb-10 flex justify-between items-end">
        <div>
          <h2 className="text-5xl font-black text-zinc-900 tracking-tighter uppercase italic">Estudo Comparativo</h2>
          <p className="text-zinc-500 mt-2 text-sm font-medium">Projeto: {project.nome} • v{project.version}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <PlanForm variant="A" title="Conceito Alpha" plan={project.planA} onUpdate={data => updateProject(project.id, p => ({...p, planA: data}))} />
        <PlanForm variant="B" title="Conceito Beta" plan={project.planB} onUpdate={data => updateProject(project.id, p => ({...p, planB: data}))} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-3">
          <Card className="p-8 rounded-[2rem] bg-zinc-50 border-none ring-1 ring-zinc-200 sticky top-10">
            <h3 className="text-[10px] font-black text-zinc-900 uppercase tracking-[0.2em] mb-8">Eixos de Análise</h3>
            <div className="space-y-4">
              <Checkbox label="Fluxos e Setorização" checked={comparison.criterios.circulacao} onChange={e => handleCriteriaChange('circulacao', e.target.checked)} />
              <Checkbox label="Integração Social" checked={comparison.criterios.integracao} onChange={e => handleCriteriaChange('integracao', e.target.checked)} />
              <Checkbox label="Zoneamento Íntimo" checked={comparison.criterios.privacidade} onChange={e => handleCriteriaChange('privacidade', e.target.checked)} />
              <Checkbox label="Iluminação Natural" checked={comparison.criterios.iluminacao} onChange={e => handleCriteriaChange('iluminacao', e.target.checked)} />
              <Checkbox label="Eficiência Térmica" checked={comparison.criterios.ventilacao} onChange={e => handleCriteriaChange('ventilacao', e.target.checked)} />
            </div>
            <Button className="w-full mt-10 py-5 font-black text-xs bg-zinc-900 uppercase tracking-widest" onClick={handleGenerateAnalysis} isLoading={isGenerating}>🚀 ANALISAR COM IA</Button>
          </Card>
        </div>

        <div className="lg:col-span-9 space-y-12">
           {structuredData ? (
             <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
               
               {/* BLOCO 2 - Decisão Recomendada */}
               <div className="bg-zinc-50 border border-zinc-200 p-10 rounded-[2.5rem] shadow-sm mb-14 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-10 text-emerald-500/10">
                    <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  </div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 mb-2">Recomendação Técnica</h4>
                  <div className="text-4xl font-black text-zinc-900 tracking-tight uppercase italic mb-4">
                    Planta {structuredData.recomendacao.planta}
                  </div>
                  <p className="text-zinc-600 text-lg font-medium leading-relaxed max-w-2xl">
                    {structuredData.recomendacao.motivo}
                  </p>
               </div>

               {/* BLOCO 3 - Placar Visual por Critérios */}
               <div className="space-y-4 mb-14">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 ml-2">Análise de Performance</h4>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {structuredData.placar.map((p, i) => (
                      <div key={i} className="bg-white border border-zinc-100 p-5 rounded-3xl text-center flex flex-col justify-center gap-2">
                         <span className="text-[9px] font-black text-zinc-400 uppercase tracking-wider truncate">{p.criterio}</span>
                         <div className={`text-[10px] font-black uppercase py-1.5 px-3 rounded-full ${p.vencedora === 'Empate' ? 'bg-zinc-50 text-zinc-400' : 'bg-emerald-50 text-emerald-600'}`}>
                           {p.vencedora}
                         </div>
                      </div>
                    ))}
                  </div>
               </div>

               {/* BLOCO 4 - Análise por Critério (Conteúdo Detalhado) */}
               <div className="space-y-8 mb-14">
                  {structuredData.detalhes.map((det, i) => (
                    <div key={i} className="bg-white border border-zinc-100 rounded-[2.5rem] overflow-hidden shadow-sm">
                       <div className="px-8 py-4 bg-zinc-50/50 border-b border-zinc-100">
                          <h5 className="font-black text-xs uppercase tracking-[0.2em] text-zinc-900">{det.criterio}</h5>
                       </div>
                       <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-zinc-100">
                          <div className="p-8 space-y-3">
                             <div className="text-[10px] font-black text-zinc-300 uppercase italic">Planta Alpha</div>
                             <p className="text-sm text-zinc-600 leading-relaxed font-medium">{det.analiseAlpha}</p>
                          </div>
                          <div className="p-8 space-y-3">
                             <div className="text-[10px] font-black text-zinc-300 uppercase italic">Planta Beta</div>
                             <p className="text-sm text-zinc-600 leading-relaxed font-medium">{det.analiseBeta}</p>
                          </div>
                       </div>
                       <div className="p-5 bg-zinc-50 text-center border-t border-zinc-100">
                         <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest italic">Veredito: {det.conclusao}</span>
                       </div>
                    </div>
                  ))}
               </div>

               {/* BLOCO 5 - Riscos e Mitigações */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-14">
                  <div className="bg-amber-50/30 border border-amber-100 p-10 rounded-[2.5rem] space-y-6">
                     <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-amber-700">Riscos da Recomendação</h4>
                     <ul className="space-y-4">
                        {structuredData.riscosMitigacoes.map((item, i) => (
                          <li key={i} className="text-xs text-amber-900 font-bold leading-relaxed flex items-start gap-4">
                            <span className="text-amber-400 font-black">•</span>
                            {item.risco}
                          </li>
                        ))}
                     </ul>
                  </div>
                  <div className="bg-blue-50/30 border border-blue-100 p-10 rounded-[2.5rem] space-y-6">
                     <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-blue-700">Ajustes Sugeridos</h4>
                     <ul className="space-y-4">
                        {structuredData.riscosMitigacoes.map((item, i) => (
                          <li key={i} className="text-xs text-blue-900 font-bold leading-relaxed flex items-start gap-4">
                            <span className="text-blue-400 font-black">→</span>
                            {item.ajusteSugerido}
                          </li>
                        ))}
                     </ul>
                  </div>
               </div>

               {/* BLOCO 6 - Ações Finais */}
               <div className="pt-10 border-t border-zinc-100 flex items-center justify-between">
                  <div className="text-[10px] font-black text-zinc-300 uppercase tracking-widest italic">Análise Digital ArchiDecide Core</div>
                  <div className="flex gap-4">
                    <Button variant="secondary" className="px-6 py-4 rounded-2xl text-[10px] uppercase font-black tracking-widest">Editar Análise</Button>
                    <Link to={`/projects/${projectId}/report`}>
                      <Button className="px-8 py-4 bg-zinc-900 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-xl hover:scale-105 transition-all">
                        Gerar Relatório PDF
                      </Button>
                    </Link>
                  </div>
               </div>

             </div>
           ) : (
             <div className="h-[600px] flex flex-col items-center justify-center text-center space-y-6 opacity-20 bg-zinc-50 rounded-[3rem] border-2 border-dashed border-zinc-200">
                <div className="text-7xl">📐</div>
                <div className="space-y-2">
                  <p className="uppercase tracking-[0.5em] font-black text-xs">Aguardando Parâmetros</p>
                  <p className="text-[10px] font-bold text-zinc-400">Configure os eixos de análise e clique em analisar.</p>
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default ProjectPlansPage;
