
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useProjectStore } from '../store/useProjectStore';
import { Button, Card, Textarea } from '../components/common/UI';
import { pdfService } from '../services/pdfService';

const ProjectReportPage: React.FC = () => {
  const { projectId } = useParams();
  const { projects, updateProject, addReport } = useProjectStore();
  const project = projects.find(p => p.id === projectId);
  
  const [obs, setObs] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  if (!project) return <div>Projeto não encontrado.</div>;

  const handleGeneratePDF = async () => {
    setIsGenerating(true);
    try {
      const { blob, meta } = await pdfService.generateReport(project);
      
      // Save report meta to project
      addReport(project.id, meta);

      // Download
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = meta.fileName;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Erro ao gerar PDF.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900">Relatório Final</h2>
          <p className="text-zinc-500 text-sm">Revise os dados antes de exportar para o cliente.</p>
        </div>
        <Button onClick={handleGeneratePDF} isLoading={isGenerating}>Exportar PDF</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card title="Estrutura do Relatório">
            <div className="space-y-3 text-sm text-zinc-600">
               <div className="flex items-center gap-2">✅ Capa do Projeto</div>
               <div className="flex items-center gap-2">{project.clientProfile ? "✅" : "❌"} Perfil do Cliente</div>
               <div className="flex items-center gap-2">{project.diretrizesGerais ? "✅" : "❌"} Diretrizes Gerais</div>
               <div className="flex items-center gap-2">{project.comparison?.analiseComparativa ? "✅" : "❌"} Comparação de Plantas</div>
               <div className="flex items-center gap-2">✅ {project.templatesResults.length} Estudos de Ambientes</div>
            </div>
          </Card>

          <Card title="Observações Finais do Arquiteto">
            <Textarea 
              value={obs} 
              onChange={e => setObs(e.target.value)}
              placeholder="Digite aqui considerações extras, prazos ou próximos passos que deseje incluir no relatório..."
            />
          </Card>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-zinc-900">Histórico de Relatórios</h3>
          {project.reports.length === 0 ? (
            <div className="text-sm text-zinc-400 italic">Nenhum relatório gerado ainda para este projeto.</div>
          ) : (
            <div className="space-y-2">
              {project.reports.map(rep => (
                <div key={rep.id} className="flex items-center justify-between p-3 bg-white border border-zinc-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">📄</span>
                    <div>
                      <div className="text-sm font-medium text-zinc-800">{rep.fileName}</div>
                      <div className="text-[10px] text-zinc-400 uppercase">{new Date(rep.generatedAt).toLocaleString()}</div>
                    </div>
                  </div>
                  {/* Fixed error: removed invalid 'size' prop from Button */}
                  <Button variant="ghost" onClick={() => {
                    const a = document.createElement("a");
                    a.href = rep.pdfBase64!;
                    a.download = rep.fileName;
                    a.click();
                  }}>Download</Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectReportPage;
