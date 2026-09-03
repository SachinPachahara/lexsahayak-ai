import sanitizeFilename from 'sanitize-filename';
const ext = name => (name.toLowerCase().match(/\.[a-z0-9]+$/)?.[0] || '');
export function validateUpload(file) {
  const safeName = sanitizeFilename(file.originalname || 'document').slice(0, 120);
  const extension = ext(safeName);
  const buf = file.buffer || Buffer.alloc(0);
  const isPdf = extension === '.pdf' && buf.slice(0, 5).toString() === '%PDF-';
  const isTxt = extension === '.txt' && !buf.includes(0);
  const isDocx = extension === '.docx' && buf[0] === 0x50 && buf[1] === 0x4b;
  const isPng = extension === '.png' && buf.slice(0, 8).equals(Buffer.from([0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a]));
  const isJpeg = ['.jpg','.jpeg'].includes(extension) && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff;
  if (!isPdf && !isTxt && !isDocx && !isPng && !isJpeg) return { valid: false, safeName, extension };
  return { valid: true, safeName, extension };
}
