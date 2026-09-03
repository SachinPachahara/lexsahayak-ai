import PDFDocument from 'pdfkit';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';

export function toPdfBuffer({ title, content }) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 54, size: 'A4', info: { Title: title, Author: 'LexSahayak AI' } });
    const chunks = [];
    doc.on('data', c => chunks.push(c)); doc.on('end', () => resolve(Buffer.concat(chunks))); doc.on('error', reject);
    doc.fontSize(18).font('Helvetica-Bold').text(title, { align: 'center' }).moveDown();
    doc.fontSize(9).font('Helvetica-Oblique').fillColor('#555555').text('AI-assisted legal document draft — review with a qualified professional before consequential use.', { align: 'center' }).moveDown(1.5);
    doc.fillColor('#111111').fontSize(11).font('Helvetica');
    for (const para of content.split(/\n\n+/)) doc.text(para.trim(), { align: 'justify', lineGap: 3 }).moveDown(0.7);
    doc.end();
  });
}
export async function toDocxBuffer({ title, content }) {
  const children = [new Paragraph({ heading: HeadingLevel.TITLE, children: [new TextRun(title)] }), new Paragraph({ children: [new TextRun({ text: 'AI-assisted legal document draft — professional review recommended.', italics: true })] })];
  for (const p of content.split(/\n\n+/)) children.push(new Paragraph({ children: [new TextRun(p.trim())], spacing: { after: 180 } }));
  return Packer.toBuffer(new Document({ sections: [{ properties: {}, children }] }));
}
