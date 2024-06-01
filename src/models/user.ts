import mongoose from 'mongoose';
import { url } from '../utils/patterns';
import { isEmail } from 'validator';

interface IUserSchema {
  name: string,
  about: string,
  avatar: string,
  email: string,
  password: string
}

const userSchema = new mongoose.Schema<IUserSchema>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто'
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 200,
    default: 'Исследователь'
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator(str: string) {
        return [ url.test(str), 'Невалидная ссылка' ]
      }
    }
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [ isEmail, 'Невалидный email' ]
  },
  password: {
    type: String,
    required: true,
    select: false
  }
});

export default mongoose.model<IUserSchema>('user', userSchema);
