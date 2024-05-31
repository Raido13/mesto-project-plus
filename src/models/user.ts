import mongoose from 'mongoose';
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
    validate: [ /https?:\/\/(?:www\.|(?!www))[\w\d-\._~:\/?#\[\]@!\$&'\(\)\*\+,;=]{1,}\.[\w]{2,}#?/.test, 'Невалидная ссылка' ]
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
  }
});

export default mongoose.model<IUserSchema>('user', userSchema);
