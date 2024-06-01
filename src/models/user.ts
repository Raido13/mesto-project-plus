import mongoose from 'mongoose';

interface IUserSchema {
  name: string,
  about: string,
  avatar: string
}

const userSchema = new mongoose.Schema<IUserSchema>({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 200,
  },
  avatar: {
    type: String,
    required: true,
  },
});

export default mongoose.model<IUserSchema>('user', userSchema);
