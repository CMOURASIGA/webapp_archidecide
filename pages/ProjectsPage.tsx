
import React, { useState } from 'react';
import { useProjectStore } from '../store/useProjectStore';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Input } from '../components/common/UI';

const ProjectsPage: React.FC = () => {
  const { projects, createProject, duplicateProject, deleteProject } = useProjectStore();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProjectData, setNewProjectData] = useState({ nome: '', cliente: '' });

  const handleCreate = () => {
    if (!newProjectData.nome) return;
    createProject(newProjectData);
    setIsModalOpen(false);
    setNewProjectData({ nome: '', cliente: '' });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900">Seus Projetos</h2>
          <p className="text-zinc-500">Gerencie e organize suas análises arquitetônicas.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <span>+</span> Novo Projeto
        </Button>
      </div>

      {projects.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-16 text-center space-y-4">
          <div className="text-4xl">📂</div>
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-zinc-800">Nenhum projeto encontrado</h3>
            <p className="text-zinc-500 text-sm">Comece criando seu primeiro estudo de caso.</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>Criar meu primeiro projeto</Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p) => (
            <Card key={p.id} className="hover:border-zinc-400 transition-colors group relative">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-zinc-900 text-lg truncate pr-8">{p.nome}</h3>
                    <p className="text-sm text-zinc-500">{p.cliente || 'Cliente não informado'}</p>
                  </div>
                  <span className="text-xs text-zinc-400 whitespace-nowrap">v{p.version}</span>
                </div>
                
                <div className="text-xs text-zinc-400 space-y-1">
                  <div>Atualizado em: {new Date(p.updatedAt).toLocaleDateString()}</div>
                  <div>Relatórios: {p.reports.length}</div>
                </div>

                <div className="pt-4 flex gap-2 border-t border-zinc-100">
                  <Button variant="secondary" className="flex-1" onClick={() => navigate(`/projects/${p.id}/profile`)}>Abrir</Button>
                  <Button variant="ghost" title="Duplicar" onClick={() => duplicateProject(p.id)}>👯</Button>
                  <Button variant="ghost" className="hover:text-red-600" title="Excluir" onClick={() => { if(confirm('Excluir?')) deleteProject(p.id) }}>🗑️</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Basic Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md" title="Novo Projeto">
            <div className="space-y-4">
              <Input 
                label="Nome do Projeto *" 
                value={newProjectData.nome} 
                onChange={e => setNewProjectData({...newProjectData, nome: e.target.value})}
                placeholder="Ex: Residência Vila Nova"
              />
              <Input 
                label="Cliente" 
                value={newProjectData.cliente} 
                onChange={e => setNewProjectData({...newProjectData, cliente: e.target.value})}
                placeholder="Nome do cliente"
              />
              <div className="flex gap-3 justify-end pt-4">
                <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                <Button onClick={handleCreate} disabled={!newProjectData.nome}>Criar Projeto</Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;
