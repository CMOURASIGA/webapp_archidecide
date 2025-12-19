
import { jsPDF } from "jspdf";
import { Project, ReportMeta } from "../types/project";

export const pdfService = {
  generateReport: async (project: Project): Promise<{ blob: Blob; meta: ReportMeta }> => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    let cursorY = 20;

    // --- FUNÇÕES DE UTILIDADE ---
    
    const checkPageBreak = (neededHeight: number) => {
      if (cursorY + neededHeight > pageHeight - 25) {
        doc.addPage();
        drawPageDecorations();
        cursorY = 30;
      }
    };

    const drawPageDecorations = () => {
      // Linha de cabeçalho sutil
      doc.setDrawColor(240, 240, 240);
      doc.line(margin, 15, pageWidth - margin, 15);
      
      // Rodapé
      doc.setFontSize(8);
      doc.setTextColor(180, 180, 180);
      doc.setFont("helvetica", "normal");
      doc.text(`ArchiDecide Studio | Relatório Técnico v${project.version}`, margin, pageHeight - 10);
      doc.text(`Página ${doc.internal.getNumberOfPages()}`, pageWidth - margin - 15, pageHeight - 10);
    };

    const renderMarkdownLine = (text: string) => {
      text = text.trim();
      if (!text) {
        cursorY += 5;
        return;
      }

      // H1 / Título Principal
      if (text.startsWith("# ")) {
        checkPageBreak(20);
        doc.setFontSize(22);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(0, 0, 0);
        const cleanText = text.replace("# ", "").toUpperCase();
        doc.text(cleanText, margin, cursorY);
        cursorY += 12;
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.5);
        doc.line(margin, cursorY, margin + 30, cursorY);
        cursorY += 10;
        return;
      }

      // H2 / Seção
      if (text.startsWith("## ")) {
        checkPageBreak(15);
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(40, 40, 40);
        const cleanText = text.replace("## ", "").toUpperCase();
        cursorY += 5;
        doc.text(cleanText, margin, cursorY);
        cursorY += 10;
        return;
      }

      // H3 / Subseção
      if (text.startsWith("### ")) {
        checkPageBreak(10);
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(60, 60, 60);
        const cleanText = text.replace("### ", "");
        doc.text(cleanText, margin, cursorY);
        cursorY += 8;
        return;
      }

      // Itens de lista
      if (text.startsWith("* ") || text.startsWith("- ")) {
        checkPageBreak(10);
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(80, 80, 80);
        const cleanText = text.substring(2);
        // Remove negritos internos
        const finalMainText = cleanText.replace(/\*\*/g, "");
        const splitText = doc.splitTextToSize(`•  ${finalMainText}`, contentWidth - 5);
        doc.text(splitText, margin + 5, cursorY);
        cursorY += (splitText.length * 5) + 2;
        return;
      }

      // Tabelas (Tratamento simplificado para PDF impecável)
      if (text.startsWith("|")) {
        // Ignora linhas de separação de tabela |---|---|
        if (text.includes("---")) return;
        
        checkPageBreak(10);
        doc.setFontSize(9);
        doc.setFont("helvetica", "italic");
        doc.setTextColor(100, 100, 100);
        const cells = text.split("|").filter(c => c.trim().length > 0);
        const tableRow = cells.map(c => c.trim().replace(/\*\*/g, "")).join("  |  ");
        doc.text(tableRow, margin, cursorY);
        cursorY += 6;
        return;
      }

      // Texto Normal com suporte a negrito (limpeza)
      checkPageBreak(10);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(80, 80, 80);
      
      // Limpa os marcadores de negrito para o PDF não ficar sujo
      const cleanText = text.replace(/\*\*/g, "");
      const splitText = doc.splitTextToSize(cleanText, contentWidth);
      doc.text(splitText, margin, cursorY);
      cursorY += (splitText.length * 5) + 3;
    };

    const processContent = (content: string) => {
      const lines = content.split('\n');
      lines.forEach(line => renderMarkdownLine(line));
    };

    // --- CONSTRUÇÃO DO DOCUMENTO ---

    // 1. CAPA
    doc.setFillColor(30, 30, 30);
    doc.rect(0, 0, pageWidth, 100, 'F');
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(28);
    doc.setTextColor(255, 255, 255);
    doc.text("ESTUDO DE", margin, 50);
    doc.text("VIABILIDADE", margin, 65);
    
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text("ARQUITETURA & INTELIGÊNCIA ESTRATÉGICA", margin, 80);

    cursorY = 120;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(22);
    doc.text(project.nome.toUpperCase(), margin, cursorY);
    cursorY += 10;
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text(`CLIENTE: ${project.cliente || "Não informado"}`, margin, cursorY);
    cursorY += 8;
    doc.text(`DATA: ${new Date(project.dataProjeto).toLocaleDateString()}`, margin, cursorY);
    
    cursorY += 30;

    // 2. CONTEÚDO
    drawPageDecorations();

    // Perfil do Cliente
    if (project.clientProfile) {
      renderMarkdownLine("## PERFIL DO CLIENTE");
      renderMarkdownLine(`* **Tipo:** ${project.clientProfile.tipoCliente}`);
      renderMarkdownLine(`* **Estilo:** ${project.clientProfile.estiloDesejado}`);
      renderMarkdownLine(`* **Prioridades:** ${project.clientProfile.prioridades.join(", ")}`);
      cursorY += 10;
    }

    // Diretrizes
    if (project.diretrizesGerais) {
      renderMarkdownLine("## DIRETRIZES DO PROJETO");
      processContent(project.diretrizesGerais.content);
      cursorY += 10;
    }

    // Comparação de Plantas
    if (project.comparison?.analiseComparativa) {
      renderMarkdownLine("## ANÁLISE COMPARATIVA DE PLANTAS");
      processContent(project.comparison.analiseComparativa.content);
      cursorY += 10;
    }

    // Templates / Estudos de Ambientes
    if (project.templatesResults.length > 0) {
      renderMarkdownLine("## ESTUDOS DE AMBIENTES");
      project.templatesResults.forEach(res => {
        if (res.conceitoAmbiente) {
          renderMarkdownLine(`### ${res.conceitoAmbiente.title}`);
          processContent(res.conceitoAmbiente.content);
          cursorY += 5;
        }
      });
    }

    // 3. FINALIZAÇÃO
    const pdfBase64 = doc.output("datauristring");
    const blob = doc.output("blob");
    
    const meta: ReportMeta = {
      id: crypto.randomUUID(),
      generatedAt: new Date().toISOString(),
      fileName: `Relatorio_${project.nome.replace(/\s+/g, '_')}_v${project.version}.pdf`,
      pdfBase64
    };

    return { blob, meta };
  }
};
