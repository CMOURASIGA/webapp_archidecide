
import React from 'react';
import { Card } from '../components/common/UI';

const InstructionsPage: React.FC = () => {
  return (
    <div className="space-y-12 pb-32 max-w-4xl mx-auto px-2">
      <div className="border-b border-zinc-200 pb-8">
        <h2 className="text-4xl font-black text-zinc-900 tracking-tighter uppercase italic">Manual de Operação</h2>
        <p className="text-zinc-500 mt-2 font-medium">Domine a ferramenta e gere relatórios de alto impacto visual e técnico.</p>
      </div>

      {/* AVISO CRÍTICO DE ARMAZENAMENTO */}
      <div className="bg-amber-50 border-2 border-amber-200 p-6 md:p-8 rounded-[2rem] space-y-4 shadow-sm">
        <div className="flex items-center gap-4 text-amber-900">
          <span className="text-3xl">⚠️</span>
          <h3 className="font-black text-lg uppercase tracking-tight">Portabilidade e Segurança</h3>
        </div>
        <div className="text-sm text-amber-800 space-y-3 font-medium leading-relaxed">
          <p>
            O ArchiDecide salva os dados apenas no seu navegador atual. Para usar em outro aparelho ou garantir que não perca nada:
          </p>
          <ul className="list-disc ml-5 space-y-1">
            <li><strong>Backup JSON:</strong> Use o botão "Exportar Backup" na tela de projetos. Ele gera um arquivo com todos os seus dados.</li>
            <li><strong>Importação:</strong> No novo aparelho, clique em "Importar Backup" e selecione o arquivo gerado.</li>
            <li><strong>PDF não é Backup:</strong> O PDF é um documento de leitura. Ele <strong>não pode</strong> ser lido de volta pelo sistema para edição. Use o arquivo .json para isso.</li>
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* PASSO 1 */}
        <div className="flex gap-6 items-start">
          <span className="text-4xl font-black text-zinc-100 italic select-none">01</span>
          <Card title="Gestão de Projetos" className="flex-1 rounded-[2rem]">
            <p className="text-zinc-600 text-sm leading-relaxed">
              Crie estudos independentes. Utilize os botões de <strong>Backup</strong> para transferir seus projetos entre o computador do escritório e seu tablet pessoal.
            </p>
          </Card>
        </div>

        {/* PASSO 2 */}
        <div className="flex gap-6 items-start">
          <span className="text-4xl font-black text-zinc-100 italic select-none">02</span>
          <Card title="Perfil do Cliente" className="flex-1 rounded-[2rem]">
            <p className="text-zinc-600 text-sm leading-relaxed">
              Defina o briefing. A IA ArchiDecide criará pilares conceituais baseados na rotina do cliente, servindo de base para o relatório editorial.
            </p>
          </Card>
        </div>

        {/* PASSO 3 */}
        <div className="flex gap-6 items-start">
          <span className="text-4xl font-black text-zinc-100 italic select-none">03</span>
          <Card title="Plantas (Alpha vs Beta)" className="flex-1 rounded-[2rem]">
            <p className="text-zinc-600 text-sm leading-relaxed">
              Compare duas variações de layout. A IA atua como um revisor isento, analisando riscos, fluxos e áreas para facilitar a aprovação do cliente.
            </p>
          </Card>
        </div>

        {/* PASSO 4 */}
        <div className="flex gap-6 items-start">
          <span className="text-4xl font-black text-zinc-100 italic select-none">04</span>
          <Card title="Relatório Editorial" className="flex-1 rounded-[2rem] bg-zinc-900 text-white border-none shadow-xl">
            <p className="text-zinc-300 text-sm leading-relaxed">
              O PDF final tem design de consultoria de luxo com 6 páginas. Ele é seu entregável oficial. Lembre-se: gere o PDF sempre que concluir uma etapa importante para ter seu histórico registrado.
            </p>
          </Card>
        </div>

        <div className="p-8 border-2 border-dashed border-zinc-200 rounded-[2.5rem] text-center">
          <p className="text-zinc-400 text-xs font-black uppercase tracking-[0.3em]">ArchiDecide Professional Workflow v1.6</p>
        </div>
      </div>
    </div>
  );
};

export default InstructionsPage;
