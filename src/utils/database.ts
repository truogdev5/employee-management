import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
   type: 'postgres',
   host: process.env.DB_HOST || 'localhost',
   port: Number(process.env.DB_PORT) || 5432,
   username: process.env.DB_USER || 'postgres',
   password: process.env.DB_PASSWORD || 'password',
   database: process.env.DB_NAME || 'postgres_employee_management',
   entities: [__dirname + '/../entities/*.{ts,js}'],
   synchronize: true,
   logging: false,
});
