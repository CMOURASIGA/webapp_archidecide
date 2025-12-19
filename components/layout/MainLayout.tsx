
import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useParams, Link, useLocation } from 'react-router-dom';
import { useProjectStore } from '../../store/useProjectStore.ts';
import { Button } from '../common/UI.tsx';

const MainLayout: React.FC = () => {
  const { projectId } = useParams();
  const { projects } = useProjectStore();
  const location = useLocation();
  const currentProject = projects.find(p => p.id === projectId);
  const [hasApiKey, setHasApiKey] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const checkKey = () => {
      // @ts-ignore
      const key = process.env.API_KEY;
      setHasApiKey(!!(key && key !== "" && key !== "undefined"));
    };
    checkKey();
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

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
    <div className="flex h-screen w-full bg-[#fcfcfc] overflow-hidden font-sans flex-col md:flex-row">
      
      {/* Mobile Header */}
      <header className="md:hidden h-16 bg-white border-b border-zinc-200 px-4 flex items-center justify-between z-50 flex-shrink-0">
        <h1 className="text-lg font-black text-zinc-900 flex items-center gap-2">
          <span className="bg-zinc-900 text-white w-7 h-7 flex items-center justify-center rounded-lg">AD</span>
          ArchiDecide
        </h1>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-zinc-600 focus:outline-none text-2xl"
        >
          {isMobileMenuOpen ? "✕" : "☰"}
        </button>
      </header>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-zinc-200 flex flex-col transition-transform duration-300 ease-in-out h-full
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0
      `}>
        {/* Topo da Sidebar */}
        <div className="p-6 border-b border-zinc-100 flex-shrink-0">
          <h1 className="text-xl font-black text-zinc-900 flex items-center gap-2 tracking-tight">
            <span className="bg-zinc-900 text-white w-8 h-8 flex items-center justify-center rounded-lg shadow-sm">AD</span>
            ArchiDecide
          </h1>
        </div>
        
        {/* Menu de Navegação - Com Scroll Corrigido */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto min-h-0 custom-scrollbar-light">
          {menuItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.disabled ? "#" : item.path}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition-all
                ${item.disabled ? 'opacity-30 cursor-not-allowed grayscale' : 'hover:bg-zinc-50 hover:text-zinc-900'}
                ${isActive && !item.disabled ? 'bg-zinc-900 text-white shadow-md' : 'text-zinc-500'}
              `}
              onClick={(e) => item.disabled && e.preventDefault()}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Rodapé da Sidebar */}
        <div className="flex-shrink-0">
          {!hasApiKey && (
            <div className="p-4 m-4 bg-amber-50 border border-amber-200 rounded-2xl">
              <p className="text-[9px] text-amber-900 font-black uppercase tracking-wider mb-1">Aguardando IA</p>
              <p className="text-[9px] text-amber-700 leading-tight">Configure a API_KEY nas configurações.</p>
            </div>
          )}

          <div className="p-4 border-t border-zinc-100 bg-zinc-50/50">
             <div className="text-[9px] text-zinc-400 font-black uppercase tracking-[0.15em] mb-1">Projeto Ativo</div>
             <div className="text-xs font-bold truncate text-zinc-700">
               {currentProject ? currentProject.nome : "Selecione um projeto"}
             </div>
          </div>
        </div>
      </aside>

      {/* Overlay Mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/30 z-30 md:hidden" 
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Área de Conteúdo */}
      <div className="flex-1 flex flex-col overflow-hidden h-full">
        <header className="hidden md:flex h-16 bg-white border-b border-zinc-200 px-8 items-center justify-between shadow-sm z-10 flex-shrink-0">
          <div className="flex items-center gap-4">
            {currentProject && (
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <span className="font-bold text-zinc-800 tracking-tight">{currentProject.nome}</span>
                <span className="px-2 py-0.5 bg-zinc-100 border border-zinc-200 rounded-md text-[9px] font-black text-zinc-400 uppercase">V{currentProject.version}</span>
              </div>
            )}
          </div>
          {projectId && (
             <Link to={`/projects/${projectId}/report`}>
                <button className="bg-zinc-900 text-white px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-lg">
                  Exportar PDF
                </button>
             </Link>
          )}
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-10 w-full max-w-7xl mx-auto custom-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
