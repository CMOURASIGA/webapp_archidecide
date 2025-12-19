
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

    // --- SYSTEM DESIGN TOKENS ---
    const COLORS = {
      BLACK: [0, 0, 0] as [number, number, number],
      DARK: [40, 40, 40] as [number, number, number],
      GRAY_MID: [120, 120, 120] as [number, number, number],
      GRAY_LIGHT: [200, 200, 200] as [number, number, number],
      GRAY_ULTRA_LIGHT: [245, 245, 245] as [number, number, number],
      EMERALD: [16, 185, 129] as [number, number, number],
      WHITE: [255, 255, 255] as [number, number, number]
    };

    const setFont = (weight: "bold" | "normal" | "italic" = "normal", size: number = 10, color = COLORS.DARK) => {
      doc.setFont("helvetica", weight);
      doc.setFontSize(size);
      doc.setTextColor(color[0], color[1], color[2]);
    };

    const drawLine = (y: number, color = COLORS.GRAY_ULTRA_LIGHT, width = 0.1) => {
      doc.setDrawColor(color[0], color[1], color[2]);
      doc.setLineWidth(width);
      doc.line(margin, y, pageWidth - margin, y);
    };

    const drawHeaderFooter = () => {
      if (doc.internal.getNumberOfPages() > 1) {
        drawLine(18);
        setFont("bold", 7, COLORS.GRAY_LIGHT);
        doc.text(`${project.nome.toUpperCase()} • RELATÓRIO TÉCNICO V${project.version}`, margin, 14);
        doc.text("ARCHIDECIDE STUDIO", pageWidth - margin, 14, { align: 'right' });
        
        setFont("normal", 7, COLORS.GRAY_LIGHT);
        doc.text(`${doc.internal.getCurrentPageInfo().pageNumber}`, pageWidth / 2, pageHeight - 12, { align: 'center' });
      }
    };

    // --- PÁGINA 1: CAPA EDITORIAL ---
    doc.setFillColor(252, 252, 252);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');
    
    // Elemento Decorativo: Linha de autoridade
    doc.setFillColor(0, 0, 0);
    doc.rect(margin, margin, 2, 40, 'F');

    setFont("bold", 42, COLORS.BLACK);
    const titleLines = doc.splitTextToSize(project.nome.toUpperCase(), contentWidth - 20);
    doc.text(titleLines, margin, 80);
    
    setFont("normal", 12, COLORS.GRAY_MID);
    doc.text("ESTUDO DE VIABILIDADE E APOIO À DECISÃO", margin, 80 + (titleLines.length * 15));

    // Bloco de Info no Rodapé da Capa
    const footerY = pageHeight - 60;
    drawLine(footerY - 10);
    
    setFont("bold", 8, COLORS.GRAY_LIGHT);
    doc.text("PREPARADO PARA", margin, footerY);
    setFont("bold", 14, COLORS.BLACK);
    doc.text(project.cliente || "CLIENTE NÃO INFORMADO", margin, footerY + 8);

    setFont("bold", 8, COLORS.GRAY_LIGHT);
    doc.text("DATA DE EMISSÃO", pageWidth - margin, footerY, { align: 'right' });
    setFont("bold", 12, COLORS.BLACK);
    doc.text(new Date().toLocaleDateString('pt-BR'), pageWidth - margin, footerY + 8, { align: 'right' });

    // --- PÁGINA 2: RESUMO EXECUTIVO (O CONVENCIMENTO) ---
    doc.addPage();
    drawHeaderFooter();
    let cursorY = 45;

    setFont("bold", 28, COLORS.BLACK);
    doc.text("Resumo Executivo", margin, cursorY);
    cursorY += 25;

    // Card de Decisão (O PONTO FOCAL)
    if (structuredData) {
      doc.setFillColor(0, 0, 0);
      doc.roundedRect(margin, cursorY, contentWidth, 60, 3, 3, 'F');
      
      setFont("bold", 8, [150, 150, 150]);
      doc.text("PARECER TÉCNICO FINAL", margin + 12, cursorY + 15);
      
      setFont("bold", 24, COLORS.WHITE);
      doc.text(`RECOMENDAÇÃO: PLANTA ${structuredData.recomendacao.planta.toUpperCase()}`, margin + 12, cursorY + 30);
      
      setFont("normal", 10, [200, 200, 200]);
      const recLines = doc.splitTextToSize(structuredData.recomendacao.motivo, contentWidth - 24);
      doc.text(recLines, margin + 12, cursorY + 42);
      cursorY += 85;

      // Por que esta opção? (Value Proposition)
      setFont("bold", 12, COLORS.BLACK);
      doc.text("Pilares da Recomendação:", margin, cursorY);
      cursorY += 12;
      
      const valueProps = [
        "Otimização Superior: Máximo aproveitamento da área útil com mínima circulação.",
        "Conforto Ambiental: Orientação solar e ventilação cruzada priorizadas.",
        "Funcionalidade: Setorização inteligente entre áreas sociais e íntimas."
      ];
      
      valueProps.forEach(prop => {
        doc.setFillColor(COLORS.GRAY_ULTRA_LIGHT[0], COLORS.GRAY_ULTRA_LIGHT[1], COLORS.GRAY_ULTRA_LIGHT[2]);
        doc.roundedRect(margin, cursorY, contentWidth, 12, 1, 1, 'F');
        setFont("bold", 9, COLORS.DARK);
        doc.text(`• ${prop}`, margin + 5, cursorY + 7.5);
        cursorY += 15;
      });
    }

    // --- PÁGINA 3: DIRETRIZES TÉCNICAS ---
    doc.addPage();
    drawHeaderFooter();
    cursorY = 45;

    setFont("bold", 24, COLORS.BLACK);
    doc.text("Diretrizes e Premissas", margin, cursorY);
    cursorY += 20;

    if (project.diretrizesGerais) {
      const sections = project.diretrizesGerais.content.split('\n');
      sections.forEach(line => {
        if (!line.trim()) return;
        if (cursorY > pageHeight - 30) { doc.addPage(); drawHeaderFooter(); cursorY = 45; }

        if (line.includes(':') || line.startsWith('#')) {
          cursorY += 8;
          setFont("bold", 12, COLORS.BLACK);
          doc.text(line.replace(/#/g, "").trim().toUpperCase(), margin, cursorY);
          cursorY += 8;
        } else {
          setFont("normal", 10, COLORS.GRAY_MID);
          const wrapped = doc.splitTextToSize(line.replace(/^-/g, "•").trim(), contentWidth);
          doc.text(wrapped, margin, cursorY);
          cursorY += (wrapped.length * 6) + 2;
        }
      });
    }

    // --- PÁGINA 4: QUADRO COMPARATIVO (VISUAL) ---
    doc.addPage();
    drawHeaderFooter();
    cursorY = 45;

    setFont("bold", 24, COLORS.BLACK);
    doc.text("Quadro Comparativo", margin, cursorY);
    cursorY += 20;

    if (structuredData) {
      // Header sutil
      setFont("bold", 8, COLORS.GRAY_LIGHT);
      doc.text("CRITÉRIO DE ANÁLISE", margin, cursorY);
      doc.text("DESEMPENHO RELATIVO", pageWidth - margin, cursorY, { align: 'right' });
      cursorY += 5;
      drawLine(cursorY);
      cursorY += 15;

      structuredData.placar.forEach(p => {
        setFont("bold", 11, COLORS.DARK);
        doc.text(p.criterio, margin, cursorY + 5);
        
        // Pill de vencedor
        const pillWidth = 40;
        const pillX = pageWidth - margin - pillWidth;
        
        if (p.vencedora !== 'Empate') {
          doc.setFillColor(0, 0, 0);
          doc.roundedRect(pillX, cursorY, pillWidth, 8, 2, 2, 'F');
          setFont("bold", 7, COLORS.WHITE);
          doc.text(`PLANTA ${p.vencedora.toUpperCase()}`, pillX + (pillWidth/2), cursorY + 5.5, { align: 'center' });
        } else {
          doc.setFillColor(245, 245, 245);
          doc.roundedRect(pillX, cursorY, pillWidth, 8, 2, 2, 'F');
          setFont("bold", 7, COLORS.GRAY_MID);
          doc.text("EQUILÍBRIO", pillX + (pillWidth/2), cursorY + 5.5, { align: 'center' });
        }
        
        cursorY += 15;
        drawLine(cursorY - 5);
      });
    }

    // --- PÁGINA 5: ANÁLISE DETALHADA (EDITORIAL) ---
    doc.addPage();
    drawHeaderFooter();
    cursorY = 45;

    setFont("bold", 24, COLORS.BLACK);
    doc.text("Análise Detalhada", margin, cursorY);
    cursorY += 20;

    if (structuredData) {
      structuredData.detalhes.forEach((det, idx) => {
        if (cursorY > pageHeight - 80) { doc.addPage(); drawHeaderFooter(); cursorY = 45; }

        setFont("bold", 14, COLORS.BLACK);
        doc.text(`${idx + 1}. ${det.criterio}`, margin, cursorY);
        cursorY += 12;

        // Layout de Duas Colunas
        const colW = (contentWidth / 2) - 8;
        
        setFont("bold", 7, COLORS.GRAY_LIGHT);
        doc.text("OPÇÃO ALPHA", margin, cursorY);
        doc.text("OPÇÃO BETA", margin + colW + 16, cursorY);
        cursorY += 6;

        setFont("normal", 9, COLORS.GRAY_MID);
        const linesA = doc.splitTextToSize(det.analiseAlpha, colW);
        const linesB = doc.splitTextToSize(det.analiseBeta, colW);
        
        doc.text(linesA, margin, cursorY);
        doc.text(linesB, margin + colW + 16, cursorY);

        const h = Math.max(linesA.length, linesB.length) * 5;
        cursorY += h + 12;
        
        // Veredito do critério
        doc.setFillColor(250, 250, 250);
        doc.rect(margin, cursorY - 5, contentWidth, 10, 'F');
        setFont("italic", 8, COLORS.BLACK);
        doc.text(`Conclusão: ${det.conclusao}`, margin + 5, cursorY + 1.5);
        cursorY += 25;
      });
    }

    // --- PÁGINA FINAL: PARECER E ENCERRAMENTO ---
    doc.addPage();
    drawHeaderFooter();
    cursorY = 45;

    setFont("bold", 24, COLORS.BLACK);
    doc.text("Parecer Final", margin, cursorY);
    cursorY += 20;

    if (structuredData) {
      // Riscos em Vermelho Sutil
      setFont("bold", 11, [150, 0, 0]);
      doc.text("Riscos Identificados e Pontos de Atenção", margin, cursorY);
      cursorY += 10;
      
      structuredData.riscosMitigacoes.forEach(item => {
        setFont("normal", 10, COLORS.DARK);
        const rText = doc.splitTextToSize(`• Risco: ${item.risco}`, contentWidth);
        doc.text(rText, margin, cursorY);
        cursorY += (rText.length * 5) + 3;
        
        setFont("bold", 10, COLORS.EMERALD);
        const aText = doc.splitTextToSize(`  Mitigação: ${item.ajusteSugerido}`, contentWidth);
        doc.text(aText, margin, cursorY);
        cursorY += (aText.length * 5) + 8;
      });
    }

    // Assinatura de Autoridade
    cursorY = pageHeight - 60;
    doc.setDrawColor(0);
    doc.setLineWidth(0.8);
    doc.line(margin, cursorY, margin + 60, cursorY);
    
    setFont("bold", 9, COLORS.BLACK);
    doc.text("ARQUITETO RESPONSÁVEL", margin, cursorY + 8);
    setFont("normal", 8, COLORS.GRAY_MID);
    doc.text("ArchiDecide Professional Report", margin, cursorY + 14);
    doc.text("Este documento possui validade técnica para fins de planejamento.", margin, cursorY + 19);

    const pdfBase64 = doc.output("datauristring");
    const blob = doc.output("blob");
    
    return { 
      blob, 
      meta: {
        id: crypto.randomUUID(),
        generatedAt: new Date().toISOString(),
        fileName: `ESTUDO_TECNICO_${project.nome.replace(/\s+/g, '_').toUpperCase()}.pdf`,
        pdfBase64
      } 
    };
  }
};
