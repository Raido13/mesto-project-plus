import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/user';
import cardRouter from './routes/card';
import auth from './middlewares/auth';
import { NotFoundError } from './errors';
import { errorLogger, requestLogger } from './middlewares/logger';
import { createUserValidation, signinValidation } from './utils/consts';
import { createUser, login } from './controllers/user';

require('dotenv').config();

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://0.0.0.0:27017/mestodb');

app.use(requestLogger);

app.post('/signup', createUserValidation, createUser);
app.post('/signin', signinValidation, login);

app.use(auth);
app.use('/users', userRouter);
app.use('/cards', cardRouter);

// app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
//   next(new NotFoundError('Страница не найдена'))
// });

app.use(errorLogger);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
