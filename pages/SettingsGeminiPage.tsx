
import React, { useState, useEffect } from 'react';
import { useProjectStore } from '../store/useProjectStore';
import { Button, Card, Select } from '../components/common/UI';

const SettingsGeminiPage: React.FC = () => {
  const { geminiConfig, setGeminiConfig } = useProjectStore();
  const [config, setConfig] = useState(geminiConfig || {
    model: 'gemini-3-flash-preview',
    lastUpdated: ''
  });
  const [hasKey, setHasKey] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const check = async () => {
      // Prioridade 1: Chave no Env (Vercel/Node Process)
      let envKey = "";
      try {
        if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
          envKey = process.env.API_KEY;
        }
      } catch (e) {}

      if (envKey && envKey !== "") {
        setHasKey(true);
        return;
      }

      // Prioridade 2: AI Studio Safe Activation
      if (window.aistudio?.hasSelectedApiKey) {
        const result = await window.aistudio.hasSelectedApiKey();
        setHasKey(result);
      } else {
        setHasKey(false);
      }
    };
    check();
  }, []);

  const handleActivate = async () => {
    if (window.aistudio?.openSelectKey) {
      await window.aistudio.openSelectKey();
      setHasKey(true);
    } else {
      alert("A variável de ambiente API_KEY não foi detectada. Verifique se você adicionou 'API_KEY' (letras maiúsculas) na seção 'Environment Variables' da sua Vercel. Dica: Após adicionar, você deve fazer um novo 'Redeploy' do projeto para que a mudança surta efeito.");
    }
  };

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
        <h2 className="text-4xl font-black text-zinc-900 tracking-tight uppercase italic">Configurações de Inteligência</h2>
        <p className="text-zinc-500 mt-2 font-medium">Gerencie a conexão segura e o comportamento dos modelos generativos.</p>
      </div>

      {!hasKey ? (
        <div className="bg-amber-50 border border-amber-200 p-10 rounded-[2.5rem] space-y-6 shadow-xl shadow-amber-900/5">
          <div className="flex items-center gap-5">
            <span className="text-4xl">🔌</span>
            <div>
              <div className="font-black text-amber-900 text-xl uppercase tracking-tight">API Key não identificada</div>
              <p className="text-sm text-amber-800 font-medium">O sistema não conseguiu localizar sua chave de acesso.</p>
            </div>
          </div>
          <div className="bg-white/50 p-6 rounded-2xl space-y-3 text-sm text-amber-900 font-medium leading-relaxed">
            <p>Se você está na <strong>Vercel</strong>:</p>
            <ol className="list-decimal ml-5 space-y-1 opacity-80">
              <li>Vá em <strong>Settings</strong> > <strong>Environment Variables</strong></li>
              <li>Crie uma chave com nome exato <code>API_KEY</code></li>
              <li>Cole seu código da Google AI Studio</li>
              <li>Clique em <strong>Save</strong></li>
              <li><strong>Importante:</strong> Faça um novo Deploy para ativar a variável no navegador.</li>
            </ol>
          </div>
          <Button className="w-full bg-amber-900 hover:bg-amber-950 text-white py-5 font-black text-lg shadow-lg active:scale-95 transition-all" onClick={handleActivate}>
            TENTAR ATIVAR MANUALMENTE
          </Button>
        </div>
      ) : (
        <div className="bg-emerald-50 border border-emerald-200 p-8 rounded-[2rem] flex items-center justify-between shadow-lg shadow-emerald-900/5">
          <div className="flex items-center gap-6">
            <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white text-2xl shadow-inner">✓</div>
            <div>
              <div className="font-black text-emerald-900 text-lg uppercase tracking-tight">Motor Ativo e Conectado</div>
              <p className="text-sm text-emerald-700 font-medium">Sua API_KEY foi detectada com sucesso na Vercel.</p>
            </div>
          </div>
        </div>
      )}

      <Card className="rounded-[2.5rem] p-10 shadow-2xl border-none ring-1 ring-zinc-100">
        <div className="space-y-10">
          <Select 
            label="Seletor de Inteligência" 
            value={config.model} 
            onChange={e => setConfig({...config, model: e.target.value})}
            className="font-bold text-lg h-14"
          >
            <option value="gemini-3-flash-preview">Gemini 3 Flash (Otimizado para Diretrizes)</option>
            <option value="gemini-3-pro-preview">Gemini 3 Pro (Raciocínio Espacial Avançado)</option>
          </Select>
          
          <div className="p-8 bg-zinc-50 border border-zinc-100 rounded-[2rem] text-sm text-zinc-500 leading-relaxed space-y-4">
            <div className="flex items-center gap-3 font-black text-zinc-900 uppercase tracking-widest text-[10px]">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              Guia de Escolha de Modelo
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                 <p className="font-black text-zinc-800 uppercase text-[10px]">Modo Flash</p>
                 <p className="text-xs">Uso cotidiano. Excelente para gerar diretrizes de projeto e recomendações rápidas de mobiliário em ambientes isolados.</p>
               </div>
               <div className="space-y-2">
                 <p className="font-black text-zinc-800 uppercase text-[10px]">Modo Pro</p>
                 <p className="text-xs">Análise profunda. Recomendado para o comparativo de plantas A vs B, onde o modelo precisa analisar fluxos e áreas complexas.</p>
               </div>
            </div>
          </div>

          <Button className="w-full py-6 shadow-2xl font-black text-xl hover:scale-[1.02] active:scale-95 transition-all" onClick={handleSave}>
            {saved ? "CONFIGURAÇÕES SALVAS ✓" : "GRAVAR PREFERÊNCIAS"}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default SettingsGeminiPage;
