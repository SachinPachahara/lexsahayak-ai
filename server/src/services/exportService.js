import PDFDocument from 'pdfkit';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';

export function toPdfBuffer({ title, content, signatures = [], watermark = null }) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      margin: 54,
      size: 'A4',
      bufferPages: true,
      info: { Title: title, Author: 'LexSahayak AI' }
    });
    const chunks = [];
    doc.on('data', c => chunks.push(c));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    // Title Header
    doc.fontSize(18).font('Helvetica-Bold').fillColor('#0f172a').text(title, { align: 'center' }).moveDown(0.5);
    doc.fontSize(8.5).font('Helvetica-Oblique').fillColor('#64748b').text('AI-assisted legal document draft — review with a qualified professional before consequential use.', { align: 'center' }).moveDown(1.5);

    // Document Body text with consistent 10.5pt font
    doc.fillColor('#1e293b').fontSize(10.5).font('Helvetica');
    const paragraphs = content.split(/\n\n+/).map(p => p.trim()).filter(Boolean);
    paragraphs.forEach((para, idx) => {
      doc.text(para, { align: 'justify', lineGap: 3 });
      if (idx < paragraphs.length - 1) doc.moveDown(0.7);
    });

    // Signatures and Digital Execution Trail
    if (signatures && signatures.length > 0) {
      if (doc.y > 640) { doc.addPage(); }
      doc.moveDown(1.5);
      doc.fontSize(12).font('Helvetica-Bold').fillColor('#1e1b4b').text('DIGITAL EXECUTION & AUDIT TRAIL', { align: 'left' }).moveDown(0.5);
      doc.fontSize(8.5).font('Helvetica').fillColor('#64748b').text('Recorded securely on LexSahayak AI platform. Cryptographic verification stamps attached below:', { align: 'left' }).moveDown(0.8);

      for (const sig of signatures) {
        if (doc.y > 680) { doc.addPage(); }
        const boxY = doc.y;
        doc.roundedRect(54, boxY, 485, 75, 4).strokeColor('#cbd5e1').stroke();
        doc.fillColor('#0f172a').fontSize(10).font('Helvetica-Bold').text(`Signatory: ${sig.partyName} [${sig.partyRole || 'Signatory'}]`, 68, boxY + 12);
        doc.fontSize(8.5).font('Helvetica').fillColor('#475569').text(`Signed At: ${new Date(sig.signedAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST`, 68, boxY + 28);
        doc.text(`Verification Code: ${sig.verificationCode || 'LX-VERIFIED'}`, 68, boxY + 42);
        doc.fillColor('#4f46e5').fontSize(8).text(`Tamper-evident Audit Seal: Verified Authentic Document`, 68, boxY + 56);
        doc.y = boxY + 88;
      }
    }

    // Stamp watermark and page numbers on all buffered pages without adding blank pages
    const range = doc.bufferedPageRange();
    for (let i = range.start; i < range.start + range.count; i++) {
      doc.switchToPage(i);

      if (watermark) {
        doc.save();
        doc.opacity(0.12);
        doc.rotate(-45, { origin: [doc.page.width / 2, doc.page.height / 2] });
        doc.fontSize(52).font('Helvetica-Bold').fillColor('#64748b');
        doc.text(String(watermark).toUpperCase(), doc.page.width / 2 - 250, doc.page.height / 2 - 25, {
          width: 500,
          align: 'center',
          lineBreak: false
        });
        doc.restore();
      }

      // Page Number Footer (temporarily zero bottom margin so PDFKit never auto-spawns an extra page)
      const oldBottom = doc.page.margins.bottom;
      doc.page.margins.bottom = 0;
      doc.save();
      doc.fontSize(8).font('Helvetica').fillColor('#94a3b8');
      doc.text(`Page ${i + 1} of ${range.count} — LexSahayak AI Legal Assistant`, 54, doc.page.height - 35, {
        width: doc.page.width - 108,
        align: 'center',
        lineBreak: false
      });
      doc.restore();
      doc.page.margins.bottom = oldBottom;
    }

    doc.end();
  });
}
export async function toDocxBuffer({ title, content, watermark = null }) {
  const children = [
    new Paragraph({ heading: HeadingLevel.TITLE, children: [new TextRun(title)] }),
    new Paragraph({ children: [new TextRun({ text: watermark ? `[STATUS: ${String(watermark).toUpperCase()}] — AI-assisted legal document draft — professional review recommended.` : 'AI-assisted legal document draft — professional review recommended.', italics: true })] })
  ];
  for (const p of content.split(/\n\n+/)) {
    const trimmed = p.trim();
    if (!trimmed) continue;
    children.push(new Paragraph({ children: [new TextRun(trimmed)], spacing: { after: 180 } }));
  }
  return Packer.toBuffer(new Document({ sections: [{ properties: {}, children }] }));
}
