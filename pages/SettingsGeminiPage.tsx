
import React, { useState } from 'react';
import { useProjectStore } from '../store/useProjectStore';
import { Button, Card, Select } from '../components/common/UI';

const SettingsGeminiPage: React.FC = () => {
  const { geminiConfig, setGeminiConfig } = useProjectStore();
  // Removed apiKey from config state. Defaulting to Gemini 3 Pro for complex architectural tasks.
  const [config, setConfig] = useState(geminiConfig || {
    model: 'gemini-3-pro-preview',
    lastUpdated: ''
  });

  const [saved, setSaved] = useState(false);

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
        <h2 className="text-2xl font-bold text-zinc-900">Configurações de IA</h2>
        <p className="text-zinc-500 text-sm">Gerencie as preferências dos modelos do Google Gemini.</p>
      </div>

      <Card title="Modelo do Google Gemini">
        <div className="space-y-4">
          {/* Removed API key input field to comply with security requirements */}
          <Select label="Modelo" value={config.model} onChange={e => setConfig({...config, model: e.target.value})}>
            <option value="gemini-3-flash-preview">Gemini 3 Flash (Rápido/Econômico)</option>
            <option value="gemini-3-pro-preview">Gemini 3 Pro (Alta Qualidade)</option>
          </Select>
          
          <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-lg space-y-2">
            <h4 className="text-xs font-bold text-zinc-500 uppercase">Informação</h4>
            <p className="text-xs text-zinc-600">
              A autenticação é gerenciada automaticamente pelo ambiente seguro. 
              O modelo Gemini 3 Pro é recomendado para análises complexas de arquitetura e design.
            </p>
          </div>

          <Button className="w-full" onClick={handleSave}>
            {saved ? "Salvo com sucesso!" : "Salvar Configuração"}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default SettingsGeminiPage;
