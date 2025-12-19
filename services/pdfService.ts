
import { jsPDF } from "jspdf";
import { Project, ReportMeta, StructuredAnalysis } from "../types/project";

export const pdfService = {
  generateReport: async (project: Project): Promise<{ blob: Blob; meta: ReportMeta }> => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 25;
    const contentWidth = pageWidth - (margin * 2);

    const structuredData: StructuredAnalysis | null = project.comparison?.analiseComparativa?.content 
      ? JSON.parse(project.comparison.analiseComparativa.content) 
      : null;

    // --- DESIGN SYSTEM DO PDF ---
    const COLORS = {
      BLACK: [15, 15, 15] as [number, number, number],
      GRAY: [80, 80, 80] as [number, number, number],
      LIGHT_GRAY: [190, 190, 190] as [number, number, number],
      BG: [252, 252, 252] as [number, number, number],
      WHITE: [255, 255, 255] as [number, number, number],
      ACCENT: [0, 0, 0] as [number, number, number]
    };

    const setFont = (weight: "bold" | "normal" | "italic" = "normal", size: number = 10, color = COLORS.BLACK) => {
      doc.setFont("helvetica", weight);
      doc.setFontSize(size);
      doc.setTextColor(color[0], color[1], color[2]);
    };

    const drawHeaderFooter = () => {
      if (doc.internal.getNumberOfPages() > 1) {
        setFont("bold", 7, COLORS.LIGHT_GRAY);
        doc.text(`${project.nome.toUpperCase()} • RELATÓRIO TÉCNICO V${project.version}`, margin, 12);
        doc.text("ARCHIDECIDE STUDIO", pageWidth - margin, 12, { align: 'right' });
        doc.setDrawColor(240, 240, 240);
        doc.line(margin, 15, pageWidth - margin, 15);
        
        setFont("normal", 7, COLORS.LIGHT_GRAY);
        doc.text(`PÁGINA ${doc.internal.getCurrentPageInfo().pageNumber}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
      }
    };

    // --- PÁGINA 1: CAPA EDITORIAL ---
    doc.setFillColor(COLORS.BG[0], COLORS.BG[1], COLORS.BG[2]);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');
    doc.setFillColor(0, 0, 0);
    doc.rect(margin, margin, 1.5, 50, 'F');

    setFont("bold", 44, COLORS.BLACK);
    const titleLines = doc.splitTextToSize(project.nome.toUpperCase(), contentWidth);
    doc.text(titleLines, margin, 90);
    
    setFont("normal", 14, COLORS.GRAY);
    doc.text("ESTUDO DE VIABILIDADE E APOIO À DECISÃO", margin, 105 + (titleLines.length * 10));

    const footerY = pageHeight - 50;
    setFont("bold", 8, COLORS.LIGHT_GRAY);
    doc.text("PREPARADO PARA", margin, footerY);
    setFont("bold", 12, COLORS.BLACK);
    doc.text(project.cliente || "CONSULTORIA TÉCNICA", margin, footerY + 8);
    
    doc.text("DATA DE EMISSÃO", pageWidth - margin - 45, footerY);
    doc.text(new Date().toLocaleDateString('pt-BR'), pageWidth - margin - 45, footerY + 8);

    // --- PÁGINA 2: RESUMO EXECUTIVO (CONVENCIMENTO) ---
    doc.addPage();
    drawHeaderFooter();
    let y = 45;

    setFont("bold", 28, COLORS.BLACK);
    doc.text("Resumo Executivo", margin, y);
    y += 25;

    if (structuredData) {
      doc.setFillColor(0, 0, 0);
      doc.roundedRect(margin, y, contentWidth, 55, 3, 3, 'F');
      
      setFont("bold", 8, [180, 180, 180]);
      doc.text("RECOMENDAÇÃO TÉCNICA FINAL", margin + 12, y + 15);
      
      setFont("bold", 22, COLORS.WHITE);
      doc.text(`PLANTA ${structuredData.recomendacao.planta.toUpperCase()}`, margin + 12, y + 32);
      
      setFont("normal", 10, [210, 210, 210]);
      const recLines = doc.splitTextToSize(structuredData.recomendacao.motivo, contentWidth - 24);
      doc.text(recLines, margin + 12, y + 43);
      y += 85;

      setFont("bold", 12, COLORS.BLACK);
      doc.text("Pilares da Recomendação:", margin, y);
      y += 12;
      
      const pillars = ["Otimização de Fluxos", "Conforto Ambiental", "Valor de Mercado"];
      pillars.forEach(p => {
        doc.setFillColor(245, 245, 245);
        doc.roundedRect(margin, y - 5, contentWidth, 10, 1, 1, 'F');
        setFont("bold", 9, COLORS.GRAY);
        doc.text(`• ${p}: Estratégia de design para máxima eficiência.`, margin + 5, y + 2);
        y += 14;
      });
    }

    // --- PÁGINA 3: DIRETRIZES E PREMISSAS ---
    doc.addPage();
    drawHeaderFooter();
    y = 45;
    setFont("bold", 28, COLORS.BLACK);
    doc.text("Diretrizes do Projeto", margin, y);
    y += 20;

    const diretrizes = project.diretrizesGerais?.content || "Conceito baseado em integração e funcionalidade.";
    const chunks = diretrizes.split('\n').filter(l => l.trim() !== "");
    chunks.forEach(chunk => {
      if (y > pageHeight - 30) { doc.addPage(); drawHeaderFooter(); y = 45; }
      if (chunk.includes(':') || chunk.startsWith('#')) {
        y += 8;
        setFont("bold", 12, COLORS.BLACK);
        doc.text(chunk.replace(/#/g, "").trim().toUpperCase(), margin, y);
        y += 8;
      } else {
        setFont("normal", 10, COLORS.GRAY);
        const wrapped = doc.splitTextToSize(chunk.replace(/^-/g, "•").trim(), contentWidth);
        doc.text(wrapped, margin, y);
        y += (wrapped.length * 6) + 4;
      }
    });

    // --- PÁGINA 4: QUADRO COMPARATIVO ---
    doc.addPage();
    drawHeaderFooter();
    y = 45;
    setFont("bold", 28, COLORS.BLACK);
    doc.text("Quadro Técnico", margin, y);
    y += 25;

    if (structuredData) {
      setFont("bold", 8, COLORS.LIGHT_GRAY);
      doc.text("CRITÉRIO TÉCNICO", margin, y);
      doc.text("VENCEDORA", pageWidth - margin, y, { align: 'right' });
      y += 5;
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.5);
      doc.line(margin, y, pageWidth - margin, y);
      y += 15;

      structuredData.placar.forEach(p => {
        setFont("bold", 11, COLORS.BLACK);
        doc.text(p.criterio.toUpperCase(), margin, y);
        const pillX = pageWidth - margin - 35;
        if (p.vencedora !== 'Empate') {
          doc.setFillColor(0, 0, 0);
          doc.roundedRect(pillX, y - 5.5, 35, 8, 2, 2, 'F');
          setFont("bold", 7, COLORS.WHITE);
          doc.text(`PLANTA ${p.vencedora.toUpperCase()}`, pillX + 17.5, y, { align: 'center' });
        } else {
          setFont("normal", 7, COLORS.LIGHT_GRAY);
          doc.text("EQUILÍBRIO", pillX + 17.5, y, { align: 'center' });
        }
        y += 18;
        doc.setDrawColor(245, 245, 245);
        doc.line(margin, y - 10, pageWidth - margin, y - 10);
      });
    }

    // --- PÁGINA 5: ANÁLISE DETALHADA ---
    doc.addPage();
    drawHeaderFooter();
    y = 45;
    setFont("bold", 28, COLORS.BLACK);
    doc.text("Análise de Critérios", margin, y);
    y += 20;

    if (structuredData) {
      structuredData.detalhes.forEach((det, i) => {
        if (y > pageHeight - 85) { doc.addPage(); drawHeaderFooter(); y = 45; }
        setFont("bold", 14, COLORS.BLACK);
        doc.text(`${i + 1}. ${det.criterio}`, margin, y);
        y += 12;
        const colW = (contentWidth / 2) - 10;
        setFont("bold", 7, COLORS.LIGHT_GRAY);
        doc.text("PLANTA ALPHA", margin, y);
        doc.text("PLANTA BETA", margin + colW + 20, y);
        y += 6;
        setFont("normal", 9, COLORS.GRAY);
        const lA = doc.splitTextToSize(det.analiseAlpha, colW);
        const lB = doc.splitTextToSize(det.analiseBeta, colW);
        doc.text(lA, margin, y);
        doc.text(lB, margin + colW + 20, y);
        y += Math.max(lA.length, lB.length) * 5 + 10;
        doc.setFillColor(248, 248, 248);
        doc.rect(margin, y - 5, contentWidth, 10, 'F');
        setFont("italic", 8, COLORS.BLACK);
        doc.text(`Conclusão Técnica: ${det.conclusao}`, margin + 5, y + 1.5);
        y += 25;
      });
    }

    // --- PÁGINA 6: PARECER E ENCERRAMENTO ---
    doc.addPage();
    drawHeaderFooter();
    y = 45;
    setFont("bold", 28, COLORS.BLACK);
    doc.text("Parecer Final", margin, y);
    y += 25;

    if (structuredData) {
      setFont("bold", 12, COLORS.BLACK);
      doc.text("Considerações de Viabilidade", margin, y);
      y += 10;
      setFont("normal", 10, COLORS.GRAY);
      const conclusion = doc.splitTextToSize("Após análise exaustiva das propostas, concluímos que a recomendação apresentada atende com maior precisão os requisitos de longevidade e funcionalidade estabelecidos no briefing inicial.", contentWidth);
      doc.text(conclusion, margin, y);
      y += (conclusion.length * 6) + 20;

      // BOX RISCOS
      doc.setFillColor(255, 245, 245);
      doc.roundedRect(margin, y, contentWidth, 45, 2, 2, 'F');
      setFont("bold", 10, [180, 0, 0]);
      doc.text("Riscos Identificados e Mitigações:", margin + 10, y + 12);
      setFont("normal", 9, COLORS.GRAY);
      structuredData.riscosMitigacoes.forEach((r, i) => {
        if (i < 3) doc.text(`• ${r.risco} → ${r.ajusteSugerido}`, margin + 10, y + 22 + (i * 7), { maxWidth: contentWidth - 20 });
      });
    }

    y = pageHeight - 50;
    doc.setDrawColor(0);
    doc.line(margin, y, margin + 70, y);
    setFont("bold", 10, COLORS.BLACK);
    doc.text("ARQUITETO RESPONSÁVEL", margin, y + 8);
    setFont("normal", 8, COLORS.LIGHT_GRAY);
    doc.text("ArchiDecide Professional Report System v1.6", margin, y + 14);

    const pdfBase64 = doc.output("datauristring");
    return { blob: doc.output("blob"), meta: { id: crypto.randomUUID(), generatedAt: new Date().toISOString(), fileName: `RELATORIO_TECNICO_${project.nome.replace(/\s+/g, '_').toUpperCase()}.pdf`, pdfBase64 } };
  }
};
