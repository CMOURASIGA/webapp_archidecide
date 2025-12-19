
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
            O arquivo .json é o backup editável. 
            <strong> Dica:</strong> Se exportar apenas um projeto, o nome do arquivo será automático (Ex: CLIENTE_PROJETO.json), facilitando sua organização.
          </p>
        </div>
      </div>

      {/* AVISO DE ARMAZENAMENTO */}
      <div className="bg-amber-50 border-2 border-amber-200 p-8 rounded-[2rem] space-y-4">
        <h3 className="font-black text-amber-900 text-lg uppercase tracking-tight flex items-center gap-3">
          <span>⚠️</span> Atenção ao Dispositivo
        </h3>
        <p className="text-sm text-amber-800 leading-relaxed font-medium">
          Tudo é salvo no <strong>armazenamento local do seu navegador</strong>. 
          Use a função "Exportar Backup" para baixar seus projetos seletivamente e movê-los entre diferentes aparelhos ou fazer cópias de segurança.
        </p>
      </div>

      <div className="space-y-8">
        <h3 className="text-xs font-black text-zinc-400 uppercase tracking-[0.3em] text-center">Fluxo de Backup e Portabilidade</h3>
        
        <div className="flex gap-6 items-start">
          <span className="text-4xl font-black text-zinc-100 italic">01</span>
          <Card title="Exportação Seletiva" className="flex-1 rounded-[2rem]">
            <p className="text-zinc-600 text-sm leading-relaxed">
              Ao clicar em <strong>Exportar Backup</strong> na tela de projetos, você pode escolher exatamente quais estudos quer salvar em um único arquivo .json.
            </p>
          </Card>
        </div>

        <div className="flex gap-6 items-start">
          <span className="text-4xl font-black text-zinc-100 italic">02</span>
          <Card title="Nomenclatura Inteligente" className="flex-1 rounded-[2rem]">
            <p className="text-zinc-600 text-sm leading-relaxed">
              Ao exportar um único item, o sistema nomeia o arquivo como <strong>CLIENTE_PROJETO_BACKUP.json</strong>. Isso ajuda você a encontrar o arquivo certo em suas pastas do sistema.
            </p>
          </Card>
        </div>

        <div className="flex gap-6 items-start">
          <span className="text-4xl font-black text-zinc-100 italic">03</span>
          <Card title="Importação e Mesclagem" className="flex-1 rounded-[2rem] border-zinc-900 border-2">
            <p className="text-zinc-600 text-sm leading-relaxed">
              Ao usar <strong>Importar Backup</strong>, o ArchiDecide mescla os projetos do arquivo com os que você já tem no navegador, sem apagar seus projetos atuais.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InstructionsPage;
