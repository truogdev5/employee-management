import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { checkToken } from '../middlewares/auth.middleware';
const router = Router();

router.post('/login', AuthController.login);
router.post('/refresh-token', AuthController.refresh);
router.post('/change-password', checkToken, AuthController.changePassword);
router.post('/update-profile', checkToken, AuthController.updateProfile);

export default router;
