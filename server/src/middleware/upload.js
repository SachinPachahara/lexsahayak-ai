import multer from 'multer';
import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';
export const documentUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: env.MAX_UPLOAD_MB * 1024 * 1024, files: 1, fields: 10 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['application/pdf','application/vnd.openxmlformats-officedocument.wordprocessingml.document','text/plain','image/jpeg','image/png','application/octet-stream'];
    if(!allowed.includes(file.mimetype)) return cb(new ApiError(415,'Unsupported upload MIME type. Use PDF, DOCX, TXT, JPG, or PNG.','UNSUPPORTED_MIME'));
    return cb(null,true);
  }
});
