import multer from 'multer';
import * as path from 'path';
import { successResponse } from '../utils/success-response';
import { Response } from 'express';
import { tryCatch } from '../utils/try-catch';

const storage = multer.diskStorage({
   destination: (req, file, cb) => {
      cb(null, 'src/uploads');
   },
   filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
   },
});

export const upload = multer({ storage: storage });

export class UploadController {
   static upload = tryCatch(async (req: any, res: Response) => {
      successResponse(res, { filePath: `/uploads/${req.file.filename}` });
   });
}
