
import React from 'react';
import { Card } from '../components/common/UI';

const InstructionsPage: React.FC = () => {
  return (
    <div className="space-y-12 pb-32 max-w-4xl mx-auto px-2">
      <div className="border-b border-zinc-200 pb-8">
        <h2 className="text-4xl font-black text-zinc-900 tracking-tighter uppercase italic">Manual de Operação</h2>
        <p className="text-zinc-500 mt-2 font-medium">Domine a ferramenta e garanta a segurança das suas informações.</p>
      </div>

      {/* CARD DE ENTENDIMENTO DE DADOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-zinc-900 text-white p-8 rounded-[2rem] space-y-4 shadow-xl">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📄</span>
            <h3 className="font-black uppercase tracking-tight">O PDF é a Entrega</h3>
          </div>
          <p className="text-zinc-400 text-xs leading-relaxed font-medium">
            O arquivo PDF é o seu produto final. Ele serve para o cliente ler e se encantar. 
            <strong> Importante:</strong> O sistema não consegue ler um PDF de volta para edição.
          </p>
        </div>
        <div className="bg-blue-600 text-white p-8 rounded-[2rem] space-y-4 shadow-xl">
          <div className="flex items-center gap-3">
            <span className="text-2xl">💾</span>
            <h3 className="font-black uppercase tracking-tight">O JSON é o Backup</h3>
          </div>
          <p className="text-blue-100 text-xs leading-relaxed font-medium">
            O arquivo .json contém toda a "inteligência" do projeto. É com ele que você leva o seu trabalho para outro computador ou tablet. 
            <strong> Sempre salve este arquivo</strong> para continuar editando depois.
          </p>
        </div>
      </div>

      {/* AVISO DE ARMAZENAMENTO */}
      <div className="bg-amber-50 border-2 border-amber-200 p-8 rounded-[2rem] space-y-4">
        <h3 className="font-black text-amber-900 text-lg uppercase tracking-tight flex items-center gap-3">
          <span>⚠️</span> Atenção ao Dispositivo
        </h3>
        <p className="text-sm text-amber-800 leading-relaxed font-medium">
          O ArchiDecide não utiliza nuvem centralizada para sua privacidade. Tudo é salvo no <strong>armazenamento local do seu navegador</strong>. 
          Se você mudar de computador ou limpar o histórico do navegador sem ter o backup .json, <strong>os dados serão perdidos</strong>.
        </p>
      </div>

      <div className="space-y-8">
        <h3 className="text-xs font-black text-zinc-400 uppercase tracking-[0.3em] text-center">Fluxo de Trabalho Recomendado</h3>
        
        <div className="flex gap-6 items-start">
          <span className="text-4xl font-black text-zinc-100 italic">01</span>
          <Card title="Início e Briefing" className="flex-1 rounded-[2rem]">
            <p className="text-zinc-600 text-sm leading-relaxed">
              Crie o projeto e preencha o perfil. Use a IA para gerar as diretrizes iniciais que dão o tom do relatório.
            </p>
          </Card>
        </div>

        <div className="flex gap-6 items-start">
          <span className="text-4xl font-black text-zinc-100 italic">02</span>
          <Card title="Comparativo A vs B" className="flex-1 rounded-[2rem]">
            <p className="text-zinc-600 text-sm leading-relaxed">
              Insira as áreas e descrições das plantas. Deixe a IA analisar os riscos e vantagens técnicas de cada uma.
            </p>
          </Card>
        </div>

        <div className="flex gap-6 items-start">
          <span className="text-4xl font-black text-zinc-100 italic">03</span>
          <Card title="Exportação Dupla" className="flex-1 rounded-[2rem] border-zinc-900 border-2">
            <p className="text-zinc-600 text-sm leading-relaxed">
              Ao finalizar, baixe o <strong>PDF</strong> para enviar ao cliente e o <strong>BACKUP (.json)</strong> para sua pasta de arquivos do projeto. Assim você nunca perde o progresso.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InstructionsPage;
