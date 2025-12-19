
import React, { useState, useRef } from 'react';
import { useProjectStore } from '../store/useProjectStore';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Input } from '../components/common/UI';

const ProjectsPage: React.FC = () => {
  const { projects, createProject, duplicateProject, deleteProject, loadInitialData } = useProjectStore();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProjectData, setNewProjectData] = useState({ nome: '', cliente: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCreate = () => {
    if (!newProjectData.nome) return;
    createProject(newProjectData);
    setIsModalOpen(false);
    setNewProjectData({ nome: '', cliente: '' });
  };

  const exportBackup = () => {
    const data = localStorage.getItem("archidecide_projects");
    if (!data) return alert("Nenhum dado para exportar.");
    
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ARCHIDECIDE_BACKUP_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = event.target?.result as string;
        // Validação básica
        JSON.parse(json); 
        localStorage.setItem("archidecide_projects", json);
        loadInitialData(); // Recarrega o store
        alert("Backup importado com sucesso!");
      } catch (err) {
        alert("Erro ao importar: Arquivo inválido.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-200 pb-8">
        <div>
          <h2 className="text-4xl font-black text-zinc-900 tracking-tighter uppercase italic">Seus Projetos</h2>
          <p className="text-zinc-500 font-medium">Gestão técnica e portabilidade de dados.</p>
        </div>
        <div className="flex flex-wrap gap-2">
           <Button variant="secondary" className="text-[10px] uppercase font-black tracking-widest" onClick={exportBackup}>
             📥 Exportar Backup
           </Button>
           <Button variant="secondary" className="text-[10px] uppercase font-black tracking-widest" onClick={() => fileInputRef.current?.click()}>
             📤 Importar Backup
           </Button>
           <input type="file" ref={fileInputRef} onChange={importBackup} className="hidden" accept=".json" />
           <Button onClick={() => setIsModalOpen(true)} className="bg-zinc-900 text-white px-6 py-3 rounded-xl font-black uppercase tracking-widest shadow-lg hover:scale-105 transition-all">
             + Novo Projeto
           </Button>
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center space-y-6 bg-zinc-50 rounded-[3rem] border-2 border-dashed border-zinc-200">
          <div className="text-6xl grayscale opacity-30">📁</div>
          <div className="space-y-2">
            <h3 className="text-xl font-black text-zinc-800 uppercase italic">Nenhum projeto ativo</h3>
            <p className="text-zinc-400 text-sm max-w-xs mx-auto">Comece um novo estudo ou importe um backup realizado em outro aparelho.</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)} className="px-10">Criar Projeto</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p) => (
            <div key={p.id} className="group bg-white border border-zinc-200 rounded-[2rem] p-6 hover:shadow-2xl hover:border-zinc-900 transition-all relative overflow-hidden flex flex-col justify-between min-h-[220px]">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-zinc-100 px-2 py-1 rounded text-[9px] font-black text-zinc-400 uppercase tracking-widest">
                    V{p.version}
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => duplicateProject(p.id)} className="p-2 hover:bg-zinc-50 rounded-full transition-colors" title="Duplicar">👯</button>
                    <button onClick={() => { if(confirm('Excluir projeto permanentemente?')) deleteProject(p.id) }} className="p-2 hover:bg-red-50 text-zinc-300 hover:text-red-500 rounded-full transition-colors" title="Excluir">🗑️</button>
                  </div>
                </div>
                
                <h3 className="font-black text-zinc-900 text-xl truncate mb-1 uppercase tracking-tight italic">{p.nome}</h3>
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">{p.cliente || 'Sem cliente definido'}</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4 text-[10px] font-black text-zinc-300 uppercase tracking-tighter">
                  <span>Modificado: {new Date(p.updatedAt).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>{p.reports.length} PDFs</span>
                </div>
                <Button variant="primary" className="w-full py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px]" onClick={() => navigate(`/projects/${p.id}/profile`)}>
                  Gerenciar Projeto
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[100] animate-in fade-in duration-300">
          <Card className="w-full max-w-md rounded-[2.5rem] shadow-2xl border-none p-10" title="Novo Estudo de Caso">
            <div className="space-y-6">
              <Input 
                label="Nome do Projeto *" 
                value={newProjectData.nome} 
                onChange={e => setNewProjectData({...newProjectData, nome: e.target.value})}
                placeholder="Ex: Residência Vila Nova"
                className="font-bold h-12"
              />
              <Input 
                label="Cliente" 
                value={newProjectData.cliente} 
                onChange={e => setNewProjectData({...newProjectData, cliente: e.target.value})}
                placeholder="Nome do cliente"
                className="font-bold h-12"
              />
              <div className="flex gap-3 justify-end pt-6">
                <Button variant="ghost" onClick={() => setIsModalOpen(false)} className="font-black uppercase tracking-widest text-xs">Cancelar</Button>
                <Button onClick={handleCreate} disabled={!newProjectData.nome} className="px-8 font-black uppercase tracking-widest text-xs">Criar Estudo</Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;
