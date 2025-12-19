
import { jsPDF } from "jspdf";
import { Project, ReportMeta } from "../types/project";

export const pdfService = {
  generateReport: async (project: Project): Promise<{ blob: Blob; meta: ReportMeta }> => {
    const doc = new jsPDF();
    const margin = 20;
    let cursorY = 20;

    const addText = (text: string, fontSize = 12, isBold = false) => {
      doc.setFontSize(fontSize);
      doc.setFont("helvetica", isBold ? "bold" : "normal");
      const splitText = doc.splitTextToSize(text, 170);
      doc.text(splitText, margin, cursorY);
      cursorY += splitText.length * (fontSize * 0.5) + 5;
      
      if (cursorY > 270) {
        doc.addPage();
        cursorY = 20;
      }
    };

    // Cover
    doc.setFontSize(22);
    doc.text("Relatório de Apoio à Decisão", margin, 40);
    doc.setFontSize(16);
    doc.text(`Projeto: ${project.nome}`, margin, 55);
    doc.text(`Cliente: ${project.cliente}`, margin, 65);
    doc.setFontSize(10);
    doc.text(`Data: ${new Date(project.dataProjeto).toLocaleDateString()}`, margin, 75);
    
    cursorY = 100;

    // Profile
    if (project.clientProfile) {
      addText("Perfil do Cliente", 14, true);
      addText(`Tipo: ${project.clientProfile.tipoCliente}`);
      addText(`Estilo: ${project.clientProfile.estiloDesejado}`);
      addText(`Prioridades: ${project.clientProfile.prioridades.join(", ")}`);
    }

    // Guidelines
    if (project.diretrizesGerais) {
      addText("Diretrizes Gerais", 14, true);
      addText(project.diretrizesGerais.content);
    }

    // Comparison
    if (project.comparison?.analiseComparativa) {
      addText("Análise Comparativa de Plantas", 14, true);
      addText(project.comparison.analiseComparativa.content);
    }

    // Environments
    if (project.templatesResults.length > 0) {
      addText("Estudo de Ambientes", 14, true);
      project.templatesResults.forEach(res => {
        if (res.conceitoAmbiente) {
          addText(res.conceitoAmbiente.title, 12, true);
          addText(res.conceitoAmbiente.content);
        }
      });
    }

    const pdfBase64 = doc.output("datauristring");
    const blob = doc.output("blob");
    
    const meta: ReportMeta = {
      id: crypto.randomUUID(),
      generatedAt: new Date().toISOString(),
      fileName: `Relatorio_${project.nome.replace(/\s+/g, '_')}_${Date.now()}.pdf`,
      pdfBase64
    };

    return { blob, meta };
  }
};
