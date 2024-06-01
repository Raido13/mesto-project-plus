import mongoose from 'mongoose';
import { isEmail } from 'validator';
import { url } from '../utils/patterns';

interface IUserSchema {
  [key: string]: string
}

const userSchema = new mongoose.Schema<IUserSchema>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 200,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator(str: string) {
        return [url.test(str), 'Невалидная ссылка'];
      },
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [isEmail, 'Невалидный email'],
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

export default mongoose.model<IUserSchema>('user', userSchema);
