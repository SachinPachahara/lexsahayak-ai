import { createCanvas } from '@napi-rs/canvas';
import Tesseract from 'tesseract.js';
import path from 'node:path';
import { createRequire } from 'node:module';
import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';

const require = createRequire(import.meta.url);
const englishDataPath = path.join(path.dirname(require.resolve('@tesseract.js-data/eng/package.json')), '4.0.0');

async function recognizeImage(image) {
  const options = { logger: () => {} };
  if (env.OCR_LANGUAGE === 'eng') options.langPath = englishDataPath;
  const { data } = await Tesseract.recognize(image, env.OCR_LANGUAGE, options);
  return String(data.text || '').trim();
}

export async function extractImageText(buffer) {
  try {
    return await recognizeImage(buffer);
  } catch {
    throw new ApiError(422, 'OCR could not read this image. Use a clearer, upright image with readable text.', 'OCR_FAILED');
  }
}

export async function extractScannedPdfText(buffer) {
  try {
    const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
    const pdf = await pdfjs.getDocument({ data: new Uint8Array(buffer) }).promise;
    const pageCount = Math.min(pdf.numPages, env.OCR_MAX_PAGES);
    const pages = [];
    for (let pageNumber = 1; pageNumber <= pageCount; pageNumber += 1) {
      const page = await pdf.getPage(pageNumber);
      const viewport = page.getViewport({ scale: 2 });
      const canvas = createCanvas(Math.ceil(viewport.width), Math.ceil(viewport.height));
      await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;
      const text = await recognizeImage(canvas.toBuffer('image/png'));
      if (text) pages.push(`Page ${pageNumber}\n${text}`);
    }
    return pages.join('\n\n');
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(422, 'OCR could not read this scanned PDF. Use a clearer PDF or fewer pages.', 'OCR_FAILED');
  }
}
