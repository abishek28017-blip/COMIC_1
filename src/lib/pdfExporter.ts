import jsPDF from 'jspdf';
import { ComicStory, ExportRecord } from '../types/comic';

/**
 * Format timestamp in YYYYMMDD_HHMMSS format
 */
export function getFormattedTimestamp(): string {
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  const yyyy = now.getFullYear();
  const mm = pad(now.getMonth() + 1);
  const dd = pad(now.getDate());
  const hh = pad(now.getHours());
  const min = pad(now.getMinutes());
  const ss = pad(now.getSeconds());
  return `${yyyy}${mm}${dd}_${hh}${min}${ss}`;
}

/**
 * Compiles a ComicStory into a PDF with structured layout binding.
 * Places images, narrative captions, dialogue bubbles, and issue cover onto pages.
 */
export async function exportComicToPDF(comic: ComicStory): Promise<ExportRecord> {
  const timestamp = getFormattedTimestamp();
  const safeCharName = (comic.characterName || 'hero')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .slice(0, 16);
  const filename = `comiccraft_${safeCharName}_${timestamp}.pdf`;

  // Standard A4 portrait: 210 x 297 mm
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;

  // ==========================================
  // PAGE 1: VINTAGE COMIC BOOK COVER
  // ==========================================
  // Background yellow / aged parchment tone
  doc.setFillColor(254, 240, 138); // amber-200
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Outer border & comic inner frame
  doc.setDrawColor(24, 24, 27);
  doc.setLineWidth(1.8);
  doc.rect(margin - 4, margin - 4, contentWidth + 8, pageHeight - (margin - 4) * 2);
  doc.setLineWidth(0.6);
  doc.rect(margin - 2, margin - 2, contentWidth + 4, pageHeight - (margin - 2) * 2);

  // Top Comic Banner / Price Badge
  doc.setFillColor(239, 68, 68); // Red
  doc.rect(margin, margin, 40, 16, 'FD');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('ISSUE #1', margin + 20, margin + 7, { align: 'center' });
  doc.setFontSize(8);
  doc.text('SPECIAL EDITION', margin + 20, margin + 12, { align: 'center' });

  // ComicCraft Brand ribbon
  doc.setFillColor(24, 24, 27);
  doc.rect(margin + 46, margin, contentWidth - 46, 16, 'FD');
  doc.setTextColor(250, 204, 21); // Yellow
  doc.setFontSize(12);
  doc.text('COMICCRAFT AI STUDIOS PRESENTS', margin + 50 + (contentWidth - 46) / 2 - 20, margin + 11, { align: 'center' });

  // Main Comic Title Banner
  const titleY = margin + 30;
  doc.setFillColor(250, 204, 21); // Yellow box
  doc.rect(margin, titleY, contentWidth, 26, 'FD');
  doc.setTextColor(24, 24, 27);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  const upperTitle = comic.title.toUpperCase();
  doc.text(upperTitle, pageWidth / 2, titleY + 16, { align: 'center', maxWidth: contentWidth - 10 });

  // Subtitle / Tone & Art style ribbon
  doc.setFontSize(10);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(75, 85, 99);
  doc.text(
    `Starring: ${comic.characterName}  •  Tone: ${comic.tone.toUpperCase()}  •  Style: ${comic.artStyle.toUpperCase()}`,
    pageWidth / 2,
    titleY + 33,
    { align: 'center' }
  );

  // Featured Cover Illustration (First panel image or hero panel)
  const coverImageY = titleY + 40;
  const coverImageHeight = 110;
  const firstPanel = comic.panels[0];

  if (firstPanel && firstPanel.imageUrl) {
    try {
      doc.addImage(firstPanel.imageUrl, 'PNG', margin + 10, coverImageY, contentWidth - 20, coverImageHeight);
      doc.setDrawColor(24, 24, 27);
      doc.setLineWidth(1.2);
      doc.rect(margin + 10, coverImageY, contentWidth - 20, coverImageHeight);
    } catch {
      // Fallback box
      doc.setFillColor(229, 231, 235);
      doc.rect(margin + 10, coverImageY, contentWidth - 20, coverImageHeight, 'FD');
      doc.text(firstPanel.title, pageWidth / 2, coverImageY + 50, { align: 'center' });
    }
  }

  // Cover Sound Effect / Starburst Badge
  doc.setFillColor(239, 68, 68);
  doc.rect(pageWidth - margin - 50, coverImageY - 8, 44, 16, 'FD');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(firstPanel?.soundEffect || 'KAPOW!', pageWidth - margin - 28, coverImageY + 2, { align: 'center' });

  // Story Synopsis / Teaser Box
  const teaserY = coverImageY + coverImageHeight + 10;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(24, 24, 27);
  doc.setLineWidth(0.8);
  doc.rect(margin, teaserY, contentWidth, 34, 'FD');

  doc.setTextColor(24, 24, 27);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('THE STORY SO FAR:', margin + 6, teaserY + 8);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  const synopsisText = comic.prompt || comic.subtitle || 'An unforgettable adventure unfolds across time and realms.';
  doc.text(synopsisText, margin + 6, teaserY + 16, { maxWidth: contentWidth - 12 });

  // Footer credits
  const coverFooterY = pageHeight - margin - 4;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(75, 85, 99);
  doc.text(
    `Team: aravindhan (Lead), abishek kumar, rithika M, nilin jenilia | ComicCraft Studio`,
    pageWidth / 2,
    coverFooterY,
    { align: 'center' }
  );

  // ==========================================
  // PAGES 2+: COMIC PANELS (2 PANELS PER PAGE)
  // ==========================================
  const panelsPerPage = 2;
  const totalPages = Math.ceil(comic.panels.length / panelsPerPage);

  for (let pageIdx = 0; pageIdx < totalPages; pageIdx++) {
    doc.addPage('a4', 'portrait');

    // Page background
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    // Top Header Ribbon
    doc.setFillColor(24, 24, 27);
    doc.rect(margin, margin - 4, contentWidth, 10, 'FD');
    doc.setTextColor(250, 204, 21);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text(`${comic.title.toUpperCase()}  •  PAGE ${pageIdx + 1}`, margin + 6, margin + 2.5);
    doc.setTextColor(255, 255, 255);
    doc.text('COMICCRAFT CHRONICLES', pageWidth - margin - 6, margin + 2.5, { align: 'right' });

    const startPanel = pageIdx * panelsPerPage;
    const endPanel = Math.min(startPanel + panelsPerPage, comic.panels.length);

    const panelSlotHeight = 124; // Height per panel slot

    for (let i = startPanel; i < endPanel; i++) {
      const panel = comic.panels[i];
      const slotIndex = i % panelsPerPage;
      const currentSlotY = margin + 12 + slotIndex * (panelSlotHeight + 8);

      // Panel Outer Border Box
      doc.setDrawColor(24, 24, 27);
      doc.setLineWidth(1.2);
      doc.setFillColor(250, 250, 249); // light background
      doc.rect(margin, currentSlotY, contentWidth, panelSlotHeight, 'FD');

      // Top Tag Ribbon: Panel number + Camera shot
      doc.setFillColor(24, 24, 27);
      doc.rect(margin, currentSlotY, 65, 8, 'F');
      doc.setTextColor(250, 204, 21);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.text(`PANEL #${panel.panelNumber} • ${panel.cameraAngle || 'DYNAMIC SHOT'}`, margin + 4, currentSlotY + 5.5);

      // Sound Effect badge if present
      if (panel.soundEffect) {
        doc.setFillColor(239, 68, 68);
        doc.rect(pageWidth - margin - 35, currentSlotY, 35, 8, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.text(panel.soundEffect.toUpperCase(), pageWidth - margin - 17.5, currentSlotY + 5.5, { align: 'center' });
      }

      // Illustration on the left half
      const imgWidth = 78;
      const imgHeight = 78;
      const imgX = margin + 4;
      const imgY = currentSlotY + 12;

      if (panel.imageUrl) {
        try {
          doc.addImage(panel.imageUrl, 'PNG', imgX, imgY, imgWidth, imgHeight);
          doc.setDrawColor(24, 24, 27);
          doc.setLineWidth(0.8);
          doc.rect(imgX, imgY, imgWidth, imgHeight);
        } catch {
          doc.setFillColor(243, 244, 246);
          doc.rect(imgX, imgY, imgWidth, imgHeight, 'FD');
          doc.setTextColor(107, 114, 128);
          doc.setFontSize(9);
          doc.text(`[Panel ${panel.panelNumber}]`, imgX + imgWidth / 2, imgY + imgHeight / 2, { align: 'center' });
        }
      }

      // Setting / Location subtitle below image
      doc.setTextColor(107, 114, 128);
      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'italic');
      doc.text(`Setting: ${panel.setting}`, imgX, imgY + imgHeight + 6, { maxWidth: imgWidth });

      // Action description
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.text(panel.action, imgX, imgY + imgHeight + 11, { maxWidth: imgWidth });

      // Right Column: Dialogue and Narration Boxes
      const textX = imgX + imgWidth + 6;
      const textWidth = contentWidth - (imgWidth + 14);

      // Narration Box (Classic Comic Yellow Box at top)
      const narrY = currentSlotY + 12;
      const narrHeight = 30;
      doc.setFillColor(254, 240, 138); // Yellow narration box
      doc.setDrawColor(24, 24, 27);
      doc.setLineWidth(0.7);
      doc.rect(textX, narrY, textWidth, narrHeight, 'FD');

      doc.setTextColor(24, 24, 27);
      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'bold');
      doc.text('NARRATOR:', textX + 4, narrY + 6);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.text(panel.narration, textX + 4, narrY + 13, { maxWidth: textWidth - 8 });

      // Dialogue Speech Balloons
      let dialogueY = narrY + narrHeight + 6;
      const dialoguesToRender = panel.dialogues.slice(0, 2);

      dialoguesToRender.forEach((diag) => {
        const bubbleHeight = 28;
        // White bubble with black border
        doc.setFillColor(255, 255, 255);
        doc.setDrawColor(24, 24, 27);
        doc.setLineWidth(0.8);
        doc.roundedRect(textX, dialogueY, textWidth, bubbleHeight, 3, 3, 'FD');

        // Speaker name
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(185, 28, 28); // dark red
        const bubbleTypeTag = diag.type === 'thought' ? ' (THOUGHT)' : diag.type === 'shout' ? ' (SHOUT)' : '';
        doc.text(`${diag.speaker.toUpperCase()}${bubbleTypeTag}:`, textX + 4, dialogueY + 7);

        // Dialogue text
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(24, 24, 27);
        doc.text(`"${diag.text}"`, textX + 4, dialogueY + 15, { maxWidth: textWidth - 8 });

        dialogueY += bubbleHeight + 4;
      });
    }

    // Page footer
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(156, 163, 175);
    doc.text(
      `ComicCraft AI • ${comic.title} • Generated on ${new Date().toLocaleDateString()}`,
      pageWidth / 2,
      pageHeight - margin + 4,
      { align: 'center' }
    );
  }

  // Trigger PDF file download
  doc.save(filename);

  // Return structured export record
  const pdfBlob = doc.output('blob');
  return {
    id: `export_${timestamp}`,
    comicId: comic.id,
    comicTitle: comic.title,
    filename,
    exportDate: new Date().toISOString(),
    pageCount: totalPages + 1, // Cover page + panel pages
    panelCount: comic.panels.length,
    fileSizeBytes: pdfBlob.size,
  };
}
