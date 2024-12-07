import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { successResponse } from '../utils/success-response';
import { BooleanEnum, StatusCode } from '../utils/enum';
import { AppError, tryCatch } from '../utils/try-catch';
import { IUser } from '../utils/user.interface';

export class UserController {
   static getUsers = tryCatch(async (req: Request, res: Response) => {
      const users = await UserService.getUsers();
      successResponse(res, users);
   });

   static getUser = tryCatch(async (req: Request, res: Response) => {
      const { id } = req.params;
      const user = await UserService.getUser(+id);
      successResponse(res, user);
   });

   static createUser = tryCatch(
      async (req: Request & { user: IUser }, res: Response) => {
         const { username, fullname, avatar, status, is_admin } = req.body;

         if (req.user.is_admin === BooleanEnum.FALSE) {
            throw new AppError(
               'You have no permission to create user',
               StatusCode.BAD_REQUEST
            );
         }

         const user = await UserService.createUser({
            username,
            fullname,
            avatar,
            status,
            is_admin,
         });

         successResponse(res, user);
      }
   );

   static updateUser = tryCatch(
      async (req: Request & { user: IUser }, res: Response) => {
         if (req.user.is_admin === BooleanEnum.FALSE)
            throw new AppError(
               'You have no permission to create user',
               StatusCode.BAD_REQUEST
            );

         const { id } = req.params;
         const updates = req.body;
         const user = await UserService.updateUser(Number(id), updates);
         successResponse(res, user);
      }
   );

   static deleteUser = tryCatch(
      async (req: Request & { user: IUser }, res: Response) => {
         if (req.user.is_admin === BooleanEnum.FALSE)
            throw new AppError(
               'You have no permission to create user',
               StatusCode.BAD_REQUEST
            );

         const { id } = req.params;
         await UserService.deleteUser(Number(id));
         successResponse(res, null);
      }
   );

   static changeStatus = tryCatch(
      async (req: Request & { user: IUser }, res: Response) => {
         if (req.user.is_admin === BooleanEnum.FALSE) {
            throw new AppError(
               'You have no permission to create user',
               StatusCode.BAD_REQUEST
            );
         }

         const { id } = req.params;
         await UserService.changeStatus(Number(id));
         successResponse(res, null);
      }
   );
}
