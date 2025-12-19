
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
    <div className="space-y-12 pb-32">
      <div className="border-b border-zinc-200 pb-10">
        <h2 className="text-5xl font-black text-zinc-900 tracking-tighter uppercase italic">Finalização & Entrega</h2>
        <p className="text-zinc-500 mt-4 text-xl font-medium">O documento final será diagramado com as diretrizes visuais do seu estúdio.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7 space-y-8">
          <Card className="rounded-[2.5rem] p-10 shadow-xl border-none ring-1 ring-zinc-100 bg-zinc-900 text-white">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-8 text-zinc-500">Checklist do Documento</h3>
            <div className="space-y-6">
               {[
                 { label: "Capa Personalizada", status: true },
                 { label: "Perfil do Cliente & Requisitos", status: !!project.clientProfile },
                 { label: "Diretrizes e Premissas", status: !!project.diretrizesGerais },
                 { label: "Argumentação Técnica A vs B", status: !!project.comparison?.analiseComparativa },
                 { label: "Estudos de Ambientes", count: project.templatesResults.length }
               ].map((item, i) => (
                 <div key={i} className="flex items-center justify-between border-b border-white/5 pb-4">
                   <span className="font-bold text-sm tracking-tight">{item.label}</span>
                   {item.count !== undefined ? (
                     <span className="bg-white/10 px-3 py-1 rounded-full text-[10px] font-black">{item.count} ITENS</span>
                   ) : (
                     <span className={item.status ? "text-emerald-400 font-black text-xs" : "text-zinc-600 font-black text-xs"}>
                       {item.status ? "✓ PRONTO" : "⚠ AUSENTE"}
                     </span>
                   )}
                 </div>
               ))}
            </div>
            <Button 
              onClick={handleGeneratePDF} 
              isLoading={isGenerating}
              className="w-full mt-10 py-6 bg-white text-zinc-900 hover:bg-zinc-100 font-black text-xl rounded-2xl shadow-2xl transition-transform active:scale-95"
            >
              GERAR PDF IMPECÁVEL
            </Button>
          </Card>

          <Card title="Nota de Encerramento (Opcional)" className="rounded-[2rem]">
            <Textarea 
              value={obs} 
              onChange={e => setObs(e.target.value)}
              className="border-none focus:ring-0 text-zinc-600"
              placeholder="Ex: Próxima reunião agendada para 15/10. Aguardamos sua escolha entre as plantas para iniciar o executivo."
            />
          </Card>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest flex items-center gap-3">
             <span className="w-8 h-[1px] bg-zinc-200"></span>
             Arquivo de Saídas
          </h3>
          {project.reports.length === 0 ? (
            <div className="p-12 border-2 border-dashed border-zinc-200 rounded-[2rem] text-center space-y-4">
               <div className="text-4xl opacity-20">📄</div>
               <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Nenhuma versão exportada</p>
            </div>
          ) : (
            <div className="space-y-4">
              {project.reports.map(rep => (
                <div key={rep.id} className="group flex items-center justify-between p-6 bg-white border border-zinc-100 rounded-[2rem] shadow-sm hover:shadow-xl transition-all">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-zinc-50 rounded-2xl flex items-center justify-center text-xl group-hover:bg-zinc-900 group-hover:text-white transition-colors">
                      PDF
                    </div>
                    <div>
                      <div className="text-sm font-black text-zinc-800 truncate max-w-[150px]">{rep.fileName}</div>
                      <div className="text-[10px] text-zinc-400 font-bold uppercase">{new Date(rep.generatedAt).toLocaleString('pt-BR')}</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      const a = document.createElement("a");
                      a.href = rep.pdfBase64!;
                      a.download = rep.fileName;
                      a.click();
                    }}
                    className="p-3 hover:bg-zinc-50 rounded-xl transition-colors"
                  >
                    <svg className="w-6 h-6 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </button>
                </div>
              )).reverse()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectReportPage;
