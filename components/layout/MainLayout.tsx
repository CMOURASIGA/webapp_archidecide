
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
    const checkKey = () => {
      // @ts-ignore
      const key = process.env.API_KEY;
      if (key && key !== "" && key !== "undefined") {
        setHasApiKey(true);
      } else {
        setHasApiKey(false);
      }
    };
    checkKey();
  }, []);

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
    <div className="flex h-screen w-full bg-zinc-50 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-zinc-200 flex flex-col">
        <div className="p-6 border-b border-zinc-100">
          <h1 className="text-xl font-black text-zinc-900 flex items-center gap-2 tracking-tight">
            <span className="bg-zinc-900 text-white w-8 h-8 flex items-center justify-center rounded-lg shadow-sm">AD</span>
            ArchiDecide
          </h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.disabled ? "#" : item.path}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all
                ${item.disabled ? 'opacity-30 cursor-not-allowed grayscale' : 'hover:bg-zinc-50 hover:text-zinc-900'}
                ${isActive && !item.disabled ? 'bg-zinc-900 text-white shadow-md shadow-zinc-200' : 'text-zinc-500'}
              `}
              onClick={(e) => item.disabled && e.preventDefault()}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {!hasApiKey && (
          <div className="p-4 m-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs">⚠️</span>
              <p className="text-[10px] text-amber-900 font-black uppercase tracking-wider">Aguardando IA</p>
            </div>
            <p className="text-[9px] text-amber-700 leading-tight font-medium">Faça o Redeploy no Vercel com a variável API_KEY.</p>
          </div>
        )}

        <div className="p-4 border-t border-zinc-100 bg-zinc-50/50">
           <div className="text-[10px] text-zinc-400 font-black uppercase tracking-[0.15em] mb-2">Projeto Ativo</div>
           <div className="text-xs font-bold truncate text-zinc-700">
             {currentProject ? currentProject.nome : "Selecione um projeto"}
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-zinc-200 px-8 flex items-center justify-between shadow-sm z-10">
          <div className="flex items-center gap-4">
            {currentProject && (
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                <span className="font-bold text-zinc-800 tracking-tight">{currentProject.nome}</span>
                <span className="px-2 py-0.5 bg-zinc-100 border border-zinc-200 rounded-md text-[9px] font-black text-zinc-400 uppercase tracking-tighter">VERSÃO {currentProject.version}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {projectId && (
               <Link to={`/projects/${projectId}/report`}>
                  <button className="bg-zinc-900 text-white px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-lg active:scale-95">
                    Exportar Relatório
                  </button>
               </Link>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-10 max-w-6xl mx-auto w-full custom-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
