import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { successResponse } from '../utils/success-response';
import { tryCatch } from '../utils/try-catch';
import { IUser } from '../utils/user.interface';

export class AuthController {
   static login = tryCatch(async (req: Request, res: Response) => {
      const { username, password } = req.body;
      const result = await AuthService.login(username, password);
      successResponse(
         res,
         result.status ? { access_token: result.token } : result,
         result.status,
         result.message
      );
   });

   static refresh = tryCatch(async (req: Request, res: Response) => {
      const { refreshToken } = req.body;
      const result = await AuthService.refreshToken(refreshToken);
      successResponse(res, result);
   });

   static changePassword = tryCatch(
      async (req: Request & { user: IUser }, res: Response) => {
         const { newPassword, oldPassword } = req.body;
         const { userId } = req.user;
         await AuthService.changePassword(userId, newPassword, oldPassword);
         successResponse(res, null);
      }
   );

   static updateProfile = tryCatch(
      async (req: Request & { user: IUser }, res: Response) => {
         const { userId } = req.user;
         const { fullname, avatar } = req.body;
         await AuthService.updateProfile(userId, fullname, avatar);
         successResponse(res, null);
      }
   );
}
