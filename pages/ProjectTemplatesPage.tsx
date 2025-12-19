
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useProjectStore } from '../store/useProjectStore';
import { Button, Card, Input, Select, Textarea } from '../components/common/UI';
import { geminiService } from '../services/geminiService';
import { TemplateType, TemplateInput, TemplateResult, BudgetLevel } from '../types/project';

const ProjectTemplatesPage: React.FC = () => {
  const { projectId } = useParams();
  const { projects, updateProject, geminiConfig } = useProjectStore();
  const project = projects.find(p => p.id === projectId);

  const [input, setInput] = useState<TemplateInput>({
    id: crypto.randomUUID(),
    templateType: "sala_estar",
    tamanhoAproximado: "",
    estilo: "",
    orcamento: "medio",
    preferencias: "",
    createdAt: new Date().toISOString()
  });

  const [isGenerating, setIsGenerating] = useState(false);

  if (!project) return <div>Projeto não encontrado.</div>;

  const handleGenerate = async () => {
    if (!geminiConfig) return alert("Configure Gemini");
    setIsGenerating(true);
    try {
      const resultText = await geminiService.generateTemplateRecommendations(geminiConfig, input, project.clientProfile);
      
      const result: TemplateResult = {
        id: crypto.randomUUID(),
        templateInputId: input.id,
        conceitoAmbiente: {
          id: crypto.randomUUID(),
          title: `Estudo: ${input.templateType}`,
          content: resultText,
          source: "gemini",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        recomendacoesPraticas: null,
        pontosAtencao: null,
        opcoesPorOrcamento: null
      };

      updateProject(project.id, prev => ({
        ...prev,
        templatesInputs: [...prev.templatesInputs, input],
        templatesResults: [...prev.templatesResults, result]
      }));
      
      // Reset input for next
      setInput({ ...input, id: crypto.randomUUID(), createdAt: new Date().toISOString() });
    } catch (err) {
      console.error(err);
      alert("Erro ao gerar");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card title="Novo Estudo de Ambiente">
            <div className="space-y-4">
              <Select label="Tipo de Ambiente" value={input.templateType} onChange={e => setInput({...input, templateType: e.target.value as TemplateType})}>
                <option value="sala_estar">Sala de Estar</option>
                <option value="cozinha">Cozinha</option>
                <option value="quarto">Quarto</option>
                <option value="banheiro">Banheiro</option>
                <option value="area_gourmet">Área Gourmet</option>
                <option value="casa_completa">Casa Completa (Conceito)</option>
              </Select>
              <Input label="Tamanho Aprox. (m²)" value={input.tamanhoAproximado} onChange={e => setInput({...input, tamanhoAproximado: e.target.value})} />
              <Input label="Estilo" value={input.estilo} onChange={e => setInput({...input, estilo: e.target.value})} placeholder="Ex: Rústico moderno" />
              <Select label="Orçamento do Ambiente" value={input.orcamento} onChange={e => setInput({...input, orcamento: e.target.value as BudgetLevel})}>
                <option value="baixo">Econômico</option>
                <option value="medio">Equilibrado</option>
                <option value="alto">Premium</option>
              </Select>
              <Textarea label="Preferências Específicas" value={input.preferencias} onChange={e => setInput({...input, preferencias: e.target.value})} placeholder="Ex: Ilha central, adega, luz amarela..." />
              <Button className="w-full" onClick={handleGenerate} isLoading={isGenerating}>Gerar Recomendações</Button>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-bold text-zinc-900">Estudos Realizados</h3>
          {project.templatesResults.length === 0 ? (
            <div className="text-center py-12 bg-white border border-zinc-200 rounded-xl text-zinc-400 text-sm">Nenhum estudo gerado ainda.</div>
          ) : (
            project.templatesResults.map((res, idx) => (
              <Card key={res.id} title={res.conceitoAmbiente?.title || `Estudo ${idx + 1}`}>
                <div className="whitespace-pre-wrap text-sm text-zinc-600 font-mono leading-relaxed bg-zinc-50 p-4 rounded-lg">
                  {res.conceitoAmbiente?.content}
                </div>
              </Card>
            )).reverse()
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectTemplatesPage;
