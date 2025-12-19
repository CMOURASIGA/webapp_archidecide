
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProjectStore } from '../store/useProjectStore.ts';
import { Button, Card, Input, Select, Textarea } from '../components/common/UI.tsx';
import { geminiService } from '../services/geminiService.ts';
import { ClientProfile, PropertyInfo, ClientType, BudgetLevel, PropertyType } from '../types/project.ts';

const ProjectProfilePage: React.FC = () => {
  const { projectId } = useParams();
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
    setIsGenerating(true);
    try {
      const text = await geminiService.generateGuidelines(geminiConfig || { model: 'gemini-3-pro-preview', lastUpdated: '' }, project);
      updateProject(project.id, (prev) => ({
        ...prev,
        diretrizesGerais: {
          id: crypto.randomUUID(),
          title: "Diretrizes",
          content: text,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          source: "gemini"
        }
      }));
    } catch (err) {
      console.error(err);
      alert("Falha ao gerar diretrizes. Verifique a configuração da sua API KEY.");
    } finally {
      setIsGenerating(false);
    }
  };

  const prioritiesList = ["Integração", "Privacidade", "Iluminação Natural", "Ventilação", "Acessibilidade", "Silêncio", "Área Verde", "Sustentabilidade"];

  return (
    <div className="space-y-8 pb-32">
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
            <Input label="Estilo Desejado" value={profile.estiloDesejado} onChange={e => handleProfileChange('estiloDesejado', e.target.value)} placeholder="Ex: Moderno e Minimalista" />
            <Select label="Orçamento" value={profile.orcamento} onChange={e => handleProfileChange('orcamento', e.target.value as BudgetLevel)}>
              <option value="baixo">Baixo (Econômico)</option>
              <option value="medio">Médio (Equilibrado)</option>
              <option value="alto">Alto (Alto Padrão)</option>
            </Select>
            <Textarea label="Rotina & Hábitos" value={profile.rotina} onChange={e => handleProfileChange('rotina', e.target.value)} placeholder="Ex: Trabalham de casa, recebem muitos convidados..." />
            
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
            <Textarea label="Restrições & Observações" value={info.restricoesRelevantes} onChange={e => handleInfoChange('restricoesRelevantes', e.target.value)} placeholder="Recuos, regras de condomínio, topografia..." />
          </div>
        </Card>
      </div>

      <Card>
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-100 pb-4">
            <div>
              <h3 className="text-xl font-bold text-zinc-900">Diretrizes do Projeto</h3>
              <p className="text-sm text-zinc-500 italic">Defina os pilares conceituais da sua proposta arquitetônica.</p>
            </div>
            <Button variant="secondary" onClick={handleGenerateGuidelines} isLoading={isGenerating} className="shadow-sm">
              ✨ Gerar com Gemini
            </Button>
          </div>
          
          <div className="relative group">
            <Textarea 
              className="min-h-[500px] w-full font-mono text-sm leading-relaxed p-8 bg-zinc-50/50 focus:bg-white border-zinc-200 transition-all rounded-xl resize-y shadow-inner"
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
              placeholder="Digite aqui as premissas do projeto, conceitos estéticos e técnicos..."
            />
            <div className="absolute top-4 right-4 text-[10px] text-zinc-300 font-mono uppercase tracking-[0.2em] pointer-events-none select-none">
              Workspace do Arquiteto
            </div>
          </div>
        </div>
      </Card>

      <div className="flex justify-end pt-4">
        <Link to={`/projects/${projectId}/plans`}>
          <Button className="px-12 py-5 shadow-2xl text-xl hover:scale-[1.02] transition-transform">
            Próximo Passo: Plantas A vs B 📐
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ProjectProfilePage;
