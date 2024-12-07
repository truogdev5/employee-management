import { UserEntity } from '../entities/user.entity';
import { AppDataSource } from '../utils/database';
import { BooleanEnum, StatusCode, UserStatus } from '../utils/enum';
import { generateRandomString } from '../utils/function';
import * as bcrypt from 'bcrypt';
import { AppError } from '../utils/try-catch';

const userRepository = AppDataSource.getRepository(UserEntity);

export class UserService {
   static async getUsers() {
      return await userRepository.find();
   }

   static async getUser(id: number) {
      const user = await userRepository.findOne({ where: { id } });

      if (!user) throw new AppError('User not found', StatusCode.NOT_FOUND);

      return user;
   }

   static async createUser(data: Partial<UserEntity>) {
      const existUser = await userRepository.findOne({
         where: { username: data.username },
      });

      if (existUser) {
         throw new AppError('Username already exist', StatusCode.BAD_REQUEST);
      }

      const password = generateRandomString();

      data.password = bcrypt.hashSync(password, 10);
      const user = userRepository.create(data);
      const newUser = await userRepository.save(user);
      return {
         ...data,
         id: newUser.id,
         password,
         is_admin: BooleanEnum.FALSE,
      };
   }

   static async updateUser(id: number, updates: Partial<UserEntity>) {
      const user = await userRepository.findOneBy({ id });
      if (!user) throw new AppError('User not found', StatusCode.NOT_FOUND);

      Object.assign(user, updates);
      const updatedUser = await userRepository.save(user);

      const { password, ...userData } = updatedUser;

      return userData;
   }
   static async deleteUser(id: number) {
      const user = await userRepository.findOneBy({ id });
      if (!user) throw new AppError('User not found', StatusCode.NOT_FOUND);

      await userRepository.remove(user);
   }

   static async changeStatus(id: number) {
      const user = await userRepository.findOneBy({ id });
      if (!user) throw new AppError('User not found', StatusCode.NOT_FOUND);

      user.status =
         user.status === UserStatus.ACTIVE
            ? UserStatus.DEACTIVE
            : UserStatus.ACTIVE;

      await userRepository.save(user);
   }
}
