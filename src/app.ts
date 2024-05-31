import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { SessionError } from './utils/interfaces';
import userRouter from './routes/user';
import cardRouter from './routes/card';
import auth from './middlewares/auth';

require('dotenv').config();

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://0.0.0.0:27017/mestodb');

app.use(auth);
app.use('/users', userRouter);
app.use('/cards', cardRouter);

app.use((err: SessionError, req: Request, res: Response, next: NextFunction) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'Ошибка на сервере'
        : message,
    });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
