import {
   Entity,
   PrimaryGeneratedColumn,
   Column,
   CreateDateColumn,
   UpdateDateColumn,
} from 'typeorm';
import { generateRandomString } from '../utils/function';

@Entity('users')
export class UserEntity {
   @PrimaryGeneratedColumn({
      type: 'int',
   })
   id: number;

   @Column({ unique: true })
   username: string;

   @Column()
   fullname: string;

   @Column({ select: false, nullable: true })
   password!: string;

   @Column({ default: '' })
   avatar: string;

   @Column({
      type: 'enum',
      enum: ['active', 'deactive'],
      default: 'active',
   })
   status: string;

   @Column({
      default: 0,
   })
   is_admin: number;

   @Column({
      default: 0,
   })
   is_logged: number;

   @Column({
      default: '',
   })
   contract_file: string;

   @CreateDateColumn()
   created_at: Date;

   @UpdateDateColumn()
   updated_at: Date;

   constructor(
      id: number = 0,
      username: string = '',
      fullname: string = '',
      avatar: string = '',
      status: string = 'active',
      is_admin: number = 0,
      is_logged: number = 0,
      contract_file: string = ''
   ) {
      this.id = id;
      this.username = username;
      this.fullname = fullname;
      this.avatar = avatar;
      this.status = status;
      this.is_admin = is_admin;
      this.is_logged = is_logged;
      this.contract_file = contract_file;
      this.created_at = new Date();
      this.updated_at = new Date();
   }
}
