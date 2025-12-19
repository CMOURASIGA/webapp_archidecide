
import React, { useState, useEffect } from 'react';
import { useProjectStore } from '../store/useProjectStore';
import { Button, Card, Select } from '../components/common/UI';

const SettingsGeminiPage: React.FC = () => {
  const { geminiConfig, setGeminiConfig } = useProjectStore();
  const [config, setConfig] = useState(geminiConfig || {
    model: 'gemini-3-pro-preview',
    lastUpdated: ''
  });
  const [hasKey, setHasKey] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const check = async () => {
      if (window.aistudio?.hasSelectedApiKey) {
        const result = await window.aistudio.hasSelectedApiKey();
        setHasKey(result);
      }
    };
    check();
  }, []);

  const handleActivate = async () => {
    if (window.aistudio?.openSelectKey) {
      await window.aistudio.openSelectKey();
      setHasKey(true);
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
        <p className="text-zinc-500">Gerencie a conexão com os modelos inteligentes.</p>
      </div>

      {!hasKey && (
        <div className="bg-amber-50 border border-amber-200 p-6 rounded-2xl space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚠️</span>
            <div className="font-bold text-amber-900">IA não autenticada</div>
          </div>
          <p className="text-sm text-amber-800">
            Para que o ArchiDecide gere textos e análises, você precisa ativar a conexão segura com o Google Gemini.
          </p>
          <Button className="w-full bg-amber-900 hover:bg-amber-950 text-white" onClick={handleActivate}>
            ATIVAR GEMINI AGORA
          </Button>
        </div>
      )}

      <Card title="Preferências do Modelo">
        <div className="space-y-6">
          <Select label="Modelo do Motor de IA" value={config.model} onChange={e => setConfig({...config, model: e.target.value})}>
            <option value="gemini-3-flash-preview">Gemini 3 Flash (Recomendado - Rápido)</option>
            <option value="gemini-3-pro-preview">Gemini 3 Pro (Maior Precisão Técnica)</option>
          </Select>
          
          <div className="p-4 bg-zinc-50 border border-zinc-100 rounded-xl text-xs text-zinc-500 leading-relaxed">
            <strong>Dica:</strong> O modelo Flash é ideal para diretrizes rápidas. Use o modelo Pro quando precisar de uma análise comparativa de plantas mais profunda e detalhada.
          </div>

          <Button className="w-full py-4 shadow-lg" onClick={handleSave}>
            {saved ? "Configurações Salvas! ✓" : "Salvar Preferências"}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default SettingsGeminiPage;
