
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProjectStore } from '../store/useProjectStore';
import { Button, Card, Input, Textarea, Checkbox } from '../components/common/UI';
import { geminiService } from '../services/geminiService';
import { PlanAlternative, AreaPorAmbiente, ComparisonCriteria } from '../types/project';

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
      <div className="space-y-4">
        <Input label="Nome da Alternativa" value={currentPlan.nome} onChange={e => handleChange('nome', e.target.value)} />
        <Input label="Área Total (m²)" type="number" value={currentPlan.areaTotal || ''} onChange={e => handleChange('areaTotal', parseFloat(e.target.value))} />
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-zinc-700">Ambientes</label>
            <button onClick={addAmbiente} className="text-xs text-zinc-900 font-bold hover:underline">+ Adicionar</button>
          </div>
          <div className="space-y-2">
            {currentPlan.areasPorAmbiente.map((amb) => (
              <div key={amb.id} className="flex gap-2 items-center">
                <input 
                  className="flex-1 text-xs border-zinc-200 border rounded p-1.5 focus:outline-none focus:ring-1 focus:ring-zinc-400" 
                  placeholder="Nome" value={amb.nome} onChange={e => updateAmbiente(amb.id, 'nome', e.target.value)} 
                />
                <input 
                  className="w-16 text-xs border-zinc-200 border rounded p-1.5 focus:outline-none focus:ring-1 focus:ring-zinc-400" 
                  placeholder="m²" type="number" value={amb.area || ''} onChange={e => updateAmbiente(amb.id, 'area', parseFloat(e.target.value))} 
                />
                <button onClick={() => removeAmbiente(amb.id)} className="text-red-400 text-xs hover:text-red-600">✕</button>
              </div>
            ))}
          </div>
        </div>

        <Textarea label="Observações Técnicas" value={currentPlan.observacoes} onChange={e => handleChange('observacoes', e.target.value)} />
        <div className="grid grid-cols-2 gap-4">
          <Textarea label="Pontos Fortes" className="bg-green-50/30" value={currentPlan.pontosFortes} onChange={e => handleChange('pontosFortes', e.target.value)} />
          <Textarea label="Pontos Fracos" className="bg-red-50/30" value={currentPlan.pontosFracos} onChange={e => handleChange('pontosFracos', e.target.value)} />
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
    if (!process.env.API_KEY) {
      alert("Chave API não configurada.");
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
      alert("Erro ao analisar.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8 pb-32">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <PlanForm title="Alternativa A" plan={project.planA} onUpdate={data => handleUpdatePlan('planA', data)} />
        <PlanForm title="Alternativa B" plan={project.planB} onUpdate={data => handleUpdatePlan('planB', data)} />
      </div>

      <Card title="Comparação & Apoio à Decisão">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="text-sm font-semibold text-zinc-900">Critérios de Comparação</label>
              <div className="grid grid-cols-2 gap-2">
                <Checkbox label="Circulação" checked={comparison.criterios.circulacao} onChange={e => handleCriteriaChange('circulacao', e.target.checked)} />
                <Checkbox label="Integração" checked={comparison.criterios.integracao} onChange={e => handleCriteriaChange('integracao', e.target.checked)} />
                <Checkbox label="Privacidade" checked={comparison.criterios.privacidade} onChange={e => handleCriteriaChange('privacidade', e.target.checked)} />
                <Checkbox label="Iluminação" checked={comparison.criterios.iluminacao} onChange={e => handleCriteriaChange('iluminacao', e.target.checked)} />
                <Checkbox label="Ventilação" checked={comparison.criterios.ventilacao} onChange={e => handleCriteriaChange('ventilacao', e.target.checked)} />
              </div>
              <Input label="Outros Critérios" value={comparison.criterios.outros || ""} onChange={e => handleCriteriaChange('outros', e.target.value)} />
              <Button className="w-full" variant="secondary" onClick={handleGenerateAnalysis} isLoading={isGenerating}>
                🤖 Gerar Análise Comparativa IA
              </Button>
            </div>

            <div className="space-y-4">
               <label className="text-sm font-semibold text-zinc-900">Resultado da Análise</label>
               <Textarea 
                className="h-full min-h-[300px] font-mono text-xs leading-relaxed" 
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
                placeholder="Aguardando geração da IA ou preencha manualmente..."
               />
            </div>
          </div>
        </div>
      </Card>

      <div className="flex justify-end pt-4">
        <Link to={`/projects/${projectId}/templates`}>
          <Button className="px-8 py-3 shadow-lg">
            Próximo Passo: Estudos de Ambientes 🛋️
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ProjectPlansPage;
