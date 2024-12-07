import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { authConfig } from '../config/auth.config';
import { UserEntity } from '../entities/user.entity';
import { AppDataSource } from '../utils/database';
import { BooleanEnum, StatusCode } from '../utils/enum';
import { AppError } from '../utils/try-catch';

const userRepository = AppDataSource.getRepository(UserEntity);

export class AuthService {
   static async login(username: string, password: string) {
      const user = await userRepository.findOne({
         where: { username },
         select: ['id', 'username', 'password', 'is_logged', 'is_admin'],
      });

      if (!user) throw new AppError('User not found', StatusCode.NOT_FOUND);

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid)
         throw new AppError('Invalid password', StatusCode.BAD_REQUEST);

      // nếu là user và login ban đầu thì bắt buộc đổi mật khẩu
      // vì tài khoản được admin tạo nên mặt khẩu đang rỗng
      if (!user.is_logged) {
         const token = jwt.sign(
            {
               userId: user.id,
               username: user.username,
               is_admin: user.is_admin,
            },
            authConfig.accessTokenSecret,
            { expiresIn: authConfig.accessTokenExpiration }
         );

         return {
            status: StatusCode.PRECONDITION_REQUIRED,
            message: 'You need to change your password before proceeding',
            token,
         };
      }

      const accessToken = jwt.sign(
         { userId: user.id, username: user.username, is_admin: user.is_admin },
         authConfig.accessTokenSecret,
         { expiresIn: authConfig.accessTokenExpiration }
      );

      const refreshToken = jwt.sign(
         { userId: user.id },
         authConfig.refreshTokenSecret,
         { expiresIn: authConfig.refreshTokenExpiration }
      );
      return {
         accessToken,
         refreshToken,
         user: {
            id: user.id,
            username: user.username,
            is_admin: user.is_admin,
         },
      };
   }

   static async refreshToken(token: string) {
      try {
         const decoded = jwt.verify(
            token,
            authConfig.refreshTokenSecret
         ) as any;

         const user = await userRepository.findOne({
            where: { id: decoded.userId },
         });

         if (!user) {
            throw new AppError('User not found', StatusCode.NOT_FOUND);
         }

         const accessToken = jwt.sign(
            {
               userId: user.id,
               username: user.username,
               is_admin: user.is_admin,
            },
            authConfig.accessTokenSecret,
            { expiresIn: authConfig.accessTokenExpiration }
         );

         return { accessToken };
      } catch (error) {
         if (error instanceof jwt.TokenExpiredError) {
            throw new AppError('Token has expired', StatusCode.UNAUTHORIZED);
         } else {
            throw new AppError('Invalid token', StatusCode.UNAUTHORIZED);
         }
      }
   }

   static async firstPasswordChange(userId: number, newPassword: string) {
      const user = await userRepository.findOne({ where: { id: userId } });

      if (!user) {
         throw new AppError('User not found', StatusCode.NOT_FOUND);
      }

      const hash = await bcrypt.hash(newPassword, 10);
      await userRepository.update(userId, { password: hash });

      const accessToken = jwt.sign(
         { userId: user.id, username: user.username },
         authConfig.accessTokenSecret,
         { expiresIn: authConfig.accessTokenExpiration }
      );

      return { accessToken };
   }

   static async changePassword(
      userId: number,
      newPassword: string,
      oldPassword: string
   ) {
      const user = await userRepository.findOne({
         where: { id: userId },
         select: ['password'],
      });

      if (!user) throw new AppError('User not found', StatusCode.NOT_FOUND);

      const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

      if (!isPasswordValid) {
         throw new AppError('Invalid old password', StatusCode.NOT_FOUND);
      }

      const hash = await bcrypt.hash(newPassword, 10);
      user.password = hash;
      await userRepository.update(
         { id: userId },
         {
            password: hash,
            is_logged: user.is_logged ? user.is_logged : BooleanEnum.TRUE,
         }
      );

      return;
   }

   static async updateProfile(
      userId: number,
      fullname: string,
      avatar: string
   ) {
      const user = await userRepository.findOne({ where: { id: userId } });
      if (!user) {
         throw new AppError('User not found', StatusCode.NOT_FOUND);
      }

      await userRepository.update(userId, { fullname, avatar });
   }
}
