
import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useParams, Link } from 'react-router-dom';
import { useProjectStore } from '../../store/useProjectStore.ts';
import { Button } from '../common/UI.tsx';

const MainLayout: React.FC = () => {
  const { projectId } = useParams();
  const { projects } = useProjectStore();
  const currentProject = projects.find(p => p.id === projectId);
  const [hasApiKey, setHasApiKey] = useState(true);

  useEffect(() => {
    const checkKey = async () => {
      if (window.aistudio?.hasSelectedApiKey) {
        const selected = await window.aistudio.hasSelectedApiKey();
        setHasApiKey(selected);
      }
    };
    checkKey();
  }, []);

  const handleSelectKey = async () => {
    if (window.aistudio?.openSelectKey) {
      await window.aistudio.openSelectKey();
      setHasApiKey(true);
    }
  };

  const menuItems = [
    { label: "Projetos", icon: "📁", path: "/projects" },
    { label: "Instruções", icon: "📖", path: "/instructions" },
    { label: "Perfil & Requisitos", icon: "👤", path: `/projects/${projectId}/profile`, disabled: !projectId },
    { label: "Plantas (A vs B)", icon: "📐", path: `/projects/${projectId}/plans`, disabled: !projectId },
    { label: "Templates", icon: "🛋️", path: `/projects/${projectId}/templates`, disabled: !projectId },
    { label: "Relatório", icon: "📄", path: `/projects/${projectId}/report`, disabled: !projectId },
    { label: "Configurações", icon: "⚙️", path: "/settings/gemini" },
  ];

  return (
    <div className="flex h-screen w-full bg-zinc-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-zinc-200 flex flex-col">
        <div className="p-6 border-b border-zinc-100">
          <h1 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
            <span className="bg-zinc-900 text-white p-1 rounded">AD</span>
            ArchiDecide
          </h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.disabled ? "#" : item.path}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                ${item.disabled ? 'opacity-40 cursor-not-allowed' : 'hover:bg-zinc-100'}
                ${isActive && !item.disabled ? 'bg-zinc-100 text-zinc-900' : 'text-zinc-500'}
              `}
              onClick={(e) => item.disabled && e.preventDefault()}
            >
              <span>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {!hasApiKey && (
          <div className="p-4 m-4 bg-amber-50 border border-amber-200 rounded-xl space-y-2">
            <p className="text-[10px] text-amber-800 font-bold uppercase">IA Desativada</p>
            <p className="text-[10px] text-amber-700">Clique abaixo para ativar as funções de IA.</p>
            <Button variant="secondary" className="w-full text-[10px] py-1 h-auto bg-white border-amber-300" onClick={handleSelectKey}>
              Ativar Gemini
            </Button>
          </div>
        )}

        <div className="p-4 border-t border-zinc-100 bg-zinc-50/50">
           <div className="text-xs text-zinc-400 font-semibold uppercase tracking-wider mb-2">Sessão Atual</div>
           <div className="text-sm font-medium truncate text-zinc-700">
             {currentProject ? currentProject.nome : "Nenhum projeto selecionado"}
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-zinc-200 px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {currentProject && (
              <div className="flex items-center gap-2">
                <span className="text-zinc-400">Projeto:</span>
                <span className="font-semibold text-zinc-800">{currentProject.nome}</span>
                <span className="px-2 py-0.5 bg-zinc-100 rounded-full text-[10px] text-zinc-500 uppercase">v{currentProject.version}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {projectId && (
               <Link to={`/projects/${projectId}/report`}>
                  <button className="bg-zinc-900 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-zinc-800 transition-all">
                    Gerar PDF
                  </button>
               </Link>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 max-w-6xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
