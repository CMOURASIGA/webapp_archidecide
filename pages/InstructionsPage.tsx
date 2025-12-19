
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
          <h3 className="font-black text-lg uppercase tracking-tight">Aviso Importante: Seus Dados</h3>
        </div>
        <div className="text-sm text-amber-800 space-y-3 font-medium leading-relaxed">
          <p>
            O ArchiDecide utiliza a tecnologia <strong>Local Storage</strong>. Isso significa que todas as informações que você insere ficam salvas <strong>exclusivamente na memória do navegador do aparelho que você está usando agora</strong>.
          </p>
          <ul className="list-disc ml-5 space-y-1">
            <li>Se você abrir este site em outro computador, tablet ou celular, os projetos atuais <strong>não estarão lá</strong>.</li>
            <li>Se você limpar os dados de navegação ou o cache do seu navegador, as informações serão apagadas.</li>
            <li><strong>Recomendação:</strong> Sempre gere e salve o relatório final em PDF. Ele é a única forma de garantir que seu trabalho esteja seguro e disponível para ser acessado em qualquer lugar.</li>
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* PASSO 1 */}
        <div className="flex gap-6 items-start">
          <span className="text-4xl font-black text-zinc-100 italic select-none">01</span>
          <Card title="Gestão de Projetos" className="flex-1 rounded-[2rem]">
            <p className="text-zinc-600 text-sm leading-relaxed">
              Na tela inicial, você organiza sua carteira. Cada projeto é um "Estudo de Caso" independente. Use o botão <strong>Duplicar</strong> para testar variações de um mesmo cliente sem perder o histórico do estudo original.
            </p>
          </Card>
        </div>

        {/* PASSO 2 */}
        <div className="flex gap-6 items-start">
          <span className="text-4xl font-black text-zinc-100 italic select-none">02</span>
          <Card title="Perfil do Cliente" className="flex-1 rounded-[2rem]">
            <p className="text-zinc-600 text-sm leading-relaxed">
              Aqui você define o "Briefing". Informe o estilo, rotina e orçamento. Ao clicar em <strong>Gerar com Gemini</strong>, a IA criará pilares conceituais baseados na psicologia do seu cliente, que servirão de base para o seu relatório técnico.
            </p>
          </Card>
        </div>

        {/* PASSO 3 */}
        <div className="flex gap-6 items-start">
          <span className="text-4xl font-black text-zinc-100 italic select-none">03</span>
          <Card title="Plantas (Alpha vs Beta)" className="flex-1 rounded-[2rem]">
            <p className="text-zinc-600 text-sm leading-relaxed">
              Este é o coração da ferramenta. Descreva suas duas ideias de layout (Alpha e Beta). A IA fará o papel de um <strong>revisor técnico isento</strong>, comparando áreas, fluxos e iluminação, ajudando você a provar para o cliente qual opção é a mais viável.
            </p>
          </Card>
        </div>

        {/* PASSO 4 */}
        <div className="flex gap-6 items-start">
          <span className="text-4xl font-black text-zinc-100 italic select-none">04</span>
          <Card title="Templates de Ambientes" className="flex-1 rounded-[2rem]">
            <p className="text-zinc-600 text-sm leading-relaxed">
              Use esta seção para detalhar cômodos específicos (Cozinha, Suíte, etc). A IA sugere materiais, mobiliário e iluminação que se encaixam no orçamento definido, poupando seu tempo na redação de especificações técnicas.
            </p>
          </Card>
        </div>

        {/* PASSO 5 */}
        <div className="flex gap-6 items-start">
          <span className="text-4xl font-black text-zinc-100 italic select-none">05</span>
          <Card title="Exportação e Entrega" className="flex-1 rounded-[2rem] bg-zinc-900 text-white border-none shadow-xl">
            <p className="text-zinc-300 text-sm leading-relaxed">
              Na aba de <strong>Relatório</strong>, compile tudo. O sistema organiza as 6 páginas do seu estudo editorial. Clique em <strong>Gerar PDF</strong> para baixar o arquivo. Lembre-se: o PDF é o seu produto final e o backup oficial do seu projeto.
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
