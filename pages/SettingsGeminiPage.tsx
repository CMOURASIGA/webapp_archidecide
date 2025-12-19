
import React, { useState, useEffect } from 'react';
import { useProjectStore } from '../store/useProjectStore';
import { Button, Card, Select } from '../components/common/UI';

const SettingsGeminiPage: React.FC = () => {
  const { geminiConfig, setGeminiConfig } = useProjectStore();
  const [config, setConfig] = useState(geminiConfig || {
    model: 'gemini-3-pro-preview',
    lastUpdated: ''
  });
  const [hasKey, setHasKey] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const check = async () => {
      // Prioridade 1: Chave no Env (Vercel)
      if (process.env.API_KEY && process.env.API_KEY !== "") {
        setHasKey(true);
        return;
      }

      // Prioridade 2: AI Studio
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
      alert("A variável de ambiente API_KEY não foi detectada. Verifique as configurações do seu projeto na Vercel.");
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
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-black text-zinc-900 tracking-tight">Configurações de IA</h2>
        <p className="text-zinc-500">Gerencie a conexão e o modelo do motor inteligente.</p>
      </div>

      {!hasKey ? (
        <div className="bg-amber-50 border border-amber-200 p-8 rounded-3xl space-y-5 shadow-sm">
          <div className="flex items-center gap-4">
            <span className="text-3xl">⚠️</span>
            <div>
              <div className="font-black text-amber-900">IA não detectada</div>
              <p className="text-sm text-amber-800">Sua API Key ainda não foi carregada pelo sistema.</p>
            </div>
          </div>
          <p className="text-sm text-amber-700 leading-relaxed">
            Se você já configurou na Vercel, o sistema deve reconhecer automaticamente após o próximo deploy. Se estiver usando o ambiente de desenvolvimento, clique abaixo para ativar manualmente.
          </p>
          <Button className="w-full bg-amber-900 hover:bg-amber-950 text-white py-4 font-bold" onClick={handleActivate}>
            TENTAR ATIVAR GEMINI AGORA
          </Button>
        </div>
      ) : (
        <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-3xl flex items-center gap-4 shadow-sm">
          <span className="text-2xl text-emerald-600">✅</span>
          <div>
            <div className="font-black text-emerald-900 text-sm">IA ATIVA E PRONTA</div>
            <p className="text-xs text-emerald-700">A chave de API foi detectada e o motor está operacional.</p>
          </div>
        </div>
      )}

      <Card title="Preferências do Motor">
        <div className="space-y-8">
          <Select label="Selecione o Modelo" value={config.model} onChange={e => setConfig({...config, model: e.target.value})}>
            <option value="gemini-3-flash-preview">Gemini 3 Flash (Alta Velocidade - Recomendado)</option>
            <option value="gemini-3-pro-preview">Gemini 3 Pro (Máxima Precisão Arquitetônica)</option>
          </Select>
          
          <div className="p-5 bg-zinc-50 border border-zinc-100 rounded-2xl text-xs text-zinc-500 leading-relaxed space-y-2">
            <p><strong>Dica de uso:</strong></p>
            <p>• <strong>Flash:</strong> Excelente para diretrizes e textos de ambientes.</p>
            <p>• <strong>Pro:</strong> Recomendado para análises comparativas de plantas complexas, onde o raciocínio espacial e técnico é mais exigido.</p>
          </div>

          <Button className="w-full py-5 shadow-xl font-black text-lg" onClick={handleSave}>
            {saved ? "Configurações Gravadas! ✓" : "Salvar Preferências"}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default SettingsGeminiPage;
