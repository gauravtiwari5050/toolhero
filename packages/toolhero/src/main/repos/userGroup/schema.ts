import { model, Schema } from 'mongoose';
import timestampsPlugin from '../timestampPlugin';
import { IUserGroupSerialized } from './UserGroup';

export const schema = new Schema<IUserGroupSerialized>({
  userId: { type: String, required: true, index: true },
  groupId: { type: String, required: true },
});

schema.plugin(timestampsPlugin);

schema.index({ specialities: 'text', languages: 'text' });
