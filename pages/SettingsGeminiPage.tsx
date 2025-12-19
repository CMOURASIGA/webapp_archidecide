
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
      // @ts-ignore
      const key = process.env.API_KEY;
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
        <h2 className="text-4xl font-black text-zinc-900 tracking-tight uppercase italic">Módulo de Inteligência</h2>
        <p className="text-zinc-500 mt-2 font-medium">Gerencie a conexão do sistema com os servidores de processamento.</p>
      </div>

      {!hasKey ? (
        <div className="bg-zinc-100 border border-zinc-200 p-10 rounded-[2.5rem] space-y-6">
          <div className="flex items-center gap-5">
            <span className="text-4xl opacity-50">📡</span>
            <div>
              <div className="font-black text-zinc-900 text-xl uppercase tracking-tight">Módulo Offline</div>
              <p className="text-sm text-zinc-500 font-medium">Aguardando ativação dos serviços de inteligência artificial.</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl text-xs text-zinc-600 font-medium leading-relaxed border border-zinc-100">
            Caso você seja o administrador desta licença, verifique se a chave de ativação foi inserida corretamente no painel de controle do sistema. Para usuários padrão, entre em contato com seu suporte técnico.
          </div>
        </div>
      ) : (
        <div className="bg-zinc-900 text-white p-8 rounded-[2.5rem] flex items-center justify-between shadow-2xl">
          <div className="flex items-center gap-6">
            <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white text-2xl shadow-lg font-black italic">✓</div>
            <div>
              <div className="font-black text-white text-lg uppercase tracking-tight">Sistema Conectado</div>
              <p className="text-sm text-zinc-400 font-medium tracking-wide">Todos os recursos de análise estratégica estão ativos e prontos.</p>
            </div>
          </div>
        </div>
      )}

      <Card className="rounded-[2.5rem] p-10 shadow-xl border-none ring-1 ring-zinc-100">
        <div className="space-y-10">
          <div className="space-y-4">
             <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">Motor de Processamento</label>
             <Select 
                value={config.model} 
                onChange={e => setConfig({...config, model: e.target.value})}
                className="font-bold text-lg h-14 bg-zinc-50 border-none"
              >
                <option value="gemini-3-flash-preview">Analista Padrão (Rápido e Preciso)</option>
                <option value="gemini-3-pro-preview">Analista Sênior (Deep Reasoning / Alta Complexidade)</option>
              </Select>
              <p className="text-[10px] text-zinc-400 font-medium">O motor "Sênior" é recomendado para projetos com muitas restrições técnicas ou layouts complexos.</p>
          </div>
          
          <div className="p-8 bg-zinc-50 border border-zinc-100 rounded-[2rem] text-sm text-zinc-500 leading-relaxed">
            <div className="flex items-center gap-3 font-black text-zinc-900 uppercase tracking-widest text-[10px] mb-4">
              <span className="w-2 h-2 bg-zinc-900 rounded-full"></span>
              Privacidade de Dados
            </div>
            <p className="text-xs leading-relaxed">
              As informações enviadas para análise são processadas em ambiente criptografado e não são utilizadas para treinamento público de modelos, garantindo o sigilo intelectual do seu projeto.
            </p>
          </div>

          <Button className="w-full py-6 shadow-xl font-black text-xl hover:scale-[1.02] active:scale-95 transition-all" onClick={handleSave}>
            {saved ? "PREFERÊNCIAS SALVAS ✓" : "ATUALIZAR CONFIGURAÇÃO"}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default SettingsGeminiPage;
