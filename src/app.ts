import 'dotenv/config';
import express from 'express';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import uploadRoutes from './routes/upload.routes';
import { AppDataSource } from './utils/database';
import * as path from 'path';

const app = express();
const port = 3000;

app.use(express.json());

AppDataSource.initialize()
   .then(() => {
      console.log('Database connect succcessfully!');
   })
   .catch((error) => {
      console.log('Error connecting to database:', error);
   });
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
const uploadPath = path.join(__dirname, '..', 'src/uploads');
app.use('/uploads', express.static(uploadPath));
app.use('/api/upload', uploadRoutes);

app.listen(port, () => {
   return console.log(`Server is listening at http://localhost:${port}`);
});
