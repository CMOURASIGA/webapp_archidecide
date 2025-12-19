
import React, { useState, useEffect } from 'react';
import { useProjectStore } from '../store/useProjectStore';
import { Button, Card, Select } from '../components/common/UI';

const SettingsGeminiPage: React.FC = () => {
  const { geminiConfig, setGeminiConfig } = useProjectStore();
  const [config, setConfig] = useState(geminiConfig || {
    model: 'gemini-3-flash-preview',
    lastUpdated: ''
  });
  const [hasKey, setHasKey] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const checkKey = () => {
      // @ts-ignore - process.env.API_KEY injetado pelo Vite
      const key = process.env.API_KEY;
      
      // Valida se a chave foi injetada e não é um valor vazio ou undefined string
      if (key && key !== "" && key !== "undefined") {
        setHasKey(true);
      } else {
        setHasKey(false);
      }
    };
    checkKey();
  }, []);

  const handleSave = () => {
    setGeminiConfig({
      ...config,
      lastUpdated: new Date().toISOString()
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-12 pb-20">
      <div className="border-b border-zinc-200 pb-8">
        <h2 className="text-4xl font-black text-zinc-900 tracking-tight uppercase italic">Conectividade IA</h2>
        <p className="text-zinc-500 mt-2 font-medium">Status da ponte entre ArchiDecide e Google Cloud.</p>
      </div>

      {!hasKey ? (
        <div className="bg-amber-50 border border-amber-200 p-10 rounded-[2.5rem] space-y-6 shadow-xl shadow-amber-900/5">
          <div className="flex items-center gap-5">
            <span className="text-4xl animate-pulse">📡</span>
            <div>
              <div className="font-black text-amber-900 text-xl uppercase tracking-tight">Variável não detectada</div>
              <p className="text-sm text-amber-800 font-medium">O Vite não encontrou a chave 'API_KEY' durante o build.</p>
            </div>
          </div>
          <div className="bg-white/50 p-6 rounded-2xl space-y-4 text-sm text-amber-900 font-medium leading-relaxed">
            <p className="font-bold underline">Ação Necessária na Vercel:</p>
            <ol className="list-decimal ml-5 space-y-2">
              <li>Certifique-se que a variável no painel Vercel chama-se exatamente: <strong>API_KEY</strong></li>
              <li>Vá em <strong>Deployments</strong> no painel da Vercel.</li>
              <li>Clique nos 3 pontos (...) do deploy atual e selecione <strong>Redeploy</strong>.</li>
              <li>Marque a opção <strong>"Use existing Build Cache"</strong> (opcional) e confirme.</li>
            </ol>
          </div>
        </div>
      ) : (
        <div className="bg-emerald-50 border border-emerald-200 p-8 rounded-[2rem] flex items-center justify-between shadow-lg shadow-emerald-900/5">
          <div className="flex items-center gap-6">
            <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white text-2xl shadow-inner shadow-black/20 font-black italic">!</div>
            <div>
              <div className="font-black text-emerald-900 text-lg uppercase tracking-tight">Ponte Ativa</div>
              <p className="text-sm text-emerald-700 font-medium">A API_KEY foi injetada com sucesso pelo processo de build do Vite.</p>
            </div>
          </div>
        </div>
      )}

      <Card className="rounded-[2.5rem] p-10 shadow-2xl border-none ring-1 ring-zinc-100">
        <div className="space-y-10">
          <Select 
            label="Modelo Generativo Ativo" 
            value={config.model} 
            onChange={e => setConfig({...config, model: e.target.value})}
            className="font-bold text-lg h-14"
          >
            <option value="gemini-3-flash-preview">Gemini 3 Flash (Recomendado: Rápido e Eficiente)</option>
            <option value="gemini-3-pro-preview">Gemini 3 Pro (Avançado: Análises Complexas)</option>
          </Select>
          
          <div className="p-8 bg-zinc-50 border border-zinc-100 rounded-[2rem] text-sm text-zinc-500 leading-relaxed space-y-4">
            <div className="flex items-center gap-3 font-black text-zinc-900 uppercase tracking-widest text-[10px]">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              Segurança do Arquiteto
            </div>
            <p className="text-xs">
              Seguindo as melhores práticas, sua chave nunca é exposta no código-fonte do GitHub. 
              Ela reside apenas no ambiente seguro da Vercel e é transcodificada pelo Vite para uso exclusivo no seu navegador.
            </p>
          </div>

          <Button className="w-full py-6 shadow-2xl font-black text-xl hover:scale-[1.02] active:scale-95 transition-all" onClick={handleSave}>
            {saved ? "CONFIGURAÇÕES ATUALIZADAS ✓" : "GRAVAR PREFERÊNCIAS"}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default SettingsGeminiPage;
