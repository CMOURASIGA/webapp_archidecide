
import React from 'react';
import { Card } from '../components/common/UI';

const InstructionsPage: React.FC = () => {
  return (
    <div className="space-y-8 pb-20 max-w-4xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold text-zinc-900">Guia do ArchiDecide</h2>
        <p className="text-zinc-500 mt-2">Saiba como extrair o máximo potencial da nossa ferramenta de apoio à decisão.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card title="1. Gestão de Projetos">
          <div className="space-y-3 text-zinc-600">
            <p>Tudo começa na tela de <strong>Projetos</strong>. Aqui você pode criar novos estudos, duplicar análises existentes ou excluir projetos antigos.</p>
            <ul className="list-disc ml-5 space-y-1">
              <li><strong>Duplicar:</strong> Útil para criar variações de um mesmo cliente sem perder o histórico original.</li>
              <li><strong>Armazenamento:</strong> Todos os dados são salvos localmente no seu navegador. Não enviamos seus dados para servidores externos, exceto para a API do Gemini durante a geração de textos.</li>
            </ul>
          </div>
        </Card>

        <Card title="2. Perfil & Requisitos">
          <div className="space-y-3 text-zinc-600">
            <p>Nesta etapa, você define quem é o cliente e as características do terreno ou imóvel.</p>
            <p><strong>Diretrizes Gerais:</strong> Ao clicar em "Gerar com Gemini", a IA analisa o perfil (pets, moradores, estilo, orçamento) e sugere pilares arquitetônicos para guiar sua criação. Você pode editar o texto livremente após a geração.</p>
          </div>
        </Card>

        <Card title="3. Plantas (A vs B)">
          <div className="space-y-3 text-zinc-600">
            <p>O coração da ferramenta. Frequentemente o arquiteto fica em dúvida entre dois layouts. Aqui você documenta ambos:</p>
            <ul className="list-disc ml-5 space-y-1">
              <li>Preencha áreas, pontos fortes e fracos de cada alternativa.</li>
              <li>Selecione os critérios de decisão (ex: circulação, ventilação).</li>
              <li><strong>Análise Comparativa:</strong> A IA cria uma argumentação técnica isenta, ajudando você a explicar ao cliente por que uma opção é superior à outra em determinados aspectos.</li>
            </ul>
          </div>
        </Card>

        <Card title="4. Templates de Ambientes">
          <div className="space-y-3 text-zinc-600">
            <p>Precisa de um aprofundamento em um cômodo específico? Use os Templates.</p>
            <p>A IA gera recomendações práticas de mobiliário, iluminação e materiais baseadas no orçamento e estilo definidos para aquele ambiente específico.</p>
          </div>
        </Card>

        <Card title="5. Relatório & Entrega">
          <div className="space-y-3 text-zinc-600">
            <p>A fase final. O ArchiDecide compila toda a inteligência gerada em um documento PDF profissional.</p>
            <ul className="list-disc ml-5 space-y-1">
              <li>O PDF inclui capa, perfil, diretrizes, análise das plantas e estudos de ambientes.</li>
              <li>O histórico de relatórios fica salvo dentro de cada projeto para download futuro.</li>
            </ul>
          </div>
        </Card>

        <div className="bg-zinc-900 text-white p-6 rounded-xl space-y-4">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <span>✨</span> O Papel da Inteligência Artificial
          </h3>
          <p className="text-zinc-400 text-sm leading-relaxed">
            O Gemini não substitui o arquiteto. Ele atua como um <strong>copiloto de argumentação</strong>. 
            Ele ajuda a transformar suas percepções técnicas em textos claros e persuasivos para o cliente, 
            garantindo que todas as decisões de projeto estejam fundamentadas nos requisitos iniciais.
          </p>
        </div>
      </div>
    </div>
  );
};

export default InstructionsPage;
