
import React from 'react';
import { Card } from '../components/common/UI';

const StepNumber: React.FC<{ num: string }> = ({ num }) => (
  <div className="flex-shrink-0 w-16 h-16 bg-zinc-900 text-white rounded-2xl flex items-center justify-center text-2xl font-black italic shadow-xl rotate-3 group-hover:rotate-0 transition-transform">
    {num}
  </div>
);

const InstructionsPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto pb-40 space-y-20 px-4">
      
      {/* HEADER HERO */}
      <div className="relative pt-10 border-b border-zinc-200 pb-16">
        <div className="absolute -top-4 -left-4 text-[120px] font-black text-zinc-50 select-none -z-10 tracking-tighter uppercase italic">
          Manual
        </div>
        <h1 className="text-6xl font-black text-zinc-900 tracking-tighter uppercase italic leading-none">
          Fluxo de <br />Trabalho <span className="text-zinc-400">ArchiDecide</span>
        </h1>
        <p className="mt-6 text-zinc-500 font-medium text-lg max-w-2xl leading-relaxed">
          Domine a metodologia que transforma dados técnicos em decisões assertivas e relatórios de alto padrão visual para seus clientes.
        </p>
      </div>

      {/* METODOLOGIA PASSO A PASSO */}
      <div className="grid grid-cols-1 gap-16 relative">
        {/* Linha conectora visual (Desktop) */}
        <div className="hidden md:block absolute left-8 top-0 bottom-0 w-[2px] bg-zinc-100 -z-10"></div>

        {/* PASSO 01 */}
        <div className="flex flex-col md:flex-row gap-8 group">
          <StepNumber num="01" />
          <div className="flex-1 space-y-4">
            <h3 className="text-2xl font-black text-zinc-900 uppercase tracking-tighter italic">Fundação do Projeto</h3>
            <Card className="rounded-[2.5rem] border-none shadow-lg bg-white p-8">
              <p className="text-zinc-600 text-sm leading-relaxed mb-6">
                Tudo começa na aba <strong>Projetos</strong>. Você pode criar um novo estudo do zero ou importar um arquivo <strong>.JSON</strong> de backup recebido de um colega ou de outro dispositivo seu.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                  <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block mb-2">Ação Principal</span>
                  <p className="text-xs font-bold text-zinc-800">Botão "+ Novo Projeto" para iniciar o briefing.</p>
                </div>
                <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                  <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block mb-2">Importação</span>
                  <p className="text-xs font-bold text-zinc-800">Use "📤 Importar" para carregar arquivos de backup.</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* PASSO 02 */}
        <div className="flex flex-col md:flex-row gap-8 group">
          <StepNumber num="02" />
          <div className="flex-1 space-y-4">
            <h3 className="text-2xl font-black text-zinc-900 uppercase tracking-tighter italic">Perfil & Requisitos IA</h3>
            <Card className="rounded-[2.5rem] border-none shadow-lg bg-white p-8">
              <p className="text-zinc-600 text-sm leading-relaxed mb-6">
                Na aba <strong>Perfil & Requisitos</strong>, defina quem é o seu cliente e as restrições do imóvel. Este é o "cérebro" do projeto.
              </p>
              <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl space-y-3">
                <h4 className="text-[10px] font-black text-emerald-700 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                  Poder do Gemini
                </h4>
                <p className="text-xs text-emerald-900 font-medium leading-relaxed">
                  Após preencher os dados, clique em <strong>"✨ Gerar com Gemini"</strong>. A IA criará diretrizes conceituais exclusivas baseadas na rotina e orçamento do seu cliente.
                </p>
              </div>
            </Card>
          </div>
        </div>

        {/* PASSO 03 */}
        <div className="flex flex-col md:flex-row gap-8 group">
          <StepNumber num="03" />
          <div className="flex-1 space-y-4">
            <h3 className="text-2xl font-black text-zinc-900 uppercase tracking-tighter italic">Análise de Plantas (A vs B)</h3>
            <Card className="rounded-[2.5rem] border-none shadow-lg bg-white p-8">
              <p className="text-zinc-600 text-sm leading-relaxed mb-6">
                Esta é a fase técnica. Insira as metragens e observações das suas duas propostas de layout (Alpha e Beta).
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h5 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Metodologia</h5>
                  <p className="text-xs text-zinc-700 font-medium leading-relaxed">
                    Marque os <strong>Eixos de Decisão</strong> (Fluxos, Luz, Privacidade) para que a IA foque no que realmente importa para este projeto.
                  </p>
                </div>
                <div className="space-y-2">
                  <h5 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Resultado</h5>
                  <p className="text-xs text-zinc-700 font-medium leading-relaxed">
                    A IA gerará um <strong>Parecer Técnico</strong> isento, apontando a planta vencedora por critérios específicos.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* PASSO 04 */}
        <div className="flex flex-col md:flex-row gap-8 group">
          <StepNumber num="04" />
          <div className="flex-1 space-y-4">
            <h3 className="text-2xl font-black text-zinc-900 uppercase tracking-tighter italic">Refino de Ambientes</h3>
            <Card className="rounded-[2.5rem] border-none shadow-lg bg-white p-8">
              <p className="text-zinc-600 text-sm leading-relaxed mb-4">
                Use a aba <strong>Templates</strong> para aprofundar a consultoria em cômodos específicos (Cozinha, Área Gourmet, etc).
              </p>
              <p className="text-xs text-zinc-400 font-medium">
                Gere recomendações de acabamentos e soluções práticas que agregam valor ao seu serviço de consultoria.
              </p>
            </Card>
          </div>
        </div>

        {/* PASSO 05 */}
        <div className="flex flex-col md:flex-row gap-8 group">
          <StepNumber num="05" />
          <div className="flex-1 space-y-4">
            <h3 className="text-2xl font-black text-zinc-900 uppercase tracking-tighter italic">A Entrega Final (Double Export)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="bg-zinc-900 text-white p-8 rounded-[2.5rem] shadow-2xl space-y-6">
                <div className="flex justify-between items-start">
                  <span className="text-3xl">📄</span>
                  <span className="bg-white/10 text-[9px] font-black px-2 py-1 rounded uppercase">Produto Cliente</span>
                </div>
                <h4 className="text-xl font-black uppercase italic tracking-tight">Exportar PDF</h4>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  Diagramação editorial automática com capa, checklist, comparativos laterais e veredito técnico. Pronto para envio imediato.
                </p>
              </div>

              <div className="bg-blue-600 text-white p-8 rounded-[2.5rem] shadow-2xl space-y-6">
                <div className="flex justify-between items-start">
                  <span className="text-3xl">💾</span>
                  <span className="bg-white/10 text-[9px] font-black px-2 py-1 rounded uppercase">Segurança Pro</span>
                </div>
                <h4 className="text-xl font-black uppercase italic tracking-tight">Exportar Backup</h4>
                <p className="text-blue-100 text-xs leading-relaxed">
                  Baixe o arquivo <strong>.JSON</strong> com o nome do cliente. Guarde-o para poder editar este projeto em qualquer lugar no futuro.
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* AVISO CRÍTICO DE ARMAZENAMENTO */}
      <div className="bg-zinc-50 border border-zinc-200 p-10 rounded-[3rem] text-center space-y-6">
        <h3 className="text-xs font-black text-zinc-400 uppercase tracking-[0.4em]">Onde meus dados ficam salvos?</h3>
        <p className="text-sm text-zinc-600 max-w-2xl mx-auto font-medium leading-relaxed">
          O ArchiDecide é uma ferramenta de <strong>armazenamento local</strong>. Seus projetos ficam no banco de dados do seu navegador. 
          Se você limpar o histórico ou trocar de computador sem ter feito o <strong>Backup (.json)</strong>, você perderá os dados. 
          <span className="text-zinc-900 font-black"> Exporte o backup de cada projeto ao finalizar!</span>
        </p>
      </div>

    </div>
  );
};

export default InstructionsPage;
