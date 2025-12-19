
import { jsPDF } from "jspdf";
import { Project, ReportMeta, StructuredAnalysis } from "../types/project";

export const pdfService = {
  generateReport: async (project: Project): Promise<{ blob: Blob; meta: ReportMeta }> => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);

    // Helper para limpar markdown que a IA possa ter enviado
    const cleanText = (txt: string) => txt.replace(/[#*`]/g, "").trim();

    const structuredData: StructuredAnalysis | null = project.comparison?.analiseComparativa?.content 
      ? JSON.parse(project.comparison.analiseComparativa.content) 
      : null;

    // --- DESIGN SYSTEM DO PDF ---
    const COLORS = {
      BLACK: [0, 0, 0] as [number, number, number],
      DARK: [40, 40, 40] as [number, number, number],
      GRAY: [120, 120, 120] as [number, number, number],
      LINE: [230, 230, 230] as [number, number, number],
      ACCENT: [245, 245, 245] as [number, number, number]
    };

    const setFont = (weight: "bold" | "normal" | "italic" = "normal", size: number = 9, color = COLORS.BLACK) => {
      // @ts-ignore
      doc.setFont("helvetica", weight);
      doc.setFontSize(size);
      doc.setTextColor(color[0], color[1], color[2]);
    };

    const drawLine = (y: number) => {
      doc.setDrawColor(COLORS.LINE[0], COLORS.LINE[1], COLORS.LINE[2]);
      doc.setLineWidth(0.1);
      doc.line(margin, y, pageWidth - margin, y);
    };

    const drawHeaderFooter = (pageTitle: string) => {
      const pageNum = doc.internal.getCurrentPageInfo().pageNumber;
      if (pageNum > 1) {
        setFont("bold", 7, COLORS.GRAY);
        doc.text("ARCHIDECIDE | CONSULTORIA ESTRATÉGICA", margin, 12);
        doc.text(pageTitle.toUpperCase(), pageWidth / 2, 12, { align: 'center' });
        doc.text(`P. ${pageNum}`, pageWidth - margin, 12, { align: 'right' });
        doc.setDrawColor(200, 200, 200);
        doc.line(margin, 14, pageWidth - margin, 14);
      }
    };

    // --- PÁGINA 1: CAPA (EDITORIAL IMPACT) ---
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');
    
    // Elemento Decorativo Lado Esquerdo
    doc.setFillColor(0, 0, 0);
    doc.rect(0, 0, 15, pageHeight, 'F');

    let yCapa = 60;
    setFont("normal", 10, COLORS.GRAY);
    doc.text("RELATÓRIO DE VIABILIDADE ARQUITETÔNICA", 25, yCapa);
    
    yCapa += 15;
    setFont("bold", 38, COLORS.BLACK);
    const titleLines = doc.splitTextToSize(project.nome.toUpperCase(), contentWidth - 20);
    doc.text(titleLines, 25, yCapa);
    
    yCapa += (titleLines.length * 12) + 10;
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(1.5);
    doc.line(25, yCapa, 65, yCapa);

    yCapa += 20;
    setFont("normal", 12, COLORS.DARK);
    doc.text(`Cliente: ${project.cliente || "Confidencial"}`, 25, yCapa);
    
    const footerY = pageHeight - 30;
    setFont("bold", 8, COLORS.BLACK);
    doc.text("ESTÚDIO RESPONSÁVEL", 25, footerY);
    setFont("normal", 8, COLORS.GRAY);
    doc.text("ArchiDecide Professional Suite v1.8", 25, footerY + 5);
    
    doc.text("DATA DE EMISSÃO", pageWidth - margin - 40, footerY);
    setFont("bold", 10, COLORS.BLACK);
    doc.text(new Date().toLocaleDateString('pt-BR'), pageWidth - margin - 40, footerY + 8);

    // --- PÁGINA 2: O VEREDITO (LAYOUT DE IMPACTO) ---
    doc.addPage();
    drawHeaderFooter("Resumo Executivo");
    let y = 40;

    setFont("bold", 24, COLORS.BLACK);
    doc.text("O Veredito.", margin, y);
    y += 15;

    if (structuredData) {
      // Box de Recomendação
      doc.setFillColor(COLORS.ACCENT[0], COLORS.ACCENT[1], COLORS.ACCENT[2]);
      doc.roundedRect(margin, y, contentWidth, 60, 2, 2, 'F');
      
      setFont("bold", 8, COLORS.GRAY);
      doc.text("RECOMENDAÇÃO TÉCNICA", margin + 10, y + 12);
      
      setFont("bold", 32, COLORS.BLACK);
      doc.text(`PLANTA ${structuredData.recomendacao.planta}`, margin + 10, y + 28);
      
      setFont("normal", 11, COLORS.DARK);
      const motivoLines = doc.splitTextToSize(cleanText(structuredData.recomendacao.motivo), contentWidth - 20);
      doc.text(motivoLines, margin + 10, y + 40);
      
      y += 80;

      // Pilares Rápidos
      setFont("bold", 10, COLORS.BLACK);
      doc.text("PONTOS CHAVE DA DECISÃO", margin, y);
      y += 8;
      drawLine(y);
      y += 12;

      structuredData.placar.slice(0, 3).forEach(p => {
        setFont("bold", 9, COLORS.BLACK);
        doc.text(p.criterio.toUpperCase(), margin, y);
        setFont("normal", 9, COLORS.GRAY);
        doc.text(`Vencedora: Planta ${p.vencedora}`, pageWidth - margin, y, { align: 'right' });
        y += 12;
      });
    }

    // --- PÁGINA 3: DIRETRIZES CONCEITUAIS ---
    doc.addPage();
    drawHeaderFooter("Diretrizes e Conceito");
    y = 35;
    
    setFont("bold", 20, COLORS.BLACK);
    doc.text("Diretrizes Estratégicas", margin, y);
    y += 15;

    const diretrizesRaw = project.diretrizesGerais?.content || "";
    const lines = diretrizesRaw.split('\n');
    
    lines.forEach(line => {
      const text = cleanText(line);
      if (!text) return;

      if (y > pageHeight - 30) { doc.addPage(); drawHeaderFooter("Diretrizes"); y = 35; }

      if (line.includes(':') || line.startsWith('#')) {
        y += 5;
        setFont("bold", 10, COLORS.BLACK);
        doc.text(text.toUpperCase(), margin, y);
        y += 6;
      } else {
        setFont("normal", 9, COLORS.DARK);
        const wrapped = doc.splitTextToSize(`• ${text}`, contentWidth - 5);
        doc.text(wrapped, margin + 2, y);
        y += (wrapped.length * 5) + 3;
      }
    });

    // --- PÁGINA 4: QUADRO COMPARATIVO (SCORECARD) ---
    doc.addPage();
    drawHeaderFooter("Análise Técnica");
    y = 35;
    
    setFont("bold", 20, COLORS.BLACK);
    doc.text("Comparativo Técnico", margin, y);
    y += 15;

    if (structuredData) {
      // Cabeçalho Tabela
      doc.setFillColor(0, 0, 0);
      doc.rect(margin, y, contentWidth, 8, 'F');
      setFont("bold", 7, [255, 255, 255]);
      doc.text("CRITÉRIO ANALISADO", margin + 5, y + 5.5);
      doc.text("VEREDITO TÉCNICO", pageWidth - margin - 5, y + 5.5, { align: 'right' });
      y += 8;

      structuredData.placar.forEach(p => {
        if (y > pageHeight - 20) { doc.addPage(); y = 40; }
        
        y += 12;
        setFont("bold", 9, COLORS.DARK);
        doc.text(p.criterio.toUpperCase(), margin + 5, y);
        
        const pillW = 30;
        const pillX = pageWidth - margin - pillW - 5;
        
        if (p.vencedora !== 'Empate') {
          doc.setFillColor(240, 240, 240);
          doc.roundedRect(pillX, y - 5, pillW, 7, 1, 1, 'F');
          setFont("bold", 7, COLORS.BLACK);
          doc.text(`PLANTA ${p.vencedora}`, pillX + (pillW / 2), y, { align: 'center' });
        } else {
          setFont("normal", 7, COLORS.GRAY);
          doc.text("EQUILÍBRIO", pillX + (pillW / 2), y, { align: 'center' });
        }
        
        y += 4;
        drawLine(y);
      });
    }

    // --- PÁGINA 5: DETALHAMENTO (SIDE-BY-SIDE GRID) ---
    doc.addPage();
    drawHeaderFooter("Detalhamento A vs B");
    y = 35;

    setFont("bold", 20, COLORS.BLACK);
    doc.text("Análise de Ambientes e Fluxos", margin, y);
    y += 15;

    if (structuredData) {
      structuredData.detalhes.forEach((det) => {
        if (y > pageHeight - 60) { doc.addPage(); drawHeaderFooter("Análise Detalhada"); y = 35; }
        
        // Header do Critério
        doc.setFillColor(250, 250, 250);
        doc.rect(margin, y, contentWidth, 7, 'F');
        setFont("bold", 9, COLORS.BLACK);
        doc.text(det.criterio.toUpperCase(), margin + 4, y + 4.5);
        y += 12;

        const colW = (contentWidth / 2) - 10;
        
        // Coluna Alpha
        setFont("bold", 7, COLORS.GRAY);
        doc.text("PROPOSTA ALPHA", margin, y);
        y += 5;
        setFont("normal", 8.5, COLORS.DARK);
        const textA = doc.splitTextToSize(cleanText(det.analiseAlpha), colW);
        doc.text(textA, margin, y);

        // Coluna Beta (Posicionada ao lado)
        const xBeta = margin + colW + 20;
        setFont("bold", 7, COLORS.GRAY);
        doc.text("PROPOSTA BETA", xBeta, y - 5);
        const textB = doc.splitTextToSize(cleanText(det.analiseBeta), colW);
        doc.text(textB, xBeta, y);

        y += Math.max(textA.length, textB.length) * 4.5 + 8;
        
        // Conclusão do critério
        doc.setDrawColor(0,0,0);
        doc.setLineWidth(0.3);
        doc.line(margin, y, margin + 20, y);
        y += 5;
        setFont("italic", 8, COLORS.BLACK);
        doc.text(`Nota Técnica: ${cleanText(det.conclusao)}`, margin, y);
        
        y += 15;
      });
    }

    // --- PÁGINA FINAL: RISCOS E ASSINATURA ---
    doc.addPage();
    drawHeaderFooter("Conclusão e Próximos Passos");
    y = 35;

    setFont("bold", 20, COLORS.BLACK);
    doc.text("Mitigação de Riscos", margin, y);
    y += 15;

    if (structuredData) {
      structuredData.riscosMitigacoes.forEach(r => {
        doc.setFillColor(255, 250, 250);
        doc.rect(margin, y, contentWidth, 15, 'F');
        setFont("bold", 9, [150, 0, 0]);
        doc.text(`RISCO: ${cleanText(r.risco)}`, margin + 5, y + 6);
        setFont("normal", 8.5, COLORS.DARK);
        doc.text(`SOLUÇÃO: ${cleanText(r.ajusteSugerido)}`, margin + 5, y + 11);
        y += 20;
      });
    }

    y = pageHeight - 60;
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.line(margin, y, margin + 60, y);
    
    y += 8;
    setFont("bold", 10, COLORS.BLACK);
    doc.text("ARQUITETO(A) RESPONSÁVEL", margin, y);
    
    y += 5;
    setFont("normal", 8, COLORS.GRAY);
    doc.text("Registro Profissional Ativo", margin, y);
    
    y += 15;
    doc.setFillColor(0, 0, 0);
    doc.rect(margin, y, 10, 10, 'F');
    setFont("bold", 10, [255, 255, 255]);
    doc.text("AD", margin + 2, y + 7);
    setFont("bold", 8, COLORS.BLACK);
    doc.text("ARCHIDECIDE", margin + 12, y + 4);
    setFont("normal", 7, COLORS.GRAY);
    doc.text("Relatório Gerado via Inteligência Artificial", margin + 12, y + 8);

    const pdfBase64 = doc.output("datauristring");
    return { 
      blob: doc.output("blob"), 
      meta: { 
        id: crypto.randomUUID(), 
        generatedAt: new Date().toISOString(), 
        fileName: `ESTUDO_TECNICO_${project.nome.replace(/\s+/g, '_').toUpperCase()}.pdf`, 
        pdfBase64 
      } 
    };
  }
};
