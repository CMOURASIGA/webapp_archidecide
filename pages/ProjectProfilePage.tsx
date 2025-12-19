
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProjectStore } from '../store/useProjectStore';
import { Button, Card, Input, Select, Textarea, Checkbox } from '../components/common/UI';
import { geminiService } from '../services/geminiService';
import { ClientProfile, PropertyInfo, ClientType, BudgetLevel, PropertyType } from '../types/project';

const ProjectProfilePage: React.FC = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { projects, updateProject, geminiConfig } = useProjectStore();
  const project = projects.find(p => p.id === projectId);
  
  const [isGenerating, setIsGenerating] = useState(false);

  if (!project) return <div>Projeto não encontrado.</div>;

  const profile: ClientProfile = project.clientProfile || {
    tipoCliente: "casal",
    numeroMoradores: 1,
    pets: "",
    rotina: "",
    estiloDesejado: "",
    orcamento: "medio",
    prioridades: []
  };

  const info: PropertyInfo = project.propertyInfo || {
    metragemTotal: null,
    numeroQuartos: null,
    numeroBanheiros: null,
    tipoImovel: "casa_terrea",
    restricoesRelevantes: ""
  };

  const handleProfileChange = (field: keyof ClientProfile, value: any) => {
    updateProject(project.id, (prev) => ({
      ...prev,
      clientProfile: { ...profile, [field]: value }
    }));
  };

  const handleInfoChange = (field: keyof PropertyInfo, value: any) => {
    updateProject(project.id, (prev) => ({
      ...prev,
      propertyInfo: { ...info, [field]: value }
    }));
  };

  const togglePriority = (tag: string) => {
    const next = profile.prioridades.includes(tag) 
      ? profile.prioridades.filter(t => t !== tag)
      : [...profile.prioridades, tag];
    handleProfileChange('prioridades', next);
  };

  const handleGenerateGuidelines = async () => {
    if (!geminiConfig) {
      alert("Configure o Gemini primeiro nas configurações.");
      navigate("/settings/gemini");
      return;
    }
    setIsGenerating(true);
    try {
      const text = await geminiService.generateGuidelines(geminiConfig, project);
      updateProject(project.id, (prev) => ({
        ...prev,
        diretrizesGerais: {
          id: crypto.randomUUID(),
          title: "Diretrizes Sugeridas pela IA",
          content: text,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          source: "gemini"
        }
      }));
    } catch (err) {
      console.error(err);
      alert("Falha ao gerar diretrizes. Verifique sua chave API.");
    } finally {
      setIsGenerating(false);
    }
  };

  const prioritiesList = ["Integração", "Privacidade", "Iluminação Natural", "Ventilação", "Acessibilidade", "Silêncio", "Área Verde", "Sustentabilidade"];

  return (
    <div className="space-y-8 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card title="Perfil do Cliente">
          <div className="space-y-4">
            <Select label="Tipo de Cliente" value={profile.tipoCliente} onChange={e => handleProfileChange('tipoCliente', e.target.value as ClientType)}>
              <option value="casal">Casal</option>
              <option value="familia">Família</option>
              <option value="solteiro">Solteiro</option>
              <option value="outro">Outro</option>
            </Select>
            <Input label="Nº de Moradores" type="number" value={profile.numeroMoradores || 1} onChange={e => handleProfileChange('numeroMoradores', parseInt(e.target.value))} />
            <Input label="Estilo Desejado" value={profile.estiloDesejado} onChange={e => handleProfileChange('estiloDesejado', e.target.value)} placeholder="Ex: Minimalista Escandinavo" />
            <Select label="Orçamento" value={profile.orcamento} onChange={e => handleProfileChange('orcamento', e.target.value as BudgetLevel)}>
              <option value="baixo">Baixo (Custo-benefício)</option>
              <option value="medio">Médio (Intermediário)</option>
              <option value="alto">Alto (Alto Padrão)</option>
            </Select>
            <Textarea label="Rotina & Hábitos" value={profile.rotina} onChange={e => handleProfileChange('rotina', e.target.value)} placeholder="Ex: Trabalham de casa, recebem amigos nos finais de semana..." />
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700">Prioridades do Projeto</label>
              <div className="flex flex-wrap gap-2">
                {prioritiesList.map(tag => (
                  <button 
                    key={tag}
                    onClick={() => togglePriority(tag)}
                    className={`px-3 py-1 rounded-full text-xs border transition-all ${profile.prioridades.includes(tag) ? 'bg-zinc-900 border-zinc-900 text-white' : 'bg-white border-zinc-200 text-zinc-600 hover:border-zinc-400'}`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Card title="Imóvel / Terreno">
          <div className="space-y-4">
            <Select label="Tipo de Imóvel" value={info.tipoImovel} onChange={e => handleInfoChange('tipoImovel', e.target.value as PropertyType)}>
              <option value="casa_terrea">Casa Térrea</option>
              <option value="sobrado">Sobrado</option>
              <option value="apartamento">Apartamento</option>
            </Select>
            <Input label="Metragem Total (m²)" type="number" value={info.metragemTotal || ''} onChange={e => handleInfoChange('metragemTotal', parseFloat(e.target.value))} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Quartos" type="number" value={info.numeroQuartos || ''} onChange={e => handleInfoChange('numeroQuartos', parseInt(e.target.value))} />
              <Input label="Banheiros" type="number" value={info.numeroBanheiros || ''} onChange={e => handleInfoChange('numeroBanheiros', parseInt(e.target.value))} />
            </div>
            <Textarea label="Restrições & Observações" value={info.restricoesRelevantes} onChange={e => handleInfoChange('restricoesRelevantes', e.target.value)} placeholder="Ex: Recuo frontal de 5m, condomínio não permite..." />
          </div>
        </Card>
      </div>

      <Card title="Diretrizes do Projeto">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-zinc-500">Gere ou escreva os pilares fundamentais para o desenvolvimento do projeto.</p>
            <Button variant="secondary" onClick={handleGenerateGuidelines} isLoading={isGenerating}>
              ✨ Gerar com Gemini
            </Button>
          </div>
          <Textarea 
            className="min-h-[300px] font-mono text-sm"
            value={project.diretrizesGerais?.content || ""}
            onChange={e => updateProject(project.id, prev => ({
              ...prev,
              diretrizesGerais: {
                id: prev.diretrizesGerais?.id || crypto.randomUUID(),
                title: "Diretrizes",
                content: e.target.value,
                source: "manual",
                createdAt: prev.diretrizesGerais?.createdAt || new Date().toISOString(),
                updatedAt: new Date().toISOString()
              }
            }))}
            placeholder="Aguardando diretrizes ou digite aqui suas observações técnicas..."
          />
        </div>
      </Card>
    </div>
  );
};

export default ProjectProfilePage;
