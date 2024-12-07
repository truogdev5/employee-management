import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { checkToken } from '../middlewares/auth.middleware';
const router = Router();

router.get('/', checkToken, UserController.getUsers);
router.get('/:id', checkToken, UserController.getUser);
router.post('/', checkToken, UserController.createUser);
router.put('/:id', checkToken, UserController.updateUser);
router.delete('/:id', checkToken, UserController.deleteUser);
router.post('/:id/change-status', checkToken, UserController.changeStatus);

export default router;
