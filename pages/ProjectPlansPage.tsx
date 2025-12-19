
import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProjectStore } from '../store/useProjectStore.ts';
import { Button, Card, Input, Checkbox } from '../components/common/UI.tsx';
import { geminiService } from '../services/geminiService.ts';
import { PlanAlternative, AreaPorAmbiente, ComparisonCriteria } from '../types/project.ts';
import { marked } from 'marked';

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
              {currentPlan.areasPorAmbiente.length === 0 && (
                <div className="py-10 text-center text-[10px] text-zinc-300 font-bold italic uppercase tracking-widest">Nenhum cômodo listado</div>
              )}
              {currentPlan.areasPorAmbiente.map((amb, index) => (
                <div key={amb.id} className="flex items-center gap-3 p-2 bg-white rounded-xl border border-zinc-50 shadow-sm transition-all hover:border-zinc-200">
                  <div className="w-5 text-[9px] font-black text-zinc-300 flex-shrink-0 text-center">{index + 1}</div>
                  <input className="flex-1 bg-transparent text-[12px] px-1 py-1 focus:outline-none font-bold text-zinc-800" placeholder="Nome..." value={amb.nome} onChange={e => updateAmbiente(amb.id, 'nome', e.target.value)} />
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

        <div className="grid grid-cols-1 gap-4 pt-4 border-t border-zinc-100">
          <div className="p-4 bg-emerald-50/30 rounded-2xl border border-emerald-50">
            <label className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-2 block">PONTOS FORTES</label>
            <textarea className="w-full bg-transparent border-none focus:ring-0 text-[12px] p-0 min-h-[60px] text-emerald-950 resize-none font-bold" placeholder="..." value={currentPlan.pontosFortes} onChange={e => handleChange('pontosFortes', e.target.value)} />
          </div>
          <div className="p-4 bg-amber-50/30 rounded-2xl border border-amber-50">
            <label className="text-[9px] font-black text-amber-600 uppercase tracking-widest mb-2 block">DESAFIOS</label>
            <textarea className="w-full bg-transparent border-none focus:ring-0 text-[12px] p-0 min-h-[60px] text-amber-950 resize-none font-bold" placeholder="..." value={currentPlan.pontosFracos} onChange={e => handleChange('pontosFracos', e.target.value)} />
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
  const [isEditMode, setIsEditMode] = useState(false);

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
    setIsEditMode(false);
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

  const renderedAnalysis = useMemo(() => {
    if (!comparison.analiseComparativa?.content) return null;
    return marked.parse(comparison.analiseComparativa.content);
  }, [comparison.analiseComparativa?.content]);

  return (
    <div className="space-y-16 pb-32">
      <div className="border-b border-zinc-200 pb-10">
        <h2 className="text-5xl font-black text-zinc-900 tracking-tighter uppercase italic">Estudo Comparativo</h2>
        <p className="text-zinc-500 mt-4 text-xl font-medium">Contraste as propostas A e B para fundamentar a viabilidade técnica.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <PlanForm variant="A" title="Conceito Alpha" plan={project.planA} onUpdate={data => handleUpdatePlan('planA', data)} />
        <PlanForm variant="B" title="Conceito Beta" plan={project.planB} onUpdate={data => handleUpdatePlan('planB', data)} />
      </div>

      <Card className="shadow-2xl overflow-hidden bg-white rounded-[2.5rem] border-none ring-1 ring-zinc-100">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[800px]">
          {/* Sidebar Filtros */}
          <div className="lg:col-span-3 p-10 bg-zinc-50 border-r border-zinc-100 space-y-10">
            <div className="space-y-2">
              <h3 className="text-[10px] font-black text-zinc-900 uppercase tracking-[0.2em] flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-zinc-900 rounded-full"></span>
                Eixos de Análise
              </h3>
              <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-tight italic">Selecione as prioridades técnicas</p>
            </div>
            
            <div className="space-y-4">
              <Checkbox label="Fluxos e Setorização" checked={comparison.criterios.circulacao} onChange={e => handleCriteriaChange('circulacao', e.target.checked)} />
              <Checkbox label="Integração Social" checked={comparison.criterios.integracao} onChange={e => handleCriteriaChange('integracao', e.target.checked)} />
              <Checkbox label="Zoneamento Íntimo" checked={comparison.criterios.privacidade} onChange={e => handleCriteriaChange('privacidade', e.target.checked)} />
              <Checkbox label="Iluminação Natural" checked={comparison.criterios.iluminacao} onChange={e => handleCriteriaChange('iluminacao', e.target.checked)} />
              <Checkbox label="Eficiência Térmica" checked={comparison.criterios.ventilacao} onChange={e => handleCriteriaChange('ventilacao', e.target.checked)} />
            </div>
            
            <div className="pt-6 border-t border-zinc-200 space-y-3">
               <Button className="w-full py-5 font-black text-xs shadow-xl hover:scale-[1.03] transition-all bg-zinc-900 uppercase tracking-widest" onClick={handleGenerateAnalysis} isLoading={isGenerating}>🚀 ANALISAR COM IA</Button>
               {comparison.analiseComparativa && (
                 <button onClick={() => setIsEditMode(!isEditMode)} className="w-full text-[9px] font-black uppercase tracking-[0.2em] text-zinc-300 hover:text-zinc-900 transition-colors flex items-center justify-center gap-2 py-2">
                   {isEditMode ? "💾 Gravar Alterações" : "📝 Abrir Modo Edição"}
                 </button>
               )}
            </div>
          </div>

          {/* Área do Relatório - Papel Técnico */}
          <div className="lg:col-span-9 bg-[#f4f4f5] p-12 overflow-y-auto custom-scrollbar-light h-[800px]">
             <div className="report-paper relative animate-in fade-in zoom-in-95 duration-700">
               {/* Watermark sutil */}
               <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none select-none overflow-hidden">
                  <span className="text-[150px] font-black italic uppercase -rotate-45 whitespace-nowrap">DOCUMENTO TÉCNICO</span>
               </div>

               {/* Header Editorial */}
               <div className="border-b border-zinc-900 pb-4 mb-10 flex justify-between items-end">
                 <div>
                   <h1 className="text-3xl font-black text-zinc-900 tracking-tighter italic uppercase m-0 leading-none">Análise Comparativa</h1>
                   <div className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] mt-2">Versão {project.version} • ArchiDecide Intelligence</div>
                 </div>
                 <div className="text-right">
                    <div className="text-[9px] font-black text-zinc-300 uppercase tracking-widest">Projeto</div>
                    <div className="text-xs font-bold text-zinc-800 uppercase">{project.nome}</div>
                 </div>
               </div>

               {/* Conteúdo Renderizado */}
               <div className="relative z-10">
                 {comparison.analiseComparativa ? (
                   isEditMode ? (
                     <textarea 
                       className="w-full h-[600px] bg-zinc-50 p-8 rounded-xl border border-zinc-200 text-zinc-800 focus:ring-1 focus:ring-zinc-900 font-mono text-[11px] leading-relaxed resize-none shadow-inner"
                       value={comparison.analiseComparativa.content}
                       onChange={e => updateProject(project.id, prev => ({
                         ...prev,
                         comparison: {
                           ...comparison,
                           analiseComparativa: { ...comparison.analiseComparativa!, content: e.target.value }
                         }
                       }))}
                       placeholder="Edite o Markdown aqui..."
                     />
                   ) : (
                     <div 
                       className="prose max-w-none"
                       dangerouslySetInnerHTML={{ __html: renderedAnalysis as string }} 
                     />
                   )
                 ) : (
                   <div className="h-[400px] flex flex-col items-center justify-center text-center space-y-6 opacity-30">
                     <div className="w-16 h-16 border-4 border-dashed border-zinc-200 rounded-2xl flex items-center justify-center text-2xl font-black">?</div>
                     <div className="space-y-1">
                       <p className="uppercase tracking-[0.3em] font-black text-[10px]">Aguardando Entrada de Dados</p>
                       <p className="text-[9px] font-bold text-zinc-400 italic">Configure as plantas e clique em analisar.</p>
                     </div>
                   </div>
                 )}
               </div>

               {/* Footer Editorial */}
               {comparison.analiseComparativa && !isEditMode && (
                 <div className="mt-20 pt-6 border-t border-zinc-100 flex justify-between items-center opacity-40">
                   <div className="text-[9px] font-black text-zinc-300 uppercase tracking-widest italic">Confidencial • Apenas para uso profissional</div>
                   <div className="text-[9px] font-black text-zinc-300 uppercase tracking-widest">{new Date().toLocaleDateString('pt-BR')}</div>
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
