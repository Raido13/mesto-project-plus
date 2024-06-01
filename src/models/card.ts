import mongoose, { ObjectId } from 'mongoose';
import { url } from '../utils/patterns';

interface ICard {
  name: string,
  link: string,
  createdAt: Date,
  owner: mongoose.Schema.Types.ObjectId | String,
  likes: ObjectId[],
}

const cardSchema = new mongoose.Schema<ICard>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  link: {
    type: String,
    required: true,
    validate: [ url.test, 'Невалидная ссылка' ]
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'user',
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

export default mongoose.model<ICard>('card', cardSchema);
