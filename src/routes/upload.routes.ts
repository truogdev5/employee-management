import { Router } from 'express';
import { upload, UploadController } from '../controllers/upload.controller';
import { checkToken } from '../middlewares/auth.middleware';

const router = Router();

router.post('/', checkToken, upload.single('file'), UploadController.upload);

export default router;
