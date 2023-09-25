import { model, Schema } from 'mongoose';
import timestampsPlugin from '../timestampPlugin';
import { IUserSerialized } from './User';

export const schema = new Schema<IUserSerialized>({
  email: { type: String, required: true, index: true },
  firstName: { type: String, required: true },
  lastName: { type: String },
  password: { type: String, required: true },
});

schema.plugin(timestampsPlugin);

schema.index({ specialities: 'text', languages: 'text' });

export const UserModel = model<IUserSerialized>('User', schema);
