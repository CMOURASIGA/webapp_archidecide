
import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-[#fcfcfc] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Elementos Decorativos de Fundo */}
      <div className="absolute top-0 left-0 w-full h-1 bg-zinc-900"></div>
      <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-zinc-100 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-zinc-50 rounded-full blur-3xl opacity-50"></div>

      <div className="max-w-4xl w-full text-center space-y-12 z-10 animate-in fade-in zoom-in duration-1000">
        
        {/* Logo Centralizado */}
        <div className="flex flex-col items-center gap-6">
          <div className="w-24 h-24 bg-zinc-900 text-white rounded-[2rem] flex items-center justify-center text-4xl font-black italic shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500 cursor-default">
            AD
          </div>
          <div className="space-y-2">
            <h1 className="text-6xl md:text-8xl font-black text-zinc-900 tracking-tighter uppercase italic leading-none">
              Archi<span className="text-zinc-300">Decide</span>
            </h1>
            <p className="text-[10px] md:text-xs font-black text-zinc-400 uppercase tracking-[0.5em] ml-2">
              Professional Decision Support Suite
            </p>
          </div>
        </div>

        {/* Descrição Curta */}
        <p className="text-zinc-500 text-sm md:text-lg max-w-xl mx-auto font-medium leading-relaxed">
          Transforme dados técnicos em decisões assertivas. 
          A plataforma estratégica para arquitetos que buscam excelência em consultoria e viabilidade de layout.
        </p>

        {/* Botão de Entrada */}
        <div className="pt-8">
          <button 
            onClick={() => navigate('/projects')}
            className="group relative px-12 py-5 bg-zinc-900 text-white rounded-2xl font-black text-lg uppercase tracking-widest overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_20px_50px_rgba(0,0,0,0.1)]"
          >
            <span className="relative z-10">Entrar no Sistema</span>
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          </button>
          
          <div className="mt-8 flex items-center justify-center gap-4 text-[9px] font-black text-zinc-300 uppercase tracking-widest">
            <span>v1.8.0 Stable</span>
            <span className="w-1 h-1 bg-zinc-200 rounded-full"></span>
            <span>Inteligência Artificial Ativa</span>
          </div>
        </div>
      </div>

      {/* Footer Minimalista */}
      <footer className="absolute bottom-10 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
        © {new Date().getFullYear()} ARCHIDECIDE STUDIO · CONSULTORIA ESTRATÉGICA
      </footer>
    </div>
  );
};

export default LandingPage;
